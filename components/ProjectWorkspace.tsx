'use client';

import React, { useState } from 'react';
import { 
  FileText, 
  Layers, 
  AlertTriangle, 
  GitCompare, 
  Clock, 
  CheckSquare, 
  ExternalLink, 
  Download, 
  MessageSquare, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  Plus, 
  Search, 
  Quote, 
  ArrowUpRight, 
  Send,
  Loader2,
  X,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Info,
  RefreshCw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  History,
  Check,
  ChevronRight
} from 'lucide-react';
import { 
  ResearchProject, 
  ExtractedClaim, 
  InformationGap, 
  ConflictingClaim, 
  OutdatedSourceWarning, 
  VerificationTask, 
  Source,
  CoverageStatus,
  FindingReviewStatus,
  AnalysisVersion
} from '@/types/research';
import { 
  computeChecklistProgress, 
  getCoverageExplanation, 
  generateVersionChangesSummary 
} from '@/lib/analysis-logic';
import { recordAnalysisVersion, addActivity } from '@/lib/storage';
import { EvidenceDrawer, EvidenceDrawerData } from './EvidenceDrawer';
import { ReportModal } from './ReportModal';

interface ProjectWorkspaceProps {
  project: ResearchProject;
  initialTab?: string;
  onUpdateProject: (updated: ResearchProject) => void;
  onBackToDashboard: () => void;
}

export function ProjectWorkspace({ 
  project, 
  initialTab = 'overview', 
  onUpdateProject, 
  onBackToDashboard 
}: ProjectWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'sources' | 'claims' | 'gaps' | 'conflicts' | 'outdated' | 'checklist'
  >((initialTab as any) || 'overview');

  // Executive summary "Read More" clamp
  const [isSummaryExpanded, setIsSummaryExpanded] = useState(false);

  // Evidence panel state
  const [evidenceData, setEvidenceData] = useState<EvidenceDrawerData | null>(null);
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  // Report modal state
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Re-analysis loading state
  const [isReanalyzing, setIsReanalyzing] = useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);

  // Finding review filter
  const [reviewFilter, setReviewFilter] = useState<'all' | 'needs_review' | 'confirmed' | 'dismissed' | 'resolved'>('all');
  const [dismissTargetId, setDismissTargetId] = useState<string | null>(null);
  const [dismissReason, setDismissReason] = useState('');

  // Sources search & filter
  const [sourceSearch, setSourceSearch] = useState('');
  const [sourceCategoryFilter, setSourceCategoryFilter] = useState<string>('all');
  const [expandedSourceId, setExpandedSourceId] = useState<string | null>(null);

  // Coverage matrix expanded row
  const [expandedAspect, setExpandedAspect] = useState<string | null>(null);

  // Checklist filters & custom task
  const [checklistFilter, setChecklistFilter] = useState<'all' | 'high' | 'pending' | 'completed'>('all');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskSource, setNewTaskSource] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Grounded Chat state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string }>>([
    {
      role: 'assistant',
      text: `Hello! I am your research intelligence assistant. I can answer questions specifically grounded in the ${project.sources?.length || 0} sources and findings reviewed for this project. What would you like to verify?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Key metrics
  const checklistStats = computeChecklistProgress(project.checklist || []);
  const coverageBreakdown = getCoverageExplanation(project.coverageMatrix || []);
  const openFindingsCount = 
    (project.gaps || []).filter((g) => g.reviewStatus !== 'dismissed').length +
    (project.conflicts || []).filter((c) => c.reviewStatus !== 'dismissed').length +
    (project.freshnessWarnings || []).filter((w) => w.reviewStatus !== 'dismissed').length;

  const currentVersion = project.analysisVersions && project.analysisVersions.length > 0 
    ? project.analysisVersions[project.analysisVersions.length - 1] 
    : undefined;

  const openEvidence = (data: EvidenceDrawerData) => {
    setEvidenceData(data);
    setIsEvidenceOpen(true);
  };

  // RE-ANALYZE RESEARCH & VERSION RECORDING
  const handleReanalyze = async () => {
    setIsReanalyzing(true);
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: project.id,
          title: project.title,
          researchQuestion: project.researchQuestion,
          objective: project.objective,
          geographicScope: project.geographicScope,
          authorityOrOrganization: project.authorityOrOrganization,
          keyAspectsToInvestigate: project.keyAspectsToInvestigate,
          sources: project.sources?.filter((s) => !s.isExcluded) || [],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reanalysis failed');

      const reanalyzed: ResearchProject = data.project;
      const changes = generateVersionChangesSummary(currentVersion, {
        sourceCount: reanalyzed.sources?.length || 0,
        gapsCount: reanalyzed.gaps?.length || 0,
        conflictsCount: reanalyzed.conflicts?.length || 0,
        coverageScore: reanalyzed.coverageSummaryScore ?? 70,
      });

      const updatedWithVersion = recordAnalysisVersion({
        ...project,
        ...reanalyzed,
        analysisVersions: project.analysisVersions || [],
      }, changes);

      addActivity({
        type: 'analysis_completed',
        title: `Reanalysis Completed (v${(updatedWithVersion.analysisVersions?.length || 1)})`,
        description: `Updated analysis across ${reanalyzed.sources?.length || 0} sources.`,
        projectId: project.id,
      });

      onUpdateProject(updatedWithVersion);
    } catch (err: any) {
      alert(err.message || 'Error during reanalysis.');
    } finally {
      setIsReanalyzing(false);
    }
  };

  // FINDING REVIEW ACTIONS (Part 9)
  const handleReviewGap = (gapId: string, status: FindingReviewStatus, reason?: string) => {
    const updated = (project.gaps || []).map((g) => {
      if (g.id === gapId) {
        return {
          ...g,
          reviewStatus: status,
          reviewedAt: new Date().toISOString(),
          dismissReason: reason || g.dismissReason,
        };
      }
      return g;
    });

    const updatedProject = { ...project, gaps: updated };
    onUpdateProject(updatedProject);

    if (status === 'confirmed') {
      addActivity({
        type: 'finding_confirmed',
        title: 'Information Gap Confirmed',
        description: `Researcher confirmed gap: "${(project.gaps || []).find((g) => g.id === gapId)?.title}"`,
        projectId: project.id,
      });
    }
  };

  const handleReviewConflict = (conflictId: string, status: FindingReviewStatus, reason?: string) => {
    const updated = (project.conflicts || []).map((c) => {
      if (c.id === conflictId) {
        return {
          ...c,
          reviewStatus: status,
          reviewedAt: new Date().toISOString(),
          dismissReason: reason || c.dismissReason,
        };
      }
      return c;
    });

    onUpdateProject({ ...project, conflicts: updated });
  };

  // CHECKLIST TOGGLE
  const handleToggleTaskStatus = (taskId: string) => {
    const updated = (project.checklist || []).map((t) => {
      if (t.id === taskId) {
        const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
        return {
          ...t,
          status: nextStatus as any,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });

    onUpdateProject({ ...project, checklist: updated });
  };

  const handleUpdateTaskNotes = (taskId: string, notes: string) => {
    const updated = (project.checklist || []).map((t) => (t.id === taskId ? { ...t, userNotes: notes } : t));
    onUpdateProject({ ...project, checklist: updated });
  };

  const handleAddCustomTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: VerificationTask = {
      id: `task-custom-${Date.now()}`,
      projectId: project.id,
      title: newTaskTitle.trim(),
      reason: 'User-specified verification requirement.',
      suggestedOfficialSource: newTaskSource.trim() || 'Official publishing authority',
      priority: newTaskPriority,
      status: 'pending',
      isUserCreated: true,
    };

    onUpdateProject({ ...project, checklist: [newTask, ...project.checklist] });
    setNewTaskTitle('');
    setNewTaskSource('');
  };

  const handleVerifyClaim = (claimId: string) => {
    const updated = (project.claims || []).map((c) => (c.id === claimId ? { ...c, isVerifiedByUser: true } : c));
    onUpdateProject({ ...project, claims: updated });
    setIsEvidenceOpen(false);
  };

  // Grounded Assistant Message
  const handleSendChatMessage = async () => {
    if (!chatInput.trim() || isChatLoading) return;
    const userMsg = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg, project }),
      });

      const data = await res.json();
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.reply || 'The reviewed sources do not provide sufficient evidence to answer this question.',
        },
      ]);
    } catch {
      setChatMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: 'The reviewed sources do not provide sufficient evidence to answer this question. Please cross-reference with official publications.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  // Filtered lists
  const filteredSources = (project.sources || []).filter((s) => {
    const matchesSearch = s.title.toLowerCase().includes(sourceSearch.toLowerCase()) ||
      (s.organization || '').toLowerCase().includes(sourceSearch.toLowerCase()) ||
      (s.domain || '').toLowerCase().includes(sourceSearch.toLowerCase());
    const matchesCat = sourceCategoryFilter === 'all' || s.category === sourceCategoryFilter;
    return matchesSearch && matchesCat;
  });

  const filteredGaps = (project.gaps || []).filter((g) => {
    if (reviewFilter === 'all') return true;
    return (g.reviewStatus || 'needs_review') === reviewFilter;
  });

  const filteredConflicts = (project.conflicts || []).filter((c) => {
    if (reviewFilter === 'all') return true;
    return (c.reviewStatus || 'needs_review') === reviewFilter;
  });

  const filteredChecklist = (project.checklist || []).filter((t) => {
    if (checklistFilter === 'high') return t.priority === 'high';
    if (checklistFilter === 'pending') return t.status === 'pending' || t.status === 'in_progress';
    if (checklistFilter === 'completed') return t.status === 'completed';
    return true;
  });

  const getCoverageBadge = (status: CoverageStatus) => {
    switch (status) {
      case 'covered':
        return <span className="rounded-md bg-emerald-950/80 border border-emerald-500/40 px-2 py-0.5 text-[11px] font-bold text-emerald-300">Covered</span>;
      case 'partially_covered':
        return <span className="rounded-md bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[11px] font-bold text-cyan-300">Partially Covered</span>;
      case 'not_found':
        return <span className="rounded-md bg-amber-950/80 border border-amber-500/40 px-2 py-0.5 text-[11px] font-bold text-amber-300">Not Found</span>;
      case 'conflicting':
        return <span className="rounded-md bg-rose-950/80 border border-rose-500/40 px-2 py-0.5 text-[11px] font-bold text-rose-300">Conflicting</span>;
      case 'requires_verification':
        return <span className="rounded-md bg-purple-950/80 border border-purple-500/40 px-2 py-0.5 text-[11px] font-bold text-purple-300">Requires Verification</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 pb-20 animate-in fade-in">
      
      {/* PART 4 — WORKSPACE TOP HEADER */}
      <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 space-y-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-md bg-blue-950 border border-blue-500/40 px-2 py-0.5 text-[10px] font-semibold text-blue-300 uppercase">
                Active Research Project
              </span>
              {(project.isSampleDemo || project.isDemo) && (
                <span className="rounded-md bg-amber-950 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                  ILLUSTRATIVE DEMO DATA — NOT LIVE OFFICIAL INFORMATION
                </span>
              )}
              {currentVersion && (
                <button
                  onClick={() => setVersionHistoryOpen(!versionHistoryOpen)}
                  className="rounded-md bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-[10px] font-semibold text-slate-300 flex items-center gap-1"
                >
                  <History className="h-3 w-3 text-indigo-400" />
                  <span>Version {currentVersion.versionNumber}</span>
                  <ChevronDown className="h-2.5 w-2.5 text-slate-400" />
                </button>
              )}
              <span className="text-[11px] text-slate-400">
                Analyzed: {new Date(project.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {project.title}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
              <span className="text-slate-400">Research Question:</span>
              <span className="italic font-medium text-blue-200">&ldquo;{project.researchQuestion}&rdquo;</span>
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              disabled={isReanalyzing}
              onClick={handleReanalyze}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors disabled:opacity-50"
              title="Rerun multi-source intelligence analysis and create a new version"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isReanalyzing ? 'animate-spin text-blue-400' : 'text-slate-400'}`} />
              <span>{isReanalyzing ? 'Reanalyzing...' : 'Reanalyze'}</span>
            </button>

            <button
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>Export Report</span>
            </button>

            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600/20 border border-blue-500/40 hover:bg-blue-600/30 px-3.5 py-2 text-xs font-semibold text-blue-300 transition-colors"
            >
              <MessageSquare className="h-3.5 w-3.5" />
              <span>Ask Assistant</span>
            </button>
          </div>
        </div>

        {/* MAXIMUM 3 IMPORTANT INDICATORS (Part 4 Requirement) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-800/80 text-center">
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-3">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sources Reviewed</div>
            <div className="text-xl font-extrabold text-blue-400 mt-0.5">{project.sources?.length || 0}</div>
          </div>
          <div className="rounded-xl border border-amber-500/20 bg-amber-950/10 p-3">
            <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Open Findings</div>
            <div className="text-xl font-extrabold text-amber-400 mt-0.5">{openFindingsCount}</div>
          </div>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/10 p-3">
            <div className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">Pending Verification</div>
            <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
              {checklistStats.pending + checklistStats.inProgress} <span className="text-xs font-normal text-slate-400">({checklistStats.percentage}% verified)</span>
            </div>
          </div>
        </div>

        {/* VERSION HISTORY EXPANDABLE DRAWER (Part 11 Innovation) */}
        {versionHistoryOpen && currentVersion && (
          <div className="rounded-xl border border-indigo-500/30 bg-indigo-950/20 p-4 space-y-3 text-xs animate-in fade-in">
            <div className="flex items-center justify-between">
              <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                <History className="h-4 w-4" />
                <span>What Changed Since Last Analysis? (Version {currentVersion.versionNumber})</span>
              </span>
              <span className="text-[11px] text-slate-400">
                {new Date(currentVersion.analyzedAt).toLocaleString()}
              </span>
            </div>

            <ul className="list-disc list-inside space-y-1 text-slate-200">
              {(currentVersion.changesSinceLastVersion || ['Evidence synthesis completed.']).map((change, i) => (
                <li key={i}>{change}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 7 MODULE TABS NAVIGATION */}
      <div className="border-b border-slate-800 bg-[#0d121c] sticky top-14 md:top-14 z-20 rounded-xl overflow-hidden">
        <div className="flex overflow-x-auto no-scrollbar gap-1 p-1">
          {[
            { id: 'overview', label: '1. Overview', count: null },
            { id: 'sources', label: '2. Sources', count: project.sources?.length },
            { id: 'claims', label: '3. Extracted Claims', count: project.claims?.length },
            { id: 'gaps', label: '4. Information Gaps', count: project.gaps?.length, alert: true },
            { id: 'conflicts', label: '5. Conflicts', count: project.conflicts?.length, warn: true },
            { id: 'outdated', label: '6. Outdated Information', count: project.freshnessWarnings?.length },
            { id: 'checklist', label: '7. Verification Checklist', count: `${checklistStats.completed}/${checklistStats.total}` },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== null && tab.count !== undefined && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : tab.warn
                        ? 'bg-rose-950 text-rose-300 border border-rose-500/30'
                        : tab.alert
                        ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: CONCISE OVERVIEW (Part 5 Redesign)
          ========================================================================= */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          
          {/* 1. Executive Summary with "Read More" clamp */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-400">
              <ShieldCheck className="h-4 w-4" />
              <span>Executive Synthesis</span>
            </div>
            
            <p className={`text-sm text-slate-200 leading-relaxed ${isSummaryExpanded ? '' : 'line-clamp-3'}`}>
              {project.executiveSummary || 'Research analysis complete across collected documentation.'}
            </p>

            <button
              onClick={() => setIsSummaryExpanded(!isSummaryExpanded)}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 pt-1"
            >
              {isSummaryExpanded ? 'Show Less' : 'Read More'}
            </button>
          </div>

          {/* 2. Research Coverage Summary Preview (Part 5 & Part 13) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 sm:p-6 space-y-4 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">Research Coverage Summary</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Calculation: <span className="text-slate-200 font-semibold">{coverageBreakdown.summaryText}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setExpandedAspect(expandedAspect ? null : (project.coverageMatrix?.[0]?.aspect || ''));
                }}
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 self-start sm:self-auto flex items-center gap-1"
              >
                <span>{expandedAspect ? 'Collapse Full Matrix' : 'View Full Coverage Matrix'}</span>
                <ChevronRight className={`h-3.5 w-3.5 transition-transform ${expandedAspect ? 'rotate-90' : ''}`} />
              </button>
            </div>

            {/* Coverage Preview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {(project.coverageMatrix || []).slice(0, 6).map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => setExpandedAspect(item.aspect)}
                  className="rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs flex items-center justify-between gap-2 hover:border-slate-700 cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-slate-200 truncate">{item.aspect}</span>
                  {getCoverageBadge(item.status)}
                </div>
              ))}
            </div>

            {/* Expanded Full Coverage Matrix Breakdown */}
            {expandedAspect && (
              <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Detailed Criteria Evidence Breakdown
                </div>
                <div className="space-y-2">
                  {(project.coverageMatrix || []).map((row, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl border border-slate-800 bg-[#0a0e17] p-4 text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-sm">{row.aspect}</span>
                        {getCoverageBadge(row.status)}
                      </div>
                      <p className="text-slate-300">{row.summary}</p>
                      <div className="text-[11px] text-slate-500">
                        Supporting Sources: {row.supportingSourceIds?.length > 0 ? `${row.supportingSourceIds.length} source(s) on file` : 'None identified'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 3. Top Important Findings & 4. Recommended Next Actions (Two Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Top 3 Important Findings */}
            <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Top Priority Findings</span>
                </div>
                <button
                  onClick={() => setActiveTab('gaps')}
                  className="text-xs font-semibold text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>View All Findings</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {(project.gaps || []).slice(0, 3).map((g) => (
                  <div key={g.id} className="rounded-xl border border-amber-500/20 bg-[#090d16] p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{g.title}</span>
                      <span className="text-[10px] text-amber-400 font-semibold">
                        {g.aiConfidence ? `${g.aiConfidence}% Confidence` : 'AI Signal'}
                      </span>
                    </div>
                    <p className="text-slate-300 text-[11px] line-clamp-2">{g.whyItMatters}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Top 3 Recommended Next Actions */}
            <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider">
                  <CheckSquare className="h-4 w-4 text-emerald-400" />
                  <span>Recommended Next Actions</span>
                </div>
                <button
                  onClick={() => setActiveTab('checklist')}
                  className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>View Checklist</span>
                  <ArrowUpRight className="h-3 w-3" />
                </button>
              </div>

              <div className="space-y-2.5">
                {(project.checklist || []).slice(0, 3).map((task) => (
                  <div key={task.id} className="rounded-xl border border-slate-800 bg-[#090d16] p-3 text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-100'}`}>
                        {task.title}
                      </span>
                      <span className="rounded bg-rose-950 border border-rose-500/40 px-1.5 py-0.5 text-[10px] text-rose-300 font-bold uppercase">
                        {task.priority}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">Source: {task.suggestedOfficialSource}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: SOURCES (Part 14 Improvements)
          ========================================================================= */}
      {activeTab === 'sources' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Reviewed Documentation & Sources</h2>
              <p className="text-xs text-slate-400">Traceable references indexed for this project</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-500" />
                <input
                  type="text"
                  value={sourceSearch}
                  onChange={(e) => setSourceSearch(e.target.value)}
                  placeholder="Filter sources..."
                  className="rounded-xl border border-slate-700 bg-[#090d16] pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
              </div>

              <select
                value={sourceCategoryFilter}
                onChange={(e) => setSourceCategoryFilter(e.target.value)}
                className="rounded-xl border border-slate-700 bg-[#090d16] px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                <option value="all">All Categories</option>
                <option value="official_government">Government / Gazette</option>
                <option value="educational">Educational / University</option>
                <option value="institutional">Institutional</option>
                <option value="secondary_news">Secondary / Advisory</option>
                <option value="user_provided">User Supplied</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredSources.map((src) => {
              const isExpanded = expandedSourceId === src.id;
              const linkedClaimsCount = (project.claims || []).filter((c) => c.sourceId === src.id).length;
              return (
                <div
                  key={src.id}
                  className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded bg-blue-950 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                          {src.type.toUpperCase()}
                        </span>
                        <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                          {src.category.replace('_', ' ')}
                        </span>
                        <span className="text-[11px] text-emerald-400 font-semibold">
                          {linkedClaimsCount} Linked Claim{linkedClaimsCount === 1 ? '' : 's'}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white">{src.title}</h3>
                    </div>

                    {src.url && (
                      <a
                        href={src.url}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs text-slate-200 transition-colors shrink-0"
                      >
                        <span>Open Source</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    {src.organization && <div>Organization: {src.organization}</div>}
                    <div>Date: {src.publicationDate || 'Date not available'}</div>
                    <div>Extraction Confidence: {src.extractionConfidence}%</div>
                  </div>

                  <div className="pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => setExpandedSourceId(isExpanded ? null : src.id)}
                      className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                      <span>{isExpanded ? 'Hide Extracted Text' : 'View Extracted Text Excerpt'}</span>
                    </button>

                    {isExpanded && (
                      <div className="mt-2.5 rounded-lg bg-[#0a0d16] border border-slate-800 p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                        {src.extractedText || 'No text extracted.'}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 3: EXTRACTED CLAIMS
          ========================================================================= */}
      {activeTab === 'claims' && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Extracted Sourced Claims</h2>
            <p className="text-xs text-slate-400">Verbatim quotes extracted from reviewed documents</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(project.claims || []).map((claim) => (
              <div
                key={claim.id}
                onClick={() =>
                  openEvidence({
                    title: claim.claimText,
                    claim,
                    supportingPassage: claim.supportingPassage,
                    sourceTitle: claim.sourceTitle,
                    sourceUrl: claim.sourceUrl,
                    pageNumber: claim.pageNumber,
                    sectionName: claim.sectionName,
                    confidence: claim.confidence,
                  })
                }
                className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 shadow-sm hover:border-blue-500/50 cursor-pointer transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded bg-blue-950 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                    {claim.category}
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    {claim.isVerifiedByUser ? '✓ Verified by User' : 'Sourced Fact'}
                  </span>
                </div>

                <h3 className="text-sm font-semibold text-white leading-snug">{claim.claimText}</h3>

                <blockquote className="rounded bg-[#090d16] p-3 text-xs italic text-slate-300 border-l-2 border-blue-500">
                  &ldquo;{claim.supportingPassage}&rdquo;
                </blockquote>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span className="truncate max-w-[200px]">{claim.sourceTitle}</span>
                  <span className="text-blue-400 text-[11px] hover:underline flex items-center gap-0.5">
                    <span>Inspect Evidence</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: INFORMATION GAPS (Part 6 & Part 9 AI Finding Review)
          ========================================================================= */}
      {activeTab === 'gaps' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Information Gaps</h2>
              <p className="text-xs text-slate-400">Critical items not sufficiently covered in reviewed sources</p>
            </div>

            {/* Finding Review Filter */}
            <div className="flex items-center gap-1.5 bg-[#0e1422] p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'needs_review', 'confirmed', 'dismissed', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setReviewFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                    reviewFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredGaps.map((gap) => {
              const review = gap.reviewStatus || 'needs_review';
              return (
                <div
                  key={gap.id}
                  className="rounded-2xl border border-amber-500/30 bg-[#0e1422] p-5 sm:p-6 shadow-sm space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        gap.priority === 'high' ? 'bg-rose-950 text-rose-300 border border-rose-500/40' : 'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {gap.priority} Priority
                      </span>
                      <h3 className="text-base font-bold text-white">{gap.title}</h3>
                    </div>

                    {/* AI Confidence separated from Priority */}
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">AI Confidence:</span>
                      <span className="font-bold text-emerald-400">{gap.aiConfidence ?? 92}%</span>
                    </div>
                  </div>

                  {/* Mandatory Evidence Transparency wording */}
                  <div className="rounded-lg bg-amber-950/20 border border-amber-500/20 p-2.5 text-xs font-semibold text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>Potential Information Gap — Not found in the sources reviewed.</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl bg-[#090d16] p-3 border border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-400 uppercase text-[10px]">Why This Gap Matters</div>
                      <p className="text-slate-200">{gap.whyItMatters}</p>
                    </div>

                    <div className="rounded-xl bg-[#090d16] p-3 border border-slate-800 space-y-1">
                      <div className="font-semibold text-slate-400 uppercase text-[10px]">Recommended Action</div>
                      <p className="text-slate-200">{gap.recommendedAction}</p>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 space-y-1">
                    <div><strong className="text-slate-400">What Was Found:</strong> {gap.whatWasFound}</div>
                    <div><strong className="text-rose-400">What Was NOT Found:</strong> {gap.whatWasNotFound}</div>
                  </div>

                  {/* USER REVIEW WORKFLOW (Part 9 New Feature) */}
                  <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400">Review Status:</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${
                        review === 'confirmed' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40' :
                        review === 'dismissed' ? 'bg-slate-800 text-slate-400' :
                        review === 'resolved' ? 'bg-blue-950 text-blue-300 border border-blue-500/40' :
                        'bg-amber-950 text-amber-300 border border-amber-500/40'
                      }`}>
                        {review === 'needs_review' ? 'AI Suggested — Needs Review' : review}
                      </span>
                      {gap.dismissReason && (
                        <span className="text-[11px] text-slate-500 italic">({gap.dismissReason})</span>
                      )}
                    </div>

                    {/* Review Action Buttons */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleReviewGap(gap.id, 'confirmed')}
                        className="rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold text-emerald-300 transition-colors"
                      >
                        ✓ Confirm Finding
                      </button>

                      <button
                        onClick={() => {
                          const reason = prompt('Optional reason for dismissing finding:');
                          handleReviewGap(gap.id, 'dismissed', reason || 'Dismissed by researcher');
                        }}
                        className="rounded-lg bg-slate-800 hover:bg-slate-700 px-2.5 py-1 text-xs text-slate-300 transition-colors"
                      >
                        ✕ Dismiss
                      </button>

                      <button
                        onClick={() => handleReviewGap(gap.id, 'resolved')}
                        className="rounded-lg bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 px-2.5 py-1 text-xs font-semibold text-blue-300 transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 5: CONFLICTS (Part 7 Side-by-Side Comparison)
          ========================================================================= */}
      {activeTab === 'conflicts' && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Cross-Source Conflicting Claims</h2>
            <p className="text-xs text-slate-400">Examines whether discrepancies arise from different application cycles, scopes, or genuine contradictions</p>
          </div>

          <div className="space-y-4">
            {filteredConflicts.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-rose-500/30 bg-[#0e1422] p-5 sm:p-6 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <GitCompare className="h-5 w-5 text-rose-400" />
                    <h3 className="text-base font-bold text-white">{c.aspect}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="rounded bg-rose-950 border border-rose-500/40 px-2.5 py-0.5 text-xs font-semibold text-rose-300">
                      {c.label}
                    </span>
                    <span className="text-xs text-slate-400">Confidence: {c.aiConfidence ?? 88}%</span>
                  </div>
                </div>

                {/* Side-by-Side Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-blue-400 uppercase text-[10px]">Source A {c.sourceA.isOfficial && '(Official)'}</span>
                      <span className="text-slate-400">{c.sourceA.date || 'Date not available'}</span>
                    </div>
                    <div className="text-xs font-semibold text-white">{c.sourceA.sourceTitle}</div>
                    <blockquote className="rounded bg-[#121826] p-3 text-xs italic text-slate-200 border border-slate-800">
                      &ldquo;{c.sourceA.supportingPassage}&rdquo;
                    </blockquote>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-purple-400 uppercase text-[10px]">Source B {c.sourceB.isOfficial && '(Official)'}</span>
                      <span className="text-slate-400">{c.sourceB.date || 'Date not available'}</span>
                    </div>
                    <div className="text-xs font-semibold text-white">{c.sourceB.sourceTitle}</div>
                    <blockquote className="rounded bg-[#121826] p-3 text-xs italic text-slate-200 border border-slate-800">
                      &ldquo;{c.sourceB.supportingPassage}&rdquo;
                    </blockquote>
                  </div>
                </div>

                <div className="rounded-xl bg-[#090d16] p-3.5 border border-slate-800 text-xs space-y-1.5">
                  <div><strong className="text-slate-400">Discrepancy Analysis:</strong> {c.explanation}</div>
                  <div><strong className="text-amber-400">Recommended Resolution:</strong> {c.recommendedAction}</div>
                </div>

                {/* Conflict review status actions */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs text-slate-400">
                    Review: <span className="text-slate-200 font-semibold">{c.reviewStatus || 'AI Suggested — Needs Review'}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleReviewConflict(c.id, 'confirmed')}
                      className="rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 px-2.5 py-1 text-xs font-semibold"
                    >
                      ✓ Confirm Conflict
                    </button>
                    <button
                      onClick={() => handleReviewConflict(c.id, 'resolved')}
                      className="rounded bg-slate-800 hover:bg-slate-700 text-slate-200 px-2.5 py-1 text-xs"
                    >
                      Mark Resolved
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 6: OUTDATED INFORMATION (Part 8)
          ========================================================================= */}
      {activeTab === 'outdated' && (
        <div className="space-y-4 animate-in fade-in">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">Source Freshness & Outdated Alerts</h2>
            <p className="text-xs text-slate-400">Detects historical application cycles, expired deadlines, and temporal discrepancies</p>
          </div>

          <div className="space-y-3">
            {(project.freshnessWarnings || []).map((w) => (
              <div
                key={w.id}
                className="rounded-2xl border border-purple-500/30 bg-[#0e1422] p-5 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-purple-950 border border-purple-500/40 px-2 py-0.5 text-[10px] font-bold uppercase text-purple-300">
                      {w.status.replace(/_/g, ' ')}
                    </span>
                    <h3 className="text-sm font-bold text-white">{w.sourceTitle}</h3>
                  </div>
                  <span className="text-xs text-slate-400">Date on Record: {w.availableDate || 'Date not available'}</span>
                </div>

                <p className="text-xs text-slate-200 bg-[#090d16] p-3 rounded-xl border border-slate-800">
                  {w.warningReason}
                </p>

                <div className="text-xs text-slate-400 flex flex-wrap gap-4">
                  <div><strong>Affected Data:</strong> {w.affectedInformation}</div>
                  <div><strong className="text-amber-400">Action:</strong> {w.suggestedAction}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 7: VERIFICATION CHECKLIST (Part 15)
          ========================================================================= */}
      {activeTab === 'checklist' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">Prioritized Verification Checklist</h2>
              <p className="text-xs text-slate-400">
                Actionable tasks derived from findings: {checklistStats.completed} of {checklistStats.total} completed ({checklistStats.percentage}%)
              </p>
            </div>

            <div className="flex items-center gap-1.5 bg-[#0e1422] p-1 rounded-xl border border-slate-800 text-xs">
              {(['all', 'high', 'pending', 'completed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setChecklistFilter(f)}
                  className={`rounded-lg px-2.5 py-1 text-xs font-semibold capitalize transition-colors ${
                    checklistFilter === f
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-300"
              style={{ width: `${checklistStats.percentage}%` }}
            />
          </div>

          <div className="space-y-3">
            {filteredChecklist.map((task) => {
              const isCompleted = task.status === 'completed';
              return (
                <div
                  key={task.id}
                  className={`rounded-xl border p-4 transition-all space-y-2 ${
                    isCompleted
                      ? 'border-emerald-500/20 bg-emerald-950/10 opacity-75'
                      : 'border-slate-800 bg-[#0e1422]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isCompleted}
                      onChange={() => handleToggleTaskStatus(task.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0 cursor-pointer"
                    />

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                          {task.title}
                        </span>
                        <span className="rounded bg-rose-950 border border-rose-500/40 px-2 py-0.5 text-[10px] font-bold uppercase text-rose-300">
                          {task.priority} Priority
                        </span>
                      </div>

                      <p className="text-xs text-slate-300">{task.reason}</p>
                      <div className="text-xs text-blue-400 font-medium">Source: {task.suggestedOfficialSource}</div>
                    </div>
                  </div>

                  <div className="pl-7">
                    <input
                      type="text"
                      value={task.userNotes || ''}
                      onChange={(e) => handleUpdateTaskNotes(task.id, e.target.value)}
                      placeholder="Add personal verification notes..."
                      className="w-full rounded-lg bg-[#090d16] border border-slate-800 px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add custom task */}
          <div className="rounded-xl border border-dashed border-slate-800 p-4 space-y-3">
            <div className="text-xs font-bold uppercase text-slate-300">Add Custom Verification Task</div>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                placeholder="Task description..."
                className="flex-1 rounded-lg border border-slate-700 bg-[#090d16] px-3 py-1.5 text-xs text-white"
              />
              <input
                type="text"
                value={newTaskSource}
                onChange={(e) => setNewTaskSource(e.target.value)}
                placeholder="Suggested source..."
                className="sm:w-64 rounded-lg border border-slate-700 bg-[#090d16] px-3 py-1.5 text-xs text-white"
              />
              <button
                disabled={!newTaskTitle.trim()}
                onClick={handleAddCustomTask}
                className="rounded-lg bg-blue-600 px-4 py-1.5 text-xs font-bold text-white disabled:opacity-50"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FLOATING GROUNDED RESEARCH ASSISTANT (Part 16) */}
      {isChatOpen && (
        <div className="fixed bottom-4 right-4 z-40 w-full max-w-md rounded-2xl border border-slate-700 bg-[#0d121c] shadow-2xl overflow-hidden flex flex-col h-[460px]">
          <div className="border-b border-slate-800 bg-[#090d15] px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="text-xs font-bold text-white">Grounded Research Assistant</div>
            </div>
            <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-white p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
            {chatMessages.map((msg, i) => (
              <div
                key={i}
                className={`p-3 rounded-xl leading-relaxed ${
                  msg.role === 'user' ? 'ml-8 bg-blue-600 text-white' : 'mr-8 bg-[#131a29] border border-slate-800 text-slate-200'
                }`}
              >
                {msg.text}
              </div>
            ))}
            {isChatLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Loader2 className="h-3.5 w-3.5 animate-spin text-blue-400" />
                <span>Checking project sources...</span>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-slate-800 bg-[#090d15] flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendChatMessage()}
              placeholder="Ask about this project's evidence..."
              className="flex-1 rounded-lg border border-slate-700 bg-[#0d121c] px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
            />
            <button
              disabled={!chatInput.trim() || isChatLoading}
              onClick={handleSendChatMessage}
              className="rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 p-2 text-white"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Evidence Side Drawer */}
      <EvidenceDrawer
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        data={evidenceData}
        onVerifyClaim={handleVerifyClaim}
      />

      {/* Report Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        project={project}
      />
    </div>
  );
}
