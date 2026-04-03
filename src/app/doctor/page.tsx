"use client";

import Link from "next/link";
import { Users, Clock, AlertTriangle, ChevronRight, MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlow } from "@/lib/PatientFlowContext";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function DoctorDashboard() {
  const { state } = useFlow();
  
  // Filter for this doctor's patients
  const myPatients = state.patients.filter((p) => p.doctor === "Dr. Pattaraporn Suwan");

  // Calculate metrics
  const outForTests = myPatients.filter(p => !p.steps[p.steps.length - 1].status.includes("waiting") && p.steps.some(s => s.status === "in-progress" || (s.status === "waiting" && s.id !== p.steps[p.steps.length-1].id)));
  const returningSoon = myPatients.filter(p => p.steps[p.steps.length - 1].status === "waiting");
  
  // Just simulate a delayed calculation for now based on times
  const delayed = outForTests.filter((_, i) => i === 0);

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 stagger-children">
        <MetricCard value={outForTests.length} label="Patients out for tests" icon={<Users className="w-5 h-5" />} />
        <MetricCard value={returningSoon.length} label="Returning soon" icon={<Clock className="w-5 h-5" />} accentColor="#10b981" />
        <MetricCard value={delayed.length} label="Delayed" icon={<AlertTriangle className="w-5 h-5" />} accentColor="#ef4444" />
      </div>

      {/* Patient List */}
      <div className="bg-card border border-border rounded-2xl overflow-hidden mt-2">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-800">Patient test tracking</h2>
          <div className="flex items-center gap-3 text-xs font-semibold text-slate-400">
            <span>Sort:</span>
            <div className="flex bg-white border border-slate-200 rounded-lg p-0.5 shadow-sm">
              <button className="px-3 py-1 rounded-md bg-accent text-primary">ETA</button>
              <button className="px-3 py-1 rounded-md hover:text-slate-600 transition">Urgency</button>
              <button className="px-3 py-1 rounded-md hover:text-slate-600 transition">Name</button>
            </div>
          </div>
        </div>

        <div className="divide-y divide-slate-50">
          {myPatients.map((patient) => {
             // Find active step
             const activeStep = patient.steps.find(s => s.status === "in-progress" || s.status === "waiting") || patient.steps[patient.steps.length - 1];
             const isReturning = activeStep.id === patient.steps[patient.steps.length - 1].id && activeStep.status === "waiting";
             
             // Get tests status
             const testSteps = patient.steps.filter(s => s.title !== "Check-in" && !s.title.includes("Return") && !s.title.includes("Consultation"));

             return (
               <Link
                 key={patient.id}
                 href={`/doctor/patient/${patient.id}`}
                 className="flex flex-col sm:flex-row sm:items-center justify-between p-6 hover:bg-slate-50/80 transition-colors group cursor-pointer"
               >
                 <div className="flex-1 min-w-0 mb-4 sm:mb-0">
                   <div className="flex items-center gap-3 mb-2">
                     <h3 className="text-base font-bold text-slate-800">{patient.name}</h3>
                     <span className="text-xs text-slate-400 font-mono tracking-wide">{patient.hn}</span>
                   </div>
                   
                   <div className="flex flex-wrap items-center gap-2 mb-3">
                     {testSteps.map((step) => (
                       <StatusBadge 
                         key={step.id} 
                         variant={step.status === "done" ? "done" : step.status === "in-progress" ? "active" : "pending"}
                         pulse={step.status === "in-progress"}
                       >
                         {step.title}
                       </StatusBadge>
                     ))}
                   </div>
                   
                   <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                     <MapPin className="w-3.5 h-3.5" />
                     {isReturning ? "Walking back to you" : activeStep.location}
                   </div>
                 </div>

                 <div className="flex items-center justify-between sm:justify-end gap-6 sm:w-48 text-right shrink-0">
                   <div>
                     <div className="text-xl font-extrabold text-slate-800 mb-1 leading-none">{isReturning ? "~2m" : "~15m"}</div>
                     <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2">Return ETA</div>
                     <StatusBadge variant={isReturning ? "active" : "done"} pulse={isReturning}>
                       {isReturning ? "Returning" : "On time"}
                     </StatusBadge>
                   </div>
                   <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-colors" />
                 </div>
               </Link>
             );
          })}
        </div>
      </div>
    </div>
  );
}
