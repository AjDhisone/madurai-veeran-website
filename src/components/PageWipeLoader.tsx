import StarIcon from './icons/StarIcon';

export default function PageWipeLoader() {
  return (
    <div className="page_wipe-wrapper">
      <div className="page_wipe-top" />
      <div className="page_wipe-mid" />
      <div className="page_wipe-bottom">
        <div className="page_wipe-star">
          <div className="load_starline-left" />
          <StarIcon size={32} />
          <div className="load_starline-right" />
        </div>
      </div>
    </div>
  );
}
