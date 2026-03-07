import StarIcon from '../icons/StarIcon';

export default function BookSection() {
  return (
    <div className="home_book">
      <div className="home_book-snippet">
        <div className="caption_small">
          Audience, attention, and reach at scale.
        </div>
      </div>
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
            <BookTextColumn
              className="home_book-invest"
              text="Invest"
              count={5}
            />
            <BookTextColumn
              className="home_book-followers"
              text="Followers"
              count={5}
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

function BookTextColumn({
  className,
  text,
  count,
}: {
  className: string;
  text: string;
  count: number;
}) {
  return (
    <div stagger-fade="trigger" className={className}>
      {Array.from({ length: count }, (_, i) => (
        <div key={i} stagger-fade="item" className="display_xl-class home_book-repeat-text">
          {text}
        </div>
      ))}
    </div>
  );
}
