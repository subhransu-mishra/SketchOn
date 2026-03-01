const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

// Production-ready authentication middleware
const validateClerkUser = (req, res, next) => {
  console.log("Auth middleware called:", {
    method: req.method,
    url: req.url,
    hasAuth: !!req.headers.authorization,
    nodeEnv: process.env.NODE_ENV,
    hasClerkKey: !!process.env.CLERK_SECRET_KEY,
  });

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

  // Development bypass (only for localhost and test keys)
  if (
    process.env.NODE_ENV !== "production" &&
    process.env.CLERK_SECRET_KEY.startsWith("sk_test_") &&
    (req.get("host") === "localhost:4000" ||
      req.get("host") === "127.0.0.1:4000")
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
      console.error("Clerk auth error:", {
        error: err.message,
        stack: err.stack,
        authHeader: req.headers.authorization ? "Present" : "Missing",
        secretKeyPrefix: process.env.CLERK_SECRET_KEY
          ? process.env.CLERK_SECRET_KEY.substring(0, 7)
          : "None",
      });
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
        error:
          process.env.NODE_ENV === "development"
            ? err.message
            : "Invalid token",
      });
    }
    console.log("Clerk auth successful, user ID:", req.auth?.userId);
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
