"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Clock, MapPin, Check, AlertCircle, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlow } from "@/lib/PatientFlowContext";
import StatusBadge from "@/components/ui/StatusBadge";

export default function DoctorPatientDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { getPatient } = useFlow();
  const patient = getPatient(id);

  if (!patient) return <div className="p-8 text-center">Patient not found</div>;

  const testSteps = patient.steps.filter((s) => s.title !== "Check-in" && !s.title.includes("Return") && !s.title.includes("Consultation"));
  const activeStep = patient.steps.find((s) => s.status === "in-progress" || s.status === "waiting") || patient.steps[patient.steps.length - 1];
  const isReturning = activeStep.id === patient.steps[patient.steps.length - 1].id && activeStep.status === "waiting";

  return (
    <div className="flex flex-col gap-6 max-w-4xl animate-fade-in">
      {/* Back Link */}
      <Link href="/doctor" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition font-semibold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to patients
      </Link>

      {/* Patient Header */}
      <div className="bg-card border border-border rounded-2xl p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{patient.name}</h1>
              <StatusBadge variant={isReturning ? "active" : "pending"} pulse={isReturning}>
                {isReturning ? "Returning to OPD" : "Out for tests"}
              </StatusBadge>
            </div>
            <p className="text-slate-500 text-sm mb-4">{patient.hn} · Age {patient.age} · Visit ID: <span className="font-mono text-xs">{patient.visitId}</span></p>
            
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex items-start gap-3">
              <FileText className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">Diagnosis / Reason</span>
                <span className="text-sm font-semibold text-slate-800">{patient.diagnosis}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm min-w-48 text-center flex flex-col justify-center shrink-0">
            <span className="text-3xl font-black text-slate-800 mb-1">{isReturning ? "~2m" : "~15m"}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3">Est. Return Time</span>
            <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-50 py-1.5 px-3 rounded-lg">
              <MapPin className="w-3.5 h-3.5 text-primary" /> {isReturning ? "Corridor" : activeStep.location}
            </div>
          </div>
        </div>
      </div>

      {/* Tests Timeline */}
      <h2 className="text-sm font-bold text-slate-800 mt-2">Test Progress Track</h2>
      <div className="bg-card border border-border rounded-2xl p-2 sm:p-6 overflow-x-auto">
        <div className="flex items-center gap-2 min-w-max">
          {testSteps.map((step, index) => {
            const isLast = index === testSteps.length - 1;
            return (
              <div key={step.id} className="flex items-center">
                {/* Step Node */}
                <div className={cn(
                  "flex flex-col items-center w-36 p-4 rounded-2xl transition-colors border-2",
                  step.status === "done" ? "border-success/20 bg-success/5" :
                  step.status === "in-progress" ? "border-primary/30 bg-accent/50" :
                  step.status === "waiting" ? "border-warning/30 bg-warning/5" :
                  "border-transparent bg-slate-50"
                )}>
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center mb-3 text-white ring-4 ring-white shadow-sm",
                    step.status === "done" ? "bg-success" :
                    step.status === "in-progress" ? "bg-primary animate-pulse" :
                    step.status === "waiting" ? "bg-amber-500" :
                    "bg-slate-300"
                  )}>
                    {step.status === "done" ? <Check className="w-4 h-4" /> : 
                     step.status === "waiting" ? <Clock className="w-4 h-4" /> :
                     <span className="text-sm font-bold leading-none">{index + 1}</span>}
                  </div>
                  <h3 className={cn(
                    "font-bold text-sm text-center mb-1",
                    step.status === "done" ? "text-slate-600" :
                    step.status === "upcoming" ? "text-slate-400" : "text-slate-800"
                  )}>{step.title}</h3>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest text-center">{step.location}</p>
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="w-8 sm:w-16 h-1 flex items-center mx-1">
                    <div className={cn(
                      "w-full h-full rounded-full transition-colors",
                      step.status === "done" ? "bg-success/30" : "bg-slate-100"
                    )} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
