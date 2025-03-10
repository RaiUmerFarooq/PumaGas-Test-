const mongoose = require("mongoose");

const productBannerSchema = new mongoose.Schema({
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  banners: {
    type: [String],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

function arrayLimit(val) {
  return val.length <= 3;
}

module.exports = mongoose.model("ProductBanner", productBannerSchema);