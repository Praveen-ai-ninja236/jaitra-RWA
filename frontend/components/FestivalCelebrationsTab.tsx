"use client";

import React, { useState } from "react";
import {
  FestivalCelebration,
  FestivalCelebrationCreate,
  FestivalCollectionCreate,
  FestivalExpenseCreate
} from "../lib/types";
import {
  Sparkles,
  Calendar,
  MapPin,
  User,
  Plus,
  Search,
  IndianRupee,
  Trash2,
  Tag,
  Flame,
  CheckCircle,
  Clock,
  Coins,
  Receipt,
  FileCheck2,
  FileText,
  Building,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Download,
  Paperclip,
  ExternalLink,
  ChevronRight,
  Filter
} from "lucide-react";
import Modal from "./Modal";

interface FestivalCelebrationsTabProps {
  festivals: FestivalCelebration[];
  onAddFestival: (fest: FestivalCelebrationCreate) => Promise<void>;
  onDeleteFestival: (id: number) => Promise<void>;
  onAddCollection: (festivalId: number, coll: FestivalCollectionCreate) => Promise<void>;
  onDeleteCollection: (collectionId: number) => Promise<void>;
  onAddExpense: (festivalId: number, exp: FestivalExpenseCreate) => Promise<void>;
  onUpdateExpenseStatus: (expenseId: number, status: string, approverName?: string) => Promise<void>;
  onDeleteExpense: (expenseId: number) => Promise<void>;
  isLoading: boolean;
}

export default function FestivalCelebrationsTab({
  festivals,
  onAddFestival,
  onDeleteFestival,
  onAddCollection,
  onDeleteCollection,
  onAddExpense,
  onUpdateExpenseStatus,
  onDeleteExpense,
  isLoading,
}: FestivalCelebrationsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeFestivalDetail, setActiveFestivalDetail] = useState<FestivalCelebration | null>(null);
  const [detailActiveTab, setDetailActiveTab] = useState<"overview" | "collections" | "expenses">("overview");

  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Festival Form State
  const [formData, setFormData] = useState<FestivalCelebrationCreate>({
    festival_name: "",
    start_date: "",
    end_date: "",
    location: "Clubhouse Central Mandapam",
    description: "",
    lead_organizer: "",
    estimated_budget: "₹ 2,50,000",
    collected_funds: "₹ 1,00,000",
    status: "Active",
    highlights: "Pooja & Aarti, Cultural Stage Performances, Maha-Prasadam Distribution, Kids Games",
  });

  // Collection Form State
  const [collData, setCollData] = useState<FestivalCollectionCreate>({
    tower: "Tower A",
    flat_no: "101",
    donor_name: "",
    amount: 1000,
    payment_mode: "UPI",
    transaction_ref: "",
    collected_date: new Date().toISOString().split("T")[0],
    receipt_url: "",
    notes: "",
  });

  // Expense Form State
  const [expData, setExpData] = useState<FestivalExpenseCreate>({
    title: "",
    category: "Decor",
    amount: 5000,
    vendor_name: "",
    bill_date: new Date().toISOString().split("T")[0],
    invoice_url: "",
    audit_evidence_notes: "",
    approver_name: "Vikram Patel",
    approver_role: "Treasurer",
    approval_status: "Approved",
  });

  const towers = ["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F"];
  const statuses = ["All", "Planning", "Active", "Completed"];
  const expenseCategories = ["Decor", "Pooja", "Sound & Light", "Food/Prasadam", "Security", "Priest Dakshina", "Logistics & Stage", "Awards/Gifts"];

  const filteredFestivals = festivals.filter((fest) => {
    const matchSearch =
      fest.festival_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.lead_organizer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fest.highlights?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = selectedStatus === "All" || fest.status === selectedStatus;
    return matchSearch && matchStatus;
  });

  // Calculate live selected festival financials
  const currentCollections = activeFestivalDetail?.collections || [];
  const currentExpenses = activeFestivalDetail?.expenses || [];
  const totalCollectionsAmount = currentCollections.reduce((sum, c) => sum + (c.amount || 0), 0);
  const totalApprovedExpensesAmount = currentExpenses
    .filter((e) => e.approval_status === "Approved")
    .reduce((sum, e) => sum + (e.amount || 0), 0);
  const netSurplusDeficit = totalCollectionsAmount - totalApprovedExpensesAmount;

  const handleCreateFestival = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.festival_name || !formData.start_date || !formData.lead_organizer) return;
    setIsSubmitting(true);
    try {
      await onAddFestival(formData);
      setIsAddModalOpen(false);
      setFormData({
        festival_name: "",
        start_date: "",
        end_date: "",
        location: "Clubhouse Central Mandapam",
        description: "",
        lead_organizer: "",
        estimated_budget: "₹ 2,50,000",
        collected_funds: "₹ 1,00,000",
        status: "Active",
        highlights: "Pooja & Aarti, Cultural Stage Performances, Maha-Prasadam Distribution, Kids Games",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddCollectionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFestivalDetail || !collData.donor_name || collData.amount <= 0) return;
    try {
      await onAddCollection(activeFestivalDetail.id, collData);
      setCollData({
        tower: "Tower A",
        flat_no: "101",
        donor_name: "",
        amount: 1000,
        payment_mode: "UPI",
        transaction_ref: "",
        collected_date: new Date().toISOString().split("T")[0],
        receipt_url: "",
        notes: "",
      });
      // Refresh local detail
      const updated = festivals.find((f) => f.id === activeFestivalDetail.id);
      if (updated) setActiveFestivalDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFestivalDetail || !expData.title || expData.amount <= 0) return;
    try {
      await onAddExpense(activeFestivalDetail.id, expData);
      setExpData({
        title: "",
        category: "Decor",
        amount: 5000,
        vendor_name: "",
        bill_date: new Date().toISOString().split("T")[0],
        invoice_url: "",
        audit_evidence_notes: "",
        approver_name: "Vikram Patel",
        approver_role: "Treasurer",
        approval_status: "Approved",
      });
      // Refresh local detail
      const updated = festivals.find((f) => f.id === activeFestivalDetail.id);
      if (updated) setActiveFestivalDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">2. Festival Celebrations</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Ganesh Chaturthi, Diwali Deepotsav, Sankranti, and financial audit collections &amp; expenses tracker.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs sm:text-sm font-extrabold px-4 py-2.5 rounded-xl shadow-lg shadow-amber-500/20 transition transform active:scale-95 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Festival Celebration</span>
        </button>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search festivals, organizers, highlights..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500/40 focus:border-amber-500 bg-slate-800/80 text-white placeholder-slate-400"
          />
        </div>

        <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
          >
            {statuses.map((s) => (
              <option key={s} value={s} className="bg-slate-900 text-white">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Festival Cards Grid */}
      {filteredFestivals.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl p-12 text-center border border-slate-800 shadow-md">
          <Sparkles className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No festival celebrations recorded</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click &quot;Add Festival Celebration&quot; above to log an event with budget and expense approval workflows.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredFestivals.map((fest) => {
            const highlightsList = fest.highlights
              ? fest.highlights.split(",").map((h) => h.trim()).filter(Boolean)
              : [];
            const colList = fest.collections || [];
            const expList = fest.expenses || [];
            const totalCol = colList.reduce((s, c) => s + (c.amount || 0), 0);
            const totalExp = expList.filter(e => e.approval_status === "Approved").reduce((s, e) => s + (e.amount || 0), 0);

            return (
              <div
                key={fest.id}
                className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 rounded-2xl border border-amber-500/30 shadow-lg hover:border-amber-400/60 transition-all duration-200 overflow-hidden flex flex-col justify-between group"
              >
                <div className="p-6">
                  {/* Top Status & Delete */}
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      <Flame className="w-3.5 h-3.5 text-amber-400" />
                      <span>{fest.status === "Active" ? "Ongoing Celebration" : fest.status}</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteFestival(fest.id);
                      }}
                      title="Delete Festival"
                      className="text-slate-500 hover:text-rose-400 p-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => {
                      setActiveFestivalDetail(fest);
                      setDetailActiveTab("overview");
                    }}
                    className="text-lg sm:text-xl font-extrabold text-white leading-snug cursor-pointer group-hover:text-amber-300 transition flex items-center justify-between"
                  >
                    <span>{fest.festival_name}</span>
                    <ChevronRight className="w-5 h-5 text-amber-400 opacity-80 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">{fest.description}</p>

                  {/* Date & Location Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 p-3.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-300">
                      <Calendar className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Duration</p>
                        <p className="font-bold text-white">
                          {fest.start_date} {fest.end_date && fest.end_date !== fest.start_date ? `to ${fest.end_date}` : ""}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-slate-300">
                      <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                      <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Mandapam / Venue</p>
                        <p className="font-bold text-white truncate">{fest.location}</p>
                      </div>
                    </div>
                  </div>

                  {/* Highlights Tags */}
                  {highlightsList.length > 0 && (
                    <div className="mt-4">
                      <p className="text-[11px] font-bold text-amber-300/90 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                        <Tag className="w-3 h-3 text-amber-400" />
                        <span>Key Highlights</span>
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {highlightsList.map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] font-semibold bg-amber-950/60 text-amber-200 border border-amber-700/60 px-2.5 py-0.5 rounded-lg"
                          >
                            ✦ {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collections vs Expenses Mini Bar */}
                  <div className="mt-4 p-3.5 bg-slate-950/80 rounded-xl border border-amber-800/40 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Resident Collections</span>
                      <p className="font-extrabold text-emerald-300 font-mono mt-0.5 text-sm">
                        ₹ {totalCol.toLocaleString("en-IN")} <span className="text-slate-500 font-normal text-xs">({colList.length} donors)</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-rose-400 font-bold uppercase tracking-wider">Approved Expenses</span>
                      <p className="font-extrabold text-rose-300 font-mono mt-0.5 text-sm">
                        ₹ {totalExp.toLocaleString("en-IN")} <span className="text-slate-500 font-normal text-xs">({expList.length} bills)</span>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between">
                  <div className="text-xs text-slate-400">
                    Lead: <strong className="text-slate-200">{fest.lead_organizer}</strong>
                  </div>

                  <button
                    onClick={() => {
                      setActiveFestivalDetail(fest);
                      setDetailActiveTab("collections");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 hover:text-slate-950 bg-amber-500/20 hover:bg-amber-400 px-3.5 py-1.5 rounded-xl border border-amber-400/40 transition shadow-sm"
                  >
                    <Receipt className="w-3.5 h-3.5" />
                    <span>View Financials &amp; Audit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Financial Audit Tracker Modal */}
      {activeFestivalDetail && (
        <Modal
          isOpen={Boolean(activeFestivalDetail)}
          onClose={() => setActiveFestivalDetail(null)}
          title={`${activeFestivalDetail.festival_name} — Financial Audit & Tracker`}
          subtitle="Resident Collections, Verified Invoices, Audit Proofs & Approvals"
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Financial Overview Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
              <div className="p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Collections</span>
                <p className="text-xl font-extrabold text-emerald-400 font-mono mt-1">
                  ₹ {totalCollectionsAmount.toLocaleString("en-IN")}
                </p>
                <span className="text-[10px] text-emerald-500/80">{currentCollections.length} Contributions</span>
              </div>

              <div className="p-2 border-y sm:border-y-0 sm:border-x border-slate-800">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approved Expenses</span>
                <p className="text-xl font-extrabold text-rose-400 font-mono mt-1">
                  ₹ {totalApprovedExpensesAmount.toLocaleString("en-IN")}
                </p>
                <span className="text-[10px] text-rose-400/80">{currentExpenses.length} Vouchers</span>
              </div>

              <div className="p-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Net Surplus / Balance</span>
                <p className={`text-xl font-extrabold font-mono mt-1 ${netSurplusDeficit >= 0 ? "text-sky-400" : "text-amber-400"}`}>
                  ₹ {netSurplusDeficit.toLocaleString("en-IN")}
                </p>
                <span className={`text-[10px] font-bold ${netSurplusDeficit >= 0 ? "text-sky-400" : "text-amber-400"}`}>
                  {netSurplusDeficit >= 0 ? "Surplus in Escrow" : "Deficit (Pending Funding)"}
                </span>
              </div>
            </div>

            {/* Inner Tabs for Detail View */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setDetailActiveTab("overview")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition ${
                  detailActiveTab === "overview"
                    ? "bg-amber-500 text-slate-950"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                Event Details &amp; Plan
              </button>
              <button
                onClick={() => setDetailActiveTab("collections")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  detailActiveTab === "collections"
                    ? "bg-emerald-500 text-slate-950"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                <Coins className="w-3.5 h-3.5" />
                <span>Collections Tracker ({currentCollections.length})</span>
              </button>
              <button
                onClick={() => setDetailActiveTab("expenses")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  detailActiveTab === "expenses"
                    ? "bg-rose-500 text-white"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Expense Audit &amp; Approver ({currentExpenses.length})</span>
              </button>
            </div>

            {/* TAB 1: OVERVIEW */}
            {detailActiveTab === "overview" && (
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-800/60 rounded-xl border border-slate-700">
                  <h4 className="font-bold text-white mb-1">Celebration Overview</h4>
                  <p className="text-slate-300 leading-relaxed">{activeFestivalDetail.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 font-semibold">Lead Organizer</span>
                    <p className="text-white font-bold mt-0.5">{activeFestivalDetail.lead_organizer}</p>
                  </div>
                  <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                    <span className="text-slate-400 font-semibold">Mandapam Location</span>
                    <p className="text-white font-bold mt-0.5">{activeFestivalDetail.location}</p>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: COLLECTIONS TRACKER */}
            {detailActiveTab === "collections" && (
              <div className="space-y-4">
                {/* Add Collection Form */}
                <form onSubmit={handleAddCollectionSubmit} className="p-4 bg-slate-950 rounded-xl border border-emerald-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Record Resident Contribution / Donation</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Tower *</label>
                      <select
                        value={collData.tower}
                        onChange={(e) => setCollData({ ...collData, tower: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      >
                        {towers.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Flat No *</label>
                      <input
                        type="text"
                        required
                        value={collData.flat_no}
                        onChange={(e) => setCollData({ ...collData, flat_no: e.target.value })}
                        placeholder="e.g. 402"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Donor Resident Name *</label>
                      <input
                        type="text"
                        required
                        value={collData.donor_name}
                        onChange={(e) => setCollData({ ...collData, donor_name: e.target.value })}
                        placeholder="e.g. S. Venkat Rao"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Amount (₹) *</label>
                      <input
                        type="number"
                        required
                        value={collData.amount}
                        onChange={(e) => setCollData({ ...collData, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Payment Mode</label>
                      <select
                        value={collData.payment_mode}
                        onChange={(e) => setCollData({ ...collData, payment_mode: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="UPI">UPI / GPay / PhonePe</option>
                        <option value="NetBanking">NetBanking / NEFT</option>
                        <option value="Cash">Cash (Receipt Given)</option>
                        <option value="Cheque">Cheque</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Transaction Ref</label>
                      <input
                        type="text"
                        value={collData.transaction_ref}
                        onChange={(e) => setCollData({ ...collData, transaction_ref: e.target.value })}
                        placeholder="UPI-Ref / Cheque #"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-sm"
                  >
                    + Record Collection in Database
                  </button>
                </form>

                {/* Collections Table */}
                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-400 uppercase font-bold sticky top-0">
                      <tr>
                        <th className="p-2">Tower &amp; Flat</th>
                        <th className="p-2">Donor</th>
                        <th className="p-2">Amount</th>
                        <th className="p-2">Mode &amp; Ref</th>
                        <th className="p-2">Date</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {currentCollections.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-500 italic">No collections recorded yet.</td>
                        </tr>
                      ) : (
                        currentCollections.map((col) => (
                          <tr key={col.id} className="hover:bg-slate-800/40">
                            <td className="p-2 font-bold text-white">{col.tower} - {col.flat_no}</td>
                            <td className="p-2">{col.donor_name}</td>
                            <td className="p-2 font-mono font-bold text-emerald-400">₹ {col.amount.toLocaleString("en-IN")}</td>
                            <td className="p-2 font-mono text-[11px] text-slate-400">{col.payment_mode} {col.transaction_ref ? `(${col.transaction_ref})` : ""}</td>
                            <td className="p-2 text-slate-400">{col.collected_date}</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => onDeleteCollection(col.id)}
                                className="text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5 inline" />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 3: EXPENSES & AUDIT APPROVER TRACKER */}
            {detailActiveTab === "expenses" && (
              <div className="space-y-4">
                {/* Add Expense Form */}
                <form onSubmit={handleAddExpenseSubmit} className="p-4 bg-slate-950 rounded-xl border border-rose-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Expense Voucher for Treasurer / MC Audit Approval</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Expense Title / Item *</label>
                      <input
                        type="text"
                        required
                        value={expData.title}
                        onChange={(e) => setExpData({ ...expData, title: e.target.value })}
                        placeholder="e.g. Mandapam Sound System & Mic Rental"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Category *</label>
                      <select
                        value={expData.category}
                        onChange={(e) => setExpData({ ...expData, category: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      >
                        {expenseCategories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Amount (₹) *</label>
                      <input
                        type="number"
                        required
                        value={expData.amount}
                        onChange={(e) => setExpData({ ...expData, amount: parseFloat(e.target.value) || 0 })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white font-mono"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Vendor / Contractor</label>
                      <input
                        type="text"
                        value={expData.vendor_name}
                        onChange={(e) => setExpData({ ...expData, vendor_name: e.target.value })}
                        placeholder="e.g. Sri Balaji Lights"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Bill Date</label>
                      <input
                        type="date"
                        value={expData.bill_date}
                        onChange={(e) => setExpData({ ...expData, bill_date: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Invoice Attachment Proof / Link (Audit)</label>
                      <input
                        type="text"
                        value={expData.invoice_url}
                        onChange={(e) => setExpData({ ...expData, invoice_url: e.target.value })}
                        placeholder="e.g. /invoices/INV_SOUND_2026.pdf"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Designated Approver (MC)</label>
                      <input
                        type="text"
                        value={expData.approver_name}
                        onChange={(e) => setExpData({ ...expData, approver_name: e.target.value })}
                        placeholder="Vikram Patel (Treasurer)"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-lg transition shadow-sm"
                  >
                    + Submit Expense Bill for Audit
                  </button>
                </form>

                {/* Expenses List */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {currentExpenses.length === 0 ? (
                    <p className="text-center text-slate-500 py-4 text-xs italic">No expense bills submitted yet.</p>
                  ) : (
                    currentExpenses.map((exp) => (
                      <div key={exp.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white">{exp.title}</span>
                            <span className="text-[10px] bg-slate-700 text-slate-300 px-1.5 py-0.2 rounded font-semibold">{exp.category}</span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                              exp.approval_status === "Approved" ? "bg-emerald-950 text-emerald-300 border border-emerald-700" :
                              exp.approval_status === "Rejected" ? "bg-rose-950 text-rose-300 border border-rose-700" :
                              "bg-amber-950 text-amber-300 border border-amber-700"
                            }`}>
                              {exp.approval_status}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-1 text-[11px] text-slate-400">
                            <span>Vendor: <strong className="text-slate-300">{exp.vendor_name || "Direct Purchase"}</strong></span>
                            <span>•</span>
                            <span>Approver: <strong className="text-slate-300">{exp.approver_name} ({exp.approver_role || "Treasurer"})</strong></span>
                            {exp.invoice_url && (
                              <>
                                <span>•</span>
                                <a href={exp.invoice_url} target="_blank" rel="noreferrer" className="text-sky-400 hover:underline flex items-center gap-0.5">
                                  <Paperclip className="w-3 h-3" />
                                  <span>Audit Bill Proof</span>
                                </a>
                              </>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 self-end sm:self-center">
                          <span className="font-mono font-bold text-rose-400 text-sm">₹ {exp.amount.toLocaleString("en-IN")}</span>

                          {/* Approve/Reject Controls */}
                          {exp.approval_status !== "Approved" && (
                            <button
                              onClick={() => onUpdateExpenseStatus(exp.id, "Approved", "Vikram Patel (Treasurer)")}
                              className="text-[10px] font-bold bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-700 px-2 py-1 rounded"
                            >
                              Approve
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteExpense(exp.id)}
                            className="text-slate-500 hover:text-rose-400 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}

      {/* Add Festival Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Festival Celebration"
        subtitle="Schedule a community festival, budget, and celebration plan"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateFestival} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Festival Name *</label>
            <input
              type="text"
              required
              value={formData.festival_name}
              onChange={(e) => setFormData({ ...formData, festival_name: e.target.value })}
              placeholder="e.g., Ganesh Chaturthi 5-Day Grand Fest 2026"
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Start Date *</label>
              <input
                type="date"
                required
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Mandapam Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Clubhouse Mandapam"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              >
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline daily pooja schedule, cultural nights, laddu auction..."
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Highlights (comma separated)</label>
            <input
              type="text"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              placeholder="e.g., Maha Laddu Auction, Cultural stage, Food stalls, Dhol-Tasha Visarjan"
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Lead Organizer *</label>
              <input
                type="text"
                required
                value={formData.lead_organizer}
                onChange={(e) => setFormData({ ...formData, lead_organizer: e.target.value })}
                placeholder="e.g., Sanjay Rao"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget</label>
              <input
                type="text"
                value={formData.estimated_budget}
                onChange={(e) => setFormData({ ...formData, estimated_budget: e.target.value })}
                placeholder="e.g., ₹ 3,50,000"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
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
              className="px-5 py-2.5 text-xs font-bold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save Festival"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
