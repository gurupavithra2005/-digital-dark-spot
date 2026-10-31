'use client';

import React from 'react';
import { 
  PlusCircle, 
  ArrowRight, 
  FileSearch, 
  AlertTriangle, 
  GitCompare, 
  Clock, 
  CheckSquare, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  FolderGit2,
  Calendar,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ResearchProject, ActivityItem } from '@/types/research';
import { getActivities } from '@/lib/storage';

interface DashboardViewProps {
  projects: ResearchProject[];
  onOpenProject: (projectId: string, tab?: string) => void;
  onNewResearch: () => void;
  onViewAllProjects: () => void;
  onLoadDemo: () => void;
}

export function DashboardView({
  projects,
  onOpenProject,
  onNewResearch,
  onViewAllProjects,
  onLoadDemo,
}: DashboardViewProps) {
  // 1. Total Research Projects
  const totalProjects = projects.length;

  // 2. Sources Reviewed
  const totalSources = projects.reduce((acc, p) => acc + (p.sources?.length || 0), 0);

  // 3. Open Findings (Gaps + Conflicts + Freshness Warnings not dismissed)
  const openFindingsCount = projects.reduce((acc, p) => {
    const gaps = (p.gaps || []).filter((g) => g.reviewStatus !== 'dismissed').length;
    const conflicts = (p.conflicts || []).filter((c) => c.reviewStatus !== 'dismissed').length;
    const warnings = (p.freshnessWarnings || []).filter((w) => w.reviewStatus !== 'dismissed').length;
    return acc + gaps + conflicts + warnings;
  }, 0);

  // 4. Pending Verification Tasks
  const pendingTasksCount = projects.reduce((acc, p) => {
    return acc + (p.checklist?.filter((t) => t.status === 'pending' || t.status === 'in_progress').length || 0);
  }, 0);

  // Latest 3-5 projects
  const recentProjects = projects.slice(0, 4);

  // Activity Feed (Synchronized via useSyncExternalStore for hydration-safe external storage)
  const activitiesJson = React.useSyncExternalStore(
    (cb) => {
      if (typeof window === 'undefined') return () => {};
      window.addEventListener('storage', cb);
      return () => window.removeEventListener('storage', cb);
    },
    () => (typeof window !== 'undefined' ? JSON.stringify(getActivities()) : '[]'),
    () => '[]'
  );
  const activities = React.useMemo<ActivityItem[]>(() => {
    try {
      return JSON.parse(activitiesJson);
    } catch {
      return [];
    }
  }, [activitiesJson]);

  // Top 3 Priority Alerts aggregated across projects
  const topAlerts: Array<{
    id: string;
    projectId: string;
    projectTitle: string;
    type: 'gap' | 'conflict' | 'outdated';
    title: string;
    description: string;
    priority: string;
    targetTab: string;
  }> = [];

  for (const p of projects) {
    for (const g of p.gaps || []) {
      if (g.priority === 'high' && g.reviewStatus !== 'dismissed' && topAlerts.length < 3) {
        topAlerts.push({
          id: g.id,
          projectId: p.id,
          projectTitle: p.title,
          type: 'gap',
          title: g.title,
          description: g.whyItMatters,
          priority: 'High Priority Gap',
          targetTab: 'gaps',
        });
      }
    }
    for (const c of p.conflicts || []) {
      if (c.reviewStatus !== 'dismissed' && topAlerts.length < 3) {
        topAlerts.push({
          id: c.id,
          projectId: p.id,
          projectTitle: p.title,
          type: 'conflict',
          title: `Conflicting ${c.aspect}`,
          description: c.explanation,
          priority: c.label,
          targetTab: 'conflicts',
        });
      }
    }
    for (const w of p.freshnessWarnings || []) {
      if (w.severity === 'high' && w.reviewStatus !== 'dismissed' && topAlerts.length < 3) {
        topAlerts.push({
          id: w.id,
          projectId: p.id,
          projectTitle: p.title,
          type: 'outdated',
          title: `Outdated Date: ${w.sourceTitle}`,
          description: w.warningReason,
          priority: 'Expired Cycle Alert',
          targetTab: 'outdated',
        });
      }
    }
    if (topAlerts.length >= 3) break;
  }

  return (
    <div className="space-y-8 pb-12 animate-in fade-in">
      
      {/* SECTION 1 — WELCOME HEADER */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-950/80 border border-blue-500/30 px-3 py-0.5 text-[11px] font-semibold text-blue-300 mb-1">
            <span className="h-2 w-2 rounded-full bg-blue-400 animate-pulse" />
            <span>SHINCHAN ONLINE HACKATHON 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Your Research Intelligence Workspace
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl">
            Discover missing information, compare sources, and verify important findings.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2.5 text-xs font-semibold text-amber-300 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Load Demo</span>
          </button>

          <button
            onClick={onNewResearch}
            className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20 transition-all hover:scale-[1.02]"
          >
            <PlusCircle className="h-4 w-4" />
            <span>+ New Research</span>
          </button>
        </div>
      </section>

      {/* 4 MAIN KPI CARDS (Section 3 Requirement) */}
      <section aria-label="Key Performance Indicators">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Projects */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Research Projects
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {totalProjects}
            </div>
            <div className="text-[11px] text-slate-400">Active research files saved</div>
          </div>

          {/* Card 2: Sources Reviewed */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Sources Reviewed
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-blue-400 tracking-tight">
              {totalSources}
            </div>
            <div className="text-[11px] text-slate-400">Portals, documents & excerpts</div>
          </div>

          {/* Card 3: Open Findings */}
          <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 shadow-sm space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              Open Findings
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tracking-tight">
              {openFindingsCount}
            </div>
            <div className="text-[11px] text-slate-400">Gaps, conflicts & freshness alerts</div>
          </div>

          {/* Card 4: Pending Verification Tasks */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 shadow-sm space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
              Pending Tasks
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 tracking-tight">
              {pendingTasksCount}
            </div>
            <div className="text-[11px] text-slate-400">Awaiting human verification</div>
          </div>
        </div>
      </section>

      {/* SECTION 2 & SECTION 3 IN BALANCED TWO-COLUMN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* SECTION 2 — RECENT RESEARCH (2 Cols) */}
        <section className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Recent Research</h2>
              <p className="text-xs text-slate-400">Continue your latest investigations</p>
            </div>
            <button
              onClick={onViewAllProjects}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1"
            >
              <span>View All ({totalProjects})</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentProjects.map((p) => {
              const findingsCount = (p.gaps?.length || 0) + (p.conflicts?.length || 0);
              return (
                <div
                  key={p.id}
                  className="rounded-xl border border-slate-800 bg-[#0e1422] p-4.5 hover:border-slate-700 transition-all shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                        p.isSampleDemo
                          ? 'bg-amber-950 border border-amber-500/40 text-amber-300'
                          : 'bg-slate-800 text-slate-300'
                      }`}>
                        {p.isSampleDemo ? 'Illustrative Demo' : 'User Research'}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{new Date(p.updatedAt).toLocaleDateString()}</span>
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate">
                      {p.title}
                    </h3>
                    <p className="text-xs text-slate-400 italic truncate">
                      &ldquo;{p.researchQuestion}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <div className="text-slate-300 font-semibold">{p.sources?.length || 0} Sources</div>
                      <div className="text-amber-400 text-[11px]">{findingsCount} Open Findings</div>
                    </div>

                    <button
                      onClick={() => onOpenProject(p.id)}
                      className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-colors"
                    >
                      <span>Open</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}

            {recentProjects.length === 0 && (
              <div className="rounded-xl border border-dashed border-slate-800 p-8 text-center text-xs text-slate-400 space-y-2">
                <p>No research projects started yet.</p>
                <button
                  onClick={onNewResearch}
                  className="text-blue-400 hover:underline font-semibold"
                >
                  Start your first research inquiry
                </button>
              </div>
            )}
          </div>
        </section>

        {/* SECTION 3 — PRIORITY ALERTS (1 Col) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Priority Alerts</h2>
              <p className="text-xs text-slate-400">Critical items requiring verification</p>
            </div>
            <span className="rounded-full bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold text-rose-300">
              {topAlerts.length} Active
            </span>
          </div>

          <div className="space-y-3">
            {topAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onOpenProject(alert.projectId, alert.targetTab)}
                className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 hover:border-slate-700 cursor-pointer transition-all shadow-sm space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className={`rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                    alert.type === 'conflict'
                      ? 'bg-rose-950 border border-rose-500/30 text-rose-300'
                      : alert.type === 'gap'
                      ? 'bg-amber-950 border border-amber-500/30 text-amber-300'
                      : 'bg-purple-950 border border-purple-500/30 text-purple-300'
                  }`}>
                    {alert.priority}
                  </span>
                  <span className="text-[10px] text-blue-400 flex items-center gap-0.5 hover:underline">
                    <span>Inspect</span>
                    <ChevronRight className="h-3 w-3" />
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-100 line-clamp-1">
                  {alert.title}
                </h4>

                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                  {alert.description}
                </p>

                <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-800/60">
                  From: {alert.projectTitle}
                </div>
              </div>
            ))}

            {topAlerts.length === 0 && (
              <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-6 text-center text-xs text-slate-400">
                <CheckCircle2 className="h-5 w-5 text-emerald-400 mx-auto mb-1" />
                <span>No high priority alerts pending. All reviewed findings are clear.</span>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* SECTION 4 — COMPACT RECENT ACTIVITY (Section 3 Requirement) */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Recent Activity</h2>
            <p className="text-xs text-slate-400">Traceable actions and milestone logging</p>
          </div>
          <span className="text-[11px] text-slate-500">Live operational ledger</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {activities.slice(0, 3).map((act) => (
            <div
              key={act.id}
              className="rounded-xl border border-slate-800/80 bg-[#0e1422] p-3.5 text-xs space-y-1"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span className="font-semibold text-blue-400 capitalize">{act.type.replace('_', ' ')}</span>
                <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <div className="font-bold text-slate-200 truncate">{act.title}</div>
              <p className="text-[11px] text-slate-400 line-clamp-2">{act.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
