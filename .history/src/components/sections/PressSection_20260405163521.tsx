import StarIcon from '../icons/StarIcon';

const pressGifs = ['/imgs/m-giff.gif', '/imgs/m2-giff.gif'];

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

function PressGif({ src }: { src: string }) {
  return (
    <div className="home_mag-slider">
      <div className="press_gallery-wrap">
        <img loading="eager" alt="" src={src} />
      </div>
    </div>
  );
}

export default function PressSection() {
  return (
    <div className="home_press">
      <MarqueeRow text="Financial Literacy for Tamil Families • Smart Investing • Long-Term Wealth Building" />

      <div className="container">
        <div stagger-fade="trigger" className="home_press-inner is-gif-only">
          {pressGifs.map((src) => (
            <PressGif key={src} src={src} />
          ))}
        </div>
      </div>

      <MarqueeRow text="Start investing" reverse />
    </div>
  );
}
