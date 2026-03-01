const mongoose = require("mongoose");

// Schema for individual node
const nodeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    type: { type: String, required: true },
    position: {
      x: { type: Number, required: true },
      y: { type: Number, required: true },
    },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
    // Allow additional fields for flexibility
  },
  { strict: false },
);

// Schema for individual edge
const edgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    source: { type: String, required: true },
    target: { type: String, required: true },
    type: { type: String, default: "default" },
    animated: { type: Boolean, default: false },
    // Allow additional fields for flexibility
  },
  { strict: false },
);

const diagramSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      index: true,
    },
    title: {
      type: String,
      default: "Untitled Diagram",
    },
    nodes: [nodeSchema],
    edges: [edgeSchema],
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    strict: false, // Allow additional fields for future flexibility
  },
);

module.exports = mongoose.model("Diagram", diagramSchema);
