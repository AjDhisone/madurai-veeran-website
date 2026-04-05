const portfolioJourneyImages = [
  {
    className: 'nasty_scroll-image-first',
    src: '/imgs/mechanic-shop.png',
    srcSet: '',
    imgClass: 'nasty_scroll-image-first_img',
    nodeId: 'w-node-c9830914-cb2d-8917-ef41-b7c2dc93fb48-90a7bc5a',
  },
  {
    className: 'nasty_scroll-image-second',
    src: '/imgs/dubai.png',
    srcSet: '',
    imgClass: 'nasty_scroll-image-second_img',
  },
  {
    className: 'nasty_scroll-image-third',
    src: '/imgs/podcast.png',
    srcSet: '',
    imgClass: 'nasty_scroll-image-third_img',
  },
];

export default function PortfolioJourneySection() {
  return (
    <div className="home_nasty">
      <div className="container">
        <div className="home_nasty-inner">
          <div className="nasty_sticky">
            <div className="nasty_sticky-top">
              <p className="nasty_scroll-text nasty_scroll-kicker" style={{
                margin: 0,
                fontFamily: 'Suisse International, sans-serif',
                fontSize: 'clamp(1.3rem, 2vw, 1.8rem)',
                fontWeight: 400,
                lineHeight: 1.2,
                textTransform: 'uppercase' as const,
                letterSpacing: '0.08em',
              }}>STARTED WITH JUST ₹10.</p>
            </div>
            <div className="nasty_sticky-middle" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0,
              width: '100%',
            }}>
              <div className="nasty_scroll-text nasty_scroll-line1" style={{
                fontFamily: 'Suisse International, sans-serif',
                fontSize: 'clamp(2.7rem, 6vw, 5.4rem)',
                fontWeight: 700,
                lineHeight: 0.88,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase' as const,
              }}>BUILT A</div>
              <div className="nasty_scroll-text nasty_scroll-line2" style={{
                fontFamily: 'Suisse International, sans-serif',
                fontSize: 'clamp(2.7rem, 6vw, 5.4rem)',
                fontWeight: 700,
                lineHeight: 0.88,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase' as const,
              }}>MULTI-CRORE</div>
              <div className="nasty_scroll-text nasty_scroll-line3" style={{
                fontFamily: 'Suisse International, sans-serif',
                fontSize: 'clamp(2.7rem, 6vw, 5.4rem)',
                fontWeight: 700,
                lineHeight: 0.88,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase' as const,
              }}>PORTFOLIO.</div>
            </div>
            <div className="nasty_sticky-bottom">
              <div></div>
            </div>
          </div>
          <div className="nasty_scroll">
            {portfolioJourneyImages.map((image, index) => (
              <div
                key={index}
                {...(image.nodeId ? { id: image.nodeId } : {})}
                className={image.className}
              >
                <img
                  src={image.src}
                  loading="eager"
                  sizes="(max-width: 1140px) 100vw, 1140px"
                  srcSet={image.srcSet}
                  alt=""
                  className={image.imgClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
