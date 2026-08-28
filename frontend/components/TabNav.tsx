"use client";

import React from "react";
import {
  Calendar,
  Sparkles,
  FileText,
  AlertTriangle,
  Kanban,
  Users,
  Briefcase,
  History,
} from "lucide-react";
import { AppUser } from "../lib/types";

export interface TabItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeColor?: string;
  activeBorderColor: string;
  activeGlow: string;
  authRequired?: boolean;
}

interface TabNavProps {
  activeTab: string;
  onTabChange: (id: string) => void;
  badgeCounts: {
    events?: number;
    festivals?: number;
    meetings?: number;
    issues?: number;
    adoTasks?: number;
    team?: number;
    vendors?: number;
  };
  currentUser?: AppUser | null;
}

export default function TabNav({ activeTab, onTabChange, badgeCounts, currentUser }: TabNavProps) {
  const isAuthenticated = Boolean(currentUser);

  const allTabs: TabItem[] = [
    {
      id: "culture-events",
      label: "1. Cultural Events",
      shortLabel: "Culture Events",
      icon: Calendar,
      badge: badgeCounts.events,
      badgeColor: "bg-indigo-900/80 text-indigo-200 border border-indigo-700",
      activeBorderColor: "from-indigo-600 to-indigo-400",
      activeGlow: "shadow-indigo-500/20",
    },
    {
      id: "festivals",
      label: "2. Festival Celebrations",
      shortLabel: "Festivals",
      icon: Sparkles,
      badge: badgeCounts.festivals,
      badgeColor: "bg-amber-900/80 text-amber-200 border border-amber-700",
      activeBorderColor: "from-amber-600 to-amber-400",
      activeGlow: "shadow-amber-500/20",
    },
    {
      id: "gbm",
      label: "3. General Body Meetings (GBM)",
      shortLabel: "GBM Meetings",
      icon: FileText,
      badge: badgeCounts.meetings,
      badgeColor: "bg-sky-900/80 text-sky-200 border border-sky-700",
      activeBorderColor: "from-sky-600 to-sky-400",
      activeGlow: "shadow-sky-500/20",
    },
    {
      id: "issues",
      label: "4. Community Issues",
      shortLabel: "Issues",
      icon: AlertTriangle,
      badge: badgeCounts.issues,
      badgeColor: "bg-rose-900/80 text-rose-200 border border-rose-700",
      activeBorderColor: "from-rose-600 to-rose-400",
      activeGlow: "shadow-rose-500/20",
      authRequired: true,
    },
    {
      id: "ado-board",
      label: "5. Pendings with Builder & IGS",
      shortLabel: "ADO Board",
      icon: Kanban,
      badge: badgeCounts.adoTasks,
      badgeColor: "bg-orange-900/80 text-orange-200 border border-orange-700",
      activeBorderColor: "from-orange-600 to-amber-400",
      activeGlow: "shadow-orange-500/20",
      authRequired: true,
    },
    {
      id: "team",
      label: "6. Jaitra Team List",
      shortLabel: "Team Directory",
      icon: Users,
      badge: badgeCounts.team,
      badgeColor: "bg-emerald-900/80 text-emerald-200 border border-emerald-700",
      activeBorderColor: "from-emerald-600 to-emerald-400",
      activeGlow: "shadow-emerald-500/20",
      authRequired: true,
    },
    {
      id: "vendor-management",
      label: "7. Vendor & AMC Contracts",
      shortLabel: "Vendors & AMCs",
      icon: Briefcase,
      badge: badgeCounts.vendors,
      badgeColor: "bg-teal-900/80 text-teal-200 border border-teal-700",
      activeBorderColor: "from-teal-600 to-teal-400",
      activeGlow: "shadow-teal-500/20",
      authRequired: true,
    },
    {
      id: "change-history",
      label: "8. Change History",
      shortLabel: "History",
      icon: History,
      badgeColor: "bg-violet-900/80 text-violet-200 border border-violet-700",
      activeBorderColor: "from-violet-600 to-violet-400",
      activeGlow: "shadow-violet-500/20",
      authRequired: true,
    },
  ];

  const tabs = isAuthenticated ? allTabs : allTabs.filter((t) => !t.authRequired);

  return (
    <div className="bg-slate-900/95 border-b border-slate-800 sticky top-16 z-30 shadow-md backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <nav className="flex space-x-1.5 sm:space-x-2 overflow-x-auto py-2.5 scrollbar-none" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? "bg-slate-800 text-white shadow-lg border border-slate-700 shadow-slate-950/40"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                }`}
              >
                {/* Active Underline Glow */}
                {isActive && (
                  <span
                    className={`absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r ${tab.activeBorderColor} rounded-full shadow-[0_0_8px_rgba(56,189,248,0.6)]`}
                  />
                )}

                <Icon
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform group-hover:scale-110 ${
                    isActive ? "text-sky-400" : "text-slate-500"
                  }`}
                />
                <span className="hidden sm:inline tracking-tight">{tab.label}</span>
                <span className="sm:hidden tracking-tight">{tab.shortLabel}</span>

                {tab.badge !== undefined && (typeof tab.badge === "number" ? tab.badge > 0 : Boolean(tab.badge)) && (
                  <span
                    className={`ml-0.5 sm:ml-1 px-1.5 py-0.2 text-[10px] font-mono font-extrabold rounded-full leading-none transition ${
                      isActive
                        ? "bg-sky-500/20 text-sky-300 border border-sky-400/40"
                        : tab.badgeColor || "bg-slate-800 text-slate-300 border border-slate-700"
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
