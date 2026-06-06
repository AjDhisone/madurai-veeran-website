/* ═══════════════════════════════════════════════════════════════════
 * POST /api/create-order
 * ─────────────────────────────────────────────────────────────────
 * Creates a Razorpay order. Does NOT create a booking record —
 * that only happens after payment verification.
 *
 * Body: { fullName, email, phone, consultationDate, startTime, endTime, timezone }
 * Returns: { orderId, amount, currency, keyId }
 * ═══════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { buildSlotKey, getWeekStartDate, isValidBookingDate } from '@/lib/slots';
import type { CreateOrderRequest, BookingSettings, Availability, BlockedDate } from '@/types/booking';

export async function POST(req: NextRequest) {
  try {
    /* ─── Parse & validate input ─────────────────────────────────── */
    const body = (await req.json()) as CreateOrderRequest;
    const { fullName, email, phone, consultationDate, startTime, endTime, timezone } = body;

    if (!fullName?.trim() || !email?.trim() || !phone?.trim() || !consultationDate || !startTime || !endTime || !timezone) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    // Basic email format check
    if (!email.includes('@') || !email.includes('.')) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Basic phone format check (at least 10 digits)
    const phoneDigits = phone.replace(/\D/g, '');
    if (phoneDigits.length < 10) {
      return NextResponse.json({ error: 'Invalid phone number.' }, { status: 400 });
    }

    /* ─── Check global settings ──────────────────────────────────── */
    const db = getAdminFirestore();
    const settingsDoc = await db.collection('settings').doc('global').get();
    const settings = settingsDoc.data() as BookingSettings | undefined;

    if (!settings?.bookingEnabled) {
      return NextResponse.json({ error: 'Bookings are currently disabled.' }, { status: 403 });
    }

    const priceINR = settings.consultationPrice;
    if (!priceINR || priceINR <= 0) {
      return NextResponse.json({ error: 'Invalid consultation price configuration.' }, { status: 500 });
    }

    /* ─── Validate booking date constraints ──────────────────────── */
    if (!isValidBookingDate(consultationDate)) {
      return NextResponse.json({
        error: 'Bookings must be placed at least 1 day in advance and within the next 7 days.'
      }, { status: 400 });
    }

    /* ─── Check if the date is blocked ───────────────────────────── */
    const blockedDoc = await db.collection('blockedDates').doc(consultationDate).get();
    if (blockedDoc.exists) {
      const blocked = blockedDoc.data() as BlockedDate;
      return NextResponse.json({ error: `This date is unavailable: ${blocked.reason || 'Blocked'}` }, { status: 409 });
    }

    /* ─── Check if the slot is already booked ────────────────────── */
    const weekStart = getWeekStartDate(consultationDate);
    const availDoc = await db.collection('availability').doc(weekStart).get();
    const slotKey = buildSlotKey(consultationDate, startTime);

    if (availDoc.exists) {
      const avail = availDoc.data() as Availability;
      if (avail.bookedSlots?.includes(slotKey)) {
        return NextResponse.json({ error: 'This slot is already booked.' }, { status: 409 });
      }
    }

    /* ─── Create Razorpay order ──────────────────────────────────── */
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({
        error: 'Razorpay environment variables (RAZORPAY_KEY_ID and/or RAZORPAY_KEY_SECRET) are missing. Please add them to your .env.local file.'
      }, { status: 500 });
    }

    const rzp = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const order = await rzp.orders.create({
      amount: priceINR * 100, // Razorpay expects paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        fullName,
        email,
        phone,
        consultationDate,
        startTime,
        endTime,
        timezone,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    });
  } catch (err) {
    console.error('[create-order] Error:', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: `Failed to create order: ${errorMessage}` }, { status: 500 });
  }
}
