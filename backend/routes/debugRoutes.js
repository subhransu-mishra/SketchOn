const express = require("express");
const router = express.Router();
const { validateClerkUser } = require("../middleware/clerkAuth");

// Debug endpoint to inspect request data
router.post("/debug-data", (req, res) => {
  //   console.log("=== DEBUG DATA ENDPOINT ===");
  //   console.log("Headers:", req.headers);
  //   console.log("Body:", req.body);
  //   console.log("Body type:", typeof req.body);

  if (req.body.nodes) {
    // console.log("Nodes type:", typeof req.body.nodes);
    // console.log("Nodes is array:", Array.isArray(req.body.nodes));
    if (Array.isArray(req.body.nodes) && req.body.nodes.length > 0) {
      //   console.log("First node type:", typeof req.body.nodes[0]);
      //   console.log("First node:", req.body.nodes[0]);
    }
  }

  if (req.body.edges) {
    // console.log("Edges type:", typeof req.body.edges);
    // console.log("Edges is array:", Array.isArray(req.body.edges));
    if (Array.isArray(req.body.edges) && req.body.edges.length > 0) {
      //   console.log("First edge type:", typeof req.body.edges[0]);
      //   console.log("First edge:", req.body.edges[0]);
    }
  }

  res.json({
    success: true,
    receivedData: {
      bodyType: typeof req.body,
      nodes: {
        type: typeof req.body.nodes,
        isArray: Array.isArray(req.body.nodes),
        length: req.body.nodes ? req.body.nodes.length : 0,
      },
      edges: {
        type: typeof req.body.edges,
        isArray: Array.isArray(req.body.edges),
        length: req.body.edges ? req.body.edges.length : 0,
      },
    },
  });
});

// Auth test endpoint
router.post("/auth-test", validateClerkUser, (req, res) => {
  //   console.log("=== AUTH TEST ENDPOINT ===");
  //   console.log("Auth header:", req.headers.authorization);
  //   console.log("User ID:", req.clerkUserId);
  //   console.log("Request auth:", req.auth);

  res.json({
    success: true,
    message: "Authentication successful",
    user: {
      id: req.clerkUserId,
      authObject: req.auth,
    },
    server: {
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    },
  });
});

// Production config check endpoint (no auth required)
router.get("/config", (req, res) => {
  res.json({
    success: true,
    config: {
      environment: process.env.NODE_ENV || "development",
      hasClerkKey: !!process.env.CLERK_SECRET_KEY,
      clerkKeyType: process.env.CLERK_SECRET_KEY?.startsWith("sk_live_")
        ? "production"
        : process.env.CLERK_SECRET_KEY?.startsWith("sk_test_")
          ? "development"
          : process.env.CLERK_SECRET_KEY
            ? "unknown"
            : "missing",
      mongoConnected: require("mongoose").connection.readyState === 1,
      timestamp: new Date().toISOString(),
    },
  });
});

module.exports = router;
