'use client';

import React, { useState } from 'react';
import { 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Globe, 
  FileText, 
  Upload, 
  CheckCircle, 
  AlertTriangle, 
  Sparkles, 
  Loader2, 
  HelpCircle,
  X,
  FileCheck2,
  ExternalLink,
  Copy,
  Info
} from 'lucide-react';
import { Source, ResearchProject } from '@/types/research';
import { PRESET_TEMPLATES } from '@/lib/sample-data';
import { classifySourceCategory, detectDateFreshnessWarning } from '@/lib/analysis-logic';
import { checkSourceDuplicate } from '@/lib/storage';

interface NewResearchWizardProps {
  onAnalysisComplete: (project: ResearchProject) => void;
  onCancel: () => void;
}

export function NewResearchWizard({ onAnalysisComplete, onCancel }: NewResearchWizardProps) {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1 Form state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('scholarship-template');
  const [topic, setTopic] = useState('Scholarship Eligibility & Deadlines');
  const [researchQuestion, setResearchQuestion] = useState('What should I verify before applying for this scholarship?');
  const [objective, setObjective] = useState('Identify eligibility requirements, renewal conditions, required documents, current deadlines, and the official application process.');
  const [geographicScope, setGeographicScope] = useState('National / State Level');
  const [authority, setAuthority] = useState('Ministry of Higher Education');
  const [aspectInput, setAspectInput] = useState('');
  const [aspects, setAspects] = useState<string[]>([
    'Eligibility',
    'Income Conditions',
    'Scholarship Amount',
    'Required Documents',
    'Application Deadline',
    'Renewal Conditions',
    'Application Procedure',
    'Official Application Link'
  ]);

  // Step 2 Sources state
  const [sources, setSources] = useState<Source[]>([]);
  const [activeTab, setActiveTab] = useState<'url' | 'paste' | 'upload' | 'preset'>('url');

  // URL input state
  const [inputUrl, setInputUrl] = useState('');
  const [isExtractingUrl, setIsExtractingUrl] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [duplicateWarning, setDuplicateWarning] = useState<string | null>(null);

  // Paste input state
  const [pasteTitle, setPasteTitle] = useState('');
  const [pasteText, setPasteText] = useState('');
  const [pasteOrg, setPasteOrg] = useState('');
  const [pasteUrl, setPasteUrl] = useState('');
  const [pasteDate, setPasteDate] = useState('');

  // Step 4 Analysis state
  const [analysisStage, setAnalysisStage] = useState(1);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const stages = [
    'Collecting & Normalizing Sources',
    'Extracting Key Facts & Passages',
    'Identifying Sourced Claims',
    'Comparing Sources & Detecting Conflicts',
    'Detecting Information Gaps Against Criteria',
    'Auditing Source Dates & Cycle Freshness',
    'Compiling Prioritized Verification Checklist'
  ];

  // Apply template (Part 10)
  const applyTemplate = (templateId: string) => {
    const t = PRESET_TEMPLATES.find((item) => item.id === templateId);
    if (!t) return;
    setSelectedTemplateId(templateId);
    setTopic(t.title);
    setResearchQuestion(t.question);
    setObjective(t.objective);
    setGeographicScope(t.geographicScope || '');
    setAuthority(t.authorityOrOrganization || '');
    setAspects([...t.keyAspects]);
  };

  const handleAddAspect = () => {
    if (aspectInput.trim() && !aspects.includes(aspectInput.trim())) {
      setAspects([...aspects, aspectInput.trim()]);
      setAspectInput('');
    }
  };

  const handleRemoveAspect = (idx: number) => {
    setAspects(aspects.filter((_, i) => i !== idx));
  };

  // URL extraction handler with duplicate detection
  const handleExtractUrl = async () => {
    if (!inputUrl.trim()) return;
    setUrlError(null);
    setDuplicateWarning(null);

    // Duplicate check
    const dup = checkSourceDuplicate(sources, inputUrl.trim());
    if (dup.isDuplicate) {
      setDuplicateWarning(`Duplicate detected: "${dup.matchedSource?.title || inputUrl}" is already in your sources collection.`);
      return;
    }

    setIsExtractingUrl(true);

    try {
      const res = await fetch('/api/extract-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: inputUrl.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to extract website.');
      }

      const newSource: Source = {
        id: `src-${Date.now()}`,
        projectId: '',
        title: data.data.title || inputUrl,
        type: 'url',
        category: data.data.category || 'unknown',
        url: data.data.url,
        domain: data.data.domain,
        organization: data.data.organization,
        publicationDate: data.data.publicationDate,
        updatedDate: data.data.updatedDate,
        accessedAt: new Date().toISOString(),
        extractedText: data.data.extractedText,
        extractionStatus: 'success',
        extractionConfidence: data.data.extractionConfidence || 90,
      };

      setSources((prev) => [...prev, newSource]);
      setInputUrl('');
    } catch (err: any) {
      setUrlError(err.message || 'Error extracting URL.');
    } finally {
      setIsExtractingUrl(false);
    }
  };

  const handleAddFailedSource = (urlToRecord: string, reason: string) => {
    let domain = 'unknown';
    try {
      domain = new URL(urlToRecord).hostname;
    } catch {}
    const filename = urlToRecord.split('/').pop()?.replace(/\.pdf$/i, '') || urlToRecord;
    const failedSource: Source = {
      id: `src-fail-${Date.now()}`,
      projectId: '',
      title: decodeURIComponent(filename).replace(/[_-]+/g, ' ').trim() || urlToRecord,
      type: urlToRecord.toLowerCase().endsWith('.pdf') ? 'document' : 'url',
      category: classifySourceCategory(domain, ''),
      url: urlToRecord,
      domain,
      organization: domain.includes('gov.in') ? 'Government of India / Ministry of Education' : domain,
      accessedAt: new Date().toISOString(),
      extractedText: '',
      extractionStatus: 'failed',
      extractionConfidence: 0,
      notes: reason,
    };
    setSources((prev) => [...prev, failedSource]);
    setInputUrl('');
    setUrlError(null);
  };

  // Add pasted source with duplicate check
  const handleAddPastedSource = () => {
    if (!pasteTitle.trim() || !pasteText.trim()) return;
    setDuplicateWarning(null);

    const dup = checkSourceDuplicate(sources, pasteTitle.trim());
    if (dup.isDuplicate) {
      setDuplicateWarning(`Duplicate detected: A source named "${pasteTitle.trim()}" already exists in your collection.`);
      return;
    }

    const newSource: Source = {
      id: `src-paste-${Date.now()}`,
      projectId: '',
      title: pasteTitle.trim(),
      type: 'paste',
      category: classifySourceCategory(pasteUrl || '', pasteOrg),
      url: pasteUrl.trim() || undefined,
      organization: pasteOrg.trim() || 'User Provided Source',
      publicationDate: pasteDate.trim() || undefined,
      accessedAt: new Date().toISOString(),
      extractedText: pasteText.trim(),
      extractionStatus: 'success',
      extractionConfidence: 85,
      notes: 'Manually supplied text excerpt.',
    };

    setSources((prev) => [...prev, newSource]);
    setPasteTitle('');
    setPasteText('');
    setPasteOrg('');
    setPasteUrl('');
    setPasteDate('');
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        const newSource: Source = {
          id: `src-file-${Date.now()}-${Math.random().toString(36).substring(7)}`,
          projectId: '',
          title: file.name,
          type: 'document',
          category: 'institutional',
          organization: 'Uploaded Document',
          publicationDate: new Date(file.lastModified).toISOString().split('T')[0],
          accessedAt: new Date().toISOString(),
          extractedText: text.slice(0, 20000),
          extractionStatus: text.length > 0 ? 'success' : 'partial',
          extractionConfidence: 88,
          pageCount: 1,
        };
        setSources((prev) => [...prev, newSource]);
      };
      reader.readAsText(file);
    });
  };

  // Preload test source bundle
  const handlePreloadDemoSources = () => {
    const demoBundle: Source[] = [
      {
        id: `src-demo-1-${Date.now()}`,
        projectId: '',
        title: 'Official Higher Education Gazette Notification No. 441',
        type: 'url',
        category: 'official_government',
        url: 'https://scholarships.gov.in/notices/merit-scheme-2024.pdf',
        domain: 'scholarships.gov.in',
        organization: 'Ministry of Education & Human Resources',
        publicationDate: '2023-11-15',
        accessedAt: new Date().toISOString(),
        extractionStatus: 'success',
        extractionConfidence: 96,
        extractedText: `GOVERNMENT OF INDIA / STATE HIGHER EDUCATION COUNCIL
SCHEME CODE: NMS-2024
OBJECTIVE: Financial assistance to meritorious students from economically weaker sections.
BENEFIT: Direct Bank Transfer (DBT) of ₹50,000 per academic year.
ELIGIBILITY: Minimum 80th percentile in Higher Secondary Examination (10+2).
ANNUAL FAMILY INCOME LIMIT: Must not exceed ₹2,50,000 per annum. Self-affidavits are strictly NOT accepted.
APPLICATION DEADLINE: Last date for receipt of online application was December 15, 2023.`,
      },
      {
        id: `src-demo-2-${Date.now()}`,
        projectId: '',
        title: 'EduFinder Merit Scholarship 2026 Student Handbook',
        type: 'url',
        category: 'secondary_news',
        url: 'https://edufinder-portal.org/scholarships/merit-guide-2026',
        domain: 'edufinder-portal.org',
        organization: 'EduFinder Advisory',
        publicationDate: '2026-08-10',
        accessedAt: new Date().toISOString(),
        extractionStatus: 'success',
        extractionConfidence: 88,
        extractedText: `EduFinder Career & Scholarship Desk — Updated for 2026–2027 Cycle.
The National Merit Scholarship provides ₹50,000 annually.
ELIGIBILITY UPDATE: Candidates must score at least 75% marks in board examinations.
FAMILY INCOME CEILING: Recently revised to ₹3,50,000 per annum.
DOCUMENTATION: You may upload a notarized income declaration if official Revenue Inspector certificate is delayed.
DEADLINE: Online portal is reported open until November 30, 2026.`,
      },
    ];

    setSources((prev) => [...prev, ...demoBundle]);
  };

  const handleToggleInclude = (id: string) => {
    setSources(
      sources.map((s) => (s.id === id ? { ...s, isExcluded: !s.isExcluded } : s))
    );
  };

  const handleDeleteSource = (id: string) => {
    setSources(sources.filter((s) => s.id !== id));
  };

  // Launch analysis
  const handleStartAnalysis = async () => {
    setCurrentStep(4);
    setAnalysisError(null);
    setAnalysisStage(1);

    const stageInterval = setInterval(() => {
      setAnalysisStage((prev) => {
        if (prev < 6) return prev + 1;
        return prev;
      });
    }, 1100);

    try {
      const activeSources = sources.filter((s) => !s.isExcluded);
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: topic,
          researchQuestion,
          objective,
          geographicScope,
          authorityOrOrganization: authority,
          keyAspectsToInvestigate: aspects,
          sources: activeSources,
        }),
      });

      const data = await res.json();
      clearInterval(stageInterval);

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed to execute.');
      }

      setAnalysisStage(7);
      setTimeout(() => {
        onAnalysisComplete(data.project);
      }, 700);
    } catch (err: any) {
      clearInterval(stageInterval);
      setAnalysisError(err.message || 'Error occurred while performing multi-source analysis.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 text-slate-100 pb-16 animate-in fade-in">
      
      {/* Header & Steps */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">New Research Project</h1>
          <p className="text-xs text-slate-400">Configure research criteria, add disparate sources, and run AI gap detection</p>
        </div>
        <button
          onClick={onCancel}
          className="rounded-lg border border-slate-800 px-3 py-1.5 text-xs text-slate-400 hover:text-white"
        >
          Cancel
        </button>
      </div>

      {/* 4 Steps Indicator */}
      <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
        {[
          { num: 1, label: '1. Objective & Criteria' },
          { num: 2, label: '2. Add Sources' },
          { num: 3, label: '3. Review Collection' },
          { num: 4, label: '4. Analyze' },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border text-center transition-all ${
              currentStep === s.num
                ? 'bg-blue-600 text-white border-blue-500 shadow-md'
                : currentStep > s.num
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
                : 'bg-[#0e1422] border-slate-800 text-slate-500'
            }`}
          >
            <span>{s.label}</span>
          </div>
        ))}
      </div>

      {/* STEP 1: OBJECTIVE & TEMPLATES (Part 10) */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* 4 Starter Templates (Part 10 Requirement) */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Select a Starter Research Template (Part 10)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {PRESET_TEMPLATES.map((tmpl) => (
                <button
                  key={tmpl.id}
                  onClick={() => applyTemplate(tmpl.id)}
                  className={`p-3 rounded-xl border text-left text-xs transition-all space-y-1 ${
                    selectedTemplateId === tmpl.id
                      ? 'bg-blue-600/15 border-blue-500 text-blue-200'
                      : 'bg-[#090d16] border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-white">{tmpl.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{tmpl.category}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Research Project Title *
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#090d16] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Main Research Question *
              </label>
              <input
                type="text"
                value={researchQuestion}
                onChange={(e) => setResearchQuestion(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-[#090d16] px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Research Objective *
              </label>
              <textarea
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                rows={3}
                className="w-full rounded-xl border border-slate-700 bg-[#090d16] p-3 text-xs text-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Geographic Scope
                </label>
                <input
                  type="text"
                  value={geographicScope}
                  onChange={(e) => setGeographicScope(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#090d16] px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                  Governing Authority / Organization
                </label>
                <input
                  type="text"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-[#090d16] px-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            {/* Criteria to guide gap detection */}
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-300 mb-1.5">
                Predefined Criteria Guiding Gap Detection
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={aspectInput}
                  onChange={(e) => setAspectInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddAspect())}
                  placeholder="Add custom aspect..."
                  className="flex-1 rounded-xl border border-slate-700 bg-[#090d16] px-3 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddAspect}
                  className="rounded-xl bg-slate-800 hover:bg-slate-700 px-3.5 py-1.5 text-xs font-semibold text-white"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {aspects.map((aspect, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-blue-950 border border-blue-500/30 px-2.5 py-1 text-xs text-blue-300"
                  >
                    <span>{aspect}</span>
                    <button type="button" onClick={() => handleRemoveAspect(idx)} className="hover:text-red-400">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-3">
            <button
              onClick={() => setCurrentStep(2)}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-600/20"
            >
              <span>Next: Add Sources</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: ADD SOURCES (With Duplicate Detection) */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="flex border-b border-slate-800 gap-2">
            {[
              { id: 'url', label: 'Web URL Extraction', icon: Globe },
              { id: 'paste', label: 'Paste Text / Excerpt', icon: FileText },
              { id: 'upload', label: 'Upload Documents', icon: Upload },
              { id: 'preset', label: 'Preload Test Pair', icon: Sparkles },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-2.5 border-b-2 text-xs font-semibold transition-all ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-400 bg-blue-500/5'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {duplicateWarning && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/40 p-3 text-xs text-amber-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0 text-amber-400" />
                <span>{duplicateWarning}</span>
              </div>
              <button
                onClick={() => setDuplicateWarning(null)}
                className="text-amber-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 space-y-3">
              <div className="text-xs font-bold text-white">Extract from Webpage URL</div>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  placeholder="https://example.org/announcement.html"
                  className="flex-1 rounded-xl border border-slate-700 bg-[#090d16] px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                />
                <button
                  disabled={isExtractingUrl || !inputUrl.trim()}
                  onClick={handleExtractUrl}
                  className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-2 text-xs font-bold text-white flex items-center gap-1.5"
                >
                  {isExtractingUrl ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                  <span>{isExtractingUrl ? 'Extracting...' : 'Extract'}</span>
                </button>
              </div>

              {urlError && (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs">
                  <div className="text-rose-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-rose-400" />
                    <span>{urlError}</span>
                  </div>
                  {inputUrl && (
                    <button
                      type="button"
                      onClick={() => handleAddFailedSource(inputUrl, urlError)}
                      className="shrink-0 px-3 py-1 bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/50 rounded-lg text-rose-200 font-semibold"
                    >
                      Record as Extraction Failed
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'paste' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 space-y-3">
              <div className="text-xs font-bold text-white">Paste Document or Policy Excerpt</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={pasteTitle}
                  onChange={(e) => setPasteTitle(e.target.value)}
                  placeholder="Source Title *"
                  className="rounded-xl border border-slate-700 bg-[#090d16] px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={pasteOrg}
                  onChange={(e) => setPasteOrg(e.target.value)}
                  placeholder="Organization (e.g. State Department)"
                  className="rounded-xl border border-slate-700 bg-[#090d16] px-3 py-2 text-xs text-white"
                />
              </div>

              <textarea
                value={pasteText}
                onChange={(e) => setPasteText(e.target.value)}
                rows={4}
                placeholder="Paste verbatim rules, criteria, or notice text here..."
                className="w-full rounded-xl border border-slate-700 bg-[#090d16] p-3 text-xs text-white font-mono"
              />

              <button
                disabled={!pasteTitle.trim() || !pasteText.trim()}
                onClick={handleAddPastedSource}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white disabled:opacity-50"
              >
                + Add Pasted Excerpt
              </button>
            </div>
          )}

          {activeTab === 'upload' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-6 text-center space-y-3">
              <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 hover:border-blue-500 rounded-2xl p-6 bg-[#090d16] cursor-pointer">
                <Upload className="h-8 w-8 text-blue-400 mb-2" />
                <span className="text-xs font-bold text-white">Click to upload documents (.txt, .md, .json)</span>
                <input type="file" multiple accept=".txt,.md,.json" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          )}

          {activeTab === 'preset' && (
            <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-5 space-y-3">
              <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" />
                <span>Preload Tested Disparate Sources</span>
              </div>
              <p className="text-xs text-slate-400">
                Instantly injects an official Gazette notice (2023) and secondary advisory handbook (2026) to test conflict and gap detection.
              </p>
              <button
                onClick={handlePreloadDemoSources}
                className="rounded-xl bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 px-4 py-2 text-xs font-semibold text-amber-300"
              >
                + Inject Tested Sources
              </button>
            </div>
          )}

          {/* Sources counter */}
          <div className="rounded-xl border border-slate-800 bg-[#0e1422] p-4 flex items-center justify-between">
            <div className="text-xs font-semibold text-slate-300">
              {sources.length} Source{sources.length === 1 ? '' : 's'} in Collection
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCurrentStep(1)} className="text-xs text-slate-400 px-3 py-1.5">
                Back
              </button>
              <button
                disabled={sources.length === 0}
                onClick={() => setCurrentStep(3)}
                className="rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 px-4 py-1.5 text-xs font-bold text-white"
              >
                Review Sources ({sources.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW SOURCES */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white">Review Collected Sources</h2>
            <button onClick={() => setCurrentStep(2)} className="text-xs text-blue-400 hover:underline">
              + Add More
            </button>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-[#0e1422] divide-y divide-slate-800/80 overflow-hidden">
            {sources.map((src) => (
              <div key={src.id} className="p-4 flex items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <div className="font-bold text-white truncate">{src.title}</div>
                  <div className="text-[11px] text-slate-400">
                    Category: {src.category.replace('_', ' ')} • Date: {src.publicationDate || 'Undated'}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
                    <input
                      type="checkbox"
                      checked={!src.isExcluded}
                      onChange={() => handleToggleInclude(src.id)}
                      className="rounded border-slate-700 bg-slate-900"
                    />
                    <span>Include</span>
                  </label>

                  <button onClick={() => handleDeleteSource(src.id)} className="text-slate-500 hover:text-rose-400">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3">
            <button onClick={() => setCurrentStep(2)} className="text-xs text-slate-400 px-3 py-2">
              Back to Sources
            </button>

            <button
              onClick={handleStartAnalysis}
              className="flex items-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-500 px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-600/30"
            >
              <Sparkles className="h-4 w-4" />
              <span>Analyze Information Gaps</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: LIVE PROCESSING */}
      {currentStep === 4 && (
        <div className="rounded-2xl border border-slate-800 bg-[#0e1422] p-8 text-center space-y-6">
          <div className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-xl shadow-blue-500/20">
            <Loader2 className="h-7 w-7 text-white animate-spin" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-white">Analyzing Sources & Evaluating Gaps</h2>
            <p className="text-xs text-slate-400 mt-0.5">Cross-referencing {sources.length} sources against criteria</p>
          </div>

          <div className="max-w-md mx-auto text-left space-y-2">
            {stages.map((st, idx) => {
              const num = idx + 1;
              const isPast = analysisStage > num;
              const isCurrent = analysisStage === num;
              return (
                <div
                  key={idx}
                  className={`p-2 rounded-lg border text-xs flex items-center justify-between ${
                    isCurrent
                      ? 'bg-blue-950/40 border-blue-500 text-blue-200 font-semibold'
                      : isPast
                      ? 'bg-[#090d16] border-slate-800 text-emerald-400'
                      : 'border-transparent text-slate-500'
                  }`}
                >
                  <span>{st}</span>
                  {isPast ? <span>✓</span> : isCurrent ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                </div>
              );
            })}
          </div>

          {analysisError && (
            <div className="text-xs text-rose-400 p-3 bg-rose-950/30 rounded-xl border border-rose-500/30">
              {analysisError}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
