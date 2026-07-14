const express = require("express");
const {
  runScrape,
  getProducts,
  getStats,
  exportCsv,
  clearProducts,
} = require("../controllers/productController");

const router = express.Router();

router.post("/scrape", runScrape);
router.get("/", getProducts);
router.get("/stats", getStats);
router.get("/export/csv", exportCsv);
router.delete("/", clearProducts);

module.exports = router;
