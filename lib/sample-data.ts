import { ResearchProject } from '@/types/research';

// Deterministic base date (31 Oct 2026 UTC) to guarantee 100% hydration matching between SSR and client
const currentYear = 2026;
const pastCycleYear = currentYear - 3;
const lastYear = currentYear - 1;
const baseTimestamp = new Date(Date.UTC(2026, 9, 31, 7, 0, 0)).getTime();
const nowIso = new Date(baseTimestamp).toISOString();
const fortyFiveMinsAgoIso = new Date(baseTimestamp - 45 * 60 * 1000).toISOString();
const thirtyMinsAgoIso = new Date(baseTimestamp - 30 * 60 * 1000).toISOString();
const fiveMinsAgoIso = new Date(baseTimestamp - 5 * 60 * 1000).toISOString();

export const SAMPLE_SCHOLARSHIP_PROJECT: ResearchProject = {
  id: 'demo-scholarship-2026',
  title: 'Illustrative Scholarship Verification Scenario',
  researchQuestion: 'What should I verify before applying for this scholarship?',
  objective: 'Identify eligibility requirements, renewal conditions, required documents, current deadlines, and the official application process.',
  geographicScope: 'National / State Level',
  authorityOrOrganization: 'Department of Higher Education & Youth Development',
  keyAspectsToInvestigate: [
    'Eligibility Criteria',
    'Income Conditions',
    'Scholarship Amount',
    'Required Documents',
    'Application Deadline',
    'Renewal Conditions',
    'Application Procedure',
    'Official Application Link'
  ],
  status: 'completed',
  createdAt: fortyFiveMinsAgoIso,
  updatedAt: nowIso,
  isSampleDemo: true,
  isDemo: true,
  demoDisclaimer: 'ILLUSTRATIVE DEMO DATA — NOT LIVE OFFICIAL INFORMATION',
  executiveSummary: 'Reviewed 3 disparate sources (1 official portal notice, 1 secondary educational advisory guide, and 1 university financial aid handbook). While primary eligibility thresholds and funding amounts are well-documented, the analysis identified a critical conflict regarding income limits and document submission formats, a high-severity freshness warning on an expired prior-cycle date, and a complete absence of renewal terms across all reviewed texts. Actionable verification checklist prioritized below.',
  coverageSummaryScore: 65,
  sources: [
    {
      id: 'src-portal-01',
      projectId: 'demo-scholarship-2026',
      title: 'Official State Scholarship Portal - Gazette Notification No. 441',
      type: 'url',
      category: 'official_government',
      url: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
      domain: 'scholarships.gov.in',
      organization: 'Ministry of Education & Human Resources',
      publicationDate: `${pastCycleYear}-11-15`,
      updatedDate: `${pastCycleYear}-12-01`,
      accessedAt: fortyFiveMinsAgoIso,
      extractionStatus: 'success',
      extractionConfidence: 96,
      extractedText: `GOVERNMENT OF INDIA / STATE HIGHER EDUCATION COUNCIL
SCHEME CODE: NMS-${pastCycleYear}
OBJECTIVE: Financial assistance to meritorious students from economically weaker sections enrolled in undergraduate degrees.
BENEFIT: Direct Bank Transfer (DBT) of ₹50,000 per academic year for tuition and study allowance.
ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2) or equivalent board exam.
ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources.
MANDATORY DOCUMENTS: Competent authority signed Revenue Certificate issued within last 6 months, verified domicile certificate, bank passbook seeded with Aadhaar. Self-affidavits are strictly NOT accepted.
APPLICATION DEADLINE: Last date for receipt of online application was December 15, ${pastCycleYear}.`,
      notes: `Official notification, but published for an earlier application cycle (${pastCycleYear}).`
    },
    {
      id: 'src-guide-02',
      projectId: 'demo-scholarship-2026',
      title: `EduFinder National Merit Scholarship ${currentYear} Complete Guide`,
      type: 'url',
      category: 'secondary_news',
      url: `https://edufinder-portal.org/scholarships/merit-guide-${currentYear}`,
      domain: 'edufinder-portal.org',
      organization: 'EduFinder Educational Advisory',
      publicationDate: `${currentYear}-08-10`,
      updatedDate: `${currentYear}-09-02`,
      accessedAt: fortyFiveMinsAgoIso,
      extractionStatus: 'success',
      extractionConfidence: 88,
      extractedText: `EduFinder Career & Scholarship Desk — Updated for ${currentYear}–${currentYear + 1} Cycle.
The National Merit Scholarship provides ₹50,000 annually to selected college undergraduates.
ELIGIBILITY UPDATE: Candidates must score at least 75% marks in their board examinations.
FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum to account for cost-of-living indexation.
DOCUMENTATION: You may upload a notarized income declaration if the official Revenue Inspector certificate is delayed during admission season.
DEADLINE: Online portal is reported open until November 30, ${currentYear}. Students should register via state NSP portal.`,
      notes: 'Secondary aggregator claims relaxed income ceiling and affidavit allowance, but cites no official gazette.'
    },
    {
      id: 'src-univ-03',
      projectId: 'demo-scholarship-2026',
      title: 'City University Student Financial Aid Bulletin & Application Steps',
      type: 'document',
      category: 'educational',
      url: 'https://cityuniv.edu/financial-aid/bulletin-sec3.pdf',
      domain: 'cityuniv.edu',
      organization: 'City University Student Welfare Cell',
      publicationDate: `${lastYear}-07-20`,
      accessedAt: fortyFiveMinsAgoIso,
      extractionStatus: 'success',
      extractionConfidence: 91,
      pageCount: 4,
      extractedText: `SECTION 3: EXTERNAL & GOVERNMENT SCHOLARSHIPS
All matriculated first-year undergraduates eligible for the National Merit Scholarship must complete college institutional endorsement before submitting online.
Step 1: Download form from National Scholarship Portal.
Step 2: Submit physical dossier with attested marks cards to Room 104 Dean of Students.
Step 3: Dean office issues institutional verification code within 5 business days.
Note: Students who fail to obtain college seal before state portal closure cannot be re-verified post-deadline.`,
      notes: 'Details the institutional counter-signing process, but omits renewal rules.'
    }
  ],
  claims: [
    {
      id: 'claim-01',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-portal-01',
      sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
      category: 'Scholarship Amount',
      claimText: 'Scholarship provides ₹50,000 per academic year disbursed through Direct Bank Transfer (DBT).',
      supportingPassage: 'BENEFIT: Direct Bank Transfer (DBT) of ₹50,000 per academic year for tuition and study allowance.',
      confidence: 96,
      isVerifiedByUser: true
    },
    {
      id: 'claim-02',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-portal-01',
      sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
      category: 'Income Conditions',
      claimText: 'Family income ceiling is ₹2,50,000 per annum and self-affidavits are strictly forbidden.',
      supportingPassage: 'ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources... Self-affidavits are strictly NOT accepted.',
      confidence: 98
    },
    {
      id: 'claim-03',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-guide-02',
      sourceTitle: `EduFinder National Merit Scholarship ${currentYear} Complete Guide`,
      sourceUrl: `https://edufinder-portal.org/scholarships/merit-guide-${currentYear}`,
      category: 'Income Conditions',
      claimText: 'Income ceiling is reported as ₹3,50,000 with temporary notarized income declaration permitted.',
      supportingPassage: 'FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum... You may upload a notarized income declaration if official Revenue certificate is delayed.',
      confidence: 84
    },
    {
      id: 'claim-04',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-univ-03',
      sourceTitle: 'City University Student Financial Aid Bulletin & Application Steps',
      sourceUrl: 'https://cityuniv.edu/financial-aid/bulletin-sec3.pdf',
      category: 'Application Procedure',
      claimText: 'College institutional endorsement and Dean seal are mandatory before state online portal closure.',
      supportingPassage: 'Step 2: Submit physical dossier with attested marks cards to Room 104 Dean of Students... Dean office issues institutional verification code within 5 business days.',
      pageNumber: 3,
      confidence: 92
    },
    {
      id: 'claim-05',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-portal-01',
      sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
      category: 'Eligibility Criteria',
      claimText: 'Applicant must fall within the 80th percentile of their 10+2 higher secondary examination.',
      supportingPassage: 'ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2) or equivalent board exam.',
      confidence: 96
    }
  ],
  gaps: [
    {
      id: 'gap-01',
      projectId: 'demo-scholarship-2026',
      title: 'Renewal Terms & Subsequent Year Continuation Conditions',
      gapType: 'missing_information',
      description: 'Potential Information Gap — Not found in the sources reviewed.',
      whyItMatters: 'Renewal requirements remain unstated in the reviewed documentation. Verification Question: What are the official renewal requirements?',
      whatWasFound: 'Only first-year entry eligibility (80th percentile / 75%) and initial award amount (₹50,000) are stated across all 3 documents.',
      whatWasNotFound: 'Criteria for renewing in Year 2, minimum college GPA required, maximum allowable backlog courses, or annual re-application window.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02', 'src-univ-03'],
      suggestedSourceToVerify: 'State Department Scheme Guidelines document (Scheme Section: Maintenance & Renewal Criteria).',
      recommendedAction: 'Directly contact the University Financial Aid Officer or inspect the official Ministry scheme manual to verify: What are the official renewal requirements?',
      priority: 'high',
      aiConfidence: 94,
      status: 'needs_verification',
      reviewStatus: 'needs_review'
    },
    {
      id: 'gap-02',
      projectId: 'demo-scholarship-2026',
      title: 'Official Document Checklist for Income & Revenue Certification',
      gapType: 'missing_document_requirements',
      description: 'Potential Information Gap — Not found in the sources reviewed.',
      whyItMatters: 'Requirements regarding the designated issuing authority and valid certificate format are not confirmed in official circulars. Verification Questions: Which authority is permitted to issue the required income certificate? What is the latest official document checklist?',
      whatWasFound: 'General mention of "Revenue Certificate" in Source 1 and "notarized declaration" in Source 2.',
      whatWasNotFound: 'Specific designation of issuing officer (e.g. Tehsildar vs Sub-Divisional Magistrate), valid issuance financial year, or digital QR certificate requirements.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02'],
      suggestedSourceToVerify: 'Department of Revenue & Land Records guidelines on valid income certificate formats.',
      recommendedAction: 'Consult the competent revenue authority to answer: Which authority is permitted to issue the required income certificate, and what is the latest official document checklist?',
      priority: 'high',
      aiConfidence: 89,
      status: 'needs_verification',
      reviewStatus: 'confirmed',
      reviewedAt: thirtyMinsAgoIso,
      userReviewNotes: 'Confirmed with student council that Tehsildar seal is required.'
    },
    {
      id: 'gap-03',
      projectId: 'demo-scholarship-2026',
      title: 'Current Application Deadline for Active Cycle',
      gapType: 'missing_dates_deadlines',
      description: 'Potential Information Gap — Not found in the sources reviewed.',
      whyItMatters: 'Official circulars have not established the active cycle deadline or whether deadline extensions or appeals are permitted. Verification Questions: What is the current application deadline? Are late submissions or deadline extensions permitted?',
      whatWasFound: 'Source 1 lists an expired prior-cycle date. Source 2 mentions November 30 without official gazette citation.',
      whatWasNotFound: 'Official Gazette or Department press release establishing the verified last date and extension policy for the active cycle.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02'],
      suggestedSourceToVerify: 'Official National Scholarship Portal (NSP) active announcement banner.',
      recommendedAction: 'Check the live portal landing page announcements section to answer: What is the current application deadline, and are late submissions or deadline extensions permitted?',
      priority: 'high',
      aiConfidence: 96,
      status: 'investigating',
      reviewStatus: 'needs_review'
    }
  ],
  conflicts: [
    {
      id: 'conflict-01',
      projectId: 'demo-scholarship-2026',
      aspect: 'Annual Family Income Limit & Affidavit Policy',
      conflictType: 'different_eligibility',
      label: 'Possible Conflict',
      explanation: 'Official Source A specifies a strict ₹2,50,000 ceiling and explicitly states self-affidavits are not accepted. Secondary Source B claims the ceiling has been revised to ₹3,50,000 and suggests notarized declarations. Verification is required to determine which authority is permitted to issue the required income certificate.',
      aiConfidence: 92,
      sourceA: {
        sourceId: 'src-portal-01',
        sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
        url: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
        date: `${pastCycleYear}-11-15`,
        claimText: 'Income limit ≤ ₹2,50,000 per annum; self-affidavits not accepted.',
        supportingPassage: 'ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources... Self-affidavits are strictly NOT accepted.',
        isOfficial: true
      },
      sourceB: {
        sourceId: 'src-guide-02',
        sourceTitle: `EduFinder National Merit Scholarship ${currentYear} Complete Guide`,
        url: `https://edufinder-portal.org/scholarships/merit-guide-${currentYear}`,
        date: `${currentYear}-08-10`,
        claimText: 'Income ceiling reported as revised to ₹3,50,000; notarized declarations mentioned.',
        supportingPassage: 'FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum... You may upload a notarized income declaration if the official Revenue Inspector certificate is delayed.',
        isOfficial: false
      },
      recommendedAction: 'Verify against the active Ministry Gazette or official NSP portal notice. Verification Question: Which authority is permitted to issue the required income certificate?',
      resolutionStatus: 'unresolved',
      reviewStatus: 'needs_review'
    },
    {
      id: 'conflict-02',
      projectId: 'demo-scholarship-2026',
      aspect: 'Academic Cutoff: Percentile vs Absolute Percentage',
      conflictType: 'different_eligibility',
      label: 'Different Scope or Conditions',
      explanation: 'Source A requires candidates to be in the "top 80th percentile" of their board, which is a relative cohort ranking that changes annually. Source B states a fixed "75% aggregate marks". These are mathematically distinct standards.',
      aiConfidence: 86,
      sourceA: {
        sourceId: 'src-portal-01',
        sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
        url: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
        date: `${pastCycleYear}-11-15`,
        claimText: 'Minimum 80th percentile in Higher Secondary Examination (10+2).',
        supportingPassage: 'ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2) or equivalent board exam.',
        isOfficial: true
      },
      sourceB: {
        sourceId: 'src-guide-02',
        sourceTitle: `EduFinder National Merit Scholarship ${currentYear} Complete Guide`,
        url: `https://edufinder-portal.org/scholarships/merit-guide-${currentYear}`,
        date: `${currentYear}-08-10`,
        claimText: 'Candidates must score at least 75% marks in board examinations.',
        supportingPassage: 'ELIGIBILITY UPDATE: Candidates must score at least 75% marks in their board examinations.',
        isOfficial: false
      },
      recommendedAction: 'Verify whether the state board published a percentile cut-off chart for your passing year, rather than assuming 75% raw score qualifies.',
      resolutionStatus: 'unresolved',
      reviewStatus: 'needs_review'
    }
  ],
  freshnessWarnings: [
    {
      id: 'fresh-01',
      sourceId: 'src-portal-01',
      sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-prior.pdf',
      availableDate: `${pastCycleYear}-11-15`,
      status: 'earlier_application_cycle',
      warningReason: `Document refers to an earlier academic cycle (${pastCycleYear}) and lists an expired deadline. Current operational year is ${currentYear}.`,
      affectedInformation: 'Deadlines, potentially outdated income slabs, and submission dates.',
      suggestedAction: 'Locate the latest Gazette Notification or press circular on the official government portal. Verification Question: What is the current application deadline?',
      severity: 'high',
      reviewStatus: 'confirmed',
      reviewedAt: thirtyMinsAgoIso
    },
    {
      id: 'fresh-02',
      sourceId: 'src-univ-03',
      sourceTitle: 'City University Student Financial Aid Bulletin & Application Steps',
      sourceUrl: 'https://cityuniv.edu/financial-aid/bulletin-sec3.pdf',
      availableDate: `${lastYear}-07-20`,
      status: 'currentness_not_established',
      warningReason: 'Document was compiled over a year ago; university verification room assignments and digital countersign workflows may have shifted.',
      affectedInformation: 'Physical dossier verification room number and offline turn-around times.',
      suggestedAction: 'Confirm with University Dean of Student Welfare office before visiting in person.',
      severity: 'low',
      reviewStatus: 'needs_review'
    }
  ],
  unansweredQuestions: [
    {
      id: 'q-01',
      question: 'Which authority is permitted to issue the required income certificate?',
      whyItMatters: 'Reviewed sources state conflicting authority requirements (e.g. Tehsildar vs Sub-Divisional Magistrate vs notarized affidavit).',
      relatedInformationFound: 'General mention of Revenue Certificate in Gazette notice and notarized declaration in advisory guide.',
      relatedSourceTitles: ['Official State Scholarship Portal - Gazette Notification No. 441', `EduFinder Complete Guide`],
      suggestedVerificationStep: 'Verify with the competent state revenue department or scholarship gazette.',
      priority: 'high'
    },
    {
      id: 'q-02',
      question: 'What is the latest official document checklist?',
      whyItMatters: 'Reviewed sources provide partial and conflicting documentation requirements.',
      relatedInformationFound: 'Incomplete references to marks cards, bank passbooks, and affidavits.',
      relatedSourceTitles: ['Official State Scholarship Portal', `EduFinder Guide`, 'City University Bulletin'],
      suggestedVerificationStep: 'Download the active cycle document checklist from the official scholarship portal.',
      priority: 'high'
    },
    {
      id: 'q-03',
      question: 'What is the current application deadline?',
      whyItMatters: 'The current active deadline is unconfirmed in reviewed sources (Source 1 contains an expired prior-cycle date, Source 2 has an unverified date).',
      relatedInformationFound: `Expired deadline in Source 1; unconfirmed Nov 30 claim in Source 2.`,
      relatedSourceTitles: ['Official State Scholarship Portal (Prior Cycle)', `EduFinder Guide`],
      suggestedVerificationStep: 'Check the official portal announcements banner for current cycle dates.',
      priority: 'high'
    },
    {
      id: 'q-04',
      question: 'Are late submissions or deadline extensions permitted?',
      whyItMatters: 'Rules regarding submission extensions, appeals, or technical grace periods were not established in reviewed sources.',
      relatedInformationFound: 'University handbook warns against missing institutional deadlines; official portal gives no extension terms.',
      relatedSourceTitles: ['City University Student Financial Aid Bulletin', 'Official State Scholarship Portal'],
      suggestedVerificationStep: 'Consult the official scheme operating guidelines for extension and appeal policies.',
      priority: 'high'
    },
    {
      id: 'q-05',
      question: 'What are the official renewal requirements?',
      whyItMatters: 'Zero guidelines discovered regarding subsequent academic years, minimum CGPA thresholds, or re-application procedures.',
      relatedInformationFound: 'No renewal guidelines discovered in any reviewed document.',
      relatedSourceTitles: ['All 3 Reviewed Sources'],
      suggestedVerificationStep: 'Request the multi-year continuation guidelines from the university financial aid office.',
      priority: 'high'
    }
  ],
  checklist: [
    {
      id: 'task-01',
      projectId: 'demo-scholarship-2026',
      title: 'Verify active application deadline on official NSP portal',
      reason: 'Current deadline is unestablished; Source 1 shows expired prior-cycle date and Source 2 has unverified date. Verification Question: What is the current application deadline?',
      relatedFinding: 'Freshness Warning: Expired prior cycle date',
      suggestedOfficialSource: 'National Scholarship Portal (scholarships.gov.in) Notifications tab',
      priority: 'high',
      status: 'pending',
      userNotes: 'Scheduled to check with department office on Monday morning.'
    },
    {
      id: 'task-02',
      projectId: 'demo-scholarship-2026',
      title: 'Confirm whether income ceiling is ₹2,50,000 or ₹3,50,000',
      reason: 'Conflicting claims between official gazette and advisory guide require clarification against active gazette.',
      relatedFinding: 'Conflict: Income ceiling discrepancy between Source A & Source B',
      suggestedOfficialSource: 'Latest State Department Gazette or e-District Portal',
      priority: 'high',
      status: 'in_progress',
      userNotes: 'Applied for revenue certificate stating income under ₹2.5L to be safe.'
    },
    {
      id: 'task-03',
      projectId: 'demo-scholarship-2026',
      title: 'Confirm issuing authority for required income certificate',
      reason: 'Issuing authority requirements remain unconfirmed. Verification Question: Which authority is permitted to issue the required income certificate?',
      relatedFinding: 'Information Gap: Official Document Checklist',
      suggestedOfficialSource: 'Local Tehsildar / Taluk Office or e-District Seva Kendra',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'task-04',
      projectId: 'demo-scholarship-2026',
      title: 'Obtain the latest official document checklist from department',
      reason: 'Document submission requirements differ across sources. Verification Question: What is the latest official document checklist?',
      relatedFinding: 'Claim 4: Dean office endorsement window',
      suggestedOfficialSource: 'City University Student Welfare Cell (Room 104) / Official Gazette',
      priority: 'medium',
      status: 'completed',
      completedAt: fiveMinsAgoIso,
      userNotes: 'Met officer Mrs. Sharma; confirmed Room 104 is operational and takes 3-4 days.'
    },
    {
      id: 'task-05',
      projectId: 'demo-scholarship-2026',
      title: 'Clarify multi-year renewal requirements with financial aid officer',
      reason: 'Renewal rules are completely missing from all reviewed sources. Verification Question: What are the official renewal requirements?',
      relatedFinding: 'Potential Information Gap: Renewal Terms',
      suggestedOfficialSource: 'University Financial Aid Officer / State Scheme Guidelines Clause',
      priority: 'medium',
      status: 'pending'
    }
  ],

  coverageMatrix: [
    {
      aspect: 'Eligibility Criteria',
      status: 'conflicting',
      summary: 'Disagreement on academic cutoff definition (80th percentile vs 75% aggregate).',
      supportingSourceIds: ['src-portal-01', 'src-guide-02'],
      relatedConflictIds: ['conflict-02']
    },
    {
      aspect: 'Income Conditions',
      status: 'conflicting',
      summary: 'Conflicting income limits (₹2.5L ceiling vs ₹3.5L ceiling) and affidavit admissibility.',
      supportingSourceIds: ['src-portal-01', 'src-guide-02'],
      relatedConflictIds: ['conflict-01']
    },
    {
      aspect: 'Scholarship Amount',
      status: 'covered',
      summary: 'Consistent across sources: ₹50,000 per academic year disbursed through DBT.',
      supportingSourceIds: ['src-portal-01', 'src-guide-02']
    },
    {
      aspect: 'Required Documents',
      status: 'conflicting',
      summary: 'Official gazette strictly mandates Revenue Certificate; guide claims affidavit allowed.',
      supportingSourceIds: ['src-portal-01', 'src-guide-02'],
      relatedConflictIds: ['conflict-01'],
      relatedGapIds: ['gap-02']
    },
    {
      aspect: 'Application Deadline',
      status: 'requires_verification',
      summary: 'Source 1 contains an expired 2023 date; Source 2 gives an unverified Nov 30, 2026 date without official circular citation.',
      supportingSourceIds: ['src-portal-01', 'src-guide-02'],
      relatedGapIds: ['gap-03']
    },
    {
      aspect: 'Renewal Conditions',
      status: 'not_found',
      summary: 'Zero data found across all 3 reviewed sources regarding sophomore year eligibility or grade threshold.',
      supportingSourceIds: [],
      relatedGapIds: ['gap-01']
    },
    {
      aspect: 'Application Procedure',
      status: 'partially_covered',
      summary: 'University endorsement steps are explained, but state portal online submission workflow lacks official steps.',
      supportingSourceIds: ['src-univ-03']
    },
    {
      aspect: 'Official Application Link',
      status: 'partially_covered',
      summary: 'NSP portal URL referenced in guide; direct active 2026 scheme deep link not verified.',
      supportingSourceIds: ['src-portal-01', 'src-guide-02']
    }
  ],
  analysisVersions: [
    {
      versionNumber: 1,
      analyzedAt: '2026-10-31T09:30:00.000Z',
      sourceCount: 2,
      gapsCount: 4,
      conflictsCount: 1,
      freshnessCount: 1,
      checklistCount: 4,
      coverageScore: 50,
      changesSinceLastVersion: ['Initial baseline analysis from Source 1 and Source 2.'],
      snapshot: {
        gaps: [],
        conflicts: [],
        claims: [],
        freshnessWarnings: [],
        coverageMatrix: []
      }
    },
    {
      versionNumber: 2,
      analyzedAt: '2026-10-31T10:15:00.000Z',
      sourceCount: 3,
      gapsCount: 3,
      conflictsCount: 2,
      freshnessCount: 2,
      checklistCount: 5,
      coverageScore: 65,
      changesSinceLastVersion: [
        'Added Source 3: City University Financial Aid Bulletin.',
        'Covered Application Procedure partially with institutional endorsement steps.',
        'Identified second conflict regarding Percentile vs Raw Percentage standards.',
        'Added verification task for Dean Room 104 verification workflow.'
      ],
      snapshot: {
        gaps: [],
        conflicts: [],
        claims: [],
        freshnessWarnings: [],
        coverageMatrix: []
      }
    }
  ]
};

export const PRESET_TEMPLATES = [
  {
    id: 'scholarship-template',
    title: 'Scholarship Research',
    question: 'What should I verify before applying for this scholarship?',
    objective: 'Identify eligibility requirements, renewal conditions, required documents, current deadlines, and the official application process.',
    category: 'Scholarship & Financial Aid',
    geographicScope: 'National / State Level',
    authorityOrOrganization: 'Ministry of Higher Education / Foundation',
    keyAspects: [
      'Eligibility',
      'Income Conditions',
      'Scholarship Amount',
      'Required Documents',
      'Application Deadline',
      'Renewal Conditions',
      'Application Procedure',
      'Official Application Link'
    ]
  },
  {
    id: 'college-admission-template',
    title: 'College Admission Research',
    question: 'Are admission dates, quota criteria, certificates, and fees fully verified for this institution?',
    objective: 'Confirm academic cutoffs, counseling schedules, domicile reservation rules, and mandatory certificates for official admission.',
    category: 'Admissions & University',
    geographicScope: 'State / University System',
    authorityOrOrganization: 'Centralized Admission Authority / Registrar',
    keyAspects: [
      'Eligibility',
      'Academic Requirements',
      'Admission Dates',
      'Required Certificates',
      'Fees',
      'Reservation Conditions',
      'Counselling Procedure',
      'Official Admission Notification'
    ]
  },
  {
    id: 'job-application-template',
    title: 'Job Application Research',
    question: 'Are all eligibility rules, bond terms, mandatory skills, and application deadlines confirmed?',
    objective: 'Cross-examine job vacancy notice against career board descriptions to identify hidden clauses, probation obligations, and salary breakdown.',
    category: 'Career & Employment',
    geographicScope: 'Global / National',
    authorityOrOrganization: 'Hiring Committee / Enterprise Portal',
    keyAspects: [
      'Qualification',
      'Required Skills',
      'Experience',
      'Application Deadline',
      'Salary or Stipend',
      'Job Location',
      'Application Method',
      'Official Job Posting'
    ]
  },
  {
    id: 'government-scheme-template',
    title: 'Government Scheme Research',
    question: 'What are the exact statutory eligibility terms, subsidy tranches, and audit rules for this scheme?',
    objective: 'Examine official gazetted rules against promotional summaries to detect missing eligibility conditions, disbursement milestones, and portal links.',
    category: 'Government Schemes & Subsidies',
    geographicScope: 'Federal / Provincial',
    authorityOrOrganization: 'Department of Public Welfare / Industry Ministry',
    keyAspects: [
      'Eligibility',
      'Benefits',
      'Required Documents',
      'Application Process',
      'Important Dates',
      'Implementing Department',
      'Official Application Portal',
      'Renewal or Continuation Rules'
    ]
  }
];
