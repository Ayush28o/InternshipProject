const crypto = require("crypto");
const Product = require("../models/Product");
const { scrapeAllPages, DEFAULT_BASE_URL } = require("../scraper/scraper");
const { productsToCsv } = require("../utils/csvExport");

/**
 * POST /api/products/scrape
 * Body: { maxPages?: number, delaySeconds?: number, baseUrl?: string, replace?: boolean }
 */
async function runScrape(req, res) {
  try {
    const {
      maxPages = 5,
      delaySeconds = 1,
      baseUrl = DEFAULT_BASE_URL,
      replace = false,
    } = req.body || {};

    const safeMaxPages = Math.min(Math.max(parseInt(maxPages, 10) || 1, 1), 50);
    const safeDelay = Math.min(Math.max(parseFloat(delaySeconds) || 0, 0), 5);

    const scrapeRunId = crypto.randomUUID();

    const scraped = await scrapeAllPages({
      baseUrl,
      maxPages: safeMaxPages,
      delaySeconds: safeDelay,
    });

    if (replace) {
      await Product.deleteMany({});
    }

    const docs = scraped.map((p) => ({ ...p, scrapeRunId }));
    const inserted = docs.length ? await Product.insertMany(docs) : [];

    res.status(201).json({
      message: `Scraped ${inserted.length} products across up to ${safeMaxPages} page(s).`,
      scrapeRunId,
      count: inserted.length,
    });
  } catch (err) {
    console.error("Scrape failed:", err);
    res.status(500).json({ message: "Scrape failed", error: err.message });
  }
}

/**
 * GET /api/products
 * Query: ?sortBy=price|rating|name&order=asc|desc&minRating=&search=
 */
async function getProducts(req, res) {
  try {
    const { sortBy = "createdAt", order = "desc", minRating, search } = req.query;

    const filter = {};
    if (minRating) filter.rating = { $gte: parseFloat(minRating) };
    if (search) filter.name = { $regex: search, $options: "i" };

    const sortField = ["price", "rating", "name", "createdAt"].includes(sortBy)
      ? sortBy
      : "createdAt";
    const sortDir = order === "asc" ? 1 : -1;

    const products = await Product.find(filter).sort({ [sortField]: sortDir }).lean();

    res.json({ count: products.length, products });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch products", error: err.message });
  }
}

/**
 * GET /api/products/stats
 */
async function getStats(req, res) {
  try {
    const [stats] = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          avgRating: { $avg: "$rating" },
          maxPrice: { $max: "$price" },
          minPrice: { $min: "$price" },
        },
      },
    ]);

    res.json(
      stats || {
        totalProducts: 0,
        avgPrice: 0,
        avgRating: 0,
        maxPrice: 0,
        minPrice: 0,
      }
    );
  } catch (err) {
    res.status(500).json({ message: "Failed to compute stats", error: err.message });
  }
}

/**
 * GET /api/products/export/csv
 */
async function exportCsv(req, res) {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 }).lean();

    if (!products.length) {
      return res.status(404).json({ message: "No products to export yet." });
    }

    const csv = productsToCsv(products);
    res.header("Content-Type", "text/csv");
    res.attachment("products.csv");
    res.send(csv);
  } catch (err) {
    res.status(500).json({ message: "Failed to export CSV", error: err.message });
  }
}

/**
 * DELETE /api/products
 */
async function clearProducts(req, res) {
  try {
    const result = await Product.deleteMany({});
    res.json({ message: `Cleared ${result.deletedCount} product(s).` });
  } catch (err) {
    res.status(500).json({ message: "Failed to clear products", error: err.message });
  }
}

module.exports = {
  runScrape,
  getProducts,
  getStats,
  exportCsv,
  clearProducts,
};
