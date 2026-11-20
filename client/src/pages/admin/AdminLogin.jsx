import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { CustomInput } from '../../components/CustomInput';
import PageTitle from '../../components/PageTitle';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { getErrorMessage } from '../../services/api';
import { STUDENT_CREDIT } from '../../utils/constants';

export default function AdminLogin() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('admin@movieinfo.local');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      toast.warning('Email and password are required.');
      return;
    }
    setBusy(true);
    try {
      await login(email.trim(), password);
      toast.success('Signed in.');
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed.'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page-section">
      <PageTitle title="Admin Login" />
      <div className="mx-auto" style={{ maxWidth: 440 }}>
        <div className="admin-login-card">
          <h1 className="h4 section-heading mb-1">Admin Login</h1>
          <p className="text-muted small mb-4">Movie Information Website, Topic 39</p>
          <form onSubmit={onSubmit} noValidate>
            <div className="mb-3">
              <label className="form-label" htmlFor="email">Email</label>
              <CustomInput
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label" htmlFor="password">Password</label>
              <CustomInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100" disabled={busy}>
              {busy ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
          <div className="student-watermark mt-3">{STUDENT_CREDIT}</div>
        </div>
      </div>
    </div>
  );
}
