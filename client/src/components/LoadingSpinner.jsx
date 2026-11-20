export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="text-center py-5 loading-block" role="status">
      <div className="loading-spinner" aria-hidden="true" />
      <div className="mt-3 text-muted small">{label}</div>
    </div>
  );
}
