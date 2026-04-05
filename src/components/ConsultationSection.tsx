"use client";

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { CloseIcon } from './icons';
import { getFirestoreClient, initializeClientAppCheck } from '@/lib/firebase-client';
import {
  isClientRateLimited,
  isLikelyBotSubmission,
  markClientSubmission,
} from '@/lib/form-security';

export default function ConsultationSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const startedAtRef = useRef(Date.now());

  useEffect(() => {
    initializeClientAppCheck();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSuccess(false);
    setErrorMessage('');

    if (isLikelyBotSubmission(startedAtRef.current, honeypot)) {
      setErrorMessage('Submission blocked. Please try again.');
      return;
    }

    if (isClientRateLimited('consultation')) {
      setErrorMessage('Too many attempts. Please wait a few minutes and try again.');
      return;
    }

    setIsSubmitting(true);

    try {
      const db = getFirestoreClient();

      if (!db) {
        throw new Error('Firebase is not configured. Please set environment variables.');
      }

      await addDoc(collection(db, 'form_submissions'), {
        formType: 'consultation',
        name: name.trim(),
        email: email.trim().toLowerCase(),
        message: null,
        createdAt: serverTimestamp(),
      });

      markClientSubmission('consultation');

      setName('');
      setEmail('');
      setIsSuccess(true);
      setHoneypot('');
      startedAtRef.current = Date.now();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit the consultation form.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="hero-popup _1 w-dyn-list">
      <div role="list" className="container cc-home-popup w-dyn-items">
        <div stagger-fade="trigger" role="listitem" className="w-dyn-item">
          <div className="hero-popup_form">
            <div className="hero-popup_head">
              <div className="display_s-class">
                Investment Guidance Consultation
              </div>
            </div>
            <div className="hero-popup_mask">
              <div
                data-form-action="#"
                data-form="custom"
                className="form_block form-dark form-popup w-form"
              >
                <div className="hero-popup_par">
                  <p className="serif_medium-indent">
                    Book a one-on-one consultation for practical investment
                    advice. Share your details to get disciplined, long-term
                    wealth guidance.
                  </p>
                  <p className="p_small">
                    I am not a SEBI-registered consultant. I am only sharing my past experience.
                  </p>
                </div>
                <form
                  id="email-form-popup-1"
                  name="email-form"
                  data-name="Email Form"
                  method="get"
                  onSubmit={handleSubmit}
                  className="form_inner is-home"
                  data-wf-page-id="65aa9744cb3474ba90a7bc5a"
                  data-wf-element-id="a331f539-41d0-e308-8a75-4d37ff02ebcc"
                >
                  <div className="form_item-wrap">
                    <label htmlFor="name-popup-1" className="field_label">
                      Name*
                    </label>
                    <input
                      className="form_field w-input"
                      maxLength={256}
                      name="fields[first_name]"
                      data-name="fields[first_name]"
                      placeholder="Name"
                      type="text"
                      id="name-popup-1"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form_item-wrap">
                    <label htmlFor="email-popup-1" className="field_label">
                      Email*
                    </label>
                    <input
                      className="form_field w-input"
                      maxLength={256}
                      name="email_address"
                      data-name="email_address"
                      placeholder="Email"
                      type="email"
                      id="email-popup-1"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </div>
                  <div className="form_item-wrap" />
                  <div style={{ display: 'none' }} aria-hidden="true">
                    <label htmlFor="consultation-company">Company</label>
                    <input
                      id="consultation-company"
                      name="company"
                      autoComplete="off"
                      tabIndex={-1}
                      value={honeypot}
                      onChange={(event) => setHoneypot(event.target.value)}
                    />
                  </div>
                  <div className="form_button-wrap cc-full">
                    <input
                      type="submit"
                      data-wait="Just a sec..."
                      className="button_primary is-white cc-center w-button"
                      value={isSubmitting ? 'Submitting...' : 'Book Consultation'}
                      disabled={isSubmitting}
                    />
                  </div>
                </form>
                <div className="form_success w-form-done" style={{ display: isSuccess ? 'block' : 'none' }}>
                  <div>Thanks! Your consultation request has been received.</div>
                </div>
                <div className="form_error w-form-fail" style={{ display: errorMessage ? 'block' : 'none' }}>
                  <div className="p_small">
                    {errorMessage || 'Oops! Something went wrong while submitting the form.'}
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-popup_close">
              <div className="icon_32 w-embed">
                <CloseIcon />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
