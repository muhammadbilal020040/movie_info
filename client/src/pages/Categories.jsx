import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import PageBanner from '../components/PageBanner';
import PageTitle from '../components/PageTitle';
import { useToast } from '../context/ToastContext';
import api, { getErrorMessage } from '../services/api';
import { SITE_IMAGES, categoryTileImage } from '../utils/siteImages';

export default function Categories() {
  const { toast } = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/categories')
      .then((res) => setCategories(res.data.data || []))
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to load categories.')))
      .finally(() => setLoading(false));
  }, [toast]);

  return (
    <div className="categories-page">
      <PageTitle title="Categories" />
      <PageBanner
        title="Categories"
        subtitle="Hollywood, Bollywood, and the rest - open a category to see its titles."
        image={SITE_IMAGES.bannerCategories}
      />

      <div className="container page-section">
        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="row g-3">
            {categories.map((c, i) => (
              <div className="col-md-6 col-lg-4" key={c.id}>
                <Link to={`/categories/${c.id}`} className="browse-tile browse-tile-card" data-reveal>
                  <img src={categoryTileImage(c, i)} alt="" aria-hidden="true" />
                  <span className="browse-tile-scrim" aria-hidden="true" />
                  <span className="browse-tile-copy">
                    <span className="browse-tile-title category-label">{c.name}</span>
                    <span className="browse-tile-desc">
                      {c.description || 'No description added yet.'}
                    </span>
                    <span className="genre-chip mt-2">{c.movie_count} movies</span>
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
