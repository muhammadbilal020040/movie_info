import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import { useToast } from '../../context/ToastContext';
import api, { getErrorMessage } from '../../services/api';

export default function AdminDashboard() {
  const { toast } = useToast();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/api/movies/stats/summary')
      .then((res) => setStats(res.data.data))
      .catch((err) => toast.error(getErrorMessage(err, 'Failed to load dashboard.')))
      .finally(() => setLoading(false));
  }, [toast]);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <PageTitle title="Admin Dashboard" />
      <h1 className="h3 mb-3">Dashboard</h1>
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Movies</div>
            <div className="stat-value">{stats?.movies ?? 0}</div>
            <Link to="/admin/movies">Manage</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Categories</div>
            <div className="stat-value">{stats?.categories ?? 0}</div>
            <Link to="/admin/categories">Manage</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-label">Genres</div>
            <div className="stat-value">{stats?.genres ?? 0}</div>
            <Link to="/admin/genres">Manage</Link>
          </div>
        </div>
      </div>
      <p className="text-muted mb-0">Open Movies, Categories, or Genres from the sidebar to edit records.</p>
    </div>
  );
}
