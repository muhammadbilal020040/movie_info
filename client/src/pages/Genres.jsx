import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBanner from '../components/PageBanner';
import PageTitle from '../components/PageTitle';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { SITE_IMAGES, genreTileImage } from '../utils/siteImages';

export default function Genres() {
  const { toast } = useToast();
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/genres')
      .then((res) => setGenres(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to load genres.')))
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="genres-page">
      <PageTitle title="Genres" />
      <PageBanner
        title="Genres"
        subtitle="Action, drama, comedy - pick a genre and see what is listed."
        image={SITE_IMAGES.bannerGenres}
      />

      <div className="container page-section">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="row g-3">
            {genres.map((g, i) => (
              <div className="col-md-6 col-lg-4" key={g.id}>
                <Link to={`/genres/${g.id}`} className="browse-tile browse-tile-card" data-reveal>
                  <img src={genreTileImage(g, i)} alt="" aria-hidden="true" />
                  <span className="browse-tile-scrim" aria-hidden="true" />
                  <span className="browse-tile-copy">
                    <span className="browse-tile-title genre-label">{g.name}</span>
                    <span className="browse-tile-desc">
                      {g.description || 'No description added yet.'}
                    </span>
                    <span className="genre-chip mt-2">{g.movie_count} movies</span>
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
