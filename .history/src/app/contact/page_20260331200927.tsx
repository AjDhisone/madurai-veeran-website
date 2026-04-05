import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact — Madurai Veeran',
  description: 'Get in touch with Madurai Veeran for questions, investment guidance, or scheduling a meet-up.',
};

const ContactPage = () => {
  return (
    <div className="page-wrapper">
      <Navbar />
      <main className="main-wrapper">
        <section className="section_contact" style={{ paddingTop: '150px', paddingBottom: '100px' }}>
          <div className="padding-global">
            <div className="container-large">
              <div 
                className="padding-section-large" 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
                  gap: '4rem', 
                  alignItems: 'center' 
                }}
              >
                {/* Contact Form / Info Side */}
                <div>
                  <h1 className="heading-style-h1">Get in Touch</h1>
                  <p className="text-size-large margin-top margin-small">
                    Have a question, want to learn more about my journey, or looking to schedule a meet-up? 
                    I'd love to hear from you.
                  </p>
                  
                  <ContactForm />
                </div>

                {/* Image Side */}
                <div style={{ borderRadius: '16px', overflow: 'hidden', height: '100%', minHeight: '500px', position: 'relative' }}>
                  <img 
                    src="/imgs/madurai-2.jpg" 
                    alt="Contact Madurai" 
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover', 
                      position: 'absolute', 
                      top: 0, 
                      left: 0 
                    }} 
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactPage;