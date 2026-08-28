"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  Building,
  CreditCard,
  Receipt,
  AlertTriangle,
  Kanban,
  FileText,
  Sparkles,
  Users,
  Shield,
  Crown,
  Lock,
  RefreshCw,
  Layers,
} from "lucide-react";
import { DropdownOption, UserRole } from "../lib/types";
import * as api from "../lib/api";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userRole: UserRole;
  onOptionsUpdated?: () => void;
}

export default function SettingsModal({
  isOpen,
  onClose,
  userRole,
  onOptionsUpdated,
}: SettingsModalProps) {
  const isSuperAdmin = userRole === "Super Admin";
  const [activeCategory, setActiveCategory] = useState("towers");
  const [optionsList, setOptionsList] = useState<DropdownOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [newOptionValue, setNewOptionValue] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingValue, setEditingValue] = useState("");

  const categories = [
    { key: "towers", label: "Towers & Blocks", icon: Building },
    { key: "payment_modes", label: "Payment Modes", icon: CreditCard },
    { key: "expense_categories", label: "Expense Categories", icon: Receipt },
    { key: "issue_categories", label: "Issue Categories", icon: AlertTriangle },
    { key: "ado_categories", label: "ADO Task Categories", icon: Kanban },
    { key: "ado_entities", label: "ADO Assigned Entities", icon: Shield },
    { key: "meeting_types", label: "Meeting Types", icon: FileText },
    { key: "meeting_venues", label: "Meeting Venues", icon: Building },
    { key: "cultural_categories", label: "Cultural Event Types", icon: Sparkles },
    { key: "cultural_activities", label: "Cultural Activities", icon: Sparkles },
    { key: "team_roles", label: "Team Roles & Titles", icon: Users },
    { key: "sub_committees", label: "Sub-Committee Portfolios", icon: Layers },
  ];

  const fetchOptions = async () => {
    setIsLoading(true);
    try {
      const data = await api.getDropdownSettingsList();
      setOptionsList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOptions();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentCategoryOptions = optionsList.filter(
    (opt) => opt.category_key === activeCategory
  );

  const handleAddOption = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOptionValue.trim() || !isSuperAdmin) return;
    try {
      await api.addDropdownOption(activeCategory, newOptionValue.trim(), currentCategoryOptions.length + 1);
      setNewOptionValue("");
      fetchOptions();
      if (onOptionsUpdated) onOptionsUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (id: number) => {
    if (!editingValue.trim() || !isSuperAdmin) return;
    try {
      await api.updateDropdownOption(id, editingValue.trim());
      setEditingId(null);
      setEditingValue("");
      fetchOptions();
      if (onOptionsUpdated) onOptionsUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!isSuperAdmin) return;
    if (!confirm("Are you sure you want to delete this option from the master database?")) return;
    try {
      await api.deleteDropdownOption(id);
      fetchOptions();
      if (onOptionsUpdated) onOptionsUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 sm:p-5 border-b border-slate-700/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
              <Settings className="w-5 h-5 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-white">
                  System Settings &amp; Dropdown Configuration
                </h2>
                {isSuperAdmin ? (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-amber-950 text-amber-300 border border-amber-600 rounded-full flex items-center gap-1">
                    <Crown className="w-3 h-3 text-amber-400" /> Super Admin Access
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] font-extrabold bg-slate-800 text-slate-400 border border-slate-700 rounded-full flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" /> View Only
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                Configure dropdown categories, transaction modes, towers, and event classifications in Neon DB
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Permission Notification if not Super Admin */}
        {!isSuperAdmin && (
          <div className="px-5 py-2.5 bg-amber-950/40 border-b border-amber-800/50 flex items-center gap-2 text-xs text-amber-200 shrink-0">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              You are logged in as <strong>{userRole}</strong>. Only <strong>Super Admin</strong> can add, edit, or delete master dropdown configurations in the database.
            </span>
          </div>
        )}

        {/* Main Body with Left Category Sidebar and Right Options Manager */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left Category Sidebar */}
          <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-3 overflow-y-auto shrink-0 space-y-1">
            <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-2 py-1 mb-1">
              Dropdown Categories
            </p>
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isSelected = activeCategory === cat.key;
              const count = optionsList.filter((o) => o.category_key === cat.key).length;

              return (
                <button
                  key={cat.key}
                  onClick={() => {
                    setActiveCategory(cat.key);
                    setEditingId(null);
                  }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition ${
                    isSelected
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30"
                      : "text-slate-300 hover:bg-slate-800/80 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span className="truncate">{cat.label}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${
                      isSelected ? "bg-indigo-900/80 text-indigo-200" : "bg-slate-800 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Content: Options List & Add New Form */}
          <div className="flex-1 flex flex-col overflow-hidden p-4 sm:p-6 bg-slate-900/50">
            {/* Top Bar for Selected Category */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 shrink-0">
              <div>
                <h3 className="text-sm font-extrabold text-white">
                  {categories.find((c) => c.key === activeCategory)?.label}
                </h3>
                <p className="text-xs text-slate-400">
                  {currentCategoryOptions.length} active values configured in database
                </p>
              </div>

              <button
                onClick={fetchOptions}
                disabled={isLoading}
                title="Refresh options from DB"
                className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-sky-400" : ""}`} />
              </button>
            </div>

            {/* Add New Option Form (Super Admin Only) */}
            {isSuperAdmin && (
              <form onSubmit={handleAddOption} className="mb-4 flex gap-2 shrink-0">
                <input
                  type="text"
                  value={newOptionValue}
                  onChange={(e) => setNewOptionValue(e.target.value)}
                  placeholder={`+ Add new option to ${categories.find((c) => c.key === activeCategory)?.label}...`}
                  className="flex-1 px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="submit"
                  disabled={!newOptionValue.trim()}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Option</span>
                </button>
              </form>
            )}

            {/* Options List */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {currentCategoryOptions.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs italic bg-slate-950/40 rounded-xl border border-slate-800">
                  No options configured yet for this category.
                </div>
              ) : (
                currentCategoryOptions.map((opt) => {
                  const isEditing = editingId === opt.id;

                  return (
                    <div
                      key={opt.id}
                      className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between gap-3 text-xs hover:border-slate-600 transition"
                    >
                      {isEditing ? (
                        <div className="flex-1 flex items-center gap-2">
                          <input
                            type="text"
                            autoFocus
                            value={editingValue}
                            onChange={(e) => setEditingValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleSaveEdit(opt.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-indigo-500 rounded-lg text-xs text-white focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(opt.id)}
                            className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition"
                            title="Cancel"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0" />
                            <span className="font-bold text-white truncate">{opt.option_value}</span>
                          </div>

                          {isSuperAdmin && (
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingId(opt.id);
                                  setEditingValue(opt.option_value);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-300 bg-slate-900/60 hover:bg-slate-900 rounded-lg border border-slate-700 transition"
                                title="Edit Value"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDelete(opt.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-400 bg-slate-900/60 hover:bg-slate-900 rounded-lg border border-slate-700 transition"
                                title="Delete Option"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <p>
            Changes take effect across all application forms and dropdowns in real-time.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl border border-slate-700 transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
