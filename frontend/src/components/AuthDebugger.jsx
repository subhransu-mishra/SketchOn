import { useAuth, useUser } from "@clerk/clerk-react";
import React, { useState } from "react";

const AuthDebugger = () => {
  const { getToken, isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      const response = await fetch("/api/debug/auth-test", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ test: "auth" }),
      });

      const data = await response.json();

      setDebugInfo({
        authState: {
          isSignedIn,
          isLoaded,
          hasToken: !!token,
          tokenLength: token ? token.length : 0,
          userId: user?.id,
          userEmail: user?.primaryEmailAddress?.emailAddress,
        },
        apiResponse: {
          status: response.status,
          data: data,
        },
      });
    } catch (error) {
      setDebugInfo({
        error: error.message,
        stack: error.stack,
      });
    } finally {
      setLoading(false);
    }
  };

  if (import.meta.env.NODE_ENV === "production") {
    return null; // Don't show in production
  }

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-sm">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <button
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-600 text-white px-3 py-1 rounded mb-2 disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Auth"}
      </button>

      {debugInfo && (
        <pre className="text-xs bg-gray-900 p-2 rounded overflow-auto max-h-40">
          {JSON.stringify(debugInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default AuthDebugger;
