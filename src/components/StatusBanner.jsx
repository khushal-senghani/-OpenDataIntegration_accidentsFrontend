/** Shows one of loading / error / info state — pass only one prop. */
export default function StatusBanner({ loading, error, info }) {
  if (loading) return <div className="status-banner loading">Loading…</div>;
  if (error) return <div className="status-banner error">{error.message || String(error)}</div>;
  if (info) return <div className="status-banner info">{info}</div>;
  return null;
}
