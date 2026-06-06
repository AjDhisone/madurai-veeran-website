/* ═══════════════════════════════════════════════════════════════════
 * GET /api/cron/reminders
 * ─────────────────────────────────────────────────────────────────
 * Called by Vercel Cron (or manually). Sends reminder emails
 * for bookings due in the next 24 hours and 1 hour.
 *
 * Secured by CRON_SECRET header check.
 * ═══════════════════════════════════════════════════════════════════ */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminFirestore } from '@/lib/firebase-admin';
import { sendReminderEmail } from '@/lib/email';
import type { Booking } from '@/types/booking';

export async function GET(req: NextRequest) {
  /* ─── Security check ───────────────────────────────────────────── */
  const authHeader = req.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getAdminFirestore();
    const nowIST = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
    
    // Get today's and tomorrow's date strings in IST
    const todayStr = formatISTDate(nowIST);
    const tomorrow = new Date(nowIST);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = formatISTDate(tomorrow);

    // Query confirmed bookings for today and tomorrow
    const bookingsSnap = await db
      .collection('bookings')
      .where('bookingStatus', '==', 'confirmed')
      .where('consultationDate', 'in', [todayStr, tomorrowStr])
      .get();

    let sent24h = 0;
    let sent1h = 0;

    for (const doc of bookingsSnap.docs) {
      const booking = doc.data() as Booking;

      // Build the slot datetime in IST
      const slotDateTime = new Date(
        `${booking.consultationDate}T${booking.startTime}:00+05:30`
      );
      const diffMs = slotDateTime.getTime() - Date.now();
      const diffHours = diffMs / (1000 * 60 * 60);

      const reminderData = {
        fullName: booking.fullName,
        email: booking.email,
        bookingId: booking.bookingId,
        consultationDate: booking.consultationDate,
        startTime: booking.startTime,
        endTime: booking.endTime,
        meetLink: booking.meetLink,
      };

      // 24-hour reminder: send when 20–25 hours away
      if (!booking.reminder24hSent && diffHours > 20 && diffHours <= 25) {
        try {
          await sendReminderEmail({ ...reminderData, hoursUntil: 24 });
          await doc.ref.update({ reminder24hSent: true });
          sent24h++;
        } catch (emailErr) {
          console.error(`[reminders] Failed 24h reminder for ${booking.bookingId}:`, emailErr);
        }
      }

      // 1-hour reminder: send when 0.5–1.5 hours away
      if (!booking.reminder1hSent && diffHours > 0.5 && diffHours <= 1.5) {
        try {
          await sendReminderEmail({ ...reminderData, hoursUntil: 1 });
          await doc.ref.update({ reminder1hSent: true });
          sent1h++;
        } catch (emailErr) {
          console.error(`[reminders] Failed 1h reminder for ${booking.bookingId}:`, emailErr);
        }
      }
    }

    return NextResponse.json({
      success: true,
      processed: bookingsSnap.docs.length,
      sent24h,
      sent1h,
    });
  } catch (err) {
    console.error('[cron/reminders] Error:', err);
    return NextResponse.json({ error: 'Reminder cron failed.' }, { status: 500 });
  }
}

function formatISTDate(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
