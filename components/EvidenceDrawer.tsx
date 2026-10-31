'use client';

import React from 'react';
import { 
  X, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Calendar, 
  Building2, 
  Quote, 
  CheckCircle2, 
  AlertCircle,
  FileCode2,
  Copy,
  Check
} from 'lucide-react';
import { ExtractedClaim, Source } from '@/types/research';

export interface EvidenceDrawerData {
  title: string;
  claim?: ExtractedClaim;
  source?: Source;
  supportingPassage: string;
  sourceTitle: string;
  sourceUrl?: string;
  organization?: string;
  domain?: string;
  publicationDate?: string;
  updatedDate?: string;
  pageNumber?: number;
  sectionName?: string;
  confidence?: number;
  findingType?: 'fact' | 'gap' | 'conflict' | 'freshness';
}

interface EvidenceDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: EvidenceDrawerData | null;
  onVerifyClaim?: (claimId: string) => void;
}

export function EvidenceDrawer({ isOpen, onClose, data, onVerifyClaim }: EvidenceDrawerProps) {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen || !data) return null;

  const handleCopyQuote = () => {
    navigator.clipboard.writeText(data.supportingPassage || '');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in">
      <div 
        className="relative w-full max-w-xl h-full bg-[#0d131f] border-l border-slate-800 shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="evidence-drawer-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#0a0e17]">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950/80 border border-blue-500/30 text-blue-400">
              <Quote className="h-4 w-4" />
            </div>
            <div>
              <h2 id="evidence-drawer-title" className="text-base font-semibold text-white">
                Source Evidence & Provenance
              </h2>
              <p className="text-xs text-slate-400">Traceable evidence from reviewed documentation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            aria-label="Close evidence panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Finding Subject */}
          <div className="rounded-xl border border-slate-800 bg-[#121929] p-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Referenced Claim / Finding
            </div>
            <div className="text-base font-medium text-slate-100 leading-snug">
              {data.title}
            </div>
          </div>

          {/* Verbatim Supporting Passage */}
          <div className="rounded-xl border border-blue-500/30 bg-blue-950/20 p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-xs font-semibold text-blue-300 uppercase tracking-wide">
                <Quote className="h-3.5 w-3.5" />
                Exact Verbatim Supporting Passage
              </span>
              <button
                onClick={handleCopyQuote}
                className="flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy Passage'}</span>
              </button>
            </div>

            <blockquote className="rounded-lg bg-[#0a0e17]/80 border border-slate-800/80 p-4 text-sm text-slate-200 italic leading-relaxed">
              &ldquo;{data.supportingPassage}&rdquo;
            </blockquote>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-1">
              {data.confidence !== undefined && (
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Extraction Confidence: {data.confidence}%</span>
                </div>
              )}
              {data.pageNumber && (
                <div className="flex items-center gap-1 text-slate-300">
                  <FileText className="h-3.5 w-3.5" />
                  <span>Page: {data.pageNumber}</span>
                </div>
              )}
              {data.sectionName && (
                <div className="text-slate-300">
                  Section: {data.sectionName}
                </div>
              )}
            </div>
          </div>

          {/* Source Metadata Provenance */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Source Provenance & Metadata
            </h3>

            <div className="rounded-xl border border-slate-800/80 bg-[#121929] divide-y divide-slate-800/60">
              <div className="p-4 flex items-start gap-3">
                <FileCode2 className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Source Title</div>
                  <div className="text-sm font-semibold text-slate-100">{data.sourceTitle}</div>
                </div>
              </div>

              {(data.organization || data.domain) && (
                <div className="p-4 flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="text-xs text-slate-400">Organization / Domain</div>
                    <div className="text-sm text-slate-200">
                      {data.organization || data.domain}
                      {data.domain && <span className="text-xs text-slate-400 ml-1.5">({data.domain})</span>}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 flex items-start gap-3">
                <Calendar className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs text-slate-400">Publication & Document Dates</div>
                  <div className="text-sm text-slate-200">
                    {data.publicationDate ? (
                      <span>Published: {data.publicationDate}</span>
                    ) : (
                      <span className="text-amber-400">Publication Date Undated</span>
                    )}
                    {data.updatedDate && (
                      <span className="text-slate-400 ml-2">(Updated: {data.updatedDate})</span>
                    )}
                  </div>
                </div>
              </div>

              {data.sourceUrl && (
                <div className="p-4 flex items-center justify-between">
                  <div className="truncate mr-3">
                    <div className="text-xs text-slate-400">Direct Link</div>
                    <div className="text-xs text-blue-400 truncate">{data.sourceUrl}</div>
                  </div>
                  <a
                    href={data.sourceUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600/20 border border-blue-500/40 px-3 py-1.5 text-xs font-medium text-blue-300 hover:bg-blue-600/30 transition-all shrink-0"
                  >
                    <span>Open Original Source</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Integrity & Anti-Hallucination Disclaimer */}
          <div className="rounded-xl border border-slate-800 bg-[#0a0e17] p-4 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Evidence Integrity Guarantee</span>
            </div>
            <p>
              This passage was verbatim extracted from the underlying document or web URL. Digital Dark Spot maintains immutable citations and does not hallucinate supporting evidence.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800 px-6 py-4 bg-[#0a0e17] flex items-center justify-between">
          {data.claim && onVerifyClaim ? (
            <button
              onClick={() => onVerifyClaim(data.claim!.id)}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/40 px-3.5 py-2 text-xs font-medium text-emerald-300 hover:bg-emerald-600/30 transition-all"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>Mark Verified by Me</span>
            </button>
          ) : (
            <div className="text-xs text-slate-400">Traceable Evidence Record</div>
          )}

          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-medium text-slate-200 transition-colors"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
}
