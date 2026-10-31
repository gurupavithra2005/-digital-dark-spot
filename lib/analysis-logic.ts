import { 
  ResearchAspectCoverage, 
  VerificationTask, 
  SourceCategory, 
  FreshnessStatus, 
  CoverageStatus,
  InformationGap,
  ConflictingClaim,
  OutdatedSourceWarning,
  ExtractedClaim,
  AnalysisVersion
} from '@/types/research';

/**
 * Calculates a 0-100 score representing overall research coverage
 */
export function calculateCoverageSummaryScore(matrix: ResearchAspectCoverage[]): number {
  if (!matrix || matrix.length === 0) return 0;

  const weights: Record<CoverageStatus, number> = {
    covered: 100,
    partially_covered: 60,
    conflicting: 35,
    requires_verification: 25,
    not_found: 0,
  };

  const totalPoints = matrix.reduce((acc, row) => {
    return acc + (weights[row.status] ?? 0);
  }, 0);

  return Math.round(totalPoints / matrix.length);
}

/**
 * Provides transparent breakdown and explanation of coverage calculation (Part 13)
 */
export function getCoverageExplanation(matrix: ResearchAspectCoverage[]) {
  if (!matrix || matrix.length === 0) {
    return {
      coveredCount: 0,
      partiallyCoveredCount: 0,
      notFoundCount: 0,
      conflictingCount: 0,
      verificationCount: 0,
      totalCount: 0,
      score: 0,
      summaryText: '0 of 0 research criteria covered'
    };
  }

  const totalCount = matrix.length;
  const coveredCount = matrix.filter((m) => m.status === 'covered').length;
  const partiallyCoveredCount = matrix.filter((m) => m.status === 'partially_covered').length;
  const notFoundCount = matrix.filter((m) => m.status === 'not_found').length;
  const conflictingCount = matrix.filter((m) => m.status === 'conflicting').length;
  const verificationCount = matrix.filter((m) => m.status === 'requires_verification').length;
  const score = calculateCoverageSummaryScore(matrix);

  return {
    coveredCount,
    partiallyCoveredCount,
    notFoundCount,
    conflictingCount,
    verificationCount,
    totalCount,
    score,
    summaryText: `${coveredCount} of ${totalCount} research criteria covered (${score}% overall score)`
  };
}

/**
 * Computes completion statistics for verification checklist
 */
export function computeChecklistProgress(tasks: VerificationTask[]) {
  if (!tasks || tasks.length === 0) {
    return { total: 0, completed: 0, inProgress: 0, pending: 0, percentage: 0 };
  }

  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'completed').length;
  const inProgress = tasks.filter((t) => t.status === 'in_progress').length;
  const pending = tasks.filter((t) => t.status === 'pending').length;
  const percentage = Math.round((completed / total) * 100);

  return { total, completed, inProgress, pending, percentage };
}

/**
 * Classifies a source based on URL domain and organization hints
 */
export function classifySourceCategory(urlOrDomain: string, orgName: string = ''): SourceCategory {
  const normalized = (urlOrDomain + ' ' + orgName).toLowerCase();

  if (
    normalized.includes('.gov') || 
    normalized.includes('.nic.in') || 
    normalized.includes('ministry') || 
    normalized.includes('gazette') ||
    normalized.includes('department of')
  ) {
    return 'official_government';
  }

  if (
    normalized.includes('.edu') || 
    normalized.includes('.ac.in') || 
    normalized.includes('university') || 
    normalized.includes('college') ||
    normalized.includes('institute')
  ) {
    return 'educational';
  }

  if (
    normalized.includes('.org') || 
    normalized.includes('foundation') || 
    normalized.includes('council') ||
    normalized.includes('board')
  ) {
    return 'institutional';
  }

  if (
    normalized.includes('news') || 
    normalized.includes('blog') || 
    normalized.includes('times') || 
    normalized.includes('guide') ||
    normalized.includes('finder')
  ) {
    return 'secondary_news';
  }

  if (normalized.includes('pasted') || normalized.includes('manual')) {
    return 'user_provided';
  }

  return 'unknown';
}

/**
 * Inspects a source publication/updated date against reference current year (2026)
 */
export function detectDateFreshnessWarning(
  sourceDateStr: string | undefined,
  currentYear: number = new Date().getFullYear(),
  operationalContext: string = ''
): { status: FreshnessStatus; warningReason: string; severity: 'high' | 'medium' | 'low' } | null {
  if (!sourceDateStr || sourceDateStr.trim() === '') {
    return {
      status: 'date_unknown',
      warningReason: 'Information is undated; publication date could not be established from source metadata.',
      severity: 'medium',
    };
  }

  const parsedDate = new Date(sourceDateStr);
  const year = isNaN(parsedDate.getFullYear()) ? null : parsedDate.getFullYear();

  if (year && year < currentYear - 1) {
    return {
      status: 'earlier_application_cycle',
      warningReason: `Source document is dated ${year}, which is ${currentYear - year} years prior to current ${currentYear} operational cycle.`,
      severity: year <= currentYear - 2 ? 'high' : 'medium',
    };
  }

  if (operationalContext && (operationalContext.includes('2023') || operationalContext.includes('2024')) && currentYear >= 2026) {
    return {
      status: 'potentially_outdated',
      warningReason: `Source references historical cycle timelines (${operationalContext}) which have likely been superseded.`,
      severity: 'high',
    };
  }

  return null;
}

/**
 * Evaluates the coverage status of a research aspect based on extracted evidence, gaps, and conflicts
 */
export function evaluateAspectCoverage(
  aspect: string,
  claims: ExtractedClaim[],
  gaps: InformationGap[],
  conflicts: ConflictingClaim[]
): CoverageStatus {
  const normAspect = aspect.toLowerCase();

  const hasConflict = conflicts.some(
    (c) => c.aspect.toLowerCase().includes(normAspect) || normAspect.includes(c.aspect.toLowerCase())
  );
  if (hasConflict) return 'conflicting';

  const relatedGaps = gaps.filter(
    (g) => g.title.toLowerCase().includes(normAspect) || normAspect.includes(g.title.toLowerCase())
  );

  const hasMissingGap = relatedGaps.some(
    (g) => g.gapType === 'missing_information' || g.gapType === 'missing_dates_deadlines'
  );
  if (hasMissingGap) return 'not_found';

  const hasVerificationGap = relatedGaps.some(
    (g) => g.gapType === 'missing_official_confirmation' || g.priority === 'high'
  );
  if (hasVerificationGap) return 'requires_verification';

  const matchingClaims = claims.filter(
    (c) => c.category.toLowerCase().includes(normAspect) || c.claimText.toLowerCase().includes(normAspect)
  );

  if (matchingClaims.length >= 2) return 'covered';
  if (matchingClaims.length === 1) return 'partially_covered';

  if (relatedGaps.length > 0) return 'partially_covered';

  return 'not_found';
}

/**
 * Generates an automated verification checklist from detected gaps, conflicts, and freshness warnings
 */
export function generateVerificationChecklistFromFindings(
  projectId: string,
  gaps: InformationGap[],
  conflicts: ConflictingClaim[],
  warnings: OutdatedSourceWarning[]
): VerificationTask[] {
  const tasks: VerificationTask[] = [];

  conflicts.forEach((c, idx) => {
    tasks.push({
      id: `task-conflict-${idx + 1}`,
      projectId,
      title: `Resolve conflict: ${c.aspect}`,
      reason: c.explanation,
      relatedFinding: `Possible Conflict: ${c.sourceA.sourceTitle} vs ${c.sourceB.sourceTitle}`,
      suggestedOfficialSource: 'Official Regulatory Portal or Department Gazetted circular',
      priority: 'high',
      status: 'pending',
    });
  });

  gaps.forEach((g, idx) => {
    tasks.push({
      id: `task-gap-${idx + 1}`,
      projectId,
      title: `Verify missing detail: ${g.title}`,
      reason: g.whyItMatters,
      relatedFinding: `Potential Information Gap (${g.gapType})`,
      suggestedOfficialSource: g.suggestedSourceToVerify || 'Authoritative program handbook',
      priority: g.priority,
      status: 'pending',
    });
  });

  warnings
    .filter((w) => w.severity === 'high')
    .forEach((w, idx) => {
      tasks.push({
        id: `task-fresh-${idx + 1}`,
        projectId,
        title: `Verify active operational dates for: ${w.sourceTitle}`,
        reason: w.warningReason,
        relatedFinding: `Freshness Alert: ${w.status}`,
        suggestedOfficialSource: 'Latest active press circular / current calendar',
        priority: 'high',
        status: 'pending',
      });
    });

  return tasks;
}

/**
 * Generates change comparison strings between two analysis versions (Part 11)
 */
export function generateVersionChangesSummary(
  prevVersion: AnalysisVersion | undefined,
  currVersion: {
    sourceCount: number;
    gapsCount: number;
    conflictsCount: number;
    coverageScore: number;
  }
): string[] {
  if (!prevVersion) {
    return ['Initial baseline analysis completed across provided documentation.'];
  }

  const changes: string[] = [];
  const sourceDiff = currVersion.sourceCount - prevVersion.sourceCount;
  if (sourceDiff > 0) {
    changes.push(`Added ${sourceDiff} new source document${sourceDiff > 1 ? 's' : ''}.`);
  } else if (sourceDiff < 0) {
    changes.push(`Removed ${Math.abs(sourceDiff)} source document${Math.abs(sourceDiff) > 1 ? 's' : ''}.`);
  }

  const gapDiff = currVersion.gapsCount - prevVersion.gapsCount;
  if (gapDiff < 0) {
    changes.push(`${Math.abs(gapDiff)} previously identified gap${Math.abs(gapDiff) > 1 ? 's are' : ' is'} now covered by new evidence.`);
  } else if (gapDiff > 0) {
    changes.push(`Identified ${gapDiff} new potential information gap${gapDiff > 1 ? 's' : ''}.`);
  }

  const conflictDiff = currVersion.conflictsCount - prevVersion.conflictsCount;
  if (conflictDiff > 0) {
    changes.push(`Detected ${conflictDiff} new conflicting claim${conflictDiff > 1 ? 's' : ''} across sources.`);
  }

  const scoreDiff = currVersion.coverageScore - prevVersion.coverageScore;
  if (scoreDiff !== 0) {
    changes.push(`Research coverage score changed from ${prevVersion.coverageScore}% to ${currVersion.coverageScore}%.`);
  }

  return changes.length > 0 ? changes : ['Re-analyzed sources; evidence coverage remains consistent.'];
}
