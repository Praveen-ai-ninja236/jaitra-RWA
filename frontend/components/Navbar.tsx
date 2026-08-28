"use client";

import React, { useState } from "react";
import JaitraLogo from "./JaitraLogo";
import LoginModal from "./LoginModal";
import {
  WifiOff,
  RefreshCw,
  User,
  Shield,
  MessageCircle,
  Share2,
} from "lucide-react";

interface NavbarProps {
  isBackendConnected: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export default function Navbar({ isBackendConnected, onRefresh, isLoading }: NavbarProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    name: string;
    role: string;
    email: string;
    flat: string;
  } | null>({
    name: "Vikram Patel",
    role: "Treasurer",
    email: "treasurer@jaitra.org",
    flat: "Tower B - 501",
  });

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Logo & Society Title (Towers badge removed as requested) */}
          <div className="flex items-center gap-3 sm:gap-4">
            <JaitraLogo variant="dark" />
            <div className="hidden md:block h-7 w-px bg-slate-800" />
            <div className="hidden md:block">
              <span className="text-xs sm:text-sm font-extrabold text-slate-100 tracking-wide">
                JAITRA RESIDENTS WELFARE ASSOCIATION
              </span>
            </div>
          </div>

          {/* Center / Right: Social Media Icons + DB Status + Sync + Login */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Social Media Links */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-slate-800/80 rounded-xl border border-slate-700/70">
              <span className="text-[10px] font-bold text-slate-400 mr-1 flex items-center gap-1">
                <Share2 className="w-3 h-3 text-slate-400" /> Connect:
              </span>
              {/* WhatsApp */}
              <a
                href="https://chat.whatsapp.com/jaitra-residents"
                target="_blank"
                rel="noreferrer"
                title="Join Jaitra WhatsApp Community"
                className="w-7 h-7 rounded-lg bg-emerald-950/80 hover:bg-emerald-800 text-emerald-400 hover:text-white border border-emerald-700/60 flex items-center justify-center transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              {/* Facebook */}
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                title="Jaitra Facebook Group"
                className="w-7 h-7 rounded-lg bg-blue-950/80 hover:bg-blue-800 text-blue-400 hover:text-white border border-blue-700/60 flex items-center justify-center transition font-bold text-xs"
              >
                f
              </a>
              {/* X / Twitter */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                title="Jaitra X / Twitter Updates"
                className="w-7 h-7 rounded-lg bg-slate-900 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 flex items-center justify-center transition font-bold text-xs"
              >
                𝕏
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                title="Jaitra Instagram"
                className="w-7 h-7 rounded-lg bg-pink-950/80 hover:bg-pink-800 text-pink-400 hover:text-white border border-pink-700/60 flex items-center justify-center transition font-bold text-xs"
              >
                📷
              </a>
              {/* YouTube */}
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                title="Jaitra YouTube Channel"
                className="w-7 h-7 rounded-lg bg-red-950/80 hover:bg-red-800 text-red-400 hover:text-white border border-red-700/60 flex items-center justify-center transition font-bold text-xs"
              >
                ▶
              </a>
            </div>

            {/* Sync DB Button */}
            <button
              onClick={onRefresh}
              disabled={isLoading}
              title="Sync latest live database records"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-slate-300 bg-slate-800/90 hover:bg-slate-700 hover:text-white border border-slate-700 rounded-xl transition shadow-xs disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : "text-slate-400"}`} />
              <span className="hidden sm:inline">Sync DB</span>
            </button>

            {/* Database Connection Status */}
            <div
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-xs font-bold border transition ${
                isBackendConnected
                  ? "bg-emerald-950/70 text-emerald-300 border-emerald-700/60 shadow-[0_0_12px_-3px_rgba(16,185,129,0.4)]"
                  : "bg-amber-950/70 text-amber-300 border-amber-700/60"
              }`}
            >
              {isBackendConnected ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="hidden md:inline">Neon DB Active</span>
                  <span className="md:hidden">DB Live</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span>DB Offline</span>
                </>
              )}
            </div>

            {/* Login / User Profile Button */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white rounded-xl font-bold text-xs border border-indigo-500/50 shadow-md shadow-indigo-600/20 transition"
            >
              {currentUser ? (
                <>
                  <div className="w-5 h-5 rounded-full bg-indigo-900 border border-indigo-400 flex items-center justify-center text-[10px] text-indigo-200 font-extrabold">
                    {currentUser.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{currentUser.name}</span>
                  <span className="hidden lg:inline text-[10px] bg-indigo-950/80 px-1.5 py-0.5 rounded text-indigo-200 border border-indigo-800">
                    {currentUser.role}
                  </span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>Login</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Login / Profile Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => setCurrentUser(null)}
      />
    </>
  );
}
