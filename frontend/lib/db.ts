import { neon, Pool } from "@neondatabase/serverless";
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
  SocietyStats,
} from "./types";

// Check for Neon Database URL in environment
const neonDbUrl =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.NEON_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL;

let sqlNeon: any = null;
if (neonDbUrl) {
  try {
    sqlNeon = neon(neonDbUrl);
    console.log("Connected to Neon PostgreSQL Serverless DB");
  } catch (e) {
    console.warn("Could not initialize Neon client, using fallback store", e);
  }
}

// ----------------- IN-MEMORY FALLBACK STORE -----------------
let festivalsStore: FestivalCelebration[] = [
  {
    id: 1,
    festival_name: "Ganesh Chaturthi Utsav 2026 (5-Day Grand Fest)",
    start_date: "2026-09-15",
    end_date: "2026-09-19",
    location: "Clubhouse Central Mandapam",
    description: "Eco-friendly clay Ganesha Sthapana, daily morning/evening Aarti, devotional Bhajans, cultural dance nights, Kids fancy dress, and the prestigious Maha Laddu Auction followed by Visarjan procession.",
    lead_organizer: "Sanjay Rao (Festival Convener)",
    estimated_budget: "₹ 3,50,000",
    collected_funds: "₹ 2,90,000",
    status: "Active",
    highlights: "Clay Idol Sthapana, Daily Maha-Prasadam, 15+ Kids Stage Acts, 21kg Laddu Auction, Dhol-Tasha Visarjan",
    collections: [
      { id: 1, festival_id: 1, tower: "Tower A", flat_no: "301", donor_name: "K. Venkat Rao", amount: 5000, payment_mode: "UPI", transaction_ref: "UPI/623490123/HDFC", collected_date: "2026-08-15", receipt_url: "/receipts/REC_GANESH_01.pdf", notes: "Festival voluntary seva" },
      { id: 2, festival_id: 1, tower: "Tower B", flat_no: "504", donor_name: "M. Srinivas", amount: 11000, payment_mode: "NetBanking", transaction_ref: "NEFT/ICIC20260816", collected_date: "2026-08-16", receipt_url: "/receipts/REC_GANESH_02.pdf", notes: "Prasadam sponsorship" },
      { id: 3, festival_id: 1, tower: "Tower C", flat_no: "1102", donor_name: "Ramesh Chandra", amount: 25000, payment_mode: "UPI", transaction_ref: "UPI/623490987/SBI", collected_date: "2026-08-18", receipt_url: "/receipts/REC_GANESH_03.pdf", notes: "Maha Laddu Auction pledge" },
      { id: 4, festival_id: 1, tower: "Tower D", flat_no: "204", donor_name: "S. Narayanan", amount: 3500, payment_mode: "UPI", transaction_ref: "UPI/623491112/AXIS", collected_date: "2026-08-20", receipt_url: "/receipts/REC_GANESH_04.pdf", notes: "Resident contribution" },
      { id: 5, festival_id: 1, tower: "Tower E", flat_no: "702", donor_name: "P. Kulkarni", amount: 4000, payment_mode: "Cash", transaction_ref: "CASH-REC-105", collected_date: "2026-08-21", receipt_url: "/receipts/REC_GANESH_05.pdf", notes: "Collected at Estate office" },
      { id: 6, festival_id: 1, tower: "Tower F", flat_no: "903", donor_name: "Harish Gupta", amount: 5000, payment_mode: "UPI", transaction_ref: "UPI/623495544/GPay", collected_date: "2026-08-22", receipt_url: "/receipts/REC_GANESH_06.pdf", notes: "Cultural night sponsor" }
    ],
    expenses: [
      { id: 1, festival_id: 1, title: "Mandapam Stage Decor & Waterproof Canopy", category: "Decor", amount: 65000, vendor_name: "Sri Balaji Decorators & Lights", bill_date: "2026-08-18", invoice_url: "/invoices/INV_BALAJI_MANDAP.pdf", audit_evidence_notes: "GST Bill attached. Physical inspection verified by Treasurer Vikram Patel.", approver_name: "Vikram Patel", approver_role: "Treasurer", approval_status: "Approved" },
      { id: 2, festival_id: 1, title: "Eco-friendly Clay Ganesha Idol (8ft) + Puja Kit", category: "Pooja", amount: 32000, vendor_name: "Dhoolpet Clay Artisans Guild", bill_date: "2026-08-19", invoice_url: "/invoices/INV_CLAY_IDOL_2026.pdf", audit_evidence_notes: "Eco-friendly clay certificate provided for PCB compliance.", approver_name: "Rajesh Sharma", approver_role: "President", approval_status: "Approved" },
      { id: 3, festival_id: 1, title: "Digital Sound System, JBL Line Arrays & Lighting Setup", category: "Sound & Light", amount: 45000, vendor_name: "Surya Audio Visuals", bill_date: "2026-08-20", invoice_url: "/invoices/INV_SURYA_SOUND.pdf", audit_evidence_notes: "5-day audio contract including DJ console for Visarjan.", approver_name: "Vikram Patel", approver_role: "Treasurer", approval_status: "Approved" },
      { id: 4, festival_id: 1, title: "Day 1 & Day 2 Maha-Prasadam Buffet (1000 Pax)", category: "Food/Prasadam", amount: 85000, vendor_name: "Swagath Caterers & Sweets", bill_date: "2026-08-22", invoice_url: "/invoices/INV_SWAGATH_PRASADAM.pdf", audit_evidence_notes: "Verified food quality and hygiene checklist signed by Joint Sec.", approver_name: "Ananya Roy", approver_role: "General Secretary", approval_status: "Approved" }
    ]
  },
  {
    id: 2,
    festival_name: "Diwali Deepotsav & Gala Dinner 2026",
    start_date: "2026-11-01",
    end_date: "2026-11-02",
    location: "Main Boulevard & Clubhouse Courtyard",
    description: "10,000 Diyas illumination drive across all 6 towers, Rangoli mega-competition, eco-friendly laser light show, and grand dinner buffet.",
    lead_organizer: "Meenakshi Sundaram",
    estimated_budget: "₹ 4,20,000",
    collected_funds: "₹ 1,50,000",
    status: "Planning",
    highlights: "Society-wide Diya Display, Inter-tower Rangoli Trophy, Eco-friendly Laser Night, Grand Dinner Buffet",
    collections: [],
    expenses: []
  }
];

let culturalEventsStore: CulturalEvent[] = [
  {
    id: 1,
    title: "Jaitra Annual Badminton & Box Cricket League",
    category: "Sports",
    event_date: "2026-09-12",
    time: "07:00 AM - 08:00 PM",
    venue: "Clubhouse Indoor Arena & Sports Turf",
    description: "Annual intra-community sports tournament across Age Groups: Juniors (under 14), Adults (Men & Women Singles/Doubles), and Seniors 50+.",
    coordinator: "Mr. Vivek Murthy (Sports Lead)",
    coordinator_contact: "+91 98450 11223",
    status: "Upcoming",
    registered_count: 32,
    budget: "₹ 45,000",
    participants: [
      { id: 1, event_id: 1, tower: "Tower A", flat_no: "402", participant_name: "Arjun Varma", age_group: "Junior (<14)", activity_category: "Badminton Singles", contact_no: "+91 98451 10001", registration_date: "2026-08-20", notes: "Junior boys category seed #1" },
      { id: 2, event_id: 1, tower: "Tower B", flat_no: "801", participant_name: "Rohit Sharma", age_group: "Adult (25-50)", activity_category: "Cricket League", contact_no: "+91 98452 20002", registration_date: "2026-08-21", notes: "Tower B Captain" },
      { id: 3, event_id: 1, tower: "Tower C", flat_no: "1203", participant_name: "Deepa Raman", age_group: "Adult (25-50)", activity_category: "Badminton Doubles", contact_no: "+91 98453 30003", registration_date: "2026-08-22", notes: "Partnering with Tower D-502" }
    ],
    agendas: [
      { id: 1, event_id: 1, slot_time: "07:00 AM - 07:30 AM", performer_or_speaker: "Sports Committee", activity_topic: "Inaugural Toss & Oath Taking Ceremony", stage_coordinator: "Vivek Murthy", duration_mins: 30 },
      { id: 2, event_id: 1, slot_time: "07:30 AM - 01:00 PM", performer_or_speaker: "Registered Teams", activity_topic: "League Matches & Quarter Finals", stage_coordinator: "Karthik V.", duration_mins: 330 },
      { id: 3, event_id: 1, slot_time: "06:30 PM - 08:00 PM", performer_or_speaker: "President & MC", activity_topic: "Grand Finale, Trophies & High Tea", stage_coordinator: "Rajesh Sharma", duration_mins: 90 }
    ]
  },
  {
    id: 2,
    title: "Youth STEM Robotics & Pottery Bootcamp",
    category: "Kids Workshop",
    event_date: "2026-09-20",
    time: "10:00 AM - 01:00 PM",
    venue: "Clubhouse Multipurpose Studio 2",
    description: "Hands-on weekend learning session featuring DIY Arduino robotics kits, 3D printing demos, and traditional wheel-pottery artistry for children aged 7-16.",
    coordinator: "Dr. Swati Sen (Cultural Committee)",
    coordinator_contact: "+91 99801 44556",
    status: "Upcoming",
    registered_count: 20,
    budget: "₹ 20,000",
    participants: [
      { id: 4, event_id: 2, tower: "Tower D", flat_no: "604", participant_name: "Ananya Sen", age_group: "Junior (<14)", activity_category: "Kids Pottery & Robotics", contact_no: "+91 98454 40004", registration_date: "2026-08-23", notes: "Brought Arduino starter board" }
    ],
    agendas: []
  }
];

let meetingsStore: GeneralBodyMeeting[] = [
  {
    id: 1,
    meeting_title: "5th Annual General Body Meeting (AGM 2026)",
    meeting_type: "AGM",
    meeting_date: "2026-07-26",
    time: "10:00 AM - 01:30 PM",
    venue: "Clubhouse Grand Banquet Hall & Zoom Live Hybrid",
    quorum_status: "Quorum Met (240 Owners)",
    key_agenda: "1. Audited FY25-26 Financials approval\n2. Sinking Fund allocation for Solar Plant\n3. Builder Handover punch-list status\n4. Approval of new security surveillance vendor\n5. Election of 3 replacement MC members",
    resolutions_passed: "Resolution 1: 120kW Rooftop Solar Installation approved by 88% majority.\nResolution 2: FY26-27 annual maintenance budget passed with zero increase.\nResolution 3: Legal notice authorization regarding builder delayed STP handover.",
    minutes_summary: "The AGM commenced with 240 registered owner representations. Treasurer presented audited balance sheet with ₹1.82 Cr corpus. All major resolutions passed.",
    attendees_count: 240,
    doc_link: "/docs/GBM_Minutes_AGM_2026_Approved.pdf"
  },
  {
    id: 2,
    meeting_title: "Extraordinary General Body Meeting (EGM) - STP & Lift AMC Review",
    meeting_type: "EGM",
    meeting_date: "2026-05-10",
    time: "04:00 PM - 06:30 PM",
    venue: "Clubhouse Grand Banquet Hall",
    quorum_status: "Quorum Met (175 Owners)",
    key_agenda: "Emergency discussion on STP odor remediation, treated water dual-pipeline flushing, and negotiating long-term OEM Lift maintenance contract with Otis/Schindler.",
    resolutions_passed: "Authorised association to issue ₹6.5 Lakhs escrow release conditioned upon IGS completing STP microbial aerator overhaul within 30 days.",
    minutes_summary: "Detailed technical evaluation presented by Infrastructure Sub-committee. Clear SLAs mandated for Builder & IGS.",
    attendees_count: 175,
    doc_link: "/docs/EGM_Minutes_May_2026.pdf"
  }
];

let issuesStore: CommunityIssue[] = [
  {
    id: 1,
    issue_code: "ISS-TWA-101",
    tower: "Tower A",
    flat_no: "A-901",
    flat_or_location: "Tower A - Passenger Lift #2",
    title: "Passenger Lift #2 Jerking & Floor Leveling Offset",
    category: "Electrical & Lift",
    reported_by: "Kavita Reddy (A-901)",
    priority: "High",
    status: "Under Inspection",
    assigned_to: "Lift OEM / IGS Facility",
    created_at: "2026-08-18",
    description: "Lift stops with a 2-inch height discrepancy on 7th and 9th floors, causing tripping hazard.",
    resolution_notes: "OEM service engineers inspected encoder sensors. Replacement traction brake coil ordered."
  },
  {
    id: 2,
    issue_code: "ISS-TWB-202",
    tower: "Tower B",
    flat_no: "B-404",
    flat_or_location: "Tower B - Basement-2 Ramp Lower Joint",
    title: "Basement-2 Ramp Joint Water Seepage during rains",
    category: "Civil & Seepage",
    reported_by: "Alok Srivastava (B-404)",
    priority: "Critical",
    status: "In Progress",
    assigned_to: "Builder Civil Engineering Cell",
    created_at: "2026-08-10",
    description: "Expansion joint between basement slabs shows active water drip during continuous rain.",
    resolution_notes: "Pressure grouting contractor mobilized; 3 out of 5 injection ports completed."
  },
  {
    id: 3,
    issue_code: "ISS-TWC-303",
    tower: "Tower C",
    flat_no: "C-102",
    flat_or_location: "Tower C - Ground Floor Lobby Intercom",
    title: "Lobby Intercom connection static & audio drops",
    category: "Security & Access",
    reported_by: "Pooja Sharma (C-102)",
    priority: "Medium",
    status: "Open",
    assigned_to: "IGS IT & Security Desk",
    created_at: "2026-08-22",
    description: "Audio communication drops between guard booth and Tower C flats.",
    resolution_notes: "Fiber optic switch in Tower C riser scheduled for reboot and line test."
  },
  {
    id: 4,
    issue_code: "ISS-TWD-404",
    tower: "Tower D",
    flat_no: "D-302",
    flat_or_location: "Tower D - Dual Flush Line Shaft",
    title: "STP Treated Water Odor in Flush Line",
    category: "STP & Water Supply",
    reported_by: "Mahesh Rao (D-302)",
    priority: "High",
    status: "In Progress",
    assigned_to: "IGS Water Operations Lead",
    created_at: "2026-08-20",
    description: "Treated flush water exhibits mild turbidity and chemical odor in lower floor toilets.",
    resolution_notes: "Activated carbon filter media replaced. Dosing pump calibration verified."
  },
  {
    id: 5,
    issue_code: "ISS-TWE-505",
    tower: "Tower E",
    flat_no: "E-1102",
    flat_or_location: "Tower E - Corridors 11th Floor",
    title: "Emergency Exit Staircase Fire Door Closer Jammed",
    category: "Common Amenities",
    reported_by: "Vivek Varma (E-1102)",
    priority: "Medium",
    status: "Open",
    assigned_to: "Facility Maintenance Cell",
    created_at: "2026-08-24",
    description: "Hydraulic door closer on fire escape staircase stuck halfway.",
    resolution_notes: "Technician assigned with replacement hydraulic arm."
  },
  {
    id: 6,
    issue_code: "ISS-TWF-606",
    tower: "Tower F",
    flat_no: "F-501",
    flat_or_location: "Tower F - Rainwater Downpipe Joint",
    title: "Rainwater Harvesting Pipe Dripping near Stilt Parking",
    category: "Civil & Seepage",
    reported_by: "D. Prasad (F-501)",
    priority: "Low",
    status: "Resolved",
    assigned_to: "IGS Plumbing Team",
    created_at: "2026-08-12",
    description: "Mild joint leakage at 6-inch PVC elbow in stilt parking bay #44.",
    resolution_notes: "Re-cemented solvent weld joint and tested under high-flow water. No further leak."
  },
  {
    id: 7,
    issue_code: "ISS-CH-701",
    tower: "Clubhouse",
    flat_no: "CH-Gym",
    flat_or_location: "Clubhouse Fitness Center (1st Floor)",
    title: "Gym Treadmill #3 Motor Inverter Fault",
    category: "Common Amenities",
    reported_by: "Rohan Joshi (B-1102)",
    priority: "Low",
    status: "Resolved",
    assigned_to: "Facility Maintenance Desk",
    created_at: "2026-08-05",
    description: "Treadmill speed sensor throwing Error E-02 during incline adjustments.",
    resolution_notes: "Technician replaced DC motor brushes and recalibrated digital console."
  },
  {
    id: 8,
    issue_code: "ISS-CS-801",
    tower: "Common Space",
    flat_no: "Gate 2",
    flat_or_location: "Gate 2 & Children Play Area",
    title: "CCTV Blind Spot near Children Play Area & Gate 2",
    category: "Security & Access",
    reported_by: "Rajesh Sharma (President)",
    priority: "Medium",
    status: "Open",
    assigned_to: "Association IT & Security Head",
    created_at: "2026-08-22",
    description: "Tree branch overgrowth occludes 4MP PTZ camera angle covering the toddler play swings.",
    resolution_notes: "Scheduled for camera realignment and horticulture pruning on Saturday morning."
  }
];

let tasksStore: ADOTask[] = [
  {
    id: 1,
    task_code: "ADO-101",
    title: "Basement Waterproofing & Crack Injection Rectification",
    assigned_to: "Builder",
    entity_type: "Builder",
    category: "Seepage & Waterproofing",
    status: "Active",
    priority: "Critical",
    assignee_name: "Er. K. Verma (Builder Project Head)",
    due_date: "2026-09-15",
    sla_days: 14,
    blockers: "Awaiting polyurethane specialized sealant delivery from Bengaluru distributor.",
    description: "Complete structural PU injection grouting along 120 running meters of basement expansion joints in Tower B & C.",
    completion_percentage: 65,
    tags: "Handover, Structural, Warranty",
    comments: [
      { id: 1, task_id: 1, author_name: "Karthik Venkatesh", author_role: "MC Maintenance Lead", comment_text: "Joint inspection conducted on Tower B Basement-2 ramp with Er. Verma. Marked 14 drill spots for PU injection.", created_at: "2026-08-16 11:30 AM" },
      { id: 2, task_id: 1, author_name: "Er. K. Verma", author_role: "Builder Project Head", comment_text: "First round of grouting complete on 8 spots. Secondary coating will begin once polyurethane batch arrives on Thursday.", created_at: "2026-08-19 04:15 PM" }
    ],
    attachments: [
      { id: 1, task_id: 1, file_name: "Basement_Crack_Inspection_Photos_Aug2026.pdf", file_url: "/evidence/Basement_Inspection_Aug2026.pdf", description: "High-resolution crack survey photos along Tower B & C ramp joint", uploaded_by: "Karthik Venkatesh (MC)", created_at: "2026-08-16" }
    ]
  },
  {
    id: 2,
    task_code: "ADO-102",
    title: "Final Fire NOC Compliance & Hydrant Flow Calibration",
    assigned_to: "Builder",
    entity_type: "Builder",
    category: "Fire NOC & Compliance",
    status: "Active",
    priority: "Critical",
    assignee_name: "Mr. D. Srinivasan (Builder Liaison)",
    due_date: "2026-09-30",
    sla_days: 30,
    blockers: "Final inspection joint certificate with Telangana Fire Department pending signature.",
    description: "Pressure testing of 24 riser shafts across Towers A-F, jockey pump automated switch-over check, and statutory certificate.",
    completion_percentage: 80,
    tags: "Statutory, Fire Safety, NOC",
    comments: [],
    attachments: [
      { id: 2, task_id: 2, file_name: "Fire_Riser_Pressure_Flow_Test_Report_Towers_A_F.pdf", file_url: "/evidence/Fire_Riser_Test_Report.pdf", description: "Signed hydrostatic test certificate by certified Fire Safety Engineer", uploaded_by: "Mr. D. Srinivasan (Builder)", created_at: "2026-08-18" }
    ]
  },
  {
    id: 3,
    task_code: "ADO-103",
    title: "STP Biological Oxygen Demand (BOD) Testing & IGS Handover",
    assigned_to: "IGS",
    entity_type: "IGS",
    category: "STP & WTP Operations",
    status: "Active",
    priority: "High",
    assignee_name: "Mr. Suresh R. (IGS Technical Ops)",
    due_date: "2026-09-10",
    sla_days: 7,
    blockers: "None. Aeration tank bacterial culture dosing in stabilization phase.",
    description: "Achieve continuous BOD < 10 ppm and COD < 50 ppm output compliance as mandated by PCB guidelines.",
    completion_percentage: 75,
    tags: "STP, IGS, Environment",
    comments: [
      { id: 3, task_id: 3, author_name: "Mr. Suresh R.", author_role: "IGS Technical Ops", comment_text: "Water test samples collected from dual STP outlet tank. Lab report from NABL lab expected in 48 hours.", created_at: "2026-08-21 02:00 PM" }
    ],
    attachments: [
      { id: 3, task_id: 3, file_name: "STP_Treated_Water_NABL_Lab_Report_Aug2026.pdf", file_url: "/evidence/STP_Lab_Report_Aug2026.pdf", description: "PCB parameter certificate showing BOD 8.2 ppm and COD 42 ppm", uploaded_by: "Mr. Suresh R. (IGS)", created_at: "2026-08-22" }
    ]
  },
  {
    id: 4,
    task_code: "ADO-104",
    title: "Boom Barrier RFID Tag Sync with MyGate & ANPR System",
    assigned_to: "IGS",
    entity_type: "IGS",
    category: "CCTV & Gate Automation",
    status: "Resolved",
    priority: "High",
    assignee_name: "Kishore N. (IGS IT & Security)",
    due_date: "2026-08-25",
    sla_days: 5,
    blockers: "Resolved successfully.",
    description: "Integrate automated fast-tag recognition on Gate 1 & 2 boom barriers for resident 4-wheelers across all 6 towers.",
    completion_percentage: 100,
    tags: "Security, Automation, RFID",
    comments: [],
    attachments: []
  }
];

let teamStore: TeamMember[] = [
  { id: 1, name: "Rajesh Sharma", role: "President", wing_flat: "Tower A - 1204", tower: "Tower A", contact: "+91 98450 71001", email: "president@jaitra.org", term: "2025-2027", sub_committee: "Executive & Governance", status: "Active" },
  { id: 2, name: "Col. R. S. Rathore (Retd.)", role: "Vice President", wing_flat: "Tower E - 1401", tower: "Tower E", contact: "+91 98110 54321", email: "vp@jaitra.org", term: "2025-2027", sub_committee: "Security & Estate Management", status: "Active" },
  { id: 3, name: "Ananya Roy", role: "General Secretary", wing_flat: "Tower C - 802", tower: "Tower C", contact: "+91 99800 23412", email: "secretary@jaitra.org", term: "2025-2027", sub_committee: "Legal, Compliance & Admin", status: "Active" },
  { id: 4, name: "Meenakshi Sundaram", role: "Joint Secretary", wing_flat: "Tower B - 1103", tower: "Tower B", contact: "+91 94440 67890", email: "jointsec@jaitra.org", term: "2025-2027", sub_committee: "Community Relations & PR", status: "Active" },
  { id: 5, name: "Vikram Patel", role: "Treasurer", wing_flat: "Tower B - 501", tower: "Tower B", contact: "+91 97411 98765", email: "treasurer@jaitra.org", term: "2025-2027", sub_committee: "Finance, Audit & Corpus", status: "Active" },
  { id: 6, name: "Praveen Kumar", role: "Joint Treasurer", wing_flat: "Tower D - 704", tower: "Tower D", contact: "+91 96500 12389", email: "jointtreasurer@jaitra.org", term: "2025-2027", sub_committee: "Billing & Vendor Escrow", status: "Active" },
  { id: 7, name: "Dr. Swati Sen", role: "Cultural Committee Head", wing_flat: "Tower A - 302", tower: "Tower A", contact: "+91 98451 22334", email: "cultural@jaitra.org", term: "2025-2027", sub_committee: "Events, Festivals & Arts", status: "Active" },
  { id: 8, name: "Vivek Murthy", role: "Sports & Amenities Head", wing_flat: "Tower C - 404", tower: "Tower C", contact: "+91 98860 99887", email: "sports@jaitra.org", term: "2025-2027", sub_committee: "Clubhouse, Gym & Grounds", status: "Active" },
  { id: 9, name: "Karthik Venkatesh", role: "Facility & Maintenance Lead", wing_flat: "Tower D - 1002", tower: "Tower D", contact: "+91 97312 88442", email: "maintenance@jaitra.org", term: "2025-2027", sub_committee: "Builder Handover & IGS Oversight", status: "Active" },
  { id: 10, name: "G. Somasekhar", role: "Block Representative (Tower F)", wing_flat: "Tower F - 604", tower: "Tower F", contact: "+91 99440 12345", email: "towerf@jaitra.org", term: "2025-2027", sub_committee: "Resident Welfare & Elevators", status: "Active" }
];

// ----------------- EXPORTED DB FUNCTIONS -----------------

export async function getStats(): Promise<SocietyStats> {
  const openIssues = issuesStore.filter(i => i.status !== "Resolved" && i.status !== "Closed");
  const builderTasks = tasksStore.filter(t => t.assigned_to.includes("Builder") || t.entity_type === "Builder");
  const igsTasks = tasksStore.filter(t => t.assigned_to.includes("IGS") || t.entity_type === "IGS");
  const activeAdo = tasksStore.filter(t => t.status === "New" || t.status === "Active");
  const resolvedAdo = tasksStore.filter(t => t.status === "Resolved" || t.status === "Closed");

  const towers = ["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F", "Clubhouse", "Common Space"];
  const towerCounts: Record<string, number> = {};
  towers.forEach(t => {
    towerCounts[t] = issuesStore.filter(i => i.tower === t).length;
  });

  return {
    cultural_events_count: culturalEventsStore.length,
    festivals_count: festivalsStore.length,
    meetings_count: meetingsStore.length,
    total_issues: issuesStore.length,
    open_issues_count: openIssues.length,
    total_ado_tasks: tasksStore.length,
    builder_tasks_count: builderTasks.length,
    igs_tasks_count: igsTasks.length,
    active_ado_tasks: activeAdo.length,
    resolved_ado_tasks: resolvedAdo.length,
    team_members_count: teamStore.length,
    tower_issue_counts: towerCounts,
    society_name: "Jaitra Residents Welfare Association",
    total_towers: 6,
  };
}

// Festivals
export async function getFestivals(status?: string): Promise<FestivalCelebration[]> {
  if (status && status !== "All") {
    return festivalsStore.filter(f => f.status === status);
  }
  return [...festivalsStore];
}

export async function getFestival(id: number): Promise<FestivalCelebration | null> {
  return festivalsStore.find(f => f.id === id) || null;
}

export async function createFestival(data: FestivalCelebrationCreate): Promise<FestivalCelebration> {
  const newId = festivalsStore.length > 0 ? Math.max(...festivalsStore.map(f => f.id)) + 1 : 1;
  const newFest: FestivalCelebration = { id: newId, ...data, collections: [], expenses: [] };
  festivalsStore.unshift(newFest);
  return newFest;
}

export async function updateFestival(id: number, data: FestivalCelebrationCreate): Promise<FestivalCelebration> {
  const index = festivalsStore.findIndex(f => f.id === id);
  if (index === -1) throw new Error("Festival not found");
  festivalsStore[index] = { ...festivalsStore[index], ...data };
  return festivalsStore[index];
}

export async function deleteFestival(id: number): Promise<void> {
  festivalsStore = festivalsStore.filter(f => f.id !== id);
}

export async function addFestivalCollection(festivalId: number, data: FestivalCollectionCreate): Promise<FestivalCollection> {
  const fest = festivalsStore.find(f => f.id === festivalId);
  if (!fest) throw new Error("Festival not found");
  if (!fest.collections) fest.collections = [];
  const newId = Date.now();
  const newColl: FestivalCollection = { id: newId, festival_id: festivalId, ...data };
  fest.collections.unshift(newColl);
  return newColl;
}

export async function deleteFestivalCollection(collectionId: number): Promise<void> {
  festivalsStore.forEach(f => {
    if (f.collections) {
      f.collections = f.collections.filter(c => c.id !== collectionId);
    }
  });
}

export async function addFestivalExpense(festivalId: number, data: FestivalExpenseCreate): Promise<FestivalExpense> {
  const fest = festivalsStore.find(f => f.id === festivalId);
  if (!fest) throw new Error("Festival not found");
  if (!fest.expenses) fest.expenses = [];
  const newId = Date.now();
  const newExp: FestivalExpense = { id: newId, festival_id: festivalId, ...data };
  fest.expenses.unshift(newExp);
  return newExp;
}

export async function updateFestivalExpenseStatus(expenseId: number, approvalStatus: string, approverName?: string): Promise<FestivalExpense> {
  for (const f of festivalsStore) {
    if (f.expenses) {
      const exp = f.expenses.find(e => e.id === expenseId);
      if (exp) {
        exp.approval_status = approvalStatus;
        if (approverName) exp.approver_name = approverName;
        return exp;
      }
    }
  }
  throw new Error("Expense not found");
}

export async function deleteFestivalExpense(expenseId: number): Promise<void> {
  festivalsStore.forEach(f => {
    if (f.expenses) {
      f.expenses = f.expenses.filter(e => e.id !== expenseId);
    }
  });
}

// Cultural Events
export async function getCulturalEvents(status?: string, category?: string): Promise<CulturalEvent[]> {
  let list = [...culturalEventsStore];
  if (status && status !== "All") list = list.filter(e => e.status === status);
  if (category && category !== "All") list = list.filter(e => e.category.toLowerCase().includes(category.toLowerCase()));
  return list;
}

export async function getCulturalEvent(id: number): Promise<CulturalEvent | null> {
  return culturalEventsStore.find(e => e.id === id) || null;
}

export async function createCulturalEvent(data: CulturalEventCreate): Promise<CulturalEvent> {
  const newId = culturalEventsStore.length > 0 ? Math.max(...culturalEventsStore.map(e => e.id)) + 1 : 1;
  const newEv: CulturalEvent = { id: newId, ...data, participants: [], agendas: [] };
  culturalEventsStore.unshift(newEv);
  return newEv;
}

export async function updateCulturalEvent(id: number, data: CulturalEventCreate): Promise<CulturalEvent> {
  const index = culturalEventsStore.findIndex(e => e.id === id);
  if (index === -1) throw new Error("Event not found");
  culturalEventsStore[index] = { ...culturalEventsStore[index], ...data };
  return culturalEventsStore[index];
}

export async function deleteCulturalEvent(id: number): Promise<void> {
  culturalEventsStore = culturalEventsStore.filter(e => e.id !== id);
}

export async function addCulturalParticipant(eventId: number, data: CulturalParticipantCreate): Promise<CulturalParticipant> {
  const ev = culturalEventsStore.find(e => e.id === eventId);
  if (!ev) throw new Error("Event not found");
  if (!ev.participants) ev.participants = [];
  const newId = Date.now();
  const newPart: CulturalParticipant = { id: newId, event_id: eventId, ...data };
  ev.participants.unshift(newPart);
  ev.registered_count = (ev.registered_count || 0) + 1;
  return newPart;
}

export async function deleteCulturalParticipant(participantId: number): Promise<void> {
  culturalEventsStore.forEach(e => {
    if (e.participants) {
      const before = e.participants.length;
      e.participants = e.participants.filter(p => p.id !== participantId);
      if (e.participants.length < before && e.registered_count > 0) {
        e.registered_count -= 1;
      }
    }
  });
}

export async function addCulturalAgenda(eventId: number, data: CulturalAgendaCreate): Promise<CulturalAgenda> {
  const ev = culturalEventsStore.find(e => e.id === eventId);
  if (!ev) throw new Error("Event not found");
  if (!ev.agendas) ev.agendas = [];
  const newId = Date.now();
  const newAg: CulturalAgenda = { id: newId, event_id: eventId, ...data };
  ev.agendas.push(newAg);
  return newAg;
}

export async function deleteCulturalAgenda(agendaId: number): Promise<void> {
  culturalEventsStore.forEach(e => {
    if (e.agendas) {
      e.agendas = e.agendas.filter(a => a.id !== agendaId);
    }
  });
}

// Meetings (GBM)
export async function getMeetings(meetingType?: string): Promise<GeneralBodyMeeting[]> {
  if (meetingType && meetingType !== "All") {
    return meetingsStore.filter(m => m.meeting_type === meetingType);
  }
  return [...meetingsStore];
}

export async function createMeeting(data: GeneralBodyMeetingCreate): Promise<GeneralBodyMeeting> {
  const newId = meetingsStore.length > 0 ? Math.max(...meetingsStore.map(m => m.id)) + 1 : 1;
  const newM: GeneralBodyMeeting = { id: newId, ...data };
  meetingsStore.unshift(newM);
  return newM;
}

export async function updateMeeting(id: number, data: GeneralBodyMeetingCreate): Promise<GeneralBodyMeeting> {
  const index = meetingsStore.findIndex(m => m.id === id);
  if (index === -1) throw new Error("Meeting not found");
  meetingsStore[index] = { ...meetingsStore[index], ...data };
  return meetingsStore[index];
}

export async function deleteMeeting(id: number): Promise<void> {
  meetingsStore = meetingsStore.filter(m => m.id !== id);
}

// Issues (Towers A-F)
export async function getIssues(tower?: string, status?: string, priority?: string, category?: string): Promise<CommunityIssue[]> {
  let list = [...issuesStore];
  if (tower && tower !== "All") list = list.filter(i => i.tower === tower);
  if (status && status !== "All") list = list.filter(i => i.status === status);
  if (priority && priority !== "All") list = list.filter(i => i.priority === priority);
  if (category && category !== "All") list = list.filter(i => i.category.toLowerCase().includes(category.toLowerCase()));
  return list;
}

export async function createIssue(data: CommunityIssueCreate): Promise<CommunityIssue> {
  const newId = issuesStore.length > 0 ? Math.max(...issuesStore.map(i => i.id)) + 1 : 1;
  let code = data.issue_code;
  if (!code) {
    let pfx = "TWA";
    if (data.tower.includes("Tower B")) pfx = "TWB";
    else if (data.tower.includes("Tower C")) pfx = "TWC";
    else if (data.tower.includes("Tower D")) pfx = "TWD";
    else if (data.tower.includes("Tower E")) pfx = "TWE";
    else if (data.tower.includes("Tower F")) pfx = "TWF";
    else if (data.tower.includes("Clubhouse")) pfx = "CH";
    else if (data.tower.includes("Common")) pfx = "CS";
    code = `ISS-${pfx}-${100 + newId}`;
  }
  const newIssue: CommunityIssue = { id: newId, ...data, issue_code: code };
  issuesStore.unshift(newIssue);
  return newIssue;
}

export async function updateIssue(id: number, data: CommunityIssueCreate): Promise<CommunityIssue> {
  const index = issuesStore.findIndex(i => i.id === id);
  if (index === -1) throw new Error("Issue not found");
  issuesStore[index] = { ...issuesStore[index], ...data };
  return issuesStore[index];
}

export async function deleteIssue(id: number): Promise<void> {
  issuesStore = issuesStore.filter(i => i.id !== id);
}

// ADO Tasks (Builder & IGS)
export async function getTasks(assignedTo?: string, entityType?: string, status?: string): Promise<ADOTask[]> {
  let list = [...tasksStore];
  if (assignedTo && assignedTo !== "All") list = list.filter(t => t.assigned_to.includes(assignedTo));
  if (entityType && entityType !== "All") list = list.filter(t => t.entity_type === entityType);
  if (status && status !== "All") list = list.filter(t => t.status === status);
  return list;
}

export async function createTask(data: ADOTaskCreate): Promise<ADOTask> {
  const newId = tasksStore.length > 0 ? Math.max(...tasksStore.map(t => t.id)) + 1 : 1;
  const code = data.task_code || `ADO-${100 + newId}`;
  const newTask: ADOTask = { id: newId, ...data, task_code: code, comments: [], attachments: [] };
  tasksStore.push(newTask);
  return newTask;
}

export async function updateTask(id: number, data: ADOTaskCreate): Promise<ADOTask> {
  const index = tasksStore.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Task not found");
  tasksStore[index] = { ...tasksStore[index], ...data };
  return tasksStore[index];
}

export async function updateTaskStatus(id: number, status: string, completionPercentage?: number, blockers?: string): Promise<ADOTask> {
  const index = tasksStore.findIndex(t => t.id === id);
  if (index === -1) throw new Error("Task not found");
  const task = tasksStore[index];
  task.status = status;
  if (completionPercentage !== undefined) task.completion_percentage = completionPercentage;
  else if (status === "Resolved" || status === "Closed") task.completion_percentage = 100;
  else if (status === "New") task.completion_percentage = 0;
  if (blockers !== undefined) task.blockers = blockers;
  return task;
}

export async function deleteTask(id: number): Promise<void> {
  tasksStore = tasksStore.filter(t => t.id !== id);
}

export async function addComment(taskId: number, data: ADOCommentCreate): Promise<ADOComment> {
  const task = tasksStore.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (!task.comments) task.comments = [];
  const newId = Date.now();
  const newComment: ADOComment = { id: newId, task_id: taskId, ...data, created_at: data.created_at || new Date().toLocaleString() };
  task.comments.push(newComment);
  return newComment;
}

export async function addAttachment(taskId: number, data: ADOAttachmentCreate): Promise<ADOAttachment> {
  const task = tasksStore.find(t => t.id === taskId);
  if (!task) throw new Error("Task not found");
  if (!task.attachments) task.attachments = [];
  const newId = Date.now();
  const newAtt: ADOAttachment = { id: newId, task_id: taskId, ...data, created_at: data.created_at || new Date().toISOString().split("T")[0] };
  task.attachments.push(newAtt);
  return newAtt;
}

export async function deleteAttachment(attachmentId: number): Promise<void> {
  tasksStore.forEach(t => {
    if (t.attachments) {
      t.attachments = t.attachments.filter(a => a.id !== attachmentId);
    }
  });
}

// Team Members
export async function getTeam(status?: string, tower?: string): Promise<TeamMember[]> {
  let list = [...teamStore];
  if (status && status !== "All") list = list.filter(m => m.status === status);
  if (tower && tower !== "All") list = list.filter(m => m.tower === tower || (m.wing_flat && m.wing_flat.includes(tower)));
  return list;
}

export async function createTeamMember(data: TeamMemberCreate): Promise<TeamMember> {
  const newId = teamStore.length > 0 ? Math.max(...teamStore.map(m => m.id)) + 1 : 1;
  const newMem: TeamMember = { id: newId, ...data };
  teamStore.push(newMem);
  return newMem;
}

export async function updateTeamMember(id: number, data: TeamMemberCreate): Promise<TeamMember> {
  const index = teamStore.findIndex(m => m.id === id);
  if (index === -1) throw new Error("Member not found");
  teamStore[index] = { ...teamStore[index], ...data };
  return teamStore[index];
}

export async function deleteTeamMember(id: number): Promise<void> {
  teamStore = teamStore.filter(m => m.id !== id);
}
