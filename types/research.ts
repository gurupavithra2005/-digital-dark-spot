export type SourceType = 'url' | 'document' | 'paste' | 'search';

export type SourceCategory = 
  | 'official_government'
  | 'institutional'
  | 'educational'
  | 'secondary_news'
  | 'user_provided'
  | 'unknown';

export interface Source {
  id: string;
  projectId: string;
  title: string;
  type: SourceType;
  category: SourceCategory;
  url?: string;
  domain?: string;
  organization?: string;
  publicationDate?: string;
  updatedDate?: string;
  accessedAt: string;
  extractedText: string;
  extractionStatus: 'success' | 'partial' | 'failed' | 'pending';
  extractionConfidence: number; // 0 to 100%
  pageCount?: number;
  isExcluded?: boolean;
  isDemo?: boolean;
  notes?: string;
}

export interface ExtractedClaim {
  id: string;
  projectId: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;
  category: string; // e.g. "Eligibility", "Financial", "Deadlines", "Documents", "Procedure"
  claimText: string;
  supportingPassage: string;
  pageNumber?: number;
  sectionName?: string;
  confidence: number; // 0 to 100%
  isVerifiedByUser?: boolean;
}

export type GapPriority = 'high' | 'medium' | 'low';
export type GapStatus = 'needs_verification' | 'investigating' | 'verified' | 'not_applicable';

export type FindingReviewStatus = 'needs_review' | 'confirmed' | 'dismissed' | 'investigating' | 'resolved';

export interface InformationGap {
  id: string;
  projectId: string;
  title: string;
  gapType: 
    | 'missing_information'
    | 'incomplete_information'
    | 'unanswered_question'
    | 'missing_official_confirmation'
    | 'missing_dates_deadlines'
    | 'missing_eligibility_details'
    | 'missing_document_requirements'
    | 'missing_procedure_steps';
  description: string;
  whyItMatters: string;
  whatWasFound: string;
  whatWasNotFound: string;
  relatedSourceIds: string[];
  suggestedSourceToVerify: string;
  recommendedAction: string;
  priority: GapPriority; // Importance to decision
  aiConfidence?: number; // 0 to 100% separated from Priority
  status: GapStatus;
  reviewStatus?: FindingReviewStatus; // AI Suggested vs Confirmed by user vs Dismissed
  reviewedAt?: string;
  userReviewNotes?: string;
  dismissReason?: string;
  userNotes?: string;
}

export type ConflictType = 
  | 'different_deadlines'
  | 'different_eligibility'
  | 'different_documents'
  | 'different_amounts'
  | 'different_dates'
  | 'different_procedures'
  | 'different_numerical_values'
  | 'different_policy_conditions';

export type ConflictLabel = 
  | 'Possible Conflict'
  | 'Different Time Period'
  | 'Different Scope or Conditions'
  | 'Requires Official Confirmation';

export interface ConflictingClaim {
  id: string;
  projectId: string;
  aspect: string;
  conflictType: ConflictType;
  label: ConflictLabel;
  explanation: string;
  aiConfidence?: number; // 0 to 100%
  sourceA: {
    sourceId: string;
    sourceTitle: string;
    url?: string;
    date?: string;
    claimText: string;
    supportingPassage: string;
    isOfficial?: boolean;
  };
  sourceB: {
    sourceId: string;
    sourceTitle: string;
    url?: string;
    date?: string;
    claimText: string;
    supportingPassage: string;
    isOfficial?: boolean;
  };
  recommendedAction: string;
  resolutionStatus: 'unresolved' | 'investigating' | 'resolved';
  reviewStatus?: FindingReviewStatus;
  reviewedAt?: string;
  userReviewNotes?: string;
  dismissReason?: string;
  userNotes?: string;
}

export type FreshnessStatus = 
  | 'potentially_outdated'
  | 'date_unknown'
  | 'earlier_application_cycle'
  | 'currentness_not_established'
  | 'no_freshness_warning';

export interface OutdatedSourceWarning {
  id: string;
  sourceId: string;
  sourceTitle: string;
  sourceUrl?: string;
  availableDate?: string;
  status: FreshnessStatus;
  warningReason: string;
  affectedInformation: string;
  suggestedAction: string;
  severity: 'high' | 'medium' | 'low';
  reviewStatus?: FindingReviewStatus;
  reviewedAt?: string;
}

export interface UnansweredQuestion {
  id: string;
  question: string;
  whyItMatters: string;
  relatedInformationFound: string;
  relatedSourceTitles: string[];
  suggestedVerificationStep: string;
  priority: 'high' | 'medium' | 'low';
}

export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface VerificationTask {
  id: string;
  projectId: string;
  title: string;
  reason: string;
  relatedFinding?: string;
  suggestedOfficialSource: string;
  priority: TaskPriority;
  status: TaskStatus;
  userNotes?: string;
  completedAt?: string;
  isUserCreated?: boolean;
}

export type CoverageStatus = 
  | 'covered'
  | 'partially_covered'
  | 'not_found'
  | 'conflicting'
  | 'requires_verification';

export interface ResearchAspectCoverage {
  aspect: string;
  status: CoverageStatus;
  summary: string;
  supportingSourceIds: string[];
  relatedGapIds?: string[];
  relatedConflictIds?: string[];
}

export interface AnalysisVersion {
  versionNumber: number;
  analyzedAt: string;
  sourceCount: number;
  gapsCount: number;
  conflictsCount: number;
  freshnessCount: number;
  checklistCount: number;
  coverageScore: number;
  changesSinceLastVersion?: string[];
  snapshot: {
    gaps: InformationGap[];
    conflicts: ConflictingClaim[];
    claims: ExtractedClaim[];
    freshnessWarnings: OutdatedSourceWarning[];
    coverageMatrix: ResearchAspectCoverage[];
  };
}

export interface ResearchProject {
  id: string;
  title: string;
  researchQuestion: string;
  objective: string;
  geographicScope?: string;
  authorityOrOrganization?: string;
  keyAspectsToInvestigate: string[];
  status: 'draft' | 'analyzing' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  isSampleDemo?: boolean;
  isDemo?: boolean;
  demoDisclaimer?: string;
  executiveSummary?: string;
  sources: Source[];
  claims: ExtractedClaim[];
  gaps: InformationGap[];
  conflicts: ConflictingClaim[];
  freshnessWarnings: OutdatedSourceWarning[];
  unansweredQuestions: UnansweredQuestion[];
  checklist: VerificationTask[];
  coverageMatrix: ResearchAspectCoverage[];
  coverageSummaryScore?: number; // 0 to 100
  analysisVersions?: AnalysisVersion[];
}

export interface ActivityItem {
  id: string;
  type: 'project_created' | 'source_added' | 'analysis_completed' | 'finding_confirmed' | 'task_completed';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
}

export interface ResearchChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  referencedSources?: { id: string; title: string; passage?: string }[];
}
