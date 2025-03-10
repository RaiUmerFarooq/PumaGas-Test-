const mongoose = require("mongoose");

const newOrderSchema = new mongoose.Schema({
  customerEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], // Basic email validation
  },
  customerName: {
    type: String,
    required: true,
    trim: true,
  },
  customerPhoneNumber: { // New field added
    type: String,
    required: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number"], // Basic phone number validation (e.g., +1234567890)
  },
  location: {
    type: String,
    required: true,
    trim: true,
  },
  orderDetails: {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", // Reference to Product collection
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity must be at least 1"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Price cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: true,
      min: [0, "Total amount cannot be negative"],
    },
  },
  orderStock: {
    type: Number,
    required: true,
    min: [0, "Stock cannot be negative"],
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Seller", // Reference to Seller collection
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending",
  },
});

const NewOrder = mongoose.model("NewOrder", newOrderSchema);

module.exports = NewOrder;