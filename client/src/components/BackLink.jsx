import { Link } from 'react-router-dom';
import { IconChevronLeft } from './icons';

export default function BackLink({ to, children }) {
  return (
    <Link to={to} className="back-link">
      <IconChevronLeft size={15} className="back-link-icon" />
      <span>{children}</span>
    </Link>
  );
}
