// ============================================
// WayPoint — Centralized Mock Data
// ============================================

// ---------- PATIENT DATA ----------
export const currentPatient = {
  id: "p-001",
  name: "Somchai Wattana",
  hn: "HN 20241089",
  age: 52,
  visitId: "V-20260403-001",
  queueNumber: "A001",
  status: "active" as const,
  doctor: "Dr. Pattaraporn Suwan",
  department: "OPD Room 204",
  diagnosis: "Annual check-up follow-up",
  estimatedDoneBy: "11:20",
  totalEstMinutes: 50,
};

export type StepStatus = "done" | "active" | "upcoming";

export interface PatientStep {
  id: string;
  title: string;
  location: string;
  floor: string;
  status: StepStatus;
  time: string;
  queueNumber?: string;
  queueWait?: string;
  walkTime?: string;
  notes?: string;
}

export const patientSteps: PatientStep[] = [
  {
    id: "s1",
    title: "Check-in",
    location: "Registration Desk",
    floor: "Floor 1",
    status: "done",
    time: "09:00 AM",
    notes: "Registration complete",
  },
  {
    id: "s2",
    title: "OPD Consultation",
    location: "OPD Room 204",
    floor: "Floor 2",
    status: "done",
    time: "09:05 AM",
    notes: "Dr. Suwan · Vitals recorded",
  },
  {
    id: "s3",
    title: "Blood draw",
    location: "Lab 3B",
    floor: "Floor 1",
    status: "active",
    time: "09:20 AM",
    queueNumber: "A001",
    queueWait: "14m",
    walkTime: "3m",
    notes: "Blood collection",
  },
  {
    id: "s4",
    title: "X-ray",
    location: "Radiology Wing B",
    floor: "Floor 1",
    status: "upcoming",
    time: "~09:40 AM",
    queueNumber: "B-12",
    queueWait: "~6m",
    walkTime: "2m",
    notes: "Chest X-ray",
  },
  {
    id: "s5",
    title: "Return to doctor",
    location: "OPD Room 204",
    floor: "Floor 2",
    status: "upcoming",
    time: "~09:50 AM",
    notes: "Review results with Dr. Suwan",
  },
];

// ---------- DOCTOR'S PATIENTS ----------
export interface DoctorPatient {
  id: string;
  name: string;
  hn: string;
  age: number;
  currentLocation: string;
  tests: {
    name: string;
    status: "done" | "active" | "upcoming";
  }[];
  etaMinutes: number;
  urgency: "normal" | "soon" | "delayed";
  notes?: string;
}

export const doctorInfo = {
  name: "Dr. Pattaraporn Suwan",
  department: "OPD Room 204",
  session: "Morning Session",
  patientsOut: 5,
  returningSoon: 2,
  delayed: 1,
  avgReturnMin: 12,
};

export const doctorPatients: DoctorPatient[] = [
  {
    id: "p-001",
    name: "Somchai Wattana",
    hn: "HN 20241089",
    age: 52,
    currentLocation: "Lab 3B",
    tests: [
      { name: "Blood", status: "active" },
      { name: "X-ray", status: "upcoming" },
    ],
    etaMinutes: 25,
    urgency: "normal",
    notes: "Annual follow-up. Blood panel + chest X-ray.",
  },
  {
    id: "p-002",
    name: "Napat Thongchai",
    hn: "HN 20241090",
    age: 34,
    currentLocation: "Walking to OPD",
    tests: [
      { name: "Blood", status: "done" },
      { name: "X-ray", status: "done" },
    ],
    etaMinutes: 5,
    urgency: "soon",
    notes: "Pre-surgery preparation. All tests complete.",
  },
  {
    id: "p-003",
    name: "Siriporn Kaewkla",
    hn: "HN 20241091",
    age: 67,
    currentLocation: "Lab 3B Queue",
    tests: [
      { name: "Blood", status: "active" },
      { name: "CT Scan", status: "upcoming" },
    ],
    etaMinutes: 35,
    urgency: "delayed",
    notes: "Diabetes management. Lab queue is long.",
  },
  {
    id: "p-004",
    name: "Anong Prasert",
    hn: "HN 20241092",
    age: 45,
    currentLocation: "Radiology Wing B",
    tests: [
      { name: "Blood", status: "done" },
      { name: "X-ray", status: "active" },
    ],
    etaMinutes: 12,
    urgency: "normal",
    notes: "Routine screening. X-ray in progress.",
  },
  {
    id: "p-005",
    name: "Prasit Wongsin",
    hn: "HN 20241093",
    age: 73,
    currentLocation: "Lab 3B",
    tests: [
      { name: "Blood", status: "active" },
      { name: "ECG", status: "upcoming" },
      { name: "Echo", status: "upcoming" },
    ],
    etaMinutes: 45,
    urgency: "delayed",
    notes: "Cardiology referral. Multiple tests required.",
  },
];

// ---------- ADMIN / DEPARTMENTS ----------
export interface Department {
  id: string;
  name: string;
  floor: string;
  zone: string;
  status: "normal" | "busy" | "critical";
  currentQueue: number;
  avgWaitMin: number;
  activePatients: number;
  throughputPerHour: number;
  trend: number[]; // last 6 intervals
}

export const adminMetrics = {
  activePatients: 142,
  totalInQueue: 23,
  avgWaitMin: 8.5,
  activeAlerts: 3,
  busiestDept: "Lab",
};

export const departments: Department[] = [
  {
    id: "opd",
    name: "OPD",
    floor: "Floor 2",
    zone: "North Wing",
    status: "normal",
    currentQueue: 8,
    avgWaitMin: 6,
    activePatients: 24,
    throughputPerHour: 18,
    trend: [12, 14, 10, 8, 11, 8],
  },
  {
    id: "lab-3b",
    name: "Lab 3B",
    floor: "Floor 1",
    zone: "East Wing",
    status: "busy",
    currentQueue: 16,
    avgWaitMin: 14,
    activePatients: 31,
    throughputPerHour: 12,
    trend: [8, 10, 14, 16, 15, 16],
  },
  {
    id: "radiology",
    name: "Radiology",
    floor: "Floor 1",
    zone: "South Wing",
    status: "normal",
    currentQueue: 6,
    avgWaitMin: 6,
    activePatients: 12,
    throughputPerHour: 10,
    trend: [6, 8, 7, 5, 6, 6],
  },
  {
    id: "ct-scan",
    name: "CT Scan",
    floor: "Floor 1",
    zone: "South Wing",
    status: "normal",
    currentQueue: 3,
    avgWaitMin: 12,
    activePatients: 5,
    throughputPerHour: 5,
    trend: [3, 4, 3, 2, 3, 3],
  },
  {
    id: "pharmacy",
    name: "Pharmacy",
    floor: "Floor 1",
    zone: "Main Lobby",
    status: "busy",
    currentQueue: 22,
    avgWaitMin: 18,
    activePatients: 28,
    throughputPerHour: 15,
    trend: [12, 15, 18, 20, 22, 22],
  },
  {
    id: "emergency",
    name: "Emergency",
    floor: "Floor 1",
    zone: "West Wing",
    status: "critical",
    currentQueue: 11,
    avgWaitMin: 24,
    activePatients: 19,
    throughputPerHour: 8,
    trend: [6, 8, 10, 14, 11, 11],
  },
];

export const adminAlerts = [
  {
    id: "a1",
    type: "warning" as const,
    title: "Lab 3B queue above threshold",
    message: "16 patients waiting. Avg wait: 14 min.",
    time: "2 min ago",
    department: "Lab 3B",
  },
  {
    id: "a2",
    type: "critical" as const,
    title: "Emergency department overload",
    message: "19 active patients. Consider diversion.",
    time: "5 min ago",
    department: "Emergency",
  },
  {
    id: "a3",
    type: "warning" as const,
    title: "Pharmacy wait time rising",
    message: "Average wait now 18 min, up from 12 min.",
    time: "8 min ago",
    department: "Pharmacy",
  },
];
