import { SITE_IMAGES } from '../utils/siteImages';

export default function PageBanner({
  title,
  subtitle,
  image = SITE_IMAGES.bannerMovies,
  compact = false,
}) {
  return (
    <section className={`page-banner${compact ? ' page-banner-compact' : ''}`}>
      <div className="page-banner-media" aria-hidden="true">
        <img src={image} alt="" />
      </div>
      <div className="page-banner-scrim" aria-hidden="true" />
      <div className="container page-banner-content page-banner-animate">
        <h1 className="page-banner-title">{title}</h1>
        {subtitle ? <p className="page-banner-sub mb-0">{subtitle}</p> : null}
      </div>
    </section>
  );
}
