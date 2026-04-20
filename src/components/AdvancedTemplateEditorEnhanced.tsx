import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Save, 
  Eye, 
  Settings, 
  Type, 
  Image as ImageIcon, 
  Palette,
  Globe,
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  FileText,
  Users,
  Star,
  MapPin,
  Layers,
  Plus,
  Copy,
  Trash2,
  RotateCcw,
  Redo,
  GripVertical,
  Edit3,
  AlertTriangle,
  ExternalLink,
  History,
  Clock,
  Target,
  BarChart3,
  Search,
  Database,
  Rocket
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';
import { MediaManager } from './MediaManager';
import { SectionLibrary } from './SectionLibrary';
import { GlobalStylePanel } from './GlobalStylePanel';
import { SEOPanel } from './SEOPanel';
import { VersionControl } from './VersionControl';
import { ContentCollections } from './ContentCollections';
import { PublishingPanel } from './PublishingPanel';

interface UserProject {
  id: string;
  name: string;
  templateId: string;
  content: {
    pages: Array<{
      id: string;
      name: string;
      path: string;
      sections: Array<{
        id: string;
        type: 'hero' | 'about' | 'services' | 'contact' | 'footer' | 'gallery' | 'testimonials' | 'team' | 'pricing' | 'features' | 'blog' | 'portfolio' | 'menu' | 'locations' | 'faq' | 'navigation';
        content: any;
        styles?: any;
        visibility?: {
          desktop: boolean;
          tablet: boolean;
          mobile: boolean;
        };
      }>;
      seo?: {
        title: string;
        description: string;
        keywords: string;
        slug: string;
        ogTitle?: string;
        ogDescription?: string;
        ogImage?: string;
      };
    }>;
    globalStyles?: {
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
        border: string;
        success: string;
        warning: string;
        error: string;
      };
      fonts: {
        heading: string;
        body: string;
        mono: string;
      };
      spacing: {
        scale: number;
        containerWidth: string;
        sectionPadding: string;
      };
      borderRadius: {
        sm: string;
        md: string;
        lg: string;
        xl: string;
      };
      shadows: {
        sm: string;
        md: string;
        lg: string;
      };
      theme: 'light' | 'dark' | 'auto';
      animations: {
        duration: 'slow' | 'normal' | 'fast';
        easing: string;
      };
    };
    collections?: Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
      fields: Array<{
        id: string;
        name: string;
        type: string;
        label: string;
        required?: boolean;
      }>;
      items: Array<{
        id: string;
        data: Record<string, any>;
        status: 'draft' | 'published';
        createdAt: string;
        updatedAt: string;
      }>;
    }>;
  };
  versions?: Array<{
    id: string;
    timestamp: string;
    content: any;
    description: string;
    author?: string;
    tags?: string[];
    isAutoSave?: boolean;
  }>;
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
  publishingSettings?: {
    customDomain?: string;
    subdomain?: string;
    password?: string;
    seoOptimized: boolean;
    responsive: boolean;
    favicon?: string;
    analytics?: {
      googleAnalytics?: string;
      facebookPixel?: string;
      customTracking?: string;
    };
    performance: {
      imageOptimization: boolean;
      caching: boolean;
      compression: boolean;
      lazyLoading: boolean;
    };
    security: {
      httpsRedirect: boolean;
      passwordProtection: boolean;
      comingSoonMode: boolean;
    };
  };
}

interface AdvancedTemplateEditorProps {
  project: UserProject;
  onSave: (project: UserProject) => void;
  onPublish: (project: UserProject) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

export function AdvancedTemplateEditor({ project, onSave, onPublish, onNavigate }: AdvancedTemplateEditorProps) {
  const [currentProject, setCurrentProject] = useState<UserProject>(project);
  const [currentPageId, setCurrentPageId] = useState(project.content.pages[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, field: string} | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'content' | 'design' | 'pages' | 'seo' | 'collections' | 'versions' | 'publish'>('content');
  const [editingText, setEditingText] = useState<string | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [performanceScore, setPerformanceScore] = useState(85);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [deploymentStatus, setDeploymentStatus] = useState({
    status: 'idle' as 'idle' | 'building' | 'deploying' | 'success' | 'error',
    progress: 0,
    message: '',
    url: undefined as string | undefined,
    timestamp: undefined as string | undefined,
    buildTime: undefined as number | undefined
  });

  const autosaveTimeout = useRef<NodeJS.Timeout>();

  const currentPage = useMemo(() => {
    return currentProject.content.pages.find(page => page.id === currentPageId);
  }, [currentProject.content.pages, currentPageId]);

  const globalStyles = useMemo(() => {
    return {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        accent: '#f59e0b',
        background: '#ffffff',
        surface: '#f8fafc',
        text: '#1f2937',
        textSecondary: '#6b7280',
        border: '#e5e7eb',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
      },
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'Monaco'
      },
      spacing: {
        scale: 1,
        containerWidth: '1200px',
        sectionPadding: '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      },
      theme: 'light' as const,
      animations: {
        duration: 'normal' as const,
        easing: 'ease-in-out'
      },
      ...currentProject.content.globalStyles
    };
  }, [currentProject.content.globalStyles]);

  const publishingSettings = useMemo(() => {
    return {
      seoOptimized: true,
      responsive: true,
      performance: {
        imageOptimization: true,
        caching: true,
        compression: true,
        lazyLoading: true
      },
      security: {
        httpsRedirect: true,
        passwordProtection: false,
        comingSoonMode: false
      },
      ...currentProject.publishingSettings
    };
  }, [currentProject.publishingSettings]);

  // Auto-save functionality
  useEffect(() => {
    if (hasUnsavedChanges) {
      if (autosaveTimeout.current) {
        clearTimeout(autosaveTimeout.current);
      }
      autosaveTimeout.current = setTimeout(() => {
        handleAutoSave();
      }, 2000);
    }
    return () => {
      if (autosaveTimeout.current) {
        clearTimeout(autosaveTimeout.current);
      }
    };
  }, [hasUnsavedChanges]);

  // Validation and performance tracking
  useEffect(() => {
    const errors: string[] = [];
    
    if (!currentPage?.seo?.title) {
      errors.push('Missing page title for SEO');
    }
    
    if (!currentPage?.seo?.description) {
      errors.push('Missing meta description for SEO');
    }

    currentPage?.sections.forEach(section => {
      if (section.type === 'hero' && !section.content.title) {
        errors.push('Hero section missing title');
      }
      if (section.type === 'hero' && section.content.backgroundImage && !section.content.backgroundImageAlt) {
        errors.push('Hero background image missing alt text');
      }
    });

    setValidationErrors(errors);
    
    // Calculate performance score
    let score = 100;
    if (errors.length > 0) score -= errors.length * 5;
    if (!currentProject.content.globalStyles) score -= 10;
    setPerformanceScore(Math.max(score, 0));
  }, [currentProject.content, currentPage]);

  const handleAutoSave = () => {
    console.log('Auto-saving...');
    setHasUnsavedChanges(false);
  };

  const handleSave = () => {
    const updatedProject = {
      ...currentProject,
      lastModified: new Date().toISOString()
    };
    
    const version = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: JSON.parse(JSON.stringify(currentProject.content)),
      description: 'Manual save',
      author: 'Current User'
    };
    
    updatedProject.versions = [...(updatedProject.versions || []), version];
    
    setCurrentProject(updatedProject);
    onSave(updatedProject);
    setHasUnsavedChanges(false);
  };

  const handlePublish = () => {
    setDeploymentStatus({
      status: 'building',
      progress: 0,
      message: 'Preparing deployment...'
    });

    // Simulate deployment process
    setTimeout(() => {
      setDeploymentStatus({
        status: 'deploying',
        progress: 50,
        message: 'Deploying to CDN...'
      });
    }, 1000);

    setTimeout(() => {
      const publishUrl = `https://${publishingSettings.subdomain || 'my-site'}.webbuilder.app`;
      setDeploymentStatus({
        status: 'success',
        progress: 100,
        message: 'Deployment successful!',
        url: publishUrl,
        timestamp: new Date().toISOString(),
        buildTime: 3.2
      });

      const publishedProject = {
        ...currentProject,
        isPublished: true,
        publishUrl,
        lastModified: new Date().toISOString()
      };
      setCurrentProject(publishedProject);
      onPublish(publishedProject);
    }, 2000);
  };

  const saveToUndoStack = () => {
    setUndoStack(prev => [...prev.slice(-19), JSON.parse(JSON.stringify(currentProject.content))]);
    setRedoStack([]);
  };

  const updateProjectContent = (updater: (content: any) => any) => {
    saveToUndoStack();
    setCurrentProject(prev => ({
      ...prev,
      content: updater(prev.content)
    }));
    setHasUnsavedChanges(true);
  };

  const updateSectionContent = (sectionId: string, newContent: any) => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page => ({
        ...page,
        sections: page.sections.map(section =>
          section.id === sectionId
            ? { ...section, content: { ...section.content, ...newContent } }
            : section
        )
      }))
    }));
  };

  const updateGlobalStyles = (newStyles: any) => {
    updateProjectContent(content => ({
      ...content,
      globalStyles: {
        ...globalStyles,
        ...newStyles
      }
    }));
  };

  const updatePageSEO = (pageId: string, seo: any) => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page =>
        page.id === pageId
          ? { ...page, seo: { ...page.seo, ...seo } }
          : page
      )
    }));
  };

  const updatePublishingSettings = (settings: any) => {
    setCurrentProject(prev => ({
      ...prev,
      publishingSettings: {
        ...publishingSettings,
        ...settings
      }
    }));
    setHasUnsavedChanges(true);
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(currentProject.content))]);
      setUndoStack(prev => prev.slice(0, -1));
      setCurrentProject(prev => ({
        ...prev,
        content: previousState
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[redoStack.length - 1];
      setUndoStack(prev => [...prev, JSON.parse(JSON.stringify(currentProject.content))]);
      setRedoStack(prev => prev.slice(0, -1));
      setCurrentProject(prev => ({
        ...prev,
        content: nextState
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleSaveVersion = (description: string, tags?: string[]) => {
    const version = {
      id: `v-${Date.now()}`,
      timestamp: new Date().toISOString(),
      content: JSON.parse(JSON.stringify(currentProject.content)),
      description,
      author: 'Current User',
      tags
    };
    
    setCurrentProject(prev => ({
      ...prev,
      versions: [...(prev.versions || []), version]
    }));
    setHasUnsavedChanges(false);
  };

  const handleRestoreVersion = (versionId: string) => {
    const version = currentProject.versions?.find(v => v.id === versionId);
    if (version) {
      saveToUndoStack();
      setCurrentProject(prev => ({
        ...prev,
        content: version.content
      }));
      setHasUnsavedChanges(true);
    }
  };

  const handleMediaSelect = (media: any) => {
    if (currentImageField) {
      updateSectionContent(currentImageField.sectionId, { 
        [currentImageField.field]: media.url 
      });
      setCurrentImageField(null);
    }
  };

  const handleImageUpload = (sectionId: string, field: string) => {
    setCurrentImageField({ sectionId, field });
    setIsMediaManagerOpen(true);
  };

  const addSection = (sectionType: string, content?: any) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: sectionType as any,
      content: content || getDefaultSectionContent(sectionType),
      visibility: { desktop: true, tablet: true, mobile: true }
    };
    
    updateProjectContent(projectContent => {
      const pageIndex = projectContent.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return projectContent;
      
      const sections = [...projectContent.pages[pageIndex].sections];
      sections.push(newSection);
      
      const newPages = [...projectContent.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };
      
      return { ...projectContent, pages: newPages };
    });
    
    setShowSectionLibrary(false);
  };

  const getDefaultSectionContent = (sectionType: string) => {
    const defaults: { [key: string]: any } = {
      navigation: {
        logo: 'Brand Logo',
        menuItems: ['Home', 'About', 'Services', 'Contact']
      },
      hero: {
        title: 'Your Hero Title',
        subtitle: 'Your compelling subtitle goes here',
        buttonText: 'Call to Action',
        backgroundImage: '',
        backgroundImageAlt: ''
      },
      about: {
        title: 'About Us',
        description: 'Tell your story here',
        image: '',
        imageAlt: '',
        stats: []
      },
      services: {
        title: 'Our Services',
        description: 'What we offer',
        services: [
          {
            name: 'Service 1',
            description: 'Service description',
            price: 'From $100',
            image: ''
          }
        ]
      },
      features: {
        title: 'Features',
        description: 'Why choose us',
        features: [
          {
            icon: '⚡',
            title: 'Feature 1',
            description: 'Feature description'
          }
        ]
      },
      team: {
        title: 'Our Team',
        description: 'Meet the team',
        members: [
          {
            name: 'Team Member',
            role: 'Position',
            image: '',
            bio: 'Member bio'
          }
        ]
      },
      contact: {
        title: 'Contact Us',
        description: 'Get in touch',
        email: 'contact@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Main St\nCity, State 12345',
        hours: 'Mon-Fri: 9AM-5PM'
      },
      footer: {
        companyName: 'Company Name',
        description: 'Company description',
        links: ['Privacy Policy', 'Terms of Service', 'Contact'],
        socialLinks: []
      }
    };
    
    return defaults[sectionType] || {};
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  const renderSidebarContent = () => {
    switch (sidebarTab) {
      case 'content':
        return (
          <div className="space-y-6">
            <Button 
              onClick={() => setShowSectionLibrary(true)}
              className="w-full"
              variant="outline"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Layers className="h-5 w-5 mr-2" />
                Page Sections
              </h3>
              <p className="text-sm text-muted-foreground">
                Manage sections for the current page
              </p>
            </div>
          </div>
        );

      case 'design':
        return (
          <GlobalStylePanel
            styles={globalStyles}
            onUpdateStyles={updateGlobalStyles}
            onPreviewTheme={(theme) => console.log('Preview theme:', theme)}
            onExportTheme={() => console.log('Export theme')}
            onImportTheme={(theme) => updateGlobalStyles(theme)}
          />
        );

      case 'pages':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Pages</h3>
              <Button size="sm" onClick={() => {}}>
                <Plus className="h-4 w-4 mr-1" />
                Add Page
              </Button>
            </div>
            <div className="space-y-2">
              {currentProject.content.pages.map(page => (
                <div
                  key={page.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    currentPageId === page.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                  }`}
                  onClick={() => setCurrentPageId(page.id)}
                >
                  <h4 className="font-medium">{page.name}</h4>
                  <p className="text-sm text-muted-foreground">{page.path}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {page.sections?.length || 0} sections
                  </p>
                </div>
              ))}
            </div>
          </div>
        );

      case 'seo':
        return (
          <SEOPanel
            pages={currentProject.content.pages}
            currentPageId={currentPageId}
            onUpdatePageSEO={updatePageSEO}
            onGenerateMetaTags={(pageId) => console.log('Generate meta tags for:', pageId)}
            onPreviewSEO={(pageId) => console.log('Preview SEO for:', pageId)}
            onExportSitemap={() => console.log('Export sitemap')}
          />
        );

      case 'collections':
        return (
          <ContentCollections
            collections={currentProject.content.collections?.map(c => ({
              id: c.id,
              name: c.name,
              slug: c.slug,
              description: c.description,
              fields: c.fields,
              icon: '📝',
              color: '#3b82f6',
              settings: {
                enableDrafts: true,
                enableCategories: true,
                enableTags: true,
                enableComments: false,
                sortField: 'updatedAt',
                sortOrder: 'desc' as const
              }
            })) || []}
            items={currentProject.content.collections?.flatMap(c => c.items.map(item => ({
              ...item,
              collectionId: c.id
            }))) || []}
            onCreateCollection={(collection) => console.log('Create collection:', collection)}
            onUpdateCollection={(id, collection) => console.log('Update collection:', id, collection)}
            onDeleteCollection={(id) => console.log('Delete collection:', id)}
            onCreateItem={(collectionId, item) => console.log('Create item:', collectionId, item)}
            onUpdateItem={(id, item) => console.log('Update item:', id, item)}
            onDeleteItem={(id) => console.log('Delete item:', id)}
            onImportData={(collectionId, data) => console.log('Import data:', collectionId, data)}
            onExportData={(collectionId) => console.log('Export data:', collectionId)}
          />
        );

      case 'versions':
        return (
          <VersionControl
            currentContent={currentProject.content}
            versions={currentProject.versions || []}
            onSaveVersion={handleSaveVersion}
            onRestoreVersion={handleRestoreVersion}
            onDeleteVersion={(versionId) => console.log('Delete version:', versionId)}
            onCompareVersions={(v1, v2) => console.log('Compare versions:', v1, v2)}
            onExportVersion={(versionId) => console.log('Export version:', versionId)}
            onImportVersion={(content) => console.log('Import version:', content)}
            hasUnsavedChanges={hasUnsavedChanges}
            undoStack={undoStack}
            redoStack={redoStack}
            onUndo={handleUndo}
            onRedo={handleRedo}
          />
        );

      case 'publish':
        return (
          <PublishingPanel
            projectName={currentProject.name}
            content={currentProject.content}
            settings={publishingSettings}
            deploymentStatus={deploymentStatus}
            onUpdateSettings={updatePublishingSettings}
            onPublish={handlePublish}
            onExportStatic={() => console.log('Export static')}
            onPreviewDeployment={() => console.log('Preview deployment')}
            onGenerateQR={() => console.log('Generate QR')}
            isPublished={currentProject.isPublished}
            publishUrl={currentProject.publishUrl}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-background">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold">{currentProject.name}</h1>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                Unsaved
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Device Mode Switcher */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={deviceMode === 'desktop' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Quick Actions */}
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={() => setPreviewMode(!previewMode)}>
              <Eye className="h-4 w-4 mr-1" />
              {previewMode ? 'Edit' : 'Preview'}
            </Button>

            <Button onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>

            <Button onClick={handlePublish}>
              <Rocket className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>

        {/* Performance & Validation Bar */}
        {(validationErrors.length > 0 || performanceScore < 80) && (
          <div className="px-6 py-2 border-t bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {validationErrors.length > 0 && (
                  <div className="flex items-center gap-2 text-yellow-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-sm">{validationErrors.length} issue(s) to fix</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="text-sm">Performance: {performanceScore}/100</span>
                  <Progress value={performanceScore} className="w-20 h-2" />
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSidebarTab('seo')}>
                Fix Issues
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-80 border-r bg-background flex flex-col">
          <div className="border-b">
            <Tabs value={sidebarTab} onValueChange={(value: any) => setSidebarTab(value)} className="w-full">
              <TabsList className="grid grid-cols-4 w-full rounded-none">
                <TabsTrigger value="content" className="text-xs">
                  <Layers className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs">
                  <Palette className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="pages" className="text-xs">
                  <FileText className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="seo" className="text-xs">
                  <Target className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>
              <div className="border-t">
                <TabsList className="grid grid-cols-3 w-full rounded-none">
                  <TabsTrigger value="collections" className="text-xs">
                    <Database className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="versions" className="text-xs">
                    <History className="h-4 w-4" />
                  </TabsTrigger>
                  <TabsTrigger value="publish" className="text-xs">
                    <Globe className="h-4 w-4" />
                  </TabsTrigger>
                </TabsList>
              </div>
            </Tabs>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {renderSidebarContent()}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className={`mx-auto transition-all duration-300 ${getDeviceWidth()}`}>
            <div className="p-8">
              {previewMode ? (
                <div className="space-y-0">
                  {currentPage?.sections.map(section => (
                    <div
                      key={section.id}
                      className={`${section.visibility?.[deviceMode] === false ? 'opacity-50' : ''}`}
                    >
                      {/* Render section preview based on type */}
                      <div className="min-h-[200px] bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-dashed border-blue-200 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <h3 className="text-lg font-medium text-blue-800 mb-2">
                            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
                          </h3>
                          <p className="text-blue-600">
                            {section.content.title || section.content.name || 'Section Content'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {currentPage?.sections.length === 0 ? (
                    <Card>
                      <CardContent className="p-12 text-center">
                        <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                        <p className="text-muted-foreground mb-6">
                          Start building your page by adding sections
                        </p>
                        <Button onClick={() => setShowSectionLibrary(true)}>
                          <Plus className="h-4 w-4 mr-2" />
                          Add Your First Section
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    currentPage?.sections.map(section => (
                      <Card 
                        key={section.id} 
                        className={`border-2 transition-colors ${
                          selectedSection === section.id ? 'border-primary' : 'border-transparent hover:border-muted'
                        }`}
                      >
                        <CardHeader 
                          className="cursor-pointer"
                          onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                        >
                          <CardTitle className="flex items-center justify-between">
                            <span className="flex items-center gap-2">
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                              {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                              {section.visibility?.[deviceMode] === false && (
                                <Badge variant="outline" className="text-xs">
                                  Hidden on {deviceMode}
                                </Badge>
                              )}
                            </span>
                            <Badge variant="secondary">
                              {selectedSection === section.id ? 'Editing' : 'Click to Edit'}
                            </Badge>
                          </CardTitle>
                        </CardHeader>
                        {selectedSection === section.id && (
                          <CardContent>
                            <div className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                Configure the settings for this {section.type} section.
                              </p>
                              {/* Section-specific controls would go here */}
                            </div>
                          </CardContent>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <Dialog open={isMediaManagerOpen} onOpenChange={setIsMediaManagerOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Media Library</DialogTitle>
          </DialogHeader>
          <MediaManager onSelectMedia={handleMediaSelect} />
        </DialogContent>
      </Dialog>

      <Dialog open={showSectionLibrary} onOpenChange={setShowSectionLibrary}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          <SectionLibrary onAddSection={(type, content) => {
            addSection(type, content);
          }} />
        </DialogContent>
      </Dialog>
    </div>
  );
}