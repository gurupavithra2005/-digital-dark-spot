# Contributing to DIGITAL DARK SPOT

Thank you for your interest in contributing to **DIGITAL DARK SPOT**! We welcome bug fixes, documentation improvements, new research templates, and architectural enhancements.

---

## 🛠️ Development Workflow

### 1. Prerequisites
- Node.js `v20.x` or higher
- npm or bun
- A Google Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 2. Fork and Branch Setup
```bash
git clone https://github.com/your-username/digital-dark-spot.git
cd digital-dark-spot
git checkout -b feature/your-feature-name
```

### 3. Local Setup
```bash
npm install
cp .env.example .env.local
# Add your GEMINI_API_KEY in .env.local
npm run dev
```

---

## 📋 Code Standards & Guidelines

1. **TypeScript First**: Ensure all new types are explicitly declared under `types/` or co-located cleanly. Avoid `any`.
2. **Pure Domain Logic**: All calculation formulas, progress computations, and string parsers should live in `lib/analysis-logic.ts` and have associated unit tests in `lib/analysis-logic.test.ts`.
3. **No Hallucinated Citations**: Any feature extracting or presenting evidence must maintain verbatim textual provenance.
4. **Accessible & Responsive**: Components must be tested on both desktop and mobile viewports. Avoid horizontal overflow.
5. **Tailwind Styling**: Use Tailwind utility classes. Follow the deep navy color system:
   - Background: `#0b0f17`
   - Surfaces: `#131b2a`, `#1a2333`
   - Borders: `border-slate-800`, `border-slate-700`
   - Accent: `bg-blue-600`
   - Gaps/Warnings: Amber/Orange (`text-amber-400`, `bg-amber-950/30`)
   - Conflicts: Red/Rose (`text-rose-400`, `bg-rose-950/30`)
   - Verified: Emerald (`text-emerald-400`, `bg-emerald-950/30`)

---

## 🧪 Testing Before Submitting

Before creating a Pull Request, verify that all checks pass:

```bash
# 1. Run unit tests
npm test

# 2. Run linter
npm run lint

# 3. Verify production compilation
npm run build
```

---

## 📥 Submitting Pull Requests

1. Commit your changes with clear, semantic commit messages (`feat: ...`, `fix: ...`, `docs: ...`).
2. Push your branch to your fork.
3. Open a Pull Request against the `main` branch.
4. Complete the Pull Request template checklist.
