import { Link } from 'react-router-dom';
import { IconInfo } from './icons';
import { getPosterUrl } from '../utils/poster';

export default function MovieCard({ movie, rail = false, reveal = false }) {
  const year = movie.release_date ? String(movie.release_date).slice(0, 4) : null;

  return (
    <div className={rail ? 'rail-item' : 'col-6 col-md-4 col-lg-3'}>
      <article className="movie-card" {...(reveal ? { 'data-reveal': true } : {})}>
        <Link to={`/movies/${movie.id}`} className="text-decoration-none d-block h-100">
          <div className="poster-wrap">
            <img
              src={getPosterUrl(movie.poster_path)}
              alt={movie.title}
              className="poster-img"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/placeholder-poster.svg';
              }}
            />
            <div className="poster-overlay">
              <span className="poster-action" aria-hidden="true">
                <IconInfo size={18} />
              </span>
            </div>
          </div>
          <div className="movie-card-body">
            <h3 className="movie-card-title">{movie.title}</h3>
            <div className="movie-meta">
              <span className="category-label">{movie.category_name}</span>
              {year ? <span className="meta-sep" aria-hidden="true" /> : null}
              {year ? <span>{year}</span> : null}
            </div>
            {movie.genres?.length ? (
              <div className="genre-chip-row">
                {movie.genres.slice(0, 2).map((g) => (
                  <span key={g.id} className="genre-chip">{g.name}</span>
                ))}
              </div>
            ) : null}
          </div>
        </Link>
      </article>
    </div>
  );
}
