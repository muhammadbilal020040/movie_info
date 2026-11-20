import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import CustomCursor from './components/CustomCursor';
import DisableInspect from './components/DisableInspect';
import MotionEffects from './components/MotionEffects';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

import Home from './pages/Home';
import Movies from './pages/Movies';
import MovieDetail from './pages/MovieDetail';
import Categories from './pages/Categories';
import CategoryDetail from './pages/CategoryDetail';
import Genres from './pages/Genres';
import GenreDetail from './pages/GenreDetail';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies from './pages/admin/AdminMovies';
import AdminCategories from './pages/admin/AdminCategories';
import AdminGenres from './pages/admin/AdminGenres';

function PublicShell({ children }) {
  return (
    <div className="app-shell d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-grow-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <DisableInspect />
          <CustomCursor />
          <MotionEffects />
          <ToastContainer />
          <Routes>
            <Route
              path="/"
              element={
                <PublicShell>
                  <Home />
                </PublicShell>
              }
            />
            <Route
              path="/movies"
              element={
                <PublicShell>
                  <Movies />
                </PublicShell>
              }
            />
            <Route
              path="/movies/:id"
              element={
                <PublicShell>
                  <MovieDetail />
                </PublicShell>
              }
            />
            <Route
              path="/categories"
              element={
                <PublicShell>
                  <Categories />
                </PublicShell>
              }
            />
            <Route
              path="/categories/:id"
              element={
                <PublicShell>
                  <CategoryDetail />
                </PublicShell>
              }
            />
            <Route
              path="/genres"
              element={
                <PublicShell>
                  <Genres />
                </PublicShell>
              }
            />
            <Route
              path="/genres/:id"
              element={
                <PublicShell>
                  <GenreDetail />
                </PublicShell>
              }
            />
            <Route
              path="/admin/login"
              element={
                <PublicShell>
                  <AdminLogin />
                </PublicShell>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="movies" element={<AdminMovies />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="genres" element={<AdminGenres />} />
            </Route>
            <Route path="/home" element={<Navigate to="/" replace />} />
            <Route
              path="*"
              element={
                <PublicShell>
                  <NotFound />
                </PublicShell>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
}
