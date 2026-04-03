"use client";

import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, MapPin, Clock, Activity } from "lucide-react";
import { cn } from "../lib/utils";

const tabs = [
  { href: "/patient", icon: Home, label: "Home" },
  { href: "/patient/navigate", icon: MapPin, label: "Navigate" },
  { href: "/patient/timeline", icon: Clock, label: "Timeline" },
];

export function PatientLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">WayPoint</span>
          </Link>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Patient</span>
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 py-5 pb-24">{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-t border-slate-100">
        <div className="max-w-md mx-auto flex">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  "flex-1 flex flex-col items-center gap-1 py-3 transition-colors",
                  isActive ? "text-primary" : "text-slate-400 hover:text-slate-600"
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

