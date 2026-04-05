import { YouTubeIcon, LinkedInIcon } from '../icons/SocialIcons';

export default function SocialSection() {
  return (
    <div className="social_block">
      <div className="container cc-full">
        <div className="social_block-inner">
          <div className="social_block-top">
            <div className="social_block-text">
              <h2 className="display_xxl-class justify-end-text">Follow Me</h2>
            </div>
            <div className="social_block-icons">
              <a href="https://www.youtube.com/@MaduraiVeeranMoneyCoach" target="_blank" rel="noreferrer" className="button_social-large is-white w-inline-block">
                <YouTubeIcon />
              </a>
              <a href="https://www.linkedin.com/in/madugradiosh/?originalSubdomain=ae" target="_blank" rel="noreferrer" className="button_social-large is-white w-inline-block">
                <LinkedInIcon />
              </a>
            </div>
          </div>
        </div>
        <div className="social_bg-fade" />
        <div image-parallax="outer" className="social_bg-image">
          <div image-parallax="inner" className="social_bg_inner">
            <img
              src="/imgs/m-follow.png"
              loading="eager"
              alt="Portrait for social follow section"
              className="img_cover-top"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
