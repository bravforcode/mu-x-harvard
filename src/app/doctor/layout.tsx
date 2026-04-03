"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, Stethoscope } from "lucide-react";
import { doctorInfo } from "@/lib/mockData";

export default function DoctorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/roles" className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <span className="text-sm font-bold text-slate-800 tracking-tight">WayPoint</span>
            </Link>
            <span className="text-slate-300">·</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctor</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-700">{doctorInfo.name}</p>
              <p className="text-xs text-slate-400">{doctorInfo.department} · {doctorInfo.session}</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Stethoscope className="w-4 h-4" />
            </div>
          </div>
        </div>
      </header>

      {/* Page Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-6">
        {children}
      </main>
    </div>
  );
}
