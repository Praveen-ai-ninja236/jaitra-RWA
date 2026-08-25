-- ==============================================================================
-- JAITRA RESIDENTS WELFARE ASSOCIATION (TOWERS A - F)
-- COMPLETE POSTGRESQL DATABASE SCHEMA & SEED DATA SCRIPT
-- Database: jaitra_db | Owner: postgres
-- ==============================================================================

-- Optional: Ensure postgres user password matches application backend
ALTER USER postgres WITH PASSWORD 'postgres';

-- Drop existing tables if re-initializing
DROP TABLE IF EXISTS ado_attachments CASCADE;
DROP TABLE IF EXISTS ado_comments CASCADE;
DROP TABLE IF EXISTS ado_tasks CASCADE;
DROP TABLE IF EXISTS community_issues CASCADE;
DROP TABLE IF EXISTS gbm_meetings CASCADE;
DROP TABLE IF EXISTS cultural_agendas CASCADE;
DROP TABLE IF EXISTS cultural_participants CASCADE;
DROP TABLE IF EXISTS cultural_events CASCADE;
DROP TABLE IF EXISTS festival_expenses CASCADE;
DROP TABLE IF EXISTS festival_collections CASCADE;
DROP TABLE IF EXISTS festival_celebrations CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;

-- ------------------------------------------------------------------------------
-- 1. FESTIVAL CELEBRATIONS & FINANCIAL AUDIT (COLLECTIONS & EXPENSES)
-- ------------------------------------------------------------------------------

CREATE TABLE festival_celebrations (
    id SERIAL PRIMARY KEY,
    festival_name VARCHAR(200) NOT NULL,
    start_date VARCHAR(50) NOT NULL,
    end_date VARCHAR(50) NOT NULL,
    location VARCHAR(150) NOT NULL,
    description TEXT,
    lead_organizer VARCHAR(100) NOT NULL,
    estimated_budget VARCHAR(50),
    collected_funds VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Planning',
    highlights TEXT
);

CREATE TABLE festival_collections (
    id SERIAL PRIMARY KEY,
    festival_id INTEGER NOT NULL REFERENCES festival_celebrations(id) ON DELETE CASCADE,
    tower VARCHAR(50) NOT NULL,
    flat_no VARCHAR(50) NOT NULL,
    donor_name VARCHAR(100) NOT NULL,
    amount DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    payment_mode VARCHAR(50) DEFAULT 'UPI',
    transaction_ref VARCHAR(100),
    collected_date VARCHAR(50) NOT NULL,
    receipt_url VARCHAR(255),
    notes TEXT
);

CREATE TABLE festival_expenses (
    id SERIAL PRIMARY KEY,
    festival_id INTEGER NOT NULL REFERENCES festival_celebrations(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    vendor_name VARCHAR(150),
    bill_date VARCHAR(50) NOT NULL,
    invoice_url VARCHAR(255),
    audit_evidence_notes TEXT,
    approver_name VARCHAR(100) NOT NULL,
    approver_role VARCHAR(100) DEFAULT 'Treasurer',
    approval_status VARCHAR(50) DEFAULT 'Approved'
);

-- ------------------------------------------------------------------------------
-- 2. CULTURAL EVENTS, PARTICIPANTS & AGENDAS
-- ------------------------------------------------------------------------------

CREATE TABLE cultural_events (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    event_date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    description TEXT,
    coordinator VARCHAR(100) NOT NULL,
    coordinator_contact VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Upcoming',
    registered_count INTEGER DEFAULT 0,
    budget VARCHAR(50)
);

CREATE TABLE cultural_participants (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES cultural_events(id) ON DELETE CASCADE,
    tower VARCHAR(50) NOT NULL,
    flat_no VARCHAR(50) NOT NULL,
    participant_name VARCHAR(100) NOT NULL,
    age_group VARCHAR(50) DEFAULT 'Adult',
    activity_category VARCHAR(100) NOT NULL,
    contact_no VARCHAR(50),
    notes TEXT,
    registration_date VARCHAR(50) NOT NULL
);

CREATE TABLE cultural_agendas (
    id SERIAL PRIMARY KEY,
    event_id INTEGER NOT NULL REFERENCES cultural_events(id) ON DELETE CASCADE,
    slot_time VARCHAR(50) NOT NULL,
    performer_or_speaker VARCHAR(150) NOT NULL,
    activity_topic VARCHAR(200) NOT NULL,
    stage_coordinator VARCHAR(100),
    duration_mins INTEGER DEFAULT 30
);

-- ------------------------------------------------------------------------------
-- 3. GENERAL BODY MEETINGS (GBMs)
-- ------------------------------------------------------------------------------

CREATE TABLE gbm_meetings (
    id SERIAL PRIMARY KEY,
    meeting_title VARCHAR(200) NOT NULL,
    meeting_type VARCHAR(100) NOT NULL,
    meeting_date VARCHAR(50) NOT NULL,
    time VARCHAR(50) NOT NULL,
    venue VARCHAR(150) NOT NULL,
    quorum_status VARCHAR(50) DEFAULT 'Quorum Met',
    key_agenda TEXT,
    resolutions_passed TEXT,
    minutes_summary TEXT,
    attendees_count INTEGER DEFAULT 0,
    doc_link VARCHAR(255)
);

-- ------------------------------------------------------------------------------
-- 4. COMMUNITY ISSUES (TOWERS A - F, CLUBHOUSE & COMMON SPACE)
-- ------------------------------------------------------------------------------

CREATE TABLE community_issues (
    id SERIAL PRIMARY KEY,
    issue_code VARCHAR(50) UNIQUE,
    tower VARCHAR(50) NOT NULL DEFAULT 'Tower A',
    flat_no VARCHAR(50),
    flat_or_location VARCHAR(150) NOT NULL,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    reported_by VARCHAR(100) NOT NULL,
    priority VARCHAR(50) DEFAULT 'Medium',
    status VARCHAR(50) DEFAULT 'Open',
    assigned_to VARCHAR(100) NOT NULL,
    created_at VARCHAR(50) NOT NULL,
    description TEXT,
    resolution_notes TEXT
);

-- ------------------------------------------------------------------------------
-- 5. ADO TASKS, DISCUSSIONS & AUDIT ATTACHMENTS (BUILDER & IGS)
-- ------------------------------------------------------------------------------

CREATE TABLE ado_tasks (
    id SERIAL PRIMARY KEY,
    task_code VARCHAR(50) UNIQUE,
    title VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'New',
    priority VARCHAR(50) NOT NULL DEFAULT 'Medium',
    assignee_name VARCHAR(150),
    due_date VARCHAR(50),
    sla_days INTEGER DEFAULT 7,
    blockers TEXT,
    description TEXT,
    completion_percentage INTEGER DEFAULT 0,
    tags VARCHAR(200)
);

CREATE TABLE ado_comments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES ado_tasks(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    author_role VARCHAR(100) DEFAULT 'MC Member',
    comment_text TEXT NOT NULL,
    created_at VARCHAR(50) NOT NULL
);

CREATE TABLE ado_attachments (
    id SERIAL PRIMARY KEY,
    task_id INTEGER NOT NULL REFERENCES ado_tasks(id) ON DELETE CASCADE,
    file_name VARCHAR(200) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    uploaded_by VARCHAR(100) NOT NULL,
    created_at VARCHAR(50) NOT NULL
);

-- ------------------------------------------------------------------------------
-- 6. JAITRA ASSOCIATION COMMITTEE (TOWERS A - F)
-- ------------------------------------------------------------------------------

CREATE TABLE team_members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(100) NOT NULL,
    wing_flat VARCHAR(50),
    tower VARCHAR(50) DEFAULT 'Tower A',
    contact VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    term VARCHAR(50) DEFAULT '2025-2027',
    sub_committee VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active'
);

-- ==============================================================================
-- SEED DATA INSERTIONS (ALL UI DATA PERSISTED INTO POSTGRESQL TABLES)
-- ==============================================================================

-- 1. Festivals
INSERT INTO festival_celebrations (id, festival_name, start_date, end_date, location, description, lead_organizer, estimated_budget, collected_funds, status, highlights) VALUES
(1, 'Ganesh Chaturthi Utsav 2026 (5-Day Grand Fest)', '2026-09-15', '2026-09-19', 'Clubhouse Central Mandapam', 'Eco-friendly clay Ganesha Sthapana, daily morning/evening Aarti, devotional Bhajans, cultural dance nights, Kids fancy dress, and the prestigious Maha Laddu Auction followed by Visarjan procession.', 'Sanjay Rao (Festival Convener)', '₹ 3,50,000', '₹ 2,90,000', 'Active', 'Clay Idol Sthapana, Daily Maha-Prasadam, 15+ Kids Stage Acts, 21kg Laddu Auction, Dhol-Tasha Visarjan'),
(2, 'Diwali Deepotsav & Gala Dinner 2026', '2026-11-01', '2026-11-02', 'Main Boulevard & Clubhouse Courtyard', '10,000 Diyas illumination drive across all 6 towers, Rangoli mega-competition, eco-friendly laser light show, and grand dinner buffet.', 'Meenakshi Sundaram', '₹ 4,20,000', '₹ 1,50,000', 'Planning', 'Society-wide Diya Display, Inter-tower Rangoli Trophy, Eco-friendly Laser Night, Grand Dinner Buffet');

-- Festival Collections (Towers A - F)
INSERT INTO festival_collections (festival_id, tower, flat_no, donor_name, amount, payment_mode, transaction_ref, collected_date, receipt_url, notes) VALUES
(1, 'Tower A', '301', 'K. Venkat Rao', 5000.0, 'UPI', 'UPI/623490123/HDFC', '2026-08-15', '/receipts/REC_GANESH_01.pdf', 'Festival voluntary seva'),
(1, 'Tower B', '504', 'M. Srinivas', 11000.0, 'NetBanking', 'NEFT/ICIC20260816', '2026-08-16', '/receipts/REC_GANESH_02.pdf', 'Prasadam sponsorship'),
(1, 'Tower C', '1102', 'Ramesh Chandra', 25000.0, 'UPI', 'UPI/623490987/SBI', '2026-08-18', '/receipts/REC_GANESH_03.pdf', 'Maha Laddu Auction pledge'),
(1, 'Tower D', '204', 'S. Narayanan', 3500.0, 'UPI', 'UPI/623491112/AXIS', '2026-08-20', '/receipts/REC_GANESH_04.pdf', 'Resident contribution'),
(1, 'Tower E', '702', 'P. Kulkarni', 4000.0, 'Cash', 'CASH-REC-105', '2026-08-21', '/receipts/REC_GANESH_05.pdf', 'Collected at Estate office'),
(1, 'Tower F', '903', 'Harish Gupta', 5000.0, 'UPI', 'UPI/623495544/GPay', '2026-08-22', '/receipts/REC_GANESH_06.pdf', 'Cultural night sponsor');

-- Festival Expenses & Audit Approvers
INSERT INTO festival_expenses (festival_id, title, category, amount, vendor_name, bill_date, invoice_url, audit_evidence_notes, approver_name, approver_role, approval_status) VALUES
(1, 'Mandapam Stage Decor & Waterproof Canopy', 'Decor', 65000.0, 'Sri Balaji Decorators & Lights', '2026-08-18', '/invoices/INV_BALAJI_MANDAP.pdf', 'GST Bill attached. Physical inspection verified by Treasurer Vikram Patel.', 'Vikram Patel', 'Treasurer', 'Approved'),
(1, 'Eco-friendly Clay Ganesha Idol (8ft) + Puja Kit', 'Pooja', 32000.0, 'Dhoolpet Clay Artisans Guild', '2026-08-19', '/invoices/INV_CLAY_IDOL_2026.pdf', 'Eco-friendly clay certificate provided for PCB compliance.', 'Rajesh Sharma', 'President', 'Approved'),
(1, 'Digital Sound System, JBL Line Arrays & Lighting Setup', 'Sound & Light', 45000.0, 'Surya Audio Visuals', '2026-08-20', '/invoices/INV_SURYA_SOUND.pdf', '5-day audio contract including DJ console for Visarjan.', 'Vikram Patel', 'Treasurer', 'Approved'),
(1, 'Day 1 & Day 2 Maha-Prasadam Buffet (1000 Pax)', 'Food/Prasadam', 85000.0, 'Swagath Caterers & Sweets', '2026-08-22', '/invoices/INV_SWAGATH_PRASADAM.pdf', 'Verified food quality and hygiene checklist signed by Joint Sec.', 'Ananya Roy', 'General Secretary', 'Approved');

-- 2. Cultural Events
INSERT INTO cultural_events (id, title, category, event_date, time, venue, description, coordinator, coordinator_contact, status, registered_count, budget) VALUES
(1, 'Jaitra Annual Badminton & Box Cricket League', 'Sports', '2026-09-12', '07:00 AM - 08:00 PM', 'Clubhouse Indoor Arena & Sports Turf', 'Annual intra-community sports tournament across Age Groups: Juniors (under 14), Adults (Men & Women Singles/Doubles), and Seniors 50+.', 'Mr. Vivek Murthy (Sports Lead)', '+91 98450 11223', 'Upcoming', 32, '₹ 45,000'),
(2, 'Youth STEM Robotics & Pottery Bootcamp', 'Kids Workshop', '2026-09-20', '10:00 AM - 01:00 PM', 'Clubhouse Multipurpose Studio 2', 'Hands-on weekend learning session featuring DIY Arduino robotics kits, 3D printing demos, and traditional wheel-pottery artistry for children aged 7-16.', 'Dr. Swati Sen (Cultural Committee)', '+91 99801 44556', 'Upcoming', 20, '₹ 20,000');

-- Cultural Participants
INSERT INTO cultural_participants (event_id, tower, flat_no, participant_name, age_group, activity_category, contact_no, notes, registration_date) VALUES
(1, 'Tower A', '402', 'Arjun Varma', 'Junior (<14)', 'Badminton Singles', '+91 98451 10001', 'Junior boys category seed #1', '2026-08-20'),
(1, 'Tower B', '801', 'Rohit Sharma', 'Adult (25-50)', 'Cricket League', '+91 98452 20002', 'Tower B Captain', '2026-08-21'),
(1, 'Tower C', '1203', 'Deepa Raman', 'Adult (25-50)', 'Badminton Doubles', '+91 98453 30003', 'Partnering with Tower D-502', '2026-08-22'),
(2, 'Tower D', '604', 'Ananya Sen', 'Junior (<14)', 'Kids Pottery & Robotics', '+91 98454 40004', 'Brought Arduino starter board', '2026-08-23');

-- Cultural Agendas
INSERT INTO cultural_agendas (event_id, slot_time, performer_or_speaker, activity_topic, stage_coordinator, duration_mins) VALUES
(1, '07:00 AM - 07:30 AM', 'Sports Committee', 'Inaugural Toss & Oath Taking Ceremony', 'Vivek Murthy', 30),
(1, '07:30 AM - 01:00 PM', 'Registered Teams', 'League Matches & Quarter Finals', 'Karthik V.', 330),
(1, '06:30 PM - 08:00 PM', 'President & MC', 'Grand Finale, Trophies & High Tea', 'Rajesh Sharma', 90);

-- 3. GBM Meetings
INSERT INTO gbm_meetings (id, meeting_title, meeting_type, meeting_date, time, venue, quorum_status, key_agenda, resolutions_passed, minutes_summary, attendees_count, doc_link) VALUES
(1, '5th Annual General Body Meeting (AGM 2026)', 'AGM', '2026-07-26', '10:00 AM - 01:30 PM', 'Clubhouse Grand Banquet Hall & Zoom Live Hybrid', 'Quorum Met (240 Owners)', '1. Audited FY25-26 Financials approval
2. Sinking Fund allocation for Solar Plant
3. Builder Handover punch-list status
4. Approval of new security surveillance vendor
5. Election of 3 replacement MC members', 'Resolution 1: 120kW Rooftop Solar Installation approved by 88% majority.
Resolution 2: FY26-27 annual maintenance budget passed with zero increase.
Resolution 3: Legal notice authorization regarding builder delayed STP handover.', 'The AGM commenced with 240 registered owner representations. Treasurer presented audited balance sheet with ₹1.82 Cr corpus. All major resolutions passed.', 240, '/docs/GBM_Minutes_AGM_2026_Approved.pdf'),
(2, 'Extraordinary General Body Meeting (EGM) - STP & Lift AMC Review', 'EGM', '2026-05-10', '04:00 PM - 06:30 PM', 'Clubhouse Grand Banquet Hall', 'Quorum Met (175 Owners)', 'Emergency discussion on STP odor remediation, treated water dual-pipeline flushing, and negotiating long-term OEM Lift maintenance contract with Otis/Schindler.', 'Authorised association to issue ₹6.5 Lakhs escrow release conditioned upon IGS completing STP microbial aerator overhaul within 30 days.', 'Detailed technical evaluation presented by Infrastructure Sub-committee. Clear SLAs mandated for Builder & IGS.', 175, '/docs/EGM_Minutes_May_2026.pdf');

-- 4. Community Issues (Towers A - F, Clubhouse, Common Space)
INSERT INTO community_issues (issue_code, tower, flat_no, flat_or_location, title, category, reported_by, priority, status, assigned_to, created_at, description, resolution_notes) VALUES
('ISS-TWA-101', 'Tower A', 'A-901', 'Tower A - Passenger Lift #2', 'Passenger Lift #2 Jerking & Floor Leveling Offset', 'Electrical & Lift', 'Kavita Reddy (A-901)', 'High', 'Under Inspection', 'Lift OEM / IGS Facility', '2026-08-18', 'Lift stops with a 2-inch height discrepancy on 7th and 9th floors, causing tripping hazard.', 'OEM service engineers inspected encoder sensors. Replacement traction brake coil ordered.'),
('ISS-TWB-202', 'Tower B', 'B-404', 'Tower B - Basement-2 Ramp Lower Joint', 'Basement-2 Ramp Joint Water Seepage during rains', 'Civil & Seepage', 'Alok Srivastava (B-404)', 'Critical', 'In Progress', 'Builder Civil Engineering Cell', '2026-08-10', 'Expansion joint between basement slabs shows active water drip during continuous rain.', 'Pressure grouting contractor mobilized; 3 out of 5 injection ports completed.'),
('ISS-TWC-303', 'Tower C', 'C-102', 'Tower C - Ground Floor Lobby Intercom', 'Lobby Intercom connection static & audio drops', 'Security & Access', 'Pooja Sharma (C-102)', 'Medium', 'Open', 'IGS IT & Security Desk', '2026-08-22', 'Audio communication drops between guard booth and Tower C flats.', 'Fiber optic switch in Tower C riser scheduled for reboot and line test.'),
('ISS-TWD-404', 'Tower D', 'D-302', 'Tower D - Dual Flush Line Shaft', 'STP Treated Water Odor in Flush Line', 'STP & Water Supply', 'Mahesh Rao (D-302)', 'High', 'In Progress', 'IGS Water Operations Lead', '2026-08-20', 'Treated flush water exhibits mild turbidity and chemical odor in lower floor toilets.', 'Activated carbon filter media replaced. Dosing pump calibration verified.'),
('ISS-TWE-505', 'Tower E', 'E-1102', 'Tower E - Corridors 11th Floor', 'Emergency Exit Staircase Fire Door Closer Jammed', 'Common Amenities', 'Vivek Varma (E-1102)', 'Medium', 'Open', 'Facility Maintenance Cell', '2026-08-24', 'Hydraulic door closer on fire escape staircase stuck halfway.', 'Technician assigned with replacement hydraulic arm.'),
('ISS-TWF-606', 'Tower F', 'F-501', 'Tower F - Rainwater Downpipe Joint', 'Rainwater Harvesting Pipe Dripping near Stilt Parking', 'Civil & Seepage', 'D. Prasad (F-501)', 'Low', 'Resolved', 'IGS Plumbing Team', '2026-08-12', 'Mild joint leakage at 6-inch PVC elbow in stilt parking bay #44.', 'Re-cemented solvent weld joint and tested under high-flow water. No further leak.'),
('ISS-CH-701', 'Clubhouse', 'CH-Gym', 'Clubhouse Fitness Center (1st Floor)', 'Gym Treadmill #3 Motor Inverter Fault', 'Common Amenities', 'Rohan Joshi (B-1102)', 'Low', 'Resolved', 'Facility Maintenance Desk', '2026-08-05', 'Treadmill speed sensor throwing Error E-02 during incline adjustments.', 'Technician replaced DC motor brushes and recalibrated digital console.'),
('ISS-CS-801', 'Common Space', 'Gate 2', 'Gate 2 & Children Play Area', 'CCTV Blind Spot near Children Play Area & Gate 2', 'Security & Access', 'Rajesh Sharma (President)', 'Medium', 'Open', 'Association IT & Security Head', '2026-08-22', 'Tree branch overgrowth occludes 4MP PTZ camera angle covering the toddler play swings.', 'Scheduled for camera realignment and horticulture pruning on Saturday morning.');

-- 5. ADO Tasks (Builder & IGS)
INSERT INTO ado_tasks (id, task_code, title, assigned_to, entity_type, category, status, priority, assignee_name, due_date, sla_days, blockers, description, completion_percentage, tags) VALUES
(1, 'ADO-101', 'Basement Waterproofing & Crack Injection Rectification', 'Builder', 'Builder', 'Seepage & Waterproofing', 'Active', 'Critical', 'Er. K. Verma (Builder Project Head)', '2026-09-15', 14, 'Awaiting polyurethane specialized sealant delivery from Bengaluru distributor.', 'Complete structural PU injection grouting along 120 running meters of basement expansion joints in Tower B & C.', 65, 'Handover, Structural, Warranty'),
(2, 'ADO-102', 'Final Fire NOC Compliance & Hydrant Flow Calibration', 'Builder', 'Builder', 'Fire NOC & Compliance', 'Active', 'Critical', 'Mr. D. Srinivasan (Builder Liaison)', '2026-09-30', 30, 'Final inspection joint certificate with Telangana Fire Department pending signature.', 'Pressure testing of 24 riser shafts across Towers A-F, jockey pump automated switch-over check, and statutory certificate.', 80, 'Statutory, Fire Safety, NOC'),
(3, 'ADO-103', 'STP Biological Oxygen Demand (BOD) Testing & IGS Handover', 'IGS', 'IGS', 'STP & WTP Operations', 'Active', 'High', 'Mr. Suresh R. (IGS Technical Ops)', '2026-09-10', 7, 'None. Aeration tank bacterial culture dosing in stabilization phase.', 'Achieve continuous BOD < 10 ppm and COD < 50 ppm output compliance as mandated by PCB guidelines.', 75, 'STP, IGS, Environment'),
(4, 'ADO-104', 'Boom Barrier RFID Tag Sync with MyGate & ANPR System', 'IGS', 'IGS', 'CCTV & Gate Automation', 'Resolved', 'High', 'Kishore N. (IGS IT & Security)', '2026-08-25', 5, 'Resolved successfully.', 'Integrate automated fast-tag recognition on Gate 1 & 2 boom barriers for resident 4-wheelers across all 6 towers.', 100, 'Security, Automation, RFID');

-- ADO Comments
INSERT INTO ado_comments (task_id, author_name, author_role, comment_text, created_at) VALUES
(1, 'Karthik Venkatesh', 'MC Maintenance Lead', 'Joint inspection conducted on Tower B Basement-2 ramp with Er. Verma. Marked 14 drill spots for PU injection.', '2026-08-16 11:30 AM'),
(1, 'Er. K. Verma', 'Builder Project Head', 'First round of grouting complete on 8 spots. Secondary coating will begin once polyurethane batch arrives on Thursday.', '2026-08-19 04:15 PM'),
(3, 'Mr. Suresh R.', 'IGS Technical Ops', 'Water test samples collected from dual STP outlet tank. Lab report from NABL lab expected in 48 hours.', '2026-08-21 02:00 PM');

-- ADO Evidence Attachments
INSERT INTO ado_attachments (task_id, file_name, file_url, description, uploaded_by, created_at) VALUES
(1, 'Basement_Crack_Inspection_Photos_Aug2026.pdf', '/evidence/Basement_Inspection_Aug2026.pdf', 'High-resolution crack survey photos along Tower B & C ramp joint', 'Karthik Venkatesh (MC)', '2026-08-16'),
(2, 'Fire_Riser_Pressure_Flow_Test_Report_Towers_A_F.pdf', '/evidence/Fire_Riser_Test_Report.pdf', 'Signed hydrostatic test certificate by certified Fire Safety Engineer', 'Mr. D. Srinivasan (Builder)', '2026-08-18'),
(3, 'STP_Treated_Water_NABL_Lab_Report_Aug2026.pdf', '/evidence/STP_Lab_Report_Aug2026.pdf', 'PCB parameter certificate showing BOD 8.2 ppm and COD 42 ppm', 'Mr. Suresh R. (IGS)', '2026-08-22');

-- 6. Team Members (Towers A - F)
INSERT INTO team_members (name, role, wing_flat, tower, contact, email, term, sub_committee, status) VALUES
('Rajesh Sharma', 'President', 'Tower A - 1204', 'Tower A', '+91 98450 71001', 'president@jaitra.org', '2025-2027', 'Executive & Governance', 'Active'),
('Col. R. S. Rathore (Retd.)', 'Vice President', 'Tower E - 1401', 'Tower E', '+91 98110 54321', 'vp@jaitra.org', '2025-2027', 'Security & Estate Management', 'Active'),
('Ananya Roy', 'General Secretary', 'Tower C - 802', 'Tower C', '+91 99800 23412', 'secretary@jaitra.org', '2025-2027', 'Legal, Compliance & Admin', 'Active'),
('Meenakshi Sundaram', 'Joint Secretary', 'Tower B - 1103', 'Tower B', '+91 94440 67890', 'jointsec@jaitra.org', '2025-2027', 'Community Relations & PR', 'Active'),
('Vikram Patel', 'Treasurer', 'Tower B - 501', 'Tower B', '+91 97411 98765', 'treasurer@jaitra.org', '2025-2027', 'Finance, Audit & Corpus', 'Active'),
('Praveen Kumar', 'Joint Treasurer', 'Tower D - 704', 'Tower D', '+91 96500 12389', 'jointtreasurer@jaitra.org', '2025-2027', 'Billing & Vendor Escrow', 'Active'),
('Dr. Swati Sen', 'Cultural Committee Head', 'Tower A - 302', 'Tower A', '+91 98451 22334', 'cultural@jaitra.org', '2025-2027', 'Events, Festivals & Arts', 'Active'),
('Vivek Murthy', 'Sports & Amenities Head', 'Tower C - 404', 'Tower C', '+91 98860 99887', 'sports@jaitra.org', '2025-2027', 'Clubhouse, Gym & Grounds', 'Active'),
('Karthik Venkatesh', 'Facility & Maintenance Lead', 'Tower D - 1002', 'Tower D', '+91 97312 88442', 'maintenance@jaitra.org', '2025-2027', 'Builder Handover & IGS Oversight', 'Active'),
('G. Somasekhar', 'Block Representative (Tower F)', 'Tower F - 604', 'Tower F', '+91 99440 12345', 'towerf@jaitra.org', '2025-2027', 'Resident Welfare & Elevators', 'Active');

-- Update serial sequences
SELECT setval('festival_celebrations_id_seq', (SELECT MAX(id) FROM festival_celebrations));
SELECT setval('festival_collections_id_seq', (SELECT MAX(id) FROM festival_collections));
SELECT setval('festival_expenses_id_seq', (SELECT MAX(id) FROM festival_expenses));
SELECT setval('cultural_events_id_seq', (SELECT MAX(id) FROM cultural_events));
SELECT setval('cultural_participants_id_seq', (SELECT MAX(id) FROM cultural_participants));
SELECT setval('cultural_agendas_id_seq', (SELECT MAX(id) FROM cultural_agendas));
SELECT setval('gbm_meetings_id_seq', (SELECT MAX(id) FROM gbm_meetings));
SELECT setval('community_issues_id_seq', (SELECT MAX(id) FROM community_issues));
SELECT setval('ado_tasks_id_seq', (SELECT MAX(id) FROM ado_tasks));
SELECT setval('ado_comments_id_seq', (SELECT MAX(id) FROM ado_comments));
SELECT setval('ado_attachments_id_seq', (SELECT MAX(id) FROM ado_attachments));
SELECT setval('team_members_id_seq', (SELECT MAX(id) FROM team_members));
