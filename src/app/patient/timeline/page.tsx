"use client";

import { Check, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFlow } from "@/lib/PatientFlowContext";
import StatusBadge from "@/components/ui/StatusBadge";

export default function PatientTimeline() {
  const { getPatient } = useFlow();
  const currentPatient = getPatient("p-001");

  if (!currentPatient) return <div className="p-8 text-center text-slate-500">Patient not found</div>;
  const patientSteps = currentPatient.steps;

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-800 tracking-tight">Full journey</h1>
          <p className="text-slate-400 text-xs font-medium">{currentPatient.visitId}</p>
        </div>
        <StatusBadge variant="active" pulse>In progress</StatusBadge>
      </div>

      {/* Timeline */}
      <div className="relative pl-6 md:pl-8 border-l-2 border-slate-100 space-y-8">
        {patientSteps.map((step) => {
          const isActive = step.status === "waiting" || step.status === "in-progress";
          return (
            <div key={step.id} className="relative">
              <div className={cn(
                "absolute -left-[33px] md:-left-[41px] top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-white",
                step.status === "done" && "bg-success",
                step.status === "in-progress" && "bg-primary shadow-[0_0_15px_rgba(79,107,237,0.4)]",
                step.status === "waiting" && "bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]",
                step.status === "upcoming" && "bg-white border-2 border-slate-200",
              )}>
                {step.status === "done" && <Check className="w-3.5 h-3.5 text-white" />}
                {step.status === "in-progress" && <div className="w-2 h-2 bg-white rounded-full animate-pulse" />}
                {step.status === "waiting" && <Clock className="w-3.5 h-3.5 text-white" />}
                {step.status === "upcoming" && <div className="w-1.5 h-1.5 bg-slate-300 rounded-full" />}
              </div>

              <div className={cn(
                "bg-card border rounded-2xl p-5 transition-all shadow-sm",
                step.status === "in-progress" ? "border-primary/20 bg-accent/30" : "border-border",
                step.status === "waiting" ? "border-amber-500/30 bg-amber-50/50" : ""
              )}>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={cn(
                        "font-bold text-base",
                        step.status === "done" && "text-slate-500",
                        step.status === "in-progress" && "text-primary",
                        step.status === "waiting" && "text-amber-600",
                        step.status === "upcoming" && "text-slate-400"
                      )}>
                        {step.title}
                      </h3>
                      {step.status === "in-progress" && <StatusBadge variant="active">In progress</StatusBadge>}
                      {step.status === "waiting" && <StatusBadge variant="warning">Waiting</StatusBadge>}
                    </div>
                    <p className="text-sm text-slate-500">{step.location}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{step.floor} &middot; Expected: {step.time}</p>
                  </div>
                </div>

                {(isActive) && (
                  <div className="grid grid-cols-2 gap-3 mb-0 pt-4 border-t border-slate-100">
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Queue Number</span>
                      <span className="text-lg font-bold text-slate-800">{step.queueNumber || currentPatient.queueNumber}</span>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Queue Wait</span>
                      <span className="text-lg font-bold text-slate-800">{step.queueWait || "--"}</span>
                    </div>
                  </div>
                )}
                
                {step.status === "done" && step.completedAt && (
                   <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between text-xs font-semibold text-slate-400">
                     <span>Completed</span>
                     <span>{step.completedAt}</span>
                   </div>
                )}

                {step.notes && (
                  <div className="mt-3 bg-slate-50 rounded-xl p-3 text-xs text-slate-500 flex items-start gap-2">
                    <div className="w-1 h-4 bg-slate-300 rounded-full mt-0.5" />
                    {step.notes}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
