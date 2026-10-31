'use client';

import React, { useState } from 'react';
import { 
  PlusCircle, 
  Search, 
  Trash2, 
  ExternalLink, 
  ArrowRight, 
  Calendar, 
  Layers, 
  AlertTriangle, 
  GitCompare, 
  Download, 
  Clock,
  Sparkles
} from 'lucide-react';
import { ResearchProject } from '@/types/research';
import { formatDisplayDate } from '@/lib/utils';

interface ProjectsListViewProps {
  projects: ResearchProject[];
  onOpenProject: (id: string) => void;
  onDeleteProject: (id: string) => void;
  onNewResearch: () => void;
  onLoadDemo: () => void;
}

export function ProjectsListView({
  projects,
  onOpenProject,
  onDeleteProject,
  onNewResearch,
  onLoadDemo,
}: ProjectsListViewProps) {
  const [search, setSearch] = useState('');
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filtered = projects.filter((p) => {
    return (
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.researchQuestion.toLowerCase().includes(search.toLowerCase()) ||
      (p.authorityOrOrganization || '').toLowerCase().includes(search.toLowerCase())
    );
  });

  const handleExportJSON = (project: ResearchProject) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(project, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${project.title.replace(/\s+/g, '_')}_export.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">My Research Projects</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Manage your saved information gap investigations and verification workflows.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-300 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Load Demo</span>
          </button>

          <button
            onClick={onNewResearch}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-blue-600/20"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Research</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search research by title, question, or organization..."
          className="w-full rounded-xl border border-slate-700 bg-[#0e1422] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((proj) => (
          <div
            key={proj.id}
            className="rounded-2xl border border-slate-800 bg-[#0e1422] p-6 flex flex-col justify-between space-y-4 shadow-sm hover:border-slate-700 transition-all"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className={`rounded px-2 py-0.5 text-[10px] font-semibold uppercase ${
                  (proj.isSampleDemo || proj.isDemo)
                    ? 'bg-amber-950 border border-amber-500/40 text-amber-300'
                    : 'bg-blue-950 border border-blue-500/40 text-blue-300'
                }`}>
                  {(proj.isSampleDemo || proj.isDemo) ? 'Illustrative Demo' : 'Real User Research'}
                </span>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>{formatDisplayDate(proj.updatedAt)}</span>
                </div>
              </div>

              {(proj.isSampleDemo || proj.isDemo) && (
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  ILLUSTRATIVE DEMO DATA — NOT LIVE OFFICIAL INFORMATION
                </div>
              )}

              <div>
                <h2 className="text-base font-bold text-white leading-snug line-clamp-2">
                  {proj.title}
                </h2>
                <p className="text-xs text-slate-300 italic line-clamp-2 mt-1">
                  &ldquo;{proj.researchQuestion}&rdquo;
                </p>
              </div>

              {/* Badges Strip */}
              <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-center text-xs">
                <div className="rounded bg-[#090d16] p-2">
                  <div className="text-[10px] text-slate-400">Sources</div>
                  <div className="font-bold text-slate-200 mt-0.5">{proj.sources?.length || 0}</div>
                </div>
                <div className="rounded bg-[#090d16] p-2">
                  <div className="text-[10px] text-amber-300">Gaps</div>
                  <div className="font-bold text-amber-400 mt-0.5">{proj.gaps?.length || 0}</div>
                </div>
                <div className="rounded bg-[#090d16] p-2">
                  <div className="text-[10px] text-rose-300">Conflicts</div>
                  <div className="font-bold text-rose-400 mt-0.5">{proj.conflicts?.length || 0}</div>
                </div>
                <div className="rounded bg-[#090d16] p-2">
                  <div className="text-[10px] text-emerald-300">Coverage</div>
                  <div className="font-bold text-emerald-400 mt-0.5">{proj.coverageSummaryScore ?? 70}%</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleExportJSON(proj)}
                  className="rounded-lg p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Export project data JSON"
                >
                  <Download className="h-4 w-4" />
                </button>

                {confirmDeleteId === proj.id ? (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onDeleteProject(proj.id)}
                      className="rounded bg-rose-600 px-2 py-1 text-[10px] font-semibold text-white"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="rounded bg-slate-800 px-2 py-1 text-[10px] text-slate-300"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(proj.id)}
                    className="rounded-lg p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Delete project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => onOpenProject(proj.id)}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-semibold text-white shadow-sm"
              >
                <span>Open Project</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
            No research projects match your query.
          </div>
        )}
      </div>
    </div>
  );
}
