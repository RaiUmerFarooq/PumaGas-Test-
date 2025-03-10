const express = require("express");
const ProductBanner = require("../model/productBanner");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/ErrorHandler");
const { isSeller } = require("../middleware/auth");
const router = express.Router();

// Create or Update a product banner
router.post(
  "/create-product-banner",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    const { category, subCategory, banners } = req.body;

    // Validation
    if (!category || !subCategory) {
      return next(new ErrorHandler("Category and subcategory are required.", 400));
    }
    if (!banners || !Array.isArray(banners)) {
      return next(new ErrorHandler("Banners must be provided as an array.", 400));
    }
    if (banners.length > 3) {
      return next(new ErrorHandler("You can upload a maximum of 3 images.", 400));
    }
    if (banners.every((banner) => !banner || banner.trim() === "")) {
      return next(new ErrorHandler("At least one banner URL is required.", 400));
    }

    // Sanitize banners: map empty strings or null to null
    const sanitizedBanners = banners.map((banner) =>
      banner === "" || banner === null ? null : banner.trim()
    );

    // Check if banner exists for this category and subcategory
    let productBanner = await ProductBanner.findOne({ category, subCategory });

    if (productBanner) {
      // Update existing banner
      const updatedBanners = productBanner.banners.slice(); // Copy existing banners
      sanitizedBanners.forEach((banner, index) => {
        if (banner !== undefined) { // Only update if provided
          updatedBanners[index] = banner;
        }
      });
      productBanner.banners = updatedBanners;
      await productBanner.save();
    } else {
      // Create new banner
      productBanner = await ProductBanner.create({
        category,
        subCategory,
        banners: sanitizedBanners,
      });
    }

    res.status(200).json({
      success: true,
      productBanner,
      message: "Product banner updated successfully!",
    });
  })
);

// Get product banners by category and subcategory
router.get(
  "/get-product-banners",
  catchAsyncErrors(async (req, res, next) => {
    const { category, subCategory } = req.query;

    if (!category || !subCategory) {
      return next(new ErrorHandler("Category and subcategory are required.", 400));
    }

    const productBanners = await ProductBanner.find({ category, subCategory });

    // If no banners found, return an empty array
    if (!productBanners.length) {
      return res.status(200).json({
        success: true,
        productBanners: [],
      });
    }

    // Ensure banners array is padded to 3 slots with null for consistency
    const formattedBanners = productBanners.map((banner) => ({
      ...banner._doc,
      banners: [
        banner.banners[0] !== undefined ? banner.banners[0] : null,
        banner.banners[1] !== undefined ? banner.banners[1] : null,
        banner.banners[2] !== undefined ? banner.banners[2] : null,
      ],
    }));

    res.status(200).json({
      success: true,
      productBanners: formattedBanners,
    });
  })
);

module.exports = router;