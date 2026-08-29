"use client";

import React, { useState, useMemo } from "react";
import { CommunityIssue, CommunityIssueCreate, UserRole, DropdownCategoryMap, TeamMember } from "../lib/types";
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
  Building,
  Building2,
  Tag,
  ShieldAlert,
  Layers,
  LayoutGrid,
  List,
  ArrowUpDown,
  Paperclip,
  Edit,
  ExternalLink,
  ChevronRight,
  Eye,
  Check,
  CheckCircle,
  FolderOpen,
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
  dropdownMap?: DropdownCategoryMap;
  teamMembers?: TeamMember[];
}

export default function IssuesTrackerTab({
  issues,
  onAddIssue,
  onUpdateIssue,
  onDeleteIssue,
  isLoading,
  userRole = "Super Admin",
  dropdownMap = {},
  teamMembers = [],
}: IssuesTrackerTabProps) {
  const teamMemberNames = teamMembers.map((m) => m.name).filter(Boolean);
  const canEdit = userRole === "Super Admin" || userRole === "Admin";
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTowerFilter, setSelectedTowerFilter] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPriority, setSelectedPriority] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeIssueDetail, setActiveIssueDetail] = useState<CommunityIssue | null>(null);
  const [editingIssue, setEditingIssue] = useState<CommunityIssue | null>(null);

  // Sort State
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

  const defaultTowers = dropdownMap["towers"]?.length
    ? dropdownMap["towers"]
    : ["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F", "Clubhouse", "Common Space"];

  const defaultCategories = dropdownMap["issue_categories"]?.length
    ? dropdownMap["issue_categories"]
    : [
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

  const getTowerTheme = (tower: string) => {
    switch (tower) {
      case "Tower A":
        return {
          bg: "bg-sky-950/40 hover:bg-sky-950/70",
          border: "border-sky-700/50 hover:border-sky-500",
          activeBorder: "border-sky-400 ring-2 ring-sky-400/50 bg-sky-950/80 shadow-lg shadow-sky-500/20",
          text: "text-sky-300",
          badge: "bg-sky-950/90 text-sky-300 border-sky-600/80",
          accent: "from-sky-600 to-blue-600",
          dot: "bg-sky-400 shadow-[0_0_8px_rgba(56,189,248,0.8)]",
        };
      case "Tower B":
        return {
          bg: "bg-indigo-950/40 hover:bg-indigo-950/70",
          border: "border-indigo-700/50 hover:border-indigo-500",
          activeBorder: "border-indigo-400 ring-2 ring-indigo-400/50 bg-indigo-950/80 shadow-lg shadow-indigo-500/20",
          text: "text-indigo-300",
          badge: "bg-indigo-950/90 text-indigo-300 border-indigo-600/80",
          accent: "from-indigo-600 to-violet-600",
          dot: "bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]",
        };
      case "Tower C":
        return {
          bg: "bg-purple-950/40 hover:bg-purple-950/70",
          border: "border-purple-700/50 hover:border-purple-500",
          activeBorder: "border-purple-400 ring-2 ring-purple-400/50 bg-purple-950/80 shadow-lg shadow-purple-500/20",
          text: "text-purple-300",
          badge: "bg-purple-950/90 text-purple-300 border-purple-600/80",
          accent: "from-purple-600 to-fuchsia-600",
          dot: "bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]",
        };
      case "Tower D":
        return {
          bg: "bg-emerald-950/40 hover:bg-emerald-950/70",
          border: "border-emerald-700/50 hover:border-emerald-500",
          activeBorder: "border-emerald-400 ring-2 ring-emerald-400/50 bg-emerald-950/80 shadow-lg shadow-emerald-500/20",
          text: "text-emerald-300",
          badge: "bg-emerald-950/90 text-emerald-300 border-emerald-600/80",
          accent: "from-emerald-600 to-teal-600",
          dot: "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]",
        };
      case "Tower E":
        return {
          bg: "bg-amber-950/40 hover:bg-amber-950/70",
          border: "border-amber-700/50 hover:border-amber-500",
          activeBorder: "border-amber-400 ring-2 ring-amber-400/50 bg-amber-950/80 shadow-lg shadow-amber-500/20",
          text: "text-amber-300",
          badge: "bg-amber-950/90 text-amber-300 border-amber-600/80",
          accent: "from-amber-600 to-orange-600",
          dot: "bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]",
        };
      case "Tower F":
        return {
          bg: "bg-rose-950/40 hover:bg-rose-950/70",
          border: "border-rose-700/50 hover:border-rose-500",
          activeBorder: "border-rose-400 ring-2 ring-rose-400/50 bg-rose-950/80 shadow-lg shadow-rose-500/20",
          text: "text-rose-300",
          badge: "bg-rose-950/90 text-rose-300 border-rose-600/80",
          accent: "from-rose-600 to-red-600",
          dot: "bg-rose-400 shadow-[0_0_8px_rgba(251,113,133,0.8)]",
        };
      case "Clubhouse":
        return {
          bg: "bg-cyan-950/40 hover:bg-cyan-950/70",
          border: "border-cyan-700/50 hover:border-cyan-500",
          activeBorder: "border-cyan-400 ring-2 ring-cyan-400/50 bg-cyan-950/80 shadow-lg shadow-cyan-500/20",
          text: "text-cyan-300",
          badge: "bg-cyan-950/90 text-cyan-300 border-cyan-600/80",
          accent: "from-cyan-600 to-blue-600",
          dot: "bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]",
        };
      default:
        return {
          bg: "bg-slate-800/40 hover:bg-slate-800/70",
          border: "border-slate-700/50 hover:border-slate-500",
          activeBorder: "border-slate-400 ring-2 ring-slate-400/50 bg-slate-800 shadow-lg shadow-slate-500/20",
          text: "text-slate-300",
          badge: "bg-slate-800 text-slate-300 border-slate-600",
          accent: "from-slate-600 to-slate-500",
          dot: "bg-slate-400",
        };
    }
  };

  // Tower Stats for Quick Tiles Grid
  const towerStats = useMemo(() => {
    const towers = defaultTowers;
    const totalAll = issues.length;
    const totalOpen = issues.filter((iss) => iss.status !== "Resolved" && iss.status !== "Closed").length;
    const totalResolved = issues.filter((iss) => iss.status === "Resolved" || iss.status === "Closed").length;

    const list = towers.map((tower) => {
      const towerIssues = issues.filter((iss) => iss.tower === tower);
      const openCount = towerIssues.filter(
        (iss) => iss.status !== "Resolved" && iss.status !== "Closed"
      ).length;
      const resolvedCount = towerIssues.filter(
        (iss) => iss.status === "Resolved" || iss.status === "Closed"
      ).length;
      return {
        tower,
        total: towerIssues.length,
        open: openCount,
        resolved: resolvedCount,
      };
    });

    return {
      all: { total: totalAll, open: totalOpen, resolved: totalResolved },
      list,
    };
  }, [issues, defaultTowers]);

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

  // Group filtered issues by tower for card view
  const issuesByTower = useMemo(() => {
    const groups: Record<string, CommunityIssue[]> = {};
    const towerOrder = defaultTowers;
    for (const issue of filteredIssues) {
      const tower = issue.tower || "Other";
      if (!groups[tower]) groups[tower] = [];
      groups[tower].push(issue);
    }
    // Return in tower order
    const result: { tower: string; issues: CommunityIssue[] }[] = [];
    for (const t of towerOrder) {
      if (groups[t] && groups[t].length > 0) {
        result.push({ tower: t, issues: groups[t] });
      }
    }
    // Add any remaining towers not in order
    for (const [t, iss] of Object.entries(groups)) {
      if (!towerOrder.includes(t)) {
        result.push({ tower: t, issues: iss });
      }
    }
    return result;
  }, [filteredIssues, defaultTowers]);

  const currentDetailIssue = useMemo(() => {
    if (!activeIssueDetail) return null;
    return issues.find((i) => i.id === activeIssueDetail.id) || activeIssueDetail;
  }, [issues, activeIssueDetail]);

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

  return (
    <div className="space-y-6">
      {/* Top Header & Action Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-3xl shadow-2xl flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.9)] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              4. Community Issues Tracker
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and manage maintenance tickets grouped by Tower (A to F), Clubhouse, and Common Spaces.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Switcher */}
          <div className="inline-flex bg-slate-950 p-1.5 rounded-2xl border border-slate-800 shadow-inner">
            <button
              onClick={() => setViewMode("cards")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === "cards"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Tower Tiles</span>
            </button>

            <button
              onClick={() => setViewMode("table")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 ${
                viewMode === "table"
                  ? "bg-rose-600 text-white shadow-md shadow-rose-600/30 border border-rose-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table View</span>
            </button>
          </div>

          {canEdit && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 hover:from-rose-500 hover:to-red-500 text-white text-xs sm:text-sm font-black px-4 py-2.5 rounded-2xl shadow-xl shadow-rose-600/30 transition transform active:scale-95 hover:scale-[1.02] border border-rose-400/40"
            >
              <Plus className="w-4 h-4" />
              <span>Report Issue Ticket</span>
            </button>
          )}
        </div>
      </div>

      {/* TOWER SUMMARY TILES BAR (Interactive Quick Selector) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Filter by Tower Tile:</span>
          </span>
          {selectedTowerFilter !== "All" && (
            <button
              onClick={() => setSelectedTowerFilter("All")}
              className="text-xs font-bold text-rose-400 hover:text-rose-300 transition"
            >
              Reset to All Towers
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-9 gap-2.5">
          {/* Tile 0: All Towers */}
          <button
            onClick={() => setSelectedTowerFilter("All")}
            className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
              selectedTowerFilter === "All"
                ? "bg-slate-800 border-rose-500 ring-2 ring-rose-500/40 shadow-lg shadow-rose-500/20"
                : "bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-white">All Towers</span>
              <span className="text-[10px] font-mono font-black px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {towerStats.all.total}
              </span>
            </div>
            <div className="mt-2 text-[10px] flex items-center gap-1.5 font-bold">
              <span className="text-rose-400">{towerStats.all.open} Open</span>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400">{towerStats.all.resolved} Done</span>
            </div>
          </button>

          {/* Tiles 1..N: Individual Towers */}
          {towerStats.list.map((item) => {
            const theme = getTowerTheme(item.tower);
            const isSelected = selectedTowerFilter === item.tower;

            return (
              <button
                key={item.tower}
                onClick={() => setSelectedTowerFilter(isSelected ? "All" : item.tower)}
                className={`p-3 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected ? theme.activeBorder : `${theme.bg} ${theme.border}`
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`w-2 h-2 rounded-full ${theme.dot} shrink-0`} />
                    <span className={`text-xs font-black truncate ${theme.text}`}>{item.tower}</span>
                  </div>
                  <span className={`text-[10px] font-mono font-black px-1.5 py-0.2 rounded-full border ${theme.badge} shrink-0`}>
                    {item.total}
                  </span>
                </div>
                <div className="mt-2 text-[10px] flex items-center gap-1.5 font-bold truncate">
                  <span className="text-rose-300">{item.open} Open</span>
                  <span className="text-slate-600">•</span>
                  <span className="text-emerald-300">{item.resolved} Done</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ticket code, flat, issue title, technician..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500/40 focus:border-rose-500 bg-slate-800/80 text-white placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          >
            <option value="All">All Priorities</option>
            {defaultPriorities.map((p) => (
              <option key={p} value={p} className="bg-slate-900 text-white">
                {p}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
          >
            <option value="All">All Statuses</option>
            {defaultStatuses.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-white">
                {s}
              </option>
            ))}
          </select>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-800 text-white border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none max-w-[160px] truncate"
          >
            <option value="All">All Categories</option>
            {defaultCategories.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* VIEW MODE 1: TOWER TILES WITH NESTED ISSUE CARDS */}
      {viewMode === "cards" && (
        <div className="space-y-8">
          {issuesByTower.length === 0 ? (
            <div className="bg-slate-900/60 rounded-3xl p-12 text-center border border-slate-800 shadow-md">
              <ShieldAlert className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-300">No maintenance tickets found</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                No tickets match your current search, tower, or filter settings.
              </p>
            </div>
          ) : (
            issuesByTower.map(({ tower, issues: towerIssues }) => {
              const theme = getTowerTheme(tower);
              const openCount = towerIssues.filter(
                (i) => i.status !== "Resolved" && i.status !== "Closed"
              ).length;
              const resolvedCount = towerIssues.filter(
                (i) => i.status === "Resolved" || i.status === "Closed"
              ).length;

              return (
                <div
                  key={tower}
                  className="bg-slate-900/90 rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-2xl space-y-4 relative overflow-hidden"
                >
                  {/* Background ambient gradient glow for each tower */}
                  <div className={`absolute -top-24 -right-24 w-72 h-72 rounded-full blur-3xl opacity-10 pointer-events-none bg-gradient-to-br ${theme.accent}`} />

                  {/* Tower Group Tile Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-slate-800 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm text-white shadow-lg bg-gradient-to-br ${theme.accent}`}>
                        <Building className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base sm:text-lg font-black text-white">{tower}</h3>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
                            {towerIssues.length} {towerIssues.length === 1 ? "Ticket" : "Tickets"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400 font-semibold">
                          <span className="text-rose-400 font-bold">{openCount} Action Required</span>
                          <span>•</span>
                          <span className="text-emerald-400 font-bold">{resolvedCount} Resolved</span>
                        </div>
                      </div>
                    </div>

                    {canEdit && (
                      <button
                        onClick={() => {
                          setFormData({
                            ...formData,
                            tower: tower,
                            flat_no: "",
                            flat_or_location: `${tower}`,
                          });
                          setIsAddModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition self-start sm:self-auto shadow-sm"
                      >
                        <Plus className="w-3.5 h-3.5 text-rose-400" />
                        <span>Log Ticket for {tower}</span>
                      </button>
                    )}
                  </div>

                  {/* Nested Issue Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 relative z-10">
                    {towerIssues.map((issue) => {
                      const isResolved = issue.status === "Resolved" || issue.status === "Closed";

                      return (
                        <div
                          key={issue.id}
                          onClick={() => setActiveIssueDetail(issue)}
                          className={`bg-slate-950/80 rounded-2xl p-4 border border-slate-800 hover:border-rose-500/60 shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col justify-between group hover:-translate-y-0.5 ${
                            issue.priority === "Critical"
                              ? "border-l-4 border-l-rose-500 bg-rose-950/10"
                              : issue.priority === "High"
                              ? "border-l-4 border-l-amber-500"
                              : ""
                          }`}
                        >
                          <div>
                            {/* Top Bar: Ticket Code & Priority */}
                            <div className="flex items-center justify-between gap-2 mb-2">
                              <span className="font-mono text-[11px] font-black text-sky-400 bg-sky-950/90 border border-sky-800/80 px-2 py-0.5 rounded-lg">
                                {issue.issue_code || `ISS-${issue.id}`}
                              </span>

                              <span
                                className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${
                                  issue.priority === "Critical"
                                    ? "bg-rose-950 text-rose-300 border-rose-600 animate-pulse"
                                    : issue.priority === "High"
                                    ? "bg-amber-950 text-amber-300 border-amber-600"
                                    : "bg-slate-800 text-slate-300 border-slate-700"
                                }`}
                              >
                                {issue.priority}
                              </span>
                            </div>

                            {/* Title */}
                            <h4 className="text-xs sm:text-sm font-black text-white leading-snug line-clamp-2 group-hover:text-rose-300 transition mt-1">
                              {issue.title}
                            </h4>

                            {/* Flat & Location */}
                            <div className="flex items-center gap-1.5 mt-2.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                              <span className="text-xs text-slate-200 font-bold truncate">
                                {issue.flat_no ? `Flat ${issue.flat_no}` : issue.flat_or_location}
                              </span>
                            </div>

                            {/* Category Tag */}
                            <div className="mt-2 text-[10px] text-slate-400 font-medium flex items-center gap-1.5">
                              <Tag className="w-3 h-3 text-slate-500 shrink-0" />
                              <span className="truncate bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                {issue.category}
                              </span>
                            </div>

                            {/* Assigned Technician / Lead */}
                            {issue.assigned_to && (
                              <div className="mt-2 text-[10px] text-slate-400 flex items-center gap-1.5">
                                <Wrench className="w-3 h-3 text-sky-400 shrink-0" />
                                <span className="truncate font-semibold text-slate-300">
                                  {issue.assigned_to}
                                </span>
                              </div>
                            )}

                            {/* Attachment proof indicator */}
                            {issue.attachment_url && (
                              <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-sky-300 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md">
                                <Paperclip className="w-3 h-3" />
                                <span>Photo Evidence Attached</span>
                              </div>
                            )}
                          </div>

                          {/* Card Footer: Status & Reported By */}
                          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
                            <span
                              className={`font-black px-2.5 py-0.5 rounded-full text-[10px] border flex items-center gap-1 ${
                                isResolved
                                  ? "bg-emerald-950 text-emerald-300 border-emerald-700/80"
                                  : issue.status === "In Progress"
                                  ? "bg-sky-950 text-sky-300 border-sky-700/80"
                                  : "bg-amber-950 text-amber-300 border-amber-700/80"
                              }`}
                            >
                              {isResolved ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Clock className="w-3 h-3 text-amber-400" />
                              )}
                              <span>{issue.status}</span>
                            </span>

                            <span className="text-[10px] text-slate-400 truncate max-w-[120px] font-medium">
                              By {issue.reported_by}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* VIEW MODE 2: TABLE VIEW */}
      {viewMode === "table" && (
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-black text-[11px] border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Ticket #</th>
                  <th
                    onClick={() => {
                      setSortField("tower");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="p-3.5 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Tower <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Flat / Location</th>
                  <th className="p-3.5">Issue Title &amp; Category</th>
                  <th className="p-3.5">Reported By</th>
                  <th
                    onClick={() => {
                      setSortField("priority");
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
                    }}
                    className="p-3.5 cursor-pointer hover:text-white"
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
                    className="p-3.5 cursor-pointer hover:text-white"
                  >
                    <div className="flex items-center gap-1">
                      Status <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="p-3.5">Assigned To</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {filteredIssues.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-500 italic">
                      No tickets found matching filters.
                    </td>
                  </tr>
                ) : (
                  filteredIssues.map((issue) => (
                    <tr key={issue.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-3.5 font-mono font-black text-sky-400">
                        {issue.issue_code || `ISS-${issue.id}`}
                      </td>
                      <td className="p-3.5 font-extrabold text-white">{issue.tower}</td>
                      <td className="p-3.5">{issue.flat_no || issue.flat_or_location}</td>
                      <td className="p-3.5 max-w-xs">
                        <p
                          onClick={() => setActiveIssueDetail(issue)}
                          className="font-bold text-white hover:text-rose-300 cursor-pointer"
                        >
                          {issue.title}
                        </p>
                        <span className="text-[10px] text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                          {issue.category}
                        </span>
                      </td>
                      <td className="p-3.5">{issue.reported_by}</td>
                      <td className="p-3.5">
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
                      <td className="p-3.5">
                        <span
                          className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${
                            issue.status === "Resolved" || issue.status === "Closed"
                              ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                              : issue.status === "In Progress"
                              ? "bg-sky-950 text-sky-300 border-sky-700"
                              : "bg-amber-950 text-amber-300 border-amber-700"
                          }`}
                        >
                          {issue.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-[11px]">{issue.assigned_to}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setActiveIssueDetail(issue)}
                            className="p-1.5 text-slate-400 hover:text-sky-300 rounded-lg hover:bg-slate-800 transition"
                            title="View Ticket Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {canEdit && (
                            <>
                              <button
                                onClick={() => setEditingIssue(issue)}
                                className="p-1.5 text-slate-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition"
                                title="Edit Ticket"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`Delete ticket "${issue.title}"?`)) {
                                    onDeleteIssue(issue.id);
                                  }
                                }}
                                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition"
                                title="Delete Ticket"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Interactive Issue Details Modal */}
      {currentDetailIssue && (
        <Modal
          isOpen={Boolean(currentDetailIssue)}
          onClose={() => setActiveIssueDetail(null)}
          title={`${currentDetailIssue.issue_code || "ISS"}: ${currentDetailIssue.title}`}
          subtitle="Community Maintenance Ticket Details & Resolution Progress"
          maxWidth="lg"
        >
          <div className="space-y-4 text-xs">
            {/* Meta Tags Row */}
            <div className="flex flex-wrap items-center gap-2 p-3 bg-slate-950/80 rounded-xl border border-slate-800">
              <span className={`px-2.5 py-0.5 rounded-lg font-bold border text-xs ${getTowerTheme(currentDetailIssue.tower).badge}`}>
                {currentDetailIssue.tower} {currentDetailIssue.flat_no ? `- Flat ${currentDetailIssue.flat_no}` : ""}
              </span>

              <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 font-semibold text-[11px]">
                {currentDetailIssue.category}
              </span>

              <span
                className={`px-2 py-0.5 rounded-full font-bold text-[11px] border ${
                  currentDetailIssue.status === "Resolved" || currentDetailIssue.status === "Closed"
                    ? "bg-emerald-950 text-emerald-300 border-emerald-700"
                    : currentDetailIssue.status === "In Progress"
                    ? "bg-sky-950 text-sky-300 border-sky-700"
                    : "bg-amber-950 text-amber-300 border-amber-700"
                }`}
              >
                {currentDetailIssue.status}
              </span>

              <span
                className={`ml-auto text-[10px] font-black uppercase px-2 py-0.5 rounded border ${
                  currentDetailIssue.priority === "Critical"
                    ? "bg-rose-950 text-rose-300 border-rose-600"
                    : currentDetailIssue.priority === "High"
                    ? "bg-amber-950 text-amber-300 border-amber-600"
                    : "bg-slate-800 text-slate-300 border-slate-700"
                }`}
              >
                {currentDetailIssue.priority} Priority
              </span>
            </div>

            {/* Description */}
            <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
              <h4 className="font-bold text-white mb-1.5 text-xs">Issue Description</h4>
              <p className="text-slate-200 leading-relaxed">
                {currentDetailIssue.description || currentDetailIssue.title}
              </p>
            </div>

            {/* Key Metadata Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 font-semibold text-[11px]">Reported By</span>
                <p className="font-bold text-white mt-0.5">{currentDetailIssue.reported_by}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Date: {currentDetailIssue.created_at}</p>
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                <span className="text-slate-400 font-semibold text-[11px]">Assigned Technician / Desk</span>
                <p className="font-bold text-white mt-0.5">{currentDetailIssue.assigned_to}</p>
              </div>
            </div>

            {/* Attachment Proof if any */}
            {currentDetailIssue.attachment_url && (
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs">
                  <Paperclip className="w-4 h-4 text-sky-400" />
                  <span className="text-slate-200 font-semibold">Attached Photo / Defect Evidence</span>
                </div>
                <a
                  href={currentDetailIssue.attachment_url}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>View Proof</span>
                </a>
              </div>
            )}

            {/* Resolution Notes */}
            {currentDetailIssue.resolution_notes && (
              <div className="p-3.5 bg-emerald-950/40 rounded-xl border border-emerald-800/50">
                <h4 className="font-bold text-emerald-300 mb-1 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Resolution &amp; Inspection Update
                </h4>
                <p className="text-emerald-100 leading-relaxed text-xs">
                  {currentDetailIssue.resolution_notes}
                </p>
              </div>
            )}

            {/* Actions for Admin / Super Admin */}
            {canEdit && (
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                {currentDetailIssue.status !== "Resolved" && (
                  <button
                    onClick={() => {
                      handleQuickStatusChange(currentDetailIssue, "Resolved");
                      setActiveIssueDetail(null);
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition"
                  >
                    Mark as Resolved
                  </button>
                )}

                <button
                  onClick={() => {
                    setEditingIssue(currentDetailIssue);
                    setActiveIssueDetail(null);
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Ticket</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm(`Delete ticket "${currentDetailIssue.title}"?`)) {
                      onDeleteIssue(currentDetailIssue.id);
                      setActiveIssueDetail(null);
                    }
                  }}
                  className="px-3 py-1.5 bg-red-950 hover:bg-red-900 border border-red-700 text-red-300 rounded-xl text-xs font-bold transition flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </Modal>
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
                <DynamicSelect
                  label="Assigned To"
                  value={editingIssue.assigned_to}
                  onChange={(val) => setEditingIssue({ ...editingIssue, assigned_to: val })}
                  options={teamMemberNames.length ? teamMemberNames : ["Karthik Venkatesh", "Facility Maintenance Cell", "IGS Security Desk"]}
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
              <DynamicSelect
                label="Assigned To"
                value={formData.assigned_to}
                onChange={(val) => setFormData({ ...formData, assigned_to: val })}
                options={teamMemberNames.length ? teamMemberNames : ["Karthik Venkatesh", "Facility Maintenance Cell", "IGS Security Desk"]}
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
