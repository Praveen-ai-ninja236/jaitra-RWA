"use client";

import React, { useState } from "react";
import {
  CulturalEvent,
  CulturalEventCreate,
  CulturalParticipantCreate,
  CulturalAgendaCreate
} from "../lib/types";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Plus,
  Search,
  Filter,
  Users,
  Trophy,
  CheckCircle2,
  Trash2,
  IndianRupee,
  Sparkles,
  Ticket,
  Mic,
  Music,
  Tv,
  Edit3,
  ListOrdered,
  UserPlus,
  ChevronRight
} from "lucide-react";
import Modal from "./Modal";

interface CulturalEventsTabProps {
  events: CulturalEvent[];
  onAddEvent: (event: CulturalEventCreate) => Promise<void>;
  onUpdateEvent: (id: number, event: CulturalEventCreate) => Promise<void>;
  onDeleteEvent: (id: number) => Promise<void>;
  onAddParticipant: (eventId: number, part: CulturalParticipantCreate) => Promise<void>;
  onDeleteParticipant: (participantId: number) => Promise<void>;
  onAddAgenda: (eventId: number, agenda: CulturalAgendaCreate) => Promise<void>;
  onDeleteAgenda: (agendaId: number) => Promise<void>;
  isLoading: boolean;
}

export default function CulturalEventsTab({
  events,
  onAddEvent,
  onUpdateEvent,
  onDeleteEvent,
  onAddParticipant,
  onDeleteParticipant,
  onAddAgenda,
  onDeleteAgenda,
  isLoading,
}: CulturalEventsTabProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeEventDetail, setActiveEventDetail] = useState<CulturalEvent | null>(null);
  const [detailTab, setDetailTab] = useState<"details" | "participants" | "agenda">("participants");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // New Event Form State
  const [formData, setFormData] = useState<CulturalEventCreate>({
    title: "",
    category: "Sports",
    event_date: "",
    time: "",
    venue: "Clubhouse Indoor Arena",
    description: "",
    coordinator: "",
    coordinator_contact: "",
    status: "Upcoming",
    registered_count: 0,
    budget: "₹ 25,000",
  });

  // Participant Form State
  const [partData, setPartData] = useState<CulturalParticipantCreate>({
    tower: "Tower A",
    flat_no: "201",
    participant_name: "",
    age_group: "Adult (25-50)",
    activity_category: "Badminton Singles",
    contact_no: "",
    notes: "",
    registration_date: new Date().toISOString().split("T")[0],
  });

  // Agenda Form State
  const [agendaData, setAgendaData] = useState<CulturalAgendaCreate>({
    slot_time: "06:00 PM - 06:30 PM",
    performer_or_speaker: "",
    activity_topic: "",
    stage_coordinator: "",
    duration_mins: 30,
  });

  const categories = ["All", "Sports", "Music & Performing Arts", "Kids Workshop", "Health & Wellness", "Cultural & Arts"];
  const statuses = ["All", "Upcoming", "Ongoing", "Completed"];
  const towers = ["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F"];
  const activityCategories = [
    "Badminton Singles",
    "Badminton Doubles",
    "Cricket League",
    "Singing / Classical Vocal",
    "Solo Dance Performance",
    "Group Dance (Folk/Bollywood)",
    "Kids Drawing / Pottery",
    "Chess & Indoor Games",
    "Drama / Skit",
    "Speaker / Keynote Address",
    "Yoga & Wellness Demo"
  ];

  const filteredEvents = events.filter((ev) => {
    const matchSearch =
      ev.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.coordinator.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ev.venue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory === "All" || ev.category.toLowerCase().includes(selectedCategory.toLowerCase());
    const matchStatus = selectedStatus === "All" || ev.status === selectedStatus;
    return matchSearch && matchCategory && matchStatus;
  });

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.event_date || !formData.coordinator) return;
    setIsSubmitting(true);
    try {
      await onAddEvent(formData);
      setIsAddModalOpen(false);
      setFormData({
        title: "",
        category: "Sports",
        event_date: "",
        time: "",
        venue: "Clubhouse Indoor Arena",
        description: "",
        coordinator: "",
        coordinator_contact: "",
        status: "Upcoming",
        registered_count: 0,
        budget: "₹ 25,000",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEventDetail) return;
    try {
      await onUpdateEvent(activeEventDetail.id, {
        title: activeEventDetail.title,
        category: activeEventDetail.category,
        event_date: activeEventDetail.event_date,
        time: activeEventDetail.time,
        venue: activeEventDetail.venue,
        description: activeEventDetail.description,
        coordinator: activeEventDetail.coordinator,
        coordinator_contact: activeEventDetail.coordinator_contact,
        status: activeEventDetail.status,
        registered_count: activeEventDetail.registered_count,
        budget: activeEventDetail.budget,
      });
      alert("Event details updated successfully!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddParticipantSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEventDetail || !partData.participant_name) return;
    try {
      await onAddParticipant(activeEventDetail.id, partData);
      setPartData({
        tower: "Tower A",
        flat_no: "201",
        participant_name: "",
        age_group: "Adult (25-50)",
        activity_category: "Badminton Singles",
        contact_no: "",
        notes: "",
        registration_date: new Date().toISOString().split("T")[0],
      });
      const updated = events.find(ev => ev.id === activeEventDetail.id);
      if (updated) setActiveEventDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddAgendaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEventDetail || !agendaData.performer_or_speaker || !agendaData.activity_topic) return;
    try {
      await onAddAgenda(activeEventDetail.id, agendaData);
      setAgendaData({
        slot_time: "06:00 PM - 06:30 PM",
        performer_or_speaker: "",
        activity_topic: "",
        stage_coordinator: "",
        duration_mins: 30,
      });
      const updated = events.find(ev => ev.id === activeEventDetail.id);
      if (updated) setActiveEventDetail(updated);
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryGradient = (cat: string) => {
    if (cat.includes("Sports")) return "from-emerald-950/60 to-slate-900 border-emerald-500/30";
    if (cat.includes("Music") || cat.includes("Arts")) return "from-indigo-950/60 to-slate-900 border-indigo-500/30";
    if (cat.includes("Kids") || cat.includes("Workshop")) return "from-sky-950/60 to-slate-900 border-sky-500/30";
    return "from-purple-950/60 to-slate-900 border-purple-500/30";
  };

  const currentParticipants = activeEventDetail?.participants || [];
  const currentAgendas = activeEventDetail?.agendas || [];

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="bg-slate-900/90 border border-slate-800 p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]" />
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">1. Cultural &amp; Sports Events</h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Participant lists, sports tournaments, singing/dancing schedules, and speaker agendas across Towers A-F.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl shadow-lg shadow-indigo-500/20 transition transform active:scale-95 hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Event</span>
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
            placeholder="Search events, coordinators, venues..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 bg-slate-800/80 text-white placeholder-slate-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-xs">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-400 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent font-bold text-white focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">{c}</option>
              ))}
            </select>
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
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="bg-slate-900/60 rounded-2xl p-12 text-center border border-slate-800 shadow-md">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-300">No cultural events found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click &quot;Schedule New Event&quot; above to create a new event program.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEvents.map((event) => {
            const parts = event.participants || [];
            const agendas = event.agendas || [];

            return (
              <div
                key={event.id}
                className={`bg-gradient-to-br ${getCategoryGradient(
                  event.category
                )} rounded-2xl p-6 border shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col justify-between group`}
              >
                <div>
                  {/* Badges row */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      {event.category}
                    </span>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          event.status === "Upcoming"
                            ? "bg-emerald-950/80 text-emerald-300 border-emerald-600/60"
                            : event.status === "Ongoing"
                            ? "bg-amber-950/80 text-amber-300 border-amber-600/60 animate-pulse"
                            : "bg-slate-800 text-slate-400 border-slate-700"
                        }`}
                      >
                        {event.status}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteEvent(event.id);
                        }}
                        title="Delete Event"
                        className="text-slate-500 hover:text-rose-400 p-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3
                    onClick={() => {
                      setActiveEventDetail(event);
                      setDetailTab("participants");
                    }}
                    className="text-lg sm:text-xl font-extrabold text-white leading-snug cursor-pointer group-hover:text-indigo-200 transition flex items-center justify-between"
                  >
                    <span>{event.title}</span>
                    <ChevronRight className="w-5 h-5 text-indigo-400 opacity-80 group-hover:translate-x-1 transition" />
                  </h3>
                  <p className="text-xs text-slate-300 mt-2.5 leading-relaxed font-normal">{event.description}</p>

                  {/* Schedule Details */}
                  <div className="grid grid-cols-2 gap-2.5 mt-4 p-3.5 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{event.event_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-semibold">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300 font-semibold col-span-2">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Coordinator & Budget */}
                  <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 pt-2.5 border-t border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                      <span>Coord: <strong className="text-slate-200">{event.coordinator}</strong></span>
                    </div>
                    {event.budget && (
                      <div className="flex items-center gap-1 text-slate-200 font-mono text-[11px] font-bold bg-slate-800/90 border border-slate-700 px-2 py-0.5 rounded">
                        <IndianRupee className="w-3 h-3 text-slate-400" />
                        <span>{event.budget.replace("₹", "").trim()}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Registration & View Details */}
                <div className="mt-5 pt-3.5 border-t border-slate-800 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span className="font-extrabold text-white text-sm">{parts.length || event.registered_count}</span>
                    <span className="text-slate-400 text-[11px]">Enrolled Participants</span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveEventDetail(event);
                      setDetailTab("participants");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-300 hover:text-white bg-indigo-500/20 hover:bg-indigo-500/30 px-3.5 py-1.5 rounded-xl border border-indigo-400/40 transition shadow-sm"
                  >
                    <UserPlus className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View / Manage Participants</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cultural Event Detailed View & Edit Modal */}
      {activeEventDetail && (
        <Modal
          isOpen={Boolean(activeEventDetail)}
          onClose={() => setActiveEventDetail(null)}
          title={`${activeEventDetail.title} — Event Manager`}
          subtitle="View / Edit Details, Tower-wise Participants & Speaker Agendas"
          maxWidth="2xl"
        >
          <div className="space-y-5">
            {/* Modal Top Sub-Tabs */}
            <div className="flex space-x-2 border-b border-slate-800 pb-2">
              <button
                onClick={() => setDetailTab("participants")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  detailTab === "participants"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                <Users className="w-3.5 h-3.5" />
                <span>Participants ({currentParticipants.length})</span>
              </button>

              <button
                onClick={() => setDetailTab("agenda")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  detailTab === "agenda"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                <ListOrdered className="w-3.5 h-3.5" />
                <span>Agenda &amp; Timeline ({currentAgendas.length})</span>
              </button>

              <button
                onClick={() => setDetailTab("details")}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition flex items-center gap-1.5 ${
                  detailTab === "details"
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:text-white bg-slate-800"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Event Details</span>
              </button>
            </div>

            {/* TAB 1: PARTICIPANTS LIST & ADD FORM */}
            {detailTab === "participants" && (
              <div className="space-y-4">
                {/* Add Participant Form */}
                <form onSubmit={handleAddParticipantSubmit} className="p-4 bg-slate-950 rounded-xl border border-indigo-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Register Participant by Tower &amp; Activity</span>
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Tower *</label>
                      <select
                        value={partData.tower}
                        onChange={(e) => setPartData({ ...partData, tower: e.target.value })}
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
                        value={partData.flat_no}
                        onChange={(e) => setPartData({ ...partData, flat_no: e.target.value })}
                        placeholder="e.g. 502"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Participant Name *</label>
                      <input
                        type="text"
                        required
                        value={partData.participant_name}
                        onChange={(e) => setPartData({ ...partData, participant_name: e.target.value })}
                        placeholder="e.g. Ananya Sen / Arjun"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Age Category</label>
                      <select
                        value={partData.age_group}
                        onChange={(e) => setPartData({ ...partData, age_group: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      >
                        <option value="Junior (<14)">Junior (&lt;14 yrs)</option>
                        <option value="Youth (14-25)">Youth (14-25 yrs)</option>
                        <option value="Adult (25-50)">Adult (25-50 yrs)</option>
                        <option value="Senior (50+)">Senior (50+ yrs)</option>
                      </select>
                    </div>

                    <div className="col-span-2">
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Participating For Activity *</label>
                      <select
                        value={partData.activity_category}
                        onChange={(e) => setPartData({ ...partData, activity_category: e.target.value })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      >
                        {activityCategories.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Contact Phone</label>
                      <input
                        type="text"
                        value={partData.contact_no}
                        onChange={(e) => setPartData({ ...partData, contact_no: e.target.value })}
                        placeholder="+91 98450 11223"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Special Notes / Seed</label>
                      <input
                        type="text"
                        value={partData.notes}
                        onChange={(e) => setPartData({ ...partData, notes: e.target.value })}
                        placeholder="Song track provided / Doubles partner"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-sm"
                  >
                    + Add Participant to Database
                  </button>
                </form>

                {/* Participants Table */}
                <div className="overflow-x-auto max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-400 uppercase font-bold sticky top-0">
                      <tr>
                        <th className="p-2">Tower &amp; Flat</th>
                        <th className="p-2">Participant Name</th>
                        <th className="p-2">Age</th>
                        <th className="p-2">Activity / Category</th>
                        <th className="p-2">Contact</th>
                        <th className="p-2 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 text-slate-300">
                      {currentParticipants.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-slate-500 italic">No registered participants yet.</td>
                        </tr>
                      ) : (
                        currentParticipants.map((p) => (
                          <tr key={p.id} className="hover:bg-slate-800/40">
                            <td className="p-2 font-bold text-white">{p.tower} - {p.flat_no}</td>
                            <td className="p-2 font-semibold text-slate-200">{p.participant_name}</td>
                            <td className="p-2 text-slate-400">{p.age_group}</td>
                            <td className="p-2">
                              <span className="bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                                {p.activity_category}
                              </span>
                            </td>
                            <td className="p-2 font-mono text-slate-400">{p.contact_no || "—"}</td>
                            <td className="p-2 text-right">
                              <button
                                onClick={() => onDeleteParticipant(p.id)}
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

            {/* TAB 2: AGENDAS & SPEAKER TIMELINES */}
            {detailTab === "agenda" && (
              <div className="space-y-4">
                {/* Add Agenda Slot Form */}
                <form onSubmit={handleAddAgendaSubmit} className="p-4 bg-slate-950 rounded-xl border border-indigo-900/50 space-y-3">
                  <h4 className="text-xs font-bold text-indigo-300 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Speaker / Performance Timeline Slot</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Time Slot *</label>
                      <input
                        type="text"
                        required
                        value={agendaData.slot_time}
                        onChange={(e) => setAgendaData({ ...agendaData, slot_time: e.target.value })}
                        placeholder="e.g. 06:30 PM - 07:00 PM"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Performer / Speaker *</label>
                      <input
                        type="text"
                        required
                        value={agendaData.performer_or_speaker}
                        onChange={(e) => setAgendaData({ ...agendaData, performer_or_speaker: e.target.value })}
                        placeholder="e.g. Tower C Classical Group"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Activity / Topic *</label>
                      <input
                        type="text"
                        required
                        value={agendaData.activity_topic}
                        onChange={(e) => setAgendaData({ ...agendaData, activity_topic: e.target.value })}
                        placeholder="e.g. Carnatic Vocal Medley"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Stage Coordinator</label>
                      <input
                        type="text"
                        value={agendaData.stage_coordinator}
                        onChange={(e) => setAgendaData({ ...agendaData, stage_coordinator: e.target.value })}
                        placeholder="e.g. Radhika Nambiar"
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-400 mb-1">Duration (Mins)</label>
                      <input
                        type="number"
                        value={agendaData.duration_mins}
                        onChange={(e) => setAgendaData({ ...agendaData, duration_mins: parseInt(e.target.value) || 30 })}
                        className="w-full text-xs p-2 rounded bg-slate-800 border border-slate-700 text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg transition shadow-sm"
                  >
                    + Add Agenda Timeline Slot
                  </button>
                </form>

                {/* Agenda Timeline Cards */}
                <div className="space-y-2.5 max-h-64 overflow-y-auto">
                  {currentAgendas.length === 0 ? (
                    <p className="text-center text-slate-500 py-4 text-xs italic">No timeline slots entered yet.</p>
                  ) : (
                    currentAgendas.map((ag) => (
                      <div key={ag.id} className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-3">
                          <div className="bg-indigo-950 text-indigo-300 font-mono font-bold px-2.5 py-1 rounded-lg border border-indigo-800 text-[11px]">
                            {ag.slot_time}
                          </div>
                          <div>
                            <p className="font-bold text-white">{ag.activity_topic}</p>
                            <p className="text-slate-400 text-[11px]">Performer/Speaker: <strong className="text-slate-200">{ag.performer_or_speaker}</strong> {ag.stage_coordinator ? `(Stage: ${ag.stage_coordinator})` : ""}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => onDeleteAgenda(ag.id)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: EDIT EVENT DETAILS */}
            {detailTab === "details" && (
              <form onSubmit={handleUpdateEventSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={activeEventDetail.title}
                    onChange={(e) => setActiveEventDetail({ ...activeEventDetail, title: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Category</label>
                    <select
                      value={activeEventDetail.category}
                      onChange={(e) => setActiveEventDetail({ ...activeEventDetail, category: e.target.value })}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    >
                      {categories.filter(c => c !== "All").map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Status</label>
                    <select
                      value={activeEventDetail.status}
                      onChange={(e) => setActiveEventDetail({ ...activeEventDetail, status: e.target.value })}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Date</label>
                    <input
                      type="date"
                      value={activeEventDetail.event_date}
                      onChange={(e) => setActiveEventDetail({ ...activeEventDetail, event_date: e.target.value })}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 font-semibold mb-1">Time</label>
                    <input
                      type="text"
                      value={activeEventDetail.time}
                      onChange={(e) => setActiveEventDetail({ ...activeEventDetail, time: e.target.value })}
                      className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Venue</label>
                  <input
                    type="text"
                    value={activeEventDetail.venue}
                    onChange={(e) => setActiveEventDetail({ ...activeEventDetail, venue: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-400 font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={activeEventDetail.description || ""}
                    onChange={(e) => setActiveEventDetail({ ...activeEventDetail, description: e.target.value })}
                    className="w-full p-2 rounded bg-slate-800 border border-slate-700 text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition"
                >
                  Save Changes to Database
                </button>
              </form>
            )}
          </div>
        </Modal>
      )}

      {/* Add Event Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Cultural / Sports Event"
        subtitle="Fill in event details to publish to society calendar"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateEvent} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Event Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Jaitra Table Tennis & Badminton Tournament"
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Category *</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Sports">Sports</option>
                <option value="Kids Workshop">Kids Workshop</option>
                <option value="Music & Performing Arts">Music & Performing Arts</option>
                <option value="Health & Wellness">Health & Wellness</option>
                <option value="Cultural & Arts">Cultural & Arts</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Event Date *</label>
              <input
                type="date"
                required
                value={formData.event_date}
                onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Timing *</label>
              <input
                type="text"
                required
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                placeholder="e.g., 07:00 AM - 01:00 PM"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Venue Location *</label>
            <input
              type="text"
              required
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="e.g., Clubhouse Multipurpose Studio / Sports Turf"
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Description &amp; Highlights</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Provide event details, age eligibility, registration guidelines..."
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Coordinator Name *</label>
              <input
                type="text"
                required
                value={formData.coordinator}
                onChange={(e) => setFormData({ ...formData, coordinator: e.target.value })}
                placeholder="e.g., Vivek Murthy"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Coordinator Contact</label>
              <input
                type="text"
                value={formData.coordinator_contact}
                onChange={(e) => setFormData({ ...formData, coordinator_contact: e.target.value })}
                placeholder="e.g., +91 98450 11223"
                className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget</label>
            <input
              type="text"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="e.g., ₹ 35,000"
              className="w-full text-xs p-2.5 border rounded-lg bg-slate-800 border-slate-700 text-white focus:outline-none focus:border-indigo-500"
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
              className="px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Create Event"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
