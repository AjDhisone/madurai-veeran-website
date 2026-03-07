import { YouTubeIcon, LinkedInIcon } from '../icons/SocialIcons';

export default function Footer() {
  return (
    <footer footer-slide="main" className="footer">
      <div footer-slide="base" className="footer_base">
        <div className="container">
          <div className="footer_base-content">
            <div className="footer_main">
              <div className="footer_social">
                <div className="footer_social-text">
                  <p className="p_large uppercase">@maduraiveeran</p>
                  <p className="p_small">
                    Follow for financial tips, investment insights, and wealth wisdom.
                    <br />
                    I am not a SEBI-registered consultant. I am only sharing my past experience.
                  </p>
                </div>
                <div className="footer_social-links">
                  <a href="https://www.youtube.com/@MaduraiVeeranMoneyCoach" target="_blank" rel="noreferrer" className="button_social-small is-dark w-inline-block">
                    <YouTubeIcon className="social_small" />
                  </a>
                  <a href="https://www.linkedin.com/in/madugradiosh/?originalSubdomain=ae" target="_blank" rel="noreferrer" className="button_social-small is-dark w-inline-block">
                    <LinkedInIcon className="social_small" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="footer_base-other">
            <div className="footer_base-links">
              <a href="#" className="p_small text-white">Terms &amp; Conditions</a>
              <a href="#" className="p_small text-white">Privacy Policy</a>
            </div>
            <div className="footer_base-copyright">
              <p className="p_small">&copy; 2026 Madurai Veeran. All rights reserved.</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
