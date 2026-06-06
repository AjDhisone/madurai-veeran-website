/* ═══════════════════════════════════════════════════════════════════
 * Booking Platform — Shared TypeScript Definitions
 * ═══════════════════════════════════════════════════════════════════ */

// ─── Firestore: bookings collection ─────────────────────────────────
export interface Booking {
  bookingId: string;
  fullName: string;
  email: string;
  phone: string;
  consultationDate: string;   // YYYY-MM-DD (IST)
  startTime: string;          // HH:MM (24h)
  endTime: string;            // HH:MM (24h)
  timezone: string;           // e.g. "Asia/Kolkata"
  paymentId: string;          // Razorpay payment_id
  razorpayOrderId: string;    // Razorpay order_id
  paymentStatus: PaymentStatus;
  meetLink: string;
  calendarEventId: string;
  amount: number;             // INR (paise stored in Razorpay, but we store INR here)
  bookingStatus: BookingStatus;
  createdAt: FirebaseFirestore.Timestamp | string;
  reminder24hSent: boolean;
  reminder1hSent: boolean;
}

export type PaymentStatus = 'pending' | 'captured' | 'failed' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'refund_pending';

// ─── Firestore: availability collection ─────────────────────────────
export interface Availability {
  weekStartDate: string;      // YYYY-MM-DD (Monday of the week)
  bookedSlots: string[];      // Array of "YYYY-MM-DD#HH:MM"
}

// ─── Firestore: blockedDates collection ─────────────────────────────
export interface BlockedDate {
  date: string;               // YYYY-MM-DD
  reason: string;
}

// ─── Firestore: settings collection ─────────────────────────────────
export interface BookingSettings {
  consultationPrice: number;  // INR
  bookingEnabled: boolean;
}

// ─── Razorpay API payloads ──────────────────────────────────────────
export interface CreateOrderRequest {
  fullName: string;
  email: string;
  phone: string;
  consultationDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface CreateOrderResponse {
  orderId: string;
  amount: number;             // in paise
  currency: string;
  keyId: string;
}

export interface VerifyPaymentRequest {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  fullName: string;
  email: string;
  phone: string;
  consultationDate: string;
  startTime: string;
  endTime: string;
  timezone: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  bookingId?: string;
  meetLink?: string;
  message?: string;
}

// ─── Time Slot (client-side rendering) ──────────────────────────────
export interface TimeSlot {
  id: string;               // "06:00" (24h)
  label: string;            // "6:00 AM"
  endLabel: string;         // "6:15 AM"
  period: 'morning' | 'evening';
}

// ─── Razorpay Checkout (global window type augmentation) ────────────
export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  handler: (response: RazorpayResponse) => void;
  modal?: {
    ondismiss?: () => void;
  };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
      close: () => void;
    };
  }
}
