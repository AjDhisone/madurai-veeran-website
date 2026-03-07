import { CloseIcon } from './icons';

interface ConsultationFormProps {
  variant?: 1 | 2;
}

export default function ConsultationForm({ variant = 1 }: ConsultationFormProps) {
  const wrapperClass = variant === 1 ? 'hero-popup _1 w-dyn-list' : 'hero-popup _2 w-dyn-list';

  return (
    <div className={wrapperClass}>
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
                  id={`email-form-popup-${variant}`}
                  name="email-form"
                  data-name="Email Form"
                  method="get"
                  className="form_inner is-home"
                  data-wf-page-id="65aa9744cb3474ba90a7bc5a"
                  data-wf-element-id="a331f539-41d0-e308-8a75-4d37ff02ebcc"
                  data-turnstile-sitekey="0x4AAAAAAAQTptj2So4dx43e"
                >
                  <div className="form_item-wrap">
                    <label htmlFor={`name-popup-${variant}`} className="field_label">
                      Name*
                    </label>
                    <input
                      className="form_field w-input"
                      maxLength={256}
                      name="fields[first_name]"
                      data-name="fields[first_name]"
                      placeholder="Name"
                      type="text"
                      id={`name-popup-${variant}`}
                      required
                    />
                  </div>
                  <div className="form_item-wrap">
                    <label htmlFor={`email-popup-${variant}`} className="field_label">
                      Email*
                    </label>
                    <input
                      className="form_field w-input"
                      maxLength={256}
                      name="email_address"
                      data-name="email_address"
                      placeholder="Email"
                      type="email"
                      id={`email-popup-${variant}`}
                      required
                    />
                  </div>
                  <div className="form_item-wrap" />
                  <div className="form_button-wrap cc-full">
                    <input
                      type="submit"
                      data-wait="Just a sec..."
                      className="button_primary is-white cc-center w-button"
                      defaultValue="Book Consultation"
                    />
                  </div>
                </form>
                <div className="form_success w-form-done">
                  <div>Thanks! Your consultation request has been received.</div>
                </div>
                <div className="form_error w-form-fail">
                  <div className="p_small">
                    Oops! Something went wrong while submitting the form.
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
