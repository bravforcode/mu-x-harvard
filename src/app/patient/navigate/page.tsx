"use client";

import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Hash, ArrowRight } from "lucide-react";
import { useFlow } from "@/lib/PatientFlowContext";
import HospitalMap3D from "@/components/HospitalMap3D";
import StatusBadge from "@/components/ui/StatusBadge";
import { useState } from "react";

export default function PatientNavigate() {
  const { getPatient, completeStep } = useFlow();
  const currentPatient = getPatient("p-001");
  // Avoid SSR-only mismatches without triggering lint errors about setState in effects.
  const [mounted] = useState(() => typeof window !== "undefined");

  if (!mounted || !currentPatient) return null;

  const patientSteps = currentPatient.steps;
  const activeStepIndex = patientSteps.findIndex((s) => s.status === "in-progress" || s.status === "waiting");
  const activeStep = activeStepIndex !== -1 ? patientSteps[activeStepIndex] : patientSteps[patientSteps.length - 1];

  // We map the active step index to the map route:
  // Patient steps: 0 = Check-in (Registration, Ground), 1 = OPD, 2 = Lab, 3 = X-ray, 4 = Return to doctor.
  const mapStepMap: Record<number, number> = {
    0: 3, // To Registration desk (Ground)
    1: 0, // To OPD
    2: 1, // To Lab 3B
    3: 2, // To X-Ray
    4: 0, // Back to OPD
  };
  const currentMapStep = mapStepMap[activeStepIndex] ?? 0;
  const isCompletable = activeStep.status === "waiting" || activeStep.status === "in-progress";

  return (
    <div className="absolute inset-0 flex flex-col bg-slate-50">
      {/* 3D Map Area */}
      <div className="flex-1 relative z-0">
         <HospitalMap3D currentStep={currentMapStep} mode="patient" />
      </div>

      {/* Bottom Sheet Controls */}
      <div className="relative z-10 bg-white rounded-t-3xl shadow-[0_-10px_30px_rgba(0,0,0,0.05)] border-t border-slate-100 overflow-hidden flex flex-col">
        {/* Drag handle */}
        <div className="w-full h-6 flex items-center justify-center shrink-0">
          <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
        </div>

        <div className="px-6 pb-6 pt-1 flex-1 overflow-auto">
          <div className="flex items-center justify-between mb-4">
             <div>
               <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Current destination</p>
               <h2 className="text-xl font-bold text-slate-800">{activeStep.location}</h2>
             </div>
             <StatusBadge variant="active" pulse>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
                  Navigating
                </div>
             </StatusBadge>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-6">
             <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center">
               <Clock className="w-5 h-5 text-slate-400 mb-1.5" />
               <span className="text-sm font-extrabold text-slate-800">{activeStep.queueWait || "--"}</span>
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Wait</span>
             </div>
             <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center">
               <Hash className="w-5 h-5 text-slate-400 mb-1.5" />
               <span className="text-sm font-extrabold text-slate-800">{activeStep.queueNumber || currentPatient.queueNumber}</span>
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Ticket</span>
             </div>
             <div className="bg-slate-50 rounded-2xl p-4 flex flex-col items-center justify-center">
               <MapPin className="w-5 h-5 text-slate-400 mb-1.5" />
               <span className="text-sm font-extrabold text-slate-800">{activeStep.walkTime || "--"}</span>
               <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Walk Time</span>
             </div>
          </div>

          <div className="flex gap-3">
            <Link
              href="/patient"
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-xl py-3 px-5 font-bold text-sm flex items-center justify-center transition-colors border border-slate-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
            </Link>
            <button
              onClick={() => {
                if (!isCompletable) return;
                completeStep(currentPatient.id, activeStep.id);
              }}
              className="flex-1 bg-primary hover:bg-indigo-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_4px_16px_rgba(79,107,237,0.3)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!isCompletable}
            >
              {activeStep.title.toLowerCase().includes("check-in")
                ? "Confirm check-in complete"
                : "Mark this stop complete"}{" "}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
