const express = require("express");
const router = express.Router();
const { analyzeDiagram } = require("../controller/aiController.js");
const { validateClerkUser } = require("../middleware/clerkAuth.js");

// Apply Clerk authentication
router.use(validateClerkUser);

// POST /api/ai/analyze - Analyze a diagram with AI
router.post("/analyze", analyzeDiagram);

module.exports = router;
