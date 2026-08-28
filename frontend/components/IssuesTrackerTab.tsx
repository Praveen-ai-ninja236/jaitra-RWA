"use client";

import React, { useState, useMemo } from "react";
import { CommunityIssue, CommunityIssueCreate, UserRole } from "../lib/types";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Search,
  Plus,
  Filter,
  MapPin,
  User,
  Wrench,
  Trash2,
  Check,
  Building,
  Tag,
  ShieldAlert,
  Layers,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Edit3,
  ArrowUpDown,
  Paperclip,
  Edit,
} from "lucide-react";
import Modal from "./Modal";
import DynamicSelect from "./DynamicSelect";
import FileUploadInput from "./FileUploadInput";

interface IssuesTrackerTabProps {
  issues: CommunityIssue[];
  onAddIssue: (issue: CommunityIssueCreate) => Promise<void>;
  onUpdateIssue: (id: number, issue: Partial<CommunityIssueCreate>) => Promise<void>;
  onDeleteIssue: (id: number) => Promise<void>;
  isLoading: boolean;
  userRole?: UserRole;
}

export default function IssuesTrackerTab({
  issues,
  onAddIssue,
  onUpdateIssue,
  onDeleteIssue,
  isLoading,
  userRole = "Super Admin",
}: IssuesTrackerTabProps) {
  const canEdit = userRole === "Super Admin" || userRole === "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTowerFilter, setSelectedTowerFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"tower-containers" | "all-rows">("tower-containers");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingIssue, setEditingIssue] = useState<CommunityIssue | null>(null);
  const [collapsedTowers, setCollapsedTowers] = useState<Record<string, boolean>>({});

  // Sort State for All Rows View
  const [sortField, setSortField] = useState<"created_at" | "priority" | "status" | "tower">("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CommunityIssueCreate>({
    title: "",
    tower: "Tower A",
    flat_no: "101",
    flat_or_location: "Tower A - Flat 101",
    category: "Civil & Seepage",
    reported_by: "",
    priority: "Medium",
    status: "Open",
    assigned_to: "Facility Maintenance Desk",
    created_at: new Date().toISOString().split("T")[0],
    description: "",
    resolution_notes: "",
    attachment_url: "",
  });

  const defaultTowers = [
    "Tower A",
    "Tower B",
    "Tower C",
    "Tower D",
    "Tower E",
    "Tower F",
    "Clubhouse",
    "Common Space",
  ];

  const defaultCategories = [
    "Civil & Seepage",
    "Electrical & Lift",
    "STP & Water Supply",
    "Security & Access",
    "Landscaping & Pest",
    "Common Amenities",
    "Plumbing & Sanitation",
    "Fire Safety",
  ];

  const defaultPriorities = ["Critical", "High", "Medium", "Low"];
  const defaultStatuses = ["Open", "In Progress", "Under Inspection", "Resolved", "Closed"];

  const filteredIssues = useMemo(() => {
    return issues
      .filter((iss) => {
        const matchSearch =
          iss.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (iss.issue_code && iss.issue_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          iss.flat_or_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
          iss.reported_by.toLowerCase().includes(searchTerm.toLowerCase()) ||
          iss.assigned_to.toLowerCase().includes(searchTerm.toLowerCase());

        const matchTower = selectedTowerFilter === "All" || iss.tower === selectedTowerFilter;
        const matchStatus = selectedStatus === "All" || iss.status === selectedStatus;
        const matchPriority = selectedPriority === "All" || iss.priority === selectedPriority;
        const matchCategory =
          selectedCategory === "All" ||
          iss.category.toLowerCase().includes(selectedCategory.toLowerCase());

        return matchSearch && matchTower && matchStatus && matchPriority && matchCategory;
      })
      .sort((a, b) => {
        if (sortField === "created_at") {
          const dA = new Date(a.created_at || "").getTime();
          const dB = new Date(b.created_at || "").getTime();
          return sortOrder === "asc" ? dA - dB : dB - dA;
        }
        let valA = a[sortField] || "";
        let valB = b[sortField] || "";
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
  }, [issues, searchTerm, selectedTowerFilter, selectedStatus, selectedPriority, selectedCategory, sortField, sortOrder]);

  const toggleTowerCollapse = (towerName: string) => {
    setCollapsedTowers({
      ...collapsedTowers,
      [towerName]: !collapsedTowers[towerName],
    });
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.reported_by) return;
    setIsSubmitting(true);
    try {
      await onAddIssue({
        ...formData,
        flat_or_location: `${formData.tower}${formData.flat_no ? ` - ${formData.flat_no}` : ""}`,
      });
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        tower: "Tower A",
        flat_no: "101",
        flat_or_location: "Tower A - Flat 101",
        category: "Civil & Seepage",
        reported_by: "",
        priority: "Medium",
        status: "Open",
        assigned_to: "Facility Maintenance Desk",
        created_at: new Date().toISOString().split("T")[0],
        description: "",
        resolution_notes: "",
        attachment_url: "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingIssue) return;
    setIsSubmitting(true);
    try {
      await onUpdateIssue(editingIssue.id, editingIssue);
      setEditingIssue(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQuickStatusChange = async (issue: CommunityIssue, newStatus: string) => {
    try {
      await onUpdateIssue(issue.id, {
        ...issue,
        status: newStatus,
        resolution_notes:
          newStatus === "Resolved"
            ? issue.resolution_notes
              ? `${issue.resolution_notes} (Resolved)`
              : "Verified and resolved by facility team."
            : issue.resolution_notes,
      });
    } catch (err) {
      console.error(err);
    }
  };

  const getTowerColor = (towerName: string) => {
    if (towerName === "Tower A") return "border-sky-500/40 bg-sky-950/20 text-sky-400";
    if (towerName === "Tower B") return "border-indigo-500/40 bg-indigo-950/20 text-indigo-400";
    if (towerName === "Tower C") return "border-purple-500/40 bg-purple-950/20 text-purple-400";
    if (towerName === "Tower D") return "border-emerald-500/40 bg-emerald-950/20 text-emerald-400";
    if (towerName === "Tower E") return "border-amber-500/40 bg-amber-950/20 text-amber-400";
    if (towerName === "Tower F") return "border-rose-500/40 bg-rose-950/20 text-rose-400";
    if (towerName === "Clubhouse") return "border-cyan-500/40 bg-cyan-950/20 text-cyan-400";
    return "border-slate-500/40 bg-slate-800/40 text-slate-300";
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              4. Community Issues Tracker (Towers A - F, Clubhouse &amp; Common Area)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Grouped by 6 Towers (A, B, C, D, E, F) and Common amenities with row-wise ticket tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="inline-flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setViewMode("tower-containers")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "tower-containers"
                  ? "bg-slate-800 text-white shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tower Containers</span>
            </button>

            <button
              onClick={() => setViewMode("all-rows")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "all-rows"
                  ? "bg-slate-800 text-white shadow-md border border-slate-700"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>All Tickets</span>
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 transition transform active:scale-95 hover:scale-[1.02]"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ticket # (ISS-TWA-101), flat no, issue title..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 bg-slate-800/80 text-white placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Tower Filter */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Building className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-slate-400 font-medium">Tower:</span>
            <select
              value={selectedTowerFilter}
              onChange={(e) => setSelectedTowerFilter(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Towers (A - F)</option>
              {defaultTowers.map((t) => (
                <option key={t} value={t} className="bg-slate-900 text-white">
                  {t}
                </option>
              ))}
            </select>
          </div>

          {/* Priority */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Priority:</span>
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All</option>
              {defaultPriorities.map((p) => (
                <option key={p} value={p} className="bg-slate-900 text-white">
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <span className="text-slate-400 font-medium">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              {defaultStatuses.map((s) => (
                <option key={s} value={s} className="bg-slate-900 text-white">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* VIEW MODE 1: TOWER LEVEL CONTAINERS WITH ROW-WISE TICKETS */}
      {viewMode === "tower-containers" && (
        <div className="space-y-5">
          {defaultTowers
            .filter((towerName) => selectedTowerFilter === "All" || selectedTowerFilter === towerName)
            .map((towerName) => {
              const towerIssues = filteredIssues.filter((i) => i.tower === towerName);
              const openCount = towerIssues.filter(
                (i) => i.status !== "Resolved" && i.status !== "Closed"
              ).length;
              const isCollapsed = collapsedTowers[towerName];

              return (
                <div
                  key={towerName}
                  className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-lg overflow-hidden transition-all"
                >
                  {/* Tower Container Header */}
                  <div
                    onClick={() => toggleTowerCollapse(towerName)}
                    className="p-4 sm:p-5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between cursor-pointer hover:bg-slate-950 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`px-3 py-1 rounded-xl border font-black text-xs uppercase tracking-wider ${getTowerColor(
                          towerName
                        )}`}
                      >
                        {towerName}
                      </div>

                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-300 font-bold">
                          {towerIssues.length} Total Tickets
                        </span>
                        {openCount > 0 && (
                          <span className="bg-rose-950 text-rose-300 border border-rose-800 px-2 py-0.5 rounded-full font-extrabold text-[10px]">
                            {openCount} Open / Active
                          </span>
                        )}
                        {openCount === 0 && towerIssues.length > 0 && (
                          <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                            All Resolved ✓
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-semibold hidden sm:inline">
                        {isCollapsed ? "Expand Tickets" : "Collapse"}
                      </span>
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-slate-400" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Tower Container Row-Wise Tickets Table */}
                  {!isCollapsed && (
                    <div className="overflow-x-auto">
                      {towerIssues.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-xs italic">
                          No reported maintenance tickets in {towerName}.
                        </div>
                      ) : (
                        <table className="w-full text-left text-xs">
                          <thead className="bg-slate-800/80 text-slate-400 uppercase font-bold text-[11px]">
                            <tr>
                              <th className="p-3">Ticket #</th>
                              <th className="p-3">Flat / Location</th>
                              <th className="p-3">Issue Title &amp; Category</th>
                              <th className="p-3">Reported By</th>
                              <th className="p-3">Priority</th>
                              <th className="p-3">Status</th>
                              <th className="p-3">Assigned To</th>
                              <th className="p-3 text-right">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800 text-slate-300">
                            {towerIssues.map((issue) => (
                              <tr
                                key={issue.id}
                                className={`hover:bg-slate-800/50 transition ${
                                  issue.priority === "Critical" ? "bg-rose-950/15" : ""
                                }`}
                              >
                                <td className="p-3 font-mono font-extrabold text-sky-400">
                                  {issue.issue_code || `ISS-${issue.id}`}
                                </td>

                                <td className="p-3 font-semibold text-white whitespace-nowrap">
                                  {issue.flat_no
                                    ? `${issue.tower} - ${issue.flat_no}`
                                    : issue.flat_or_location}
                                </td>

                                <td className="p-3 max-w-xs">
                                  <p className="font-bold text-white leading-snug">{issue.title}</p>
                                  <span className="text-[10px] text-slate-400 font-semibold bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 mt-0.5 inline-block">
                                    {issue.category}
                                  </span>
                                  {issue.attachment_url && (
                                    <a
                                      href={issue.attachment_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-[10px] text-sky-400 hover:underline flex items-center gap-0.5 mt-0.5"
                                    >
                                      <Paperclip className="w-3 h-3" /> Attached Photo/Doc
                                    </a>
                                  )}
                                  {issue.resolution_notes && (
                                    <p className="text-[11px] text-emerald-400 italic mt-0.5">
                                      ↳ Note: {issue.resolution_notes}
                                    </p>
                                  )}
                                </td>

                                <td className="p-3 text-slate-300 whitespace-nowrap">
                                  {issue.reported_by}
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                                      issue.priority === "Critical"
                                        ? "bg-rose-950 text-rose-300 border-rose-600 animate-pulse"
                                        : issue.priority === "High"
                                        ? "bg-amber-950 text-amber-300 border-amber-600"
                                        : "bg-slate-800 text-slate-300 border-slate-700"
                                    }`}
                                  >
                                    {issue.priority}
                                  </span>
                                </td>

                                <td className="p-3 whitespace-nowrap">
                                  <span
                                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                                      issue.status === "Resolved" || issue.status === "Closed"
                                        ? "bg-emerald-950 text-emerald-300 border-emerald-700/60"
                                        : issue.status === "In Progress"
                                        ? "bg-sky-950 text-sky-300 border-sky-700/60"
                                        : "bg-amber-950 text-amber-300 border-amber-700/60"
                                    }`}
                                  >
                                    {issue.status}
                                  </span>
                                </td>

                                <td className="p-3 text-slate-300 text-[11px] whitespace-nowrap">
                                  {issue.assigned_to}
                                </td>

                                <td className="p-3 text-right whitespace-nowrap">
                                  {canEdit ? (
                                    <div className="flex items-center justify-end gap-1.5">
                                      {issue.status !== "Resolved" && (
                                        <button
                                          onClick={() => handleQuickStatusChange(issue, "Resolved")}
                                          title="Mark Resolved"
                                          className="text-[10px] font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-1 rounded"
                                        >
                                          Resolve
                                        </button>
                                      )}

                                      <button
                                        onClick={() => setEditingIssue(issue)}
                                        title="Edit Ticket"
                                        className="p-1 text-slate-400 hover:text-white"
                                      >
                                        <Edit className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        onClick={() => {
                                          if (confirm(`Delete ticket "${issue.title}"?`)) {
                                            onDeleteIssue(issue.id);
                                          }
                                        }}
                                        title="Delete Ticket"
                                        className="p-1 text-slate-500 hover:text-rose-400"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] text-slate-500 font-mono">Logged</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      )}

      {/* VIEW MODE 2: ALL TICKETS LIST VIEW */}
      {viewMode === "all-rows" && (
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800 text-slate-400 uppercase font-bold text-[11px]">
                <tr>
                  <th className="p-3">Ticket #</th>
                  <th
                    onClick={() => {
                      setSortField("tower");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="p-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Tower <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3">Flat / Location</th>
                  <th className="p-3">Issue Title &amp; Category</th>
                  <th className="p-3">Reported By</th>
                  <th
                    onClick={() => {
                      setSortField("priority");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="p-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Priority <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th
                    onClick={() => {
                      setSortField("status");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="p-3 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3">Assigned To</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500 italic">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-800/40">
                      <td className="p-3 font-mono font-extrabold text-sky-400">
                        {issue.issue_code || `ISS-${issue.id}`}
                      </td>
                      <td className="p-3 font-bold text-white">{issue.tower}</td>
                      <td className="p-3">{issue.flat_no || issue.flat_or_location}</td>
                      <td className="p-3 max-w-xs">
                        <p className="font-bold text-white">{issue.title}</p>
                        <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                          {issue.category}
                        </span>
                      </td>
                      <td className="p-3">{issue.reported_by}</td>
                      <td className="p-3">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                            issue.priority === "Critical"
                              ? "bg-rose-950 text-rose-300 border-rose-600"
                              : issue.priority === "High"
                              ? "bg-amber-950 text-amber-300 border-amber-600"
                              : "bg-slate-800 text-slate-300 border-slate-700"
                          }`}
                        >
                          {issue.priority}
                        </span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            issue.status === "Resolved"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                              : issue.status === "In Progress"
                              ? "bg-sky-950 text-sky-300 border-sky-700"
                              : "bg-amber-950 text-amber-300 border-amber-700"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-3 text-[11px]">{issue.assigned_to}</td>
                      <td className="p-3 text-right">
                        {canEdit ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditingIssue(issue)}
                              className="p-1 text-slate-400 hover:text-amber-300"
                              title="Edit Ticket"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ticket "${issue.title}"?`)) {
                                onDeleteIssue(issue.id);
                              }
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400"
                            title="Delete Ticket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        ) : (
                          <span className="text-[10px] text-slate-500 font-mono">Logged</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Issue Modal */}
      {editingIssue && (
        <Modal
          isOpen={Boolean(editingIssue)}
          onClose={() => setEditingIssue(null)}
          title={`Edit Ticket ${editingIssue.issue_code || "ISS"}`}
          subtitle="Update status, assigned technician, category, and resolution in Neon DB"
          maxWidth="lg"
        >
          <form onSubmit={handleUpdateIssueSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Issue Title *</label>
              <input
                type="text"
                required
                value={editingIssue.title}
                onChange={(e) => setEditingIssue({ ...editingIssue, title: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <DynamicSelect
                  label="Tower / Location"
                  value={editingIssue.tower}
                  onChange={(val) => setEditingIssue({ ...editingIssue, tower: val })}
                  options={defaultTowers}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Flat / Sub-location</label>
                <input
                  type="text"
                  value={editingIssue.flat_no || ""}
                  onChange={(e) => setEditingIssue({ ...editingIssue, flat_no: e.target.value })}
                  placeholder="e.g. 402"
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <DynamicSelect
                  label="Category"
                  value={editingIssue.category}
                  onChange={(val) => setEditingIssue({ ...editingIssue, category: val })}
                  options={defaultCategories}
                />
              </div>

              <div>
                <DynamicSelect
                  label="Priority"
                  value={editingIssue.priority}
                  onChange={(val) => setEditingIssue({ ...editingIssue, priority: val })}
                  options={defaultPriorities}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <DynamicSelect
                  label="Status"
                  value={editingIssue.status}
                  onChange={(val) => setEditingIssue({ ...editingIssue, status: val })}
                  options={defaultStatuses}
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Assigned Vendor / Technician</label>
                <input
                  type="text"
                  value={editingIssue.assigned_to}
                  onChange={(e) => setEditingIssue({ ...editingIssue, assigned_to: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
                />
              </div>
            </div>

            {/* Photo / Document Upload */}
            <FileUploadInput
              label="Attachment / Photo Proof"
              value={editingIssue.attachment_url}
              onChange={(dataUrl) => setEditingIssue({ ...editingIssue, attachment_url: dataUrl })}
            />

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Resolution Update / Work Done</label>
              <textarea
                rows={3}
                value={editingIssue.resolution_notes || ""}
                onChange={(e) => setEditingIssue({ ...editingIssue, resolution_notes: e.target.value })}
                placeholder="Details on repairs performed, replacement parts installed..."
                className="w-full p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setEditingIssue(null)}
                className="px-4 py-2 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl"
              >
                {isSubmitting ? "Updating..." : "Save Updates to DB"}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Report New Issue Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Report New Community Maintenance Issue"
        subtitle="Tagged by Tower A-F, Clubhouse, or Common Space"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateIssue} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Issue Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Basement 2 water accumulation near pillar 42"
              className="w-full text-xs p-2.5 border rounded-xl bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DynamicSelect
                label="Tower / Location Tag"
                required
                value={formData.tower}
                onChange={(val) => setFormData({ ...formData, tower: val })}
                options={defaultTowers}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Flat No / Bay (Optional)</label>
              <input
                type="text"
                value={formData.flat_no || ""}
                onChange={(e) => setFormData({ ...formData, flat_no: e.target.value })}
                placeholder="e.g. 504 / Parking Bay 12"
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <DynamicSelect
                label="Category"
                required
                value={formData.category}
                onChange={(val) => setFormData({ ...formData, category: val })}
                options={defaultCategories}
              />
            </div>
            <div>
              <DynamicSelect
                label="Priority"
                required
                value={formData.priority}
                onChange={(val) => setFormData({ ...formData, priority: val })}
                options={defaultPriorities}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Reported By *</label>
              <input
                type="text"
                required
                value={formData.reported_by}
                onChange={(e) => setFormData({ ...formData, reported_by: e.target.value })}
                placeholder="e.g., Rajesh S. (Flat B-404)"
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-800 border-slate-700 text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Vendor / Cell</label>
              <input
                type="text"
                value={formData.assigned_to}
                onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                placeholder="e.g., Builder Civil Cell / IGS Plumbing"
                className="w-full text-xs p-2.5 border rounded-xl bg-slate-800 border-slate-700 text-white"
              />
            </div>
          </div>

          {/* Photo / Bill Upload */}
          <FileUploadInput
            label="Upload Defect Photo / Bill (Optional)"
            value={formData.attachment_url}
            onChange={(dataUrl) => setFormData({ ...formData, attachment_url: dataUrl })}
          />

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe symptoms, frequency, and damage if any..."
              className="w-full text-xs p-2.5 border rounded-xl bg-slate-800 border-slate-700 text-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Log Issue Ticket in Database"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
