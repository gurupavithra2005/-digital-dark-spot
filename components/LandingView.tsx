'use client';

import React from 'react';
import { 
  FileSearch, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  GitCompare, 
  Clock, 
  CheckSquare, 
  ShieldCheck, 
  Search, 
  Bot, 
  HelpCircle,
  Building2,
  GraduationCap,
  Briefcase,
  BookOpen
} from 'lucide-react';

interface LandingViewProps {
  onStartResearch: () => void;
  onExploreDemo: () => void;
  onOpenDashboard: () => void;
}

export function LandingView({
  onStartResearch,
  onExploreDemo,
  onOpenDashboard,
}: LandingViewProps) {
  const workflowSteps = [
    {
      step: '01',
      title: 'Research Question',
      desc: 'Define your inquiry objective, scope, and key aspects to investigate.',
    },
    {
      step: '02',
      title: 'Source Collection',
      desc: 'Gather URLs, official portal notifications, and document texts.',
    },
    {
      step: '03',
      title: 'Evidence Extraction',
      desc: 'Extract source-linked factual claims and traceable excerpts.',
    },
    {
      step: '04',
      title: 'AI Cross-Analysis',
      desc: 'Synthesize multiple sources side-by-side with Gemini 3.8 Flash.',
    },
    {
      step: '05',
      title: 'Gap Detection',
      desc: 'Pinpoint omitted criteria, missing rules, and contradictory claims.',
    },
    {
      step: '06',
      title: 'Checklist Verification',
      desc: 'Execute a prioritized, actionable verification roadmap.',
    },
  ];

  const comparisonRows = [
    {
      feature: 'Information Gap Detection',
      search: 'Indexes matching documents only; does not analyze omissions',
      summarizer: 'Condenses provided text; typically misses what was not said',
      dds: 'Systematically identifies critical omitted requirements and unanswered criteria across multiple sources',
    },
    {
      feature: 'Cross-Source Conflict Comparison',
      search: 'Presents isolated search results without cross-comparison',
      summarizer: 'May smooth over or unintentionally blend contradictions',
      dds: 'Side-by-side excerpt comparison highlighting differing criteria, dates, and eligibility thresholds',
    },
    {
      feature: 'Freshness & Application Cycles',
      search: 'Displays raw publication or crawl date only',
      summarizer: 'Risk of treating historical cycle guidelines as active rules',
      dds: 'Analyzes information freshness based on the relevant dates, validity periods, and application cycles',
    },
    {
      feature: 'Actionable Verification Roadmap',
      search: 'No structured verification assistance',
      summarizer: 'Generates free-form conversational text summaries',
      dds: 'Prioritized checklist with suggested official authorities to contact for confirmation',
    },
    {
      feature: 'Traceable Provenance & Grounding',
      search: 'Provides raw links requiring manual verification',
      summarizer: 'Higher risk of hallucinated facts and synthetic references',
      dds: 'Source-linked evidence passages with traceable provenance, wherever available',
    },
  ];

  const useCases = [
    {
      icon: GraduationCap,
      title: 'Scholarships & Admissions',
      desc: 'Uncover missing renewal criteria, conflicting income thresholds, and outdated application deadlines before submission.',
    },
    {
      icon: Briefcase,
      title: 'Employment & Contracts',
      desc: 'Verify probation requirements, non-compete clauses, mandatory vs. optional certifications, and hidden conditions.',
    },
    {
      icon: Building2,
      title: 'Government Grants & Schemes',
      desc: 'Cross-reference secondary advisory articles against official gazettes to detect missing compliance requirements.',
    },
    {
      icon: BookOpen,
      title: 'Academic & Market Research',
      desc: 'Synthesize multi-source claims with full evidence provenance and pinpoint areas where evidence is inconclusive.',
    },
  ];

  return (
    <div className="space-y-16 pb-16 animate-in fade-in">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-b from-[#0f172a]/70 via-[#0c121e]/90 to-[#0a0d14] p-6 sm:p-10 lg:p-14 text-center shadow-xl">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3.5 py-1 text-xs font-semibold text-blue-300">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>SHINCHAN ONLINE HACKATHON 2026 — OFFICIAL SUBMISSION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Discover What Information Is Missing.
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            An AI-assisted research intelligence platform that analyzes multiple sources, detects information gaps, identifies conflicting claims, and helps you verify what matters before making high-stakes decisions.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onStartResearch}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/30 transition-all hover:scale-[1.02]"
            >
              <span>Start Research</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onExploreDemo}
              className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-6 py-3 text-sm font-bold text-amber-300 transition-colors"
            >
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Explore Demo Scenario</span>
            </button>

            <button
              onClick={onOpenDashboard}
              className="flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-6 py-3 text-sm font-semibold text-slate-200 transition-colors"
            >
              <span>Open Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* SIX-STAGE INTELLIGENCE WORKFLOW */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
            Methodology & Architecture
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            The Six-Stage Intelligence Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            From initial research inquiry to grounded evidence and verified decisions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {workflowSteps.map((step) => (
            <div
              key={step.step}
              className="rounded-2xl border border-slate-800/80 bg-[#0e1422] p-5 shadow-sm space-y-2 hover:border-slate-700 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 rounded">
                  STAGE {step.step}
                </span>
                <ShieldCheck className="h-4 w-4 text-slate-500" />
              </div>
              <h3 className="text-sm font-bold text-white">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WHY DIGITAL DARK SPOT — COMPARISON TABLE */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Systematic Intelligence
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Why Digital Dark Spot?
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            How Digital Dark Spot fundamentally differs from traditional search engines and generic AI summarizers.
          </p>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-[#0e1422] shadow-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-[#0a0d14]/70 text-slate-300">
                <th className="p-4 font-bold text-white">Feature / Capability</th>
                <th className="p-4 font-semibold text-slate-400">Standard Search Engine</th>
                <th className="p-4 font-semibold text-slate-400">Generic AI Summarizer</th>
                <th className="p-4 font-bold text-blue-400 bg-blue-950/30 border-l border-r border-blue-500/20">
                  DIGITAL DARK SPOT
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {comparisonRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 font-semibold text-slate-100 whitespace-nowrap">
                    {row.feature}
                  </td>
                  <td className="p-4 text-slate-400 max-w-xs">{row.search}</td>
                  <td className="p-4 text-slate-400 max-w-xs">{row.summarizer}</td>
                  <td className="p-4 font-medium text-slate-200 bg-blue-950/20 border-l border-r border-blue-500/20 max-w-xs">
                    {row.dds}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* PRACTICAL USE CASES */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-amber-400">
            High-Stakes Applications
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Practical Example Use Cases
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto">
            Engineered for researchers, students, applicants, and analysts who cannot afford omissions.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {useCases.map((uc, idx) => {
            const Icon = uc.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-white">{uc.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{uc.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="rounded-3xl border border-blue-500/30 bg-gradient-to-r from-blue-950/40 via-[#0d1424] to-indigo-950/40 p-8 text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Ready to uncover the digital dark spots in your research?
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto">
          Start a new inquiry or inspect our comprehensive scholarship demonstration scenario.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartResearch}
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-md transition-all"
          >
            + Start New Research
          </button>
          <button
            onClick={onExploreDemo}
            className="rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-2.5 text-xs font-bold text-amber-300 transition-colors"
          >
            Load Illustrative Demo
          </button>
        </div>
      </section>
    </div>
  );
}
