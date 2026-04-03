"use client";

import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from "react";

// ============================================
// TYPES
// ============================================
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

// ============================================
// ACTIONS
// ============================================
type FlowAction =
  | { type: "CHECK_IN"; patientId: string; stepId: string }
  | { type: "COMPLETE_STEP"; patientId: string; stepId: string }
  | { type: "SYNC_STATE"; state: FlowState };

// ============================================
// INITIAL DATA
// ============================================
const now = () => new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });

const INITIAL_PATIENTS: Patient[] = [
  {
    id: "p-001",
    name: "Somchai Wattana",
    hn: "HN 20241089",
    age: 52,
    visitId: "V-20260403-001",
    queueNumber: "A001",
    doctor: "Dr. Pattaraporn Suwan",
    doctorDepartment: "OPD 204",
    diagnosis: "Annual check-up follow-up",
    estimatedDoneBy: "11:20",
    steps: [
      { id: "s1", title: "Check-in", location: "Registration Desk", floor: "Ground", department: "Registration", status: "waiting", time: "09:00 AM", queueNumber: "Q001", queueWait: "5m", walkTime: "1m", notes: "Please take a ticket at the kiosk." },
      { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "09:15 AM", notes: "Dr. Suwan" },
      { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "upcoming", time: "~09:30 AM", notes: "Blood collection" },
      { id: "s4", title: "X-ray", location: "X-Ray Suite 1", floor: "Floor 4", department: "X-Ray Suite 1", status: "upcoming", time: "~09:40 AM", notes: "Chest X-ray" },
      { id: "s5", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "~09:50 AM", notes: "Review results with Dr. Suwan" },
    ],
  },
  {
    id: "p-002",
    name: "Napat Thongchai",
    hn: "HN 20241090",
    age: 34,
    visitId: "V-20260403-002",
    queueNumber: "A002",
    doctor: "Dr. Pattaraporn Suwan",
    doctorDepartment: "OPD 204",
    diagnosis: "Pre-surgery preparation",
    estimatedDoneBy: "10:45",
    steps: [
      { id: "s1", title: "Check-in", location: "Registration Desk", floor: "Ground", department: "Registration", status: "done", time: "08:50 AM", completedAt: "08:50 AM" },
      { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "done", time: "08:55 AM", completedAt: "09:10 AM" },
      { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "done", time: "09:12 AM", completedAt: "09:20 AM" },
      { id: "s4", title: "X-ray", location: "X-Ray Suite 1", floor: "Floor 4", department: "X-Ray Suite 1", status: "done", time: "09:22 AM", completedAt: "09:30 AM" },
      { id: "s5", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "waiting", time: "~09:35 AM", notes: "Walking back to OPD" },
    ],
  },
  {
    id: "p-003",
    name: "Siriporn Kaewkla",
    hn: "HN 20241091",
    age: 67,
    visitId: "V-20260403-003",
    queueNumber: "A003",
    doctor: "Dr. Pattaraporn Suwan",
    doctorDepartment: "OPD 204",
    diagnosis: "Diabetes management",
    estimatedDoneBy: "11:45",
    steps: [
      { id: "s1", title: "Check-in", location: "Registration Desk", floor: "Ground", department: "Registration", status: "done", time: "09:00 AM", completedAt: "09:00 AM" },
      { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "done", time: "09:10 AM", completedAt: "09:20 AM" },
      { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "waiting", time: "09:25 AM", queueNumber: "A003", queueWait: "18m", walkTime: "3m", notes: "Diabetes panel" },
      { id: "s4", title: "CT Scan", location: "CT Scan", floor: "Floor 4", department: "CT Scan", status: "upcoming", time: "~09:50 AM", queueNumber: "C-05", queueWait: "~12m", walkTime: "2m", notes: "Abdominal CT" },
      { id: "s5", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "~10:10 AM", notes: "Review results" },
    ],
  },
  {
    id: "p-004",
    name: "Anong Prasert",
    hn: "HN 20241092",
    age: 45,
    visitId: "V-20260403-004",
    queueNumber: "A004",
    doctor: "Dr. Pattaraporn Suwan",
    doctorDepartment: "OPD 204",
    diagnosis: "Routine screening",
    estimatedDoneBy: "10:30",
    steps: [
      { id: "s1", title: "Check-in", location: "Registration Desk", floor: "Ground", department: "Registration", status: "done", time: "09:00 AM", completedAt: "09:00 AM" },
      { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "done", time: "09:05 AM", completedAt: "09:15 AM" },
      { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "done", time: "09:18 AM", completedAt: "09:25 AM" },
      { id: "s4", title: "X-ray", location: "X-Ray Suite 1", floor: "Floor 4", department: "X-Ray Suite 1", status: "in-progress", time: "09:30 AM", queueNumber: "B-14", checkedInAt: "09:28 AM", notes: "Chest X-ray" },
      { id: "s5", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "~09:45 AM" },
    ],
  },
  {
    id: "p-005",
    name: "Prasit Wongsin",
    hn: "HN 20241093",
    age: 73,
    visitId: "V-20260403-005",
    queueNumber: "A005",
    doctor: "Dr. Pattaraporn Suwan",
    doctorDepartment: "OPD 204",
    diagnosis: "Cardiology referral",
    estimatedDoneBy: "12:00",
    steps: [
      { id: "s1", title: "Check-in", location: "Registration Desk", floor: "Ground", department: "Registration", status: "done", time: "09:05 AM", completedAt: "09:05 AM" },
      { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "done", time: "09:15 AM", completedAt: "09:25 AM" },
      { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "waiting", time: "09:30 AM", queueNumber: "A005", queueWait: "22m", walkTime: "3m", notes: "Cardiac enzyme panel" },
      { id: "s4", title: "ECG", location: "OPD 201", floor: "Floor 2", department: "OPD 201", status: "upcoming", time: "~10:00 AM", queueWait: "~8m", notes: "Electrocardiogram" },
      { id: "s5", title: "Echocardiogram", location: "Ultrasound", floor: "Floor 4", department: "Ultrasound", status: "upcoming", time: "~10:15 AM", queueWait: "~15m", notes: "Heart ultrasound" },
      { id: "s6", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "~10:40 AM" },
    ],
  },
];

const INITIAL_STATE: FlowState = {
  patients: INITIAL_PATIENTS,
  lastUpdate: Date.now(),
};

// ============================================
// REDUCER
// ============================================
function flowReducer(state: FlowState, action: FlowAction): FlowState {
  switch (action.type) {
    case "CHECK_IN": {
      const patients = state.patients.map((p) => {
        if (p.id !== action.patientId) return p;
        const steps = p.steps.map((s) => {
          if (s.id !== action.stepId) return s;
          return { ...s, status: "in-progress" as StepStatus, checkedInAt: now() };
        });
        return { ...p, steps };
      });
      return { patients, lastUpdate: Date.now() };
    }
    case "COMPLETE_STEP": {
      const patients = state.patients.map((p) => {
        if (p.id !== action.patientId) return p;
        let foundTarget = false;
        const steps = p.steps.map((s) => {
          if (s.id === action.stepId) {
            foundTarget = true;
            return { ...s, status: "done" as StepStatus, completedAt: now() };
          }
          // Make the next step after completed one become "waiting"
          if (foundTarget && (s.status === "upcoming")) {
            foundTarget = false;
            return { ...s, status: "waiting" as StepStatus };
          }
          return s;
        });
        return { ...p, steps };
      });
      return { patients, lastUpdate: Date.now() };
    }
    case "SYNC_STATE":
      // Only accept newer state
      if (action.state.lastUpdate > state.lastUpdate) {
        return action.state;
      }
      return state;
    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================
interface FlowContextType {
  state: FlowState;
  checkIn: (patientId: string, stepId: string) => void;
  completeStep: (patientId: string, stepId: string) => void;
  getPatient: (id: string) => Patient | undefined;
  getPatientsAtDepartment: (department: string) => { patient: Patient; step: PatientStep }[];
  getDepartments: () => string[];
}

const FlowContext = createContext<FlowContextType | null>(null);

export function useFlow() {
  const ctx = useContext(FlowContext);
  if (!ctx) throw new Error("useFlow must be used within FlowProvider");
  return ctx;
}

// ============================================
// PROVIDER
// ============================================
const CHANNEL_NAME = "waypoint-flow-sync";
const STORAGE_KEY = "waypoint-flow-state-v2";

export function FlowProvider({ children }: { children: React.ReactNode }) {
  // Load from localStorage if available
  const getInitial = (): FlowState => {
    if (typeof window === "undefined") return INITIAL_STATE;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as FlowState;
        if (parsed.patients && parsed.lastUpdate) return parsed;
      }
    } catch {}
    return INITIAL_STATE;
  };

  const [state, dispatch] = useReducer(flowReducer, INITIAL_STATE, getInitial);
  const channelRef = useRef<BroadcastChannel | null>(null);

  // BroadcastChannel for cross-tab sync
  useEffect(() => {
    try {
      const channel = new BroadcastChannel(CHANNEL_NAME);
      channelRef.current = channel;
      channel.onmessage = (e) => {
        if (e.data?.type === "STATE_UPDATE") {
          dispatch({ type: "SYNC_STATE", state: e.data.state });
        }
      };
      return () => channel.close();
    } catch {
      // BroadcastChannel not supported, fall back to storage events
      const handler = (e: StorageEvent) => {
        if (e.key === STORAGE_KEY && e.newValue) {
          try {
            const s = JSON.parse(e.newValue) as FlowState;
            dispatch({ type: "SYNC_STATE", state: s });
          } catch {}
        }
      };
      window.addEventListener("storage", handler);
      return () => window.removeEventListener("storage", handler);
    }
  }, []);

  // Persist and broadcast on every state change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    try {
      channelRef.current?.postMessage({ type: "STATE_UPDATE", state });
    } catch {}
  }, [state]);

  const checkIn = useCallback((patientId: string, stepId: string) => {
    dispatch({ type: "CHECK_IN", patientId, stepId });
  }, []);

  const completeStep = useCallback((patientId: string, stepId: string) => {
    dispatch({ type: "COMPLETE_STEP", patientId, stepId });
  }, []);

  const getPatient = useCallback((id: string) => {
    return state.patients.find((p) => p.id === id);
  }, [state.patients]);

  const getPatientsAtDepartment = useCallback((department: string) => {
    const results: { patient: Patient; step: PatientStep }[] = [];
    for (const patient of state.patients) {
      for (const step of patient.steps) {
        if (step.department === department && (step.status === "waiting" || step.status === "in-progress")) {
          results.push({ patient, step });
        }
      }
    }
    return results;
  }, [state.patients]);

  const getDepartments = useCallback(() => {
    const depts = new Set<string>();
    for (const patient of state.patients) {
      for (const step of patient.steps) {
        if (step.department) depts.add(step.department);
      }
    }
    return Array.from(depts).sort();
  }, [state.patients]);

  return (
    <FlowContext.Provider value={{ state, checkIn, completeStep, getPatient, getPatientsAtDepartment, getDepartments }}>
      {children}
    </FlowContext.Provider>
  );
}
