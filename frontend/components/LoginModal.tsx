"use client";

import React, { useState } from "react";
import { X, Lock, Mail, UserCheck, Shield, KeyRound, Building, CheckCircle2, LogOut } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: { name: string; role: string; email: string; flat: string } | null;
  onLogin: (user: { name: string; role: string; email: string; flat: string }) => void;
  onLogout: () => void;
}

export default function LoginModal({ isOpen, onClose, currentUser, onLogin, onLogout }: LoginModalProps) {
  const [role, setRole] = useState<"Treasurer" | "President" | "Secretary" | "Resident" | "Admin">("Treasurer");
  const [name, setName] = useState("Vikram Patel");
  const [email, setEmail] = useState("treasurer@jaitra.org");
  const [flat, setFlat] = useState("Tower B - 501");
  const [password, setPassword] = useState("••••••••");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleRoleSelect = (selectedRole: "Treasurer" | "President" | "Secretary" | "Resident" | "Admin") => {
    setRole(selectedRole);
    if (selectedRole === "Treasurer") {
      setName("Vikram Patel");
      setEmail("treasurer@jaitra.org");
      setFlat("Tower B - 501");
    } else if (selectedRole === "President") {
      setName("Rajesh Sharma");
      setEmail("president@jaitra.org");
      setFlat("Tower A - 1204");
    } else if (selectedRole === "Secretary") {
      setName("Ananya Roy");
      setEmail("secretary@jaitra.org");
      setFlat("Tower C - 802");
    } else if (selectedRole === "Admin") {
      setName("System Administrator");
      setEmail("admin@jaitra.org");
      setFlat("Society Office");
    } else {
      setName("Resident User");
      setEmail("resident@jaitra.org");
      setFlat("Tower D - 402");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      onLogin({ name, role, email, flat });
      setIsSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-indigo-950/80 p-5 border-b border-slate-700/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {currentUser ? "User Profile & Session" : "Jaitra Portal Login"}
              </h3>
              <p className="text-xs text-slate-400">RWA Secure Management & Resident Access</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentUser ? (
            <div className="space-y-5">
              <div className="p-4 bg-indigo-950/50 border border-indigo-800/60 rounded-xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                  {currentUser.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-white text-base">{currentUser.name}</p>
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 rounded-full">
                      {currentUser.role}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">{currentUser.email}</p>
                  <p className="text-xs text-indigo-300/80 mt-0.5 flex items-center gap-1">
                    <Building className="w-3 h-3 inline" /> {currentUser.flat}
                  </p>
                </div>
              </div>

              <div className="bg-slate-800/60 border border-slate-700/60 p-4 rounded-xl space-y-2 text-xs text-slate-300">
                <p className="font-semibold text-white flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Authorized Permissions Active
                </p>
                <p className="text-slate-400">
                  You have access to Create, Edit, and Delete records in Festival collections, Expenses, Tasks, Issues, GBM Meetings, and Cultural agendas.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    onLogout();
                    onClose();
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-red-950/60 hover:bg-red-900 border border-red-700 text-red-300 rounded-xl font-bold text-xs transition"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl font-bold text-xs transition"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Quick Role Selection */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5">
                  Select Role / Quick Demo Profile
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(["Treasurer", "President", "Secretary", "Admin", "Resident"] as const).map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => handleRoleSelect(r)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition border ${
                        role === r
                          ? "bg-indigo-600 text-white border-indigo-400 shadow-md shadow-indigo-600/30"
                          : "bg-slate-800/80 text-slate-400 border-slate-700 hover:bg-slate-800 hover:text-slate-200"
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
                <div className="relative">
                  <UserCheck className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Email / Member ID</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="email@jaitra.org"
                  />
                </div>
              </div>

              {/* Flat / Tower */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Tower & Flat No</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={flat}
                    onChange={(e) => setFlat(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="Tower B - 501"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Access PIN / Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSuccess}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 mt-4"
              >
                {isSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-bounce" /> Authenticating...
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" /> Sign In to Portal
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
