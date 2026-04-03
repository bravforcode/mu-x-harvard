"use client";

import { useState } from "react";
import { useFlow } from "@/lib/PatientFlowContext";
import { Check, Clock, UserCheck, Users, MapPin, ChevronDown, ArrowRight, LogIn } from "lucide-react";
import { cn } from "@/lib/utils";
import StatusBadge from "@/components/ui/StatusBadge";
import MetricCard from "@/components/ui/MetricCard";

export default function StaffDashboard() {
  const { state, checkIn, completeStep, getDepartments, getPatientsAtDepartment } = useFlow();
  const departments = getDepartments();
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  const [deptDropdown, setDeptDropdown] = useState(false);

  // Compute stats
  const totalWaiting = state.patients.reduce((sum, p) => sum + p.steps.filter(s => s.status === "waiting").length, 0);
  const totalInProgress = state.patients.reduce((sum, p) => sum + p.steps.filter(s => s.status === "in-progress").length, 0);
  const totalDone = state.patients.reduce((sum, p) => sum + p.steps.filter(s => s.status === "done").length, 0);

  // Group departments with counts
  const deptStats = departments.map((dept) => {
    const items = getPatientsAtDepartment(dept);
    const waiting = items.filter(i => i.step.status === "waiting").length;
    const inProgress = items.filter(i => i.step.status === "in-progress").length;
    return { dept, total: items.length, waiting, inProgress };
  }).filter(d => d.total > 0 || selectedDept === d.dept);

  const activeDeptItems = selectedDept ? getPatientsAtDepartment(selectedDept) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Patient check-in</h1>
        <p className="text-slate-400 text-sm">Check in patients as they arrive at each department</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <MetricCard value={state.patients.length} label="Total patients" icon={<Users className="w-5 h-5" />} />
        <MetricCard value={totalWaiting} label="Waiting for check-in" icon={<Clock className="w-5 h-5" />} accentColor="#f59e0b" />
        <MetricCard value={totalInProgress} label="In progress" icon={<UserCheck className="w-5 h-5" />} accentColor="#4f6bed" />
        <MetricCard value={totalDone} label="Completed steps" icon={<Check className="w-5 h-5" />} accentColor="#10b981" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Department Selector */}
        <div className="xl:col-span-4 flex flex-col gap-3">
          <h2 className="text-sm font-bold text-slate-800">Departments with activity</h2>
          <div className="bg-card border border-border rounded-2xl overflow-hidden divide-y divide-slate-50">
            {deptStats.map(({ dept, total, waiting, inProgress }) => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={cn(
                  "w-full px-5 py-4 flex items-center justify-between text-left transition cursor-pointer",
                  selectedDept === dept ? "bg-primary/5 border-l-4 border-l-primary" : "hover:bg-slate-50 border-l-4 border-l-transparent"
                )}
              >
                <div>
                  <h3 className={cn("text-sm font-bold", selectedDept === dept ? "text-primary" : "text-slate-700")}>{dept}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {waiting > 0 && <span className="text-amber-500 font-semibold">{waiting} waiting</span>}
                    {waiting > 0 && inProgress > 0 && " · "}
                    {inProgress > 0 && <span className="text-primary font-semibold">{inProgress} in progress</span>}
                    {waiting === 0 && inProgress === 0 && "No active patients"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {total > 0 && (
                    <span className="bg-slate-100 text-slate-600 text-xs font-bold w-7 h-7 rounded-full flex items-center justify-center">{total}</span>
                  )}
                  <ArrowRight className={cn("w-4 h-4 transition", selectedDept === dept ? "text-primary" : "text-slate-300")} />
                </div>
              </button>
            ))}
            {deptStats.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-sm">No active departments</div>
            )}
          </div>
        </div>

        {/* Patient Queue for Selected Department */}
        <div className="xl:col-span-8">
          {selectedDept ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-800">{selectedDept}</h2>
                  <p className="text-xs text-slate-400">{activeDeptItems.length} patient{activeDeptItems.length !== 1 ? "s" : ""} in queue</p>
                </div>
                <StatusBadge variant={activeDeptItems.some(i => i.step.status === "waiting") ? "warning" : "active"}>
                  {activeDeptItems.filter(i => i.step.status === "waiting").length} awaiting check-in
                </StatusBadge>
              </div>

              {activeDeptItems.length === 0 && (
                <div className="bg-card border border-border rounded-2xl p-12 text-center">
                  <Check className="w-10 h-10 text-success mx-auto mb-3" />
                  <p className="text-slate-500 font-semibold">All clear</p>
                  <p className="text-slate-400 text-sm mt-1">No patients waiting at this department</p>
                </div>
              )}

              <div className="space-y-3 stagger-children">
                {activeDeptItems.map(({ patient, step }) => (
                  <div
                    key={`${patient.id}-${step.id}`}
                    className={cn(
                      "bg-card border rounded-2xl p-5 transition-all",
                      step.status === "in-progress"
                        ? "border-primary/30 shadow-[0_0_20px_rgba(79,107,237,0.08)]"
                        : "border-border hover:border-slate-200 hover:shadow-md"
                    )}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold",
                          step.status === "in-progress" ? "bg-primary/10 text-primary" : "bg-amber-50 text-amber-600"
                        )}>
                          {patient.queueNumber.slice(-2)}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{patient.name}</h3>
                          <p className="text-xs text-slate-400">{patient.hn} · Age {patient.age}</p>
                        </div>
                      </div>
                      <StatusBadge
                        variant={step.status === "in-progress" ? "active" : "warning"}
                        pulse={step.status === "in-progress"}
                      >
                        {step.status === "in-progress" ? "In progress" : "Waiting"}
                      </StatusBadge>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <span className="text-sm font-extrabold text-slate-800 block">{step.queueNumber || patient.queueNumber}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Queue</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <span className="text-sm font-extrabold text-slate-800 block">{step.title}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Procedure</span>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 text-center">
                        <span className="text-sm font-bold text-slate-800 block">{step.checkedInAt || step.time}</span>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{step.checkedInAt ? "Checked in" : "Expected"}</span>
                      </div>
                    </div>

                    {step.notes && (
                      <p className="text-xs text-slate-400 mb-4">Note: {step.notes}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {step.status === "waiting" && (
                        <button
                          onClick={() => checkIn(patient.id, step.id)}
                          className="flex-1 bg-primary hover:bg-indigo-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition shadow-[0_4px_16px_rgba(79,107,237,0.3)] cursor-pointer"
                        >
                          <LogIn className="w-4 h-4" /> Check in patient
                        </button>
                      )}
                      {step.status === "in-progress" && (
                        <button
                          onClick={() => completeStep(patient.id, step.id)}
                          className="flex-1 bg-success hover:bg-emerald-600 text-white rounded-xl py-3 font-bold text-sm flex items-center justify-center gap-2 transition shadow-[0_4px_16px_rgba(16,185,129,0.3)] cursor-pointer"
                        >
                          <Check className="w-4 h-4" /> Mark as complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-card border border-border rounded-2xl p-16 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-4">
                <MapPin className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-700 mb-2">Select a department</h3>
              <p className="text-slate-400 text-sm max-w-xs">Choose a department from the left panel to view and manage the patient check-in queue.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
