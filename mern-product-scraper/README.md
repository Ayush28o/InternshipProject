# The Catalogue Scraper — MERN Stack

A full MERN (MongoDB, Express, React, Node) rewrite of the original Python
`Task 04` script. It scrapes product name, price, and rating from
[books.toscrape.com](https://books.toscrape.com), stores the results in
MongoDB, and gives you a small web app to trigger scrapes, browse the
results, and export them to CSV — all the same behavior as the original
script, now with an API and UI on top.

```
mern-product-scraper/
├── server/     Express API + MongoDB models + scraper (axios + cheerio)
└── client/     React (Vite) single-page app
```

## How it maps to the original script

| Python original                    | MERN equivalent                                   |
|------------------------------------|----------------------------------------------------|
| `requests` + `BeautifulSoup`       | `axios` + `cheerio` (`server/scraper/scraper.js`)   |
| `RATING_WORDS` dict                | Same map, ported 1:1                                |
| `extract_products_from_page()`     | `extractProductsFromPage()`                         |
| `scrape_all_pages()`               | `scrapeAllPages()`                                  |
| `save_to_csv()` → `products.csv`   | `GET /api/products/export/csv` (streamed download) |
| Running the script from a terminal | Clicking "Pull Records" in the browser              |
| CSV as the only output             | MongoDB collection + CSV export + live UI           |

## Prerequisites

- Node.js 18+
- A MongoDB instance — either local (`mongod` running on `27017`) or a free
  [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string

## 1. Backend setup

```bash
cd server
cp .env.example .env      # then edit MONGODB_URI if needed
npm install
npm run dev                # nodemon, auto-restarts on changes
# or: npm start
```

The API starts on `http://localhost:5000` by default.

### API endpoints

| Method | Route                        | Description                                  |
|--------|-------------------------------|-----------------------------------------------|
| POST   | `/api/products/scrape`        | Run a scrape. Body: `{ maxPages, delaySeconds, replace }` |
| GET    | `/api/products`                | List products. Query: `sortBy, order, minRating, search` |
| GET    | `/api/products/stats`          | Aggregate totals, average price/rating        |
| GET    | `/api/products/export/csv`     | Download all products as `products.csv`      |
| DELETE | `/api/products`                | Clear the whole catalogue                     |

## 2. Frontend setup

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api` requests to
`http://localhost:5000`, so both servers need to be running side by side.

## 3. Using the app

1. Set **pages to pull** (mirrors `max_pages`) and **delay between pages**
   (mirrors `delay_seconds` — keep this polite to the target server).
2. Click **Pull Records** to scrape and store results in MongoDB.
3. Browse, search, and sort the catalogue.
4. Click **Export CSV** to download `products.csv`, same format as the
   original script's output (name, price, rating), with `sourcePage` and
   `sourceUrl` added for traceability.

## Scraping a different store

Just like the original script's comment says: update the target and
selectors in one place. In `server/scraper/scraper.js`:

- Change `DEFAULT_BASE_URL` (or pass `baseUrl` in the `POST /scrape` body).
- Update the CSS selectors inside `extractProductsFromPage()` to match the
  new site's HTML — same idea as editing `extract_products_from_page()` in
  the Python version.

## Notes

- The scraper respects the delay between page requests server-side, same
  as `time.sleep()` in the original.
- Scraping stops early if a page returns no product cards, or if a request
  fails — same "ran past the last page" behavior as the Python version.
- Each scrape run is tagged with a `scrapeRunId` in MongoDB, so you can
  extend the app later to compare runs over time if you want to track price
  changes.
