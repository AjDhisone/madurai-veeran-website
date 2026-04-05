import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { getFirestoreAdmin } from '@/lib/firebase-admin';

type FormKind = 'contact' | 'meet-me' | 'consultation';

type FormRequestBody = {
  formType?: FormKind;
  name?: string;
  email?: string;
  message?: string;
  turnstileToken?: string;
};

const ALLOWED_FORM_TYPES: FormKind[] = ['contact', 'meet-me', 'consultation'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 10;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const globalRateLimitStore = globalThis as typeof globalThis & {
  __formRateLimitStore?: Map<string, RateLimitEntry>;
};

const rateLimitStore =
  globalRateLimitStore.__formRateLimitStore ??
  (globalRateLimitStore.__formRateLimitStore = new Map<string, RateLimitEntry>());

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function getClientIp(request: Request) {
  const forwardedFor =
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for') ||
    request.headers.get('x-real-ip') ||
    '';

  return forwardedFor.split(',')[0]?.trim() || 'unknown';
}

function checkRateLimit(clientIp: string) {
  const now = Date.now();
  const entry = rateLimitStore.get(clientIp);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientIp, {
      count: 1,
      resetAt: now + RATE_LIMIT_WINDOW_MS,
    });

    return { limited: false, retryAfterSeconds: 0 };
  }

  if (entry.count >= RATE_LIMIT_MAX_REQUESTS) {
    return {
      limited: true,
      retryAfterSeconds: Math.max(1, Math.ceil((entry.resetAt - now) / 1000)),
    };
  }

  entry.count += 1;
  return { limited: false, retryAfterSeconds: 0 };
}

async function verifyTurnstileToken(token: string, clientIp: string) {
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not configured.');
    return false;
  }

  const payload = new URLSearchParams();
  payload.append('secret', secretKey);
  payload.append('response', token);

  if (clientIp !== 'unknown') {
    payload.append('remoteip', clientIp);
  }

  const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: payload.toString(),
    cache: 'no-store',
  });

  if (!response.ok) {
    return false;
  }

  const result = (await response.json()) as {
    success?: boolean;
    'error-codes'?: string[];
  };

  return Boolean(result.success);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FormRequestBody;
    const clientIp = getClientIp(request);
    const rateLimitState = checkRateLimit(clientIp);

    if (rateLimitState.limited) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again shortly.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimitState.retryAfterSeconds),
          },
        },
      );
    }

    if (!body.formType || !ALLOWED_FORM_TYPES.includes(body.formType)) {
      return NextResponse.json({ error: 'Invalid form type.' }, { status: 400 });
    }

    const name = normalize(body.name);
    const email = normalize(body.email).toLowerCase();
    const message = normalize(body.message);

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    if ((body.formType === 'contact' || body.formType === 'meet-me') && !message) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    const turnstileToken = normalize(body.turnstileToken);

    if (!turnstileToken) {
      return NextResponse.json(
        { error: 'Verification challenge is required.' },
        { status: 400 },
      );
    }

    const isTurnstileValid = await verifyTurnstileToken(turnstileToken, clientIp);

    if (!isTurnstileValid) {
      return NextResponse.json(
        { error: 'Verification failed. Please try again.' },
        { status: 400 },
      );
    }

    const firestoreAdmin = getFirestoreAdmin();

    await firestoreAdmin.collection('form_submissions').add({
      formType: body.formType,
      name,
      email,
      message: message || null,
      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (error) {
    console.error('Error saving form submission:', error);

    return NextResponse.json(
      { error: 'Unable to submit your request right now. Please try again.' },
      { status: 500 },
    );
  }
}
