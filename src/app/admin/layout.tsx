"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, LayoutDashboard, Building2, AlertTriangle, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const sidebarItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/departments", icon: Building2, label: "Departments" },
  { href: "/admin/alerts", icon: AlertTriangle, label: "Alerts" },
  { href: "/admin/analytics", icon: BarChart3, label: "Analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col shrink-0 sticky top-0 h-screen">
        <div className="p-5 border-b border-slate-100">
          <Link href="/roles" className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-slate-800 tracking-tight">WayPoint</span>
          </Link>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest mt-1">Operations</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-violet-50 text-violet-600 flex items-center justify-center text-xs font-bold">A</div>
            <div>
              <p className="text-xs font-semibold text-slate-700">Admin User</p>
              <p className="text-[10px] text-slate-400">Hospital Ops</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
