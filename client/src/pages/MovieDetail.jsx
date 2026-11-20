import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import BackLink from '../components/BackLink';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTitle from '../components/PageTitle';
import NotFound from './NotFound';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { getPosterUrl } from '../utils/poster';

export default function MovieDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    setNotFound(false);
    api
      .get(`/api/movies/${id}`)
      .then((res) => setMovie(res.data.data))
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else toast.error(getErrorMessage(err, 'Failed to load movie.'));
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound resource="movie" />;
  if (!movie) return null;

  const poster = getPosterUrl(movie.poster_path);

  return (
    <div className="movie-detail-page">
      <PageTitle title={movie.title} />

      <section className="detail-hero">
        <div className="detail-hero-media" aria-hidden="true">
          <img src={poster} alt="" className="detail-hero-blur" />
        </div>
        <div className="detail-hero-scrim" aria-hidden="true" />

        <div className="container detail-hero-body page-banner-animate">
          <BackLink to="/movies">Back to movies</BackLink>
          <div className="row g-4 align-items-end mt-1">
            <div className="col-6 col-sm-5 col-md-4 col-lg-3">
              <img
                src={poster}
                alt={movie.title}
                className="detail-poster"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/placeholder-poster.svg';
                }}
              />
            </div>
            <div className="col-12 col-md-8 col-lg-9 movie-detail-copy">
              <h1 className="detail-hero-title text-break-safe">{movie.title}</h1>
              <p className="movie-meta detail-meta mb-3">
                <span>Released {String(movie.release_date).slice(0, 10)}</span>
                <span className="meta-sep" aria-hidden="true" />
                <span className="category-label">{movie.category_name}</span>
              </p>
              <div className="genre-chip-row mb-3">
                {movie.genres?.map((g) => (
                  <Link key={g.id} to={`/genres/${g.id}`} className="genre-chip text-decoration-none">
                    {g.name}
                  </Link>
                ))}
              </div>
              <p className="detail-copy mb-4">{movie.description}</p>
              <Link to={`/categories/${movie.category_id}`} className="btn btn-outline-primary btn-sm">
                More in {movie.category_name}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}