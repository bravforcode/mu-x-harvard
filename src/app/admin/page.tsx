"use client";

import Link from "next/link";
import { Users, Clock, AlertTriangle, Activity, TrendingUp, ChevronRight, Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import { adminMetrics as initialMetrics, departments as initialDepartments, adminAlerts } from "@/lib/mockData";
import { useFlow } from "@/lib/PatientFlowContext";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";
import MiniChart from "@/components/ui/MiniChart";
import HospitalMap3D from "@/components/HospitalMap3D";

export default function AdminDashboard() {
  const { state, getPatientsAtDepartment } = useFlow();

  // Enhance departments with live data
  const departments = initialDepartments.map(dept => {
    const active = getPatientsAtDepartment(dept.name);
    const waiting = active.filter(a => a.step.status === "waiting").length;
    const inProgress = active.filter(a => a.step.status === "in-progress").length;
    
    // Simple mock logic for status based on live queue
    const liveQueue = dept.currentQueue + waiting;
    const status = liveQueue > 20 ? "critical" : liveQueue > 10 ? "busy" : "normal";

    return {
      ...dept,
      currentQueue: liveQueue,
      activePatients: dept.activePatients + inProgress,
      status: status as "normal" | "busy" | "critical"
    };
  });

  // Calculate live total metrics
  const liveTotalInQueue = departments.reduce((acc, d) => acc + d.currentQueue, 0);
  const liveActivePatients = departments.reduce((acc, d) => acc + d.activePatients + (d.status === "busy" ? 1 : 0), 0);
  const busiestDept = departments.reduce((max, d) => d.currentQueue > max.currentQueue ? d : max, departments[0]);

  const adminMetrics = {
    ...initialMetrics,
    activePatients: liveActivePatients,
    totalInQueue: liveTotalInQueue,
    busiestDept: busiestDept.name
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Operations overview</h1>
          <p className="text-slate-400 text-sm">Real-time hospital monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2.5 bg-white border border-border rounded-xl hover:bg-slate-50 transition cursor-pointer">
            <Bell className="w-5 h-5 text-slate-500" />
            {adminAlerts.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-critical text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {adminAlerts.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 stagger-children">
        <MetricCard value={adminMetrics.activePatients} label="Active patients" icon={<Users className="w-5 h-5" />} />
        <MetricCard value={adminMetrics.totalInQueue} label="In queues" icon={<Clock className="w-5 h-5" />} />
        <MetricCard value={`${adminMetrics.avgWaitMin}m`} label="Avg wait" icon={<Activity className="w-5 h-5" />} />
        <MetricCard value={adminMetrics.activeAlerts} label="Active alerts" icon={<AlertTriangle className="w-5 h-5" />} accentColor="#f59e0b" />
        <MetricCard value={adminMetrics.busiestDept} label="Busiest dept" icon={<TrendingUp className="w-5 h-5" />} accentColor="#4f6bed" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Hospital Map */}
        <div className="xl:col-span-2 bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Hospital digital twin</h2>
          </div>
          <div className="h-80 lg:h-[420px] bg-slate-50">
            <HospitalMap3D mode="admin" currentStep={0} />
          </div>
        </div>

        {/* Alerts Panel */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-800">Live alerts</h2>
            <StatusBadge variant="critical">{adminAlerts.length} active</StatusBadge>
          </div>
          <div className="flex-1 divide-y divide-slate-50 overflow-auto">
            {adminAlerts.map((alert) => (
              <div key={alert.id} className="p-4 hover:bg-slate-50/50 transition">
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                    alert.type === "critical" ? "bg-critical/10 text-critical" : "bg-warning/10 text-warning"
                  )}>
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-slate-800 mb-0.5">{alert.title}</h3>
                    <p className="text-xs text-slate-500 leading-relaxed">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-400 font-medium">{alert.time}</span>
                      <span className="text-[10px] text-slate-400">·</span>
                      <span className="text-[10px] text-slate-400 font-medium">{alert.department}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-800">Department overview</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-children">
          {departments.map((dept) => (
            <Link
              key={dept.id}
              href={`/admin/department/${dept.id}`}
              className="group bg-card border border-border rounded-2xl p-5 transition-all hover:shadow-md hover:border-slate-200 hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-base font-bold text-slate-800">{dept.name}</h3>
                  <p className="text-xs text-slate-400">{dept.floor} · {dept.zone}</p>
                </div>
                <StatusBadge
                  variant={dept.status === "normal" ? "done" : dept.status === "busy" ? "warning" : "critical"}
                  pulse={dept.status === "critical"}
                >
                  {dept.status === "normal" ? "Normal" : dept.status === "busy" ? "Busy" : "Critical"}
                </StatusBadge>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-4">
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">{dept.currentQueue}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Queue</span>
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">{dept.avgWaitMin}m</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Wait</span>
                </div>
                <div>
                  <span className="text-lg font-extrabold text-slate-800 block">{dept.activePatients}</span>
                  <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Active</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <MiniChart
                  data={dept.trend}
                  color={dept.status === "normal" ? "#10b981" : dept.status === "busy" ? "#f59e0b" : "#ef4444"}
                  width={80}
                  height={28}
                />
                <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-primary transition" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
