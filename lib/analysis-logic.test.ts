import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateCoverageSummaryScore,
  getCoverageExplanation,
  computeChecklistProgress,
  classifySourceCategory,
  detectDateFreshnessWarning,
  evaluateAspectCoverage,
  generateVerificationChecklistFromFindings,
  generateVersionChangesSummary,
  calculateFindingsBreakdown
} from './analysis-logic';
import { ResearchAspectCoverage, VerificationTask, InformationGap, ConflictingClaim, AnalysisVersion } from '@/types/research';

test('calculateCoverageSummaryScore returns accurate percentage', () => {
  const matrix: ResearchAspectCoverage[] = [
    { aspect: 'Eligibility', status: 'covered', summary: '', supportingSourceIds: [] },
    { aspect: 'Renewal', status: 'not_found', summary: '', supportingSourceIds: [] },
    { aspect: 'Deadlines', status: 'partially_covered', summary: '', supportingSourceIds: [] }
  ];
  const score = calculateCoverageSummaryScore(matrix);
  assert.equal(score, 53);
});

test('getCoverageExplanation provides transparent criteria breakdown', () => {
  const matrix: ResearchAspectCoverage[] = [
    { aspect: 'Eligibility', status: 'covered', summary: '', supportingSourceIds: [] },
    { aspect: 'Renewal', status: 'not_found', summary: '', supportingSourceIds: [] },
    { aspect: 'Deadlines', status: 'partially_covered', summary: '', supportingSourceIds: [] }
  ];
  const explanation = getCoverageExplanation(matrix);
  assert.equal(explanation.totalCount, 3);
  assert.equal(explanation.coveredCount, 1);
  assert.equal(explanation.notFoundCount, 1);
  assert.equal(explanation.partiallyCoveredCount, 1);
  assert.match(explanation.summaryText, /1 of 3 research criteria covered/);
});

test('computeChecklistProgress counts statuses correctly', () => {
  const tasks: VerificationTask[] = [
    { id: '1', projectId: 'p', title: 'T1', reason: 'R', suggestedOfficialSource: 'S', priority: 'high', status: 'completed' },
    { id: '2', projectId: 'p', title: 'T2', reason: 'R', suggestedOfficialSource: 'S', priority: 'high', status: 'in_progress' },
    { id: '3', projectId: 'p', title: 'T3', reason: 'R', suggestedOfficialSource: 'S', priority: 'high', status: 'pending' },
    { id: '4', projectId: 'p', title: 'T4', reason: 'R', suggestedOfficialSource: 'S', priority: 'high', status: 'pending' }
  ];

  const stats = computeChecklistProgress(tasks);
  assert.equal(stats.total, 4);
  assert.equal(stats.completed, 1);
  assert.equal(stats.inProgress, 1);
  assert.equal(stats.pending, 2);
  assert.equal(stats.percentage, 25);
});

test('classifySourceCategory distinguishes official vs secondary sources', () => {
  assert.equal(classifySourceCategory('https://scholarships.gov.in/portal'), 'official_government');
  assert.equal(classifySourceCategory('https://stanford.edu/admissions'), 'educational');
  assert.equal(classifySourceCategory('https://edufinder-blog.com/guide'), 'secondary_news');
  assert.equal(classifySourceCategory('', 'Department of Higher Education'), 'official_government');
});

test('detectDateFreshnessWarning flags outdated cycle dates', () => {
  const warning = detectDateFreshnessWarning('2023-11-15', 2026);
  assert.ok(warning);
  assert.equal(warning?.status, 'earlier_application_cycle');
  assert.equal(warning?.severity, 'high');

  const undatedWarning = detectDateFreshnessWarning('');
  assert.ok(undatedWarning);
  assert.equal(undatedWarning?.status, 'date_unknown');

  const fresh = detectDateFreshnessWarning('2026-08-01', 2026);
  assert.equal(fresh, null);
});

test('generateVersionChangesSummary detects diffs between analysis versions', () => {
  const v1: AnalysisVersion = {
    versionNumber: 1,
    analyzedAt: '2026-10-31T09:00:00Z',
    sourceCount: 2,
    gapsCount: 4,
    conflictsCount: 1,
    freshnessCount: 1,
    checklistCount: 4,
    coverageScore: 50,
    snapshot: { gaps: [], conflicts: [], claims: [], freshnessWarnings: [], coverageMatrix: [] }
  };

  const changes = generateVersionChangesSummary(v1, {
    sourceCount: 3,
    gapsCount: 2,
    conflictsCount: 2,
    coverageScore: 70
  });

  assert.ok(changes.some(c => c.includes('Added 1 new source')));
  assert.ok(changes.some(c => c.includes('2 previously identified gaps are now covered')));
  assert.ok(changes.some(c => c.includes('coverage score changed from 50% to 70%')));
});

test('calculateFindingsBreakdown accurately calculates total, open, and resolved findings', () => {
  const sample = {
    gaps: [
      { reviewStatus: 'needs_review' },
      { reviewStatus: 'confirmed' },
      { reviewStatus: 'needs_review' }
    ],
    conflicts: [
      { reviewStatus: 'needs_review', resolutionStatus: 'unresolved' },
      { reviewStatus: 'needs_review', resolutionStatus: 'unresolved' }
    ],
    freshnessWarnings: [
      { reviewStatus: 'confirmed' },
      { reviewStatus: 'needs_review' }
    ]
  };

  const breakdown = calculateFindingsBreakdown(sample);
  assert.equal(breakdown.total, 7);
  assert.equal(breakdown.openCount, 5);
  assert.equal(breakdown.resolvedCount, 2);
  assert.equal(breakdown.breakdownText, '7 Total Demo Findings — 5 Open, 2 Resolved/Other');
});

