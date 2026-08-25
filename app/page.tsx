"use client";

import React, { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import HeroBanner from "../components/HeroBanner";
import TabNav from "../components/TabNav";
import CulturalEventsTab from "../components/CulturalEventsTab";
import FestivalCelebrationsTab from "../components/FestivalCelebrationsTab";
import GeneralBodyMeetingsTab from "../components/GeneralBodyMeetingsTab";
import IssuesTrackerTab from "../components/IssuesTrackerTab";
import ADOBorderPendingsTab from "../components/ADOBorderPendingsTab";
import TeamListTab from "../components/TeamListTab";
import {
  CulturalEvent,
  CulturalEventCreate,
  CulturalParticipantCreate,
  CulturalAgendaCreate,
  FestivalCelebration,
  FestivalCelebrationCreate,
  FestivalCollectionCreate,
  FestivalExpenseCreate,
  GeneralBodyMeeting,
  GeneralBodyMeetingCreate,
  CommunityIssue,
  CommunityIssueCreate,
  ADOTask,
  ADOTaskCreate,
  ADOCommentCreate,
  ADOAttachmentCreate,
  TeamMember,
  TeamMemberCreate,
  SocietyStats,
} from "../lib/types";
import * as api from "../lib/api";
import {
  Building2,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Shield
} from "lucide-react";

export default function JaitraPortal() {
  const [activeTab, setActiveTab] = useState<string>("ado-board");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Core Data States
  const [stats, setStats] = useState<SocietyStats | null>(null);
  const [culturalEvents, setCulturalEvents] = useState<CulturalEvent[]>([]);
  const [festivals, setFestivals] = useState<FestivalCelebration[]>([]);
  const [meetings, setMeetings] = useState<GeneralBodyMeeting[]>([]);
  const [issues, setIssues] = useState<CommunityIssue[]>([]);
  const [adoTasks, setAdoTasks] = useState<ADOTask[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  // Sync hash from URL if present
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      if (["culture-events", "festivals", "gbm", "issues", "ado-board", "team"].includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      window.location.hash = tabId;
    }
  };

  const fetchAllData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [
        statsData,
        eventsData,
        festivalsData,
        meetingsData,
        issuesData,
        tasksData,
        teamData,
      ] = await Promise.all([
        api.getStats().catch(() => null),
        api.getCulturalEvents().catch(() => []),
        api.getFestivals().catch(() => []),
        api.getMeetings().catch(() => []),
        api.getIssues().catch(() => []),
        api.getADOTasks().catch(() => []),
        api.getTeam().catch(() => []),
      ]);

      if (statsData) setStats(statsData);
      setCulturalEvents(eventsData);
      setFestivals(festivalsData);
      setMeetings(meetingsData);
      setIssues(issuesData);
      setAdoTasks(tasksData);
      setTeamMembers(teamData);
      setIsBackendConnected(true);
    } catch (err) {
      console.warn("Backend fetch failed, running with local state", err);
      setIsBackendConnected(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // 1. Cultural Events Handlers
  const handleAddCulturalEvent = async (eventData: CulturalEventCreate) => {
    try {
      const newEvent = await api.createCulturalEvent(eventData);
      setCulturalEvents([newEvent, ...culturalEvents]);
      showToast("Cultural event scheduled in database!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to create event: " + (err as Error).message, "error");
    }
  };

  const handleUpdateCulturalEvent = async (id: number, eventData: CulturalEventCreate) => {
    try {
      const updated = await api.updateCulturalEvent(id, eventData);
      setCulturalEvents(culturalEvents.map((e) => (e.id === id ? updated : e)));
      showToast("Cultural event details updated!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to update event: " + (err as Error).message, "error");
    }
  };

  const handleDeleteCulturalEvent = async (id: number) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      await api.deleteCulturalEvent(id);
      setCulturalEvents(culturalEvents.filter((e) => e.id !== id));
      showToast("Event removed from database.");
    } catch (err) {
      showToast("Failed to delete event: " + (err as Error).message, "error");
    }
  };

  const handleAddParticipant = async (eventId: number, partData: CulturalParticipantCreate) => {
    try {
      await api.addCulturalParticipant(eventId, partData);
      showToast(`${partData.participant_name} enrolled for ${partData.activity_category}!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to add participant: " + (err as Error).message, "error");
    }
  };

  const handleDeleteParticipant = async (participantId: number) => {
    try {
      await api.deleteCulturalParticipant(participantId);
      showToast("Participant entry removed.");
      fetchAllData();
    } catch (err) {
      showToast("Failed to delete participant: " + (err as Error).message, "error");
    }
  };

  const handleAddAgenda = async (eventId: number, agendaData: CulturalAgendaCreate) => {
    try {
      await api.addCulturalAgenda(eventId, agendaData);
      showToast("Agenda slot added!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to add agenda: " + (err as Error).message, "error");
    }
  };

  const handleDeleteAgenda = async (agendaId: number) => {
    try {
      await api.deleteCulturalAgenda(agendaId);
      showToast("Agenda slot removed.");
      fetchAllData();
    } catch (err) {
      showToast("Failed to delete agenda: " + (err as Error).message, "error");
    }
  };

  // 2. Festival Handlers (Collections, Expenses, Approver)
  const handleAddFestival = async (festData: FestivalCelebrationCreate) => {
    try {
      const newFest = await api.createFestival(festData);
      setFestivals([newFest, ...festivals]);
      showToast("Festival program created in DB!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to save festival: " + (err as Error).message, "error");
    }
  };

  const handleDeleteFestival = async (id: number) => {
    if (!confirm("Are you sure you want to remove this festival celebration?")) return;
    try {
      await api.deleteFestival(id);
      setFestivals(festivals.filter((f) => f.id !== id));
      showToast("Festival record removed.");
    } catch (err) {
      showToast("Failed to delete festival: " + (err as Error).message, "error");
    }
  };

  const handleAddCollection = async (festivalId: number, collData: FestivalCollectionCreate) => {
    try {
      await api.addFestivalCollection(festivalId, collData);
      showToast(`Collection of ₹${collData.amount} recorded for ${collData.tower}-${collData.flat_no}!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to record collection: " + (err as Error).message, "error");
    }
  };

  const handleDeleteCollection = async (collectionId: number) => {
    try {
      await api.deleteFestivalCollection(collectionId);
      showToast("Collection record removed.");
      fetchAllData();
    } catch (err) {
      showToast("Failed to delete collection: " + (err as Error).message, "error");
    }
  };

  const handleAddExpense = async (festivalId: number, expData: FestivalExpenseCreate) => {
    try {
      await api.addFestivalExpense(festivalId, expData);
      showToast(`Expense bill ₹${expData.amount} submitted for audit approval!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to add expense: " + (err as Error).message, "error");
    }
  };

  const handleUpdateExpenseStatus = async (expenseId: number, status: string, approverName?: string) => {
    try {
      await api.updateFestivalExpenseStatus(expenseId, status, approverName);
      showToast(`Expense voucher marked ${status}!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to update expense status: " + (err as Error).message, "error");
    }
  };

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      await api.deleteFestivalExpense(expenseId);
      showToast("Expense entry deleted.");
      fetchAllData();
    } catch (err) {
      showToast("Failed to delete expense: " + (err as Error).message, "error");
    }
  };

  // 3. GBM Meeting Handlers
  const handleAddMeeting = async (meetingData: GeneralBodyMeetingCreate) => {
    try {
      const newM = await api.createMeeting(meetingData);
      setMeetings([newM, ...meetings]);
      showToast("GBM meeting record saved in DB!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to record meeting: " + (err as Error).message, "error");
    }
  };

  const handleUpdateMeeting = async (id: number, meetingData: GeneralBodyMeetingCreate) => {
    try {
      const updated = await api.updateMeeting(id, meetingData);
      setMeetings(meetings.map((m) => (m.id === id ? updated : m)));
      showToast("GBM minutes & resolutions updated!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to update meeting: " + (err as Error).message, "error");
    }
  };

  const handleDeleteMeeting = async (id: number) => {
    if (!confirm("Are you sure you want to remove this meeting record?")) return;
    try {
      await api.deleteMeeting(id);
      setMeetings(meetings.filter((m) => m.id !== id));
      showToast("Meeting record removed.");
    } catch (err) {
      showToast("Failed to delete meeting: " + (err as Error).message, "error");
    }
  };

  // 4. Community Issues Handlers (Tower A-F)
  const handleAddIssue = async (issueData: CommunityIssueCreate) => {
    try {
      const newIssue = await api.createIssue(issueData);
      setIssues([newIssue, ...issues]);
      showToast(`Maintenance issue logged (${newIssue.issue_code || "ISS"}) in ${newIssue.tower}`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to log issue: " + (err as Error).message, "error");
    }
  };

  const handleUpdateIssue = async (id: number, issueData: CommunityIssueCreate) => {
    try {
      const updated = await api.updateIssue(id, issueData);
      setIssues(issues.map((i) => (i.id === id ? updated : i)));
      showToast(`Ticket ${updated.issue_code || id} updated!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to update issue: " + (err as Error).message, "error");
    }
  };

  const handleDeleteIssue = async (id: number) => {
    if (!confirm("Are you sure you want to delete this issue ticket?")) return;
    try {
      await api.deleteIssue(id);
      setIssues(issues.filter((i) => i.id !== id));
      showToast("Issue ticket deleted.");
    } catch (err) {
      showToast("Failed to delete issue: " + (err as Error).message, "error");
    }
  };

  // 5. ADO Tasks Handlers (Comments, Evidence Attachments)
  const handleAddADOTask = async (taskData: ADOTaskCreate) => {
    try {
      const newTask = await api.createADOTask(taskData);
      setAdoTasks([...adoTasks, newTask]);
      showToast(`Work item ${newTask.task_code || "ADO"} added to board!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to create ADO task: " + (err as Error).message, "error");
    }
  };

  const handleUpdateADOTask = async (id: number, taskData: ADOTaskCreate) => {
    try {
      const updated = await api.updateADOTask(id, taskData);
      setAdoTasks(adoTasks.map((t) => (t.id === id ? updated : t)));
      showToast(`ADO deliverable ${updated.task_code} updated!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to update ADO task: " + (err as Error).message, "error");
    }
  };

  const handleUpdateADOTaskStatus = async (
    id: number,
    status: string,
    progress?: number,
    blockers?: string
  ) => {
    try {
      const updated = await api.updateADOTaskStatus(id, status, progress, blockers);
      setAdoTasks(adoTasks.map((t) => (t.id === id ? updated : t)));
      showToast(`Work item ${updated.task_code} moved to ${status}`);
    } catch (err) {
      showToast("Failed to update ADO task: " + (err as Error).message, "error");
    }
  };

  const handleDeleteADOTask = async (id: number) => {
    if (!confirm("Are you sure you want to remove this ADO deliverable?")) return;
    try {
      await api.deleteADOTask(id);
      setAdoTasks(adoTasks.filter((t) => t.id !== id));
      showToast("ADO work item removed.");
    } catch (err) {
      showToast("Failed to delete task: " + (err as Error).message, "error");
    }
  };

  const handleAddADOComment = async (taskId: number, commentData: ADOCommentCreate) => {
    try {
      await api.addADOComment(taskId, commentData);
      showToast("Discussion update posted to work item!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to add comment: " + (err as Error).message, "error");
    }
  };

  const handleAddADOAttachment = async (taskId: number, attData: ADOAttachmentCreate) => {
    try {
      await api.addADOAttachment(taskId, attData);
      showToast("Evidence proof attached to work item!");
      fetchAllData();
    } catch (err) {
      showToast("Failed to attach evidence: " + (err as Error).message, "error");
    }
  };

  const handleDeleteADOAttachment = async (attachmentId: number) => {
    try {
      await api.deleteADOAttachment(attachmentId);
      showToast("Evidence attachment removed.");
      fetchAllData();
    } catch (err) {
      showToast("Failed to delete attachment: " + (err as Error).message, "error");
    }
  };

  // 6. Team Member Handlers
  const handleAddTeamMember = async (memberData: TeamMemberCreate) => {
    try {
      const newMember = await api.addTeamMember(memberData);
      setTeamMembers([...teamMembers, newMember]);
      showToast(`${newMember.name} added to Jaitra Association committee!`);
      fetchAllData();
    } catch (err) {
      showToast("Failed to add member: " + (err as Error).message, "error");
    }
  };

  const handleDeleteTeamMember = async (id: number) => {
    if (!confirm("Are you sure you want to remove this committee member?")) return;
    try {
      await api.deleteTeamMember(id);
      setTeamMembers(teamMembers.filter((m) => m.id !== id));
      showToast("Member removed from committee directory.");
    } catch (err) {
      showToast("Failed to delete member: " + (err as Error).message, "error");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      {/* Top Navbar */}
      <Navbar
        isBackendConnected={isBackendConnected}
        onRefresh={fetchAllData}
        isLoading={isLoading}
      />

      {/* Hero Header Banner with Stats */}
      <HeroBanner stats={stats} onSelectTab={handleTabChange} />

      {/* Sticky Tabs Navigation */}
      <TabNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        badgeCounts={{
          events: culturalEvents.length,
          festivals: festivals.length,
          meetings: meetings.length,
          issues: issues.filter((i) => i.status !== "Resolved" && i.status !== "Closed").length,
          adoTasks: adoTasks.filter((t) => t.status !== "Closed").length,
          team: teamMembers.length,
        }}
      />

      {/* Main Tab Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "culture-events" && (
          <CulturalEventsTab
            events={culturalEvents}
            onAddEvent={handleAddCulturalEvent}
            onUpdateEvent={handleUpdateCulturalEvent}
            onDeleteEvent={handleDeleteCulturalEvent}
            onAddParticipant={handleAddParticipant}
            onDeleteParticipant={handleDeleteParticipant}
            onAddAgenda={handleAddAgenda}
            onDeleteAgenda={handleDeleteAgenda}
            isLoading={isLoading}
          />
        )}

        {activeTab === "festivals" && (
          <FestivalCelebrationsTab
            festivals={festivals}
            onAddFestival={handleAddFestival}
            onDeleteFestival={handleDeleteFestival}
            onAddCollection={handleAddCollection}
            onDeleteCollection={handleDeleteCollection}
            onAddExpense={handleAddExpense}
            onUpdateExpenseStatus={handleUpdateExpenseStatus}
            onDeleteExpense={handleDeleteExpense}
            isLoading={isLoading}
          />
        )}

        {activeTab === "gbm" && (
          <GeneralBodyMeetingsTab
            meetings={meetings}
            onAddMeeting={handleAddMeeting}
            onUpdateMeeting={handleUpdateMeeting}
            onDeleteMeeting={handleDeleteMeeting}
            isLoading={isLoading}
          />
        )}

        {activeTab === "issues" && (
          <IssuesTrackerTab
            issues={issues}
            onAddIssue={handleAddIssue}
            onUpdateIssue={handleUpdateIssue}
            onDeleteIssue={handleDeleteIssue}
            isLoading={isLoading}
          />
        )}

        {activeTab === "ado-board" && (
          <ADOBorderPendingsTab
            tasks={adoTasks}
            onAddTask={handleAddADOTask}
            onUpdateTask={handleUpdateADOTask}
            onUpdateStatus={handleUpdateADOTaskStatus}
            onDeleteTask={handleDeleteADOTask}
            onAddComment={handleAddADOComment}
            onAddAttachment={handleAddADOAttachment}
            onDeleteAttachment={handleDeleteADOAttachment}
            isLoading={isLoading}
          />
        )}

        {activeTab === "team" && (
          <TeamListTab
            team={teamMembers}
            onAddMember={handleAddTeamMember}
            onDeleteMember={handleDeleteTeamMember}
            isLoading={isLoading}
          />
        )}
      </main>

      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold backdrop-blur-md ${
              notification.type === "success"
                ? "bg-slate-900/95 text-white border-emerald-500/50 shadow-emerald-500/10"
                : "bg-rose-950/95 text-white border-rose-500 shadow-rose-500/20"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle className="w-4 h-4 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400" />
            )}
            <span>{notification.message}</span>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 mt-12 py-8 px-4 sm:px-6 lg:px-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-sky-400" />
            <span className="font-extrabold text-slate-200">Jaitra Residents Welfare Association</span>
            <span>•</span>
            <span className="text-slate-400">Towers A, B, C, D, E, F</span>
          </div>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Mail className="w-3.5 h-3.5 text-sky-400" />
              <span>support@jaitra.org</span>
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Estate Office: 040-2345-8811</span>
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Powered by Next.js 14, React, TypeScript &amp; Python FastAPI PostgreSQL Database
          </p>
        </div>
      </footer>
    </div>
  );
}
