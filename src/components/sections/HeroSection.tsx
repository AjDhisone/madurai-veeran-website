import ConsultationForm from '../ConsultationForm';

const heroImages = [
  { src: '/imgs/madurai%202.jpg', mobileSrc: '/imgs/m%20mobile.jpg', origin: 'center' },
];

export default function HeroSection() {
  return (
    <div data-w-id="7730eb80-0456-3697-c17c-fe8ddf92af5c" className="home_hero">
      <div className="home_hero-wrap">
        <div className="home_hero-wrap-inner">
          <div className="home_hero-content">
            <div className="container">
              <div className="home_hero-inner">
                <div className="home_hero-logo">
                  <h1 className="display_xl-class hero-name-animated">
                    Madurai Veeran
                  </h1>
                </div>
                <div className="home_hero-text">
                  <div className="home_hero-content-caption">
                    <p className="caption_small">Investor and investment educator</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Slider */}
      <div className="home_hero-slider">
        <div className="home_hero-swiper-sticky">
          <div className="swiper is-home-hero w-dyn-list">
            <div role="list" className="swiper-wrapper is-home-hero w-dyn-items">
              {heroImages.map((img, i) => (
                <div key={i} role="listitem" className="swiper-slide is-home-hero w-dyn-item">
                  <div className="home_hero-gallery">
                    <picture>
                      {img.mobileSrc ? (
                        <source media="(max-width: 767px)" srcSet={img.mobileSrc} />
                      ) : null}
                      <img
                        className="home_slider-image"
                        src={img.src}
                        data-swiper-parallax-scale="1.2"
                        origin-point={img.origin}
                        alt=""
                        data-swiper-parallax-x="30%"
                        loading="eager"
                      />
                    </picture>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Consultation Popup (variant 2 - inside slider) */}
        <ConsultationForm variant={2} />
      </div>
    </div>
  );
}
