export default function StatsBar({ stats }) {
  if (!stats || !stats.totalProducts) return null;

  const format = (n) => (typeof n === "number" ? n.toFixed(2) : "0.00");

  return (
    <div className="stamp-row">
      <div className="stamp">
        <span className="stamp-value">{stats.totalProducts}</span>
        <span className="stamp-label">Entries catalogued</span>
      </div>
      <div className="stamp">
        <span className="stamp-value">£{format(stats.avgPrice)}</span>
        <span className="stamp-label">Average price</span>
      </div>
      <div className="stamp">
        <span className="stamp-value">{format(stats.avgRating)} / 5</span>
        <span className="stamp-label">Average rating</span>
      </div>
    </div>
  );
}
