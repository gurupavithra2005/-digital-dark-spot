'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/AppShell';
import { DashboardView } from '@/components/DashboardView';
import { NewResearchWizard } from '@/components/NewResearchWizard';
import { ProjectWorkspace } from '@/components/ProjectWorkspace';
import { ProjectsListView } from '@/components/ProjectsListView';
import { SourceLibraryView } from '@/components/SourceLibraryView';
import { SettingsView } from '@/components/SettingsView';
import { LandingView } from '@/components/LandingView';
import { 
  getAllProjects, 
  saveProject, 
  deleteProject, 
  getActiveProjectId, 
  setActiveProjectId, 
  resetToDemo 
} from '@/lib/storage';
import { ResearchProject } from '@/types/research';
import { SAMPLE_SCHOLARSHIP_PROJECT } from '@/lib/sample-data';

export default function Home() {
  const [projects, setProjects] = useState<ResearchProject[]>(() => {
    return getAllProjects();
  });
  const [activeView, setActiveView] = useState<
    'landing' | 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace'
  >('dashboard');
  const [activeProjectId, setActiveId] = useState<string>(() => {
    const stored = getActiveProjectId();
    return stored || 'demo-scholarship-2026';
  });
  const [workspaceInitialTab, setWorkspaceInitialTab] = useState<string>('overview');
  const [workspaceInitialFindingId, setWorkspaceInitialFindingId] = useState<string | undefined>(undefined);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0] || null;

  // Navigation handler
  const handleNavigate = (view: 'landing' | 'dashboard' | 'new-research' | 'my-research' | 'sources' | 'settings' | 'workspace') => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open existing project (with optional target tab and findingId from alerts)
  const handleOpenProject = (id: string, tab: string = 'overview', findingId?: string) => {
    setActiveId(id);
    setActiveProjectId(id);
    setWorkspaceInitialTab(tab);
    setWorkspaceInitialFindingId(findingId);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset/Load Section 26 Demo
  const handleLoadDemo = () => {
    const demo = resetToDemo();
    setProjects(getAllProjects());
    setActiveId(demo.id);
    setActiveProjectId(demo.id);
    setWorkspaceInitialTab('overview');
    setWorkspaceInitialFindingId(undefined);
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save new research project
  const handleAnalysisComplete = (newProject: ResearchProject) => {
    saveProject(newProject);
    const updated = getAllProjects();
    setProjects(updated);
    setActiveId(newProject.id);
    setActiveProjectId(newProject.id);
    setWorkspaceInitialTab('overview');
    setActiveView('workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update existing project
  const handleUpdateProject = (updatedProject: ResearchProject) => {
    saveProject(updatedProject);
    setProjects((prev) => prev.map((p) => (p.id === updatedProject.id ? updatedProject : p)));
  };

  // Delete project
  const handleDeleteProject = (id: string) => {
    deleteProject(id);
    const remaining = getAllProjects();
    setProjects(remaining);
    if (activeProjectId === id) {
      if (remaining.length > 0) {
        setActiveId(remaining[0].id);
        setActiveProjectId(remaining[0].id);
      } else {
        setActiveView('dashboard');
      }
    }
  };

  // Bulk restore backup
  const handleImportProjects = (imported: ResearchProject[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_dark_spot_projects_v2', JSON.stringify(imported));
      setProjects(imported);
      if (imported.length > 0) {
        setActiveId(imported[0].id);
        setActiveProjectId(imported[0].id);
      }
    }
  };

  return (
    <AppShell
      activeView={activeView}
      onNavigate={handleNavigate}
      onLoadDemo={handleLoadDemo}
      hasActiveProject={!!activeProject}
      activeProjectTitle={activeProject?.title}
    >
      {activeView === 'landing' && (
        <LandingView
          onStartResearch={() => handleNavigate('new-research')}
          onExploreDemo={handleLoadDemo}
          onOpenDashboard={() => handleNavigate('dashboard')}
        />
      )}

      {activeView === 'dashboard' && (
        <DashboardView
          projects={projects}
          onOpenProject={handleOpenProject}
          onNewResearch={() => handleNavigate('new-research')}
          onViewAllProjects={() => handleNavigate('my-research')}
          onLoadDemo={handleLoadDemo}
          onNavigateToLanding={() => handleNavigate('landing')}
        />
      )}

      {activeView === 'new-research' && (
        <NewResearchWizard
          onAnalysisComplete={handleAnalysisComplete}
          onCancel={() => handleNavigate('dashboard')}
        />
      )}

      {activeView === 'workspace' && activeProject && (
        <ProjectWorkspace
          key={`${activeProject.id}-${workspaceInitialTab}-${workspaceInitialFindingId || ''}`}
          project={activeProject}
          initialTab={workspaceInitialTab}
          initialFindingId={workspaceInitialFindingId}
          onUpdateProject={handleUpdateProject}
          onBackToDashboard={() => handleNavigate('dashboard')}
        />
      )}

      {activeView === 'my-research' && (
        <ProjectsListView
          projects={projects}
          onOpenProject={handleOpenProject}
          onDeleteProject={handleDeleteProject}
          onNewResearch={() => handleNavigate('new-research')}
          onLoadDemo={handleLoadDemo}
        />
      )}

      {activeView === 'sources' && (
        <SourceLibraryView
          projects={projects}
          onOpenProject={handleOpenProject}
        />
      )}

      {activeView === 'settings' && (
        <SettingsView
          onResetDemo={handleLoadDemo}
          onImportProjects={handleImportProjects}
        />
      )}
    </AppShell>
  );
}
