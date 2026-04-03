import React, { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FlowProvider } from "./lib/PatientFlowContext";
import { PatientLayout } from "./layouts/PatientLayout";
import { PatientHome } from "./routes/PatientHome";

interface HealthResponse {
  status: string;
}

function NavigatePlaceholder({ title }: { title: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6">
      <h1 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h1>
      <p className="text-slate-500 text-sm mt-2">
        This screen will be migrated next (map + timeline). For now, Patient Home is fully migrated into the React SPA.
      </p>
    </div>
  );
}

export const App: React.FC = () => {
  const [backendHealth, setBackendHealth] = useState<HealthResponse | null>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((data: HealthResponse) => setBackendHealth(data))
      .catch(() => setBackendHealth(null));
  }, []);

  return (
    <BrowserRouter>
      <div className="fixed top-2 left-2 z-[1000] bg-white/90 backdrop-blur border border-slate-200/70 rounded-xl px-3 py-2 shadow-sm">
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest">Backend</div>
        <div className="text-xs font-bold text-slate-700">
          {backendHealth?.status === "ok" ? "online" : "checking..."}
        </div>
      </div>

      <FlowProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/patient" replace />} />

          <Route
            path="/patient"
            element={
              <PatientLayout>
                <PatientHome />
              </PatientLayout>
            }
          />

          <Route
            path="/patient/navigate"
            element={
              <PatientLayout>
                <NavigatePlaceholder title="Navigate" />
              </PatientLayout>
            }
          />

          <Route
            path="/patient/timeline"
            element={
              <PatientLayout>
                <NavigatePlaceholder title="Timeline" />
              </PatientLayout>
            }
          />

          <Route path="*" element={<Navigate to="/patient" replace />} />
        </Routes>
      </FlowProvider>
    </BrowserRouter>
  );
};

