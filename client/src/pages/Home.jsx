import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FeaturedLead from '../components/FeaturedLead';
import HeroSlideshow from '../components/HeroSlideshow';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageTitle from '../components/PageTitle';
import { IconArrowRight } from '../components/icons';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { getPosterUrl } from '../utils/poster';
import { HERO_SLIDES, SITE_IMAGES } from '../utils/siteImages';
import { STUDENT_CREDIT, TOPIC_TITLE } from '../utils/constants';

const FEATURED_ROTATE_MS = 7000;

export default function Home() {
  const { toast } = useToast();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leadIndex, setLeadIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    api
      .get('/api/movies')
      .then((res) => setMovies(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err, 'Could not load movies.')))
      .finally(() => setLoading(false));
  }, [toast]);

  useEffect(() => {
    if (!movies.length) return;
    setLeadIndex((prev) => (prev >= movies.length ? 0 : prev));
  }, [movies.length]);

  const safeIndex = movies.length ? leadIndex % movies.length : 0;
  const lead = movies[safeIndex];
  const side = movies.length > 1
    ? Array.from({ length: Math.min(4, movies.length - 1) }, (_, i) =>
        movies[(safeIndex + i + 1) % movies.length]
      )
    : [];
  const grid = movies.filter((m) => !lead || m.id !== lead.id).slice(0, 8);

  useEffect(() => {
    if (movies.length < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const timer = window.setInterval(() => {
      setLeadIndex((prev) => (prev + 1) % movies.length);
    }, FEATURED_ROTATE_MS);

    return () => window.clearInterval(timer);
  }, [movies.length, paused]);

  // Prefetch upcoming featured posters so swaps don't wait on network
  useEffect(() => {
    if (movies.length < 2) return;
    const next = movies[(safeIndex + 1) % movies.length];
    if (!next) return;
    const img = new Image();
    img.src = getPosterUrl(next.poster_path);
  }, [movies, safeIndex]);

  return (
    <div className="home-page">
      <PageTitle title="Home" />

      <section className="hero-band">
        <HeroSlideshow slides={HERO_SLIDES} />
        <div className="hero-scrim" aria-hidden="true" />

        <div className="container hero-content hero-content-animate">
          <p className="eyebrow mb-2">Topic 39, Software Engineering</p>
          <h1 className="mb-2">{TOPIC_TITLE}</h1>
          <p className="lead">
            Find films by name, category, or genre. Posters are stored on the server and managed from the admin panel.
          </p>
          <div className="hero-actions">
            <Link to="/movies" className="btn btn-hero-primary">Browse Movies</Link>
            <Link to="/categories" className="btn btn-hero-secondary">Categories</Link>
          </div>
          <p className="hero-credit student-watermark mb-0">{STUDENT_CREDIT}</p>
        </div>
      </section>

      <section className="trending-section" data-reveal>
        <div className="container">
          <div className="section-head">
            <div>
              <p className="rail-kicker mb-1">Spotlight</p>
              <h2 className="h3 section-heading mb-0">Featured movies</h2>
            </div>
            <Link to="/movies" className="text-link">
              <span>All movies</span>
              <IconArrowRight size={15} />
            </Link>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : lead ? (
            <div
              className={`trending-layout${side.length ? '' : ' is-solo'}`}
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <FeaturedLead movie={lead} />

              {side.length ? (
                <div className="trending-side">
                  {side.map((m) => (
                    <Link key={m.id} to={`/movies/${m.id}`} className="trending-side-card">
                      <img
                        src={getPosterUrl(m.poster_path)}
                        alt={m.title}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = '/placeholder-poster.svg';
                        }}
                      />
                      <span className="trending-side-copy">
                        <span className="trending-side-title">{m.title}</span>
                        <span className="category-label">{m.category_name}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="empty-state text-center">No movies added yet.</div>
          )}
        </div>
      </section>

      {!loading && grid.length ? (
        <section className="rail-section more-movies-section" data-reveal>
          <div className="container">
            <div className="section-head">
              <div>
                <p className="rail-kicker mb-1">Browse</p>
                <h2 className="h3 section-heading mb-0">More movies</h2>
              </div>
            </div>
            <div className="row g-3 g-md-4 more-movies-grid">
              {grid.map((m) => (
                <MovieCard key={m.id} movie={m} reveal={false} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="browse-strip" data-reveal>
        <div className="container">
          <div className="row g-3">
            <div className="col-md-6">
              <Link to="/categories" className="browse-tile">
                <img src={SITE_IMAGES.homeBrowseCategories} alt="" aria-hidden="true" />
                <span className="browse-tile-scrim" aria-hidden="true" />
                <span className="browse-tile-copy">
                  <span className="rail-kicker">Group by</span>
                  <span className="browse-tile-title">Categories</span>
                </span>
              </Link>
            </div>
            <div className="col-md-6">
              <Link to="/genres" className="browse-tile">
                <img src={SITE_IMAGES.homeBrowseGenres} alt="" aria-hidden="true" />
                <span className="browse-tile-scrim" aria-hidden="true" />
                <span className="browse-tile-copy">
                  <span className="rail-kicker">Filter by</span>
                  <span className="browse-tile-title">Genres</span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
