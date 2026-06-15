import { useAuth, useUser } from "@clerk/clerk-react";
import React from "react";

const getApiBaseUrl = () => {
  const hostname = window.location.hostname;
  const isLocal =
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.startsWith("192.168.") ||
    hostname.startsWith("10.") ||
    hostname.startsWith("172.") ||
    hostname.endsWith(".local");

  if (isLocal) {
    return `http://${hostname}:4000/api`;
  }
  return import.meta.env.VITE_API_BASE_URL || "https://whiteboard-ai-a5pt.onrender.com/api";
};

const API_BASE_URL = getApiBaseUrl();

class DiagramService {
  constructor() {
    this.getAuthToken = null;
  }

  // Set the auth token getter function
  setAuthProvider(getAuthToken) {
    this.getAuthToken = getAuthToken;
  }

  // Helper method to fetch with retry on network error, timeout, or 502/503/504 gateway errors
  async fetchWithRetry(url, options = {}, retries = 2, delay = 1000) {
    const isDev = import.meta.env.DEV;
    const method = options.method || "GET";
    const isIdempotent = method === "GET" || method === "HEAD" || method === "OPTIONS";
    const timeout = options.timeout || 30000;

    for (let attempt = 0; attempt <= retries; attempt++) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const requestOptions = {
        ...options,
        signal: controller.signal
      };
      // Remove custom timeout from options so window.fetch doesn't complain
      delete requestOptions.timeout;

      try {
        if (isDev && attempt > 0) {
          console.log(`Retrying request to ${url} (Attempt ${attempt}/${retries})...`);
        }
        
        const response = await fetch(url, requestOptions);
        clearTimeout(timeoutId);
        
        // Handle gateway/proxy errors often encountered during server cold starts
        if ((response.status === 502 || response.status === 503 || response.status === 504) && isIdempotent && attempt < retries) {
          const backoffDelay = delay * Math.pow(2, attempt);
          if (isDev) {
            console.warn(`Request to ${url} failed with status ${response.status}. Retrying in ${backoffDelay}ms...`);
          }
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }
        
        return response;
      } catch (error) {
        clearTimeout(timeoutId);
        
        const isTimeout = error.name === "AbortError";
        const isNetworkError = error.name === "TypeError" || error.message?.includes("Failed to fetch");
        
        const shouldRetry = (isTimeout || isNetworkError) && isIdempotent && attempt < retries;
        
        if (shouldRetry) {
          const backoffDelay = delay * Math.pow(2, attempt);
          if (isDev) {
            console.warn(`Request to ${url} failed (${error.message}). Retrying in ${backoffDelay}ms...`);
          }
          await new Promise((resolve) => setTimeout(resolve, backoffDelay));
          continue;
        }
        
        if (isTimeout) {
          throw new Error("Request timed out. The server may be waking up - please retry.");
        }
        throw error;
      }
    }
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
      } else if (response.status === 402) {
        errorMessage =
          data?.message ||
          "OpenRouter account has no credits. Add credits at openrouter.ai/credits.";
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

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
      3,
      1000
    );

    return await this.parseResponse(response, "getAllDiagrams");
  }

  // Get a single diagram by ID
  async getDiagram(diagramId) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams/${diagramId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
      3,
      1000
    );

    return await this.parseResponse(response, "getDiagram");
  }

  // Get a single diagram by ID (public access, no auth required)
  async getPublicDiagram(diagramId) {
    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams/public/${diagramId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
      3,
      1000
    );

    return await this.parseResponse(response, "getPublicDiagram");
  }

  // Share a diagram (requires auth)
  async shareDiagram(diagramId) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams/${diagramId}/share`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 45000,
      },
      0
    );

    return await this.parseResponse(response, "shareDiagram");
  }

  // Create a new diagram
  async createDiagram(diagramData) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(diagramData),
        timeout: 45000,
      },
      0
    );

    return await this.parseResponse(response, "createDiagram");
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

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams/${diagramId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(sanitizedData),
        timeout: 45000,
      },
      0
    );

    return await this.parseResponse(response, "saveDiagram");
  }

  // Analyze diagram with AI
  async analyzeDiagram({ title, nodes, edges }) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/ai/analyze`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, nodes, edges }),
        timeout: 60000,
      },
      0
    );

    return await this.parseResponse(response, "analyzeDiagram");
  }

  // Delete a diagram
  async deleteDiagram(diagramId) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/diagrams/${diagramId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 45000,
      },
      0
    );

    return await this.parseResponse(response, "deleteDiagram");
  }

  // Get user profile including credits, subscription status, and plan
  async getUserProfile() {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/users/profile`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      },
      3,
      1000
    );

    return await this.parseResponse(response, "getUserProfile");
  }

  // Add test credits (Testing utility)
  async addTestCredits(amount = 10) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/users/add-credits`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount }),
        timeout: 30000,
      },
      0
    );

    return await this.parseResponse(response, "addTestCredits");
  }

  // Toggle mock subscription status (Testing utility)
  async toggleSubscription(isSubscribed, plan) {
    if (!this.getAuthToken) {
      throw new Error("Authentication not initialized. Please sign in.");
    }

    const token = await this.getAuthToken();
    if (!token) {
      throw new Error("No authentication token available");
    }

    const response = await this.fetchWithRetry(
      `${API_BASE_URL}/users/subscribe`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isSubscribed, plan }),
        timeout: 30000,
      },
      0
    );

    return await this.parseResponse(response, "toggleSubscription");
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
