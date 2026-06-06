const heroSlideImages = [
  { src: '/imgs/madurai-2.jpg', mobileSrc: '/imgs/m-mobile.jpg' },
];

export default function HeroSection() {
  return (
    <div className="home_hero">
      <div className="home_hero-wrap">
        <div className="home_hero-wrap-inner">
          <div className="home_hero-content">
            <div className="container">
              <div className="home_hero-inner">
                <div className="home_hero-logo">
                  <h1 className="display_xl-class">
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
              {heroSlideImages.map((heroImage, imageIndex) => (
                <div key={imageIndex} role="listitem" className="swiper-slide is-home-hero w-dyn-item">
                  <div className="home_hero-gallery">
                    <picture>
                      {heroImage.mobileSrc ? (
                        <source media="(max-width: 767px)" srcSet={heroImage.mobileSrc} />
                      ) : null}
                      <img
                        className="home_slider-image"
                        src={heroImage.src}
                        alt=""
                        loading="eager"
                      />
                    </picture>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
