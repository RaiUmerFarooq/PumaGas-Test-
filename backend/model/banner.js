const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema({
  images: {
    type: [String], // Array of image URLs
    required: true,
    validate: {
      validator: function (arr) {
        return arr.length <= 3; // Ensures no more than 3 images
      },
      message: "You can upload a maximum of 3 images."
    },
    default: ["", "", ""], // Ensures MongoDB always has 3 slots
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Ensure MongoDB always has 3 slots (even if some are empty)
bannerSchema.pre("save", function (next) {
  while (this.images.length < 3) {
    this.images.push(""); // Fill empty slots with empty strings
  }
  next();
});

module.exports = mongoose.model("Banner", bannerSchema);
