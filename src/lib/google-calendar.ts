/* ═══════════════════════════════════════════════════════════════════
 * Google Calendar + Meet — Server-side utility
 * ─────────────────────────────────────────────────────────────────
 * Creates Google Calendar events with an auto-generated Google Meet
 * link using OAuth2 offline credentials.
 *
 * Required env vars:
 *   GOOGLE_CLIENT_ID
 *   GOOGLE_CLIENT_SECRET
 *   GOOGLE_REFRESH_TOKEN
 *   GOOGLE_CALENDAR_ID  (defaults to "primary")
 * ═══════════════════════════════════════════════════════════════════ */

import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/calendar.events'];

function getOAuth2Client() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error(
      '[google-calendar] Missing GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, or GOOGLE_REFRESH_TOKEN env vars.'
    );
  }

  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret);
  oauth2Client.setCredentials({ refresh_token: refreshToken, scope: SCOPES.join(' ') });

  return oauth2Client;
}

interface CreateMeetEventParams {
  summary: string;
  description: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM (24h, IST)
  endTime: string;     // HH:MM (24h, IST)
  attendeeEmail: string;
  attendeeName: string;
}

interface MeetEventResult {
  meetLink: string;
  calendarEventId: string;
}

/**
 * Creates a Google Calendar event with a Google Meet conference link.
 */
export async function createMeetEvent(params: CreateMeetEventParams): Promise<MeetEventResult> {
  const auth = getOAuth2Client();
  const calendar = google.calendar({ version: 'v3', auth });
  const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';

  const startDateTime = `${params.date}T${params.startTime}:00+05:30`; // IST
  const endDateTime = `${params.date}T${params.endTime}:00+05:30`;

  const event = await calendar.events.insert({
    calendarId,
    conferenceDataVersion: 1,
    requestBody: {
      summary: params.summary,
      description: params.description,
      start: {
        dateTime: startDateTime,
        timeZone: 'Asia/Kolkata',
      },
      end: {
        dateTime: endDateTime,
        timeZone: 'Asia/Kolkata',
      },
      attendees: [
        { email: params.attendeeEmail, displayName: params.attendeeName },
      ],
      conferenceData: {
        createRequest: {
          requestId: `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 60 },
          { method: 'popup', minutes: 15 },
        ],
      },
    },
  });

  const meetLink = event.data.hangoutLink || event.data.conferenceData?.entryPoints?.[0]?.uri || '';
  const calendarEventId = event.data.id || '';

  if (!meetLink) {
    console.warn('[google-calendar] Event created but no Meet link was generated:', calendarEventId);
  }

  return { meetLink, calendarEventId };
}
