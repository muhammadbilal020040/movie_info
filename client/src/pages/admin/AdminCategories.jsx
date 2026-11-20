import { useEffect, useState } from 'react';
import ConfirmModal from '../../components/ConfirmModal';
import { CustomInput } from '../../components/CustomInput';
import LoadingSpinner from '../../components/LoadingSpinner';
import PageTitle from '../../components/PageTitle';
import { useToast } from '../../context/ToastContext';
import api, { getErrorMessage } from '../../services/api';

const emptyForm = { name: '', description: '' };

export default function AdminCategories() {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/categories');
      setItems(res.data.data || []);
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to load categories.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast.warning('Category name is required.');
      return;
    }
    setBusy(true);
    try {
      if (editId) {
        await api.put(`/api/categories/${editId}`, form);
        toast.success('Category updated.');
      } else {
        await api.post('/api/categories', form);
        toast.success('Category created.');
      }
      setForm(emptyForm);
      setEditId(null);
      await load();
    } catch (err) {
      toast.error(getErrorMessage(err, 'Save failed.'));
    } finally {
      setBusy(false);
    }
  };

  const startEdit = (item) => {
    setEditId(item.id);
    setForm({ name: item.name, description: item.description || '' });
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setBusy(true);
    try {
      await api.delete(`/api/categories/${deleteTarget.id}`);
      toast.success('Category deleted.');
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
      <PageTitle title="Admin Categories" />
      <h1 className="h3 mb-3">Manage Categories</h1>

      <form className="admin-form mb-4" onSubmit={onSubmit}>
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Name</label>
            <CustomInput
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              required
            />
          </div>
          <div className="col-md-6">
            <label className="form-label">Description</label>
            <CustomInput
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            />
          </div>
          <div className="col-md-2 d-flex align-items-end gap-2">
            <button className="btn btn-primary" type="submit" disabled={busy}>
              {editId ? 'Update' : 'Add'}
            </button>
            {editId ? (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => {
                  setEditId(null);
                  setForm(emptyForm);
                }}
              >
                Cancel
              </button>
            ) : null}
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
                <th>Name</th>
                <th>Movies</th>
                <th>Description</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.movie_count}</td>
                  <td className="small text-muted">{item.description || 'No description'}</td>
                  <td>
                    <div className="admin-actions">
                      <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => startEdit(item)}>
                        Edit
                      </button>
                      <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setDeleteTarget(item)}>
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
        title="Delete category?"
        message={
          deleteTarget
            ? `Delete "${deleteTarget.name}"? This is blocked if movies still use it.`
            : ''
        }
        confirmLabel="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        busy={busy}
      />
    </div>
  );
}
