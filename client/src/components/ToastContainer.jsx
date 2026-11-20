import { useToast } from '../context/ToastContext';

const typeClass = {
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="toast-stack" aria-live="polite" aria-atomic="true">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast show align-items-center ${typeClass[t.type] || typeClass.info}`}
          role="alert"
        >
          <div className="d-flex">
            <div className="toast-body">{t.message}</div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 m-auto"
              aria-label="Close"
              onClick={() => removeToast(t.id)}
            />
          </div>
          {t.duration > 0 ? (
            <div className="toast-timer" aria-hidden="true">
              <span
                className="toast-timer-bar"
                style={{ animationDuration: `${t.duration}ms` }}
              />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
