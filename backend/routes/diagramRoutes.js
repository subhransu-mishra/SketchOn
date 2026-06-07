const express = require("express");
const router = express.Router();
const {
  getDiagrams,
  createDiagram,
  saveDiagram,
  deleteDiagram,
  getSingleDiagram,
  getPublicDiagram,
  shareDiagram,
} = require("../controller/diagramController.js");
const {
  validateClerkUser,
  addUserToRequest,
} = require("../middleware/clerkAuth.js");

// Public route to fetch shared diagram (no authentication required)
router.get("/public/:id", getPublicDiagram);

// Apply Clerk authentication to subsequent routes
router.use(validateClerkUser);

// CRUD Routes for diagrams
router.get("/", getDiagrams); // GET /api/diagrams - Get all user diagrams
router.post("/", createDiagram); // POST /api/diagrams - Create new diagram
router.get("/:id", getSingleDiagram); // GET /api/diagrams/:id - Get single diagram
router.put("/:id", saveDiagram); // PUT /api/diagrams/:id - Update diagram
router.delete("/:id", deleteDiagram); // DELETE /api/diagrams/:id - Delete diagram
router.post("/:id/share", shareDiagram); // POST /api/diagrams/:id/share - Share diagram

module.exports = router;
