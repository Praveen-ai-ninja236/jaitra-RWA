export interface FestivalCollection {
  id: number;
  festival_id: number;
  tower: string;
  flat_no: string;
  donor_name: string;
  amount: number;
  payment_mode: string;
  transaction_ref?: string;
  collected_date: string;
  receipt_url?: string;
  notes?: string;
}

export type FestivalCollectionCreate = Omit<FestivalCollection, "id" | "festival_id">;

export interface FestivalExpense {
  id: number;
  festival_id: number;
  title: string;
  category: string;
  amount: number;
  vendor_name?: string;
  bill_date: string;
  invoice_url?: string;
  audit_evidence_notes?: string;
  approver_name: string;
  approver_role?: string;
  approval_status: "Approved" | "Pending" | "Rejected" | string;
}

export type FestivalExpenseCreate = Omit<FestivalExpense, "id" | "festival_id">;

export interface FestivalCelebration {
  id: number;
  festival_name: string;
  start_date: string;
  end_date: string;
  location: string;
  description?: string;
  lead_organizer: string;
  estimated_budget?: string;
  collected_funds?: string;
  status: "Planning" | "Active" | "Completed" | string;
  highlights?: string;
  collections?: FestivalCollection[];
  expenses?: FestivalExpense[];
}

export type FestivalCelebrationCreate = Omit<FestivalCelebration, "id" | "collections" | "expenses">;


export interface CulturalParticipant {
  id: number;
  event_id: number;
  tower: string;
  flat_no: string;
  participant_name: string;
  age_group: string;
  activity_category: string; // Singing, Solo Dance, Group Dance, Games / Sports, Kids Workshop, Speaker / Debate, Drama
  contact_no?: string;
  notes?: string;
  registration_date: string;
}

export type CulturalParticipantCreate = Omit<CulturalParticipant, "id" | "event_id">;

export interface CulturalAgenda {
  id: number;
  event_id: number;
  slot_time: string;
  performer_or_speaker: string;
  activity_topic: string;
  stage_coordinator?: string;
  duration_mins: number;
}

export type CulturalAgendaCreate = Omit<CulturalAgenda, "id" | "event_id">;

export interface CulturalEvent {
  id: number;
  title: string;
  category: string;
  event_date: string;
  time: string;
  venue: string;
  description?: string;
  coordinator: string;
  coordinator_contact?: string;
  status: "Upcoming" | "Ongoing" | "Completed" | "Planning" | string;
  registered_count: number;
  budget?: string;
  participants?: CulturalParticipant[];
  agendas?: CulturalAgenda[];
}

export type CulturalEventCreate = Omit<CulturalEvent, "id" | "participants" | "agendas">;


export interface GeneralBodyMeeting {
  id: number;
  meeting_title: string;
  meeting_type: "AGM" | "EGM" | "Quarterly GBM" | "Special Committee" | string;
  meeting_date: string;
  time: string;
  venue: string;
  quorum_status: string;
  key_agenda?: string;
  resolutions_passed?: string;
  minutes_summary?: string;
  attendees_count: number;
  doc_link?: string;
}

export type GeneralBodyMeetingCreate = Omit<GeneralBodyMeeting, "id">;


export interface CommunityIssue {
  id: number;
  issue_code?: string;
  tower: "Tower A" | "Tower B" | "Tower C" | "Tower D" | "Tower E" | "Tower F" | "Clubhouse" | "Common Space" | string;
  flat_no?: string;
  flat_or_location: string;
  title: string;
  category: string;
  reported_by: string;
  priority: "Critical" | "High" | "Medium" | "Low" | string;
  status: "Open" | "In Progress" | "Under Inspection" | "Resolved" | "Closed" | string;
  assigned_to: string;
  created_at: string;
  description?: string;
  resolution_notes?: string;
}

export type CommunityIssueCreate = Omit<CommunityIssue, "id">;


export interface ADOComment {
  id: number;
  task_id: number;
  author_name: string;
  author_role: string;
  comment_text: string;
  created_at?: string;
}

export type ADOCommentCreate = Omit<ADOComment, "id" | "task_id">;

export interface ADOAttachment {
  id: number;
  task_id: number;
  file_name: string;
  file_url: string;
  description?: string;
  uploaded_by: string;
  created_at?: string;
}

export type ADOAttachmentCreate = Omit<ADOAttachment, "id" | "task_id">;

export interface ADOTask {
  id: number;
  task_code: string;
  title: string;
  assigned_to: "Builder" | "IGS" | "Association" | "Joint Taskforce" | string;
  entity_type: "Builder" | "IGS" | string;
  category: string;
  status: "New" | "Active" | "Resolved" | "Closed" | string;
  priority: "Critical" | "High" | "Medium" | "Low" | string;
  assignee_name?: string;
  due_date?: string;
  sla_days: number;
  blockers?: string;
  description?: string;
  completion_percentage: number;
  tags?: string;
  comments?: ADOComment[];
  attachments?: ADOAttachment[];
}

export type ADOTaskCreate = Omit<ADOTask, "id" | "comments" | "attachments">;


export interface TeamMember {
  id: number;
  name: string;
  role: string;
  wing_flat?: string;
  tower?: string;
  contact: string;
  email?: string;
  term?: string;
  sub_committee?: string;
  status?: "Active" | "Emeritus" | "Ex-Officio" | string;
}

export type TeamMemberCreate = Omit<TeamMember, "id">;


export interface SocietyStats {
  cultural_events_count: number;
  festivals_count: number;
  meetings_count: number;
  total_issues: number;
  open_issues_count: number;
  total_ado_tasks: number;
  builder_tasks_count: number;
  igs_tasks_count: number;
  active_ado_tasks: number;
  resolved_ado_tasks: number;
  team_members_count: number;
  tower_issue_counts?: Record<string, number>;
  society_name: string;
  total_towers: number;
}
