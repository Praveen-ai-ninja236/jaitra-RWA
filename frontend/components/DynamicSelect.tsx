"use client";

import React, { useState } from "react";
import { Plus, Check, X } from "lucide-react";

interface DynamicSelectProps {
  label?: string;
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export default function DynamicSelect({
  label,
  value,
  onChange,
  options,
  placeholder = "Select an option",
  required = false,
  className = "",
}: DynamicSelectProps) {
  const [customList, setCustomList] = useState<string[]>(options);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newOption, setNewOption] = useState("");

  const handleAddNew = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (newOption.trim()) {
      const trimmed = newOption.trim();
      if (!customList.includes(trimmed)) {
        setCustomList((prev) => [...prev, trimmed]);
      }
      onChange(trimmed);
      setNewOption("");
      setIsAddingNew(false);
    }
  };

  return (
    <div className={`space-y-1 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="block text-xs font-semibold text-slate-300">
            {label} {required && <span className="text-red-400">*</span>}
          </label>
          {!isAddingNew && (
            <button
              type="button"
              onClick={() => setIsAddingNew(true)}
              className="text-[11px] text-sky-400 hover:text-sky-300 flex items-center gap-0.5 font-medium transition"
            >
              <Plus className="w-3 h-3" /> Add New
            </button>
          )}
        </div>
      )}

      {isAddingNew ? (
        <div className="flex items-center gap-1.5 animate-fadeIn">
          <input
            type="text"
            autoFocus
            value={newOption}
            onChange={(e) => setNewOption(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddNew(e);
              if (e.key === "Escape") setIsAddingNew(false);
            }}
            placeholder="Type new option..."
            className="flex-1 px-3 py-2 bg-slate-800 border border-sky-500 rounded-xl text-xs text-slate-200 focus:outline-none"
          />
          <button
            type="button"
            onClick={handleAddNew}
            className="p-2 bg-sky-600 hover:bg-sky-500 text-white rounded-xl transition"
            title="Save option"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => {
              setIsAddingNew(false);
              setNewOption("");
            }}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl transition border border-slate-700"
            title="Cancel"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <select
            value={value}
            onChange={(e) => {
              if (e.target.value === "__ADD_NEW__") {
                setIsAddingNew(true);
              } else {
                onChange(e.target.value);
              }
            }}
            required={required}
            className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-slate-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none appearance-none cursor-pointer"
          >
            <option value="">{placeholder}</option>
            {customList.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
            <option value="__ADD_NEW__" className="text-sky-400 font-bold bg-slate-900">
              ➕ + Add New Custom Option...
            </option>
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
