import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  apiGetProjects,
  apiCreateProject,
  apiDeleteProject,
  apiUpdateProject,
  type ApiProject,
} from "../lib/authClient";
import { useAuth } from "../contexts/AuthContext";
import { defaultTemplates } from "../data/defaultTemplates";
import type { Page, Template, UserProject } from "../types/app";

function cloneTemplateContent(template: Template): UserProject["content"] {
  return JSON.parse(JSON.stringify(template.content));
}

function makeTempProjectFromTemplate(template: Template): UserProject {
  return {
    id: `temp-${Date.now()}`,
    name: `My ${template.title}`,
    templateId: template.id,
    content: cloneTemplateContent(template),
    lastModified: new Date().toISOString(),
    isPublished: false,
  };
}

function toUserProject(apiProject: ApiProject): UserProject {
  let templateId = "1";
  if (apiProject.description) {
    const match = apiProject.description.match(/templateId\s*[:=]\s*(\w+)/i);
    if (match && match[1]) {
      templateId = match[1];
    }
  }

  return {
    id: apiProject.id,
    name: apiProject.title,
    templateId,
    content: JSON.parse(apiProject.content),
    lastModified: apiProject.updatedAt,
    isPublished: apiProject.published || false,
    publishUrl: apiProject.publishedUrl,
  };
}

export function useAppController() {
  const { isAuthenticated, user } = useAuth();

  const [showAuth, setShowAuth] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [editingProject, setEditingProject] = useState<UserProject | null>(null);
  const [userProjects, setUserProjects] = useState<UserProject[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [publishedProjectId, setPublishedProjectId] = useState<string>("");
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  useEffect(() => {
    setTemplates(defaultTemplates);
  }, []);

  const loadProjects = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      return;
    }

    setIsLoadingProjects(true);
    try {
      const data = await apiGetProjects(token);
      if (data && data.projects) {
        setUserProjects(data.projects.map(toUserProject));
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to load projects:", error);
      toast.error("Failed to load your projects");
    } finally {
      setIsLoadingProjects(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadProjects();
      return;
    }

    setUserProjects([]);
  }, [isAuthenticated, user]);

  const handleNavigate = (page: Page) => {
    const protectedPages: Page[] = ["editor", "dashboard"];
    if (protectedPages.includes(page) && !isAuthenticated) {
      setShowAuth(true);
      return;
    }

    setCurrentPage(page);
  };

  const handleNavigateToPublished = (projectId: string) => {
    setPublishedProjectId(projectId);
    setCurrentPage("published");
  };

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template);
    setCurrentPage("preview");
  };

  const handleUseTemplate = (template: Template) => {
    if (!isAuthenticated) {
      setPendingTemplate(template);
      setShowAuth(true);
      return;
    }

    setEditingProject(makeTempProjectFromTemplate(template));
    setCurrentPage("editor");
    toast.success("Project template loaded! Save to persist your changes.");
  };

  const handleSaveProject = async (project: UserProject) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to save your project");
      return;
    }

    let effectiveProject = project;
    if (
      project.id.startsWith("temp-") &&
      editingProject &&
      !editingProject.id.startsWith("temp-")
    ) {
      effectiveProject = { ...project, id: editingProject.id };
    }

    const updatedProject = {
      ...effectiveProject,
      lastModified: new Date().toISOString(),
    };

    try {
      const isTemporaryProject = updatedProject.id.startsWith("temp-");
      if (isTemporaryProject) {
        const createContent =
          updatedProject.content !== undefined
            ? updatedProject.content
            : editingProject?.content !== undefined
              ? editingProject.content
              : { pages: [] };

        const { project: apiProject } = await apiCreateProject(
          token,
          (updatedProject.name && updatedProject.name.trim()) || "Untitled Project",
          `templateId=${updatedProject.templateId}`,
          createContent,
        );

        const newUserProject = toUserProject(apiProject);
        setUserProjects((prev) => [...prev, newUserProject]);
        setEditingProject(newUserProject);
        toast.success("Project created and saved successfully!");
        return;
      }

      const updates: any = {
        title: updatedProject.name,
        description: `templateId=${updatedProject.templateId}`,
        published: updatedProject.isPublished,
        publishedUrl: updatedProject.publishUrl,
      };
      if (updatedProject.content !== undefined) {
        updates.content = updatedProject.content;
      }

      const { project: apiProject } = await apiUpdateProject(
        token,
        updatedProject.id,
        updates,
      );

      const updatedUserProject = toUserProject(apiProject);
      setUserProjects((prev) => {
        const index = prev.findIndex((p) => p.id === updatedProject.id);
        if (index < 0) {
          return [...prev, updatedUserProject];
        }

        const next = [...prev];
        next[index] = updatedUserProject;
        return next;
      });
      setEditingProject(updatedUserProject);
      toast.success("Project updated successfully!");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to save project:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : error && typeof error === "object" && "message" in error
              ? String(error.message)
              : "Unknown error occurred";

      toast.error(`Failed to save project: ${errorMessage}`);

      if (!project.id.startsWith("temp-")) {
        setUserProjects((prev) => {
          const index = prev.findIndex((p) => p.id === project.id);
          if (index < 0) {
            return prev;
          }
          const next = [...prev];
          next[index] = updatedProject;
          return next;
        });
        setEditingProject(updatedProject);
      }
    }
  };

  const handlePublishProject = async (project: UserProject) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to publish your project");
      return;
    }

    if (project.id.startsWith("temp-")) {
      toast.error("Please save your project first before publishing");
      return;
    }

    const publishUrl = `https://mysite-${project.id}.nexaweave.site`;

    try {
      const { project: apiProject } = await apiUpdateProject(token, project.id, {
        description: `templateId=${project.templateId}`,
        published: true,
        publishedUrl: publishUrl,
      });

      const publishedUserProject = toUserProject(apiProject);
      setUserProjects((prev) => {
        const index = prev.findIndex((p) => p.id === project.id);
        if (index < 0) {
          return prev;
        }
        const next = [...prev];
        next[index] = publishedUserProject;
        return next;
      });
      setEditingProject(publishedUserProject);
      toast.success("Project published successfully!");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to publish project:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      toast.error(`Failed to publish project: ${errorMessage}`);

      const fallbackProject = {
        ...project,
        isPublished: true,
        publishUrl,
        lastModified: new Date().toISOString(),
      };
      setUserProjects((prev) => {
        const index = prev.findIndex((p) => p.id === project.id);
        if (index < 0) {
          return prev;
        }
        const next = [...prev];
        next[index] = fallbackProject;
        return next;
      });
      setEditingProject(fallbackProject);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      toast.error("Please log in to delete projects");
      return;
    }

    try {
      await apiDeleteProject(token, projectId);
      setUserProjects((prev) => prev.filter((p) => p.id !== projectId));
      toast.success("Project deleted successfully!");
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Failed to delete project:", error);
      toast.error("Failed to delete project");
      setUserProjects((prev) => prev.filter((p) => p.id !== projectId));
    }
  };

  const handleEditProject = (project: UserProject) => {
    setEditingProject(project);
    setCurrentPage("editor");
  };

  const handleGoToDashboard = () => {
    setCurrentPage("dashboard");
  };

  const handleAuthSuccess = () => {
    setShowAuth(false);
    if (!pendingTemplate) {
      return;
    }

    const template = pendingTemplate;
    setPendingTemplate(null);
    setEditingProject(makeTempProjectFromTemplate(template));
    setCurrentPage("editor");
    toast.success("Project template loaded! Save to persist your changes.");
  };

  return {
    isAuthenticated,
    isLoadingProjects,
    showAuth,
    setShowAuth,
    currentPage,
    selectedTemplate,
    editingProject,
    userProjects,
    templates,
    publishedProjectId,
    handleNavigate,
    handleNavigateToPublished,
    handleSelectTemplate,
    handleUseTemplate,
    handleSaveProject,
    handlePublishProject,
    handleDeleteProject,
    handleEditProject,
    handleGoToDashboard,
    handleAuthSuccess,
  };
}
