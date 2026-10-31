'use client';

import React, { useState } from 'react';
import { 
  X, 
  Printer, 
  Download, 
  FileSpreadsheet, 
  ShieldCheck, 
  AlertTriangle, 
  GitCompare, 
  Clock, 
  CheckSquare, 
  ExternalLink 
} from 'lucide-react';
import { ResearchProject } from '@/types/research';
import { exportChecklistToCSV, exportFindingsToCSV } from '@/lib/storage';
import { formatDisplayDate } from '@/lib/utils';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ResearchProject;
}

export function ReportModal({ isOpen, onClose, project }: ReportModalProps) {
  const [downloadNotice, setDownloadNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportChecklistCSV = () => {
    const csv = exportChecklistToCSV(project);
    downloadFile(`${project.title.replace(/\s+/g, '_')}_checklist.csv`, csv, 'text/csv;charset=utf-8;');
    setDownloadNotice('Verification Checklist CSV downloaded.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  const handleExportFindingsCSV = () => {
    const csv = exportFindingsToCSV(project);
    downloadFile(`${project.title.replace(/\s+/g, '_')}_findings.csv`, csv, 'text/csv;charset=utf-8;');
    setDownloadNotice('Findings (Gaps, Conflicts & Freshness) CSV downloaded.');
    setTimeout(() => setDownloadNotice(null), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4 sm:p-6 overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-[#0c101a] border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Toolbar (hidden in print) */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-[#080c14] print:hidden">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-950 border border-blue-500/30 text-blue-400">
              <Printer className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Research Intelligence Dossier</h2>
              <p className="text-xs text-slate-400">Print-friendly dossier & CSV data export</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportChecklistCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors"
              title="Download checklist as CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Checklist CSV</span>
            </button>

            <button
              onClick={handleExportFindingsCSV}
              className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors"
              title="Download findings as CSV"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-blue-400" />
              <span className="hidden sm:inline">Findings CSV</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-all shadow-md"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
              aria-label="Close report modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {downloadNotice && (
          <div className="bg-emerald-950/80 border-b border-emerald-500/30 px-6 py-2 text-xs text-emerald-300 print:hidden">
            {downloadNotice}
          </div>
        )}

        {/* Printable Report Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 space-y-8 bg-[#0c101a] text-slate-200 print:bg-white print:text-black print:p-0">
          
          {/* Section 1 & 2: Title & Objective */}
          <div className="border-b border-slate-800 pb-6 print:border-gray-300">
            <div className="flex items-center justify-between text-xs text-slate-400 print:text-gray-600 mb-2">
              <span className="font-semibold uppercase tracking-wider text-blue-400 print:text-blue-700">
                DIGITAL DARK SPOT — Evidence & Information Gap Report
              </span>
              <span>Generated: {formatDisplayDate(new Date())}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white print:text-black">
              {project.title}
            </h1>
            <div className="mt-3 text-sm text-slate-300 print:text-gray-800 space-y-1">
              <div>
                <strong className="text-slate-100 print:text-black">Research Question: </strong>
                <span>{project.researchQuestion}</span>
              </div>
              <div>
                <strong className="text-slate-100 print:text-black">Objective: </strong>
                <span>{project.objective}</span>
              </div>
              {project.authorityOrOrganization && (
                <div>
                  <strong className="text-slate-100 print:text-black">Authority / Scope: </strong>
                  <span>{project.authorityOrOrganization} ({project.geographicScope || 'General'})</span>
                </div>
              )}
            </div>

            {(project.isSampleDemo || project.isDemo) && (
              <div className="mt-3 p-3 rounded-lg border border-amber-500/40 bg-amber-950/30 text-amber-300 font-bold text-xs uppercase print:bg-yellow-100 print:text-yellow-900 print:border-yellow-400">
                ILLUSTRATIVE DEMO DATA — NOT LIVE OFFICIAL INFORMATION.
              </div>
            )}
          </div>

          {/* Section 3: Executive Summary */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-700">
              1. Executive Summary
            </h2>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-300 print:text-gray-800">
              {project.executiveSummary}
            </p>
          </div>

          {/* Section 4: Sources Reviewed */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-700">
              2. Sources Reviewed ({project.sources?.length || 0})
            </h2>
            <div className="space-y-2 text-xs">
              {(project.sources || []).map((s, idx) => (
                <div key={s.id} className="rounded-lg border border-slate-800 bg-[#090d16] p-3 print:bg-gray-50 print:border-gray-200">
                  <div className="font-semibold text-white print:text-black">
                    [{idx + 1}] {s.title}
                  </div>
                  <div className="text-[11px] text-slate-400 print:text-gray-600 mt-0.5">
                    Category: {s.category.replace('_', ' ')} | Date: {formatDisplayDate(s.publicationDate)} | Organization: {s.organization || s.domain || 'N/A'}
                  </div>
                  {s.url && (
                    <div className="text-[11px] text-blue-400 print:text-blue-600 truncate mt-1">
                      URL: {s.url}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Key Extracted Information */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-700">
              3. Key Sourced Claims & Supporting Evidence ({project.claims?.length || 0})
            </h2>
            <div className="space-y-2 text-xs">
              {(project.claims || []).map((c, idx) => (
                <div key={c.id} className="p-3 rounded-lg border border-slate-800 bg-[#090d16] print:bg-gray-50 print:border-gray-200">
                  <div className="font-semibold text-slate-100 print:text-black">
                    {c.claimText}
                  </div>
                  <blockquote className="mt-1 text-[11px] italic text-slate-300 print:text-gray-700 border-l-2 border-blue-500 pl-2">
                    &ldquo;{c.supportingPassage}&rdquo;
                  </blockquote>
                  <div className="text-[10px] text-slate-400 print:text-gray-600 mt-1">
                    Source: {c.sourceTitle} | Confidence: {c.confidence}%
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Potential Information Gaps */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-700">
              4. Potential Information Gaps ({project.gaps?.length || 0})
            </h2>
            <div className="space-y-3 text-xs">
              {(project.gaps || []).map((g) => (
                <div key={g.id} className="p-3.5 rounded-lg border border-amber-500/30 bg-amber-950/10 print:bg-yellow-50 print:border-yellow-300 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black">{g.title}</span>
                    <span className="font-semibold text-amber-400 print:text-amber-800 uppercase text-[10px]">{g.priority} Priority</span>
                  </div>
                  <div className="text-[11px] font-semibold text-amber-300 print:text-amber-900">
                    Potential Information Gap — Not found in the sources reviewed.
                  </div>
                  <p className="text-slate-300 print:text-gray-800">{g.whyItMatters}</p>
                  <div className="text-[11px] text-slate-400 print:text-gray-700">
                    <strong>Recommended Action:</strong> {g.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 7: Conflicting Claims */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-rose-400 print:text-rose-700">
              5. Possible Conflicting Claims ({project.conflicts?.length || 0})
            </h2>
            <div className="space-y-3 text-xs">
              {(project.conflicts || []).map((c) => (
                <div key={c.id} className="p-3.5 rounded-lg border border-rose-500/30 bg-rose-950/10 print:bg-red-50 print:border-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white print:text-black">{c.aspect}</span>
                    <span className="font-semibold text-rose-400 print:text-rose-800 text-[10px]">{c.label}</span>
                  </div>
                  <p className="text-slate-300 print:text-gray-800">{c.explanation}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                    <div className="p-2 rounded bg-[#090d16] print:bg-white border border-slate-800 print:border-gray-300">
                      <strong>{c.sourceA.sourceTitle}:</strong> &ldquo;{c.sourceA.supportingPassage}&rdquo;
                    </div>
                    <div className="p-2 rounded bg-[#090d16] print:bg-white border border-slate-800 print:border-gray-300">
                      <strong>{c.sourceB.sourceTitle}:</strong> &ldquo;{c.sourceB.supportingPassage}&rdquo;
                    </div>
                  </div>
                  <div className="text-[11px] text-amber-400 print:text-amber-800">
                    <strong>Recommended Resolution:</strong> {c.recommendedAction}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 8: Coverage Matrix */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-blue-400 print:text-blue-700">
              6. Research Coverage Matrix
            </h2>
            <table className="w-full text-left text-xs border border-slate-800 print:border-gray-300">
              <thead className="bg-[#090d16] print:bg-gray-100 text-[10px] uppercase text-slate-400 print:text-gray-700">
                <tr>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300">Aspect</th>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300">Status</th>
                  <th className="p-2 border-b border-slate-800 print:border-gray-300">Evidence Summary</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 print:divide-gray-300">
                {(project.coverageMatrix || []).map((row, idx) => (
                  <tr key={idx}>
                    <td className="p-2 font-semibold text-white print:text-black">{row.aspect}</td>
                    <td className="p-2 capitalize font-medium">{row.status.replace('_', ' ')}</td>
                    <td className="p-2 text-slate-300 print:text-gray-700">{row.summary}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 9: Prioritized Verification Checklist */}
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 print:text-emerald-700">
              7. Prioritized Verification Checklist
            </h2>
            <div className="space-y-2 text-xs">
              {(project.checklist || []).map((t, idx) => (
                <div key={t.id} className="p-2.5 rounded border border-slate-800 bg-[#090d16] print:bg-gray-50 print:border-gray-200 flex items-start gap-2">
                  <span className="font-mono text-slate-500">[{idx + 1}]</span>
                  <div className="flex-1 space-y-0.5">
                    <div className="font-semibold text-white print:text-black">
                      {t.title} ({t.priority} Priority — {t.status})
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-gray-600">
                      Reason: {t.reason} | Official Source: {t.suggestedOfficialSource}
                    </div>
                    {t.userNotes && (
                      <div className="text-[11px] text-indigo-300 print:text-indigo-700 font-mono">
                        Notes: {t.userNotes}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 10: Limitations & Uncertainty Statement */}
          <div className="rounded-xl border border-slate-800 bg-[#090d16] p-4 text-xs text-slate-400 print:border-gray-300 print:bg-gray-100 print:text-gray-700 space-y-1.5">
            <div className="font-bold text-slate-200 print:text-black">
              Limitations, Uncertainty & Legal Notice
            </div>
            <p>
              AI findings generated by DIGITAL DARK SPOT are research signals designed to assist human researchers in discovering omissions, temporal divergence, and contradictions. They do not constitute guaranteed facts or legal counsel. Always verify critical decisions with the latest official gazetted notifications and primary administrative authorities.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-800 px-6 py-4 bg-[#080c14] flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="rounded-lg bg-slate-800 hover:bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-200 transition-colors"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
}
