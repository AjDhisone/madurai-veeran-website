export default function EducatedMillionsSection() {
  return (
    <section className="educated_millions">
      <div className="container">
        <div className="educated_millions-heading">
          <h2 className="display_xl-class">Educated over millions of people</h2>
        </div>
      </div>

      <div className="educated_millions-videoPart">
        <div className="container">
          <div className="educated_millions-videoSticky">
            <video
              className="educated_millions-video"
              src="/video/m1.mp4"
              controls
              playsInline
              preload="metadata"
            />
          </div>

          <p className="caption_small educated_millions-mobileCaption">
            Millions of people look like this
          </p>
        </div>
      </div>
    </section>
  );
}
