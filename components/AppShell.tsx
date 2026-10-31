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
  FileSearch, 
  ChevronLeft, 
  ChevronRight,
  ShieldCheck,
  FolderOpen
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
  activeView: 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace';
  onNavigate: (view: 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace') => void;
  onLoadDemo: () => void;
  hasActiveProject: boolean;
  activeProjectTitle?: string;
}

export function AppShell({
  children,
  activeView,
  onNavigate,
  onLoadDemo,
  hasActiveProject,
  activeProjectTitle,
}: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: Compass },
    { id: 'new-research', label: 'New Research', icon: PlusCircle },
    { id: 'my-research', label: 'My Research', icon: FolderGit2 },
    { id: 'sources', label: 'Source Library', icon: Library },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Research Intelligence Workspace';
      case 'new-research':
        return 'New Research Project';
      case 'my-research':
        return 'My Research Projects';
      case 'sources':
        return 'Global Source Library';
      case 'settings':
        return 'Settings & Architecture';
      case 'workspace':
        return activeProjectTitle || 'Research Workspace';
      default:
        return 'Digital Dark Spot';
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d14] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-blue-600 selection:text-white">
      
      {/* DESKTOP SIDEBAR */}
      <aside
        className={`hidden md:flex flex-col border-r border-slate-800/80 bg-[#0d121c] transition-all duration-300 z-30 sticky top-0 h-screen ${
          sidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800/80">
          <button
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 text-left focus:outline-none overflow-hidden group"
            aria-label="Digital Dark Spot Home"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 shadow-md shadow-blue-500/20 group-hover:scale-105 transition-all">
              <FileSearch className="h-5 w-5 text-white" />
              <div className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 border border-[#0d121c] animate-pulse" />
            </div>

            {!sidebarCollapsed && (
              <div className="truncate">
                <div className="font-extrabold text-white text-sm tracking-tight group-hover:text-blue-400 transition-colors">
                  DIGITAL DARK SPOT
                </div>
                <div className="text-[10px] text-slate-400 truncate">
                  AI Gap Detection
                </div>
              </div>
            )}
          </button>

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="rounded-lg p-1 text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5" aria-label="Sidebar Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={sidebarCollapsed ? item.label : undefined}
                className={`flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!sidebarCollapsed && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}

          {/* Active Workspace Link */}
          {hasActiveProject && (
            <div className="pt-3">
              <div className={`px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500 ${sidebarCollapsed ? 'hidden' : 'block'}`}>
                Active Workspace
              </div>
              <button
                onClick={() => onNavigate('workspace')}
                title={activeProjectTitle}
                className={`flex w-full items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all ${
                  activeView === 'workspace'
                    ? 'bg-indigo-950/60 border-indigo-500/50 text-indigo-300 font-semibold'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                {!sidebarCollapsed && <span className="truncate">{activeProjectTitle || 'Current Project'}</span>}
              </button>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          <button
            onClick={onLoadDemo}
            title="Load Section 26 Scholarship Demonstration Scenario"
            className={`flex w-full items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-2 text-xs font-medium text-amber-300 transition-colors ${
              sidebarCollapsed ? 'justify-center' : ''
            }`}
          >
            <Sparkles className="h-4 w-4 text-amber-400 shrink-0" />
            {!sidebarCollapsed && <span className="truncate">Load Demo Scenario</span>}
          </button>
        </div>
      </aside>

      {/* MOBILE TOP BAR */}
      <div className="md:hidden sticky top-0 z-40 flex h-14 items-center justify-between border-b border-slate-800 bg-[#0d121c]/95 px-4 backdrop-blur-md">
        <button
          onClick={() => onNavigate('dashboard')}
          className="flex items-center gap-2 text-left"
          aria-label="Home"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <FileSearch className="h-4 w-4" />
          </div>
          <span className="font-extrabold text-sm text-white">DIGITAL DARK SPOT</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="flex items-center gap-1 rounded-lg border border-amber-500/30 bg-amber-500/10 px-2 py-1 text-[11px] font-medium text-amber-300"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>Demo</span>
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="rounded-lg p-1.5 text-slate-400 hover:text-white hover:bg-slate-800"
            aria-label="Toggle navigation drawer"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-72 bg-[#0d121c] border-r border-slate-800 p-5 flex flex-col justify-between animate-in slide-in-from-left duration-200">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileSearch className="h-5 w-5 text-blue-400" />
                  <span className="font-bold text-sm text-white">DIGITAL DARK SPOT</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-1">
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
                      className={`flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white'
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
                    className="flex w-full items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold text-indigo-300 bg-indigo-950/40 border border-indigo-800/40 mt-2"
                  >
                    <FolderOpen className="h-4 w-4 text-emerald-400" />
                    <span>Active Workspace</span>
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  onLoadDemo();
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500/10 border border-amber-500/30 py-2.5 text-xs font-semibold text-amber-300"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Load Demo Scenario</span>
              </button>

              <button
                onClick={() => {
                  onNavigate('new-research');
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                <span>Start New Research</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* DESKTOP TOP HEADER (Clean & Minimal) */}
        <header className="hidden md:flex h-14 border-b border-slate-800/80 bg-[#0a0d14]/80 backdrop-blur-md px-6 items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <h1 className="text-sm font-bold text-slate-100 tracking-tight">
              {getPageTitle()}
            </h1>
            <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
            <span className="text-[11px] text-slate-400">
              Find What Information Is Missing. Verify What Matters.
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 rounded-full bg-blue-950/60 border border-blue-500/30 px-3 py-1 text-[11px] font-medium text-blue-300">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              <span>Grounded Evidence Engine</span>
            </div>

            {activeView !== 'new-research' && (
              <button
                onClick={() => onNavigate('new-research')}
                className="flex items-center gap-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm shadow-blue-600/20 transition-all"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                <span>+ New Research</span>
              </button>
            )}
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
