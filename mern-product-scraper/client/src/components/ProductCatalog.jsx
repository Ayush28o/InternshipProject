function Stars({ rating }) {
  const full = "★".repeat(rating);
  const empty = "☆".repeat(5 - rating);
  return (
    <span className="card-stars" aria-label={`${rating} out of 5 stars`}>
      {full}
      {empty}
    </span>
  );
}

export default function ProductCatalog({ products, search, setSearch, sortBy, setSortBy, order, setOrder }) {
  return (
    <section>
      <div className="catalog-toolbar">
        <div className="search-field">
          <input
            type="text"
            placeholder="Search the catalogue…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select
          className="sort-select"
          value={`${sortBy}-${order}`}
          onChange={(e) => {
            const [field, dir] = e.target.value.split("-");
            setSortBy(field);
            setOrder(dir);
          }}
        >
          <option value="createdAt-desc">Newest first</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating-desc">Rating: high to low</option>
          <option value="name-asc">Title: A–Z</option>
        </select>
      </div>

      {products.length === 0 ? (
        <div className="empty-state">
          <strong>The catalogue is empty.</strong>
          Fill out the pull request slip above and pull some records to get started.
        </div>
      ) : (
        <div className="catalog-grid">
          {products.map((p) => (
            <article className="card" key={p._id}>
              <h3 className="card-title">{p.name}</h3>
              <div className="card-row">
                <span className="card-price">
                  {p.currency || "£"}
                  {p.price.toFixed(2)}
                </span>
                <Stars rating={p.rating} />
              </div>
              <p className="card-page">Catalogue page {p.sourcePage}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
