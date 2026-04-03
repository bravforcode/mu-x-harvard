"use client";

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, MapPin, ArrowRight, User, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "../lib/utils";
import { useFlow } from "../lib/PatientFlowContext";
import StatusBadge from "../components/ui/StatusBadge";

export function PatientHome() {
  const { getPatient, completeStep } = useFlow();
  const [showDetails, setShowDetails] = useState(false);

  const currentPatient = getPatient("p-001");
  if (!currentPatient) return <div className="p-8 text-center text-slate-500">Patient not found</div>;

  const patientSteps = currentPatient.steps;
  const activeStep = patientSteps.find((s) => s.status === "in-progress" || s.status === "waiting");
  const completedCount = patientSteps.filter((s) => s.status === "done").length;
  const totalSteps = patientSteps.length;
  const isRegistrationStep =
    !!activeStep &&
    (activeStep.department === "Registration" || activeStep.title.toLowerCase().includes("check-in"));

  return (
    <div className="flex flex-col gap-5 animate-fade-in">
      <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
        <div className="w-11 h-11 rounded-full bg-accent text-primary flex items-center justify-center shrink-0">
          <User className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg font-bold text-slate-800 tracking-tight truncate">{currentPatient.name}</h1>
          <p className="text-slate-400 text-xs font-medium">
            {currentPatient.hn} &middot; Today
          </p>
        </div>
        <StatusBadge variant="active" pulse>
          Active
        </StatusBadge>
      </div>

      <div className="bg-primary rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Est. completion</p>
          <div className="text-3xl font-extrabold tracking-tighter mb-4">{currentPatient.estimatedDoneBy}</div>
          <div className="flex items-center justify-between bg-white/20 rounded-xl p-3">
            <span className="text-sm font-medium">{totalSteps - completedCount} steps left</span>
            <span className="text-2xl font-bold font-mono">
              {completedCount}
              <span className="text-white/50 text-lg">/{totalSteps}</span>
            </span>
          </div>
        </div>
      </div>

      {activeStep && (
        <div className="bg-card border border-border rounded-2xl p-5 relative shadow-sm">
          <div className="flex items-start justify-between mb-4 pt-1">
            <div>
              <p className="text-xs text-primary font-bold uppercase tracking-wider mb-0.5">
                {isRegistrationStep ? "Required first step" : activeStep.status === "in-progress" ? "In Progress" : "Next Stop"}
              </p>
              <h2 className="text-lg font-bold text-slate-800">{isRegistrationStep ? "Check-in at Registration" : activeStep.title}</h2>
              <p className="text-slate-500 text-sm">
                {activeStep.location} &middot; {activeStep.floor}
              </p>
            </div>
            {activeStep.queueNumber && (
              <StatusBadge variant="active" pulse>
                {activeStep.queueNumber}
              </StatusBadge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-slate-800 block">{activeStep.queueWait || "--"}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Wait</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <span className="text-lg font-extrabold text-slate-800 block">{activeStep.walkTime || "--"}</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Walk</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              to="/patient/navigate"
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors"
            >
              <MapPin className="w-4 h-4" /> {isRegistrationStep ? "Navigate to registration" : "Get directions"}{" "}
              <ArrowRight className="w-4 h-4" />
            </Link>

            {isRegistrationStep && (
              <button
                onClick={() => completeStep(currentPatient.id, activeStep.id)}
                className="w-full bg-success hover:bg-emerald-600 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-[0_4px_16px_rgba(16,185,129,0.2)] cursor-pointer"
              >
                <Check className="w-4 h-4" /> I completed check-in
              </button>
            )}
          </div>
        </div>
      )}

      <div className="bg-card border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Your route</h2>
          <Link to="/patient/timeline" className="text-xs text-primary font-semibold hover:underline">
            View details
          </Link>
        </div>

        <div className="relative pl-6 border-l-2 border-slate-100 space-y-5">
          {patientSteps.map((step) => {
            const isActive = step.status === "in-progress" || step.status === "waiting";
            return (
              <div key={step.id} className="relative">
                <div
                  className={cn(
                    "absolute -left-[29px] top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-3 ring-white",
                    step.status === "done" && "bg-success",
                    isActive && "bg-primary",
                    step.status === "upcoming" && "bg-white border-2 border-border"
                  )}
                >
                  {step.status === "done" && <Check className="w-2.5 h-2.5 text-white" />}
                  {isActive && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                  {step.status === "upcoming" && <div className="w-1 h-1 bg-slate-300 rounded-full" />}
                </div>
                <div className={cn(isActive && "bg-accent -mt-1 -ml-1 p-3 rounded-xl border border-primary/20", !isActive && "py-1")}>
                  <h3
                    className={cn(
                      "font-bold text-sm",
                      step.status === "done" && "text-slate-500",
                      isActive && "text-primary",
                      step.status === "upcoming" && "text-slate-400"
                    )}
                  >
                    {step.title}
                  </h3>
                  <p className={cn("text-xs mt-0.5", isActive ? "text-primary/60 font-medium" : "text-slate-400")}>
                    {step.location} &middot; {step.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {!isRegistrationStep && (
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="bg-card border border-border rounded-2xl p-5 text-left transition-all hover:border-slate-300 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Visit details</h2>
            {showDetails ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </div>
          {showDetails && (
            <div className="mt-4 space-y-2 text-sm animate-fade-in">
              <div className="flex justify-between">
                <span className="text-slate-500">Doctor</span>
                <span className="text-slate-800 font-semibold">{currentPatient.doctor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Department</span>
                <span className="text-slate-800 font-semibold">{currentPatient.doctorDepartment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visit type</span>
                <span className="text-slate-800 font-semibold">{currentPatient.diagnosis}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Visit ID</span>
                <span className="text-slate-800 font-mono text-xs">{currentPatient.visitId}</span>
              </div>
            </div>
          )}
        </button>
      )}
    </div>
  );
}

