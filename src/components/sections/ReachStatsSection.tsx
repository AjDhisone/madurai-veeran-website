import StarIcon from '../icons/StarIcon';

export default function ReachStatsSection() {
  return (
    <div className="home_book">
      {/* <div className="home_book-snippet">
        <div className="caption_small">
          Audience, attention, and reach at scale.
        </div>
      </div> */}
      <div className="container">
        <div className="home_book-inner">
          <div className="home_book-top home_book-top--stats">
            <div className="book_top-left book_top-left--stats">
              <div className="book_top-left-eyebrow">
                <div className="book_stat-label book_stat-label-main">Followers</div>
              </div>
              <div className="book_top-left-main">
                <div className="book_stat-number book_stat-number-main">200K+</div>
              </div>
            </div>
            <div className="book_top-star">
              <StarIcon size={56} spinning />
            </div>
            <div className="book_top-right book_top-right--stats">
              <div className="book_stat-number book_stat-number-right">20M+</div>
              <div className="book_stat-label book_stat-label-right">Video Views</div>
            </div>
          </div>

          <div className="home_book-bottom">
            <RepeatingTextColumn
              containerClassName="home_book-invest"
              label="Invest"
              repeatCount={5}
            />
            <RepeatingTextColumn
              containerClassName="home_book-followers"
              label="now"
              repeatCount={5}
            />
          </div>

          <div className="home_book-cover">
            <img
              className="home_book-cover-image"
              src="/imgs/m6.jpg"
              loading="eager"
              alt="Portrait standing in a black suit"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RepeatingTextColumn({
  containerClassName,
  label,
  repeatCount,
}: {
  containerClassName: string;
  label: string;
  repeatCount: number;
}) {
  return (
    <div stagger-fade="trigger" className={containerClassName}>
      {Array.from({ length: repeatCount }, (_, index) => (
        <div key={index} stagger-fade="item" className="display_xl-class home_book-repeat-text">
          {label}
        </div>
      ))}
    </div>
  );
}
