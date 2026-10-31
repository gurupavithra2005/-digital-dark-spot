# 🔍 DIGITAL DARK SPOT

> **AI-Assisted Information Gap Detection, Contradiction Analysis & Grounded Evidence Verification Platform**  
> *Built for Shinchan Online Hackathon 2026*

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?logo=next.js&style=flat-square)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react&style=flat-square)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white&style=flat-square)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38BDF8?logo=tailwindcss&style=flat-square)](https://tailwindcss.com/)
[![Google Gemini API](https://img.shields.io/badge/Gemini_API-3.8_Flash-8E75B2?logo=google&logoColor=white&style=flat-square)](https://ai.google.dev/)
[![Tests](https://img.shields.io/badge/Tests-6%2F6%20Passing-success?style=flat-square)](https://github.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=flat-square)](./LICENSE)

---

## 💡 The Core Problem

When making critical decisions — such as applying for competitive **scholarships**, seeking **university admissions**, evaluating **job offers**, or complying with **government schemes** — people rely on multiple documents, official portals, and news releases.

However, standard AI summaries and search tools have a dangerous blind spot:
1. **They summarize what is present, but remain silent on what is MISSING.**
2. **They hallucinate facts** to fill silence instead of flagging crucial unverified omissions.
3. **They fail to alert users when two sources contradict each other** on dates, cutoff marks, or eligibility clauses.
4. **They mix outdated past-cycle circulars** with current requirements without clear freshness warnings.

**DIGITAL DARK SPOT** reverses this paradigm: instead of an ordinary chatbot that summarizes text, it acts as an **intelligence auditor**. It reads the user's reviewed sources and systematically detects:
- **What is missing?** (*Potential Information Gaps*)
- **Where do sources contradict each other?** (*Conflicting Claims*)
- **Which requirements are obsolete?** (*Outdated Information*)
- **What exact steps must the user verify next?** (*Actionable Verification Checklist*)

---

## ✨ Key Features & Capabilities

### 1. 🗂️ 4 Starter Intelligence Templates
Pre-configured evaluation criteria for rapid, structured analysis:
- **🎓 Scholarship & Grant Eligibility**: Renewal GPA criteria, income thresholds, bond/return service clauses, application timelines.
- **🏛️ College & University Admission**: Cutoff percentages, entrance exams, reservation quotas, hostel availability, fee refunds.
- **💼 Job & Recruitment Application**: Years of experience, probation terms, bond agreements, degree accreditation, interview rounds.
- **🏛️ Government Welfare Scheme**: Domicile requirements, BPL status criteria, document proofs, renewal frequencies.

### 2. 📊 4-KPI Overview Dashboard
A clutter-free, high-clarity dashboard providing live operational metrics:
- **Total Research Projects**
- **Sources Reviewed**
- **Open Findings** (Actionable gaps & conflicts)
- **Pending Verification Tasks** (Live percentage of verified items)
- Includes **Priority Alerts** highlighting the top-3 high-risk gaps across all projects, alongside an activity audit trail.

### 3. 🔍 7-Module Research Workspace
Every research project is organized into seven focused analytical modules:
1. **Executive Overview**: Concise executive summary, 3 key scorecards, and a transparent **Coverage Matrix** explaining exact formulas and criteria coverage.
2. **Source Management**: Complete repository with live duplicate detection, domain recognition (Official vs. Secondary), and cycle date verification.
3. **Extracted Claims**: Topic-organized key facts backed by exact verbatim source passages.
4. **Information Gaps**: Strict evidence-first identification displaying:
   > *"Potential Information Gap — Not found in the sources reviewed."*  
   Along with *Why This Gap Matters*, *Recommended Actions*, and *What Was Found vs. What Was NOT Found*.
5. **Conflicting Claims**: Direct side-by-side claim comparison with discrepancy severity and resolution guidance.
6. **Outdated Information**: Cycle freshness warnings flagging past academic/fiscal cycle rules against current requirements.
7. **Actionable Verification Checklist**: Prioritized to-do tasks with status toggles (`Pending`, `In Progress`, `Verified`).

### 4. ⚖️ AI Finding Review System
Humans remain in the loop. Users can triage every gap and conflict:
- **`✓ Confirm Finding`**: Acknowledges the gap as a legitimate risk.
- **`✕ Dismiss Finding`**: Archives the finding with user-specified rationale (e.g., *Already verified externally*, *Irrelevant to my case*).
- **`Needs Investigation`**: Flags for team or mentor followup.
- **`Mark Resolved`**: Clears the finding once verified.

### 5. ⏳ Analysis Version History ("What Changed Since Last Analysis?")
- Preserves every analysis iteration (`Version 1`, `Version 2`, etc.).
- Compares previous runs with new source inputs.
- Automatically generates bulleted changelogs detailing newly introduced sources, newly uncovered contradictions, and resolved gaps.

### 6. 🛡️ Strict Separation: Priority vs. AI Confidence
Unlike platforms that conflate algorithmic certainty with user urgency:
- **Decision Priority** (`HIGH`, `MEDIUM`, `LOW`): Dictated by real-world consequence (e.g., missing renewal criteria could cost ₹1,50,000 in tuition).
- **AI Confidence** (`85% - 98%`): Represents algorithmic coverage confidence based on reviewed text density.

### 7. 📑 Multi-Format Export
- **Print / PDF Executive Report**: Clean, printer-friendly layout for review panels, parents, or legal advisors.
- **CSV Data Exporter**: One-click download of all identified gaps, conflicts, and verification checklists.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       USER INTERFACE                        │
│         Next.js 15 (App Router) + Tailwind CSS v4           │
│   AppShell · DashboardView · ProjectWorkspace · Wizard      │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│      CLIENT REPOSITORY       │ │       SERVER ROUTES        │
│      (lib/storage.ts)        │ │   /api/analyze-research    │
│  - Duplicate URL Detection   │ │   /api/extract-url         │
│  - Version History Diffs     │ │   /api/assistant           │
│  - Activity Logging          │ │  (process.env.GEMINI_KEY)  │
└──────────────┬───────────────┘ └────────────┬───────────────┘
               │                              │
               ▼                              ▼
┌──────────────────────────────┐ ┌────────────────────────────┐
│    PURE AUDIT ENGINE         │ │     GOOGLE GEMINI AI       │
│   (lib/analysis-logic.ts)    │ │      gemini-3.8-flash      │
│  - Transparent Coverage Math │ │  - Grounded Claim Extr.    │
│  - Date Freshness Checks     │ │  - Gap Identification      │
│  - Status Tracking           │ │  - Contradiction Detection │
└──────────────────────────────┘ └────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or later
- **npm** or **bun**
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/your-username/digital-dark-spot.git
cd digital-dark-spot
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Code Quality

The project enforces strict unit testing for pure domain calculations and adheres to ESLint 9:

```bash
# Run unit test suite (node:test via tsx)
npm test

# Run ESLint validation
npm run lint

# Build standalone production bundle
npm run build
```

### Unit Test Suite Highlights (`lib/analysis-logic.test.ts`)
- ✅ `calculateCoverageSummaryScore`: Verifies weighted coverage scoring.
- ✅ `getCoverageExplanation`: Validates human-readable formula breakdowns.
- ✅ `computeChecklistProgress`: Validates checklist completion percentages.
- ✅ `classifySourceCategory`: Accurate detection of official portals vs. secondary blogs.
- ✅ `detectDateFreshnessWarning`: Automatic flags on past-cycle circulars.
- ✅ `generateVersionChangesSummary`: Computes diffs between successive research versions.

---

## 📁 Project Structure

```
digital-dark-spot/
├── app/
│   ├── api/
│   │   ├── analyze-research/route.ts  # Gemini-powered multi-stage audit route
│   │   ├── assistant/route.ts         # Grounded conversational assistant route
│   │   └── extract-url/route.ts       # Web scraper & content parser
│   ├── globals.css                    # Tailwind CSS v4 setup
│   ├── layout.tsx                     # Root App Router layout & SEO metadata
│   └── page.tsx                       # Master client view coordinator
├── components/
│   ├── AppShell.tsx                   # Collapsible sidebar & mobile drawer shell
│   ├── DashboardView.tsx              # 4-KPI dashboard, recent projects, alerts
│   ├── EvidenceDrawer.tsx             # Slide-over provenance & verbatim citations
│   ├── NewResearchWizard.tsx          # 4-step wizard with 4 starter templates
│   ├── ProjectWorkspace.tsx           # 7-module research intelligence workspace
│   └── ReportModal.tsx                # Print/PDF preview & CSV exporter
├── lib/
│   ├── analysis-logic.ts              # Pure business calculations & score metrics
│   ├── analysis-logic.test.ts         # Unit test suite
│   ├── sample-data.ts                 # High-fidelity scholarship demo scenario
│   ├── storage.ts                     # Local persistence, duplicate checks & diffs
│   └── utils.ts                       # Tailwind merge & utility helpers
├── types/
│   └── research.ts                    # TypeScript domain interfaces
├── .github/
│   ├── workflows/ci.yml               # Automated CI (lint + test + build)
│   ├── ISSUE_TEMPLATE/                # Bug report & feature templates
│   └── pull_request_template.md       # PR review standards
├── metadata.json                      # AI Studio platform capabilities
├── LICENSE                            # MIT License
└── README.md                          # Platform documentation
```

---

## 🛡️ Trust & Verification Principles

1. **Zero Hallucinated Citations**: Claims and quotes are strictly extracted from user-supplied sources or scraped URLs. No fabricated links or fictional paragraph references.
2. **Mandatory Gap Phrasing**: All unverified criteria are explicitly stamped with:
   > *"Potential Information Gap — Not found in the sources reviewed."*
3. **Server-Side AI Secrets**: The `GEMINI_API_KEY` is exclusively executed in secure server-side Next.js route handlers (`app/api/*`) and is never exposed to the client.

---

## 🤝 Contributing

Contributions are welcomed! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for branch naming standards, test expectations, and pull request procedures.

---

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

---

<p align="center">
  <b>DIGITAL DARK SPOT</b> — <i>Find What Information Is Missing. Verify What Matters.</i>
</p>
