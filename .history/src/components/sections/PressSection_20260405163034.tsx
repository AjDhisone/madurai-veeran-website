import StarIcon from '../icons/StarIcon';

/* ── Full w-node IDs that webflow.css targets for grid placement ── */
const pressLogos = [
  { nodeId: 'w-node-d87dcc91-3342-3463-1f87-346734fbdcd6-90a7bc5a', label: 'INDIABONDS' },
  { nodeId: 'w-node-_85ff98ec-7804-a190-618d-8025844a5792-90a7bc5a', label: 'ZERODHA' },
  { nodeId: 'w-node-b28447a3-8655-3d67-7e39-6ab5a93ace17-90a7bc5a', label: 'WINT WEALTH' },
  { nodeId: 'w-node-db1d1593-8704-d9cd-c2a1-d7a0db6af228-90a7bc5a', label: 'BAJAJ FINSERV' },
  { nodeId: 'w-node-_2b28df9e-90c5-70c0-10a2-8fabdaf1769c-90a7bc5a', label: 'GUEST AT WINT WEALTH' },
  { nodeId: 'w-node-_1d8ae0ce-c320-3519-4172-e619fab73381-90a7bc5a', label: 'INDIABONDS' },
  { nodeId: 'w-node-_1597ee23-6dc7-9716-77c0-d6b724a47a36-90a7bc5a', label: 'ZERODHA' },
  { nodeId: 'w-node-_05f8e450-a032-65e3-5558-2292a7e2bf52-90a7bc5a', label: 'WINT WEALTH' },
  { nodeId: 'w-node-f2436d41-1510-86c7-8a1c-043f713f7f4f-90a7bc5a', label: 'BAJAJ FINSERV' },
  { nodeId: 'w-node-bad22848-6996-10ba-950c-6b48ccca71d2-90a7bc5a', label: 'GUEST AT BEHIND WOODS', hideOnMobile: true },
];

const primaryPressSliderImages = [
  '/imgs/m-giff.gif',
];

const secondaryPressSliderImages = [
  '/imgs/m2-giff.gif',
];

function MarqueeRow({ text, reverse = false }: { text: string; reverse?: boolean }) {
  const marqueeAttr = reverse ? 'reverse' : 'true';
  const items = Array.from({ length: 7 });

  return (
    <div className="marquee_wrapper">
      {[0, 1].map((dupIdx) => (
        <div key={dupIdx} marquee={marqueeAttr} className="marquee_inner scroll">
          {items.map((_, itemIndex) => (
            <span key={itemIndex} style={{ display: 'contents' }}>
              <h2 className="display_xl-class">{text}</h2>
              <StarIcon size={56} spinning />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

function PressSlider({ images }: { images: string[] }) {
  return (
    <div className="swiper is-press w-dyn-list">
      <div role="list" className="swiper-wrapper is-press w-dyn-items">
        {images.map((imageSrc, imageIndex) => (
          <div key={imageIndex} role="listitem" className="swiper-slide is-press w-dyn-item">
            <div className="press_gallery-wrap">
              <img loading="eager" alt="" src={imageSrc} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PressSection() {
  return (
    <div className="home_press">
      <MarqueeRow text="Financial Literacy for Tamil Families • Smart Investing • Long-Term Wealth Building" />

      <div className="container">
        <div stagger-fade="trigger" className="home_press-inner">
          {/* Top logos */}
          {pressLogos.slice(0, 4).map((logo) => (
            <div key={logo.nodeId} id={logo.nodeId} className="home_press-logo">
              <div
                stagger-fade="item"
                style={{
                  fontFamily: 'Reckless, serif',
                  fontSize: 'clamp(1.5rem, 2.1vw, 2.4rem)',
                  fontWeight: 600,
                  letterSpacing: '.01em',
                  lineHeight: 1.05,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  maxWidth: '90%',
                }}
              >
                {logo.label}
              </div>
            </div>
          ))}

          {/* Press slider 1 */}
          <div id="w-node-_4acd90c6-3171-240a-de4c-92040895f772-90a7bc5a" className="home_mag-slider">
            <PressSlider images={primaryPressSliderImages} />
          </div>

          {/* Press slider 2 */}
          <div id="w-node-_10eece1f-90a3-37ba-2e94-eed5c83a178a-90a7bc5a" className="home_mag-slider is-second hide-mobile-landscape">
            <PressSlider images={secondaryPressSliderImages} />
          </div>

          {/* Bottom logos */}
          {pressLogos.slice(4).map((logo) => (
            <div
              key={logo.nodeId}
              id={logo.nodeId}
              className={`home_press-logo${logo.hideOnMobile ? ' hide-mobile-landscape' : ''}`}
            >
              <div
                stagger-fade="item"
                style={{
                  fontFamily: 'Reckless, serif',
                  fontSize: 'clamp(1.4rem, 1.9vw, 2.1rem)',
                  fontWeight: 600,
                  letterSpacing: '.01em',
                  lineHeight: 1.05,
                  textAlign: 'center',
                  textTransform: 'uppercase',
                  maxWidth: '90%',
                }}
              >
                {logo.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <MarqueeRow text="Start investing" reverse />
    </div>
  );
}
