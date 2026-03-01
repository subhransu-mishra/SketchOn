import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

const ProductionAuthDebugger = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRecommendedAction = (response, configData, responseData) => {
    if (!response) return "API server appears to be down or unreachable";

    if (configData && configData.error) {
      return "Backend configuration endpoint failed - check server logs";
    }

    if (responseData && responseData.isHTML) {
      return "API returning HTML instead of JSON - likely server misconfiguration or routing issue";
    }

    if (response.status === 401) {
      return "Authentication failed - check CLERK_SECRET_KEY in production environment";
    }

    if (response.status === 404) {
      return "API endpoint not found - check API_BASE_URL configuration";
    }

    if (response.status >= 500) {
      return "Server error - check backend logs and database connection";
    }

    if (!responseData || responseData.parseError) {
      return "Response parsing failed - server may be returning malformed JSON";
    }

    return "Check console logs for detailed error information";
  };

  const testProductionAuth = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log("=== PRODUCTION AUTH DEBUG ===");

      // First, check backend config
      let configData = null;
      try {
        const configUrl =
          "https://whiteboard-ai-a5pt.onrender.com/api/debug/config";
        const configResponse = await fetch(configUrl);
        const contentType = configResponse.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          configData = await configResponse.json();
        } else {
          const text = await configResponse.text();
          configData = {
            error: "Non-JSON response",
            contentType,
            isHTML: text.includes("<!DOCTYPE"),
            preview: text.substring(0, 200),
          };
        }
        console.log("Backend config:", configData);
      } catch (configError) {
        console.error("Config fetch failed:", configError);
        configData = { error: configError.message };
      }

      // Get token
      const token = await getToken();
      console.log("Token obtained:", !!token);
      console.log("Token length:", token ? token.length : 0);
      console.log(
        "Token preview:",
        token ? `${token.substring(0, 20)}...` : "null",
      );

      // Test API directly
      const apiUrl = "https://whiteboard-ai-a5pt.onrender.com/api/diagrams";
      console.log("Making request to:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers));

      const contentType = response.headers.get("content-type");
      const text = await response.text();
      let data;

      if (contentType && contentType.includes("application/json")) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          data = {
            parseError: parseError.message,
            rawText: text.substring(0, 500),
          };
        }
      } else {
        data = {
          error: "Non-JSON response",
          contentType,
          isHTML: text.includes("<!DOCTYPE"),
          preview: text.substring(0, 500),
        };
      }

      setDebugInfo({
        backendConfig: configData,
        auth: {
          isSignedIn,
          isLoaded,
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          tokenPreview: token ? `${token.substring(0, 20)}...` : null,
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        },
        request: {
          url: apiUrl,
          headers: {
            Authorization: token ? "Bearer [TOKEN]" : "Missing",
            "Content-Type": "application/json",
          },
        },
        response: {
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
          contentType: response.headers.get("content-type"),
          data: data,
        },
        diagnosis: {
          apiReachable: !!response,
          authConfigured: configData && !configData.error,
          responseIsJSON:
            contentType && contentType.includes("application/json"),
          responseIsHTML: typeof data === "object" && data.isHTML,
          recommendedAction: getRecommendedAction(response, configData, data),
        },
        environment: {
          hostname: window.location.hostname,
          protocol: window.location.protocol,
          userAgent: navigator.userAgent.substring(0, 50) + "...",
        },
      });
    } catch (error) {
      console.error("Auth test error:", error);
      setDebugInfo({
        error: {
          message: error.message,
          stack: error.stack,
          type: error.constructor.name,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed top-4 right-4 bg-red-900 text-white p-4 rounded-lg shadow-lg max-w-md z-50">
      <h3 className="font-bold mb-2 text-red-200">🚨 Production Auth Debug</h3>

      <div className="text-xs mb-3 text-red-200">
        <div>Signed In: {isSignedIn ? "✅" : "❌"}</div>
        <div>Loaded: {isLoaded ? "✅" : "❌"}</div>
        <div>User: {user?.id ? user.id.substring(0, 8) + "..." : "None"}</div>
      </div>

      <button
        onClick={testProductionAuth}
        disabled={loading}
        className="bg-red-700 hover:bg-red-600 text-white px-3 py-1 rounded mb-2 disabled:opacity-50 w-full"
      >
        {loading ? "Testing..." : "🔍 Test Production Auth"}
      </button>

      {debugInfo && (
        <div className="text-xs">
          <div className="bg-gray-900 p-2 rounded overflow-auto max-h-60">
            <pre className="whitespace-pre-wrap">
              {JSON.stringify(debugInfo, null, 2)}
            </pre>
          </div>
          <button
            onClick={() => setDebugInfo(null)}
            className="mt-2 bg-gray-600 text-white px-2 py-1 rounded text-xs"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductionAuthDebugger;
