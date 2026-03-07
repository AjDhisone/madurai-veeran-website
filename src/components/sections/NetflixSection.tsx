export default function NetflixSection() {
  return (
    <div className="home_netflix">
      <div className="netflix_video-wrapper">
        <div className="netflix_video-sticky">
          <video
            src="/video/m1.mp4"
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
              <p className="netflix_overlay-kicker">Helping everyday people understand investing and wealth building.</p>
              <h2 className="netflix_overlay-title">Influenced over millions of people.</h2>
              <p className="netflix_overlay-copy">Practical investing education, simplified market insights, and wealth-building ideas that reach ordinary families at scale.</p>
            </div>
            <div className="netflix_caption">
              <div className="netflix_caption-inner netflix_caption-inner--overlay">
                <div className="caption_small">
                  Helping everyday people understand investing and wealth building.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
