"use client";

import { useRouter } from "next/navigation";
import { User, Stethoscope, Building2, ClipboardCheck, ArrowRight, Activity } from "lucide-react";

const roles = [
  {
    id: "patient",
    title: "Patient",
    subtitle: "Track your visit, queue & navigation",
    icon: User,
    href: "/patient",
    iconBg: "bg-blue-50 text-blue-600",
    description: "View your journey, check queue status, and get directions to your next destination.",
  },
  {
    id: "doctor",
    title: "Doctor",
    subtitle: "Monitor patients & test progress",
    icon: Stethoscope,
    href: "/doctor",
    iconBg: "bg-emerald-50 text-emerald-600",
    description: "Track patient tests, see return estimates, and manage your OPD workflow.",
  },
  {
    id: "staff",
    title: "Staff",
    subtitle: "Check-in patients & manage queues",
    icon: ClipboardCheck,
    href: "/staff",
    iconBg: "bg-amber-50 text-amber-600",
    description: "Check in arriving patients, update statuses, and manage department queues in real time.",
  },
  {
    id: "admin",
    title: "Administrator",
    subtitle: "Hospital operations & monitoring",
    icon: Building2,
    href: "/admin",
    iconBg: "bg-violet-50 text-violet-600",
    description: "Monitor real-time hospital flow, department queues, and operational alerts.",
  },
];

export default function RoleSelector() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="relative z-10 w-full max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200 rounded-full px-5 py-2.5 shadow-sm mb-8">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">WayPoint</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Hospital Coordination
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            Select your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => router.push(role.href)}
                className="group bg-white border border-slate-200/80 rounded-3xl p-7 text-left transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-300 hover:-translate-y-1 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${role.iconBg} flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
                >
                  <Icon className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-800 mb-1.5 tracking-tight">{role.title}</h2>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">{role.description}</p>
                <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-center text-slate-400 text-xs mt-12 animate-fade-in">WayPoint v1.0 · Siriraj Hospital Smart Navigation System</p>
      </div>
    </main>
  );
}

