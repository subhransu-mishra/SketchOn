const diagramSchema = require("../schema/diagram.js");
const mongoose = require("mongoose");

// Show all the diagrams of a user
exports.getDiagrams = async (req, res) => {
  try {
    const diagrams = await diagramSchema
      .find({
        clerkUserId: req.clerkUserId,
      })
      .sort({ lastModified: -1 });

    res.json({
      success: true,
      data: diagrams,
      count: diagrams.length,
    });
  } catch (error) {
    console.error("Get diagrams error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch diagrams",
      error: error.message,
    });
  }
};

exports.getSingleDiagram = async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid diagram ID format",
      });
    }

    const diagram = await diagramSchema.findOne({
      _id: req.params.id,
      clerkUserId: req.clerkUserId,
    });

    if (!diagram) {
      return res.status(404).json({
        success: false,
        message: "Diagram not found or you don't have access to it",
      });
    }

    res.json({
      success: true,
      data: diagram,
    });
  } catch (error) {
    console.error("Get single diagram error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch diagram",
      error: error.message,
    });
  }
};

//Create a new diagram
exports.createDiagram = async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;

    // Validate required fields
    if (!title || title.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title is required",
      });
    }

    const newDiagram = new diagramSchema({
      clerkUserId: req.clerkUserId,
      title: title.trim(),
      nodes: nodes || [],
      edges: edges || [],
    });

    const savedDiagram = await newDiagram.save();

    res.status(201).json({
      success: true,
      data: savedDiagram,
      message: "Diagram created successfully",
    });
  } catch (error) {
    console.error("Create diagram error:", error);
    res.status(400).json({
      success: false,
      message: "Failed to create diagram",
      error: error.message,
    });
  }
};

//Save/Update the diagram
exports.saveDiagram = async (req, res) => {
  try {
    const { title, nodes, edges } = req.body;

    console.log("Received save request:", {
      title: title,
      nodesType: typeof nodes,
      nodesIsArray: Array.isArray(nodes),
      nodesLength: nodes ? nodes.length : 0,
      edgesType: typeof edges,
      edgesIsArray: Array.isArray(edges),
      edgesLength: edges ? edges.length : 0,
      firstNode: nodes && nodes.length > 0 ? nodes[0] : null,
    });

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid diagram ID format",
      });
    }

    // Validate that user is authenticated
    if (!req.clerkUserId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    // Validate the diagram belongs to the user
    const existingDiagram = await diagramSchema.findOne({
      _id: req.params.id,
      clerkUserId: req.clerkUserId,
    });

    if (!existingDiagram) {
      return res.status(404).json({
        success: false,
        message: "Diagram not found or you don't have access to it",
      });
    }

    // Update only the provided fields and sanitize data
    const updateData = { lastModified: new Date() };

    if (title !== undefined && title.trim().length > 0) {
      updateData.title = title.trim();
    }

    // Sanitize nodes data
    if (nodes !== undefined) {
      if (Array.isArray(nodes)) {
        updateData.nodes = nodes
          .map((node) => {
            // If node is a string, try to parse it as JSON
            if (typeof node === "string") {
              try {
                return JSON.parse(node);
              } catch (e) {
                console.error("Failed to parse node:", node);
                return null;
              }
            }
            // If node is already an object, return as is
            return node;
          })
          .filter((node) => node !== null); // Remove any null nodes
      } else if (typeof nodes === "string") {
        try {
          updateData.nodes = JSON.parse(nodes);
        } catch (e) {
          console.error("Failed to parse nodes string:", nodes);
          updateData.nodes = [];
        }
      } else {
        updateData.nodes = [];
      }
    }

    // Sanitize edges data
    if (edges !== undefined) {
      if (Array.isArray(edges)) {
        updateData.edges = edges
          .map((edge) => {
            // If edge is a string, try to parse it as JSON
            if (typeof edge === "string") {
              try {
                return JSON.parse(edge);
              } catch (e) {
                console.error("Failed to parse edge:", edge);
                return null;
              }
            }
            // If edge is already an object, return as is
            return edge;
          })
          .filter((edge) => edge !== null); // Remove any null edges
      } else if (typeof edges === "string") {
        try {
          updateData.edges = JSON.parse(edges);
        } catch (e) {
          console.error("Failed to parse edges string:", edges);
          updateData.edges = [];
        }
      } else {
        updateData.edges = [];
      }
    }

    // Add more detailed logging
    console.log("Update data being applied:", {
      id: req.params.id,
      nodesCount: updateData.nodes ? updateData.nodes.length : 0,
      edgesCount: updateData.edges ? updateData.edges.length : 0,
      title: updateData.title,
    });

    const updatedDiagram = await diagramSchema.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedDiagram) {
      return res.status(404).json({
        success: false,
        message: "Failed to update diagram - diagram not found after update",
      });
    }

    res.json({
      success: true,
      data: updatedDiagram,
      message: "Diagram updated successfully",
    });
  } catch (error) {
    console.error("Save diagram error:", error);
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      requestBody: req.body,
      params: req.params,
      userId: req.clerkUserId,
    });

    // Check if it's a validation error
    if (error.name === "ValidationError" || error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid data format provided",
        error: error.message,
        details: "Please ensure nodes and edges are properly formatted objects",
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update diagram",
      error: error.message,
    });
  }
};

//Delete the diagram
exports.deleteDiagram = async (req, res) => {
  try {
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid diagram ID format",
      });
    }

    // Ensure only the owner can delete their diagram
    const deletedDiagram = await diagramSchema.findOneAndDelete({
      _id: req.params.id,
      clerkUserId: req.clerkUserId,
    });

    if (!deletedDiagram) {
      return res.status(404).json({
        success: false,
        message: "Diagram not found or you don't have access to it",
      });
    }

    res.json({
      success: true,
      message: "Diagram deleted successfully",
      data: { id: deletedDiagram._id },
    });
  } catch (error) {
    console.error("Delete diagram error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete diagram",
      error: error.message,
    });
  }
};
