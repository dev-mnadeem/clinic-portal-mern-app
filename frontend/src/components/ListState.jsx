// Renders the loading, error and empty states shared by every list in the
// portal, and the children only when there are rows to show.
export default function ListState({loading, error, empty, emptyText, onRetry, children}) {
  if (error) return <div className="notice notice-error" role="alert">
    <p>{error}</p>
    {onRetry && <button type="button" className="button button-quiet" onClick={onRetry}>Try again</button>}
  </div>;
  if (loading && empty) return <p className="notice" role="status">Loading…</p>;
  if (empty) return <p className="notice notice-empty">{emptyText}</p>;
  return children;
}
