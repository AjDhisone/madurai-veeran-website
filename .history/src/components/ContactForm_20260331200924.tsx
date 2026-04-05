"use client";

import { useState } from 'react';

type ContactFormData = {
  name: string;
  email: string;
  message: string;
};

const INITIAL_FORM_DATA: ContactFormData = {
  name: '',
  email: '',
  message: '',
};

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_FORM_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formType: 'contact',
          ...formData,
        }),
      });

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        throw new Error(result.error ?? 'Failed to submit the contact form.');
      }

      setStatusMessage('Thanks, your message has been submitted successfully.');
      setFormData(INITIAL_FORM_DATA);
    } catch (error) {
      setIsError(true);
      setStatusMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit your message. Please try again.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="margin-top margin-large"
      style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <div>
        <label
          htmlFor="contact-name"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Name
        </label>
        <input
          type="text"
          id="contact-name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          placeholder="Your Name"
          required
        />
      </div>
      <div>
        <label
          htmlFor="contact-email"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Email
        </label>
        <input
          type="email"
          id="contact-email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc' }}
          placeholder="your@email.com"
          required
        />
      </div>
      <div>
        <label
          htmlFor="contact-message"
          style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ccc', resize: 'vertical' }}
          placeholder="Tell me more..."
          required
        />
      </div>
      <button
        type="submit"
        className="button w-button"
        style={{
          backgroundColor: '#000',
          color: 'white',
          padding: '14px 24px',
          borderRadius: '8px',
          fontWeight: 'bold',
          cursor: isSubmitting ? 'wait' : 'pointer',
          border: 'none',
          opacity: isSubmitting ? 0.7 : 1,
        }}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Sending...' : 'Send Message'}
      </button>

      {statusMessage ? (
        <p style={{ color: isError ? '#ff4d4d' : '#16a34a', margin: 0 }}>{statusMessage}</p>
      ) : null}
    </form>
  );
}
