from typing import List, Optional
import datetime
from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict
from sqlalchemy.orm import Session, joinedload
from database import engine, get_db, Base
import models

# Re-create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jaitra Association Portal API",
    description="Backend API for Jaitra Residents Welfare Association (Towers A-F, Events, ADO Tracker)",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------- PYDANTIC SCHEMAS -----------------

# 1. Festival Schemas
class FestivalCollectionBase(BaseModel):
    tower: str
    flat_no: str
    donor_name: str
    amount: float
    payment_mode: Optional[str] = "UPI"
    transaction_ref: Optional[str] = ""
    collected_date: Optional[str] = ""
    receipt_url: Optional[str] = ""
    notes: Optional[str] = ""

class FestivalCollectionCreate(FestivalCollectionBase):
    pass

class FestivalCollectionSchema(FestivalCollectionBase):
    id: int
    festival_id: int
    model_config = ConfigDict(from_attributes=True)


class FestivalExpenseBase(BaseModel):
    title: str
    category: str
    amount: float
    vendor_name: Optional[str] = ""
    bill_date: str
    invoice_url: Optional[str] = ""
    audit_evidence_notes: Optional[str] = ""
    approver_name: str
    approver_role: Optional[str] = "Treasurer"
    approval_status: Optional[str] = "Approved"

class FestivalExpenseCreate(FestivalExpenseBase):
    pass

class FestivalExpenseStatusUpdate(BaseModel):
    approval_status: str
    approver_name: Optional[str] = None

class FestivalExpenseSchema(FestivalExpenseBase):
    id: int
    festival_id: int
    model_config = ConfigDict(from_attributes=True)


class FestivalCelebrationBase(BaseModel):
    festival_name: str
    start_date: str
    end_date: str
    location: str
    description: Optional[str] = ""
    lead_organizer: str
    estimated_budget: Optional[str] = ""
    collected_funds: Optional[str] = ""
    status: Optional[str] = "Planning"
    highlights: Optional[str] = ""

class FestivalCelebrationCreate(FestivalCelebrationBase):
    pass

class FestivalCelebrationSchema(FestivalCelebrationBase):
    id: int
    collections: List[FestivalCollectionSchema] = []
    expenses: List[FestivalExpenseSchema] = []
    model_config = ConfigDict(from_attributes=True)


# 2. Cultural Event Schemas
class CulturalParticipantBase(BaseModel):
    tower: str
    flat_no: str
    participant_name: str
    age_group: Optional[str] = "Adult"
    activity_category: str
    contact_no: Optional[str] = ""
    notes: Optional[str] = ""
    registration_date: Optional[str] = ""

class CulturalParticipantCreate(CulturalParticipantBase):
    pass

class CulturalParticipantSchema(CulturalParticipantBase):
    id: int
    event_id: int
    model_config = ConfigDict(from_attributes=True)


class CulturalAgendaBase(BaseModel):
    slot_time: str
    performer_or_speaker: str
    activity_topic: str
    stage_coordinator: Optional[str] = ""
    duration_mins: Optional[int] = 30

class CulturalAgendaCreate(CulturalAgendaBase):
    pass

class CulturalAgendaSchema(CulturalAgendaBase):
    id: int
    event_id: int
    model_config = ConfigDict(from_attributes=True)


class CulturalEventBase(BaseModel):
    title: str
    category: str
    event_date: str
    time: str
    venue: str
    description: Optional[str] = ""
    coordinator: str
    coordinator_contact: Optional[str] = ""
    status: Optional[str] = "Upcoming"
    registered_count: Optional[int] = 0
    budget: Optional[str] = ""

class CulturalEventCreate(CulturalEventBase):
    pass

class CulturalEventSchema(CulturalEventBase):
    id: int
    participants: List[CulturalParticipantSchema] = []
    agendas: List[CulturalAgendaSchema] = []
    model_config = ConfigDict(from_attributes=True)


# 3. General Body Meeting Schemas
class GeneralBodyMeetingBase(BaseModel):
    meeting_title: str
    meeting_type: str
    meeting_date: str
    time: str
    venue: str
    quorum_status: Optional[str] = "Quorum Met"
    key_agenda: Optional[str] = ""
    resolutions_passed: Optional[str] = ""
    minutes_summary: Optional[str] = ""
    attendees_count: Optional[int] = 0
    doc_link: Optional[str] = ""

class GeneralBodyMeetingCreate(GeneralBodyMeetingBase):
    pass

class GeneralBodyMeetingSchema(GeneralBodyMeetingBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# 4. Community Issue Schemas (Tower Level)
class CommunityIssueBase(BaseModel):
    issue_code: Optional[str] = None
    tower: str
    flat_no: Optional[str] = ""
    flat_or_location: str
    title: str
    category: str
    reported_by: str
    priority: Optional[str] = "Medium"
    status: Optional[str] = "Open"
    assigned_to: str
    created_at: Optional[str] = None
    description: Optional[str] = ""
    resolution_notes: Optional[str] = ""

class CommunityIssueCreate(CommunityIssueBase):
    pass

class CommunityIssueSchema(CommunityIssueBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# 5. ADO Task Schemas (with Comments & Evidence Attachments)
class ADOCommentBase(BaseModel):
    author_name: str
    author_role: Optional[str] = "MC Member"
    comment_text: str
    created_at: Optional[str] = None

class ADOCommentCreate(ADOCommentBase):
    pass

class ADOCommentSchema(ADOCommentBase):
    id: int
    task_id: int
    model_config = ConfigDict(from_attributes=True)


class ADOAttachmentBase(BaseModel):
    file_name: str
    file_url: str
    description: Optional[str] = ""
    uploaded_by: str
    created_at: Optional[str] = None

class ADOAttachmentCreate(ADOAttachmentBase):
    pass

class ADOAttachmentSchema(ADOAttachmentBase):
    id: int
    task_id: int
    model_config = ConfigDict(from_attributes=True)


class ADOTaskBase(BaseModel):
    task_code: Optional[str] = None
    title: str
    assigned_to: str
    entity_type: str
    category: str
    status: Optional[str] = "New"
    priority: Optional[str] = "Medium"
    assignee_name: Optional[str] = ""
    due_date: Optional[str] = ""
    sla_days: Optional[int] = 7
    blockers: Optional[str] = ""
    description: Optional[str] = ""
    completion_percentage: Optional[int] = 0
    tags: Optional[str] = ""

class ADOTaskCreate(ADOTaskBase):
    pass

class ADOTaskStatusUpdate(BaseModel):
    status: str
    completion_percentage: Optional[int] = None
    blockers: Optional[str] = None

class ADOTaskSchema(ADOTaskBase):
    id: int
    comments: List[ADOCommentSchema] = []
    attachments: List[ADOAttachmentSchema] = []
    model_config = ConfigDict(from_attributes=True)


# 6. Team Member Schemas
class TeamMemberBase(BaseModel):
    name: str
    role: str
    wing_flat: Optional[str] = ""
    tower: Optional[str] = "Tower A"
    contact: str
    email: Optional[str] = ""
    term: Optional[str] = "2025-2027"
    sub_committee: Optional[str] = ""
    status: Optional[str] = "Active"

class TeamMemberCreate(TeamMemberBase):
    pass

class TeamMemberSchema(TeamMemberBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


# ----------------- SEED DATA -----------------

@app.on_event("startup")
def seed_all_data():
    db = next(get_db())
    try:
        # 1. Cultural Events
        if db.query(models.CulturalEventModel).count() == 0:
            ev1 = models.CulturalEventModel(
                title="Jaitra Annual Badminton & Box Cricket League",
                category="Sports",
                event_date="2026-09-12",
                time="07:00 AM - 08:00 PM",
                venue="Clubhouse Indoor Arena & Sports Turf",
                description="Annual intra-community sports tournament across Age Groups: Juniors (under 14), Adults (Men & Women Singles/Doubles), and Seniors 50+.",
                coordinator="Mr. Vivek Murthy (Sports Lead)",
                coordinator_contact="+91 98450 11223",
                status="Upcoming",
                registered_count=32,
                budget="₹ 45,000"
            )
            ev2 = models.CulturalEventModel(
                title="Youth STEM Robotics & Pottery Bootcamp",
                category="Kids Workshop",
                event_date="2026-09-20",
                time="10:00 AM - 01:00 PM",
                venue="Clubhouse Multipurpose Studio 2",
                description="Hands-on weekend learning session featuring DIY Arduino robotics kits, 3D printing demos, and traditional wheel-pottery artistry for children aged 7-16.",
                coordinator="Dr. Swati Sen (Cultural Committee)",
                coordinator_contact="+91 99801 44556",
                status="Upcoming",
                registered_count=20,
                budget="₹ 20,000"
            )
            db.add_all([ev1, ev2])
            db.commit()
            db.refresh(ev1)
            db.refresh(ev2)

            # Add Participants
            db.add_all([
                models.CulturalParticipantModel(
                    event_id=ev1.id, tower="Tower A", flat_no="402", participant_name="Arjun Varma",
                    age_group="Junior (<14)", activity_category="Badminton Singles", contact_no="+91 98451 10001",
                    registration_date="2026-08-20", notes="Junior boys category seed #1"
                ),
                models.CulturalParticipantModel(
                    event_id=ev1.id, tower="Tower B", flat_no="801", participant_name="Rohit Sharma",
                    age_group="Adult (25-50)", activity_category="Cricket League", contact_no="+91 98452 20002",
                    registration_date="2026-08-21", notes="Tower B Captain"
                ),
                models.CulturalParticipantModel(
                    event_id=ev1.id, tower="Tower C", flat_no="1203", participant_name="Deepa Raman",
                    age_group="Adult (25-50)", activity_category="Badminton Doubles", contact_no="+91 98453 30003",
                    registration_date="2026-08-22", notes="Partnering with Tower D-502"
                ),
                models.CulturalParticipantModel(
                    event_id=ev2.id, tower="Tower D", flat_no="604", participant_name="Ananya Sen",
                    age_group="Junior (<14)", activity_category="Kids Pottery & Robotics", contact_no="+91 98454 40004",
                    registration_date="2026-08-23", notes="Brought Arduino starter board"
                )
            ])

            # Add Agendas / Schedule
            db.add_all([
                models.CulturalAgendaModel(
                    event_id=ev1.id, slot_time="07:00 AM - 07:30 AM", performer_or_speaker="Sports Committee",
                    activity_topic="Inaugural Toss & Oath Taking Ceremony", stage_coordinator="Vivek Murthy", duration_mins=30
                ),
                models.CulturalAgendaModel(
                    event_id=ev1.id, slot_time="07:30 AM - 01:00 PM", performer_or_speaker="Registered Teams",
                    activity_topic="League Matches & Quarter Finals", stage_coordinator="Karthik V.", duration_mins=330
                ),
                models.CulturalAgendaModel(
                    event_id=ev1.id, slot_time="06:30 PM - 08:00 PM", performer_or_speaker="President & MC",
                    activity_topic="Grand Finale, Trophies & High Tea", stage_coordinator="Rajesh Sharma", duration_mins=90
                )
            ])
            db.commit()

        # 2. Festivals & Financial Expense / Collection Tracker
        if db.query(models.FestivalCelebrationModel).count() == 0:
            fest1 = models.FestivalCelebrationModel(
                festival_name="Ganesh Chaturthi Utsav 2026 (5-Day Grand Fest)",
                start_date="2026-09-15",
                end_date="2026-09-19",
                location="Clubhouse Central Mandapam",
                description="Eco-friendly clay Ganesha Sthapana, daily morning/evening Aarti, devotional Bhajans, cultural dance nights, Kids fancy dress, and the prestigious Maha Laddu Auction followed by Visarjan procession.",
                lead_organizer="Sanjay Rao (Festival Convener)",
                estimated_budget="₹ 3,50,000",
                collected_funds="₹ 2,90,000",
                status="Active",
                highlights="Clay Idol Sthapana, Daily Maha-Prasadam, 15+ Kids Stage Acts, 21kg Laddu Auction, Dhol-Tasha Visarjan"
            )
            fest2 = models.FestivalCelebrationModel(
                festival_name="Diwali Deepotsav & Gala Dinner 2026",
                start_date="2026-11-01",
                end_date="2026-11-02",
                location="Main Boulevard & Clubhouse Courtyard",
                description="10,000 Diyas illumination drive across all 6 towers, Rangoli mega-competition, eco-friendly laser light show, and grand dinner buffet.",
                lead_organizer="Meenakshi Sundaram",
                estimated_budget="₹ 4,20,000",
                collected_funds="₹ 1,50,000",
                status="Planning",
                highlights="Society-wide Diya Display, Inter-tower Rangoli Trophy, Eco-friendly Laser Night, Grand Dinner Buffet"
            )
            db.add_all([fest1, fest2])
            db.commit()
            db.refresh(fest1)
            db.refresh(fest2)

            # Add Collections
            db.add_all([
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower A", flat_no="301", donor_name="K. Venkat Rao",
                    amount=5000.0, payment_mode="UPI", transaction_ref="UPI/623490123/HDFC",
                    collected_date="2026-08-15", receipt_url="/receipts/REC_GANESH_01.pdf", notes="Festival voluntary seva"
                ),
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower B", flat_no="504", donor_name="M. Srinivas",
                    amount=11000.0, payment_mode="NetBanking", transaction_ref="NEFT/ICIC20260816",
                    collected_date="2026-08-16", receipt_url="/receipts/REC_GANESH_02.pdf", notes="Prasadam sponsorship"
                ),
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower C", flat_no="1102", donor_name="Ramesh Chandra",
                    amount=25000.0, payment_mode="UPI", transaction_ref="UPI/623490987/SBI",
                    collected_date="2026-08-18", receipt_url="/receipts/REC_GANESH_03.pdf", notes="Maha Laddu Auction pledge"
                ),
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower D", flat_no="204", donor_name="S. Narayanan",
                    amount=3500.0, payment_mode="UPI", transaction_ref="UPI/623491112/AXIS",
                    collected_date="2026-08-20", receipt_url="/receipts/REC_GANESH_04.pdf", notes="Resident contribution"
                ),
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower E", flat_no="702", donor_name="P. Kulkarni",
                    amount=4000.0, payment_mode="Cash", transaction_ref="CASH-REC-105",
                    collected_date="2026-08-21", receipt_url="/receipts/REC_GANESH_05.pdf", notes="Collected at Estate office"
                ),
                models.FestivalCollectionModel(
                    festival_id=fest1.id, tower="Tower F", flat_no="903", donor_name="Harish Gupta",
                    amount=5000.0, payment_mode="UPI", transaction_ref="UPI/623495544/GPay",
                    collected_date="2026-08-22", receipt_url="/receipts/REC_GANESH_06.pdf", notes="Cultural night sponsor"
                )
            ])

            # Add Expenses with Approver & Audit Proofs
            db.add_all([
                models.FestivalExpenseModel(
                    festival_id=fest1.id, title="Mandapam Stage Decor & Waterproof Canopy",
                    category="Decor", amount=65000.0, vendor_name="Sri Balaji Decorators & Lights",
                    bill_date="2026-08-18", invoice_url="/invoices/INV_BALAJI_MANDAP.pdf",
                    audit_evidence_notes="GST Bill attached. Physical inspection verified by Treasurer Vikram Patel.",
                    approver_name="Vikram Patel", approver_role="Treasurer", approval_status="Approved"
                ),
                models.FestivalExpenseModel(
                    festival_id=fest1.id, title="Eco-friendly Clay Ganesha Idol (8ft) + Puja Kit",
                    category="Pooja", amount=32000.0, vendor_name="Dhoolpet Clay Artisans Guild",
                    bill_date="2026-08-19", invoice_url="/invoices/INV_CLAY_IDOL_2026.pdf",
                    audit_evidence_notes="Eco-friendly clay certificate provided for PCB compliance.",
                    approver_name="Rajesh Sharma", approver_role="President", approval_status="Approved"
                ),
                models.FestivalExpenseModel(
                    festival_id=fest1.id, title="Digital Sound System, JBL Line Arrays & Lighting Setup",
                    category="Sound & Light", amount=45000.0, vendor_name="Surya Audio Visuals",
                    bill_date="2026-08-20", invoice_url="/invoices/INV_SURYA_SOUND.pdf",
                    audit_evidence_notes="5-day audio contract including DJ console for Visarjan.",
                    approver_name="Vikram Patel", approver_role="Treasurer", approval_status="Approved"
                ),
                models.FestivalExpenseModel(
                    festival_id=fest1.id, title="Day 1 & Day 2 Maha-Prasadam Buffet (1000 Pax)",
                    category="Food/Prasadam", amount=85000.0, vendor_name="Swagath Caterers & Sweets",
                    bill_date="2026-08-22", invoice_url="/invoices/INV_SWAGATH_PRASADAM.pdf",
                    audit_evidence_notes="Verified food quality and hygiene checklist signed by Joint Sec.",
                    approver_name="Ananya Roy", approver_role="General Secretary", approval_status="Approved"
                )
            ])
            db.commit()

        # 3. General Body Meetings (GBMs)
        if db.query(models.GeneralBodyMeetingModel).count() == 0:
            db.add_all([
                models.GeneralBodyMeetingModel(
                    meeting_title="5th Annual General Body Meeting (AGM 2026)",
                    meeting_type="AGM",
                    meeting_date="2026-07-26",
                    time="10:00 AM - 01:30 PM",
                    venue="Clubhouse Grand Banquet Hall & Zoom Live Hybrid",
                    quorum_status="Quorum Met (240 Owners)",
                    key_agenda="1. Audited FY25-26 Financials approval\n2. Sinking Fund allocation for Solar Plant\n3. Builder Handover punch-list status\n4. Approval of new security surveillance vendor\n5. Election of 3 replacement MC members",
                    resolutions_passed="Resolution 1: 120kW Rooftop Solar Installation approved by 88% majority.\nResolution 2: FY26-27 annual maintenance budget passed with zero increase.\nResolution 3: Legal notice authorization regarding builder delayed STP handover.",
                    minutes_summary="The AGM commenced with 240 registered owner representations. Treasurer presented audited balance sheet with ₹1.82 Cr corpus. All major resolutions passed.",
                    attendees_count=240,
                    doc_link="/docs/GBM_Minutes_AGM_2026_Approved.pdf"
                ),
                models.GeneralBodyMeetingModel(
                    meeting_title="Extraordinary General Body Meeting (EGM) - STP & Lift AMC Review",
                    meeting_type="EGM",
                    meeting_date="2026-05-10",
                    time="04:00 PM - 06:30 PM",
                    venue="Clubhouse Grand Banquet Hall",
                    quorum_status="Quorum Met (175 Owners)",
                    key_agenda="Emergency discussion on STP odor remediation, treated water dual-pipeline flushing, and negotiating long-term OEM Lift maintenance contract with Otis/Schindler.",
                    resolutions_passed="Authorised association to issue ₹6.5 Lakhs escrow release conditioned upon IGS completing STP microbial aerator overhaul within 30 days.",
                    minutes_summary="Detailed technical evaluation presented by Infrastructure Sub-committee. Clear SLAs mandated for Builder & IGS.",
                    attendees_count=175,
                    doc_link="/docs/EGM_Minutes_May_2026.pdf"
                )
            ])
            db.commit()

        # 4. Community Issues Tracker (Tower A to F, Clubhouse, Common Space)
        if db.query(models.CommunityIssueModel).count() == 0:
            db.add_all([
                models.CommunityIssueModel(
                    issue_code="ISS-TWA-101",
                    tower="Tower A",
                    flat_no="A-901",
                    flat_or_location="Tower A - Passenger Lift #2",
                    title="Passenger Lift #2 Jerking & Floor Leveling Offset",
                    category="Electrical & Lift",
                    reported_by="Kavita Reddy (A-901)",
                    priority="High",
                    status="Under Inspection",
                    assigned_to="Lift OEM / IGS Facility",
                    created_at="2026-08-18",
                    description="Lift stops with a 2-inch height discrepancy on 7th and 9th floors, causing tripping hazard.",
                    resolution_notes="OEM service engineers inspected encoder sensors. Replacement traction brake coil ordered."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-TWB-202",
                    tower="Tower B",
                    flat_no="B-404",
                    flat_or_location="Tower B - Basement-2 Ramp Lower Joint",
                    title="Basement-2 Ramp Joint Water Seepage during rains",
                    category="Civil & Seepage",
                    reported_by="Alok Srivastava (B-404)",
                    priority="Critical",
                    status="In Progress",
                    assigned_to="Builder Civil Engineering Cell",
                    created_at="2026-08-10",
                    description="Expansion joint between basement slabs shows active water drip during continuous rain.",
                    resolution_notes="Pressure grouting contractor mobilized; 3 out of 5 injection ports completed."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-TWC-303",
                    tower="Tower C",
                    flat_no="C-102",
                    flat_or_location="Tower C - Ground Floor Lobby Intercom",
                    title="Lobby Intercom connection static & audio drops",
                    category="Security & Access",
                    reported_by="Pooja Sharma (C-102)",
                    priority="Medium",
                    status="Open",
                    assigned_to="IGS IT & Security Desk",
                    created_at="2026-08-22",
                    description="Audio communication drops between guard booth and Tower C flats.",
                    resolution_notes="Fiber optic switch in Tower C riser scheduled for reboot and line test."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-TWD-404",
                    tower="Tower D",
                    flat_no="D-302",
                    flat_or_location="Tower D - Dual Flush Line Shaft",
                    title="STP Treated Water Odor in Flush Line",
                    category="STP & Water Supply",
                    reported_by="Mahesh Rao (D-302)",
                    priority="High",
                    status="In Progress",
                    assigned_to="IGS Water Operations Lead",
                    created_at="2026-08-20",
                    description="Treated flush water exhibits mild turbidity and chemical odor in lower floor toilets.",
                    resolution_notes="Activated carbon filter media replaced. Dosing pump calibration verified."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-TWE-505",
                    tower="Tower E",
                    flat_no="E-1102",
                    flat_or_location="Tower E - Corridors 11th Floor",
                    title="Emergency Exit Staircase Fire Door Closer Jammed",
                    category="Common Amenities",
                    reported_by="Vivek Varma (E-1102)",
                    priority="Medium",
                    status="Open",
                    assigned_to="Facility Maintenance Cell",
                    created_at="2026-08-24",
                    description="Hydraulic door closer on fire escape staircase stuck halfway.",
                    resolution_notes="Technician assigned with replacement hydraulic arm."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-TWF-606",
                    tower="Tower F",
                    flat_no="F-501",
                    flat_or_location="Tower F - Rainwater Downpipe Joint",
                    title="Rainwater Harvesting Pipe Dripping near Stilt Parking",
                    category="Civil & Seepage",
                    reported_by="D. Prasad (F-501)",
                    priority="Low",
                    status="Resolved",
                    assigned_to="IGS Plumbing Team",
                    created_at="2026-08-12",
                    description="Mild joint leakage at 6-inch PVC elbow in stilt parking bay #44.",
                    resolution_notes="Re-cemented solvent weld joint and tested under high-flow water. No further leak."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-CH-701",
                    tower="Clubhouse",
                    flat_no="CH-Gym",
                    flat_or_location="Clubhouse Fitness Center (1st Floor)",
                    title="Gym Treadmill #3 Motor Inverter Fault",
                    category="Common Amenities",
                    reported_by="Rohan Joshi (B-1102)",
                    priority="Low",
                    status="Resolved",
                    assigned_to="Facility Maintenance Desk",
                    created_at="2026-08-05",
                    description="Treadmill speed sensor throwing Error E-02 during incline adjustments.",
                    resolution_notes="Technician replaced DC motor brushes and recalibrated digital console."
                ),
                models.CommunityIssueModel(
                    issue_code="ISS-CS-801",
                    tower="Common Space",
                    flat_no="Gate 2",
                    flat_or_location="Gate 2 & Children Play Area",
                    title="CCTV Blind Spot near Children Play Area & Gate 2",
                    category="Security & Access",
                    reported_by="Rajesh Sharma (President)",
                    priority="Medium",
                    status="Open",
                    assigned_to="Association IT & Security Head",
                    created_at="2026-08-22",
                    description="Tree branch overgrowth occludes 4MP PTZ camera angle covering the toddler play swings.",
                    resolution_notes="Scheduled for camera realignment and horticulture pruning on Saturday morning."
                )
            ])
            db.commit()

        # 5. ADO Tasks with Comments & Audit Attachments (Builder & IGS)
        if db.query(models.ADOTaskModel).count() == 0:
            task1 = models.ADOTaskModel(
                task_code="ADO-101",
                title="Basement Waterproofing & Crack Injection Rectification",
                assigned_to="Builder",
                entity_type="Builder",
                category="Seepage & Waterproofing",
                status="Active",
                priority="Critical",
                assignee_name="Er. K. Verma (Builder Project Head)",
                due_date="2026-09-15",
                sla_days=14,
                blockers="Awaiting polyurethane specialized sealant delivery from Bengaluru distributor.",
                description="Complete structural PU injection grouting along 120 running meters of basement expansion joints in Tower B & C.",
                completion_percentage=65,
                tags="Handover, Structural, Warranty"
            )
            task2 = models.ADOTaskModel(
                task_code="ADO-102",
                title="Final Fire NOC Compliance & Hydrant Flow Calibration",
                assigned_to="Builder",
                entity_type="Builder",
                category="Fire NOC & Compliance",
                status="Active",
                priority="Critical",
                assignee_name="Mr. D. Srinivasan (Builder Liaison)",
                due_date="2026-09-30",
                sla_days=30,
                blockers="Final inspection joint certificate with Telangana Fire Department pending signature.",
                description="Pressure testing of 24 riser shafts across Towers A-F, jockey pump automated switch-over check, and statutory certificate.",
                completion_percentage=80,
                tags="Statutory, Fire Safety, NOC"
            )
            task3 = models.ADOTaskModel(
                task_code="ADO-103",
                title="STP Biological Oxygen Demand (BOD) Testing & IGS Handover",
                assigned_to="IGS",
                entity_type="IGS",
                category="STP & WTP Operations",
                status="Active",
                priority="High",
                assignee_name="Mr. Suresh R. (IGS Technical Ops)",
                due_date="2026-09-10",
                sla_days=7,
                blockers="None. Aeration tank bacterial culture dosing in stabilization phase.",
                description="Achieve continuous BOD < 10 ppm and COD < 50 ppm output compliance as mandated by PCB guidelines.",
                completion_percentage=75,
                tags="STP, IGS, Environment"
            )
            task4 = models.ADOTaskModel(
                task_code="ADO-104",
                title="Boom Barrier RFID Tag Sync with MyGate & ANPR System",
                assigned_to="IGS",
                entity_type="IGS",
                category="CCTV & Gate Automation",
                status="Resolved",
                priority="High",
                assignee_name="Kishore N. (IGS IT & Security)",
                due_date="2026-08-25",
                sla_days=5,
                blockers="Resolved successfully.",
                description="Integrate automated fast-tag recognition on Gate 1 & 2 boom barriers for resident 4-wheelers across all 6 towers.",
                completion_percentage=100,
                tags="Security, Automation, RFID"
            )
            db.add_all([task1, task2, task3, task4])
            db.commit()
            db.refresh(task1)
            db.refresh(task2)
            db.refresh(task3)
            db.refresh(task4)

            # Add Discussion Comments
            db.add_all([
                models.ADOCommentModel(
                    task_id=task1.id, author_name="Karthik Venkatesh", author_role="MC Maintenance Lead",
                    comment_text="Joint inspection conducted on Tower B Basement-2 ramp with Er. Verma. Marked 14 drill spots for PU injection.",
                    created_at="2026-08-16 11:30 AM"
                ),
                models.ADOCommentModel(
                    task_id=task1.id, author_name="Er. K. Verma", author_role="Builder Project Head",
                    comment_text="First round of grouting complete on 8 spots. Secondary coating will begin once polyurethane batch arrives on Thursday.",
                    created_at="2026-08-19 04:15 PM"
                ),
                models.ADOCommentModel(
                    task_id=task3.id, author_name="Mr. Suresh R.", author_role="IGS Technical Ops",
                    comment_text="Water test samples collected from dual STP outlet tank. Lab report from NABL lab expected in 48 hours.",
                    created_at="2026-08-21 02:00 PM"
                )
            ])

            # Add Evidence Attachments
            db.add_all([
                models.ADOAttachmentModel(
                    task_id=task1.id, file_name="Basement_Crack_Inspection_Photos_Aug2026.pdf",
                    file_url="/evidence/Basement_Inspection_Aug2026.pdf",
                    description="High-resolution crack survey photos along Tower B & C ramp joint",
                    uploaded_by="Karthik Venkatesh (MC)", created_at="2026-08-16"
                ),
                models.ADOAttachmentModel(
                    task_id=task2.id, file_name="Fire_Riser_Pressure_Flow_Test_Report_Towers_A_F.pdf",
                    file_url="/evidence/Fire_Riser_Test_Report.pdf",
                    description="Signed hydrostatic test certificate by certified Fire Safety Engineer",
                    uploaded_by="Mr. D. Srinivasan (Builder)", created_at="2026-08-18"
                ),
                models.ADOAttachmentModel(
                    task_id=task3.id, file_name="STP_Treated_Water_NABL_Lab_Report_Aug2026.pdf",
                    file_url="/evidence/STP_Lab_Report_Aug2026.pdf",
                    description="PCB parameter certificate showing BOD 8.2 ppm and COD 42 ppm",
                    uploaded_by="Mr. Suresh R. (IGS)", created_at="2026-08-22"
                )
            ])
            db.commit()

        # 6. Team Members (Jaitra Association Committee across Towers A-F)
        if db.query(models.TeamMemberModel).count() == 0:
            db.add_all([
                models.TeamMemberModel(
                    name="Rajesh Sharma", role="President", wing_flat="Tower A - 1204", tower="Tower A",
                    contact="+91 98450 71001", email="president@jaitra.org", term="2025-2027",
                    sub_committee="Executive & Governance", status="Active"
                ),
                models.TeamMemberModel(
                    name="Col. R. S. Rathore (Retd.)", role="Vice President", wing_flat="Tower E - 1401", tower="Tower E",
                    contact="+91 98110 54321", email="vp@jaitra.org", term="2025-2027",
                    sub_committee="Security & Estate Management", status="Active"
                ),
                models.TeamMemberModel(
                    name="Ananya Roy", role="General Secretary", wing_flat="Tower C - 802", tower="Tower C",
                    contact="+91 99800 23412", email="secretary@jaitra.org", term="2025-2027",
                    sub_committee="Legal, Compliance & Admin", status="Active"
                ),
                models.TeamMemberModel(
                    name="Meenakshi Sundaram", role="Joint Secretary", wing_flat="Tower B - 1103", tower="Tower B",
                    contact="+91 94440 67890", email="jointsec@jaitra.org", term="2025-2027",
                    sub_committee="Community Relations & PR", status="Active"
                ),
                models.TeamMemberModel(
                    name="Vikram Patel", role="Treasurer", wing_flat="Tower B - 501", tower="Tower B",
                    contact="+91 97411 98765", email="treasurer@jaitra.org", term="2025-2027",
                    sub_committee="Finance, Audit & Corpus", status="Active"
                ),
                models.TeamMemberModel(
                    name="Praveen Kumar", role="Joint Treasurer", wing_flat="Tower D - 704", tower="Tower D",
                    contact="+91 96500 12389", email="jointtreasurer@jaitra.org", term="2025-2027",
                    sub_committee="Billing & Vendor Escrow", status="Active"
                ),
                models.TeamMemberModel(
                    name="Dr. Swati Sen", role="Cultural Committee Head", wing_flat="Tower A - 302", tower="Tower A",
                    contact="+91 98451 22334", email="cultural@jaitra.org", term="2025-2027",
                    sub_committee="Events, Festivals & Arts", status="Active"
                ),
                models.TeamMemberModel(
                    name="Vivek Murthy", role="Sports & Amenities Head", wing_flat="Tower C - 404", tower="Tower C",
                    contact="+91 98860 99887", email="sports@jaitra.org", term="2025-2027",
                    sub_committee="Clubhouse, Gym & Grounds", status="Active"
                ),
                models.TeamMemberModel(
                    name="Karthik Venkatesh", role="Facility & Maintenance Lead", wing_flat="Tower D - 1002", tower="Tower D",
                    contact="+91 97312 88442", email="maintenance@jaitra.org", term="2025-2027",
                    sub_committee="Builder Handover & IGS Oversight", status="Active"
                ),
                models.TeamMemberModel(
                    name="G. Somasekhar", role="Block Representative (Tower F)", wing_flat="Tower F - 604", tower="Tower F",
                    contact="+91 99440 12345", email="towerf@jaitra.org", term="2025-2027",
                    sub_committee="Resident Welfare & Elevators", status="Active"
                )
            ])
            db.commit()
    except Exception as e:
        db.rollback()
        print("Error during seed initialization:", e)


# ----------------- STATS / OVERVIEW -----------------

@app.get("/api/stats")
def get_society_stats(db: Session = Depends(get_db)):
    events_count = db.query(models.CulturalEventModel).count()
    festivals_count = db.query(models.FestivalCelebrationModel).count()
    meetings_count = db.query(models.GeneralBodyMeetingModel).count()
    issues = db.query(models.CommunityIssueModel).all()
    tasks = db.query(models.ADOTaskModel).all()
    team_count = db.query(models.TeamMemberModel).count()

    builder_tasks = [t for t in tasks if t.assigned_to == "Builder" or t.entity_type == "Builder"]
    igs_tasks = [t for t in tasks if t.assigned_to == "IGS" or t.entity_type == "IGS"]
    open_issues = [i for i in issues if i.status in ["Open", "In Progress", "Under Inspection"]]

    # Tower breakdown for issues
    towers = ["Tower A", "Tower B", "Tower C", "Tower D", "Tower E", "Tower F", "Clubhouse", "Common Space"]
    tower_issue_counts = {t: len([i for i in issues if i.tower == t]) for t in towers}

    return {
        "cultural_events_count": events_count,
        "festivals_count": festivals_count,
        "meetings_count": meetings_count,
        "total_issues": len(issues),
        "open_issues_count": len(open_issues),
        "total_ado_tasks": len(tasks),
        "builder_tasks_count": len(builder_tasks),
        "igs_tasks_count": len(igs_tasks),
        "active_ado_tasks": len([t for t in tasks if t.status in ["New", "Active"]]),
        "resolved_ado_tasks": len([t for t in tasks if t.status in ["Resolved", "Closed"]]),
        "team_members_count": team_count,
        "tower_issue_counts": tower_issue_counts,
        "society_name": "Jaitra Residents Welfare Association",
        "total_towers": 6
    }


# ----------------- 1. FESTIVALS & FINANCIAL AUDIT ROUTES -----------------

@app.get("/api/festivals", response_model=List[FestivalCelebrationSchema])
def get_festivals(status: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.FestivalCelebrationModel).options(
        joinedload(models.FestivalCelebrationModel.collections),
        joinedload(models.FestivalCelebrationModel.expenses)
    )
    if status and status != "All":
        query = query.filter(models.FestivalCelebrationModel.status == status)
    return query.order_by(models.FestivalCelebrationModel.id.desc()).all()

@app.get("/api/festivals/{fest_id}", response_model=FestivalCelebrationSchema)
def get_festival(fest_id: int, db: Session = Depends(get_db)):
    db_fest = db.query(models.FestivalCelebrationModel).options(
        joinedload(models.FestivalCelebrationModel.collections),
        joinedload(models.FestivalCelebrationModel.expenses)
    ).filter(models.FestivalCelebrationModel.id == fest_id).first()
    if not db_fest:
        raise HTTPException(status_code=404, detail="Festival not found")
    return db_fest

@app.post("/api/festivals", response_model=FestivalCelebrationSchema)
def create_festival(fest: FestivalCelebrationCreate, db: Session = Depends(get_db)):
    new_fest = models.FestivalCelebrationModel(**fest.model_dump())
    db.add(new_fest)
    db.commit()
    db.refresh(new_fest)
    return new_fest

@app.put("/api/festivals/{fest_id}", response_model=FestivalCelebrationSchema)
def update_festival(fest_id: int, fest: FestivalCelebrationCreate, db: Session = Depends(get_db)):
    db_fest = db.query(models.FestivalCelebrationModel).filter(models.FestivalCelebrationModel.id == fest_id).first()
    if not db_fest:
        raise HTTPException(status_code=404, detail="Festival not found")
    for key, value in fest.model_dump().items():
        if value is not None:
            setattr(db_fest, key, value)
    db.commit()
    db.refresh(db_fest)
    return db_fest

@app.delete("/api/festivals/{fest_id}")
def delete_festival(fest_id: int, db: Session = Depends(get_db)):
    db_fest = db.query(models.FestivalCelebrationModel).filter(models.FestivalCelebrationModel.id == fest_id).first()
    if not db_fest:
        raise HTTPException(status_code=404, detail="Festival not found")
    db.delete(db_fest)
    db.commit()
    return {"message": "Festival deleted successfully"}

# Collections
@app.post("/api/festivals/{fest_id}/collections", response_model=FestivalCollectionSchema)
def add_festival_collection(fest_id: int, coll: FestivalCollectionCreate, db: Session = Depends(get_db)):
    db_fest = db.query(models.FestivalCelebrationModel).filter(models.FestivalCelebrationModel.id == fest_id).first()
    if not db_fest:
        raise HTTPException(status_code=404, detail="Festival not found")
    data = coll.model_dump()
    if not data.get("collected_date"):
        data["collected_date"] = datetime.date.today().isoformat()
    new_coll = models.FestivalCollectionModel(festival_id=fest_id, **data)
    db.add(new_coll)
    db.commit()
    db.refresh(new_coll)
    return new_coll

@app.delete("/api/festivals/collections/{collection_id}")
def delete_festival_collection(collection_id: int, db: Session = Depends(get_db)):
    db_coll = db.query(models.FestivalCollectionModel).filter(models.FestivalCollectionModel.id == collection_id).first()
    if not db_coll:
        raise HTTPException(status_code=404, detail="Collection entry not found")
    db.delete(db_coll)
    db.commit()
    return {"message": "Collection record deleted"}

# Expenses
@app.post("/api/festivals/{fest_id}/expenses", response_model=FestivalExpenseSchema)
def add_festival_expense(fest_id: int, exp: FestivalExpenseCreate, db: Session = Depends(get_db)):
    db_fest = db.query(models.FestivalCelebrationModel).filter(models.FestivalCelebrationModel.id == fest_id).first()
    if not db_fest:
        raise HTTPException(status_code=404, detail="Festival not found")
    data = exp.model_dump()
    new_exp = models.FestivalExpenseModel(festival_id=fest_id, **data)
    db.add(new_exp)
    db.commit()
    db.refresh(new_exp)
    return new_exp

@app.patch("/api/festivals/expenses/{expense_id}/status", response_model=FestivalExpenseSchema)
def update_expense_approval_status(expense_id: int, status_update: FestivalExpenseStatusUpdate, db: Session = Depends(get_db)):
    db_exp = db.query(models.FestivalExpenseModel).filter(models.FestivalExpenseModel.id == expense_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Expense entry not found")
    db_exp.approval_status = status_update.approval_status
    if status_update.approver_name:
        db_exp.approver_name = status_update.approver_name
    db.commit()
    db.refresh(db_exp)
    return db_exp

@app.delete("/api/festivals/expenses/{expense_id}")
def delete_festival_expense(expense_id: int, db: Session = Depends(get_db)):
    db_exp = db.query(models.FestivalExpenseModel).filter(models.FestivalExpenseModel.id == expense_id).first()
    if not db_exp:
        raise HTTPException(status_code=404, detail="Expense entry not found")
    db.delete(db_exp)
    db.commit()
    return {"message": "Expense record deleted"}


# ----------------- 2. CULTURAL EVENTS, PARTICIPANTS & AGENDAS -----------------

@app.get("/api/cultural-events", response_model=List[CulturalEventSchema])
def get_cultural_events(
    status: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CulturalEventModel).options(
        joinedload(models.CulturalEventModel.participants),
        joinedload(models.CulturalEventModel.agendas)
    )
    if status and status != "All":
        query = query.filter(models.CulturalEventModel.status == status)
    if category and category != "All":
        query = query.filter(models.CulturalEventModel.category == category)
    return query.order_by(models.CulturalEventModel.id.desc()).all()

@app.get("/api/cultural-events/{event_id}", response_model=CulturalEventSchema)
def get_cultural_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.CulturalEventModel).options(
        joinedload(models.CulturalEventModel.participants),
        joinedload(models.CulturalEventModel.agendas)
    ).filter(models.CulturalEventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event

@app.post("/api/cultural-events", response_model=CulturalEventSchema)
def create_cultural_event(event: CulturalEventCreate, db: Session = Depends(get_db)):
    new_event = models.CulturalEventModel(**event.model_dump())
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event

@app.put("/api/cultural-events/{event_id}", response_model=CulturalEventSchema)
def update_cultural_event(event_id: int, event: CulturalEventCreate, db: Session = Depends(get_db)):
    db_event = db.query(models.CulturalEventModel).filter(models.CulturalEventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    for key, value in event.model_dump().items():
        if value is not None:
            setattr(db_event, key, value)
    db.commit()
    db.refresh(db_event)
    return db_event

@app.delete("/api/cultural-events/{event_id}")
def delete_cultural_event(event_id: int, db: Session = Depends(get_db)):
    db_event = db.query(models.CulturalEventModel).filter(models.CulturalEventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    db.delete(db_event)
    db.commit()
    return {"message": "Event deleted successfully"}

# Participants
@app.post("/api/cultural-events/{event_id}/participants", response_model=CulturalParticipantSchema)
def add_participant(event_id: int, part: CulturalParticipantCreate, db: Session = Depends(get_db)):
    db_event = db.query(models.CulturalEventModel).filter(models.CulturalEventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Cultural event not found")
    data = part.model_dump()
    if not data.get("registration_date"):
        data["registration_date"] = datetime.date.today().isoformat()
    new_part = models.CulturalParticipantModel(event_id=event_id, **data)
    db.add(new_part)
    db_event.registered_count = (db_event.registered_count or 0) + 1
    db.commit()
    db.refresh(new_part)
    return new_part

@app.delete("/api/cultural-events/participants/{participant_id}")
def delete_participant(participant_id: int, db: Session = Depends(get_db)):
    db_part = db.query(models.CulturalParticipantModel).filter(models.CulturalParticipantModel.id == participant_id).first()
    if not db_part:
        raise HTTPException(status_code=404, detail="Participant not found")
    db_event = db.query(models.CulturalEventModel).filter(models.CulturalEventModel.id == db_part.event_id).first()
    if db_event and db_event.registered_count > 0:
        db_event.registered_count -= 1
    db.delete(db_part)
    db.commit()
    return {"message": "Participant deleted"}

# Agendas
@app.post("/api/cultural-events/{event_id}/agendas", response_model=CulturalAgendaSchema)
def add_agenda_item(event_id: int, agenda: CulturalAgendaCreate, db: Session = Depends(get_db)):
    db_event = db.query(models.CulturalEventModel).filter(models.CulturalEventModel.id == event_id).first()
    if not db_event:
        raise HTTPException(status_code=404, detail="Cultural event not found")
    new_ag = models.CulturalAgendaModel(event_id=event_id, **agenda.model_dump())
    db.add(new_ag)
    db.commit()
    db.refresh(new_ag)
    return new_ag

@app.delete("/api/cultural-events/agendas/{agenda_id}")
def delete_agenda_item(agenda_id: int, db: Session = Depends(get_db)):
    db_ag = db.query(models.CulturalAgendaModel).filter(models.CulturalAgendaModel.id == agenda_id).first()
    if not db_ag:
        raise HTTPException(status_code=404, detail="Agenda item not found")
    db.delete(db_ag)
    db.commit()
    return {"message": "Agenda item deleted"}


# ----------------- 3. GENERAL BODY MEETINGS -----------------

@app.get("/api/meetings", response_model=List[GeneralBodyMeetingSchema])
def get_meetings(meeting_type: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.GeneralBodyMeetingModel)
    if meeting_type and meeting_type != "All":
        query = query.filter(models.GeneralBodyMeetingModel.meeting_type == meeting_type)
    return query.order_by(models.GeneralBodyMeetingModel.id.desc()).all()

@app.get("/api/meetings/{meeting_id}", response_model=GeneralBodyMeetingSchema)
def get_meeting(meeting_id: int, db: Session = Depends(get_db)):
    db_m = db.query(models.GeneralBodyMeetingModel).filter(models.GeneralBodyMeetingModel.id == meeting_id).first()
    if not db_m:
        raise HTTPException(status_code=404, detail="Meeting not found")
    return db_m

@app.post("/api/meetings", response_model=GeneralBodyMeetingSchema)
def create_meeting(meeting: GeneralBodyMeetingCreate, db: Session = Depends(get_db)):
    new_meeting = models.GeneralBodyMeetingModel(**meeting.model_dump())
    db.add(new_meeting)
    db.commit()
    db.refresh(new_meeting)
    return new_meeting

@app.put("/api/meetings/{meeting_id}", response_model=GeneralBodyMeetingSchema)
def update_meeting(meeting_id: int, meeting: GeneralBodyMeetingCreate, db: Session = Depends(get_db)):
    db_meeting = db.query(models.GeneralBodyMeetingModel).filter(models.GeneralBodyMeetingModel.id == meeting_id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    for key, value in meeting.model_dump().items():
        if value is not None:
            setattr(db_meeting, key, value)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

@app.delete("/api/meetings/{meeting_id}")
def delete_meeting(meeting_id: int, db: Session = Depends(get_db)):
    db_meeting = db.query(models.GeneralBodyMeetingModel).filter(models.GeneralBodyMeetingModel.id == meeting_id).first()
    if not db_meeting:
        raise HTTPException(status_code=404, detail="Meeting not found")
    db.delete(db_meeting)
    db.commit()
    return {"message": "Meeting record deleted successfully"}


# ----------------- 4. COMMUNITY ISSUES (TOWER LEVEL A-F, CH, CS) -----------------

@app.get("/api/issues", response_model=List[CommunityIssueSchema])
def get_issues(
    tower: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.CommunityIssueModel)
    if tower and tower != "All":
        query = query.filter(models.CommunityIssueModel.tower == tower)
    if status and status != "All":
        query = query.filter(models.CommunityIssueModel.status == status)
    if priority and priority != "All":
        query = query.filter(models.CommunityIssueModel.priority == priority)
    if category and category != "All":
        query = query.filter(models.CommunityIssueModel.category == category)
    return query.order_by(models.CommunityIssueModel.id.desc()).all()

@app.post("/api/issues", response_model=CommunityIssueSchema)
def create_issue(issue: CommunityIssueCreate, db: Session = Depends(get_db)):
    data = issue.model_dump()
    if not data.get("issue_code"):
        tower_prefix = "TWA"
        if "Tower B" in data.get("tower", ""): tower_prefix = "TWB"
        elif "Tower C" in data.get("tower", ""): tower_prefix = "TWC"
        elif "Tower D" in data.get("tower", ""): tower_prefix = "TWD"
        elif "Tower E" in data.get("tower", ""): tower_prefix = "TWE"
        elif "Tower F" in data.get("tower", ""): tower_prefix = "TWF"
        elif "Clubhouse" in data.get("tower", ""): tower_prefix = "CH"
        elif "Common" in data.get("tower", ""): tower_prefix = "CS"
        count = db.query(models.CommunityIssueModel).count() + 1
        data["issue_code"] = f"ISS-{tower_prefix}-{100 + count}"
    if not data.get("created_at"):
        data["created_at"] = datetime.date.today().isoformat()
    new_issue = models.CommunityIssueModel(**data)
    db.add(new_issue)
    db.commit()
    db.refresh(new_issue)
    return new_issue

@app.put("/api/issues/{issue_id}", response_model=CommunityIssueSchema)
def update_issue(issue_id: int, issue: CommunityIssueCreate, db: Session = Depends(get_db)):
    db_issue = db.query(models.CommunityIssueModel).filter(models.CommunityIssueModel.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    for key, value in issue.model_dump().items():
        if key in ["issue_code", "created_at"] and (value is None or value == ""):
            continue
        if value is not None:
            setattr(db_issue, key, value)
    db.commit()
    db.refresh(db_issue)
    return db_issue

@app.delete("/api/issues/{issue_id}")
def delete_issue(issue_id: int, db: Session = Depends(get_db)):
    db_issue = db.query(models.CommunityIssueModel).filter(models.CommunityIssueModel.id == issue_id).first()
    if not db_issue:
        raise HTTPException(status_code=404, detail="Issue not found")
    db.delete(db_issue)
    db.commit()
    return {"message": "Issue deleted successfully"}


# ----------------- 5. ADO TASKS, COMMENTS & ATTACHMENTS (BUILDER & IGS) -----------------

@app.get("/api/tasks", response_model=List[ADOTaskSchema])
def get_ado_tasks(
    assigned_to: Optional[str] = None,
    entity_type: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ADOTaskModel).options(
        joinedload(models.ADOTaskModel.comments),
        joinedload(models.ADOTaskModel.attachments)
    )
    if assigned_to and assigned_to != "All":
        query = query.filter(models.ADOTaskModel.assigned_to == assigned_to)
    if entity_type and entity_type != "All":
        query = query.filter(models.ADOTaskModel.entity_type == entity_type)
    if status and status != "All":
        query = query.filter(models.ADOTaskModel.status == status)
    if priority and priority != "All":
        query = query.filter(models.ADOTaskModel.priority == priority)
    return query.order_by(models.ADOTaskModel.id.asc()).all()

@app.get("/api/tasks/{task_id}", response_model=ADOTaskSchema)
def get_ado_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).options(
        joinedload(models.ADOTaskModel.comments),
        joinedload(models.ADOTaskModel.attachments)
    ).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db_task

@app.post("/api/tasks", response_model=ADOTaskSchema)
def create_ado_task(task: ADOTaskCreate, db: Session = Depends(get_db)):
    data = task.model_dump()
    if not data.get("task_code"):
        count = db.query(models.ADOTaskModel).count() + 1
        data["task_code"] = f"ADO-{100 + count}"
    new_task = models.ADOTaskModel(**data)
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

@app.put("/api/tasks/{task_id}", response_model=ADOTaskSchema)
def update_ado_task(task_id: int, task: ADOTaskCreate, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    for key, value in task.model_dump().items():
        if key == "task_code" and (value is None or value == ""):
            continue
        if value is not None:
            setattr(db_task, key, value)
    db.commit()
    db.refresh(db_task)
    return db_task

@app.patch("/api/tasks/{task_id}/status", response_model=ADOTaskSchema)
def update_task_status(task_id: int, update_data: ADOTaskStatusUpdate, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db_task.status = update_data.status
    if update_data.completion_percentage is not None:
        db_task.completion_percentage = update_data.completion_percentage
    elif update_data.status in ["Resolved", "Closed"]:
        db_task.completion_percentage = 100
    elif update_data.status == "New":
        db_task.completion_percentage = 0
    if update_data.blockers is not None:
        db_task.blockers = update_data.blockers
    db.commit()
    db.refresh(db_task)
    return db_task

@app.delete("/api/tasks/{task_id}")
def delete_ado_task(task_id: int, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(db_task)
    db.commit()
    return {"message": "ADO task deleted"}

# Comments / Discussions
@app.post("/api/tasks/{task_id}/comments", response_model=ADOCommentSchema)
def add_task_comment(task_id: int, comment: ADOCommentCreate, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    data = comment.model_dump()
    if not data.get("created_at"):
        data["created_at"] = datetime.datetime.now().strftime("%Y-%m-%d %I:%M %p")
    new_comment = models.ADOCommentModel(task_id=task_id, **data)
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    return new_comment

# Attachments / Evidence Proofs
@app.post("/api/tasks/{task_id}/attachments", response_model=ADOAttachmentSchema)
def add_task_attachment(task_id: int, att: ADOAttachmentCreate, db: Session = Depends(get_db)):
    db_task = db.query(models.ADOTaskModel).filter(models.ADOTaskModel.id == task_id).first()
    if not db_task:
        raise HTTPException(status_code=404, detail="Task not found")
    data = att.model_dump()
    if not data.get("created_at"):
        data["created_at"] = datetime.date.today().isoformat()
    new_att = models.ADOAttachmentModel(task_id=task_id, **data)
    db.add(new_att)
    db.commit()
    db.refresh(new_att)
    return new_att

@app.delete("/api/tasks/attachments/{attachment_id}")
def delete_task_attachment(attachment_id: int, db: Session = Depends(get_db)):
    db_att = db.query(models.ADOAttachmentModel).filter(models.ADOAttachmentModel.id == attachment_id).first()
    if not db_att:
        raise HTTPException(status_code=404, detail="Attachment not found")
    db.delete(db_att)
    db.commit()
    return {"message": "Attachment deleted"}


# ----------------- 6. TEAM MEMBERS -----------------

@app.get("/api/team", response_model=List[TeamMemberSchema])
def get_team(status: Optional[str] = None, tower: Optional[str] = None, db: Session = Depends(get_db)):
    query = db.query(models.TeamMemberModel)
    if status and status != "All":
        query = query.filter(models.TeamMemberModel.status == status)
    if tower and tower != "All":
        query = query.filter(models.TeamMemberModel.tower == tower)
    return query.order_by(models.TeamMemberModel.id.asc()).all()

@app.post("/api/team", response_model=TeamMemberSchema)
def add_team_member(member: TeamMemberCreate, db: Session = Depends(get_db)):
    new_member = models.TeamMemberModel(**member.model_dump())
    db.add(new_member)
    db.commit()
    db.refresh(new_member)
    return new_member

@app.put("/api/team/{member_id}", response_model=TeamMemberSchema)
def update_team_member(member_id: int, member: TeamMemberCreate, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMemberModel).filter(models.TeamMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    for key, value in member.model_dump().items():
        if value is not None:
            setattr(db_member, key, value)
    db.commit()
    db.refresh(db_member)
    return db_member

@app.delete("/api/team/{member_id}")
def delete_team_member(member_id: int, db: Session = Depends(get_db)):
    db_member = db.query(models.TeamMemberModel).filter(models.TeamMemberModel.id == member_id).first()
    if not db_member:
        raise HTTPException(status_code=404, detail="Team member not found")
    db.delete(db_member)
    db.commit()
    return {"message": "Team member deleted"}
