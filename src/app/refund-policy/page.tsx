import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Refund Policy — Madurai Veeran',
  description: 'Refund and cancellation policies for Madurai Veeran services.',
};

export default function RefundPolicyPage() {
  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px' }}>
        <section className="section_policy">
          <div className="padding-global">
            <div className="container-large" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 className="heading-style-h1" style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Refund &amp; Cancellation Policy</h1>
              <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Last updated: June 10, 2026</p>
              
              <div className="text-rich-inherit" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#222' }}>
                <section>
                  <p>
                    Thank you for choosing Madurai Veeran. We offer premium, personalized, one-on-one virtual educational and consulting sessions. Because each slot is individually prepared for and represents dedicated personal time, we maintain a strict policy regarding refunds, cancellations, and rescheduling.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>1. No Refunds</h2>
                  <p>
                    All bookings and payments made on our website are <strong>final</strong>. We do not offer refunds, partial refunds, or store credits under any circumstances. Once a transaction is completed, the payment is captured and cannot be reversed.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>2. No Cancellations</h2>
                  <p>
                    Once your consultation is booked, you cannot cancel it. If you choose not to attend or miss the session (no-show), you will forfeit the booking, and no refund or replacement slot will be provided.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>3. No Rescheduling</h2>
                  <p>
                    Please select your consultation date and time slot carefully. We do not permit rescheduling of slots once confirmed. If you are unable to join at the booked hour, the session will be considered completed.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>4. Exceptions and Rescheduling by Us</h2>
                  <p>
                    In extremely rare instances where we must reschedule a slot due to unforeseen personal emergencies, technical disruptions, or scheduling conflicts on our end, we will:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>Notify you as early as possible via email.</li>
                    <li>Provide alternative slot options to reschedule the session.</li>
                  </ul>
                  <p style={{ marginTop: '0.75rem' }}>
                    If a mutually agreeable slot cannot be found in such rare cases, a full refund may be issued.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>5. Contact Us</h2>
                  <p>
                    If you have any questions or require clarification before booking your session, please contact us via our <a href="/contact" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>Contact Page</a>.
                  </p>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
