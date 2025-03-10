const express = require("express");
const router = express.Router();
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { isSeller } = require("../middleware/auth");
const NewOrder = require("../model/NewOrder");
const nodemailer = require("nodemailer");

// Load environment variables
require("dotenv").config();

// Debug environment variables
console.log("Environment Variables Loaded:");
console.log("SMPT_MAIL:", process.env.SMPT_MAIL);
console.log("SMPT_PASSWORD:", process.env.SMPT_PASSWORD ? "Set" : "Not Set");

// Email transporter setup
const transporter = nodemailer.createTransport({
  service: "gmail", // Using Gmail service
  auth: {
    user: process.env.SMPT_MAIL, // Your variable name
    pass: process.env.SMPT_PASSWORD, // Your variable name
  },
});

// Test email route for debugging
router.get(
  "/test-email",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: process.env.SMPT_MAIL,
        subject: "Test Email",
        text: "This is a test email to verify Nodemailer configuration.",
      };

      console.log("Test Email Options:", mailOptions);
      await transporter.sendMail(mailOptions);
      console.log("Test email sent successfully");
      res.status(200).send("Test email sent successfully!");
    } catch (error) {
      console.error("Test Email Error:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Create new order and send emails to customer and seller
router.post(
  "/create-order",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const {
        customerEmail,
        customerName,
        customerPhoneNumber,
        location,
        orderDetails,
        orderStock,
        sellerId,
      } = req.body;

      console.log("Request Body:", req.body); // Log incoming request data

      // Validate required fields
      if (
        !customerEmail ||
        !customerName ||
        !customerPhoneNumber ||
        !location ||
        !orderDetails ||
        !orderStock ||
        !sellerId
      ) {
        console.log("Missing fields:", {
          customerEmail,
          customerName,
          customerPhoneNumber,
          location,
          orderDetails,
          orderStock,
          sellerId,
        });
        return next(new ErrorHandler("Missing required fields", 400));
      }

      // Validate orderDetails subfields
      const { productId, productName, quantity, price } = orderDetails;
      if (!productId || !productName || !quantity || !price) {
        console.log("Missing orderDetails fields:", orderDetails);
        return next(new ErrorHandler("Please provide all order details!", 400));
      }

      // Create the order
      const order = await NewOrder.create({
        customerEmail,
        customerName,
        customerPhoneNumber,
        location,
        orderDetails: {
          productId,
          productName,
          quantity,
          price,
          totalAmount: quantity * price,
        },
        orderStock,
        sellerId,
      });

      // Check SMTP credentials before sending emails
      if (!process.env.SMPT_MAIL || !process.env.SMPT_PASSWORD) {
        console.error("SMTP credentials missing:", {
          SMPT_MAIL: process.env.SMPT_MAIL,
          SMPT_PASSWORD: process.env.SMPT_PASSWORD ? "Set" : "Not Set",
        });
        return next(new ErrorHandler("Server email configuration error", 500));
      }

      // Customer Email
      const customerMailOptions = {
        from: process.env.SMPT_MAIL,
        to: customerEmail,
        subject: `Order Confirmation - ${orderDetails.productName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #333; font-size: 24px; margin: 0;">Order Confirmation</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Order placed on ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">Dear ${customerName},</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">Thank you for your order! We’re excited to let you know that your order has been successfully placed. Below are the details:</p>
              <h3 style="color: #2c3e50; font-size: 16px; margin: 15px 0 5px;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Product:</td>
                  <td style="padding: 8px 0;">${orderDetails.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
                  <td style="padding: 8px 0;">${orderDetails.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Price:</td>
                  <td style="padding: 8px 0;">${orderDetails.price} Rs</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0;">${order.orderDetails.totalAmount} Rs</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;">${customerPhoneNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0;">${location}</td>
                </tr>
              </table>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 15px;">We’ll notify you once your order is processed. If you have any questions, feel free to reply to this email.</p>
            </div>
            <div style="text-align: center; padding-top: 20px;">
              <p style="color: #888; font-size: 12px; margin: 0;">Best regards,</p>
              <p style="color: #888; font-size: 12px; margin: 5px 0;">Your Shop Team</p>
            </div>
          </div>
        `,
      };

      // Seller Email
      const sellerMailOptions = {
        from: process.env.SMPT_MAIL,
        to: process.env.SMPT_MAIL,
        subject: `New Order Received from ${customerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
            <div style="text-align: center; padding-bottom: 20px;">
              <h1 style="color: #333; font-size: 24px; margin: 0;">New Order Notification</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Received on ${new Date().toLocaleDateString()}</p>
            </div>
            <div style="background-color: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
              <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">New Order Details</h2>
              <p style="color: #555; font-size: 14px; line-height: 1.6;">A new order has been placed by ${customerName}. Please review the details below:</p>
              <h3 style="color: #2c3e50; font-size: 16px; margin: 15px 0 5px;">Customer Information</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
                  <td style="padding: 8px 0;">${customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${customerEmail}" style="color: #007bff; text-decoration: none;">${customerEmail}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px 0;">${customerPhoneNumber}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Location:</td>
                  <td style="padding: 8px 0;">${location}</td>
                </tr>
              </table>
              <h3 style="color: #2c3e50; font-size: 16px; margin: 15px 0 5px;">Order Details</h3>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; width: 120px;">Product:</td>
                  <td style="padding: 8px 0;">${orderDetails.productName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Quantity:</td>
                  <td style="padding: 8px 0;">${orderDetails.quantity}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Price:</td>
                  <td style="padding: 8px 0;">${orderDetails.price} Rs</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold;">Total Amount:</td>
                  <td style="padding: 8px 0;">${order.orderDetails.totalAmount} Rs</td>
                </tr>
              </table>
              <p style="color: #555; font-size: 14px; line-height: 1.6; margin-top: 15px;">Please process this order at your earliest convenience.</p>
            </div>
            <div style="text-align: center; padding-top: 20px;">
              <p style="color: #888; font-size: 12px; margin: 0;">This is an automated notification from your shop system.</p>
            </div>
          </div>
        `,
      };

      console.log("Customer Mail Options:", customerMailOptions);
      console.log("Seller Mail Options:", sellerMailOptions);

      // Send both emails
      await Promise.all([
        transporter.sendMail(customerMailOptions),
        transporter.sendMail(sellerMailOptions),
      ]);

      console.log("Emails sent successfully");

      res.status(201).json({
        success: true,
        order,
        message: "Order created and emails sent to customer and seller",
      });
    } catch (error) {
      console.error("Create Order Error:", error.message);
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Update order status
router.put(
  "/update-order-status/:id",
  isSeller,
  catchAsyncErrors(async (req, res, next) => {
    try {
      const order = await NewOrder.findById(req.params.id);
      if (!order) {
        return next(new ErrorHandler("Order not found", 404));
      }
      order.status = req.body.status;
      await order.save();
      res.status(200).json({
        success: true,
        message: "Order status updated",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

// Get all orders for a seller
router.get(
  "/get-seller-orders/:sellerId",
  catchAsyncErrors(async (req, res, next) => {
    try {
      const orders = await NewOrder.find({ sellerId: req.params.sellerId }).sort({
        createdAt: -1,
      });

      if (!orders.length) {
        return res.status(200).json({
          success: true,
          orders: [],
          message: "No orders found for this seller",
        });
      }

      res.status(200).json({
        success: true,
        orders,
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  })
);

module.exports = router;