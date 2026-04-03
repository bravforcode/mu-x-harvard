"use client";

import React, { createContext, useCallback, useContext, useEffect, useReducer } from "react";

export type StepStatus = "waiting" | "checked-in" | "in-progress" | "done" | "upcoming";

export interface PatientStep {
  id: string;
  title: string;
  location: string;
  floor: string;
  department: string;
  status: StepStatus;
  time: string;
  queueNumber?: string;
  queueWait?: string;
  walkTime?: string;
  notes?: string;
  checkedInAt?: string;
  completedAt?: string;
}

export interface Patient {
  id: string;
  name: string;
  hn: string;
  age: number;
  visitId: string;
  queueNumber: string;
  doctor: string;
  doctorDepartment: string;
  diagnosis: string;
  estimatedDoneBy: string;
  steps: PatientStep[];
}

export interface FlowState {
  patients: Patient[];
  lastUpdate: number;
}

type FlowAction =
  | { type: "CHECK_IN"; patientId: string; stepId: string }
  | { type: "COMPLETE_STEP"; patientId: string; stepId: string }
  | { type: "SYNC_STATE"; state: FlowState };

const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const INITIAL_STATE: FlowState = {
  patients: [],
  lastUpdate: 0,
};

function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "CHECK_IN":
    case "COMPLETE_STEP":
      // In this SPA, we treat backend as source of truth.
      // These actions aren't used directly; we always sync via SYNC_STATE.
      return state;
    case "SYNC_STATE":
      if (action.state.lastUpdate > state.lastUpdate) return action.state;
      return state;
    default:
      return state;
  }
}

interface FlowContextType {
  state: FlowState;
  checkIn: (patientId: string, stepId: string) => void;
  completeStep: (patientId: string, stepId: string) => void;
  getPatient: (id: string) => Patient | undefined;
}

const FlowContext = createContext<FlowContextType | null>(null);

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within FlowProvider");
  return ctx;
}

const CHANNEL_NAME = "waypoint-flow-sync";
const STORAGE_KEY = "waypoint-flow-state-v2";

export function FlowProvider({ children }: { children: React.ReactNode }) {
  const getInitial = (): FlowState => {
    return INITIAL_STATE;
  };

  const [state, dispatch] = useReducer(flowReducer, INITIAL_STATE, getInitial);

  useEffect(() => {
    // Initial load of patient from backend (demo: single patient).
    fetch("/api/patient/p-001")
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((patient: Patient) => {
        const nextState: FlowState = { patients: [patient], lastUpdate: Date.now() };
        dispatch({ type: "SYNC_STATE", state: nextState });
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        }
      })
      .catch(() => {
        // If backend fails, fall back to any cached state.
        if (typeof window === "undefined") return;
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            const parsed = JSON.parse(stored) as FlowState;
            if (parsed.patients && parsed.lastUpdate) {
              dispatch({ type: "SYNC_STATE", state: parsed });
            }
          } catch {
            // ignore
          }
        }
      });
  }, []);

  const checkIn = useCallback((patientId: string, stepId: string) => {
    // Not wired yet; demo focuses on completeStep.
    void patientId;
    void stepId;
  }, []);

  const completeStep = useCallback((patientId: string, stepId: string) => {
    fetch(`/api/patient/${patientId}/steps/${stepId}/complete`, { method: "POST" })
      .then((res) => (res.ok ? res.json() : Promise.reject(res)))
      .then((patient: Patient) => {
        const nextState: FlowState = { patients: [patient], lastUpdate: Date.now() };
        dispatch({ type: "SYNC_STATE", state: nextState });
        if (typeof window !== "undefined") {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
        }
      })
      .catch(() => {
        // swallow for now; UI can stay on previous state
      });
  }, []);

  const getPatient = useCallback(
    (id: string) => state.patients.find((p) => p.id === id),
    [state.patients]
  );

  return <FlowContext.Provider value={{ state, checkIn, completeStep, getPatient }}>{children}</FlowContext.Provider>;
}

