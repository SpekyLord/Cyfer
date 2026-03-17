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
- [x] ✅ Accept file upload (multipart form data)
- [x] ✅ Compute SHA-256 hash of the uploaded file
- [x] ✅ Store file in Supabase Storage
- [x] ✅ Create document record in `documents` table with status `pending_approval`
- [x] ✅ Add a new block to the blockchain with the document hash
- [x] ✅ Create a transaction entry in the audit trail
- [x] ✅ Create approval requests in `approvals` table for all other admins

### Task 1.2: Document Retrieval APIs
**Endpoints:**
- [x] ✅ `GET /api/documents` — List all published documents (public) or all documents (admin)
- [x] ✅ `GET /api/documents/[id]` — Get single document with approval chain details
- [x] ✅ Support query params: `category`, `search`, `status`, `page`, `limit`

### Task 1.3: Document Verification API
**Endpoint:** `POST /api/verify`
- [x] ✅ Accept file upload from citizen
- [x] ✅ Compute SHA-256 hash of the uploaded file
- [x] ✅ Search blockchain for matching hash
- [x] ✅ Return verification result:
  - [x] ✅ Match found → `verified: true` with document details
  - [x] ✅ No match → `verified: false` with tampering warning
- [x] ✅ Log verification action in the audit trail

### Task 1.4: Blockchain Integrity API
**Endpoint:** `GET /api/blockchain/validate`
- [x] ✅ Fetch all blocks from the blockchain table
- [x] ✅ Run chain validation (verify hashes and previous_hash links)
- [x] ✅ Return validation result: `valid: true/false` with details on any broken links

### Task 1.5: UCP Consensus API
**Endpoints:**
- [x] ✅ `GET /api/consensus` — Get all documents pending approval for current admin (with `?status=` filter)
- [x] ✅ `POST /api/consensus/[documentId]/approve` — Approve a document
- [x] ✅ `POST /api/consensus/[documentId]/reject` — Reject a document with reason
- [x] ✅ On approve: Check if ALL admins have now approved → if yes, change document status to `published` and record on blockchain
- [x] ✅ On reject: Change document status to `rejected`, log reason
- [x] ✅ All actions recorded in audit trail

### Task 1.6: Audit Trail API
**Endpoints:**
- [x] ✅ `GET /api/audit` — Get all transactions, newest first, with pagination
- [x] ✅ Support filters: `action_type`, `date_range`, `document_id`

### Task 1.7: Budget Data API
**Endpoints:**
- [x] ✅ `GET /api/budget` — Get budget data for dashboard (public)
- [x] ✅ `POST /api/budget` — Add/update budget entries (admin only)
- [x] ✅ `GET /api/budget?summary=true` — Aggregated data for charts (integrated as query param)

### Task 1.8: Authentication API
**Endpoints:**
- [x] ✅ `POST /api/auth/login` — Admin login via Supabase Auth
- [x] ✅ `POST /api/auth/logout` — Admin logout
- [x] ✅ `GET /api/auth` — Get current user session
- [x] ✅ Authentication middleware helper (`lib/auth.ts`) to protect admin routes

### Task 1.9: AI Document Summarization API
**Endpoint:** `POST /api/summarize`
- [x] ✅ Accept `document_id` in request body
- [x] ✅ Fetch document content/text from Supabase Storage
- [x] ✅ Send document text to Anthropic Claude API with structured summarization prompt
- [x] ✅ Prompt should request: key points, affected parties, budget implications (if any), plain-language explanation
- [x] ✅ Return structured AI summary as JSON
- [x] ✅ Handle errors gracefully (API rate limits, unavailable service, oversized documents)
- [ ] Cache summaries in memory or DB to avoid re-calling AI for same document (deferred — will implement during integration)
- [x] ✅ API key stored server-side only (`ANTHROPIC_API_KEY` in env)

**Additional files created:**
- ✅ `lib/audit.ts` — Reusable audit trail logging helper with hash-linked transactions
- ✅ `lib/auth.ts` — Authentication middleware for admin route protection (Bearer token + Supabase Auth)

**✅ Phase 1 COMPLETE! Build verified (Next.js 16.1.6 Turbopack compilation successful)**

**Estimated Time:** Full day (8-10 hours)
**Assignee:** 2 backend-focused members working in parallel

---

## Phase 2: Frontend — Public Pages (Day 2-3 — March 17-18)

### Task 2.1: Global Layout & Navigation
- [x] ✅ Create responsive Navbar with CYFER branding/logo (Shield icon + gold accent)
- [x] ✅ Navigation links: Home, Documents, Verify, Budget, Audit Trail
- [x] ✅ Admin login link
- [x] ✅ Footer with SDG 16 badge and team info
- [x] ✅ Set up global styles, color scheme, and Tailwind theme
  - Deep navy primary (#1a2332), white backgrounds, green verified, red tampered, gold accent (#d4a843)
- [x] ✅ Mobile-responsive hamburger menu
- [x] ✅ Styled UI components: Button (5 variants), Card, Badge (6 variants), Input, Table, Modal

### Task 2.2: Landing Page (`/`)
- [x] ✅ Hero section: CYFER tagline + brief description of the platform
- [x] ✅ Feature highlights: 4 cards for core features with lucide-react icons
- [x] ✅ Call-to-action: "Verify a Document" button and "Browse Documents" button
- [x] ✅ CTA section for Budget Dashboard and Audit Trail
- [x] ✅ SDG 16 badge in hero section

### Task 2.3: Public Document Portal (`/documents`)
- [x] ✅ Search bar with real-time filtering
- [x] ✅ Filter dropdown: category
- [x] ✅ Document card grid showing: title, category badge, upload date, verification icon, uploader name/department, hash preview
- [x] ✅ Pagination with page controls
- [x] ✅ Loading skeleton animation
- [x] ✅ Click through to document detail page

### Task 2.4: Document Detail Page (`/documents/[id]`)
- [x] ✅ Full document metadata display (file info, hash, dates, uploader)
- [x] ✅ File hash displayed prominently in styled box
- [x] ✅ Approval chain sidebar: shows each official's approval status, messages, timestamps
- [x] ✅ Download button
- [x] ✅ "Verify This Document" shortcut link
- [x] ✅ **"AI Summary" button** — calls `/api/summarize`, shows loading spinner, displays structured summary card with TLDR, key points, affected parties, budget implications
- [x] ✅ Summary card with clean typography

### Task 2.5: Verification Tool (`/verify`)
- [x] ✅ File upload dropzone (drag & drop + click to upload)
- [x] ✅ Upload triggers hash computation and blockchain lookup
- [x] ✅ Result display:
  - [x] ✅ **Verified:** Green checkmark, matching document details
  - [x] ✅ **Tampered/Not Found:** Red warning with shake animation
- [x] ✅ Loading animation during verification
- [x] ✅ "How it works" explainer section (3-step process)

### Task 2.6: Budget Dashboard (`/budget`)
- [x] ✅ Horizontal bar chart: Budget allocation by sector (percentage bars)
- [x] ✅ Summary cards: Total budget (PHP formatted), fiscal year, number of categories
- [x] ✅ Table view of all budget categories with amounts and percentages
- [ ] Pie chart using Recharts (deferred — bar chart sufficient for demo)

### Task 2.7: Audit Trail Page (`/audit`)
- [x] ✅ Timeline view of all transactions with vertical connector line
- [x] ✅ Each entry shows: action type icon, description, timestamp, transaction hash
- [x] ✅ Color-coded badges by action type (upload=blue, approve=green, reject=red, verify=warning)
- [x] ✅ Filter by action type dropdown
- [x] ✅ Pagination

**✅ Phase 2 COMPLETE! Build verified (Next.js 16.1.6 — all 26 routes compiled successfully)**

**Estimated Time:** 10-12 hours across 2 days
**Assignee:** 2 frontend-focused members

---

## Phase 3: Frontend — Admin Pages (Day 3 — March 18)

### Task 3.1: Admin Login Page (`/login`)
- [x] ✅ Clean login form: email + password
- [x] ✅ Supabase Auth integration
- [x] ✅ Redirect to admin dashboard on success
- [x] ✅ Error handling for invalid credentials

### Task 3.2: Admin Layout & Sidebar
- [x] ✅ Sidebar navigation: Dashboard, Upload, Approvals, Documents, Budget, Users
- [x] ✅ Current user display with role badge
- [x] ✅ Logout button
- [ ] Breadcrumb navigation (deferred — sidebar navigation sufficient for demo)

### Task 3.3: Admin Dashboard (`/admin`)
- [x] ✅ Stats overview cards: pending approvals, total documents, published count
- [x] ✅ Recent activity feed (last 10 audit trail entries)
- [x] ✅ Quick action buttons: Upload Document, View Pending Approvals

### Task 3.4: Document Upload Page (`/admin/upload`)
- [x] ✅ Upload form with fields:
  - [x] ✅ Document title (text input)
  - [x] ✅ Category (dropdown: ordinance, budget, resolution, contract, permit, other)
  - [x] ✅ Description (textarea)
  - [x] ✅ File upload (drag & drop zone)
- [x] ✅ On submit:
  - [x] ✅ Show hash being generated (visual feedback — "Uploading & Hashing..." button state)
  - [x] ✅ Show "Sent for approval" confirmation with success message
- [x] ✅ Validation: required fields check before submission

### Task 3.5: Approval Queue (`/admin/approvals`)
- [x] ✅ List of documents pending the current admin's approval
- [x] ✅ Each card shows: document title, category, description, file name, upload date, file preview link
- [x] ✅ Approve button (green) and Reject button (red) with prompt for rejection reason
- [x] ✅ After action: card removed from pending list
- [ ] Show approval progress: "2 of 3 officials approved" (deferred — requires additional API data)

### Task 3.6: Document Management (`/admin/documents`)
- [x] ✅ Table of all documents with status column (pending, published, rejected)
- [x] ✅ Filter by status dropdown
- [x] ✅ Click to view details (links to public document detail page)
- [x] ✅ Displays document hash and creation date

### Task 3.7: Budget Management (`/admin/budget`)
- [x] ✅ Form to add budget entries: category, amount, description, fiscal year
- [x] ✅ Table of existing entries with amounts and descriptions
- [x] ✅ Changes reflected on public budget dashboard (same API)

### Task 3.8: User Management (`/admin/users`) — Super Admin Only
- [x] ✅ List of admin users (displays current user info from localStorage)
- [ ] Add new admin form (deferred — requires Supabase Admin API integration)
- [x] ✅ Role display with badge
- [x] ✅ Simple table view with super admin notice

**Additional files created:**
- ✅ `app/(admin)/admin/layout.tsx` — Admin layout wrapper with sidebar + content area
- ✅ `components/admin/AdminSidebar.tsx` — Full sidebar with nav links, user info, logout, role badge

**✅ Phase 3 COMPLETE! Build verified (Next.js 16.1.6 — all 28 routes compiled successfully)**

**Estimated Time:** 8-10 hours
**Assignee:** 2 frontend members (can overlap with Phase 2)

---

## Phase 4: Integration & Polish (Day 4 — March 19)

### Infrastructure Completed (March 17) ✅
- [x] ✅ Supabase project created (Singapore region)
- [x] ✅ Database schema deployed (all 6 tables)
- [x] ✅ RLS policies applied + security fixes (002_security_fixes.sql)
- [x] ✅ Supabase Auth configured (email provider, confirm email OFF)
- [x] ✅ Storage bucket `documents` created (public, 50MB)
- [x] ✅ Seed data inserted (3 admins, 8 budget entries, genesis block, sample document)
- [x] ✅ `.env.local` configured with Supabase URL, anon key, service role key
- [x] ✅ Blockchain hash bug fixed — timestamp normalization + JSONB key sorting
- [x] ✅ Production build verified — 26 routes compiled (0 errors)
- [x] ✅ All tests passing (`test-supabase.ts` — connection, tables, seed data, blockchain)

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