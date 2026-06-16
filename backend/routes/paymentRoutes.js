const express = require("express");
const router = express.Router();
const {
  createOrder,
  verifyPayment,
} = require("../controller/paymentController.js");
const { validateClerkUser } = require("../middleware/clerkAuth.js");

// Apply Clerk authentication to all payment routes
router.use(validateClerkUser);

// POST /api/payment/create-order
router.post("/create-order", createOrder);

// POST /api/payment/verify
router.post("/verify", verifyPayment);

module.exports = router;
