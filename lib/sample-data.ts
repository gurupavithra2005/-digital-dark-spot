import { ResearchProject, AnalysisVersion } from '@/types/research';

export const SAMPLE_SCHOLARSHIP_PROJECT: ResearchProject = {
  id: 'demo-scholarship-2026',
  title: 'National Merit Scholarship: Eligibility & Verification Review',
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
  createdAt: '2026-10-31T09:30:00.000Z',
  updatedAt: '2026-10-31T10:15:00.000Z',
  isSampleDemo: true,
  executiveSummary: 'Reviewed 3 disparate sources (1 official portal notice, 1 secondary educational advisory guide, and 1 university financial aid handbook). While primary eligibility thresholds and funding amounts are well-documented, the analysis identified a critical conflict regarding income limits and document submission formats, a high-severity freshness warning on an expired 2023–2024 cycle date, and a complete absence of renewal terms across all reviewed texts. Actionable verification checklist prioritized below.',
  coverageSummaryScore: 65,
  sources: [
    {
      id: 'src-portal-01',
      projectId: 'demo-scholarship-2026',
      title: 'Official State Scholarship Portal - Gazette Notification No. 441',
      type: 'url',
      category: 'official_government',
      url: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
      domain: 'scholarships.gov.in',
      organization: 'Ministry of Education & Human Resources',
      publicationDate: '2023-11-15',
      updatedDate: '2023-12-01',
      accessedAt: '2026-10-31T09:32:00.000Z',
      extractionStatus: 'success',
      extractionConfidence: 96,
      extractedText: `GOVERNMENT OF INDIA / STATE HIGHER EDUCATION COUNCIL
SCHEME CODE: NMS-2024
OBJECTIVE: Financial assistance to meritorious students from economically weaker sections enrolled in undergraduate degrees.
BENEFIT: Direct Bank Transfer (DBT) of ₹50,000 per academic year for tuition and study allowance.
ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2) or equivalent board exam.
ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources.
MANDATORY DOCUMENTS: Competent authority signed Revenue Certificate issued within last 6 months, verified domicile certificate, bank passbook seeded with Aadhaar. Self-affidavits are strictly NOT accepted.
APPLICATION DEADLINE: Last date for receipt of online application was December 15, 2023.`,
      notes: 'Official notification, but published in late 2023 for the 2023-2024 cycle.'
    },
    {
      id: 'src-guide-02',
      projectId: 'demo-scholarship-2026',
      title: 'EduFinder National Merit Scholarship 2026 Complete Guide',
      type: 'url',
      category: 'secondary_news',
      url: 'https://edufinder-portal.org/scholarships/merit-guide-2026',
      domain: 'edufinder-portal.org',
      organization: 'EduFinder Educational Advisory',
      publicationDate: '2026-08-10',
      updatedDate: '2026-09-02',
      accessedAt: '2026-10-31T09:33:00.000Z',
      extractionStatus: 'success',
      extractionConfidence: 88,
      extractedText: `EduFinder Career & Scholarship Desk — Updated for 2026–2027 Cycle.
The National Merit Scholarship provides ₹50,000 annually to selected college undergraduates.
ELIGIBILITY UPDATE: Candidates must score at least 75% marks in their board examinations.
FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum to account for cost-of-living indexation.
DOCUMENTATION: You may upload a notarized income declaration if the official Revenue Inspector certificate is delayed during admission season.
DEADLINE: Online portal is reported open until November 30, 2026. Students should register via state NSP portal.`,
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
      publicationDate: '2025-07-20',
      accessedAt: '2026-10-31T09:35:00.000Z',
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
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
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
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
      category: 'Income Conditions',
      claimText: 'Family income ceiling is ₹2,50,000 per annum and self-affidavits are strictly forbidden.',
      supportingPassage: 'ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources... Self-affidavits are strictly NOT accepted.',
      confidence: 98
    },
    {
      id: 'claim-03',
      projectId: 'demo-scholarship-2026',
      sourceId: 'src-guide-02',
      sourceTitle: 'EduFinder National Merit Scholarship 2026 Complete Guide',
      sourceUrl: 'https://edufinder-portal.org/scholarships/merit-guide-2026',
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
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
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
      whyItMatters: 'If this scholarship is only funded for the freshman year or requires minimum GPA/attendance thresholds for renewal, students may face unexpected tuition shortfalls in years 2–4.',
      whatWasFound: 'Only first-year entry eligibility (80th percentile / 75%) and initial award amount (₹50,000) are stated across all 3 documents.',
      whatWasNotFound: 'Criteria for renewing in Year 2, minimum college GPA required, maximum allowable backlog courses, or annual re-application window.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02', 'src-univ-03'],
      suggestedSourceToVerify: 'State Department Scheme Guidelines document (Scheme Section: Maintenance & Renewal Criteria).',
      recommendedAction: 'Directly contact the University Financial Aid Officer or inspect the official Ministry scheme manual for clause titled "Continuation of Award".',
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
      whyItMatters: 'Incompatible or outdated income certificates issued by non-gazetted officers frequently cause automated rejections at the state treasury level.',
      whatWasFound: 'General mention of "Revenue Certificate" in Source 1 and "notarized declaration" in Source 2.',
      whatWasNotFound: 'Specific designation of issuing officer (e.g. Tehsildar vs Sub-Divisional Magistrate), valid issuance financial year, or digital QR certificate requirements.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02'],
      suggestedSourceToVerify: 'Department of Revenue & Land Records guidelines on valid income certificate formats.',
      recommendedAction: 'Verify whether a digital e-District certificate is mandatory or if physical Revenue Inspector seal is acceptable.',
      priority: 'high',
      aiConfidence: 89,
      status: 'needs_verification',
      reviewStatus: 'confirmed',
      reviewedAt: '2026-10-31T09:40:00.000Z',
      userReviewNotes: 'Confirmed with student council that Tehsildar seal is required.'
    },
    {
      id: 'gap-03',
      projectId: 'demo-scholarship-2026',
      title: 'Current Application Deadline for Active 2026 Cycle',
      gapType: 'missing_dates_deadlines',
      description: 'Potential Information Gap — Not found in the sources reviewed.',
      whyItMatters: 'Relying on expired or unofficial blog dates risks missing the registration cutoff, with no late-submission appeals accepted.',
      whatWasFound: 'Source 1 lists an expired 2023 date (Dec 15, 2023). Source 2 mentions November 30, 2026 without official circular citation.',
      whatWasNotFound: 'Official Gazette or Department press release establishing the verified last date for the 2026–2027 cycle.',
      relatedSourceIds: ['src-portal-01', 'src-guide-02'],
      suggestedSourceToVerify: 'Official National Scholarship Portal (NSP) active announcement banner.',
      recommendedAction: 'Check the live portal landing page announcements section for Gazette confirmation.',
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
      explanation: 'Official Source A specifies a strict ₹2,50,000 ceiling and explicitly forbids self-affidavits. Secondary Source B claims the ceiling has been raised to ₹3,50,000 and allows temporary notarized affidavits. If Source B is unverified or refers to a different scheme, relying on it could lead to disqualification.',
      aiConfidence: 92,
      sourceA: {
        sourceId: 'src-portal-01',
        sourceTitle: 'Official State Scholarship Portal - Gazette Notification No. 441',
        url: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
        date: '2023-11-15',
        claimText: 'Income limit ≤ ₹2,50,000 per annum; self-affidavits strictly forbidden.',
        supportingPassage: 'ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum from all sources... Self-affidavits are strictly NOT accepted.',
        isOfficial: true
      },
      sourceB: {
        sourceId: 'src-guide-02',
        sourceTitle: 'EduFinder National Merit Scholarship 2026 Complete Guide',
        url: 'https://edufinder-portal.org/scholarships/merit-guide-2026',
        date: '2026-08-10',
        claimText: 'Income ceiling revised to ₹3,50,000; notarized declarations accepted.',
        supportingPassage: 'FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum... You may upload a notarized income declaration if the official Revenue Inspector certificate is delayed.',
        isOfficial: false
      },
      recommendedAction: 'Do NOT rely on the ₹3,50,000 figure until confirmed against the active 2026 Ministry Gazette or official NSP portal notice. Obtain a formal Revenue Certificate under ₹2,50,000 to remain safely compliant.',
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
        url: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
        date: '2023-11-15',
        claimText: 'Minimum 80th percentile in Higher Secondary Examination (10+2).',
        supportingPassage: 'ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2) or equivalent board exam.',
        isOfficial: true
      },
      sourceB: {
        sourceId: 'src-guide-02',
        sourceTitle: 'EduFinder National Merit Scholarship 2026 Complete Guide',
        url: 'https://edufinder-portal.org/scholarships/merit-guide-2026',
        date: '2026-08-10',
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
      sourceUrl: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
      availableDate: '2023-11-15',
      status: 'earlier_application_cycle',
      warningReason: 'Document refers to academic cycle 2023–2024 and lists an expired deadline of December 15, 2023. Current operational year is 2026.',
      affectedInformation: 'Deadlines, potentially outdated income slabs, and submission dates.',
      suggestedAction: 'Locate the latest 2026–2027 Gazette Notification or press circular on the official government portal.',
      severity: 'high',
      reviewStatus: 'confirmed',
      reviewedAt: '2026-10-31T09:42:00.000Z'
    },
    {
      id: 'fresh-02',
      sourceId: 'src-univ-03',
      sourceTitle: 'City University Student Financial Aid Bulletin & Application Steps',
      sourceUrl: 'https://cityuniv.edu/financial-aid/bulletin-sec3.pdf',
      availableDate: '2025-07-20',
      status: 'currentness_not_established',
      warningReason: 'Document was compiled 15 months ago; university verification room assignments and digital countersign workflows may have shifted.',
      affectedInformation: 'Physical dossier verification room number and offline turn-around times.',
      suggestedAction: 'Confirm with University Dean of Student Welfare office before visiting in person.',
      severity: 'low',
      reviewStatus: 'needs_review'
    }
  ],
  unansweredQuestions: [
    {
      id: 'q-01',
      question: 'What is the official application deadline for the 2026–2027 cycle?',
      whyItMatters: 'Deadlines in state scholarship portals are strict with no grace periods permitted.',
      relatedInformationFound: 'Expired deadline of Dec 15, 2023 found in Source 1; unconfirmed Nov 30, 2026 claim in Source 2.',
      relatedSourceTitles: ['Official State Portal (2023)', 'EduFinder Guide (2026)'],
      suggestedVerificationStep: 'Inspect the live NSP homepage notifications ticker.',
      priority: 'high'
    },
    {
      id: 'q-02',
      question: 'Are scholarship recipients required to maintain a specific CGPA for yearly renewal?',
      whyItMatters: 'Losing scholarship funding mid-degree can derail academic progression.',
      relatedInformationFound: 'No renewal guidelines discovered in any reviewed document.',
      relatedSourceTitles: ['All 3 Sources Reviewed'],
      suggestedVerificationStep: 'Download the comprehensive scheme master operational document.',
      priority: 'high'
    },
    {
      id: 'q-03',
      question: 'Is Aadhaar-based Direct Bank Transfer (DBT) mandatory for bank accounts?',
      whyItMatters: 'Payments bounce if the bank account is not NPCI-mapped with the applicant Aadhaar.',
      relatedInformationFound: 'Source 1 mentions "bank passbook seeded with Aadhaar" briefly.',
      relatedSourceTitles: ['Official State Scholarship Portal - Gazette Notification No. 441'],
      suggestedVerificationStep: 'Run NPCI Aadhaar bank account mapping status check at resident bank branch.',
      priority: 'medium'
    }
  ],
  checklist: [
    {
      id: 'task-01',
      projectId: 'demo-scholarship-2026',
      title: 'Verify active 2026 deadline on official NSP portal',
      reason: 'Current deadline is unestablished; Source 1 shows expired 2023 date and Source 2 has unverified date.',
      relatedFinding: 'Freshness Warning: Expired 2023 cycle date',
      suggestedOfficialSource: 'National Scholarship Portal (scholarships.gov.in) Notifications tab',
      priority: 'high',
      status: 'pending',
      userNotes: 'Scheduled to check with department office on Monday morning.'
    },
    {
      id: 'task-02',
      projectId: 'demo-scholarship-2026',
      title: 'Confirm whether income ceiling is ₹2,50,000 or ₹3,50,000',
      reason: 'Conflicting claims between official gazette and advisory guide could invalidate application.',
      relatedFinding: 'Conflict: Income ceiling discrepancy between Source A & Source B',
      suggestedOfficialSource: 'Latest State Department Gazette or e-District Portal',
      priority: 'high',
      status: 'in_progress',
      userNotes: 'Applied for revenue certificate stating income under ₹2.5L to be safe.'
    },
    {
      id: 'task-03',
      projectId: 'demo-scholarship-2026',
      title: 'Obtain designated Revenue Authority Income Certificate',
      reason: 'Self-affidavits are forbidden by Source 1; certificate must be within 6 months validity.',
      relatedFinding: 'Information Gap: Official Document Checklist',
      suggestedOfficialSource: 'Local Tehsildar / Taluk Office or e-District Seva Kendra',
      priority: 'high',
      status: 'pending'
    },
    {
      id: 'task-04',
      projectId: 'demo-scholarship-2026',
      title: 'Confirm college Dean endorsement process and timeline',
      reason: 'College must counter-sign dossier before deadline; requires 5 business days processing.',
      relatedFinding: 'Claim 4: Dean office endorsement window',
      suggestedOfficialSource: 'City University Student Welfare Cell (Room 104)',
      priority: 'medium',
      status: 'completed',
      completedAt: '2026-10-31T10:10:00.000Z',
      userNotes: 'Met officer Mrs. Sharma; confirmed Room 104 is operational and takes 3-4 days.'
    },
    {
      id: 'task-05',
      projectId: 'demo-scholarship-2026',
      title: 'Clarify multi-year renewal GPA criteria with financial aid officer',
      reason: 'Renewal rules are completely missing from all reviewed sources.',
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
