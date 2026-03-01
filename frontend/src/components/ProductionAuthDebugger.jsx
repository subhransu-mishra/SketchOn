import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

const ProductionAuthDebugger = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testProductionAuth = async () => {
    setLoading(true);
    setDebugInfo(null);

    try {
      console.log("=== PRODUCTION AUTH DEBUG ===");

      // First, check backend config
      const configUrl =
        "https://whiteboard-ai-a5pt.onrender.com/api/debug/config";
      const configResponse = await fetch(configUrl);
      const configData = await configResponse.json();
      console.log("Backend config:", configData);

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

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
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
          data: data,
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
