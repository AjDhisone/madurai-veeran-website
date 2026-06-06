/* ═══════════════════════════════════════════════════════════════════
 * Email Service — Resend transactional emails
 * ─────────────────────────────────────────────────────────────────
 * Sends booking confirmations, admin notifications, and reminders.
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   EMAIL_FROM
 *   ADMIN_EMAIL
 * ═══════════════════════════════════════════════════════════════════ */

import { Resend } from 'resend';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('[email] Missing RESEND_API_KEY env variable.');
  }
  return new Resend(apiKey);
}

function getFromAddress(): string {
  return process.env.EMAIL_FROM || 'bookings@yourdomain.com';
}

function getAdminEmail(): string {
  return process.env.ADMIN_EMAIL || 'admin@yourdomain.com';
}

/* ─── Formatting helpers ─────────────────────────────────────────── */

function formatTime12h(time24: string): string {
  const [h, m] = time24.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

function formatDateReadable(dateStr: string): string {
  const d = new Date(dateStr + 'T00:00:00+05:30');
  return d.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/* ─── Confirmation Email to User ─────────────────────────────────── */

interface BookingEmailData {
  fullName: string;
  email: string;
  bookingId: string;
  consultationDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
  meetLink: string;
  amount: number;
}

export async function sendConfirmationEmail(data: BookingEmailData): Promise<void> {
  const resend = getResendClient();
  const dateFormatted = formatDateReadable(data.consultationDate);
  const timeFormatted = `${formatTime12h(data.startTime)} – ${formatTime12h(data.endTime)}`;

  await resend.emails.send({
    from: getFromAddress(),
    to: data.email,
    subject: `Booking Confirmed — ${dateFormatted}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 64px; height: 64px; background: #000; border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center;">
            <span style="color: #fff; font-size: 28px;">✓</span>
          </div>
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Booking Confirmed</h1>
        </div>

        <p style="font-size: 16px; line-height: 1.6; color: #444;">
          Hi <strong>${data.fullName.split(' ')[0]}</strong>, your consultation has been confirmed. Here are the details:
        </p>

        <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Booking ID</td><td style="padding: 8px 0; text-align: right; font-weight: 600; font-size: 14px;">${data.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Date</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${dateFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Time</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${timeFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Timezone</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.timezone}</td></tr>
            <tr><td style="padding: 8px 0; color: #888; font-size: 14px;">Amount Paid</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${data.amount}</td></tr>
          </table>
        </div>

        ${data.meetLink ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.meetLink}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Join Google Meet
          </a>
          <p style="margin-top: 12px; font-size: 13px; color: #888;">
            ${data.meetLink}
          </p>
        </div>
        ` : ''}

        <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 32px;">
          <p style="font-size: 13px; color: #999; line-height: 1.5;">
            <strong>Important:</strong> All bookings are final and non-refundable. No cancellations or rescheduling is permitted.
          </p>
        </div>
      </div>
    `,
  });
}

/* ─── Admin Notification Email ───────────────────────────────────── */

export async function sendAdminNotification(data: BookingEmailData): Promise<void> {
  const resend = getResendClient();
  const dateFormatted = formatDateReadable(data.consultationDate);
  const timeFormatted = `${formatTime12h(data.startTime)} – ${formatTime12h(data.endTime)}`;

  await resend.emails.send({
    from: getFromAddress(),
    to: getAdminEmail(),
    subject: `New Booking — ${data.fullName} on ${dateFormatted}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <h2 style="margin: 0 0 20px;">New Booking Received</h2>
        <div style="background: #f8f8f8; border-radius: 12px; padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888;">Booking ID</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.bookingId}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Name</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.fullName}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Email</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${data.email}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${dateFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${timeFormatted} IST</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Amount</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">₹${data.amount}</td></tr>
            ${data.meetLink ? `<tr><td style="padding: 8px 0; color: #888;">Meet Link</td><td style="padding: 8px 0; text-align: right;"><a href="${data.meetLink}">${data.meetLink}</a></td></tr>` : ''}
          </table>
        </div>
      </div>
    `,
  });
}

/* ─── Reminder Email ─────────────────────────────────────────────── */

interface ReminderEmailData {
  fullName: string;
  email: string;
  bookingId: string;
  consultationDate: string;
  startTime: string;
  endTime: string;
  meetLink: string;
  hoursUntil: number;   // 24 or 1
}

export async function sendReminderEmail(data: ReminderEmailData): Promise<void> {
  const resend = getResendClient();
  const dateFormatted = formatDateReadable(data.consultationDate);
  const timeFormatted = `${formatTime12h(data.startTime)} – ${formatTime12h(data.endTime)}`;
  const timeLabel = data.hoursUntil === 1 ? '1 hour' : '24 hours';

  await resend.emails.send({
    from: getFromAddress(),
    to: data.email,
    subject: `Reminder: Your consultation is in ${timeLabel}`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #1a1a1a;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="margin: 0; font-size: 22px;">⏰ Your consultation is in ${timeLabel}</h1>
        </div>

        <p style="font-size: 16px; color: #444;">
          Hi <strong>${data.fullName.split(' ')[0]}</strong>, this is a reminder for your upcoming session.
        </p>

        <div style="background: #f8f8f8; border-radius: 12px; padding: 24px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #888;">Date</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${dateFormatted}</td></tr>
            <tr><td style="padding: 8px 0; color: #888;">Time</td><td style="padding: 8px 0; text-align: right; font-weight: 600;">${timeFormatted} IST</td></tr>
          </table>
        </div>

        ${data.meetLink ? `
        <div style="text-align: center; margin: 32px 0;">
          <a href="${data.meetLink}" style="display: inline-block; background: #000; color: #fff; padding: 14px 32px; border-radius: 100px; text-decoration: none; font-weight: 600; font-size: 16px;">
            Join Google Meet
          </a>
        </div>
        ` : ''}
      </div>
    `,
  });
}
