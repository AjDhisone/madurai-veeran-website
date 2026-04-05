"use client";

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/sections';
import TurnstileWidget from '@/components/TurnstileWidget';

const MeetMePage = () => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [widgetVersion, setWidgetVersion] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!turnstileToken) {
      setSubmitError('Please complete the verification challenge.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'meet-me',
          ...formData,
          turnstileToken,
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? 'Unable to submit your request right now.');
      }

      setStep(4);
      setTurnstileToken('');
      setWidgetVersion((previous) => previous + 1);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to submit your request right now.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const faqs = [
    { question: "What's the cost?", answer: "Initial 5 mins call completely free." },
    { question: "Where do you meet?", answer: "Chennai, but exact location will be sent to your mail." },
    { question: "What date and time?", answer: "Will send you in mail." }
  ];

  // Listen for Enter key to go to next step
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (step === 1 && formData.name.trim()) {
          e.preventDefault();
          nextStep();
        } else if (step === 2 && formData.email.trim()) {
          e.preventDefault();
          nextStep();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [step, formData]);

  return (
    <div className="page-wrapper" style={{ backgroundColor: '#000', color: '#fff', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main className="main-wrapper" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <section className="section_meet-me" style={{ width: '100%', padding: '0 5%', minHeight: 'calc(100vh - 100px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="container-large" style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
            
            <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              
              {step === 1 && (
                <div style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, marginBottom: '3rem' }}>Your name?</h1>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Type your name here..." 
                    autoFocus
                    style={{ 
                      width: '100%', 
                      background: 'transparent', 
                      border: 'none', 
                      borderBottom: '1px solid #333', 
                      color: '#fff', 
                      fontSize: '1.5rem', 
                      padding: '0.5rem 0',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }} 
                    onFocus={(e) => e.target.style.borderBottom = '1px solid #fff'}
                    onBlur={(e) => e.target.style.borderBottom = '1px solid #333'}
                  />
                  <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button 
                      onClick={nextStep} 
                      disabled={!formData.name.trim()}
                      style={{ 
                        background: 'transparent', 
                        color: formData.name.trim() ? '#fff' : '#666', 
                        border: 'none', 
                        fontSize: '1.25rem', 
                        fontWeight: 600, 
                        cursor: formData.name.trim() ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, marginBottom: '3rem' }}>Your email?</h1>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com" 
                    autoFocus
                    style={{ 
                      width: '100%', 
                      background: 'transparent', 
                      border: 'none', 
                      borderBottom: '1px solid #333', 
                      color: '#fff', 
                      fontSize: '1.5rem', 
                      padding: '0.5rem 0',
                      outline: 'none',
                      transition: 'border-color 0.3s'
                    }} 
                    onFocus={(e) => e.target.style.borderBottom = '1px solid #fff'}
                    onBlur={(e) => e.target.style.borderBottom = '1px solid #333'}
                  />
                  <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <TurnstileWidget
                      key={widgetVersion}
                      onTokenChange={setTurnstileToken}
                    />
                  </div>
                  <div style={{ marginTop: '2rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button 
                      onClick={prevStep} 
                      style={{ background: 'transparent', color: '#888', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Previous
                    </button>
                    <button 
                      onClick={nextStep} 
                      disabled={!formData.email.trim() || !formData.email.includes('@')}
                      style={{ 
                        background: 'transparent', 
                        color: (formData.email.trim() && formData.email.includes('@')) ? '#fff' : '#666', 
                        border: 'none', 
                        fontSize: '1.25rem', 
                        fontWeight: 600, 
                        cursor: (formData.email.trim() && formData.email.includes('@')) ? 'pointer' : 'default',
                      }}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, marginBottom: '3rem' }}>How can I help you?</h1>
                  <textarea 
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me a bit about what you'd like to discuss..." 
                    autoFocus
                    rows={3}
                    style={{ 
                      width: '100%', 
                      background: 'transparent', 
                      border: 'none', 
                      borderBottom: '1px solid #333', 
                      color: '#fff', 
                      fontSize: '1.5rem', 
                      padding: '0.5rem 0',
                      outline: 'none',
                      resize: 'none',
                      transition: 'border-color 0.3s'
                    }} 
                    onFocus={(e) => e.target.style.borderBottom = '1px solid #fff'}
                    onBlur={(e) => e.target.style.borderBottom = '1px solid #333'}
                  />
                  <div style={{ marginTop: '4rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <button 
                      onClick={prevStep} 
                      style={{ background: 'transparent', color: '#888', border: 'none', fontSize: '1rem', cursor: 'pointer' }}
                    >
                      Previous
                    </button>
                    <button 
                      onClick={handleSubmit} 
                      disabled={!formData.message.trim() || isSubmitting || !turnstileToken}
                      style={{ 
                        background: '#fff', 
                        color: '#000', 
                        border: 'none', 
                        fontSize: '1.25rem', 
                        fontWeight: 600, 
                        padding: '0.75rem 2rem',
                        cursor: (formData.message.trim() && !isSubmitting) ? 'pointer' : 'default',
                        borderRadius: '100px',
                        opacity: (formData.message.trim() && !isSubmitting) ? 1 : 0.5
                      }}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit'}
                    </button>
                  </div>
                  {submitError && (
                    <p style={{ marginTop: '1rem', color: '#ff4d4d' }}>{submitError}</p>
                  )}
                </div>
              )}

              {step === 4 && (
                <div style={{ animation: 'slideInRight 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards', textAlign: 'center' }}>
                  <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 600, marginBottom: '1.5rem' }}>Got it!</h1>
                  <p style={{ fontSize: '1.25rem', color: '#aaa' }}>
                    Thanks for reaching out, {formData.name.split(' ')[0] || 'there'}. I'll be in touch soon.
                  </p>
                  <button 
                    onClick={() => {
                      setStep(1);
                      setSubmitError('');
                      setTurnstileToken('');
                      setWidgetVersion((previous) => previous + 1);
                      setFormData({ name: '', email: '', message: '' });
                    }} 
                    style={{ 
                      marginTop: '3rem',
                      background: 'transparent', 
                      color: '#fff', 
                      border: '1px solid #333', 
                      fontSize: '1rem', 
                      padding: '0.75rem 2rem',
                      cursor: 'pointer',
                      borderRadius: '100px'
                    }}
                  >
                    Send another message
                  </button>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section 
          className="faq-section"
          style={{ 
            width: '100%', 
            padding: '4rem 5%', 
            backgroundColor: '#0a0a0a', 
            borderTop: '1px solid #222' 
          }}
        >
          <div className="container-large" style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', fontWeight: 600, marginBottom: '2rem', textAlign: 'center' }}>
              Frequently Asked Questions
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {faqs.map((faq, index) => (
                <div 
                  key={index}
                  onClick={() => toggleFaq(index)}
                  style={{ 
                    padding: '1.25rem', 
                    backgroundColor: '#111', 
                    borderRadius: '12px', 
                    border: '1px solid #333',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 500, margin: 0, color: '#fff' }}>
                      {faq.question}
                    </h3>
                    <div style={{ 
                      color: '#666', 
                      transform: openFaqIndex === index ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.3s ease' 
                    }}>
                      ▼
                    </div>
                  </div>
                  
                  <div style={{ 
                    maxHeight: openFaqIndex === index ? '200px' : '0', 
                    overflow: 'hidden', 
                    transition: 'max-height 0.3s ease-in-out',
                    opacity: openFaqIndex === index ? 1 : 0
                  }}>
                    <p style={{ color: '#aaa', lineHeight: 1.5, margin: '1rem 0 0 0', fontSize: '0.95rem' }}>
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
};

export default MeetMePage;