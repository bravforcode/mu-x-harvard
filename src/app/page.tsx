"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Activity, ArrowRight, ClipboardCheck, MapPin } from "lucide-react";

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
            Patient check-in first
          </h1>
          <p className="text-slate-500 text-lg max-w-md mx-auto leading-relaxed">
            When you arrive, go to <span className="font-semibold text-slate-800">Registration Desk</span> first. After check-in, we will guide you to the doctor.
          </p>
        </div>

        <div className="mx-auto max-w-lg flex flex-col gap-4">
          <button
            onClick={() => router.push("/patient")}
            className="bg-primary hover:bg-primary/90 text-white rounded-3xl py-4 px-6 font-bold text-base flex items-center justify-center gap-2 transition-colors shadow-[0_10px_30px_rgba(0,113,227,0.18)]"
          >
            <ClipboardCheck className="w-5 h-5" /> Start patient journey <ArrowRight className="w-4 h-4" />
          </button>

          <div className="bg-white border border-slate-200/80 rounded-3xl p-5 text-left">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-800 mb-1">Your first stop</h2>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Registration Desk (Ground Floor). Have your HN/ticket ready, then confirm check-in to unlock the doctor step.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/roles"
              className="text-sm text-slate-500 hover:text-slate-700 font-semibold transition-colors"
            >
              I’m staff / doctor / admin
            </Link>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-10 animate-fade-in">
          WayPoint v1.0 · Siriraj Hospital Smart Navigation System
        </p>
      </div>
    </main>
  );
}
