import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Terms & Conditions — Madurai Veeran',
  description: 'Terms and conditions governing the use of Madurai Veeran services.',
};

export default function TermsAndConditionsPage() {
  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px' }}>
        <section className="section_policy">
          <div className="padding-global">
            <div className="container-large" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 className="heading-style-h1" style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Terms &amp; Conditions</h1>
              <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Last updated: June 10, 2026</p>
              
              <div className="text-rich-inherit" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#222' }}>
                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>1. Agreement to Terms</h2>
                  <p>
                    By accessing or using this website, scheduling a consultation, or purchasing any session, you agree to comply with and be bound by these Terms &amp; Conditions. If you do not agree to these terms, please refrain from using our website or booking sessions.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>2. Professional Disclaimer</h2>
                  <p style={{ fontWeight: 500 }}>
                    Please note the following critical disclosure:
                  </p>
                  <div style={{ borderLeft: '4px solid #000', paddingLeft: '1rem', margin: '1rem 0', color: '#555', fontStyle: 'italic' }}>
                    I am not a SEBI-registered financial advisor or investment consultant. Any discussion, suggestion, opinion, or experience shared during our consultations, videos, or on this website is for educational and general information purposes only.
                  </div>
                  <p>
                    You should not construe any such information or other material as legal, tax, investment, financial, or other advice. Before making any investment decisions, perform your own research or consult with a licensed professional.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>3. Bookings and Payments</h2>
                  <p>
                    All virtual consultations must be booked and paid for in advance through our checkout system. Payments are processed securely via Razorpay. By placing a booking:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>You agree to provide accurate personal details (name, email, phone number).</li>
                    <li>You acknowledge that booking availability is subject to change at our sole discretion.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>4. Cancellation and Refund Policy</h2>
                  <p>
                    Due to the highly limited number of consultation slots, we maintain a strict booking policy:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li><strong>No Refunds:</strong> All payments are final and non-refundable.</li>
                    <li><strong>No Cancellations:</strong> Bookings cannot be cancelled once they are confirmed.</li>
                    <li><strong>No Rescheduling:</strong> Rescheduling requests are not permitted once a slot is booked. Please choose your slot carefully.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>5. Conduct during Sessions</h2>
                  <p>
                    Consultations are conducted online via Google Meet. We reserve the right to terminate any call immediately without refund if a client exhibits abusive, disrespectful, or inappropriate behavior.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>6. Intellectual Property</h2>
                  <p>
                    The branding, design, logos, calculators, graphics, content, and code on this website are the intellectual property of Madurai Veeran and may not be reproduced, copied, or redistributed without prior written consent.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>7. Governing Law</h2>
                  <p>
                    These Terms &amp; Conditions are governed by and construed in accordance with the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts of Madurai, Tamil Nadu.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>8. Contact</h2>
                  <p>
                    If you have questions about these Terms, feel free to contact us via our <a href="/contact" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>Contact Page</a>.
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
