const express = require("express");
const router = express.Router();
const {
  getUserProfile,
  addTestCredits,
  toggleSubscription,
} = require("../controller/userController.js");
const { validateClerkUser } = require("../middleware/clerkAuth.js");

// Apply Clerk authentication to all user routes
router.use(validateClerkUser);

// GET /api/users/profile - Fetch user credits and subscription plan
router.get("/profile", getUserProfile);

// POST /api/users/add-credits - Add test credits to account
router.post("/add-credits", addTestCredits);

// POST /api/users/subscribe - Subscribe or unsubscribe (test toggling)
router.post("/subscribe", toggleSubscription);

module.exports = router;
