/* ═══════════════════════════════════════════════════════════════════
 * POST /api/verify-payment
 * ─────────────────────────────────────────────────────────────────
 * Verifies Razorpay signature, then runs a Firestore transaction to:
 *   1. Re-check slot availability (prevents double-booking)
 *   2. Reserve the slot in the availability document
 *   3. Create the booking record
 *
 * After a successful transaction, creates a Google Meet event
 * and sends confirmation + admin emails.
 * ═══════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { createMeetEvent } from '@/lib/google-calendar';
import { sendConfirmationEmail, sendAdminNotification } from '@/lib/email';
import { buildSlotKey, getWeekStartDate, computeEndTime, isValidBookingDate } from '@/lib/slots';
import { FieldValue } from 'firebase-admin/firestore';
import type { VerifyPaymentRequest, Availability, BlockedDate, BookingSettings } from '@/types/booking';

function verifyRazorpaySignature(orderId: string, paymentId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) throw new Error('Missing RAZORPAY_KEY_SECRET');

  const body = `${orderId}|${paymentId}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature, 'hex'),
    Buffer.from(signature, 'hex')
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VerifyPaymentRequest;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      fullName,
      email,
      phone,
      consultationDate,
      startTime,
      endTime,
      timezone,
    } = body;

    /* ─── Validate required fields ───────────────────────────────── */
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, message: 'Missing payment details.' }, { status: 400 });
    }

    if (!fullName || !email || !consultationDate || !startTime || !timezone) {
      return NextResponse.json({ success: false, message: 'Missing booking details.' }, { status: 400 });
    }

    /* ─── Validate booking date constraints ──────────────────────── */
    if (!isValidBookingDate(consultationDate)) {
      return NextResponse.json({
        success: false,
        message: 'Bookings must be placed at least 1 day in advance and within the next 7 days.'
      }, { status: 400 });
    }

    /* ─── Verify Razorpay signature ──────────────────────────────── */
    const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);
    if (!isValid) {
      return NextResponse.json({ success: false, message: 'Payment verification failed. Invalid signature.' }, { status: 400 });
    }

    /* ─── Firestore Transaction — reserve slot + create booking ─── */
    const db = getAdminFirestore();
    const weekStart = getWeekStartDate(consultationDate);
    const slotKey = buildSlotKey(consultationDate, startTime);
    const computedEndTime = endTime || computeEndTime(startTime);
    const bookingId = `BK-${Date.now()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // Fetch settings for price
    const settingsSnap = await db.collection('settings').doc('global').get();
    const settings = settingsSnap.data() as BookingSettings | undefined;
    const amount = settings?.consultationPrice || 0;

    const availRef = db.collection('availability').doc(weekStart);
    const blockedRef = db.collection('blockedDates').doc(consultationDate);
    const bookingRef = db.collection('bookings').doc(bookingId);

    let transactionSuccess = false;

    await db.runTransaction(async (txn) => {
      /* Read phase */
      const availSnap = await txn.get(availRef);
      const blockedSnap = await txn.get(blockedRef);

      /* Check if date is blocked */
      if (blockedSnap.exists) {
        throw new Error('SLOT_UNAVAILABLE:This date has been blocked.');
      }

      /* Check if slot is already booked */
      if (availSnap.exists) {
        const avail = availSnap.data() as Availability;
        if (avail.bookedSlots?.includes(slotKey)) {
          throw new Error('SLOT_UNAVAILABLE:This slot has already been booked by someone else.');
        }
      }

      /* Write phase — reserve the slot */
      if (availSnap.exists) {
        txn.update(availRef, {
          bookedSlots: FieldValue.arrayUnion(slotKey),
        });
      } else {
        txn.set(availRef, {
          weekStartDate: weekStart,
          bookedSlots: [slotKey],
        });
      }

      /* Write the booking record */
      txn.set(bookingRef, {
        bookingId,
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        consultationDate,
        startTime,
        endTime: computedEndTime,
        timezone,
        paymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        paymentStatus: 'captured',
        meetLink: '',
        calendarEventId: '',
        amount,
        bookingStatus: 'confirmed',
        createdAt: FieldValue.serverTimestamp(),
        reminder24hSent: false,
        reminder1hSent: false,
      });

      transactionSuccess = true;
    });

    if (!transactionSuccess) {
      return NextResponse.json({
        success: false,
        message: 'Failed to reserve slot. Please contact support.',
      }, { status: 500 });
    }

    /* ─── Post-transaction: Google Meet + Emails ─────────────────── */
    let meetLink = '';
    let calendarEventId = '';

    try {
      const meetResult = await createMeetEvent({
        summary: `Consultation with ${fullName.trim()}`,
        description: `Booking ID: ${bookingId}\nName: ${fullName.trim()}\nEmail: ${email.trim()}\nPhone: ${phone}\n\n15-minute consultation session.`,
        date: consultationDate,
        startTime,
        endTime: computedEndTime,
        attendeeEmail: email.trim().toLowerCase(),
        attendeeName: fullName.trim(),
      });

      meetLink = meetResult.meetLink;
      calendarEventId = meetResult.calendarEventId;

      // Update booking with Meet info
      await db.collection('bookings').doc(bookingId).update({
        meetLink,
        calendarEventId,
      });
    } catch (meetErr) {
      console.error('[verify-payment] Google Meet creation failed (booking still valid):', meetErr);
    }

    /* ─── Send emails (non-blocking for the response) ────────────── */
    const emailData = {
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      bookingId,
      consultationDate,
      startTime,
      endTime: computedEndTime,
      timezone,
      meetLink,
      amount,
    };

    // Fire emails without awaiting (they shouldn't block the response)
    Promise.allSettled([
      sendConfirmationEmail(emailData),
      sendAdminNotification(emailData),
    ]).catch((emailErr) => {
      console.error('[verify-payment] Email sending failed:', emailErr);
    });

    return NextResponse.json({
      success: true,
      bookingId,
      meetLink,
      message: 'Booking confirmed successfully!',
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    if (message.startsWith('SLOT_UNAVAILABLE:')) {
      return NextResponse.json({
        success: false,
        message: message.replace('SLOT_UNAVAILABLE:', ''),
      }, { status: 409 });
    }

    console.error('[verify-payment] Error:', err);
    return NextResponse.json({
      success: false,
      message: 'Payment verification failed. Please contact support.',
    }, { status: 500 });
  }
}
