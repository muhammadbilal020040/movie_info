import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { IconInfo } from './icons';
import { getPosterUrl } from '../utils/poster';

/**
 * Fixed-size featured card. Content crossfades in place - no layout jump on rotate or image load.
 */
export default function FeaturedLead({ movie }) {
  const [active, setActive] = useState(movie);
  const [incoming, setIncoming] = useState(null);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    if (!movie) return;
    if (!active || active.id === movie.id) {
      setActive(movie);
      return;
    }

    const src = getPosterUrl(movie.poster_path);
    let cancelled = false;
    const img = new Image();
    img.src = src;
    const start = () => {
      if (cancelled) return;
      setIncoming(movie);
      setFadeIn(false);
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          if (!cancelled) setFadeIn(true);
        });
      });
    };

    if (img.complete) start();
    else {
      img.onload = start;
      img.onerror = start;
    }

    return () => {
      cancelled = true;
    };
  }, [movie, active]);

  useEffect(() => {
    if (!incoming || !fadeIn) return undefined;
    const timer = window.setTimeout(() => {
      setActive(incoming);
      setIncoming(null);
      setFadeIn(false);
    }, 480);
    return () => window.clearTimeout(timer);
  }, [incoming, fadeIn]);

  // Prefetch neighbors when parent rotates - parent passes current; we also warm poster of active
  useEffect(() => {
    if (!movie?.poster_path) return;
    const img = new Image();
    img.src = getPosterUrl(movie.poster_path);
  }, [movie]);

  const layers = useMemo(() => {
    const list = [];
    if (active) list.push({ movie: active, key: `a-${active.id}`, show: !incoming || !fadeIn });
    if (incoming) list.push({ movie: incoming, key: `i-${incoming.id}`, show: fadeIn });
    return list;
  }, [active, incoming, fadeIn]);

  const display = incoming && fadeIn ? incoming : active;
  if (!display) return null;

  return (
    <Link to={`/movies/${display.id}`} className="trending-lead" aria-label={display.title}>
      <span className="trending-lead-media" aria-hidden="true">
        {layers.map(({ movie: m, key, show }) => (
          <img
            key={key}
            src={getPosterUrl(m.poster_path)}
            alt=""
            className={`trending-lead-img${show ? ' is-shown' : ''}`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = '/placeholder-poster.svg';
            }}
          />
        ))}
      </span>
      <span className="trending-lead-scrim" aria-hidden="true" />
      <span className="trending-lead-copy" key={display.id}>
        <span className="trending-lead-title">{display.title}</span>
        <span className="movie-meta">
          <span className="category-label">{display.category_name}</span>
          {display.release_date ? (
            <>
              <span className="meta-sep" aria-hidden="true" />
              <span>{String(display.release_date).slice(0, 4)}</span>
            </>
          ) : null}
        </span>
        {display.description ? (
          <span className="trending-lead-blurb">
            {display.description.slice(0, 120)}
            {display.description.length > 120 ? '...' : ''}
          </span>
        ) : null}
        <span className="trending-lead-cta btn-with-icon">
          <IconInfo size={15} />
          <span>Details</span>
        </span>
      </span>
    </Link>
  );
}
