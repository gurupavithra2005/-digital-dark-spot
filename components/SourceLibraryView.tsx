'use client';

import React, { useState } from 'react';
import { 
  Library, 
  Search, 
  Globe, 
  FileText, 
  Building2, 
  Calendar, 
  ExternalLink, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp 
} from 'lucide-react';
import { ResearchProject, Source } from '@/types/research';

interface SourceLibraryViewProps {
  projects: ResearchProject[];
  onOpenProject: (projectId: string) => void;
}

export function SourceLibraryView({ projects, onOpenProject }: SourceLibraryViewProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Flatten all sources from all projects
  const allSources: Array<{ source: Source; projectTitle: string; projectId: string; isDemo?: boolean }> = [];
  projects.forEach((p) => {
    (p.sources || []).forEach((s) => {
      allSources.push({ 
        source: s, 
        projectTitle: p.title, 
        projectId: p.id,
        isDemo: p.isSampleDemo || p.isDemo 
      });
    });
  });

  const filtered = allSources.filter(({ source, projectTitle }) => {
    const matchesSearch =
      source.title.toLowerCase().includes(search.toLowerCase()) ||
      (source.organization || '').toLowerCase().includes(search.toLowerCase()) ||
      (source.domain || '').toLowerCase().includes(search.toLowerCase()) ||
      projectTitle.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || source.category === filterType;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 pb-16 animate-in fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Global Source Library</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            All documents, government portals, publications, and excerpts indexed across your research.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          Total Indexed Sources: <span className="font-bold text-blue-400">{allSources.length}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, organization, domain, or project..."
            className="w-full rounded-xl border border-slate-700 bg-[#0e1422] pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="rounded-xl border border-slate-700 bg-[#0e1422] px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none"
        >
          <option value="all">All Source Categories</option>
          <option value="official_government">Government / Gazette</option>
          <option value="educational">University / Educational</option>
          <option value="institutional">Institutional</option>
          <option value="secondary_news">Secondary / Advisory</option>
          <option value="user_provided">User Supplied</option>
        </select>
      </div>

      {/* Source Cards */}
      <div className="space-y-3">
        {filtered.map(({ source, projectTitle, projectId }) => {
          const isExpanded = expandedId === source.id;
          return (
            <div
              key={source.id}
              className="rounded-xl border border-slate-800 bg-[#0e1422] p-5 hover:border-slate-700 transition-colors space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded bg-blue-950/80 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                      {source.type.toUpperCase()}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300">
                      {source.category.replace('_', ' ')}
                    </span>
                    {source.isDemo || allSources.find(a => a.source.id === source.id)?.isDemo ? (
                      <span className="rounded bg-amber-950/80 border border-amber-500/30 px-2 py-0.5 text-[10px] font-semibold text-amber-300">
                        Demo Source
                      </span>
                    ) : null}
                    <button
                      onClick={() => onOpenProject(projectId)}
                      className="text-[11px] text-blue-400 hover:underline"
                    >
                      Project: {projectTitle}
                    </button>
                  </div>

                  <h3 className="text-base font-semibold text-white leading-snug">{source.title}</h3>
                </div>

                {source.url && (
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800/80 hover:bg-slate-700 px-3 py-1.5 text-xs text-slate-200 transition-colors shrink-0"
                  >
                    <span>Open URL</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
                {source.organization && (
                  <div className="flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5 text-slate-500" />
                    <span>{source.organization}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-slate-500" />
                  <span>Published: {source.publicationDate || 'Undated'}</span>
                </div>
                <div className="flex items-center gap-1 text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Extraction Confidence: {source.extractionConfidence}%</span>
                </div>
              </div>

              {/* Extracted Text accordion */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : source.id)}
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                >
                  {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  <span>{isExpanded ? 'Hide Extracted Content' : 'Inspect Extracted Content'}</span>
                </button>

                {isExpanded && (
                  <div className="mt-2.5 rounded-lg bg-[#0a0d16] border border-slate-800 p-4 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {source.extractedText || 'No raw content stored.'}
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-slate-800 p-12 text-center text-xs text-slate-500">
            No sources match your filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
