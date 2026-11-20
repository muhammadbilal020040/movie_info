import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import CustomCheckbox from '../../components/CustomCheckbox';
import CustomSelect from '../../components/CustomSelect';
import { CustomFileInput, CustomInput, CustomTextarea } from '../../components/CustomInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import { useToast } from '../../context/ToastContext';
import api, { getErrorMessage } from '../../services/api';
import { getPosterUrl } from '../../utils/poster';

const emptyForm = {
  title: '',
  description: '',
  category_id: '',
  release_date: '',
  genre_ids: [],
  poster: null,
};

export default function AdminMovies() {
  const { toast } = useToast();
  const [movies, setMovies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [m, c, g] = await Promise.all([
        api.get('/api/movies'),
        api.get('/api/categories'),
        api.get('/api/genres'),
      ]);
      setMovies(m.data.data || []);
      setCategories(c.data.data || []);
      setGenres(g.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load movies.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleGenre = (id) => {
    setForm((prev) => {
      const exists = prev.genre_ids.includes(id);
      return {
        ...prev,
        genre_ids: exists ? prev.genre_ids.filter((g) => g !== id) : [...prev.genre_ids, id],
      };
    });
  };

  const startEdit = (movie) => {
    setEditId(movie.id);
    setForm({
      title: movie.title,
      description: movie.description,
      category_id: String(movie.category_id),
      release_date: String(movie.release_date).slice(0, 10),
      genre_ids: (movie.genres || []).map((g) => g.id),
      poster: null,
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setEditId(null);
    setForm(emptyForm);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.category_id || !form.release_date) {
      toast.warning('Title, description, category, and release date are required.');
      return;
    }
    if (!form.genre_ids.length) {
      toast.warning('Select at least one genre.');
      return;
    }

    const data = new FormData();
    data.append('title', form.title.trim());
    data.append('description', form.description.trim());
    data.append('category_id', form.category_id);
    data.append('release_date', form.release_date);
    data.append('genre_ids', JSON.stringify(form.genre_ids));
    if (form.poster) data.append('poster', form.poster);

    setBusy(true);
    try {
      if (editId) {
        await api.put(`/api/movies/${editId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Movie updated.');
      } else {
        await api.post('/api/movies', data, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        toast.success('Movie created.');
      }
      resetForm();
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed.'));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await api.delete(`/api/movies/${deleteTarget.id}`);
      toast.success('Movie deleted.');
      setDeleteTarget(null);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Delete failed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <PageTitle title="Admin Movies" />
      <h1 className="h3 mb-3">Manage Movies</h1>

      <form className="admin-form mb-4" onSubmit={onSubmit} noValidate>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Title</label>
            <CustomInput
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Category</label>
            <CustomSelect
              value={form.category_id}
              onChange={(category_id) => setForm((p) => ({ ...p, category_id }))}
              required
              placeholder="Select category"
              options={categories.map((c) => ({ value: String(c.id), label: c.name }))}
              aria-label="Category"
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Release date</label>
            <CustomInput
              type="date"
              value={form.release_date}
              onChange={(e) => setForm((p) => ({ ...p, release_date: e.target.value }))}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <CustomTextarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              required
            />
          </div>
          <div className="col-12">
            <label className="form-label">Genres (multiple)</label>
            <div className="genre-filter-grid">
              {genres.map((g) => (
                <CustomCheckbox
                  key={g.id}
                  id={`admin-genre-${g.id}`}
                  label={g.name}
                  checked={form.genre_ids.includes(g.id)}
                  onChange={() => toggleGenre(g.id)}
                />
              ))}
            </div>
          </div>
          <div className="col-12 col-md-6">
            <label className="form-label">Poster image (optional)</label>
            <CustomFileInput
              accept="image/jpeg,image/png,image/webp"
              fileName={form.poster?.name}
              onChange={(e) => setForm((p) => ({ ...p, poster: e.target.files?.[0] || null }))}
            />
            <div className="form-text">JPG/PNG/WEBP, max 2MB. Stored on filesystem.</div>
          </div>
          <div className="col-12 col-md-6 d-flex align-items-end">
            <div className="search-actions w-100">
              <button className="btn btn-primary" type="submit" disabled={busy}>
                {editId ? 'Update movie' : 'Add movie'}
              </button>
              {editId ? (
                <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                  Cancel edit
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="table-responsive">
          <table className="table table-striped align-middle">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Category</th>
                <th>Genres</th>
                <th>Release</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {movies.map((movie) => (
                <tr key={movie.id}>
                  <td>
                    <img
                      src={getPosterUrl(movie.poster_path)}
                      alt=""
                      className="admin-thumb"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/placeholder-poster.svg';
                      }}
                    />
                  </td>
                  <td className="text-break-safe">{movie.title}</td>
                  <td>{movie.category_name}</td>
                  <td className="small">{(movie.genres || []).map((g) => g.name).join(', ') || 'None'}</td>
                  <td>{String(movie.release_date).slice(0, 10)}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEdit(movie)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(movie)}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmModal
        show={Boolean(deleteTarget)}
        title="Delete movie?"
        message={deleteTarget ? `Delete "${deleteTarget.title}" permanently?` : ''}
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />
    </div>
  );
}
