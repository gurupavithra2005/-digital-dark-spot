import { 
  ResearchProject, 
  VerificationTask, 
  Source, 
  ActivityItem, 
  AnalysisVersion,
  FindingReviewStatus 
} from '@/types/research';
import { SAMPLE_SCHOLARSHIP_PROJECT } from './sample-data';

const STORAGE_KEY = 'digital_dark_spot_projects_v2';
const ACTIVE_PROJECT_KEY = 'digital_dark_spot_active_project_id_v2';
const ACTIVITIES_KEY = 'digital_dark_spot_activities_v1';

export function getAllProjects(): ResearchProject[] {
  if (typeof window === 'undefined') return [SAMPLE_SCHOLARSHIP_PROJECT];

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = [SAMPLE_SCHOLARSHIP_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed: ResearchProject[] = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [SAMPLE_SCHOLARSHIP_PROJECT];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.error('Error reading projects from storage:', err);
    return [SAMPLE_SCHOLARSHIP_PROJECT];
  }
}

export function getProjectById(id: string): ResearchProject | null {
  const all = getAllProjects();
  return all.find((p) => p.id === id) || null;
}

export function saveProject(project: ResearchProject): void {
  if (typeof window === 'undefined') return;

  try {
    const all = getAllProjects();
    const index = all.findIndex((p) => p.id === project.id);
    const updated: ResearchProject = {
      ...project,
      updatedAt: new Date().toISOString(),
    };

    if (index >= 0) {
      all[index] = updated;
    } else {
      all.unshift(updated);
      addActivity({
        type: 'project_created',
        title: 'New Research Created',
        description: `Created project "${project.title}"`,
        projectId: project.id,
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch (err) {
    console.error('Failed to save project:', err);
  }
}

export function deleteProject(id: string): boolean {
  if (typeof window === 'undefined') return false;

  try {
    const all = getAllProjects();
    const filtered = all.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    const active = getActiveProjectId();
    if (active === id) {
      const nextId = filtered.length > 0 ? filtered[0].id : '';
      setActiveProjectId(nextId);
    }
    return true;
  } catch (err) {
    console.error('Failed to delete project:', err);
    return false;
  }
}

export function getActiveProjectId(): string | null {
  if (typeof window === 'undefined') return 'demo-scholarship-2026';
  return localStorage.getItem(ACTIVE_PROJECT_KEY) || 'demo-scholarship-2026';
}

export function setActiveProjectId(id: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_PROJECT_KEY, id);
}

export function resetToDemo(): ResearchProject {
  const now = new Date();
  const demo: ResearchProject = {
    ...SAMPLE_SCHOLARSHIP_PROJECT,
    createdAt: new Date(now.getTime() - 45 * 60 * 1000).toISOString(),
    updatedAt: now.toISOString(),
  };

  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([demo]));
    setActiveProjectId(demo.id);
    addActivity({
      type: 'project_created',
      title: 'Demo Loaded',
      description: 'Loaded Illustrative Scholarship Verification Scenario',
      projectId: demo.id,
    });
  }
  return demo;
}


export function clearAllLocalData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVE_PROJECT_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
  }
}

/**
 * Duplicate source detection
 */
export function checkSourceDuplicate(existingSources: Source[], newUrlOrTitle: string): { isDuplicate: boolean; matchedSource?: Source } {
  if (!newUrlOrTitle) return { isDuplicate: false };
  const clean = newUrlOrTitle.trim().toLowerCase();

  const found = existingSources.find((s) => {
    if (s.url && s.url.toLowerCase() === clean) return true;
    if (s.title && s.title.toLowerCase() === clean) return true;
    return false;
  });

  return { isDuplicate: !!found, matchedSource: found };
}

/**
 * Records an analysis version
 */
export function recordAnalysisVersion(project: ResearchProject, changes?: string[]): ResearchProject {
  const versions = project.analysisVersions || [];
  const nextNum = versions.length + 1;

  const newVersion: AnalysisVersion = {
    versionNumber: nextNum,
    analyzedAt: new Date().toISOString(),
    sourceCount: project.sources?.length || 0,
    gapsCount: project.gaps?.length || 0,
    conflictsCount: project.conflicts?.length || 0,
    freshnessCount: project.freshnessWarnings?.length || 0,
    checklistCount: project.checklist?.length || 0,
    coverageScore: project.coverageSummaryScore ?? 70,
    changesSinceLastVersion: changes && changes.length > 0 ? changes : [
      `Analyzed ${project.sources?.length || 0} sources`,
      `Identified ${project.gaps?.length || 0} potential information gaps`,
      `Detected ${project.conflicts?.length || 0} possible conflicts`,
      `Compiled ${project.checklist?.length || 0} verification tasks`
    ],
    snapshot: {
      gaps: [...(project.gaps || [])],
      conflicts: [...(project.conflicts || [])],
      claims: [...(project.claims || [])],
      freshnessWarnings: [...(project.freshnessWarnings || [])],
      coverageMatrix: [...(project.coverageMatrix || [])],
    }
  };

  const updated: ResearchProject = {
    ...project,
    analysisVersions: [...versions, newVersion],
    updatedAt: new Date().toISOString(),
  };

  saveProject(updated);
  return updated;
}

/**
 * Activity Feed Management
 */
export const INITIAL_ACTIVITIES: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'analysis_completed',
    title: 'Intelligence Analysis Completed',
    description: 'Synthesized 3 sources for National Merit Scholarship review',
    timestamp: '2026-10-31T07:00:00.000Z',
    projectId: 'demo-scholarship-2026',
  },
  {
    id: 'act-2',
    type: 'finding_confirmed',
    title: 'Gap Confirmed by Researcher',
    description: 'Confirmed official document requirement for Revenue Certificate',
    timestamp: '2026-10-31T07:01:00.000Z',
    projectId: 'demo-scholarship-2026',
  },
  {
    id: 'act-3',
    type: 'task_completed',
    title: 'Verification Action Verified',
    description: 'Dean office Room 104 verification workflow confirmed',
    timestamp: '2026-10-31T07:02:00.000Z',
    projectId: 'demo-scholarship-2026',
  }
];

export function getActivities(): ActivityItem[] {
  if (typeof window === 'undefined') return INITIAL_ACTIVITIES;
  try {
    const raw = localStorage.getItem(ACTIVITIES_KEY);
    if (!raw) {
      localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(INITIAL_ACTIVITIES));
      return INITIAL_ACTIVITIES;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_ACTIVITIES;
    }
    return parsed;
  } catch {
    return INITIAL_ACTIVITIES;
  }
}

export function addActivity(activity: Omit<ActivityItem, 'id' | 'timestamp'>): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getActivities();
    const newItem: ActivityItem = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
    };
    list.unshift(newItem);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(list.slice(0, 20)));
  } catch (err) {
    console.error('Error adding activity:', err);
  }
}

/**
 * Generate CSV export for verification checklist
 */
export function exportChecklistToCSV(project: ResearchProject): string {
  const headers = ['Task Title', 'Priority', 'Status', 'Reason', 'Suggested Official Source', 'User Notes', 'Completed At'];
  const rows = (project.checklist || []).map((t) => [
    `"${(t.title || '').replace(/"/g, '""')}"`,
    `"${t.priority}"`,
    `"${t.status}"`,
    `"${(t.reason || '').replace(/"/g, '""')}"`,
    `"${(t.suggestedOfficialSource || '').replace(/"/g, '""')}"`,
    `"${(t.userNotes || '').replace(/"/g, '""')}"`,
    `"${t.completedAt || ''}"`,
  ]);

  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

/**
 * Generate CSV export for all findings (gaps, conflicts, warnings, reviews)
 */
export function exportFindingsToCSV(project: ResearchProject): string {
  const headers = ['Finding Type', 'Title / Aspect', 'Priority / Severity', 'Review Status', 'AI Confidence', 'Details', 'Action / Official Source', 'User Notes / Reason'];
  
  const gapRows = (project.gaps || []).map((g) => [
    '"Information Gap"',
    `"${g.title.replace(/"/g, '""')}"`,
    `"${g.priority}"`,
    `"${g.reviewStatus || 'needs_review'}"`,
    `"${g.aiConfidence ?? 90}%"`,
    `"${g.whyItMatters.replace(/"/g, '""')}"`,
    `"${g.recommendedAction.replace(/"/g, '""')}"`,
    `"${(g.userReviewNotes || g.dismissReason || '').replace(/"/g, '""')}"`,
  ]);

  const conflictRows = (project.conflicts || []).map((c) => [
    '"Conflicting Claim"',
    `"${c.aspect.replace(/"/g, '""')}"`,
    '"High"',
    `"${c.reviewStatus || 'needs_review'}"`,
    `"${c.aiConfidence ?? 85}%"`,
    `"${c.explanation.replace(/"/g, '""')}"`,
    `"${c.recommendedAction.replace(/"/g, '""')}"`,
    `"${(c.userReviewNotes || c.dismissReason || '').replace(/"/g, '""')}"`,
  ]);

  const freshRows = (project.freshnessWarnings || []).map((w) => [
    '"Freshness Warning"',
    `"${w.sourceTitle.replace(/"/g, '""')}"`,
    `"${w.severity}"`,
    `"${w.reviewStatus || 'needs_review'}"`,
    '"95%"',
    `"${w.warningReason.replace(/"/g, '""')}"`,
    `"${w.suggestedAction.replace(/"/g, '""')}"`,
    '""',
  ]);

  return [headers.join(','), ...gapRows.map((r) => r.join(',')), ...conflictRows.map((r) => r.join(',')), ...freshRows.map((r) => r.join(','))].join('\n');
}
