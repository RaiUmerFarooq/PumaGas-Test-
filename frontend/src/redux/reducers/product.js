import { createReducer } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false, // Start as false, set to true only on request
  products: [], // Shop-specific products
  allProducts: [], // All products (global)
  product: null, // Single product from create
  success: false,
  error: null,
  message: null, // For delete success message
};

export const productReducer = createReducer(initialState, (builder) => {
  builder
    // Create Product
    .addCase("productCreateRequest", (state) => {
      state.isLoading = true;
      state.success = false;
      state.error = null;
    })
    .addCase("productCreateSuccess", (state, action) => {
      state.isLoading = false;
      state.product = action.payload;
      state.success = true;
      state.products = [...state.products, action.payload]; // Add to shop products
    })
    .addCase("productCreateFail", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
      state.success = false;
    })

    // Get All Products of Shop
    .addCase("getAllProductsShopRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllProductsShopSuccess", (state, action) => {
      state.isLoading = false;
      state.products = action.payload;
    })
    .addCase("getAllProductsShopFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Delete Product of a Shop
    .addCase("deleteProductRequest", (state) => {
      state.isLoading = true;
      state.error = null;
      state.message = null;
    })
    .addCase("deleteProductSuccess", (state, action) => {
      state.isLoading = false;
      state.message = action.payload;
      state.products = state.products.filter(
        (p) => p._id !== action.payload // Assuming backend returns product ID in message or adjust accordingly
      );
    })
    .addCase("deleteProductFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Get All Products (Global)
    .addCase("getAllProductsRequest", (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase("getAllProductsSuccess", (state, action) => {
      state.isLoading = false;
      state.allProducts = action.payload;
    })
    .addCase("getAllProductsFailed", (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    })

    // Clear Errors
    .addCase("clearErrors", (state) => {
      state.error = null;
    });
});