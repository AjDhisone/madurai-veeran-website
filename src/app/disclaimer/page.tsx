import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';

export const metadata: Metadata = {
  title: 'Disclaimer — Madurai Veeran',
  description: 'Important legal and financial disclaimer for Madurai Veeran services and content.',
};

export default function DisclaimerPage() {
  return (
    <div className="page-wrapper" style={{ backgroundColor: '#ffffff', color: '#000000', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, paddingTop: '150px', paddingBottom: '100px' }}>
        <section className="section_policy">
          <div className="padding-global">
            <div className="container-large" style={{ maxWidth: '800px', margin: '0 auto' }}>
              <h1 className="heading-style-h1" style={{ marginBottom: '1.5rem', fontWeight: 800 }}>Disclaimer</h1>
              <p style={{ color: '#666', marginBottom: '2.5rem', fontSize: '0.95rem' }}>Last updated: June 10, 2026</p>
              
              <div className="text-rich-inherit" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', fontSize: '1.1rem', lineHeight: '1.7', color: '#222' }}>
                <section style={{ backgroundColor: '#fafafa', borderLeft: '4px solid #ff3b30', padding: '1.5rem', borderRadius: '4px' }}>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '0.5rem', color: '#ff3b30' }}>CRITICAL DISCLOSURE</h2>
                  <p style={{ fontWeight: 600, color: '#111' }}>
                    I am not a SEBI-registered (Securities and Exchange Board of India) investment advisor, financial consultant, or portfolio manager. All content on this website, my YouTube channel, and shared during our consultations is strictly for educational, informational, and interactive purposes only.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>1. No Financial Advice</h2>
                  <p>
                    The information provided on this website, including but not limited to financial calculators, guides, videos, articles, and consultation discussions, does not constitute, and should not be construed as, professional financial, investment, legal, or tax advice. We do not recommend or advise the purchase or sale of any specific stocks, mutual funds, options, or other financial instruments.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>2. Personal Experience &amp; Opinion</h2>
                  <p>
                    Any strategies, views, tips, or experiences shared are purely personal opinions and past observations of Madurai Veeran. What worked in the past or for one individual may not work for others. You are solely responsible for evaluating the merits and risks associated with the use of any information provided before making any decisions.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>3. Risks of Investing</h2>
                  <p>
                    Investing in securities, equities, mutual funds, real estate, or debt markets involves high risk. Market prices fluctuate, and you may lose some or all of your invested capital. Past performance is not indicative of future results.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>4. Calculator Accuracy</h2>
                  <p>
                    All investment and financial calculators on this site are designed for illustrative and educational purposes only. The calculations are based on user inputs and standard formulas, and do not guarantee actual returns or simulate actual market performance. We are not liable for any financial decisions made based on these calculator estimations.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>5. Limitation of Liability</h2>
                  <p>
                    Under no circumstances will Madurai Veeran be held liable for any direct, indirect, incidental, or consequential loss or damage arising from the use of this website, its materials, or the consultation sessions.
                  </p>
                </section>

                <section>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.75rem', color: '#000' }}>6. Actionable Steps</h2>
                  <p>
                    We strongly encourage you to:
                  </p>
                  <ul style={{ paddingLeft: '1.5rem', listStyleType: 'disc', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <li>Do your own research (DYOR) before investing money.</li>
                    <li>Consult with a qualified, licensed SEBI-registered financial advisor or wealth manager.</li>
                  </ul>
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
