import { Toaster } from "sonner";
import { AuthDialog } from "./components/auth/AuthDialog";
import { AppErrorBoundary } from "./components/app/AppErrorBoundary";
import { AppPageRenderer } from "./components/app/AppPageRenderer";
import { useAppController } from "./hooks/useAppController";

function AppContent() {
  const {
    isAuthenticated,
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
  } = useAppController();

  return (
    <div className="min-h-screen bg-background relative">
      <AppPageRenderer
        currentPage={currentPage}
        isAuthenticated={isAuthenticated}
        selectedTemplate={selectedTemplate}
        templates={templates}
        editingProject={editingProject}
        userProjects={userProjects}
        publishedProjectId={publishedProjectId}
        onNavigate={handleNavigate}
        onGoToDashboard={handleGoToDashboard}
        onSelectTemplate={handleSelectTemplate}
        onUseTemplate={handleUseTemplate}
        onSaveProject={handleSaveProject}
        onPublishProject={handlePublishProject}
        onDeleteProject={handleDeleteProject}
        onEditProject={handleEditProject}
        onNavigateToPublished={handleNavigateToPublished}
      />

      <AuthDialog
        open={showAuth && !isAuthenticated}
        onOpenChange={(open) => {
          if (!open) {
            setShowAuth(false);
          }
        }}
        onSuccess={handleAuthSuccess}
      />

      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppErrorBoundary>
      <AppContent />
    </AppErrorBoundary>
  );
}
