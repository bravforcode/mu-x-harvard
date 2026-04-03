import type { Patient, PatientStep, FlowState } from "./PatientFlowContext";

// In-memory server-side state for demo purposes.
const now = () =>
  new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

const INITIAL_STATE: FlowState = {
  patients: [
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
        {
          id: "s1",
          title: "Check-in",
          location: "Registration Desk",
          floor: "Ground",
          department: "Registration",
          status: "waiting",
          time: "09:00 AM",
          queueNumber: "Q001",
          queueWait: "5m",
          walkTime: "1m",
          notes: "Please take a ticket at the kiosk.",
        },
        { id: "s2", title: "OPD Consultation", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "09:15 AM", notes: "Dr. Suwan" },
        { id: "s3", title: "Blood draw", location: "Lab 3B", floor: "Floor 3", department: "Lab 3B", status: "upcoming", time: "~09:30 AM", notes: "Blood collection" },
        { id: "s4", title: "X-ray", location: "X-Ray Suite 1", floor: "Floor 4", department: "X-Ray Suite 1", status: "upcoming", time: "~09:40 AM", notes: "Chest X-ray" },
        { id: "s5", title: "Return to doctor", location: "OPD Room 204", floor: "Floor 2", department: "OPD 204", status: "upcoming", time: "~09:50 AM", notes: "Review results with Dr. Suwan" },
      ],
    },
  ],
  lastUpdate: Date.now(),
};

let state: FlowState = INITIAL_STATE;

export function getPatientServer(id: string): Patient | undefined {
  return state.patients.find((p) => p.id === id);
}

export function completeStepServer(patientId: string, stepId: string): Patient | undefined {
  const updatedPatients: Patient[] = state.patients.map((p) => {
    if (p.id !== patientId) return p;
    let foundTarget = false;
    const steps: PatientStep[] = p.steps.map((s) => {
      if (s.id === stepId) {
        foundTarget = true;
        return { ...s, status: "done", completedAt: now() };
      }
      if (foundTarget && s.status === "upcoming") {
        foundTarget = false;
        return { ...s, status: "waiting" };
      }
      return s;
    });
    return { ...p, steps };
  });

  state = { patients: updatedPatients, lastUpdate: Date.now() };
  return getPatientServer(patientId);
}

