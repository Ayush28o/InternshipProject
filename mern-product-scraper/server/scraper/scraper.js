const axios = require("axios");
const cheerio = require("cheerio");

// books.toscrape.com uses star-rating classes like "One", "Two", "Three"...
const RATING_WORDS = {
  One: 1,
  Two: 2,
  Three: 3,
  Four: 4,
  Five: 5,
};

const DEFAULT_BASE_URL = "https://books.toscrape.com/catalogue/page-{}.html";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Download a page and return a Cheerio object, or null on failure.
 */
async function fetchPage(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { "User-Agent": "Mozilla/5.0 (educational scraping project)" },
      validateStatus: (status) => status < 400,
    });
    return cheerio.load(response.data);
  } catch (err) {
    console.error(`Failed to fetch ${url}: ${err.message}`);
    return null;
  }
}

/**
 * Pull name, price, and rating out of every product card on the page.
 */
function extractProductsFromPage($, pageNum, pageUrl) {
  const products = [];

  $("article.product_pod").each((_, el) => {
    const article = $(el);

    const name = article.find("h3 a").attr("title")?.trim() || "Unknown";

    const priceText = article.find("p.price_color").text().trim();
    // Price looks like "£51.77" -> strip currency symbol, keep numeric value
    const currencyMatch = priceText.match(/^[^\d.]+/);
    const currency = currencyMatch ? currencyMatch[0].trim() : "£";
    const price = parseFloat(priceText.replace(/[^\d.]/g, "")) || 0;

    // class list looks like "star-rating Three"
    const ratingClasses = (article.find("p.star-rating").attr("class") || "").split(/\s+/);
    const ratingWord = ratingClasses.find((c) => RATING_WORDS[c] !== undefined);
    const rating = RATING_WORDS[ratingWord] ?? 0;

    products.push({
      name,
      price,
      currency,
      rating,
      sourcePage: pageNum,
      sourceUrl: pageUrl,
    });
  });

  return products;
}

/**
 * Loop through listing pages and collect all product data.
 * Reports progress via the optional onProgress callback after each page.
 */
async function scrapeAllPages({
  baseUrl = DEFAULT_BASE_URL,
  maxPages = 5,
  delaySeconds = 1,
  onProgress = null,
} = {}) {
  const allProducts = [];

  for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
    const url = baseUrl.replace("{}", pageNum);
    const $ = await fetchPage(url);

    if (!$) {
      // e.g. ran past the last page, or a network error occurred
      break;
    }

    const pageProducts = extractProductsFromPage($, pageNum, url);

    if (pageProducts.length === 0) {
      break;
    }

    allProducts.push(...pageProducts);

    if (onProgress) {
      onProgress({ page: pageNum, found: pageProducts.length, total: allProducts.length });
    }

    if (pageNum < maxPages) {
      await sleep(delaySeconds * 1000); // be polite to the server
    }
  }

  return allProducts;
}

module.exports = {
  fetchPage,
  extractProductsFromPage,
  scrapeAllPages,
  RATING_WORDS,
  DEFAULT_BASE_URL,
};
