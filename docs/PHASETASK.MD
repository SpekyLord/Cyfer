# CYFER: Governance Edition — Phase Task Breakdown

## Timeline: March 16 - March 22, 2026 (6 Days)

**Team Size:** 4 members
**Video Deadline:** March 22, 2026

---

## Phase 0: Project Setup (Day 1 — March 16)

### Task 0.1: Initialize Next.js Project
- [x] Run `npx create-next-app@latest cyfer` with App Router, TypeScript, Tailwind CSS, ESLint
- [x] Set up project folder structure:
```
cyfer/
├── src/
│   ├── app/
│   │   ├── (public)/              # Public-facing pages
│   │   │   ├── page.tsx           # Landing page
│   │   │   ├── documents/
│   │   │   │   ├── page.tsx       # Document portal
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx   # Document detail
│   │   │   ├── verify/
│   │   │   │   └── page.tsx       # Verification tool
│   │   │   ├── budget/
│   │   │   │   └── page.tsx       # Budget dashboard
│   │   │   └── audit/
│   │   │       └── page.tsx       # Audit trail
│   │   ├── (admin)/
│   │   │   ├── admin/
│   │   │   │   ├── page.tsx       # Admin dashboard
│   │   │   │   ├── upload/
│   │   │   │   │   └── page.tsx   # Upload document
│   │   │   │   ├── approvals/
│   │   │   │   │   └── page.tsx   # Pending approvals
│   │   │   │   ├── documents/
│   │   │   │   │   └── page.tsx   # Manage documents
│   │   │   │   ├── budget/
│   │   │   │   │   └── page.tsx   # Manage budget data
│   │   │   │   └── users/
│   │   │   │       └── page.tsx   # User management
│   │   │   └── login/
│   │   │       └── page.tsx       # Admin login
│   │   ├── api/
│   │   │   ├── documents/
│   │   │   │   └── route.ts       # Document CRUD
│   │   │   ├── blockchain/
│   │   │   │   └── route.ts       # Blockchain ops
│   │   │   ├── verify/
│   │   │   │   └── route.ts       # Verification
│   │   │   ├── consensus/
│   │   │   │   └── route.ts       # UCP workflow
│   │   │   ├── audit/
│   │   │   │   └── route.ts       # Audit trail
│   │   │   ├── budget/
│   │   │   │   └── route.ts       # Budget CRUD
│   │   │   ├── summarize/
│   │   │   │   └── route.ts       # AI document summarization
│   │   │   └── auth/
│   │   │       └── route.ts       # Authentication
│   │   ├── layout.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Table.tsx
│   │   │   ├── Input.tsx
│   │   │   └── Navbar.tsx
│   │   ├── documents/
│   │   │   ├── DocumentCard.tsx
│   │   │   ├── DocumentList.tsx
│   │   │   ├── DocumentDetail.tsx
│   │   │   └── VerificationResult.tsx
│   │   ├── budget/
│   │   │   ├── BudgetChart.tsx
│   │   │   └── BudgetTable.tsx
│   │   ├── audit/
│   │   │   └── AuditTimeline.tsx
│   │   ├── consensus/
│   │   │   ├── ApprovalCard.tsx
│   │   │   └── ApprovalStatus.tsx
│   │   └── admin/
│   │       ├── AdminSidebar.tsx
│   │       ├── UploadForm.tsx
│   │       └── StatsOverview.tsx
│   ├── lib/
│   │   ├── supabase.ts            # Supabase client
│   │   ├── blockchain.ts          # Blockchain logic
│   │   ├── hash.ts                # SHA-256 hashing utils
│   │   ├── ai.ts                  # AI API client + summarization prompt
│   │   └── types.ts               # TypeScript types
│   └── utils/
│       ├── formatters.ts          # Date, number formatters
│       └── constants.ts           # App constants
├── public/
│   └── assets/                    # Static assets, logos
├── .env.local                     # Environment variables
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

### Task 0.2: Set Up Supabase
- [ ] Create Supabase project
- [ ] Create all database tables per the PRD schema:
  - [ ] `users`
  - [ ] `documents`
  - [ ] `blockchain`
  - [ ] `approvals`
  - [ ] `transactions`
  - [ ] `budget_data`
- [ ] Set up Supabase Storage bucket for document files
- [ ] Configure Row Level Security (RLS) policies:
  - [ ] Public read access for published documents, budget data, audit trail
  - [ ] Admin-only write access for uploads, approvals, budget management
- [ ] Set up Supabase Auth for admin accounts
- [ ] Store Supabase URL and anon key in `.env.local`

### Task 0.3: Install Dependencies
- [x] ✅ Installed `@supabase/supabase-js` — Supabase client
- [x] ✅ Installed `recharts` — Charts for budget dashboard
- [x] ✅ Installed `lucide-react` — Icons
- [x] ✅ Installed `date-fns` — Date formatting
- [x] ✅ Installed `@anthropic-ai/sdk` — Anthropic Claude API for AI summarization
- [x] ✅ **Note:** Did NOT install `crypto-js` — using built-in Web Crypto API instead

### Task 0.4: Set Up Core Utilities
- [x] ✅ Implement `lib/supabase.ts` — Supabase client initialization (browser + server clients)
- [x] ✅ Implement `lib/hash.ts` — SHA-256 hashing function for files (hashFile, hashBuffer, hashString)
- [x] ✅ Implement `lib/blockchain.ts` — Core blockchain class:
  - [x] ✅ `createGenesisBlock()`
  - [x] ✅ `addBlock(data)`
  - [x] ✅ `getLatestBlock()`
  - [x] ✅ `validateChain()`
  - [x] ✅ `computeHash(block)`
  - [x] ✅ `initialize()` — bonus helper method
- [x] ✅ Implement `lib/types.ts` — All TypeScript interfaces and enums
- [x] ✅ Implement `lib/ai.ts` — Anthropic Claude API client with summarization prompt template
- [x] ✅ Implement `utils/formatters.ts` — Date/number formatting helpers (9 utility functions)
- [x] ✅ Implement `utils/constants.ts` — App-wide constants (categories, statuses, file constraints, etc.)
- [x] ✅ Create `app/api/summarize/route.ts` — AI summarization API endpoint

### Task 0.5: Seed Demo Data
- [x] ✅ Created `supabase/migrations/001_initial_schema.sql` — Complete database schema (6 tables)
- [x] ✅ Created `supabase/policies/001_rls_policies.sql` — Row-Level Security policies
- [x] ✅ Created `supabase/seeds/001_demo_data.sql` — Demo data:
  - [x] ✅ 3 admin accounts (Mayor, Treasurer, Municipal Secretary)
  - [x] ✅ Sample budget data for "Municipality of Sample City" (8 categories, FY 2026)
  - [x] ✅ Genesis block in blockchain table
  - [x] ✅ 1 sample published ordinance with full approval chain
  - [x] ✅ Sample audit trail transactions
- [x] ✅ Created `SUPABASE_SETUP.md` — Complete step-by-step setup guide (10 steps + troubleshooting)
- [x] ✅ Updated `.env.local.example` — Added ANTHROPIC_API_KEY

**✅ Phase 0 COMPLETE! Build verified (TypeScript compilation successful)**

**Estimated Time:** 3-4 hours
**Assignee:** Team lead + backend-focused member

---

## Phase 1: Core Backend — Blockchain + Documents + UCP (Day 2 — March 17)

### Task 1.1: Document Upload API
**Endpoint:** `POST /api/documents`
- [ ] Accept file upload (multipart form data)
- [ ] Compute SHA-256 hash of the uploaded file
- [ ] Store file in Supabase Storage
- [ ] Create document record in `documents` table with status `pending_approval`
- [ ] Add a new block to the blockchain with the document hash
- [ ] Create a transaction entry in the audit trail
- [ ] Create approval requests in `approvals` table for all other admins

### Task 1.2: Document Retrieval APIs
**Endpoints:**
- [ ] `GET /api/documents` — List all published documents (public) or all documents (admin)
- [ ] `GET /api/documents/[id]` — Get single document with approval chain details
- [ ] Support query params: `category`, `search`, `status`, `page`, `limit`

### Task 1.3: Document Verification API
**Endpoint:** `POST /api/verify`
- [ ] Accept file upload from citizen
- [ ] Compute SHA-256 hash of the uploaded file
- [ ] Search blockchain for matching hash
- [ ] Return verification result:
  - [ ] Match found → `verified: true` with document details
  - [ ] No match → `verified: false` with tampering warning
- [ ] Log verification action in the audit trail

### Task 1.4: Blockchain Integrity API
**Endpoint:** `GET /api/blockchain/validate`
- [ ] Fetch all blocks from the blockchain table
- [ ] Run chain validation (verify hashes and previous_hash links)
- [ ] Return validation result: `valid: true/false` with details on any broken links

### Task 1.5: UCP Consensus API
**Endpoints:**
- [ ] `GET /api/consensus/pending` — Get all documents pending approval for current admin
- [ ] `POST /api/consensus/[documentId]/approve` — Approve a document
- [ ] `POST /api/consensus/[documentId]/reject` — Reject a document with reason
- [ ] On approve: Check if ALL admins have now approved → if yes, change document status to `published` and record on blockchain
- [ ] On reject: Change document status to `rejected`, log reason
- [ ] All actions recorded in audit trail

### Task 1.6: Audit Trail API
**Endpoints:**
- [ ] `GET /api/audit` — Get all transactions, newest first, with pagination
- [ ] Support filters: `action_type`, `date_range`, `document_id`

### Task 1.7: Budget Data API
**Endpoints:**
- [ ] `GET /api/budget` — Get budget data for dashboard (public)
- [ ] `POST /api/budget` — Add/update budget entries (admin only)
- [ ] `GET /api/budget/summary` — Aggregated data for charts

### Task 1.8: Authentication API
**Endpoints:**
- [ ] `POST /api/auth/login` — Admin login via Supabase Auth
- [ ] `POST /api/auth/logout` — Admin logout
- [ ] Middleware to protect admin routes

### Task 1.9: AI Document Summarization API
**Endpoint:** `POST /api/summarize`
- [ ] Accept `document_id` in request body
- [ ] Fetch document content/text from Supabase Storage
- [ ] Send document text to Anthropic Claude API with structured summarization prompt
- [ ] Prompt should request: key points, affected parties, budget implications (if any), plain-language explanation
- [ ] Return structured AI summary as JSON
- [ ] Handle errors gracefully (API rate limits, unavailable service, oversized documents)
- [ ] Cache summaries in memory or DB to avoid re-calling AI for same document
- [ ] API key stored server-side only (`ANTHROPIC_API_KEY` in env)

**Estimated Time:** Full day (8-10 hours)
**Assignee:** 2 backend-focused members working in parallel

---

## Phase 2: Frontend — Public Pages (Day 2-3 — March 17-18)

### Task 2.1: Global Layout & Navigation
- [ ] Create responsive Navbar with CYFER branding/logo
- [ ] Navigation links: Home, Documents, Verify, Budget, Audit Trail
- [ ] Admin login link
- [ ] Footer with SDG 16 badge and team info
- [ ] Set up global styles, color scheme, and Tailwind theme
  - Suggested palette: Deep navy/dark blue primary, white/light backgrounds, green for "verified", red for "tampered", gold accents for government theme

### Task 2.2: Landing Page (`/`)
- [ ] Hero section: CYFER tagline + brief description of the platform
- [ ] Quick stats bar: Total documents published, total verifications, total officials on network
- [ ] Feature highlights: 4 cards for each core feature with icons
- [ ] Call-to-action: "Verify a Document" button and "Browse Documents" button
- [ ] SDG 16 section explaining alignment

### Task 2.3: Public Document Portal (`/documents`)
- [ ] Search bar with real-time filtering
- [ ] Filter dropdowns: category, date range
- [ ] Document list/grid showing:
  - [ ] Document title
  - [ ] Category badge (ordinance, budget, resolution, etc.)
  - [ ] Upload date
  - [ ] Verification status indicator
  - [ ] Uploader name/department
- [ ] Pagination
- [ ] Click through to document detail page

### Task 2.4: Document Detail Page (`/documents/[id]`)
- [ ] Full document metadata display
- [ ] File hash displayed prominently
- [ ] Approval chain: Show which officials approved and when
- [ ] Download button
- [ ] "Verify This Document" shortcut button
- [ ] **"AI Summary" button** — calls `/api/summarize`, shows loading spinner, then displays structured summary card with key points, affected parties, budget implications, and plain-language explanation
- [ ] Summary card with clean typography and collapsible sections
- [ ] Related audit trail entries for this document

### Task 2.5: Verification Tool (`/verify`)
- [ ] File upload dropzone (drag & drop + click to upload)
- [ ] Upload triggers hash computation and blockchain lookup
- [ ] Result display:
  - [ ] **Verified:** Green checkmark, matching document details, blockchain block reference
  - [ ] **Tampered/Not Found:** Red warning, explanation that the file does not match any record
- [ ] Animation for the verification process (loading → result)

### Task 2.6: Budget Dashboard (`/budget`)
- [ ] Pie chart: Budget allocation by sector (percentage breakdown)
- [ ] Bar chart: Allocated amounts per category
- [ ] Summary cards: Total budget, number of categories, fiscal year
- [ ] Table view of all budget line items
- [ ] All charts use Recharts library

### Task 2.7: Audit Trail Page (`/audit`)
- [ ] Timeline/list view of all transactions
- [ ] Each entry shows: action type icon, description, timestamp, transaction hash, performed by
- [ ] Color-coded by action type (upload=blue, approve=green, reject=red, verify=purple)
- [ ] Filter by action type
- [ ] Blockchain integrity status banner at the top

**Estimated Time:** 10-12 hours across 2 days
**Assignee:** 2 frontend-focused members

---

## Phase 3: Frontend — Admin Pages (Day 3 — March 18)

### Task 3.1: Admin Login Page (`/login`)
- [ ] Clean login form: email + password
- [ ] Supabase Auth integration
- [ ] Redirect to admin dashboard on success
- [ ] Error handling for invalid credentials

### Task 3.2: Admin Layout & Sidebar
- [ ] Sidebar navigation: Dashboard, Upload, Approvals, Documents, Budget, Users
- [ ] Current user display with role badge
- [ ] Logout button
- [ ] Breadcrumb navigation

### Task 3.3: Admin Dashboard (`/admin`)
- [ ] Stats overview cards: pending approvals, total documents, recent verifications
- [ ] Recent activity feed (last 10 audit trail entries)
- [ ] Quick action buttons: Upload Document, View Pending Approvals

### Task 3.4: Document Upload Page (`/admin/upload`)
- [ ] Upload form with fields:
  - [ ] Document title (text input)
  - [ ] Category (dropdown: ordinance, budget, resolution, contract, permit, other)
  - [ ] Description (textarea)
  - [ ] File upload (drag & drop zone)
- [ ] On submit:
  - [ ] Show hash being generated (visual feedback)
  - [ ] Show "Sent for approval" confirmation with list of officials who need to approve
- [ ] Validation: required fields, file size limit, accepted file types

### Task 3.5: Approval Queue (`/admin/approvals`)
- [ ] List of documents pending the current admin's approval
- [ ] Each card shows: document title, category, uploaded by, upload date, file preview/download
- [ ] Approve button (green) and Reject button (red) with optional message
- [ ] After action: card moves to completed section
- [ ] Show approval progress: "2 of 3 officials approved"

### Task 3.6: Document Management (`/admin/documents`)
- [ ] Table of all documents with status column (pending, published, rejected)
- [ ] Filter by status
- [ ] Click to view details
- [ ] Bulk actions not needed for hackathon

### Task 3.7: Budget Management (`/admin/budget`)
- [ ] Form to add budget entries: category, amount, description, fiscal year
- [ ] Table of existing entries with edit/delete
- [ ] Changes reflected on public budget dashboard

### Task 3.8: User Management (`/admin/users`) — Super Admin Only
- [ ] List of all admin users
- [ ] Add new admin form
- [ ] Role assignment
- [ ] Simple table view

**Estimated Time:** 8-10 hours
**Assignee:** 2 frontend members (can overlap with Phase 2)

---

## Phase 4: Integration & Polish (Day 4 — March 19)

### Task 4.1: Connect Frontend to Backend
- [ ] Wire all public pages to their respective API endpoints
- [ ] Wire all admin pages to their respective API endpoints
- [ ] Test complete flows end-to-end:
  - [ ] Admin login → upload document → other admins approve → document appears on public portal
  - [ ] Citizen clicks "AI Summary" on a published document → summary generates correctly
  - [ ] Citizen verifies document → verified result
  - [ ] Citizen verifies tampered document → tampered result
  - [ ] View budget dashboard with real data
  - [ ] View audit trail with real entries

### Task 4.2: Tamper Detection Demo
- [ ] Implement a way to demonstrate tamper detection for the video:
  - [ ] Option A: Upload a slightly modified copy of an existing document
  - [ ] Option B: Admin-only "simulate tamper" button that modifies a file hash to show detection
- [ ] Ensure the verification page clearly shows the difference between verified and tampered states

### Task 4.3: UI Polish
- [ ] Consistent spacing, typography, and color usage across all pages
- [ ] Loading states for all async operations (skeleton loaders or spinners)
- [ ] Empty states for pages with no data
- [ ] Error states and toast notifications for actions (upload success, approval confirmed, etc.)
- [ ] Hover effects, transitions, and micro-animations
- [ ] CYFER logo and branding applied consistently

### Task 4.4: Responsive Design Check
- [ ] Test all pages on desktop (priority) and tablet
- [ ] Fix any layout issues
- [ ] Ensure the demo flow works smoothly at a standard screen resolution for video recording

### Task 4.5: Seed Production Demo Data
- [ ] Create realistic demo data for the video:
  - [ ] 5-8 published government documents (mix of ordinances, budgets, contracts)
  - [ ] Full budget data for "Municipality of Sample City"
  - [ ] Audit trail with 15-20 entries showing various actions
  - [ ] At least 3 admin accounts with different departments

**Estimated Time:** 6-8 hours
**Assignee:** Full team

---

## Phase 5: Demo Prep & Video Script (Day 5 — March 20)

### Task 5.1: Full Demo Run-Through
- [ ] Run through the entire demo flow 2-3 times
- [ ] Identify and fix any bugs or visual glitches
- [ ] Ensure all data looks realistic and professional
- [ ] Time the demo — aim for 3-5 minutes depending on hackathon requirements

### Task 5.2: Write Video Script
Structure the script as follows:

**1. Opening (15-20 seconds)**
- Problem statement: "In the Philippines, citizens often lack tools to verify whether government documents are authentic or have been tampered with..."
- Show headlines/stats about governance challenges

**2. Introducing CYFER (15-20 seconds)**
- "CYFER is a blockchain-powered platform that makes government documents tamper-proof and publicly verifiable."
- Show the landing page

**3. Demo: Public Document Portal (30-40 seconds)**
- Browse documents, show categories and verification badges
- Show budget transparency dashboard with charts

**4. Demo: Document Upload + UCP (40-50 seconds)**
- Admin uploads a new ordinance
- Hash is generated
- Other officials receive approval requests
- Show 2 officials approving
- Document goes live on public portal
- Show what happens if one official rejects

**5. Demo: AI Document Summarizer (20-30 seconds)**
- Click "AI Summary" on a complex ordinance
- Show loading state → AI generates plain-language breakdown
- Highlight: "Even non-technical citizens can now understand complex government documents"

**6. Demo: Citizen Verification (30-40 seconds)**
- Citizen uploads a document → Verified (green checkmark)
- Citizen uploads a tampered document → Tampered (red warning)
- Show the audit trail of all actions

**7. Tech Stack & SDGs (15-20 seconds)**
- "Built with Next.js, Tailwind CSS, Supabase, custom SHA-256 blockchain, and Anthropic Claude AI."
- "CYFER supports SDG 16: Peace, Justice and Strong Institutions by promoting transparency, accountability, and citizen participation in governance."

**8. Closing (10 seconds)**
- Team name and members
- CYFER logo

### Task 5.3: Prepare Video Recording Environment
- [ ] Clean browser with demo data ready
- [ ] Two browser windows: one for public view, one for admin view
- [ ] Rehearse screen transitions
- [ ] Prepare any screen recording tools (OBS, Loom, etc.)

**Estimated Time:** 4-5 hours
**Assignee:** Full team

---

## Phase 6: Record & Submit (Day 6 — March 21-22)

### Task 6.1: Record Video (March 21)
- [ ] Record screen captures of the full demo
- [ ] Record voiceover (or use on-screen text/captions)
- [ ] Multiple takes if needed — keep the best

### Task 6.2: Edit Video (March 21)
- [ ] Combine screen recordings with intro/outro
- [ ] Add text overlays for feature names, tech stack, SDGs
- [ ] Add background music (royalty-free)
- [ ] Keep total length within hackathon requirements
- [ ] Export in required format/resolution

### Task 6.3: Review & Submit (March 22)
- [ ] Full team reviews the final video
- [ ] Check all requirements are met:
  - [ ] Working prototype demonstrated
  - [ ] Key features and functionality highlighted
  - [ ] Problem explained
  - [ ] Proposed solution explained
  - [ ] Real-world application shown
  - [ ] SDGs mentioned
  - [ ] Technologies listed (languages, frameworks, APIs, platforms, AI tools)
- [ ] Submit before deadline

**Estimated Time:** 6-8 hours across 2 days
**Assignee:** Full team (video editing by designated member)

---

## Task Assignment Suggestion (4 Members)

| Member | Primary Focus | Key Tasks |
|--------|--------------|-----------|
| Member 1 (Francis Gabriel) | Full-stack lead / Backend | Phase 0 setup, Phase 1 APIs (documents, blockchain, verification), Phase 4 integration |
| Member 2 (Om Shanti) | Frontend lead | Phase 2 public pages (portal, verify, budget, audit), Phase 4 UI polish |
| Member 3 | Backend + Database | Phase 0 Supabase setup, Phase 1 APIs (consensus, audit, budget, auth), Phase 4 demo data |
| Member 4 | Frontend + Video | Phase 3 admin pages, Phase 2 landing page, Phase 5 video script, Phase 6 recording/editing |

**Daily Standups:** Quick 10-minute sync at start of each day to review progress and blockers.

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Supabase setup takes too long | Fall back to local SQLite with Prisma |
| Team member unavailable | Each member has a buddy who understands their tasks |
| Feature not ready in time | Cut budget dashboard first (least critical for demo), then audit trail |
| Video quality issues | Record backup takes, keep video simple with screen recording + voiceover |
| Deployment fails | Demo from localhost — still valid as working prototype |

---

## Feature Priority (If Running Out of Time)

1. **MUST HAVE:** Document upload + hashing + verification + tamper detection (this IS the demo)
2. **MUST HAVE:** UCP approval workflow (this is the differentiator)
3. **SHOULD HAVE:** AI Document Summarizer
4. **SHOULD HAVE:** Audit trail / transaction chain
5. **NICE TO HAVE:** Budget transparency dashboard
6. **NICE TO HAVE:** Polished landing page with animations