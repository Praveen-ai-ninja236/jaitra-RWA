"use client";

import React from "react";
import JaitraLogo from "./JaitraLogo";
import { Building2, WifiOff, PhoneCall, RefreshCw, Layers } from "lucide-react";

interface NavbarProps {
  isBackendConnected: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Navbar({ isBackendConnected, onRefresh, isLoading }: NavbarProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Society Title */}
        <div className="flex items-center gap-4 sm:gap-6">
          <JaitraLogo variant="dark" />
          <div className="hidden md:block h-8 w-px bg-slate-800" />
          <div className="hidden md:block">
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-slate-200 tracking-wide">
                JAITRA RESIDENTS WELFARE ASSOCIATION
              </span>
              <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800/80 px-2 py-0.5 rounded font-bold">
                Towers A, B, C, D, E, F
              </span>
            </div>
          </div>
        </div>

        {/* Right Info & Actions */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sync Button */}
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Sync latest live database records"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition shadow-xs disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : "text-slate-400"}`} />
            <span className="hidden sm:inline">Sync DB</span>
          </button>

          {/* Database Connection Status */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition ${
              isBackendConnected
                ? "bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-[0_0_12px_-3px_rgba(16,185,129,0.4)]"
                : "bg-amber-950/70 text-amber-300 border-amber-700/60"
            }`}
          >
            {isBackendConnected ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="hidden sm:inline">PostgreSQL / DB Active</span>
                <span className="sm:hidden">DB Connected</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                <span>Local DB Mode</span>
              </>
            )}
          </div>

          {/* Gate Security Hotline */}
          <div className="hidden lg:flex items-center gap-2 pl-3 border-l border-slate-800 text-xs">
            <div className="w-8 h-8 rounded-full bg-sky-950/80 border border-sky-800 flex items-center justify-center text-sky-400 shadow-xs">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Gate Security</p>
              <p className="text-xs font-extrabold text-slate-200 font-mono">040-2345-8800</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
