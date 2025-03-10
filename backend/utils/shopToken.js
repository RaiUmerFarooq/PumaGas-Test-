const sendShopToken = (user, statusCode, res) => {
  const token = user.getJwtToken();

  // Options for cookies
  const options = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,  // Prevent client-side access
    secure: true,  // ✅ Enable HTTPS in production
    sameSite: "None" // ✅ Required for cross-origin cookies
  };

  res.setHeader("Access-Control-Allow-Credentials", "true"); // ✅ Ensure credentials allowed

  res.status(statusCode).cookie("seller_token", token, options).json({
    success: true,
    user,
    token,
  });
};

module.exports = sendShopToken;
