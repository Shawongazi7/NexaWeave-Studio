import { LandingPage } from "../LandingPage";
import { TemplateGallery } from "../TemplateGallery";
import { TemplatePreview } from "../TemplatePreview";
import { AdvancedSimpleTemplateEditor } from "../AdvancedSimpleTemplateEditor";
import { UserDashboard } from "../UserDashboard";
import { PublishedSiteViewer } from "../PublishedSiteViewer";
import type { Page, Template, UserProject } from "../../types/app";

interface AppPageRendererProps {
  currentPage: Page;
  isAuthenticated: boolean;
  selectedTemplate: Template | null;
  templates: Template[];
  editingProject: UserProject | null;
  userProjects: UserProject[];
  publishedProjectId: string;
  onNavigate: (page: Page) => void;
  onGoToDashboard: () => void;
  onSelectTemplate: (template: Template) => void;
  onUseTemplate: (template: Template) => void;
  onSaveProject: (project: UserProject) => void;
  onPublishProject: (project: UserProject) => void;
  onDeleteProject: (projectId: string) => void;
  onEditProject: (project: UserProject) => void;
  onNavigateToPublished: (projectId: string) => void;
}

export function AppPageRenderer({
  currentPage,
  isAuthenticated,
  selectedTemplate,
  templates,
  editingProject,
  userProjects,
  publishedProjectId,
  onNavigate,
  onGoToDashboard,
  onSelectTemplate,
  onUseTemplate,
  onSaveProject,
  onPublishProject,
  onDeleteProject,
  onEditProject,
  onNavigateToPublished,
}: AppPageRendererProps) {
  switch (currentPage) {
    case "landing":
      return <LandingPage onNavigate={onNavigate} onGoToDashboard={onGoToDashboard} />;
    case "gallery":
      return (
        <TemplateGallery
          templates={templates}
          onSelectTemplate={onSelectTemplate}
          onNavigate={onNavigate}
        />
      );
    case "preview":
      return selectedTemplate ? (
        <TemplatePreview
          template={selectedTemplate}
          onUseTemplate={onUseTemplate}
          onNavigate={onNavigate}
        />
      ) : null;
    case "editor":
      if (!isAuthenticated || !editingProject) {
        return null;
      }

      return (
        <AdvancedSimpleTemplateEditor
          project={editingProject}
          onSave={onSaveProject}
          onPublish={onPublishProject}
          onNavigate={onNavigate}
        />
      );
    case "dashboard":
      return (
        <UserDashboard
          projects={userProjects}
          onEditProject={onEditProject}
          onDeleteProject={onDeleteProject}
          onViewPublished={onNavigateToPublished}
          onNavigate={onNavigate}
        />
      );
    case "published":
      return (
        <PublishedSiteViewer
          projectId={publishedProjectId}
          onNavigate={onNavigate}
          projects={userProjects}
        />
      );
    default:
      return null;
  }
}
