const { Parser } = require("json2csv");

function productsToCsv(products) {
  const fields = [
    { label: "name", value: "name" },
    { label: "price", value: "price" },
    { label: "currency", value: "currency" },
    { label: "rating", value: "rating" },
    { label: "sourcePage", value: "sourcePage" },
    { label: "sourceUrl", value: "sourceUrl" },
  ];

  const parser = new Parser({ fields });
  return parser.parse(products);
}

module.exports = { productsToCsv };
