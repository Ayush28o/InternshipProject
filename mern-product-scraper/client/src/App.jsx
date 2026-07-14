import { useEffect, useState, useCallback } from "react";
import ScraperControls from "./components/ScraperControls.jsx";
import StatsBar from "./components/StatsBar.jsx";
import ProductCatalog from "./components/ProductCatalog.jsx";
import { scrapeProducts, fetchProducts, fetchStats, clearProducts, exportCsvUrl } from "./api.js";

export default function App() {
  const [maxPages, setMaxPages] = useState(5);
  const [delaySeconds, setDelaySeconds] = useState(1);
  const [replace, setReplace] = useState(true);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const [products, setProducts] = useState([]);
  const [stats, setStats] = useState(null);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  const loadProducts = useCallback(async () => {
    try {
      const { data } = await fetchProducts({ sortBy, order, search: search || undefined });
      setProducts(data.products);
    } catch (err) {
      setStatus({ text: `Could not load the catalogue: ${err.message}`, isError: true });
    }
  }, [sortBy, order, search]);

  const loadStats = useCallback(async () => {
    try {
      const { data } = await fetchStats();
      setStats(data);
    } catch {
      // stats are non-critical; fail quietly
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    loadStats();
  }, [loadStats, products.length]);

  async function handleScrape() {
    setLoading(true);
    setStatus({ text: "Sending librarians into the stacks…", isError: false });
    try {
      const { data } = await scrapeProducts({
        maxPages: Number(maxPages),
        delaySeconds: Number(delaySeconds),
        replace,
      });
      setStatus({ text: data.message, isError: false });
      await loadProducts();
      await loadStats();
    } catch (err) {
      setStatus({
        text: err.response?.data?.message || `Scrape failed: ${err.message}`,
        isError: true,
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleClear() {
    if (!window.confirm("Clear every entry from the catalogue?")) return;
    try {
      await clearProducts();
      setStatus({ text: "Catalogue cleared.", isError: false });
      await loadProducts();
      await loadStats();
    } catch (err) {
      setStatus({ text: `Could not clear catalogue: ${err.message}`, isError: true });
    }
  }

  function handleExport() {
    window.open(exportCsvUrl(), "_blank");
  }

  return (
    <div className="app">
      <header className="ledger-header">
        <div>
          <p className="eyebrow">MERN · Web Scraper</p>
          <h1>The Catalogue Scraper</h1>
          <p className="subtitle">
            Pulls product name, price, and rating from an online store's listing pages and
            files each one away in the catalogue below.
          </p>
        </div>
        <span className="source-tag">books.toscrape.com</span>
      </header>

      <ScraperControls
        maxPages={maxPages}
        setMaxPages={setMaxPages}
        delaySeconds={delaySeconds}
        setDelaySeconds={setDelaySeconds}
        replace={replace}
        setReplace={setReplace}
        onScrape={handleScrape}
        onClear={handleClear}
        onExport={handleExport}
        loading={loading}
        status={status}
      />

      <StatsBar stats={stats} />

      <ProductCatalog
        products={products}
        search={search}
        setSearch={setSearch}
        sortBy={sortBy}
        setSortBy={setSortBy}
        order={order}
        setOrder={setOrder}
      />
    </div>
  );
}
