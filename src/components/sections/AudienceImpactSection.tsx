const impactVideoSrc = '/video/m1.mp4';
const impactKickerText = 'Helping everyday people understand investing and wealth building.';
const impactTitleText = 'Influenced over millions of people.';
const impactBodyText = 'Practical investing education, simplified market insights, and wealth-building ideas that reach ordinary families at scale.';

export default function AudienceImpactSection() {
  return (
    <div className="home_netflix">
      <div className="netflix_video-wrapper">
        <div className="netflix_video-sticky">
          <video
            src={impactVideoSrc}
            autoPlay
            muted
            playsInline
            loop
            className="background-video"
          />
        </div>
      </div>
      <div className="home_netflix-inner">
        <div className="container">
          <div className="netflix_container-inner netflix_container-inner--message">
            <div className="netflix_overlay">
              <p className="netflix_overlay-kicker">{impactKickerText}</p>
              <h2 className="netflix_overlay-title">{impactTitleText}</h2>
              <p className="netflix_overlay-copy">{impactBodyText}</p>
            </div>
            <div className="netflix_caption">
              <div className="netflix_caption-inner netflix_caption-inner--overlay">
                <div className="caption_small">
                  {impactKickerText}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
