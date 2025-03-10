const express = require("express");
const ErrorHandler = require("./middleware/error");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Load environment variables
if (process.env.NODE_ENV !== "PRODUCTION") {
  require("dotenv").config({
    path: "config/.env",
  });
}
const backendurl=process.env.DB_URL;
// Set frontend URL from environment variable
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
console.log("✅ CORS Origin Set To:", frontendUrl);

// CORS Middleware Configuration (simplified)
// CORS Middleware Configuration
app.use(
  cors({
    origin: frontendUrl, // Ensure this matches your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Required for credentials mode 'include'
  })
);

// Middleware to explicitly set CORS headers on all responses
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", frontendUrl);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Credentials", "true"); // Required for cookies

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});


// Middleware for parsing requests
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// Debug Middleware to log requests and responses
app.use((req, res, next) => {
  console.log(`📢 Request URL: ${req.url}, Origin: ${req.headers.origin}`);
  const originalSend = res.send;
  res.send = function (body) {
    console.log(`📢 Response Headers for ${req.url}:`, res.getHeaders());
    originalSend.call(this, body);
  };
  next();
});

// Nodemailer Transporter Configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMPT_MAIL,
    pass: process.env.SMPT_PASSWORD,
  },
});

// Root Route (For Deployment Testing)
app.get("/", (req, res) => {
  console.log("✅ API Root Accessed");
  res.send(`
    <html>
      <head><title>Environment Check</title></head>
      <body>
        <h1>Frontend URL:</h1>
        <p>${frontendUrl}
        <br/>${backendurl}</p>
      </body>
    </html>
  `);
});

// Import API Routes
const user = require("./controller/user");
const shop = require("./controller/shop");
const product = require("./controller/product");
const event = require("./controller/event");
const order = require("./controller/order");
const banner = require("./controller/banner");
const productBanner = require("./controller/productBanner");

// Route Middleware
app.use("/api/v2/user", user);
app.use("/api/v2/shop", shop);
app.use("/api/v2/product", product);
app.use("/api/v2/event", event);
app.use("/api/v2/order", order);
app.use("/api/v2/banner", banner);
app.use("/api/v2/product-banner", productBanner);

// Send Email Route
app.post("/api/v2/send-email", async (req, res) => {
  const { name, email, phoneNumber, message } = req.body;

  console.log("📧 Email Request Received:", req.body);

  if (!name || !email || !message) {
    console.log("❌ Validation Failed: Missing required fields");
    return res.status(400).json({
      success: false,
      message: "Name, email, and message are required fields.",
    });
  }

  if (!process.env.SMPT_MAIL) {
    console.error("❌ Missing SMTP Mail Configuration");
    return res.status(500).json({
      success: false,
      message: "SMTP server is not configured. Please contact support.",
    });
  }

  const mailOptions = {
    from: email,
    to: process.env.SMPT_MAIL,
    subject: `New Contact Us Message from ${name}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
        <div style="text-align: center; padding-bottom: 20px;">
          <h1 style="color: #333; font-size: 24px; margin: 0;">New Contact Us Message</h1>
          <p style="color: #666; font-size: 14px; margin: 5px 0;">Received on ${new Date().toLocaleDateString()}</p>
        </div>
        <div style="background-color: #fff; padding: 20px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
          <h2 style="color: #2c3e50; font-size: 18px; margin-top: 0;">Sender Details</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #555;">
            <tr>
              <td style="padding: 8px 0; font-weight: bold; width: 120px;">Name:</td>
              <td style="padding: 8px 0;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a></td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: bold;">Phone Number:</td>
              <td style="padding: 8px 0;">${phoneNumber || "Not provided"}</td>
            </tr>
          </table>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <h2 style="color: #2c3e50; font-size: 18px;">Message</h2>
          <p style="color: #555; font-size: 14px; line-height: 1.6; margin: 0;">${message}</p>
        </div>
        <div style="text-align: center; padding-top: 20px;">
          <p style="color: #888; font-size: 12px; margin: 0;">This email was sent from your website's Contact Us form.</p>
          <p style="color: #888; font-size: 12px; margin: 5px 0;">For inquiries, reply directly to this email or contact <a href="mailto:${email}" style="color: #007bff; text-decoration: none;">${email}</a>.</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Email Sent Successfully");
    res.status(200).json({
      success: true,
      message: "Email sent successfully!",
    });
  } catch (error) {
    console.error("❌ Error Sending Email:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to send email. Please try again later.",
      error: error.message,
    });
  }
});


app.get("/api/v2/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "✅ Backend API is running smoothly!",
    timestamp: new Date().toISOString(),
  });
});

// Error Handling Middleware
app.use(ErrorHandler);

module.exports = app;