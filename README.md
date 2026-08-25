# Jaitra Residents Welfare Association (JRWA) — Governance & Operations Portal

A complete, full-stack community management web portal for **Jaitra Gated Society (Towers A, B, C, D, E, F)** built with **Next.js 14, React, TypeScript, Tailwind CSS**, **PostgreSQL**, and **Python FastAPI**.

---

## ☁️ Deploy to Vercel (One-Click)

The repository is pre-configured to deploy seamlessly on **Vercel** with zero configuration:

1. Push your code to GitHub: `https://github.com/Praveen-ai-ninja236/jaitra-RWA.git`
2. Go to **[vercel.com](https://vercel.com)** &rarr; **Add New Project** &rarr; select **`jaitra-RWA`**.
3. (Optional) If you have a hosted PostgreSQL database (Vercel Postgres, Supabase, Neon, AWS RDS), add the environment variable in Vercel:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/jaitra_db
   ```
4. Click **Deploy**. Vercel will build and host both the frontend and all 26 serverless API endpoints instantly!

---

## 🏛️ Portal Features & Architecture

### 1. Cultural Events (`Tab 1`)
* Intra-society sports tournaments (Badminton, Cricket) & youth robotics/pottery bootcamps.
* Interactive **Participant Enrolment List** tagged by **Tower A–F**, Flat Number, age group, and specific activities (*Singing, Dancing, Games, Debate, etc.*).
* **Agenda & Timeline Schedule** manager with stage coordinators and time slots.
* Full view and edit capabilities with live DB writes.

### 2. Festival Celebrations (`Tab 2`)
* 5-Day Ganesh Chaturthi Utsav, Diwali Deepotsav, Sankranti, and cultural nights.
* **Resident Collections Tracker**: Tagged by Tower (A–F) and Flat No, donor name, payment mode (*UPI, NetBanking, Cash, Cheque*), and receipt proofs.
* **Expense Audit Tracker**: Expense vouchers with category (*Decor, Pooja, Sound, Food, Logistics*), amount, vendor name, invoice bill attachment proofs, and **Designated MC Approvers** (*e.g., Treasurer Vikram Patel*).
* Live calculation of **Total Collections vs Approved Expenses** (Surplus/Deficit).

### 3. General Body Meetings (GBMs) (`Tab 3`)
* AGM and EGM meeting records with Quorum met indicators and attendance counts.
* Interactive **View & Edit** modal for **Key Agenda Items**, **Approved Resolutions**, and **Executive Minutes Summaries**.
* Official signed PDF minutes download links.

### 4. Community Issues Tracker (`Tab 4`)
* Tagged by **6 Towers (Tower A, Tower B, Tower C, Tower D, Tower E, Tower F)**, **Clubhouse**, and **Common Space**.
* **Tower-Level Containers**: Grouped containers per Tower with **row-wise tickets** displaying ticket ID (e.g. `ISS-TWA-101`), flat number, category, severity, status, and one-click resolution buttons.
* Toggle between **Tower Containers View** and **All Tickets View**.

### 5. ADO Builder & IGS Deliverables Board (`Tab 5`)
* **Azure DevOps (ADO) Kanban Board** with 4 swimlanes (*New / Backlog, Active / In Progress, Resolved / Inspection, Closed & Signed-off*).
* Filter deliverables by **Builder (Praneeth KKR)**, **IGS (Facility Management)**, or **All**.
* Click any work item to open:
  * **Discussion Log Thread**: Multi-user comments between MC, Builder Project Engineers, and IGS Facility Leads.
  * **Audit Evidence Proofs**: Attached inspection survey photos, hydrostatic riser test reports, and NABL lab certificates.
  * **Edit Deliverable**: SLA countdowns, target due dates, percentage progress bars, and blockers.

### 6. Jaitra Association Team Directory (`Tab 6`)
* Directory of elected Management Committee office bearers and Tower Block Representatives (Towers A–F).
* Direct **Add Committee Member** form and modal saving immediately to the database.

---

## 🗄️ PostgreSQL Database Schema (`jaitra_db`)

The complete SQL schema and data migration file is located at:
📁 **`backend/jaitra_postgresql_schema_and_data.sql`**

### Tables Overview:
1. `festival_celebrations`
2. `festival_collections`
3. `festival_expenses`
4. `cultural_events`
5. `cultural_participants`
6. `cultural_agendas`
7. `gbm_meetings`
8. `community_issues`
9. `ado_tasks`
10. `ado_comments`
11. `ado_attachments`
12. `team_members`

---

## 🚀 Local Development

### 1. Start the Next.js Frontend
```bash
cd frontend
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

### 2. (Optional) Python FastAPI Backend
```bash
cd backend
source ../.venv/bin/activate
uvicorn main:app --reload --port 8000
```
