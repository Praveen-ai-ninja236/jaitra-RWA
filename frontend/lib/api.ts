import {
  CulturalEvent,
  CulturalEventCreate,
  CulturalParticipant,
  CulturalParticipantCreate,
  CulturalAgenda,
  CulturalAgendaCreate,
  FestivalCelebration,
  FestivalCelebrationCreate,
  FestivalCollection,
  FestivalCollectionCreate,
  FestivalExpense,
  FestivalExpenseCreate,
  GeneralBodyMeeting,
  GeneralBodyMeetingCreate,
  CommunityIssue,
  CommunityIssueCreate,
  ADOTask,
  ADOTaskCreate,
  ADOComment,
  ADOCommentCreate,
  ADOAttachment,
  ADOAttachmentCreate,
  TeamMember,
  TeamMemberCreate,
  SocietyStats
} from "./types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

async function fetchJSON<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API error (${response.status}): ${errorData || response.statusText}`);
  }

  return response.json();
}

// ----------------- STATS -----------------
export async function getStats(): Promise<SocietyStats> {
  return fetchJSON<SocietyStats>("/api/stats");
}

// ----------------- 1. CULTURAL EVENTS & PARTICIPANTS / AGENDAS -----------------
export async function getCulturalEvents(status?: string, category?: string): Promise<CulturalEvent[]> {
  const params = new URLSearchParams();
  if (status && status !== "All") params.append("status", status);
  if (category && category !== "All") params.append("category", category);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<CulturalEvent[]>(`/api/cultural-events${qs}`);
}

export async function getCulturalEvent(id: number): Promise<CulturalEvent> {
  return fetchJSON<CulturalEvent>(`/api/cultural-events/${id}`);
}

export async function createCulturalEvent(data: CulturalEventCreate): Promise<CulturalEvent> {
  return fetchJSON<CulturalEvent>("/api/cultural-events", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateCulturalEvent(id: number, data: CulturalEventCreate): Promise<CulturalEvent> {
  return fetchJSON<CulturalEvent>(`/api/cultural-events/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteCulturalEvent(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/cultural-events/${id}`, {
    method: "DELETE",
  });
}

export async function addCulturalParticipant(
  eventId: number,
  data: CulturalParticipantCreate
): Promise<CulturalParticipant> {
  return fetchJSON<CulturalParticipant>(`/api/cultural-events/${eventId}/participants`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCulturalParticipant(participantId: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/cultural-events/participants/${participantId}`, {
    method: "DELETE",
  });
}

export async function addCulturalAgenda(
  eventId: number,
  data: CulturalAgendaCreate
): Promise<CulturalAgenda> {
  return fetchJSON<CulturalAgenda>(`/api/cultural-events/${eventId}/agendas`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteCulturalAgenda(agendaId: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/cultural-events/agendas/${agendaId}`, {
    method: "DELETE",
  });
}

// ----------------- 2. FESTIVALS & EXPENSES / COLLECTIONS -----------------
export async function getFestivals(status?: string): Promise<FestivalCelebration[]> {
  const params = new URLSearchParams();
  if (status && status !== "All") params.append("status", status);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<FestivalCelebration[]>(`/api/festivals${qs}`);
}

export async function getFestival(id: number): Promise<FestivalCelebration> {
  return fetchJSON<FestivalCelebration>(`/api/festivals/${id}`);
}

export async function createFestival(data: FestivalCelebrationCreate): Promise<FestivalCelebration> {
  return fetchJSON<FestivalCelebration>("/api/festivals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFestival(id: number, data: FestivalCelebrationCreate): Promise<FestivalCelebration> {
  return fetchJSON<FestivalCelebration>(`/api/festivals/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteFestival(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/festivals/${id}`, {
    method: "DELETE",
  });
}

export async function addFestivalCollection(
  festivalId: number,
  data: FestivalCollectionCreate
): Promise<FestivalCollection> {
  return fetchJSON<FestivalCollection>(`/api/festivals/${festivalId}/collections`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteFestivalCollection(collectionId: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/festivals/collections/${collectionId}`, {
    method: "DELETE",
  });
}

export async function addFestivalExpense(
  festivalId: number,
  data: FestivalExpenseCreate
): Promise<FestivalExpense> {
  return fetchJSON<FestivalExpense>(`/api/festivals/${festivalId}/expenses`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateFestivalExpenseStatus(
  expenseId: number,
  approvalStatus: string,
  approverName?: string
): Promise<FestivalExpense> {
  return fetchJSON<FestivalExpense>(`/api/festivals/expenses/${expenseId}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      approval_status: approvalStatus,
      approver_name: approverName,
    }),
  });
}

export async function deleteFestivalExpense(expenseId: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/festivals/expenses/${expenseId}`, {
    method: "DELETE",
  });
}

// ----------------- 3. GENERAL BODY MEETINGS -----------------
export async function getMeetings(meetingType?: string): Promise<GeneralBodyMeeting[]> {
  const params = new URLSearchParams();
  if (meetingType && meetingType !== "All") params.append("meeting_type", meetingType);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<GeneralBodyMeeting[]>(`/api/meetings${qs}`);
}

export async function createMeeting(data: GeneralBodyMeetingCreate): Promise<GeneralBodyMeeting> {
  return fetchJSON<GeneralBodyMeeting>("/api/meetings", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateMeeting(id: number, data: GeneralBodyMeetingCreate): Promise<GeneralBodyMeeting> {
  return fetchJSON<GeneralBodyMeeting>(`/api/meetings/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteMeeting(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/meetings/${id}`, {
    method: "DELETE",
  });
}

// ----------------- 4. COMMUNITY ISSUES (TOWERS A-F) -----------------
export async function getIssues(
  tower?: string,
  status?: string,
  priority?: string,
  category?: string
): Promise<CommunityIssue[]> {
  const params = new URLSearchParams();
  if (tower && tower !== "All") params.append("tower", tower);
  if (status && status !== "All") params.append("status", status);
  if (priority && priority !== "All") params.append("priority", priority);
  if (category && category !== "All") params.append("category", category);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<CommunityIssue[]>(`/api/issues${qs}`);
}

export async function createIssue(data: CommunityIssueCreate): Promise<CommunityIssue> {
  return fetchJSON<CommunityIssue>("/api/issues", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateIssue(id: number, data: CommunityIssueCreate): Promise<CommunityIssue> {
  return fetchJSON<CommunityIssue>(`/api/issues/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteIssue(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/issues/${id}`, {
    method: "DELETE",
  });
}

// ----------------- 5. ADO TASKS, COMMENTS & ATTACHMENTS -----------------
export async function getADOTasks(assignedTo?: string, entityType?: string, status?: string): Promise<ADOTask[]> {
  const params = new URLSearchParams();
  if (assignedTo && assignedTo !== "All") params.append("assigned_to", assignedTo);
  if (entityType && entityType !== "All") params.append("entity_type", entityType);
  if (status && status !== "All") params.append("status", status);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<ADOTask[]>(`/api/tasks${qs}`);
}

export async function getADOTask(id: number): Promise<ADOTask> {
  return fetchJSON<ADOTask>(`/api/tasks/${id}`);
}

export async function createADOTask(data: ADOTaskCreate): Promise<ADOTask> {
  return fetchJSON<ADOTask>("/api/tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateADOTaskStatus(
  id: number,
  status: string,
  completionPercentage?: number,
  blockers?: string
): Promise<ADOTask> {
  return fetchJSON<ADOTask>(`/api/tasks/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({
      status,
      completion_percentage: completionPercentage,
      blockers,
    }),
  });
}

export async function updateADOTask(id: number, data: ADOTaskCreate): Promise<ADOTask> {
  return fetchJSON<ADOTask>(`/api/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteADOTask(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/tasks/${id}`, {
    method: "DELETE",
  });
}

export async function addADOComment(taskId: number, data: ADOCommentCreate): Promise<ADOComment> {
  return fetchJSON<ADOComment>(`/api/tasks/${taskId}/comments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function addADOAttachment(taskId: number, data: ADOAttachmentCreate): Promise<ADOAttachment> {
  return fetchJSON<ADOAttachment>(`/api/tasks/${taskId}/attachments`, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function deleteADOAttachment(attachmentId: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/tasks/attachments/${attachmentId}`, {
    method: "DELETE",
  });
}

// ----------------- 6. TEAM MEMBERS -----------------
export async function getTeam(status?: string, tower?: string): Promise<TeamMember[]> {
  const params = new URLSearchParams();
  if (status && status !== "All") params.append("status", status);
  if (tower && tower !== "All") params.append("tower", tower);
  const qs = params.toString() ? `?${params.toString()}` : "";
  return fetchJSON<TeamMember[]>(`/api/team${qs}`);
}

export async function addTeamMember(data: TeamMemberCreate): Promise<TeamMember> {
  return fetchJSON<TeamMember>("/api/team", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateTeamMember(id: number, data: TeamMemberCreate): Promise<TeamMember> {
  return fetchJSON<TeamMember>(`/api/team/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteTeamMember(id: number): Promise<{ message: string }> {
  return fetchJSON<{ message: string }>(`/api/team/${id}`, {
    method: "DELETE",
  });
}
