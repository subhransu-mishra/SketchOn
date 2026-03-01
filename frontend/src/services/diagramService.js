import { useAuth, useUser } from "@clerk/clerk-react";
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

  // Helper method to safely parse response
  async parseResponse(response, context = "API call") {
    try {
      // Log response details for debugging
      console.log(`${context} response:`, {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers),
        url: response.url,
      });

      // Check if response is ok
      if (!response.ok) {
        // Try to get error details, but handle non-JSON responses
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Response is not JSON, get text content
          const textContent = await response.text();
          console.error(
            "Non-JSON error response:",
            textContent.substring(0, 500),
          );

          if (textContent.includes("<!DOCTYPE")) {
            errorMessage = `Server returned HTML error page instead of JSON. This usually means the API endpoint is not available or there's a server configuration issue.`;
          } else {
            errorMessage = `Server error: ${errorMessage}. Response: ${textContent.substring(0, 200)}`;
          }
        }
        throw new Error(errorMessage);
      }

      // Check content type
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.warn("Response is not JSON:", contentType);
        const textContent = await response.text();
        console.log("Text response:", textContent.substring(0, 500));

        if (textContent.includes("<!DOCTYPE")) {
          throw new Error(
            "Server returned HTML page instead of JSON API response. Check if the API server is running correctly.",
          );
        }

        // Try to parse as JSON anyway
        try {
          return JSON.parse(textContent);
        } catch {
          throw new Error(
            `Expected JSON response but got: ${contentType}. Content: ${textContent.substring(0, 200)}`,
          );
        }
      }

      // Parse JSON response
      const data = await response.json();
      console.log(`${context} success:`, data);
      return data;
    } catch (error) {
      console.error(`Error parsing ${context} response:`, error);
      throw error;
    }
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
      console.log("Auth token length:", token ? token.length : 0);
      console.log("Environment:", window.location.hostname);

      const response = await fetch(`${API_BASE_URL}/diagrams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // Use the safe response parser
      const data = await this.parseResponse(response, "getAllDiagrams");
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

      const data = await this.parseResponse(response, "getDiagram");
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

      const data = await this.parseResponse(response, "createDiagram");
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
      const data = await this.parseResponse(response, "saveDiagram");
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

      const data = await this.parseResponse(response, "deleteDiagram");
      return data;
    } catch (error) {
      console.error("Error deleting diagram:", error);
      throw error;
    }
  }

  // Test API connectivity and configuration
  async testConnection() {
    try {
      console.log("Testing API connection to:", API_BASE_URL);

      // Test health endpoint (no auth required)
      const healthUrl = API_BASE_URL.replace("/api", "/health");
      const healthResponse = await fetch(healthUrl);
      const healthData = await this.parseResponse(
        healthResponse,
        "health check",
      );

      // Test debug config endpoint (no auth required)
      const configUrl = `${API_BASE_URL}/debug/config`;
      const configResponse = await fetch(configUrl);
      const configData = await this.parseResponse(
        configResponse,
        "config check",
      );

      return {
        health: healthData,
        config: configData,
        apiUrl: API_BASE_URL,
        connectionStatus: "success",
      };
    } catch (error) {
      console.error("Connection test failed:", error);
      return {
        connectionStatus: "failed",
        error: error.message,
        apiUrl: API_BASE_URL,
      };
    }
  }
}

// Create a singleton instance
const diagramService = new DiagramService();

// Hook to initialize the service with auth
export const useDiagramService = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [isReady, setIsReady] = React.useState(false);

  // Set up auth provider - only after Clerk has fully loaded
  React.useEffect(() => {
    // Wait for Clerk to finish loading before making any decisions
    if (!isLoaded) {
      console.log("Clerk still loading, waiting...");
      return;
    }

    if (isSignedIn && user) {
      console.log("Setting up auth provider for user:", user.id);
      const authProvider = async () => {
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
      };
      diagramService.setAuthProvider(authProvider);
      setIsReady(true);
    } else {
      console.log("User not signed in after Clerk loaded");
      diagramService.setAuthProvider(null);
      setIsReady(false);
    }
  }, [isLoaded, isSignedIn, user, getToken]);

  // Return both the service and ready state
  return {
    diagramService,
    isReady: isLoaded && isReady && isSignedIn && !!user,
    isSignedIn,
    isLoaded,
    user,
  };
};

export default diagramService;
