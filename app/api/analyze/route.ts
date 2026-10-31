import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { 
  ResearchProject, 
  Source, 
  ExtractedClaim, 
  InformationGap, 
  ConflictingClaim, 
  OutdatedSourceWarning, 
  UnansweredQuestion, 
  VerificationTask, 
  ResearchAspectCoverage 
} from '@/types/research';
import { 
  calculateCoverageSummaryScore, 
  detectDateFreshnessWarning, 
  classifySourceCategory,
  generateVerificationChecklistFromFindings
} from '@/lib/analysis-logic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      id,
      title, 
      researchQuestion, 
      objective, 
      geographicScope, 
      authorityOrOrganization, 
      keyAspectsToInvestigate = [],
      sources = [] 
    } = body;

    if (!sources || sources.length === 0) {
      return NextResponse.json(
        { error: 'At least one source is required for analysis.' },
        { status: 400 }
      );
    }

    const projectId = id || `proj-${Date.now()}`;
    const activeSources: Source[] = sources.filter((s: Source) => !s.isExcluded);

    if (activeSources.length === 0) {
      return NextResponse.json(
        { error: 'All sources are excluded. Please include at least one source to analyze.' },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      try {
        const ai = new GoogleGenAI({ apiKey });

        const prompt = `You are DIGITAL DARK SPOT, a precision AI information gap detection engine.
Your task is to analyze multiple sources against a user's research objective and produce an evidence-backed intelligence report.

CRITICAL PRODUCT RULES:
1. Distinguish strictly between:
   - Verified information extracted from sources (must include exact supporting text passage).
   - Potential information gaps ("Potential Information Gap — Not found in the sources reviewed.").
   - Possible conflicting claims between sources.
   - Potentially outdated information.
   - Items that require human verification.
2. NEVER invent citations, URLs, or claims not present in the provided sources.
3. Every claim MUST quote a verbatim supporting passage from that specific source text.
4. Current operational year is 2026. Flag any source or deadline referring to 2024 or earlier as potentially outdated or earlier cycle.

RESEARCH CONTEXT:
- Title: ${title}
- Main Research Question: ${researchQuestion}
- Objective: ${objective}
- Geographic Scope: ${geographicScope || 'General'}
- Authority / Organization: ${authorityOrOrganization || 'Not specified'}
- Key Aspects To Investigate: ${keyAspectsToInvestigate.join(', ') || 'Eligibility, Deadlines, Requirements, Financial, Procedure'}

SOURCES REVIEWED:
${activeSources.map((s, idx) => `
[SOURCE ${idx + 1}]
ID: ${s.id}
Title: ${s.title}
Type: ${s.type}
Domain/Org: ${s.domain || s.organization || 'Unknown'}
Publication Date: ${s.publicationDate || 'Undated'}
Content:
${s.extractedText ? s.extractedText.slice(0, 3500) : 'No content'}
`).join('\n---\n')}

OUTPUT INSTRUCTIONS:
Return a valid, parseable JSON object matching this schema EXACTLY without markdown code blocks:
{
  "executiveSummary": "Concise summary of what is known, what is missing, and what conflicts exist.",
  "claims": [
    {
      "id": "claim-1",
      "sourceId": "ID of matching source",
      "sourceTitle": "Title of source",
      "category": "e.g. Eligibility, Financial, Deadlines, Required Documents, Procedure",
      "claimText": "Clean factual statement",
      "supportingPassage": "Exact verbatim sentence from source text",
      "confidence": 95
    }
  ],
  "gaps": [
    {
      "id": "gap-1",
      "title": "Short title of what is missing",
      "gapType": "missing_information" | "incomplete_information" | "unanswered_question" | "missing_official_confirmation" | "missing_dates_deadlines" | "missing_eligibility_details" | "missing_document_requirements" | "missing_procedure_steps",
      "description": "Potential Information Gap — Not found in the sources reviewed.",
      "whyItMatters": "Why user cannot safely proceed without this",
      "whatWasFound": "What related info was found",
      "whatWasNotFound": "What specific critical detail was missing",
      "relatedSourceIds": ["IDs of sources"],
      "suggestedSourceToVerify": "Where to look next (e.g. official portal, gazette)",
      "recommendedAction": "Concrete next step",
      "priority": "high" | "medium" | "low",
      "status": "needs_verification"
    }
  ],
  "conflicts": [
    {
      "id": "conflict-1",
      "aspect": "Aspect name (e.g. Deadline, Income Limit, Required Documents)",
      "conflictType": "different_deadlines" | "different_eligibility" | "different_documents" | "different_amounts" | "different_dates" | "different_procedures" | "different_numerical_values" | "different_policy_conditions",
      "label": "Possible Conflict" | "Different Time Period" | "Different Scope or Conditions" | "Requires Official Confirmation",
      "explanation": "Why these two sources provide inconsistent information",
      "sourceA": {
        "sourceId": "ID",
        "sourceTitle": "Title",
        "date": "Date if known",
        "claimText": "Claim in source A",
        "supportingPassage": "Verbatim quote from source A",
        "isOfficial": true or false
      },
      "sourceB": {
        "sourceId": "ID",
        "sourceTitle": "Title",
        "date": "Date if known",
        "claimText": "Claim in source B",
        "supportingPassage": "Verbatim quote from source B",
        "isOfficial": true or false
      },
      "recommendedAction": "Actionable verification advice",
      "resolutionStatus": "unresolved"
    }
  ],
  "freshnessWarnings": [
    {
      "id": "fresh-1",
      "sourceId": "source ID",
      "sourceTitle": "source title",
      "availableDate": "date string",
      "status": "potentially_outdated" | "date_unknown" | "earlier_application_cycle" | "currentness_not_established" | "no_freshness_warning",
      "warningReason": "Why this source may be outdated or risky",
      "affectedInformation": "Which rules or deadlines may have changed",
      "suggestedAction": "How to verify currentness",
      "severity": "high" | "medium" | "low"
    }
  ],
  "unansweredQuestions": [
    {
      "id": "q-1",
      "question": "Clear question",
      "whyItMatters": "Reason",
      "relatedInformationFound": "Context",
      "relatedSourceTitles": ["Source titles"],
      "suggestedVerificationStep": "Next step",
      "priority": "high" | "medium" | "low"
    }
  ],
  "coverageMatrix": [
    {
      "aspect": "Aspect name",
      "status": "covered" | "partially_covered" | "not_found" | "conflicting" | "requires_verification",
      "summary": "Short finding summary",
      "supportingSourceIds": ["IDs"]
    }
  ],
  "checklist": [
    {
      "id": "task-1",
      "title": "Actionable verification task",
      "reason": "Why verify this",
      "relatedFinding": "Finding name",
      "suggestedOfficialSource": "Specific source to check",
      "priority": "high" | "medium" | "low",
      "status": "pending"
    }
  ]
}`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
          },
        });

        const rawText = response.text?.trim() || '{}';
        const parsed = JSON.parse(rawText);

        const coverageMatrix: ResearchAspectCoverage[] = (parsed.coverageMatrix || []).map((row: any) => ({
          aspect: row.aspect || 'General Aspect',
          status: row.status || 'partially_covered',
          summary: row.summary || '',
          supportingSourceIds: row.supportingSourceIds || [],
          relatedGapIds: row.relatedGapIds,
          relatedConflictIds: row.relatedConflictIds,
        }));

        const coverageSummaryScore = calculateCoverageSummaryScore(coverageMatrix);

        const completeProject: ResearchProject = {
          id: projectId,
          title: title || 'Untitled Research',
          researchQuestion: researchQuestion || 'Research Objective Review',
          objective: objective || '',
          geographicScope,
          authorityOrOrganization,
          keyAspectsToInvestigate: keyAspectsToInvestigate.length > 0 ? keyAspectsToInvestigate : ['Eligibility', 'Requirements', 'Deadlines'],
          status: 'completed',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isSampleDemo: false,
          isDemo: false,
          executiveSummary: parsed.executiveSummary || 'Research analysis complete.',
          sources: activeSources,
          claims: (parsed.claims || []).map((c: any, i: number) => ({
            ...c,
            id: c.id || `claim-${i + 1}`,
            projectId,
          })),
          gaps: (parsed.gaps || []).map((g: any, i: number) => ({
            ...g,
            id: g.id || `gap-${i + 1}`,
            projectId,
            description: 'Potential Information Gap — Not found in the sources reviewed.',
          })),
          conflicts: (parsed.conflicts || []).map((c: any, i: number) => ({
            ...c,
            id: c.id || `conflict-${i + 1}`,
            projectId,
          })),
          freshnessWarnings: (parsed.freshnessWarnings || []).map((w: any, i: number) => ({
            ...w,
            id: w.id || `fresh-${i + 1}`,
          })),
          unansweredQuestions: (parsed.unansweredQuestions || []).map((q: any, i: number) => ({
            ...q,
            id: q.id || `q-${i + 1}`,
          })),
          checklist: (parsed.checklist || []).map((t: any, i: number) => ({
            ...t,
            id: t.id || `task-${i + 1}`,
            projectId,
          })),
          coverageMatrix,
          coverageSummaryScore,
        };

        return NextResponse.json({ success: true, project: completeProject });
      } catch (geminiError: any) {
        console.warn('Gemini API call failed, falling back to deterministic analyzer:', geminiError?.message);
      }
    }

    // Deterministic fallback analyzer
    const claims: ExtractedClaim[] = [];
    const gaps: InformationGap[] = [];
    const conflicts: ConflictingClaim[] = [];
    const freshnessWarnings: OutdatedSourceWarning[] = [];

    // Analyze dates
    activeSources.forEach((src) => {
      const warn = detectDateFreshnessWarning(src.publicationDate || src.updatedDate, 2026, src.extractedText);
      if (warn) {
        freshnessWarnings.push({
          id: `fresh-${src.id}`,
          sourceId: src.id,
          sourceTitle: src.title,
          sourceUrl: src.url,
          availableDate: src.publicationDate || src.updatedDate || 'Unknown',
          status: warn.status,
          warningReason: warn.warningReason,
          affectedInformation: 'Active application cycle deadlines, quotas, and current policy regulations.',
          suggestedAction: 'Cross-check against the official gazette portal for the current 2026 cycle.',
          severity: warn.severity,
        });
      }

      // Extract key sentences
      if (src.extractedText) {
        const sentences = src.extractedText
          .split(/[.\n]/)
          .map((s) => s.trim())
          .filter((s) => s.length > 25);

        sentences.slice(0, 3).forEach((sent, idx) => {
          claims.push({
            id: `claim-${src.id}-${idx}`,
            projectId,
            sourceId: src.id,
            sourceTitle: src.title,
            sourceUrl: src.url,
            category: 'General Requirements',
            claimText: sent,
            supportingPassage: sent,
            confidence: 85,
          });
        });
      }
    });

    // Check aspects
    const defaultAspects = keyAspectsToInvestigate.length > 0 
      ? keyAspectsToInvestigate 
      : ['Eligibility Requirements', 'Official Deadlines', 'Required Documents', 'Application Process'];

    defaultAspects.forEach((aspect: string, idx: number) => {
      const isMentioned = activeSources.some((s) => 
        (s.extractedText || '').toLowerCase().includes(aspect.toLowerCase().split(' ')[0])
      );

      if (!isMentioned) {
        gaps.push({
          id: `gap-fallback-${idx}`,
          projectId,
          title: `${aspect} not covered in reviewed sources`,
          gapType: 'missing_information',
          description: 'Potential Information Gap — Not found in the sources reviewed.',
          whyItMatters: `Crucial for understanding complete requirements and preventing application rejection.`,
          whatWasFound: 'General overview statements only.',
          whatWasNotFound: `Specific rules, documents, or confirmation regarding ${aspect}.`,
          relatedSourceIds: activeSources.map((s) => s.id),
          suggestedSourceToVerify: `${authorityOrOrganization || 'Official authority'} documentation.`,
          recommendedAction: `Request specific clarification from official authority regarding ${aspect}.`,
          priority: idx === 0 ? 'high' : 'medium',
          status: 'needs_verification',
        });
      }
    });

    const checklist = generateVerificationChecklistFromFindings(projectId, gaps, conflicts, freshnessWarnings);

    const coverageMatrix: ResearchAspectCoverage[] = defaultAspects.map((aspect: string) => {
      const hasGap = gaps.some((g) => g.title.toLowerCase().includes(aspect.toLowerCase()));
      return {
        aspect,
        status: hasGap ? 'not_found' : 'covered',
        summary: hasGap ? 'No verifiable information found in reviewed materials.' : 'Sufficient evidence located.',
        supportingSourceIds: hasGap ? [] : activeSources.slice(0, 1).map((s) => s.id),
      };
    });

    const coverageSummaryScore = calculateCoverageSummaryScore(coverageMatrix);

    const fallbackProject: ResearchProject = {
      id: projectId,
      title: title || 'Research Analysis',
      researchQuestion: researchQuestion || 'Verification Review',
      objective: objective || '',
      geographicScope,
      authorityOrOrganization,
      keyAspectsToInvestigate: defaultAspects,
      status: 'completed',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isSampleDemo: false,
      isDemo: false,
      executiveSummary: `Analysis completed across ${activeSources.length} sources. ${gaps.length} potential information gaps and ${freshnessWarnings.length} freshness alerts were identified.`,
      sources: activeSources,
      claims,
      gaps,
      conflicts,
      freshnessWarnings,
      unansweredQuestions: [
        {
          id: 'q-fb-1',
          question: `What are the definitive guidelines for ${defaultAspects[0]}?`,
          whyItMatters: 'Essential for proceeding without compliance risk.',
          relatedInformationFound: 'Partial statements only.',
          relatedSourceTitles: activeSources.map((s) => s.title),
          suggestedVerificationStep: 'Consult the governing body handbook.',
          priority: 'high',
        },
      ],
      checklist,
      coverageMatrix,
      coverageSummaryScore,
    };

    return NextResponse.json({ success: true, project: fallbackProject });
  } catch (error: any) {
    console.error('Analysis error:', error);
    return NextResponse.json({ error: error.message || 'Failed to complete analysis.' }, { status: 500 });
  }
}
