import { useEffect, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { IconClose, IconSearch } from './icons';
import { getPosterUrl } from '../utils/poster';

export default function SearchOverlay({
  open,
  query,
  onQueryChange,
  onClose,
  results,
  loading,
  exactMatch,
  message,
  showingTop = false,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const timer = window.setTimeout(() => inputRef.current?.focus(), 30);

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(timer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  const trimmed = query.trim();
  const statusText = useMemo(() => {
    if (loading && !results.length) return 'Loading...';
    if (!trimmed || showingTop) {
      if (!results.length) return 'No movies available yet.';
      return 'Top movies';
    }
    if (loading) return 'Searching...';
    if (!results.length) return 'No movies matched that title.';
    if (exactMatch === false) return message || 'Showing related movies.';
    return `${results.length} result${results.length === 1 ? '' : 's'}`;
  }, [trimmed, showingTop, loading, results.length, exactMatch, message]);

  if (!open) return null;

  return (
    <div className="search-overlay" role="dialog" aria-modal="true" aria-label="Search movies">
      <button type="button" className="search-overlay-backdrop" aria-label="Close search" onClick={onClose} />

      <div className="search-overlay-panel">
        <div className="search-overlay-bar">
          <span className="search-overlay-icon" aria-hidden="true">
            <IconSearch size={18} />
          </span>
          <input
            ref={inputRef}
            type="search"
            className="search-overlay-input"
            placeholder="Search movies by title..."
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            autoComplete="off"
            aria-label="Search movies"
          />
          <button type="button" className="search-overlay-close" onClick={onClose} aria-label="Close">
            <IconClose size={18} />
          </button>
        </div>

        <p className="search-overlay-status mb-0">{statusText}</p>

        <div className="search-overlay-feed">
          {loading && !results.length ? (
            <div className="search-overlay-empty">
              <div className="loading-spinner" />
            </div>
          ) : results.length ? (
            <ul className="search-result-list">
              {results.map((movie) => {
                const year = movie.release_date ? String(movie.release_date).slice(0, 4) : null;
                return (
                  <li key={movie.id}>
                    <Link
                      to={`/movies/${movie.id}`}
                      className="search-result-item"
                      onClick={onClose}
                    >
                      <img
                        src={getPosterUrl(movie.poster_path)}
                        alt=""
                        className="search-result-poster"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/placeholder-poster.svg';
                        }}
                      />
                      <span className="search-result-copy">
                        <span className="search-result-title">{movie.title}</span>
                        <span className="search-result-meta">
                          <span className="category-label">{movie.category_name}</span>
                          {year ? <span className="meta-sep" aria-hidden="true" /> : null}
                          {year ? <span>{year}</span> : null}
                        </span>
                        {movie.genres?.length ? (
                          <span className="search-result-genres">
                            {movie.genres.slice(0, 3).map((g) => g.name).join(', ')}
                          </span>
                        ) : null}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="search-overlay-empty">
              {trimmed ? `No movies found for "${trimmed}".` : 'No movies available yet.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
