/* ═══════════════════════════════════════════════════════════════════
 * POST /api/admin/login
 * ─────────────────────────────────────────────────────────────────
 * Simple password-based admin authentication.
 * Compares the provided password with ADMIN_PASSWORD env var.
 * Returns a simple session token on success.
 * ═══════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ success: false, message: 'Password required.' }, { status: 400 });
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      console.error('[admin/login] ADMIN_PASSWORD env variable is not set.');
      return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
    }

    // Constant-time comparison to prevent timing attacks
    const isValid =
      password.length === adminPassword.length &&
      crypto.timingSafeEqual(Buffer.from(password), Buffer.from(adminPassword));

    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Invalid password.' }, { status: 401 });
    }

    // Generate a simple session token
    const token = crypto.randomBytes(32).toString('hex');

    return NextResponse.json({ success: true, token });
  } catch {
    return NextResponse.json({ success: false, message: 'Login failed.' }, { status: 500 });
  }
}
