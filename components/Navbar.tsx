'use client';

import React, { useState } from 'react';
import { 
  Compass, 
  PlusCircle, 
  FolderGit2, 
  Library, 
  Settings, 
  Sparkles, 
  Menu, 
  X,
  ShieldCheck,
  FileSearch,
  ExternalLink
} from 'lucide-react';

interface NavbarProps {
  activeView: 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace';
  onNavigate: (view: 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace') => void;
  onLoadDemo: () => void;
  hasActiveProject: boolean;
  activeProjectTitle?: string;
}

export function Navbar({ activeView, onNavigate, onLoadDemo, hasActiveProject, activeProjectTitle }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview Dashboard', icon: Compass },
    { id: 'new-research', label: 'New Research', icon: PlusCircle },
    { id: 'my-research', label: 'My Research', icon: FolderGit2 },
    { id: 'sources', label: 'Source Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0a0d14]/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-[4.5rem] py-2 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-2.5 text-left focus:outline-none group"
            aria-label="Digital Dark Spot Home"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-lg shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all">
              <FileSearch className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-400 border-2 border-[#0a0d14] animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold tracking-tight text-white text-base sm:text-lg group-hover:text-blue-400 transition-colors">
                  DIGITAL DARK SPOT
                </span>
                <span className="hidden sm:inline-flex rounded-full bg-blue-950/70 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-300">
                  HACKATHON 2026
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400 font-medium">
                Find What Information Is Missing. Verify What Matters.
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1.5" aria-label="Main Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          {hasActiveProject && (
            <button
              onClick={() => onNavigate('workspace')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                activeView === 'workspace'
                  ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-800/40 text-slate-300 border-slate-700/60 hover:bg-slate-800'
              }`}
              title={activeProjectTitle}
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Active Workspace</span>
            </button>
          )}
        </nav>

        {/* Right side quick actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 hover:border-amber-500/50 transition-all shadow-sm"
            title="Load Section 26 Hackathon Demonstration Scenario"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Load Demo Scenario</span>
          </button>

          <button
            onClick={() => onNavigate('new-research')}
            className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-blue-600/20 hover:shadow-blue-600/30 transition-all"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>New Research</span>
          </button>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-300"
            aria-label="Load Demo"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="text-[11px]">Demo</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0d121c] px-4 pt-2 pb-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                  isActive
                    ? 'bg-blue-600/20 text-blue-400 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            );
          })}

          {hasActiveProject && (
            <button
              onClick={() => {
                onNavigate('workspace');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-indigo-300 bg-indigo-950/40 border border-indigo-800/40"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-400" />
              <span>Open Active Workspace</span>
            </button>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                onNavigate('new-research');
                setMobileMenuOpen(false);
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Start New Research</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
