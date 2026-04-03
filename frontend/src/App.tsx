import React, { useEffect, useState } from "react";

interface HealthResponse {
  status: string;
}

export const App: React.FC = () => {
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.ok ? res.json() : Promise.reject(res))
      .then((data: HealthResponse) => setBackendHealth(data))
      .catch(() => setBackendHealth(null));
  }, []);

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f5f5f7" }}>
      <div style={{ maxWidth: 480, width: "100%", padding: 24, borderRadius: 24, background: "#ffffff", boxShadow: "0 18px 60px rgba(15, 23, 42, 0.12)", fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif" }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#0f172a" }}>
          WayPoint Frontend Shell
        </h1>
        <p style={{ fontSize: 14, color: "#64748b", marginBottom: 16 }}>
          This is a pure React SPA that will talk to the Next.js backend.
        </p>
        <div style={{ padding: 12, borderRadius: 16, background: "#f8fafc", fontSize: 12, color: "#0f172a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span>Backend health:</span>
          <span style={{ fontWeight: 600 }}>
            {backendHealth?.status === "ok" ? "online" : "checking..."}
          </span>
        </div>
      </div>
    </div>
  );
};

