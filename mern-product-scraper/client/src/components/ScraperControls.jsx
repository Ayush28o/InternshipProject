export default function ScraperControls({
  maxPages,
  setMaxPages,
  delaySeconds,
  setDelaySeconds,
  replace,
  setReplace,
  onScrape,
  onClear,
  onExport,
  loading,
  status,
}) {
  return (
    <section className="slip">
      <p className="slip-title">Pull Request Slip</p>
      <div className="slip-fields">
        <div className="field">
          <label htmlFor="maxPages">Pages to pull</label>
          <input
            id="maxPages"
            type="number"
            min="1"
            max="50"
            value={maxPages}
            onChange={(e) => setMaxPages(e.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="delaySeconds">Delay between pages (s)</label>
          <input
            id="delaySeconds"
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={delaySeconds}
            onChange={(e) => setDelaySeconds(e.target.value)}
          />
        </div>
        <div className="field" style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <input
            id="replace"
            type="checkbox"
            style={{ width: "auto" }}
            checked={replace}
            onChange={(e) => setReplace(e.target.checked)}
          />
          <label htmlFor="replace" style={{ marginBottom: 0 }}>
            Replace existing catalogue
          </label>
        </div>

        <div className="actions">
          <button className="btn-primary" onClick={onScrape} disabled={loading}>
            {loading ? "Pulling records…" : "Pull Records"}
          </button>
          <button className="btn-secondary" onClick={onExport}>
            Export CSV
          </button>
          <button className="btn-ghost" onClick={onClear}>
            Clear catalogue
          </button>
        </div>
      </div>
      {status && (
        <p className={`status-line ${status.isError ? "error" : ""}`}>{status.text}</p>
      )}
    </section>
  );
}
