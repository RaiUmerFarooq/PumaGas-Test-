const express = require("express");
const Banner = require("../model/banner");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isAuthenticated, isSeller } = require("../middleware/auth");
const router = express.Router();

// Update or Create Home Banner
router.post(
  "/update-home-banner",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    console.log("Received Data:", req.body); // Debug log

    const { images } = req.body;

    // Check if images is provided and valid
    if (!images) {
      return next(new ErrorHandler("Images field is required.", 400));
    }
    if (!Array.isArray(images) || images.length > 3) {
      return next(new ErrorHandler("You can upload a maximum of 3 images.", 400));
    }

    let banner = await Banner.findOne();
    if (banner) {
      // Update existing banner
      const updatedImages = banner.images.slice(); // Copy current images
      images.forEach((img, index) => {
        // Update slot if img is a non-empty string, null, or empty string
        if (img !== undefined) { // Only update if provided in request
          updatedImages[index] = img === "" || img === null ? null : img.trim();
        }
      });
      banner.images = updatedImages;
      await banner.save();
    } else {
      // Create new banner, mapping "" or null to null
      const sanitizedImages = images.map((img) => (img === "" || img === null ? null : img.trim()));
      banner = await Banner.create({ images: sanitizedImages });
    }

    res.status(200).json({
      success: true,
      banner,
      message: "Home banner updated successfully!",
    });
  })
);

// Get the Home Banner
router.get(
  "/get-home-banner",
  catchAsyncErrors(async (req, res, next) => {
    const banner = await Banner.findOne().sort({ createdAt: -1 });

    if (!banner) {
      return next(new ErrorHandler("No home banner found.", 404));
    }

    // Ensure response always contains 3 image slots, preserving null
    const banners = [
      banner.images[0] !== undefined ? banner.images[0] : null,
      banner.images[1] !== undefined ? banner.images[1] : null,
      banner.images[2] !== undefined ? banner.images[2] : null,
    ];

    res.status(200).json({
      success: true,
      banners,
    });
  })
);

module.exports = router;