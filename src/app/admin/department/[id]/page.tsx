"use client";

import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Users, Clock, TrendingUp, Activity, Lightbulb, Building2 } from "lucide-react";
import { departments as initialDepartments } from "@/lib/mockData";
import { useFlow } from "@/lib/PatientFlowContext";
import MetricCard from "@/components/ui/MetricCard";
import StatusBadge from "@/components/ui/StatusBadge";

export default function AdminDepartmentDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { state, getPatientsAtDepartment } = useFlow();
  
  const initialDept = initialDepartments.find((d) => d.id === id) || initialDepartments[0];
  
  // Real-time calculation
  const activeItems = getPatientsAtDepartment(initialDept.name);
  const waiting = activeItems.filter(a => a.step.status === "waiting").length;
  const inProgress = activeItems.filter(a => a.step.status === "in-progress").length;
  
  const liveQueue = initialDept.currentQueue + waiting;
  const liveActive = initialDept.activePatients + inProgress;
  const status = liveQueue > 20 ? "critical" : liveQueue > 10 ? "busy" : "normal";

  const dept = {
    ...initialDept,
    currentQueue: liveQueue,
    activePatients: liveActive,
    status: status as "normal" | "busy" | "critical",
  };

  const nearbyDepts = initialDepartments.filter((d) => d.zone === dept.zone && d.id !== dept.id);

  // Recommendations
  const recommendations = [
    dept.status === "busy" && `Consider redirecting new patients to nearby departments with shorter wait times.`,
    dept.avgWaitMin > 10 && `Average wait time is above the 10-minute target. Review staffing levels.`,
    dept.currentQueue > 15 && `Queue is above capacity threshold. Consider opening additional service windows.`,
  ].filter(Boolean);

  // Patient List (mixed live & mock for visual richness)
  const currentPatients = activeItems.map(({ patient, step }) => ({
    name: patient.name,
    hn: patient.hn,
    wait: step.queueWait || "0m",
    status: step.status === "in-progress" ? "In progress" : "Waiting"
  }));

  const mockPatients = [
    { name: "Siriporn K.", hn: "HN 20241091", wait: "14m", status: "Waiting" },
    { name: "Anong P.", hn: "HN 20241092", wait: "3m", status: "In progress" },
    { name: "Prasit W.", hn: "HN 20241093", wait: "18m", status: "Waiting" },
  ];

  const displayPatients = [...currentPatients, ...mockPatients].slice(0, Math.max(5, dept.activePatients));
  const statusColor = dept.status === "normal" ? "#10b981" : dept.status === "busy" ? "#f59e0b" : "#ef4444";

  return (
    <div className="flex flex-col gap-6 max-w-5xl animate-fade-in">
      {/* Back */}
      <Link href="/admin" className="flex items-center gap-2 text-sm text-slate-500 hover:text-primary transition font-semibold w-fit">
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </Link>

      {/* Header */}
      <div className="bg-card border border-border rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-accent text-primary flex items-center justify-center shrink-0">
          <Building2 className="w-7 h-7" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">{dept.name}</h1>
          <p className="text-slate-400 text-sm">{dept.floor} · {dept.zone}</p>
        </div>
        <StatusBadge
          variant={dept.status === "normal" ? "done" : dept.status === "busy" ? "warning" : "critical"}
          pulse={dept.status === "critical"}
        >
          {dept.status === "normal" ? "Normal" : dept.status === "busy" ? "Busy" : "Critical"}
        </StatusBadge>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <MetricCard value={dept.currentQueue} label="Current queue" icon={<Users className="w-5 h-5" />} />
        <MetricCard value={`${dept.avgWaitMin}m`} label="Avg wait" icon={<Clock className="w-5 h-5" />} accentColor={statusColor} />
        <MetricCard value={dept.activePatients} label="Active patients" icon={<Activity className="w-5 h-5" />} />
        <MetricCard value={`${dept.throughputPerHour}/hr`} label="Throughput" icon={<TrendingUp className="w-5 h-5" />} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-5">Queue trend (last 6 intervals)</h2>
          <div className="flex items-end justify-center gap-3 h-32">
            {dept.trend.map((val, i) => {
              const max = Math.max(...dept.trend);
              const heightPct = (val / max) * 100;
              const isLast = i === dept.trend.length - 1;
              return (
                <div key={i} className="flex flex-col items-center gap-2 flex-1">
                  <span className="text-xs font-bold text-slate-600">{val}</span>
                  <div
                    className="w-full rounded-lg transition-all"
                    style={{
                      height: `${heightPct}%`,
                      minHeight: 8,
                      backgroundColor: isLast ? statusColor : statusColor + "30",
                    }}
                  />
                  <span className="text-[9px] text-slate-400 font-medium">-{(dept.trend.length - 1 - i) * 10}m</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Patient List */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold">Current patients</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {displayPatients.map((p, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-700">{p.name}</p>
                  <p className="text-xs text-slate-400 font-mono">{p.hn}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-700">{p.wait}</span>
                  <StatusBadge variant={p.status === "In progress" ? "active" : "pending"}>
                    {p.status}
                  </StatusBadge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div className="bg-accent border border-primary/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-4 h-4 text-primary" />
            <h2 className="text-xs uppercase tracking-widest text-primary font-bold">Recommendations</h2>
          </div>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <p key={i} className="text-sm text-slate-600 leading-relaxed flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                {rec}
              </p>
            ))}
          </div>
        </div>
      )}

      {/* Nearby Departments */}
      {nearbyDepts.length > 0 && (
        <div>
          <h2 className="text-xs uppercase tracking-widest text-slate-400 font-bold mb-4">Nearby departments ({dept.zone})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {nearbyDepts.map((nd) => (
              <Link
                key={nd.id}
                href={`/admin/department/${nd.id}`}
                className="bg-card border border-border rounded-2xl p-5 flex items-center justify-between hover:shadow-md hover:border-slate-200 transition"
              >
                <div>
                  <h3 className="text-sm font-bold text-slate-800">{nd.name}</h3>
                  <p className="text-xs text-slate-400">{nd.floor} · Queue: {nd.currentQueue} · {nd.avgWaitMin}m wait</p>
                </div>
                <StatusBadge variant={nd.status === "normal" ? "done" : nd.status === "busy" ? "warning" : "critical"}>
                  {nd.status}
                </StatusBadge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
