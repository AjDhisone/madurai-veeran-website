import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Privacy Policy — Madurai Veeran',
  description: 'Privacy Policy for Madurai Veeran services.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px' }}>
        <section className="section_policy">
          <div className="padding-global">
            <div className="container-large" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 className="heading-style-h1" style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Privacy Policy</h1>
              <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Last updated: June 10, 2026</p>
              
              <div className="text-rich-inherit" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#222' }}>
                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>1. Introduction</h2>
                  <p>
                    Welcome to Madurai Veeran (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We value your privacy and are committed to protecting your personal data. This Privacy Policy outlines how we collect, use, and protect your information when you visit our website and book our educational or consulting services.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>2. Information We Collect</h2>
                  <p>
                    When you use our booking form or contact us, we collect information that you voluntarily provide to us:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li><strong>Personal Details:</strong> Full name, email address, and phone number.</li>
                    <li><strong>Consultation Data:</strong> Booking date, time slots, and preferences.</li>
                    <li><strong>Payment Information:</strong> All transactions are processed securely through our payment gateway provider, Razorpay. We do not store your credit card, debit card, or net banking credentials on our servers.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>3. How We Use Your Information</h2>
                  <p>
                    We use the collected information for the following purposes:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>To schedule and confirm your virtual consultations.</li>
                    <li>To send automated reminder emails and Google Meet links.</li>
                    <li>To address queries, feedback, or support requests submitted through our contact form.</li>
                    <li>To ensure website security and prevent spam/bot activities.</li>
                  </ul>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>4. Data Protection and Security</h2>
                  <p>
                    We use Firebase Firestore and secure encryption protocols to protect your personal details from unauthorized access, disclosure, or modification. Your data is restricted to authorized administrative personnel only.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>5. Third-Party Integrations</h2>
                  <p>
                    We integrate with trusted third-party services to deliver our core features:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li><strong>Razorpay:</strong> Secure payment processing.</li>
                    <li><strong>Google Workspace / Google Calendar:</strong> Automatic meeting link generation and invitations.</li>
                    <li><strong>Firebase:</strong> Database hosting and app check security.</li>
                  </ul>
                  <p style={{ marginTop: '0.75rem' }}>
                    These providers have their own privacy policies governing how they handle your information.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>6. Changes to This Policy</h2>
                  <p>
                    We reserve the right to update or modify this Privacy Policy at any time. Any updates will be posted on this page with the revised &quot;Last updated&quot; date.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>7. Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy, please get in touch with us using our <a href="/contact" style={{ color: '#000', textDecoration: 'underline', fontWeight: 600 }}>Contact Page</a>.
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
