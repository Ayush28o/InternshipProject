const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      default: "£",
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },
    sourcePage: {
      type: Number,
      required: true,
    },
    sourceUrl: {
      type: String,
      required: true,
    },
    scrapeRunId: {
      type: String,
      index: true,
    },
  },
  { timestamps: true }
);

// Prevent exact duplicate entries from repeated scrape runs of the same page
productSchema.index({ name: 1, price: 1, sourceUrl: 1 }, { unique: false });

module.exports = mongoose.model("Product", productSchema);
