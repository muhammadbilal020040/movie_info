import { useEffect, useRef, useState } from 'react';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBanner from '../components/PageBanner';
import PageTitle from '../components/PageTitle';
import CustomSelect from '../components/CustomSelect';
import CustomCheckbox from '../components/CustomCheckbox';
import { CustomInput } from '../components/CustomInput';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { SITE_IMAGES } from '../utils/siteImages';

const emptyFilters = { q: '', category_id: '', genre_ids: [] };
const DEBOUNCE_MS = 300;

export default function Movies() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [filters, setFilters] = useState(emptyFilters);
  const [debouncedQ, setDebouncedQ] = useState('');
  const [movies, setMovies] = useState([]);
  const [exactMatch, setExactMatch] = useState(true);
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const requestId = useRef(0);

  useEffect(() => {
    Promise.all([api.get('/api/categories'), api.get('/api/genres')])
      .then(([c, g]) => {
        setCategories(c.data.data || []);
        setGenres(g.data.data || []);
      })
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to load filters.')));
  }, [toast]);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedQ(filters.q.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(timer);
  }, [filters.q]);

  useEffect(() => {
    const currentId = ++requestId.current;
    setLoading(true);

    const params = {};
    if (debouncedQ) params.q = debouncedQ;
    if (filters.category_id) params.category_id = filters.category_id;
    if (filters.genre_ids.length) params.genre_ids = filters.genre_ids.join(',');

    api
      .get('/api/movies', { params })
      .then((res) => {
        if (currentId !== requestId.current) return;
        setMovies(res.data.data || []);
        setExactMatch(res.data.exactMatch !== false);
        setMessage(res.data.message || null);

      })
      .catch((err) => {
        if (currentId !== requestId.current) return;
        toast.error(getErrorMessage(err, 'Failed to search movies.'));
      })
      .finally(() => {
        if (currentId === requestId.current) setLoading(false);
      });
  }, [debouncedQ, filters.category_id, filters.genre_ids, toast]);

  const updateFilter = (patch) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const toggleGenre = (id) => {
    setFilters((prev) => {
      const exists = prev.genre_ids.includes(id);
      return {
        ...prev,
        genre_ids: exists ? prev.genre_ids.filter((g) => g !== id) : [...prev.genre_ids, id],
      };
    });
  };

  const resetAll = () => {
    setFilters({ ...emptyFilters });
    setDebouncedQ('');
    setExactMatch(true);
    setMessage(null);
  };

  const hasActiveFilters =
    Boolean(filters.q.trim()) || Boolean(filters.category_id) || filters.genre_ids.length > 0;

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div>
      <PageTitle title="Movies" />
      <PageBanner
        title="Movies"
        subtitle="Type a title, pick one category, and tick any genres. Results update as you go."
        image={SITE_IMAGES.bannerMovies}
      />

      <div className="container page-section">
        <form
          className="search-panel mb-3"
          onSubmit={(e) => {
            e.preventDefault();
            setDebouncedQ(filters.q.trim());
          }}
        >
          <div className="row g-3">
            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label" htmlFor="movie-search-q">Movie name</label>
              <CustomInput
                id="movie-search-q"
                type="search"
                placeholder="Search title..."
                value={filters.q}
                onChange={(e) => updateFilter({ q: e.target.value })}
                autoComplete="off"
              />
            </div>
            <div className="col-12 col-md-6 col-lg-4">
              <label className="form-label" htmlFor="movie-search-category">Category</label>
              <CustomSelect
                id="movie-search-category"
                value={filters.category_id}
                onChange={(category_id) => updateFilter({ category_id })}
                options={categoryOptions}
                placeholder="All categories"
                aria-label="Category"
              />
            </div>
            <div className="col-12 col-lg-4 d-flex align-items-end">
              <div className="search-actions w-100">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={resetAll}
                  disabled={!hasActiveFilters && !loading}
                >
                  Reset all
                </button>
              </div>
            </div>
            <div className="col-12">
              <label className="form-label">Genres</label>
              <div className="genre-filter-grid">
                {genres.map((g) => (
                  <CustomCheckbox
                    key={g.id}
                    id={`genre-${g.id}`}
                    label={g.name}
                    checked={filters.genre_ids.includes(g.id)}
                    onChange={() => toggleGenre(g.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </form>

        {!exactMatch && message ? (
          <div className="alert alert-info" role="status">{message}</div>
        ) : null}

        {loading ? (
          <LoadingSpinner />
        ) : movies.length ? (
          <div className="row g-3 g-md-4">
            {movies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </div>
        ) : (
          <div className="empty-state text-center">
            {hasActiveFilters ? 'Nothing matched those filters.' : 'No movies yet.'}
          </div>
        )}
      </div>
    </div>
  );
}
