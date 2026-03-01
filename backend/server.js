const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("Gracefully shutting down...");
  await mongoose.connection.close();
  process.exit(0);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
  console.log(`Health check: http://localhost:${PORT}/`);
});

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://sketchon.onrender.com",
      "https://whiteboard-ai-a5pt.onrender.com",
      "https://sketchon.app",
      "https://www.sketchon.app",
    ],
    credentials: true,
  }),
);
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(
    `${req.method} ${req.url}`,
    req.headers.authorization ? "with auth" : "no auth",
    req.body
      ? `Body: ${JSON.stringify(req.body)}`.substring(0, 200)
      : "no body",
  );
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Something went wrong",
  });
});

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sketch On API is running!",
    version: "1.0.0",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database:
      mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});
app.use("/api/diagrams", require("./routes/diagramRoutes.js"));

// Debug routes in development
if (process.env.NODE_ENV !== "production") {
  app.use("/api/debug", require("./routes/debugRoutes.js"));
}
