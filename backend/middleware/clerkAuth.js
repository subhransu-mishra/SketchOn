const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

// Production-ready authentication middleware
const validateClerkUser = (req, res, next) => {
  // Check if we have a secret key configured
  if (
    !process.env.CLERK_SECRET_KEY ||
    process.env.CLERK_SECRET_KEY === "sk_live_YOUR_PRODUCTION_SECRET_KEY_HERE"
  ) {
    console.error("Clerk secret key not configured");
    return res.status(500).json({
      success: false,
      message: "Authentication service not properly configured",
    });
  }

  // Development bypass (only for non-production environments)
  if (
    process.env.NODE_ENV !== "production" &&
    (!process.env.CLERK_SECRET_KEY ||
      process.env.CLERK_SECRET_KEY.startsWith("sk_test_"))
  ) {
    console.log("Using development auth bypass");
    req.auth = { userId: "dev-user-123" };
    req.clerkUserId = "dev-user-123";
    return next();
  }

  // Use Clerk authentication
  const clerkAuth = ClerkExpressWithAuth({
    secretKey: process.env.CLERK_SECRET_KEY,
  });

  clerkAuth(req, res, (err) => {
    if (err) {
      console.error("Clerk auth error:", err);
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
    addUserToRequest(req, res, next);
  });
};

// Additional middleware to add user ID to request
const addUserToRequest = (req, res, next) => {
  try {
    if (req.auth && req.auth.userId) {
      req.clerkUserId = req.auth.userId;
      next();
    } else {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - Invalid or missing authentication",
      });
    }
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication service error",
    });
  }
};

module.exports = {
  validateClerkUser,
  addUserToRequest,
};
