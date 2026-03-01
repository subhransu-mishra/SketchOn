import { useAuth } from "@clerk/clerk-react";
import React from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:4000/api"
    : "https://whiteboard-ai-a5pt.onrender.com/api");

class DiagramService {
  constructor() {
    this.getAuthToken = null;
  }

  // Set the auth token getter function
  setAuthProvider(getAuthToken) {
    this.getAuthToken = getAuthToken;
  }

  // Get all diagrams for the authenticated user
  async getAllDiagrams() {
    try {
      if (!this.getAuthToken) {
        throw new Error("Authentication not initialized. Please sign in.");
      }

      const token = await this.getAuthToken();

      if (!token) {
        throw new Error("No authentication token available");
      }

      console.log("Making request to:", `${API_BASE_URL}/diagrams`);
      console.log("Auth token exists:", !!token);

      const response = await fetch(`${API_BASE_URL}/diagrams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 401) {
        throw new Error("Unauthorized - Invalid or missing authentication");
      }

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch diagrams");
      }

      return data;
    } catch (error) {
      console.error("Error fetching diagrams:", error);
      throw error;
    }
  }

  // Get a single diagram by ID
  async getDiagram(diagramId) {
    try {
      if (!this.getAuthToken) {
        throw new Error("Authentication not initialized. Please sign in.");
      }

      const token = await this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch diagram");
      }

      return data;
    } catch (error) {
      console.error("Error fetching diagram:", error);
      throw error;
    }
  }

  // Create a new diagram
  async createDiagram(diagramData) {
    try {
      if (!this.getAuthToken) {
        throw new Error("Authentication not initialized. Please sign in.");
      }

      const token = await this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/diagrams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagramData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to create diagram");
      }

      return data;
    } catch (error) {
      console.error("Error creating diagram:", error);
      throw error;
    }
  }

  // Update/Save a diagram
  async saveDiagram(diagramId, updateData) {
    try {
      if (!this.getAuthToken) {
        throw new Error("Authentication not initialized. Please sign in.");
      }

      const token = await this.getAuthToken();

      if (!token) {
        throw new Error("No authentication token available");
      }

      if (!diagramId) {
        throw new Error("No diagram ID provided");
      }

      // Validate and sanitize update data
      if (!updateData || typeof updateData !== "object") {
        throw new Error("Invalid update data provided");
      }

      // Deep sanitize the data to ensure proper JSON serialization
      const sanitizedData = {
        ...updateData,
        nodes: Array.isArray(updateData.nodes)
          ? updateData.nodes.filter(
              (node) => node != null && typeof node === "object",
            )
          : [],
        edges: Array.isArray(updateData.edges)
          ? updateData.edges.filter(
              (edge) => edge != null && typeof edge === "object",
            )
          : [],
      };

      console.log(`Saving diagram ${diagramId} with sanitized data:`, {
        nodesCount: sanitizedData.nodes.length,
        edgesCount: sanitizedData.edges.length,
        title: sanitizedData.title,
      });

      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
      });

      console.log(`Response status: ${response.status}`);

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error("Failed to parse response JSON:", parseError);
        throw new Error(
          `Server returned ${response.status} but response is not valid JSON`,
        );
      }

      if (!response.ok) {
        console.error("Server error response:", data);
        throw new Error(data.message || `Server error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error("Error saving diagram:", error);
      throw error;
    }
  }

  // Delete a diagram
  async deleteDiagram(diagramId) {
    try {
      if (!this.getAuthToken) {
        throw new Error("Authentication not initialized. Please sign in.");
      }

      const token = await this.getAuthToken();
      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete diagram");
      }

      return data;
    } catch (error) {
      console.error("Error deleting diagram:", error);
      throw error;
    }
  }
}

// Create a singleton instance
const diagramService = new DiagramService();

// Hook to initialize the service with auth
export const useDiagramService = () => {
  const { getToken, isSignedIn, user } = useAuth();

  // Always update the auth provider when auth state changes
  React.useEffect(() => {
    if (isSignedIn && user) {
      console.log("Setting up auth provider for user:", user.id);
      diagramService.setAuthProvider(async () => {
        try {
          const token = await getToken();
          if (!token) {
            throw new Error("Failed to retrieve authentication token");
          }
          console.log("Auth token retrieved successfully");
          return token;
        } catch (error) {
          console.error("Error getting auth token:", error);
          throw error;
        }
      });
    } else {
      console.log("User not signed in, clearing auth provider");
      diagramService.setAuthProvider(null);
    }
  }, [isSignedIn, user, getToken]);

  return diagramService;
};

export default diagramService;
