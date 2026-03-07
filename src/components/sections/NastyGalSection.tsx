const scrollImages = [
  {
    className: 'nasty_scroll-image-first',
    src: '/imgs/mechanic%20shop.png',
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

export default function NastyGalSection() {
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
            {scrollImages.map((img, i) => (
              <div
                key={i}
                {...(img.nodeId ? { id: img.nodeId } : {})}
                className={img.className}
              >
                <img
                  src={img.src}
                  loading="eager"
                  sizes="(max-width: 1140px) 100vw, 1140px"
                  srcSet={img.srcSet}
                  alt=""
                  className={img.imgClass}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function NastyGalLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 644 239" fill="none" className="logo_wrap">
      <g style={{ mixBlendMode: 'difference' }}>
        <path d="M82.2036 130.398V134.52L82.2019 135.043V238.023H60.0457V187.052C59.7498 188.033 59.4349 188.995 59.1009 189.939C53.1829 206.651 39.3469 221.938 24.0338 222.644C9.53574 223.312 0.000101089 210.32 0.000101089 196.103C0.000101089 181.003 8.35129 172.062 18.3316 161.206C21.2816 157.997 24.3905 154.615 27.4783 150.859C18.1844 157.459 12.2686 162.872 8.35129 169.1C3.00217 177.669 0.000101089 185.866 0.000101089 196.103C0.000101089 210.32 9.53574 223.312 24.0338 222.644C39.3469 221.938 53.1829 206.651 59.1009 189.939C64.0756 175.981 64.0756 157.643 82.2036 130.398Z" fill="currentColor" />
      </g>
    </svg>
  );
}
