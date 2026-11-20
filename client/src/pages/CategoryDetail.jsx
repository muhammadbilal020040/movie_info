import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import BackLink from '../components/BackLink';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBanner from '../components/PageBanner';
import PageTitle from '../components/PageTitle';
import NotFound from './NotFound';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { categoryTileImage } from '../utils/siteImages';

export default function CategoryDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [category, setCategory] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/categories/${id}`),
      api.get('/api/movies', { params: { category_id: id } }),
    ])
      .then(([c, m]) => {
        setCategory(c.data.data);
        // Only exact matches - avoid searchRelevant leaking unrelated titles
        setMovies(m.data.exactMatch === false ? [] : m.data.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else toast.error(getErrorMessage(err, 'Failed to load category.'));
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound resource="category" />;
  if (!category) return null;

  return (
    <div className="categories-page">
      <PageTitle title={category.name} />
      <PageBanner
        title={category.name}
        subtitle={category.description || 'Films in this category.'}
        image={categoryTileImage(category)}
        compact
      />
      <div className="container page-section">
        <BackLink to="/categories">All categories</BackLink>
        <div className="row g-3 g-md-4 mt-2">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        {!movies.length ? <div className="empty-state text-center mt-3">No movies in this category.</div> : null}
      </div>
    </div>
  );
}
