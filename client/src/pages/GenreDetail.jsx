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
import { genreTileImage } from '../utils/siteImages';

export default function GenreDetail() {
  const { id } = useParams();
  const { toast } = useToast();
  const [genre, setGenre] = useState(null);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      api.get(`/api/genres/${id}`),
      api.get('/api/movies', { params: { genre_ids: id } }),
    ])
      .then(([g, m]) => {
        setGenre(g.data.data);
        // Only exact matches - avoid searchRelevant leaking unrelated titles
        setMovies(m.data.exactMatch === false ? [] : m.data.data || []);
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else toast.error(getErrorMessage(err, 'Failed to load genre.'));
      })
      .finally(() => setLoading(false));
  }, [id, toast]);

  if (loading) return <LoadingSpinner />;
  if (notFound) return <NotFound resource="genre" />;
  if (!genre) return null;

  return (
    <div className="genres-page">
      <PageTitle title={genre.name} />
      <PageBanner
        title={genre.name}
        subtitle={genre.description || 'Films in this genre.'}
        image={genreTileImage(genre)}
        compact
      />
      <div className="container page-section">
        <BackLink to="/genres">All genres</BackLink>
        <div className="row g-3 g-md-4 mt-2">
          {movies.map((m) => (
            <MovieCard key={m.id} movie={m} />
          ))}
        </div>
        {!movies.length ? <div className="empty-state text-center mt-3">No movies in this genre.</div> : null}
      </div>
    </div>
  );
}