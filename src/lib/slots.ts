/* ═══════════════════════════════════════════════════════════════════
 * Slot Management — Shared utilities for booking slot generation
 * ─────────────────────────────────────────────────────────────────
 * Generates the fixed 15-minute slot grid for morning and evening
 * windows, and provides helpers for availability checks.
 * ═══════════════════════════════════════════════════════════════════ */

import type { TimeSlot } from '@/types/booking';

export const SLOT_DURATION_MINS = 15;

/* ─── Time formatting ────────────────────────────────────────────── */

export function formatTime12h(h: number, m: number): string {
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export function formatSlotId(h: number, m: number): string {
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/* ─── Generate the canonical slot grid ───────────────────────────── */

/**
 * Morning:  6:00 AM – 8:45 AM (last slot ends at 9:00 AM)
 * Evening:  6:00 PM – 8:45 PM (last slot ends at 9:00 PM)
 */
export function buildAllSlots(): TimeSlot[] {
  const slots: TimeSlot[] = [];

  const ranges: { startHour: number; endHour: number; period: 'morning' | 'evening' }[] = [
    { startHour: 6, endHour: 9, period: 'morning' },
    { startHour: 18, endHour: 21, period: 'evening' },
  ];

  for (const { startHour, endHour, period } of ranges) {
    let h = startHour;
    let m = 0;

    while (h * 60 + m + SLOT_DURATION_MINS <= endHour * 60) {
      const endM = m + SLOT_DURATION_MINS;
      const endH = h + Math.floor(endM / 60);
      const endMin = endM % 60;

      const id = formatSlotId(h, m);
      const label = formatTime12h(h, m);
      const endLabel = formatTime12h(endH, endMin);

      slots.push({ id, label, endLabel, period });

      m += SLOT_DURATION_MINS;
      if (m >= 60) {
        h += 1;
        m -= 60;
      }
    }
  }

  return slots;
}

/** Pre-computed slot lists */
export const ALL_SLOTS = buildAllSlots();
export const MORNING_SLOTS = ALL_SLOTS.filter((s) => s.period === 'morning');
export const EVENING_SLOTS = ALL_SLOTS.filter((s) => s.period === 'evening');

/* ─── Date helpers ───────────────────────────────────────────────── */

/** Get ISO date string for a Date in IST */
export function toISTDateString(d: Date): string {
  return d.toLocaleDateString('en-CA', { timeZone: 'Asia/Kolkata' });
}

/** Returns the Monday of the week containing the given IST date */
export function getWeekStartDate(dateISO: string): string {
  const d = new Date(dateISO + 'T00:00:00+05:30');
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Monday = 1
  d.setDate(d.getDate() + diff);
  return toISTDateString(d);
}

/** Compute the end time slot id (HH:MM) given a start time id */
export function computeEndTime(startTimeId: string): string {
  const [h, m] = startTimeId.split(':').map(Number);
  const totalMins = h * 60 + m + SLOT_DURATION_MINS;
  const endH = Math.floor(totalMins / 60);
  const endM = totalMins % 60;
  return formatSlotId(endH, endM);
}

/** Build the slot key used in the `availability.bookedSlots` array */
export function buildSlotKey(dateISO: string, timeId: string): string {
  return `${dateISO}#${timeId}`;
}

/** Check whether a slot is in the past for a given date */
export function isSlotExpired(dateISO: string, slotId: string): boolean {
  const now = new Date();
  // Convert to IST
  const istNow = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
  const [h, m] = slotId.split(':').map(Number);
  const slotDate = new Date(dateISO + 'T00:00:00+05:30');
  slotDate.setHours(h, m, 0, 0);

  return slotDate.getTime() < istNow.getTime();
}

/**
 * Get the next 7 bookable days (starting from tomorrow, i.e., at least 1 day prior).
 * Returns dates in IST.
 */
export function getCurrentWeekDays(): Date[] {
  const now = new Date();
  // Current IST date
  const istDateStr = toISTDateString(now);
  const today = new Date(istDateStr + 'T00:00:00+05:30');

  const days: Date[] = [];

  // Generate 7 days starting from tomorrow (today + 1)
  for (let i = 1; i <= 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    days.push(d);
  }

  return days;
}

/**
 * Checks if a given date is valid for booking:
 * 1. Must be at least 1 day in the future (tomorrow or later in IST).
 * 2. Must be within the 7-day booking window starting from tomorrow.
 */
export function isValidBookingDate(dateISO: string): boolean {
  const now = new Date();
  const istDateStr = toISTDateString(now);
  const today = new Date(istDateStr + 'T00:00:00+05:30');

  // Tomorrow in IST
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  // End of 7-day window (tomorrow + 6 days / today + 7 days)
  const maxDate = new Date(today);
  maxDate.setDate(today.getDate() + 7);

  const checkDate = new Date(dateISO + 'T00:00:00+05:30');

  return checkDate >= tomorrow && checkDate <= maxDate;
}

/** Format a date for display */
export function formatDateLabel(d: Date): string {
  return d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

/** Format date as ISO (YYYY-MM-DD) */
export function formatDateISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
