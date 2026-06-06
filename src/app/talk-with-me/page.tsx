"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Navbar from '@/components/Navbar';
import {
  ALL_SLOTS,
  MORNING_SLOTS,
  EVENING_SLOTS,
  SLOT_DURATION_MINS,
  getCurrentWeekDays,
  formatDateLabel,
  formatDateISO,
  isSlotExpired,
  buildSlotKey,
} from '@/lib/slots';
import { getFirestoreClient } from '@/lib/firebase-client';
import { collection, doc, getDoc, getDocs } from 'firebase/firestore';
import type { TimeSlot, BookingSettings, Availability, BlockedDate, RazorpayResponse } from '@/types/booking';

/* ═══════════════════════ CONSTANTS ═══════════════════════ */
const DISCLAIMER_TEXT_EN = `This is just an online meeting for people who want to speak with me personally and hear about my experiences and opinions. I am not a SEBI-registered financial advisor or investment consultant.

Anything shared during the call is only based on my personal experience, knowledge, and views. Please do not treat any discussion, suggestion, or opinion as professional financial or investment advice.

Before making any investment or financial decision, do your own proper research and consult a qualified financial advisor if needed.

By joining this call, you understand and agree that this session is only for interaction, discussion, and educational purposes.`;

const DISCLAIMER_TEXT_TA = `இது என்னுடன் நேரடியாக பேசவும், என் அனுபவங்கள் மற்றும் கருத்துகளை கேட்கவும் விரும்பும் மக்களுக்கான ஒரு ஆன்லைன் சந்திப்பு மட்டுமே. நான் SEBI-யில் பதிவு செய்யப்பட்ட நிதி ஆலோசகர் அல்லது முதலீட்டு ஆலோசகர் அல்ல. இந்த அழைப்பின் போது பகிரப்படும் எந்த விஷயமும் என் தனிப்பட்ட அனுபவம், அறிவு மற்றும் கருத்துக்களை மட்டுமே அடிப்படையாகக் கொண்டது.

இந்த கலந்துரையாடலில் பகிரப்படும் எந்த கருத்தையும், ஆலோசனையையும் அல்லது பரிந்துரையையும் தொழில்முறை நிதி அல்லது முதலீட்டு ஆலோசனையாக கருத வேண்டாம். எந்த முதலீட்டு அல்லது நிதி தொடர்பான முடிவையும் எடுப்பதற்கு முன், தயவுசெய்து உங்கள் சொந்த ஆராய்ச்சியைச் செய்யவும் மற்றும் தேவையானால் தகுதியான நிதி ஆலோசகரை அணுகவும்.

இந்த அழைப்பில் கலந்து கொள்வதன் மூலம், இது தொடர்பு, கலந்துரையாடல் மற்றும் கல்வி நோக்கங்களுக்காக மட்டுமே நடத்தப்படும் ஒரு அமர்வு என்பதை நீங்கள் புரிந்துகொண்டு ஒப்புக்கொள்கிறீர்கள்.`;

const REQUIRED_PHRASE = 'I understand and agree';

/* ═══════════════════════ COMPONENT ═══════════════════════ */

const TalkWithMePage = () => {
  /* ─── State ───────────────────────────────────────────────────── */
  const [step, setStep] = useState(1);
  const [agreementInput, setAgreementInput] = useState('');
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  // Firestore state
  const [settings, setSettings] = useState<BookingSettings | null>(null);
  const [bookedSlots, setBookedSlots] = useState<Set<string>>(new Set());
  const [blockedDates, setBlockedDates] = useState<Set<string>>(new Set());
  const [loadingData, setLoadingData] = useState(true);

  // Payment state
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);

  // Confirmation state
  const [bookingResult, setBookingResult] = useState<{
    bookingId: string;
    meetLink: string;
  } | null>(null);

  // Timezone
  const [userTimezone] = useState(() => Intl.DateTimeFormat().resolvedOptions().timeZone);

  /* ─── Derived ────────────────────────────────────────────────── */
  const isAgreed = agreementInput.trim().toLowerCase() === REQUIRED_PHRASE.toLowerCase();
  const isStep2Valid = formData.name.trim().length > 0 && formData.email.trim().includes('@') && formData.phone.replace(/\D/g, '').length >= 10;
  const selectedSlotMeta = ALL_SLOTS.find((s) => s.id === selectedTime);
  const priceDisplay = settings ? `₹${settings.consultationPrice}` : '...';

  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, 5)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  const weekDays = useMemo(() => getCurrentWeekDays(), []);

  /* ─── Load Firestore data ────────────────────────────────────── */
  useEffect(() => {
    async function loadData() {
      setLoadingData(true);
      try {
        const db = getFirestoreClient();
        if (!db) return;

        // Load settings
        const settingsSnap = await getDoc(doc(db, 'settings', 'global'));
        if (settingsSnap.exists()) {
          setSettings(settingsSnap.data() as BookingSettings);
        }

        // Load availability (booked slots)
        const availSnap = await getDocs(collection(db, 'availability'));
        const allBooked = new Set<string>();
        availSnap.forEach((d) => {
          const data = d.data() as Availability;
          data.bookedSlots?.forEach((s) => allBooked.add(s));
        });
        setBookedSlots(allBooked);

        // Load blocked dates
        const blockedSnap = await getDocs(collection(db, 'blockedDates'));
        const blocked = new Set<string>();
        blockedSnap.forEach((d) => {
          const data = d.data() as BlockedDate;
          blocked.add(data.date);
        });
        setBlockedDates(blocked);
      } catch (err) {
        console.error('[talk-with-me] Error loading data:', err);
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, []);

  /* ─── Load Razorpay script ──────────────────────────────────── */
  useEffect(() => {
    if (document.getElementById('razorpay-script')) return;
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  /* ─── Enter-key shortcuts ───────────────────────────────────── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter') return;
      if (step === 1 && isAgreed) { e.preventDefault(); nextStep(); }
      else if (step === 2 && isStep2Valid) { e.preventDefault(); nextStep(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, isAgreed, isStep2Valid, nextStep]);

  /* ─── Payment flow ──────────────────────────────────────────── */
  const handleBookNow = async () => {
    if (!selectedDate || !selectedTime || !agreedToPolicy) return;
    setSubmitError('');
    setIsProcessing(true);

    const slot = ALL_SLOTS.find((s) => s.id === selectedTime);
    if (!slot) return;

    try {
      /* Step 1: Create Razorpay order */
      const orderRes = await fetch('/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          phone: formData.phone.trim(),
          consultationDate: selectedDate,
          startTime: selectedTime,
          endTime: slot.endLabel.replace(/\s/g, ''), // We'll compute on server
          timezone: userTimezone,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        setSubmitError(orderData.error || 'Failed to create payment order.');
        setIsProcessing(false);
        return;
      }

      /* Step 2: Open Razorpay checkout */
      if (typeof window.Razorpay === 'undefined') {
        setSubmitError('Payment gateway is loading. Please try again.');
        setIsProcessing(false);
        return;
      }

      const rzp = new window.Razorpay({
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Madurai Veeran',
        description: `${SLOT_DURATION_MINS}-min Consultation`,
        order_id: orderData.orderId,
        prefill: {
          name: formData.name.trim(),
          email: formData.email.trim(),
          contact: formData.phone.trim(),
        },
        theme: { color: '#000000' },
        handler: async (response: RazorpayResponse) => {
          /* Step 3: Verify payment on server */
          try {
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                fullName: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                phone: formData.phone.trim(),
                consultationDate: selectedDate,
                startTime: selectedTime,
                endTime: slot.endLabel.replace(/\s/g, ''),
                timezone: userTimezone,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              // Mark slot as booked locally
              setBookedSlots((prev) => {
                const next = new Set(prev);
                next.add(buildSlotKey(selectedDate, selectedTime));
                return next;
              });
              setBookingResult({
                bookingId: verifyData.bookingId,
                meetLink: verifyData.meetLink,
              });
              setStep(5); // Confirmation step
            } else {
              setSubmitError(verifyData.message || 'Booking failed after payment. Please contact support.');
            }
          } catch {
            setSubmitError('Network error verifying payment. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
          },
        },
      });

      rzp.open();
    } catch {
      setSubmitError('Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  /* ─── Render helpers ────────────────────────────────────────── */
  const renderSlotButton = (slot: TimeSlot) => {
    const slotKey = buildSlotKey(selectedDate, slot.id);
    const booked = bookedSlots.has(slotKey);
    const past = isSlotExpired(selectedDate, slot.id);
    const disabled = booked || past;
    const active = selectedTime === slot.id;

    return (
      <button
        key={slot.id}
        onClick={() => { if (!disabled) setSelectedTime(slot.id); }}
        disabled={disabled}
        className={`twm-time-btn ${active ? 'twm-time-btn--active' : ''} ${disabled ? 'twm-time-btn--disabled' : ''}`}
        title={booked ? 'Already booked' : past ? 'Past slot' : `${slot.label} – ${slot.endLabel} (${SLOT_DURATION_MINS} min)`}
      >
        <span className="twm-time-btn-label">{slot.label}</span>
        {disabled && <span className="twm-time-btn-tag">{booked ? 'Booked' : 'Past'}</span>}
      </button>
    );
  };

  /* ─── Shared styles ─────────────────────────────────────────── */
  const inputStyle: React.CSSProperties = {
    width: '100%', background: 'transparent', border: 'none',
    borderBottom: '1px solid #333', color: '#fff', fontSize: '1.25rem',
    padding: '0.75rem 0', outline: 'none', transition: 'border-color 0.3s',
  };

  const btnPrimary = (enabled: boolean): React.CSSProperties => ({
    background: enabled ? '#fff' : 'transparent',
    color: enabled ? '#000' : '#555',
    border: enabled ? 'none' : '1px solid #333',
    fontSize: '1.1rem', fontWeight: 600,
    padding: '0.75rem 2.2rem',
    cursor: enabled ? 'pointer' : 'default',
    borderRadius: '100px',
    opacity: enabled ? 1 : 0.45,
    transition: 'all 0.3s ease',
  });

  const btnSecondary: React.CSSProperties = {
    background: 'transparent', color: '#888', border: 'none',
    fontSize: '1rem', cursor: 'pointer',
  };

  const stepDots = (
    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem' }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <div
          key={s}
          style={{
            width: s === step ? '2rem' : '0.5rem', height: '0.5rem',
            borderRadius: '100px',
            background: s === step ? '#fff' : s < step ? '#666' : '#333',
            transition: 'all 0.4s ease',
          }}
        />
      ))}
    </div>
  );

  /* ═══════════════════════ JSX ═══════════════════════ */
  return (
    <div className="page-wrapper" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <section
          className="section_talk-with-me"
          style={{ width: '100%', padding: '0 5%', minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <div className="container-large" style={{ maxWidth: '820px', width: '100%', margin: '0 auto' }}>
            <div style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>

              {/* Loading state */}
              {loadingData && step === 1 && (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                  <div style={{ width: '2rem', height: '2rem', border: '2px solid #333', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 1rem' }} />
                  <p style={{ color: '#888' }}>Loading booking data...</p>
                  <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
                </div>
              )}

              {/* Bookings disabled */}
              {!loadingData && settings && !settings.bookingEnabled && (
                <div className="twm-step" style={{ textAlign: 'center', animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  <h1 className="twm-heading">Bookings Paused</h1>
                  <p className="twm-subtext">Consultations are currently not available. Please check back later.</p>
                </div>
              )}

              {/* ═════ STEP 1 — Disclaimer ═════ */}
              {!loadingData && (!settings || settings.bookingEnabled) && step === 1 && (
                <div className="twm-step" style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  {stepDots}
                  <h1 className="twm-heading">Before we talk…</h1>
                  <p className="twm-subtext" style={{ marginBottom: '2rem' }}>
                    Please read the terms carefully.
                  </p>

                  {/* Disclaimer */}
                  <div className="twm-disclaimer">
                    <div className="twm-disclaimer-header">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                      </svg>
                      <span>Disclaimer / பொறுப்புத்துறப்பு</span>
                    </div>
                    <div className="twm-disclaimer-body">
                      <div className="twm-disclaimer-section">
                        <h4 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>English</h4>
                        {DISCLAIMER_TEXT_EN.split('\n\n').map((para, idx) => (
                          <p key={idx} className="twm-disclaimer-text" style={{ marginBottom: '1rem' }}>{para}</p>
                        ))}
                      </div>
                      <div style={{ margin: '1.5rem 0', borderTop: '1px dashed #222' }} />
                      <div className="twm-disclaimer-section">
                        <h4 style={{ fontSize: '0.85rem', color: '#888', textTransform: 'uppercase', marginBottom: '0.5rem', fontWeight: 600 }}>தமிழ்</h4>
                        {DISCLAIMER_TEXT_TA.split('\n\n').map((para, idx) => (
                          <p key={idx} className="twm-disclaimer-text" style={{ marginBottom: '1rem' }}>{para}</p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div style={{ marginTop: '2rem' }}>
                    <label className="twm-label">
                      Type <span style={{ color: '#fff', fontWeight: 600 }}>&quot;{REQUIRED_PHRASE}&quot;</span> to continue
                    </label>
                    <div style={{ position: 'relative' }}>
                      <input
                        type="text"
                        id="agreement-input"
                        value={agreementInput}
                        onChange={(e) => setAgreementInput(e.target.value)}
                        placeholder={REQUIRED_PHRASE}
                        autoComplete="off"
                        style={{
                          ...inputStyle,
                          borderBottomColor: isAgreed ? '#4ade80' : agreementInput.length > 0 ? '#ff6b6b' : '#333',
                        }}
                        onFocus={(e) => { if (!isAgreed) e.target.style.borderBottomColor = '#666'; }}
                        onBlur={(e) => { e.target.style.borderBottomColor = isAgreed ? '#4ade80' : agreementInput.length > 0 ? '#ff6b6b' : '#333'; }}
                      />
                      {isAgreed && (
                        <span style={{
                          position: 'absolute', right: 0, top: '50%',
                          transform: 'translateY(-50%)', color: '#4ade80',
                          fontSize: '1.5rem', animation: 'slideUp 0.3s ease forwards',
                        }}>✓</span>
                      )}
                    </div>
                    {agreementInput.length > 0 && !isAgreed && (
                      <p style={{ color: '#ff6b6b', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                        Please type the phrase exactly as shown above.
                      </p>
                    )}
                  </div>

                  <div style={{ marginTop: '3rem' }}>
                    <button onClick={nextStep} disabled={!isAgreed} style={btnPrimary(isAgreed)}>
                      I Agree — Continue
                    </button>
                  </div>
                </div>
              )}

              {/* ═════ STEP 2 — Name, Email & Phone ═════ */}
              {step === 2 && (
                <div className="twm-step" style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  {stepDots}
                  <h1 className="twm-heading">Let&#39;s get to know you</h1>
                  <p className="twm-subtext" style={{ marginBottom: '2.5rem' }}>
                    Your details are safe and will only be used for scheduling.
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div>
                      <label className="twm-label">Full Name</label>
                      <input type="text" name="name" id="name-input" value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Type your full name here..." autoFocus style={inputStyle}
                        onFocus={(e) => (e.target.style.borderBottomColor = '#fff')}
                        onBlur={(e) => (e.target.style.borderBottomColor = '#333')} />
                    </div>
                    <div>
                      <label className="twm-label">Email</label>
                      <input type="email" name="email" id="email-input" value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="name@example.com" style={inputStyle}
                        onFocus={(e) => (e.target.style.borderBottomColor = '#fff')}
                        onBlur={(e) => (e.target.style.borderBottomColor = '#333')} />
                    </div>
                    <div>
                      <label className="twm-label">Phone Number</label>
                      <input type="tel" name="phone" id="phone-input" value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210" style={inputStyle}
                        onFocus={(e) => (e.target.style.borderBottomColor = '#fff')}
                        onBlur={(e) => (e.target.style.borderBottomColor = '#333')} />
                    </div>
                  </div>

                  <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={prevStep} style={btnSecondary}>← Back</button>
                    <button onClick={nextStep} disabled={!isStep2Valid} style={btnPrimary(isStep2Valid)}>Next</button>
                  </div>
                </div>
              )}

              {/* ═════ STEP 3 — Date & Time ═════ */}
              {step === 3 && (
                <div className="twm-step" style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  {stepDots}
                  <h1 className="twm-heading">Pick a time to talk</h1>
                  <p className="twm-subtext" style={{ marginBottom: '0.5rem' }}>
                    Choose a date and a {SLOT_DURATION_MINS}-minute slot. All times are in IST.
                  </p>

                  {/* Duration + Price badges */}
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.5rem', alignItems: 'center' }}>
                    <div className="twm-duration-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                      </svg>
                      <span>{SLOT_DURATION_MINS} min session &nbsp;·&nbsp; Google Meet</span>
                    </div>
                    <div className="twm-price-badge-highlight" style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(34, 197, 94, 0.25) 100%)',
                      border: '1px solid rgba(74, 222, 128, 0.4)',
                      borderRadius: '100px',
                      padding: '0.5rem 1.25rem',
                      fontSize: '0.95rem',
                      color: '#4ade80',
                      fontWeight: '700',
                      textShadow: '0 0 10px rgba(74, 222, 128, 0.2)',
                      boxShadow: '0 4px 15px rgba(34, 197, 94, 0.1)',
                    }}>
                      <span>💰 {priceDisplay} (Two Thousand Rupees)</span>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1.5rem' }}>
                    🌐 Your timezone: <span style={{ color: '#aaa' }}>{userTimezone}</span>
                  </p>

                  <div className="twm-dates-scroll">
                    {weekDays.map((d) => {
                      const iso = formatDateISO(d);
                      const isBlocked = blockedDates.has(iso);
                      const isSelected = selectedDate === iso;
                      const dayName = d.toLocaleDateString('en-IN', { weekday: 'short' });
                      const dayNum = d.getDate();
                      const monthName = d.toLocaleDateString('en-IN', { month: 'short' });
                      return (
                        <button
                          key={iso}
                          onClick={() => { if (!isBlocked) { setSelectedDate(iso); setSelectedTime(''); } }}
                          disabled={isBlocked}
                          className={`twm-date-card ${isSelected ? 'twm-date-card--active' : ''} ${isBlocked ? 'twm-date-card--blocked' : ''}`}
                          title={isBlocked ? 'Date blocked' : `${dayName}, ${monthName} ${dayNum}`}
                        >
                          <span className="twm-date-day">{dayName}</span>
                          <span className="twm-date-num">{dayNum}</span>
                          <span className="twm-date-month">{monthName}</span>
                          {isBlocked && <span style={{ fontSize: '0.65rem', color: '#ff6b6b', marginTop: '0.25rem' }}>Blocked</span>}
                        </button>
                      );
                    })}
                  </div>

                  {/* No days message */}
                  {weekDays.length === 0 && (
                    <p style={{ color: '#888', textAlign: 'center', marginTop: '2rem' }}>
                      No available dates this week. Please check back next week.
                    </p>
                  )}

                  {/* Time slots */}
                  {selectedDate && (
                    <div style={{ marginTop: '2rem', animation: 'slideUp 0.4s ease forwards' }}>
                      <h3 style={{ fontSize: '1rem', fontWeight: 500, color: '#aaa', marginBottom: '1rem' }}>
                        {formatDateLabel(new Date(selectedDate + 'T00:00:00'))}
                      </h3>

                      <div style={{ marginBottom: '1.5rem' }}>
                        <p className="twm-slot-label">☀️ Morning &nbsp;<span style={{ color: '#555', fontWeight: 400 }}>6:00 – 9:00 AM</span></p>
                        <div className="twm-time-grid">
                          {MORNING_SLOTS.map(renderSlotButton)}
                        </div>
                      </div>

                      <div>
                        <p className="twm-slot-label">🌙 Evening &nbsp;<span style={{ color: '#555', fontWeight: 400 }}>6:00 – 9:00 PM</span></p>
                        <div className="twm-time-grid">
                          {EVENING_SLOTS.map(renderSlotButton)}
                        </div>
                      </div>

                      {/* Selected slot summary */}
                      {selectedSlotMeta && (
                        <div className="twm-slot-selected-bar" style={{ animation: 'slideUp 0.3s ease forwards' }}>
                          <span>🗓️ {formatDateLabel(new Date(selectedDate + 'T00:00:00'))}</span>
                          <span style={{ color: '#fff', fontWeight: 600 }}>
                            {selectedSlotMeta.label} – {selectedSlotMeta.endLabel}
                          </span>
                          <span style={{ color: '#4ade80' }}>{SLOT_DURATION_MINS} min</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={prevStep} style={btnSecondary}>← Back</button>
                    <button
                      onClick={nextStep}
                      disabled={!selectedDate || !selectedTime}
                      style={btnPrimary(!!(selectedDate && selectedTime))}
                    >
                      Next — Review
                    </button>
                  </div>
                </div>
              )}

              {/* ═════ STEP 4 — Review & Pay ═════ */}
              {step === 4 && (
                <div className="twm-step" style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  {stepDots}
                  <h1 className="twm-heading">Review & Pay</h1>
                  <p className="twm-subtext" style={{ marginBottom: '2rem' }}>
                    Please confirm your booking details below.
                  </p>

                  <div className="twm-summary-card">
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Name</span>
                      <span className="twm-summary-value">{formData.name}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Email</span>
                      <span className="twm-summary-value">{formData.email}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Phone</span>
                      <span className="twm-summary-value">{formData.phone}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Date</span>
                      <span className="twm-summary-value">
                        {selectedDate ? formatDateLabel(new Date(selectedDate + 'T00:00:00')) : ''}
                      </span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Time</span>
                      <span className="twm-summary-value">
                        {selectedSlotMeta ? `${selectedSlotMeta.label} – ${selectedSlotMeta.endLabel}` : selectedTime} IST
                      </span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Duration</span>
                      <span className="twm-summary-value">{SLOT_DURATION_MINS} minutes</span>
                    </div>
                    <div className="twm-summary-row" style={{ borderTop: '1px solid #222', paddingTop: '1rem', marginTop: '0.5rem' }}>
                      <span className="twm-summary-label" style={{ fontSize: '1.1rem', fontWeight: 600 }}>Total</span>
                      <span className="twm-summary-value" style={{ fontSize: '1.3rem', fontWeight: 700, color: '#4ade80' }}>
                        {priceDisplay}
                      </span>
                    </div>
                  </div>

                  {/* Policy notices */}
                  <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                      <span style={{ color: '#ff6b6b' }}>✕</span>
                      <span>No Refund</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                      <span style={{ color: '#ff6b6b' }}>✕</span>
                      <span>No Cancellation</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#888' }}>
                      <span style={{ color: '#ff6b6b' }}>✕</span>
                      <span>No Reschedule</span>
                    </div>
                  </div>

                  {/* Required checkbox */}
                  <label style={{
                    display: 'flex', alignItems: 'flex-start', gap: '0.75rem',
                    marginTop: '1.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#ccc',
                    lineHeight: 1.5,
                  }}>
                    <input
                      type="checkbox"
                      checked={agreedToPolicy}
                      onChange={(e) => setAgreedToPolicy(e.target.checked)}
                      style={{ marginTop: '0.25rem', accentColor: '#4ade80', width: '1.1rem', height: '1.1rem', flexShrink: 0 }}
                    />
                    <span>I understand that all bookings are final and non-refundable.</span>
                  </label>

                  {submitError && (
                    <p style={{ marginTop: '1rem', color: '#ff6b6b', fontSize: '0.9rem' }}>{submitError}</p>
                  )}

                  <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button onClick={prevStep} disabled={isProcessing} style={btnSecondary}>← Back</button>
                    <button
                      onClick={handleBookNow}
                      disabled={!agreedToPolicy || isProcessing}
                      style={btnPrimary(agreedToPolicy && !isProcessing)}
                    >
                      {isProcessing ? 'Processing…' : `Pay ${priceDisplay} & Book`}
                    </button>
                  </div>
                </div>
              )}

              {/* ═════ STEP 5 — Confirmation ═════ */}
              {step === 5 && bookingResult && (
                <div className="twm-step" style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards', textAlign: 'center' }}>
                  {stepDots}

                  <div className="twm-success-icon">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  </div>

                  <h1 className="twm-heading" style={{ marginTop: '1.5rem' }}>You&#39;re all set!</h1>
                  <p className="twm-subtext" style={{ marginBottom: '2rem' }}>
                    Thanks {formData.name.split(' ')[0] || 'there'}, your {SLOT_DURATION_MINS}-minute session has been booked and paid.
                  </p>

                  <div className="twm-summary-card">
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Booking ID</span>
                      <span className="twm-summary-value" style={{ fontSize: '0.85rem', fontFamily: 'monospace' }}>{bookingResult.bookingId}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Name</span>
                      <span className="twm-summary-value">{formData.name}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Email</span>
                      <span className="twm-summary-value">{formData.email}</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Date</span>
                      <span className="twm-summary-value">
                        {selectedDate ? formatDateLabel(new Date(selectedDate + 'T00:00:00')) : ''}
                      </span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Time</span>
                      <span className="twm-summary-value">
                        {selectedSlotMeta ? `${selectedSlotMeta.label} – ${selectedSlotMeta.endLabel}` : selectedTime} IST
                      </span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Duration</span>
                      <span className="twm-summary-value">{SLOT_DURATION_MINS} minutes</span>
                    </div>
                    <div className="twm-summary-row">
                      <span className="twm-summary-label">Amount Paid</span>
                      <span className="twm-summary-value" style={{ color: '#4ade80', fontWeight: 600 }}>{priceDisplay}</span>
                    </div>
                  </div>

                  {bookingResult.meetLink && (
                    <div style={{ marginTop: '1.5rem' }}>
                      <a
                        href={bookingResult.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-block', background: '#fff', color: '#000',
                          padding: '0.85rem 2rem', borderRadius: '100px',
                          textDecoration: 'none', fontWeight: 600, fontSize: '1rem',
                          transition: 'all 0.3s ease',
                        }}
                      >
                        🎥 Join Google Meet
                      </a>
                      <p style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#666' }}>
                        {bookingResult.meetLink}
                      </p>
                    </div>
                  )}

                  <p style={{ color: '#888', fontSize: '0.95rem', marginTop: '1.5rem', lineHeight: 1.6 }}>
                    A <strong style={{ color: '#fff' }}>confirmation email</strong> with the Google Meet link has been sent to your inbox.
                  </p>

                  <button
                    onClick={() => {
                      setStep(1);
                      setAgreementInput('');
                      setFormData({ name: '', email: '', phone: '' });
                      setSelectedDate('');
                      setSelectedTime('');
                      setSubmitError('');
                      setAgreedToPolicy(false);
                      setBookingResult(null);
                    }}
                    style={{
                      marginTop: '2.5rem', background: 'transparent',
                      color: '#fff', border: '1px solid #333', fontSize: '1rem',
                      padding: '0.75rem 2rem', cursor: 'pointer',
                      borderRadius: '100px', transition: 'all 0.3s ease',
                    }}
                  >
                    Book another slot
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TalkWithMePage;
