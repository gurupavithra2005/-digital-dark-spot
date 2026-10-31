import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { ResearchProject } from '@/types/research';

export async function POST(req: NextRequest) {
  try {
    const { message, project }: { message: string; project: ResearchProject } = await req.json();

    if (!message || !message.trim()) {
      return NextResponse.json({ error: 'Message is required.' }, { status: 400 });
    }

    if (!project) {
      return NextResponse.json({ error: 'Project context is required.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are the Research Intelligence Assistant for DIGITAL DARK SPOT.
Your goal is to answer questions strictly grounded in the reviewed sources, claims, gaps, and conflicts of the current research project.

MANDATORY RULES:
1. Always reference the actual source titles, dates, and evidence passages from this project.
2. If the user asks something that is NOT supported or answered by the reviewed documents, you MUST explicitly say:
   "The reviewed sources do not provide sufficient evidence to answer this question."
   You may then suggest how they can verify it.
3. Be transparent, objective, and clear about whether something is a verified source fact or an AI-detected gap/conflict.
4. Keep answers concise, clear, and actionable.

ACTIVE PROJECT CONTEXT:
- Title: ${project.title}
- Main Research Question: ${project.researchQuestion}
- Objective: ${project.objective}
- Sources Reviewed (${project.sources?.length || 0}):
${(project.sources || [])
  .map(
    (s, idx) => `[Source ${idx + 1}] ID: ${s.id} | Title: ${s.title} | Type: ${s.type} | Date: ${s.publicationDate || 'Undated'}
Content Snippet: ${s.extractedText ? s.extractedText.slice(0, 1000) : 'None'}`
  )
  .join('\n\n')}

EXTRACTED CLAIMS (${project.claims?.length || 0}):
${(project.claims || [])
  .slice(0, 8)
  .map((c) => `- [${c.category}] from "${c.sourceTitle}": "${c.claimText}" (Evidence: "${c.supportingPassage}")`)
  .join('\n')}

DETECTED GAPS (${project.gaps?.length || 0}):
${(project.gaps || [])
  .map((g) => `- Gap: "${g.title}" | Found: "${g.whatWasFound}" | Missing: "${g.whatWasNotFound}" | Action: "${g.recommendedAction}"`)
  .join('\n')}

DETECTED CONFLICTS (${project.conflicts?.length || 0}):
${(project.conflicts || [])
  .map((c) => `- Conflict on "${c.aspect}": Source "${c.sourceA.sourceTitle}" claims "${c.sourceA.claimText}" vs Source "${c.sourceB.sourceTitle}" claims "${c.sourceB.claimText}". Explanation: ${c.explanation}`)
  .join('\n')}

USER QUESTION:
"${message}"
`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: prompt,
      });

      return NextResponse.json({
        reply: response.text || 'The reviewed sources do not provide sufficient evidence to answer this question.',
      });
    }

    // Fallback grounded responder
    const qLower = message.toLowerCase();
    if (qLower.includes('gap') || qLower.includes('missing')) {
      const topGap = project.gaps?.[0];
      if (topGap) {
        return NextResponse.json({
          reply: `In this research, we identified "${topGap.title}" as a Potential Information Gap. Reason: ${topGap.whyItMatters} What was found was "${topGap.whatWasFound}", whereas "${topGap.whatWasNotFound}" was completely missing across the reviewed sources. Recommended action: ${topGap.recommendedAction}`,
        });
      }
    }

    if (qLower.includes('conflict') || qLower.includes('contradiction')) {
      const topConflict = project.conflicts?.[0];
      if (topConflict) {
        return NextResponse.json({
          reply: `A key conflict was detected regarding "${topConflict.aspect}". ${topConflict.sourceA.sourceTitle} states: "${topConflict.sourceA.claimText}", whereas ${topConflict.sourceB.sourceTitle} states: "${topConflict.sourceB.claimText}". ${topConflict.explanation} Verification step: ${topConflict.recommendedAction}`,
        });
      }
    }

    if (qLower.includes('verify first') || qLower.includes('checklist') || qLower.includes('priority')) {
      const highTasks = project.checklist?.filter((t) => t.priority === 'high') || [];
      if (highTasks.length > 0) {
        return NextResponse.json({
          reply: `Based on detected information gaps and conflicts, you should prioritize verifying: 1) ${highTasks[0]?.title} (${highTasks[0]?.suggestedOfficialSource}), and 2) ${highTasks[1]?.title || 'reviewing active official circulars'}.`,
        });
      }
    }

    return NextResponse.json({
      reply: 'The reviewed sources do not provide sufficient evidence to answer this question. Please refer to the official publishing authority or add further primary documentation.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error processing question.' }, { status: 500 });
  }
}
