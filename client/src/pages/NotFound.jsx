import { Link } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import { IconFilm } from '../components/icons';
import { STUDENT_CREDIT } from '../utils/constants';

export default function NotFound({ resource = 'page' }) {
  return (
    <div className="container page-section">
      <PageTitle title="Not Found" />
      <div className="not-found-page text-center mx-auto" style={{ maxWidth: 520 }}>
        <div className="not-found-mark" aria-hidden="true">
          <IconFilm size={28} />
        </div>
        <div className="display-1">404</div>
        <h1 className="h3 section-heading mt-2">No {resource} here</h1>
        <p className="text-muted mx-auto mb-4" style={{ maxWidth: '28rem' }}>
          That link looks wrong, or the record was deleted. Head back to movies and try again.
        </p>
        <div className="d-flex justify-content-center flex-wrap gap-2">
          <Link to="/" className="btn btn-primary">Home</Link>
          <Link to="/movies" className="btn btn-outline-primary">Browse Movies</Link>
        </div>
        <div className="student-watermark mt-4">{STUDENT_CREDIT}</div>
      </div>
    </div>
  );
}
