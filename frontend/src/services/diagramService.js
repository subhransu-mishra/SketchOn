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

  // Helper method to safely parse response - FIXED: reads body only once
  async parseResponse(response, context = "API call") {
    // Read body as text first to avoid "body stream already read" error
    const textContent = await response.text();

    // Only log in development to reduce production overhead
    const isDev = import.meta.env.DEV;
    if (isDev) {
      console.log(`${context} response:`, {
        status: response.status,
        ok: response.ok,
        url: response.url,
      });
    }

    // Try to parse as JSON
    let data = null;
    try {
      data = textContent ? JSON.parse(textContent) : null;
    } catch {
      // Not valid JSON
      if (isDev) {
        console.warn(`${context}: Response is not valid JSON`);
      }
    }

    // Handle error responses
    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText || "Error"}`;

      if (data && data.message) {
        errorMessage = data.message;
      } else if (textContent.includes("<!DOCTYPE")) {
        errorMessage =
          "Server returned HTML error page. API endpoint may be unavailable.";
      } else if (textContent.length > 0) {
        errorMessage = `Server error: ${textContent.substring(0, 200)}`;
      }

      // Add status code hint for common errors
      if (response.status === 401) {
        errorMessage = "Unauthorized - Please sign in again";
      } else if (response.status === 404) {
        errorMessage =
          "Resource not found - The requested item may have been deleted";
      }

      throw new Error(errorMessage);
    }

    // Handle HTML response for success status (shouldn't happen but safety check)
    if (textContent.includes("<!DOCTYPE")) {
      throw new Error(
        "Server returned HTML instead of JSON. Check API configuration.",
      );
    }

    // Return parsed data or throw if no valid data
    if (data === null && textContent.length > 0) {
      throw new Error(
        `Invalid JSON response: ${textContent.substring(0, 100)}`,
      );
    }

    return data || {};
  }

  // Get all diagrams for the authenticated user
  async getAllDiagrams() {
    const isDev = import.meta.env.DEV;

    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    if (isDev) {
      console.log("Fetching diagrams from:", `${API_BASE_URL}/diagrams`);
    }

    // Add timeout for production reliability
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

    try {
      const response = await fetch(`${API_BASE_URL}/diagrams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.parseResponse(response, "getAllDiagrams");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error(
          "Request timed out. Please check your connection and try again.",
        );
      }
      throw error;
    }
  }

  // Get a single diagram by ID
  async getDiagram(diagramId) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.parseResponse(response, "getDiagram");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timed out. Please try again.");
      }
      throw error;
    }
  }

  // Create a new diagram
  async createDiagram(diagramData) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      const response = await fetch(`${API_BASE_URL}/diagrams`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagramData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.parseResponse(response, "createDiagram");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timed out while creating diagram.");
      }
      throw error;
    }
  }

  // Update/Save a diagram
  async saveDiagram(diagramId, updateData) {
    const isDev = import.meta.env.DEV;

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

    if (!updateData || typeof updateData !== "object") {
      throw new Error("Invalid update data provided");
    }

    // Sanitize the data
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

    if (isDev) {
      console.log(`Saving diagram ${diagramId}:`, {
        nodesCount: sanitizedData.nodes.length,
        edgesCount: sanitizedData.edges.length,
      });
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s for save

    try {
      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.parseResponse(response, "saveDiagram");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Save request timed out. Please try again.");
      }
      throw error;
    }
  }

  // Delete a diagram
  async deleteDiagram(diagramId) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${API_BASE_URL}/diagrams/${diagramId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.parseResponse(response, "deleteDiagram");
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Delete request timed out. Please try again.");
      }
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
  const isDev = import.meta.env.DEV;

  // Set up auth provider - only after Clerk has fully loaded
  React.useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn && user) {
      if (isDev) {
        console.log("Setting up auth provider for user:", user.id);
      }
      const authProvider = async () => {
        const token = await getToken();
        if (!token) {
          throw new Error("Failed to retrieve authentication token");
        }
        return token;
      };
      diagramService.setAuthProvider(authProvider);
      setIsReady(true);
    } else {
      diagramService.setAuthProvider(null);
      setIsReady(false);
    }
  }, [isLoaded, isSignedIn, user, getToken, isDev]);

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
