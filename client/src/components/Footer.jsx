import { STUDENT_CREDIT, TOPIC_TITLE } from '../utils/constants';

export default function Footer() {
  return (
    <footer className="site-footer mt-auto">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-2">
        <div>
          <strong>{TOPIC_TITLE}</strong>
          <div className="small text-muted mt-1">
            React, Bootstrap, Node, Express, MySQL
          </div>
        </div>
        <div className="student-watermark">{STUDENT_CREDIT}</div>
      </div>
    </footer>
  );
}
