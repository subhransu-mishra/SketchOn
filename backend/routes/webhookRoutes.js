const express = require("express");
const router = express.Router();
const { handleClerkWebhook } = require("../controller/webhookController.js");

// POST /api/webhooks/clerk
router.post("/clerk", handleClerkWebhook);

module.exports = router;
