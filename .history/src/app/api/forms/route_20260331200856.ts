import { NextResponse } from 'next/server';
import { FieldValue } from 'firebase-admin/firestore';
import { firestoreAdmin } from '@/lib/firebase-admin';

type FormKind = 'contact' | 'meet-me' | 'consultation';

type FormRequestBody = {
  formType?: FormKind;
  name?: string;
  email?: string;
  message?: string;
};

const ALLOWED_FORM_TYPES: FormKind[] = ['contact', 'meet-me', 'consultation'];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as FormRequestBody;

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
