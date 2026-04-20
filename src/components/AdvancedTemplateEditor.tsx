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
    }>;
    globalStyles?: {
      colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
      };
      fonts: {
        heading: string;
        body: string;
      };
      theme: 'light' | 'dark';
    };
    seo?: {
      title: string;
      description: string;
      keywords: string;
      ogImage?: string;
    };
  };
  versions?: Array<{
    id: string;
    timestamp: string;
    content: any;
    description: string;
  }>;
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
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
  const [isDragging, setIsDragging] = useState(false);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string | null>(null);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [performanceScore, setPerformanceScore] = useState(85);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
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
  // Sync local project state when prop changes (e.g., temp id -> real id after save)
  useEffect(() => {
    setCurrentProject(project);
    if (project.content?.pages?.length) {
      const exists = project.content.pages.some(p => p.id === currentPageId);
      if (!exists) {
        setCurrentPageId(project.content.pages[0].id);
      }
    }
  }, [project]);

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

  // Validation
  useEffect(() => {
    const errors: string[] = [];
    
    if (!currentProject.content.seo?.title) {
      errors.push('Missing page title for SEO');
    }
    
    if (!currentProject.content.seo?.description) {
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
      description: 'Manual save'
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
      const publishUrl = `https://${publishingSettings.subdomain || 'my-site'}.nexaweave.site`;
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

  const deleteSection = (sectionId: string) => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page => ({
        ...page,
        sections: page.sections.filter(s => s.id !== sectionId)
      }))
    }));
  };

  const duplicateSection = (sectionId: string) => {
    updateProjectContent(content => {
      const pageIndex = content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return content;
      
      const sections = [...content.pages[pageIndex].sections];
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      if (sectionIndex === -1) return content;
      
      const originalSection = sections[sectionIndex];
      const duplicatedSection = {
        ...originalSection,
        id: `section-${Date.now()}`,
        content: { ...originalSection.content }
      };
      
      sections.splice(sectionIndex + 1, 0, duplicatedSection);
      
      const newPages = [...content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };
      
      return { ...content, pages: newPages };
    });
  };

  const toggleSectionVisibility = (sectionId: string, device: 'desktop' | 'tablet' | 'mobile') => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page => ({
        ...page,
        sections: page.sections.map(section =>
          section.id === sectionId
            ? {
                ...section,
                visibility: {
                  ...section.visibility,
                  [device]: !section.visibility?.[device]
                }
              }
            : section
        )
      }))
    }));
  };

  const addPage = () => {
    const newPage = {
      id: `page-${Date.now()}`,
      name: 'New Page',
      path: '/new-page',
      sections: [
        {
          id: `nav-${Date.now()}`,
          type: 'navigation' as const,
          content: {
            logo: currentProject.content.pages[0]?.sections.find(s => s.type === 'navigation')?.content.logo || 'Logo',
            menuItems: currentProject.content.pages.map(p => p.name)
          }
        }
      ]
    };
    
    updateProjectContent(content => ({
      ...content,
      pages: [...content.pages, newPage]
    }));
    
    setCurrentPageId(newPage.id);
  };

  const deletePage = (pageId: string) => {
    if (currentProject.content.pages.length <= 1) return;
    
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.filter(p => p.id !== pageId)
    }));
    
    if (pageId === currentPageId) {
      setCurrentPageId(currentProject.content.pages[0].id);
    }
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
      testimonials: {
        title: 'What Our Clients Say',
        testimonials: [
          {
            name: 'Client Name',
            role: 'Position',
            company: 'Company',
            content: 'Testimonial content',
            image: '',
            rating: 5
          }
        ]
      },
      pricing: {
        title: 'Pricing Plans',
        description: 'Choose your plan',
        plans: [
          {
            name: 'Basic',
            price: '$29',
            period: '/month',
            features: ['Feature 1', 'Feature 2'],
            popular: false
          }
        ]
      },
      gallery: {
        title: 'Gallery',
        description: 'Our work',
        items: [
          {
            title: 'Project 1',
            category: 'Category',
            image: '',
            description: 'Project description'
          }
        ]
      },
      portfolio: {
        title: 'Portfolio',
        description: 'Our projects',
        projects: [
          {
            title: 'Project 1',
            category: 'Category',
            image: ''
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
      menu: {
        title: 'Our Menu',
        description: 'Delicious offerings',
        categories: [
          {
            name: 'Main Courses',
            items: [
              {
                name: 'Dish Name',
                description: 'Dish description',
                price: '$25'
              }
            ]
          }
        ]
      },
      locations: {
        title: 'Our Locations',
        locations: [
          {
            name: 'Location Name',
            address: '123 Main St\nCity, State 12345',
            phone: '+1 (555) 123-4567',
            hours: 'Mon-Fri: 9AM-5PM',
            image: ''
          }
        ]
      },
      blog: {
        title: 'Latest News',
        description: 'Stay updated',
        posts: [
          {
            title: 'Blog Post Title',
            excerpt: 'Post excerpt',
            date: new Date().toISOString(),
            image: '',
            author: 'Author Name'
          }
        ]
      },
      faq: {
        title: 'Frequently Asked Questions',
        description: 'Get answers',
        faqs: [
          {
            question: 'Sample Question?',
            answer: 'Sample answer to the question.'
          }
        ]
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

  const getSectionIcon = (type: string) => {
    const iconMap: { [key: string]: any } = {
      navigation: FileText,
      hero: Type,
      about: FileText,
      services: Star,
      team: Users,
      contact: MapPin,
      gallery: ImageIcon,
      portfolio: ImageIcon,
      features: Star,
      pricing: Star,
      menu: FileText,
      locations: MapPin,
      footer: FileText,
      testimonials: Users,
      blog: FileText,
      faq: FileText
    };
    return iconMap[type] || FileText;
  };

  const formatSectionTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const getDeviceWidth = () => {
    switch (deviceMode) {
      case 'mobile': return 'max-w-sm';
      case 'tablet': return 'max-w-2xl';
      default: return 'w-full';
    }
  };

  const renderInlineEditor = (sectionId: string, field: string, content: string, type: 'text' | 'textarea' = 'text') => {
    const isEditing = editingText === `${sectionId}-${field}`;
    
    if (isEditing) {
      return type === 'textarea' ? (
        <textarea
          value={content}
          onChange={(e) => updateSectionContent(sectionId, { [field]: e.target.value })}
          onBlur={() => setEditingText(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              setEditingText(null);
            }
          }}
          className="w-full bg-transparent border-2 border-blue-500 rounded px-2 py-1 resize-none"
          autoFocus
          rows={3}
        />
      ) : (
        <input
          value={content}
          onChange={(e) => updateSectionContent(sectionId, { [field]: e.target.value })}
          onBlur={() => setEditingText(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setEditingText(null);
            }
          }}
          className="w-full bg-transparent border-2 border-blue-500 rounded px-2 py-1"
          autoFocus
        />
      );
    }
    
    return (
      <span
        onClick={() => setEditingText(`${sectionId}-${field}`)}
        className="cursor-text hover:bg-blue-50 hover:outline hover:outline-2 hover:outline-blue-300 rounded px-1 transition-all"
        title="Click to edit"
      >
        {content || `Click to edit ${field}`}
      </span>
    );
  };

  const renderSectionEditor = (section: any) => {
    const Icon = getSectionIcon(section.type);
    const isVisible = section.visibility?.[deviceMode] !== false;
    
    return (
      <Card 
        key={section.id} 
        className={`mb-4 relative group ${selectedSection === section.id ? 'ring-2 ring-blue-500' : ''}`}
      >
        <CardHeader 
          className={`cursor-pointer ${selectedSection === section.id ? 'bg-muted/50' : ''}`}
          onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
        >
          <CardTitle className="flex items-center justify-between text-base">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
              <Icon className="h-4 w-4" />
              {formatSectionTitle(section.type)}
              {!isVisible && <Badge variant="outline" className="text-xs">Hidden on {deviceMode}</Badge>}
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionVisibility(section.id, deviceMode);
                }}
                title={`Toggle visibility on ${deviceMode}`}
              >
                {isVisible ? <Eye className="h-4 w-4" /> : <Eye className="h-4 w-4 text-gray-400" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSection(section.id);
                }}
                title="Duplicate section"
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSection(section.id);
                }}
                title="Delete section"
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        {selectedSection === section.id && (
          <CardContent className="pt-0">
            {renderSectionFields(section)}
          </CardContent>
        )}
      </Card>
    );
  };

  const renderSectionFields = (section: any) => {
    const addItemToArray = (field: string, newItem: any) => {
      const currentArray = section.content[field] || [];
      updateSectionContent(section.id, { 
        [field]: [...currentArray, newItem] 
      });
    };

    const updateArrayItem = (field: string, index: number, updates: any) => {
      const currentArray = section.content[field] || [];
      const newArray = [...currentArray];
      newArray[index] = { ...newArray[index], ...updates };
      updateSectionContent(section.id, { [field]: newArray });
    };

    const removeArrayItem = (field: string, index: number) => {
      const currentArray = section.content[field] || [];
      const newArray = currentArray.filter((_: any, i: number) => i !== index);
      updateSectionContent(section.id, { [field]: newArray });
    };

    switch (section.type) {
      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo/Brand Name</label>
              <Input
                value={section.content.logo || ''}
                onChange={(e) => updateSectionContent(section.id, { logo: e.target.value })}
                placeholder="Enter brand name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Menu Items (comma separated)</label>
              <Input
                value={section.content.menuItems?.join(', ') || ''}
                onChange={(e) => updateSectionContent(section.id, { 
                  menuItems: e.target.value.split(',').map(item => item.trim()).filter(item => item) 
                })}
                placeholder="Home, About, Services, Contact"
              />
            </div>
          </div>
        );

      case 'hero':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Main Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Enter main title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Subtitle</label>
              <Textarea
                value={section.content.subtitle || ''}
                onChange={(e) => updateSectionContent(section.id, { subtitle: e.target.value })}
                placeholder="Enter subtitle"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Button Text</label>
              <Input
                value={section.content.buttonText || ''}
                onChange={(e) => updateSectionContent(section.id, { buttonText: e.target.value })}
                placeholder="Enter button text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <div className="flex items-center gap-2">
                <Input
                  value={section.content.backgroundImage || ''}
                  onChange={(e) => updateSectionContent(section.id, { backgroundImage: e.target.value })}
                  placeholder="Image URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(section.id, 'backgroundImage')}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Image Alt Text</label>
              <Input
                value={section.content.backgroundImageAlt || ''}
                onChange={(e) => updateSectionContent(section.id, { backgroundImageAlt: e.target.value })}
                placeholder="Describe the background image"
              />
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="About section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="About description"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image</label>
              <div className="flex items-center gap-2">
                <Input
                  value={section.content.image || ''}
                  onChange={(e) => updateSectionContent(section.id, { image: e.target.value })}
                  placeholder="Image URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(section.id, 'image')}
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Image Alt Text</label>
              <Input
                value={section.content.imageAlt || ''}
                onChange={(e) => updateSectionContent(section.id, { imageAlt: e.target.value })}
                placeholder="Describe the image"
              />
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Features section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description (optional)</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Features description"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Features</label>
                <Button 
                  size="sm" 
                  onClick={() => addItemToArray('features', {
                    icon: '⭐',
                    title: 'New Feature',
                    description: 'Feature description'
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Feature
                </Button>
              </div>
              {(section.content.features || []).map((feature: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={feature.icon || ''}
                        onChange={(e) => updateArrayItem('features', index, { icon: e.target.value })}
                        placeholder="Icon (emoji)"
                        className="w-20"
                      />
                      <Input
                        value={feature.title || ''}
                        onChange={(e) => updateArrayItem('features', index, { title: e.target.value })}
                        placeholder="Feature title"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('features', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Textarea
                      value={feature.description || ''}
                      onChange={(e) => updateArrayItem('features', index, { description: e.target.value })}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Services section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Services description"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Services</label>
                <Button 
                  size="sm" 
                  onClick={() => addItemToArray('services', {
                    name: 'New Service',
                    description: 'Service description',
                    price: 'From $100',
                    image: ''
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Service
                </Button>
              </div>
              {(section.content.services || []).map((service: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={service.name || ''}
                        onChange={(e) => updateArrayItem('services', index, { name: e.target.value })}
                        placeholder="Service name"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('services', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Textarea
                      value={service.description || ''}
                      onChange={(e) => updateArrayItem('services', index, { description: e.target.value })}
                      placeholder="Service description"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={service.price || ''}
                        onChange={(e) => updateArrayItem('services', index, { price: e.target.value })}
                        placeholder="Price (e.g., From $100)"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `services.${index}.image`)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Team section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Team description"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Team Members</label>
                <Button 
                  size="sm" 
                  onClick={() => addItemToArray('members', {
                    name: 'Team Member',
                    role: 'Position',
                    image: '',
                    bio: 'Member bio'
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </Button>
              </div>
              {(section.content.members || []).map((member: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={member.name || ''}
                        onChange={(e) => updateArrayItem('members', index, { name: e.target.value })}
                        placeholder="Member name"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('members', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <Input
                      value={member.role || ''}
                      onChange={(e) => updateArrayItem('members', index, { role: e.target.value })}
                      placeholder="Member role/position"
                    />
                    <Textarea
                      value={member.bio || ''}
                      onChange={(e) => updateArrayItem('members', index, { bio: e.target.value })}
                      placeholder="Member bio"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={member.image || ''}
                        onChange={(e) => updateArrayItem('members', index, { image: e.target.value })}
                        placeholder="Member photo URL"
                        className="flex-1"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `members.${index}.image`)}
                      >
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Pricing section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Pricing description"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Pricing Plans</label>
                <Button 
                  size="sm" 
                  onClick={() => addItemToArray('plans', {
                    name: 'New Plan',
                    price: '$29',
                    period: '/month',
                    features: ['Feature 1', 'Feature 2'],
                    popular: false
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Plan
                </Button>
              </div>
              {(section.content.plans || []).map((plan: any, index: number) => (
                <Card key={index} className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Input
                        value={plan.name || ''}
                        onChange={(e) => updateArrayItem('plans', index, { name: e.target.value })}
                        placeholder="Plan name"
                        className="flex-1"
                      />
                      <label className="flex items-center gap-2 text-sm">
                        <Switch
                          checked={plan.popular || false}
                          onCheckedChange={(checked) => updateArrayItem('plans', index, { popular: checked })}
                        />
                        Popular
                      </label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeArrayItem('plans', index)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={plan.price || ''}
                        onChange={(e) => updateArrayItem('plans', index, { price: e.target.value })}
                        placeholder="Price (e.g., $29)"
                        className="w-24"
                      />
                      <Input
                        value={plan.period || ''}
                        onChange={(e) => updateArrayItem('plans', index, { period: e.target.value })}
                        placeholder="Period (e.g., /month)"
                        className="w-32"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Features (one per line)</label>
                      <Textarea
                        value={(plan.features || []).join('\n')}
                        onChange={(e) => updateArrayItem('plans', index, { 
                          features: e.target.value.split('\n').filter(f => f.trim()) 
                        })}
                        placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                        rows={3}
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Contact section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Contact description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <Input
                value={section.content.email || ''}
                onChange={(e) => updateSectionContent(section.id, { email: e.target.value })}
                placeholder="contact@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <Input
                value={section.content.phone || ''}
                onChange={(e) => updateSectionContent(section.id, { phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <Textarea
                value={section.content.address || ''}
                onChange={(e) => updateSectionContent(section.id, { address: e.target.value })}
                placeholder="123 Main Street&#10;City, State 12345"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Hours</label>
              <Textarea
                value={section.content.hours || ''}
                onChange={(e) => updateSectionContent(section.id, { hours: e.target.value })}
                placeholder="Mon-Fri: 9AM-5PM&#10;Sat-Sun: Closed"
                rows={2}
              />
            </div>
          </div>
        );

      case 'gallery':
      case 'portfolio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Gallery section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Gallery description"
                rows={2}
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="block text-sm font-medium">Gallery Items</label>
                <Button 
                  size="sm" 
                  onClick={() => addItemToArray(section.type === 'portfolio' ? 'projects' : 'items', {
                    title: 'New Item',
                    category: 'Category',
                    image: '',
                    description: 'Item description'
                  })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Item
                </Button>
              </div>
              {(section.content.items || section.content.projects || []).map((item: any, index: number) => {
                const fieldName = section.type === 'portfolio' ? 'projects' : 'items';
                return (
                  <Card key={index} className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.title || ''}
                          onChange={(e) => updateArrayItem(fieldName, index, { title: e.target.value })}
                          placeholder="Item title"
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeArrayItem(fieldName, index)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={item.category || ''}
                          onChange={(e) => updateArrayItem(fieldName, index, { category: e.target.value })}
                          placeholder="Category"
                          className="flex-1"
                        />
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleImageUpload(section.id, `${fieldName}.${index}.image`)}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                      </div>
                      <Textarea
                        value={item.description || ''}
                        onChange={(e) => updateArrayItem(fieldName, index, { description: e.target.value })}
                        placeholder="Item description"
                        rows={2}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 'footer':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Company Name</label>
              <Input
                value={section.content.companyName || ''}
                onChange={(e) => updateSectionContent(section.id, { companyName: e.target.value })}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Company description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Footer Links (comma separated)</label>
              <Input
                value={(section.content.links || []).join(', ')}
                onChange={(e) => updateSectionContent(section.id, { 
                  links: e.target.value.split(',').map(link => link.trim()).filter(link => link) 
                })}
                placeholder="Privacy Policy, Terms of Service, Contact"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-muted-foreground text-sm p-4 bg-muted/30 rounded">
              <p className="mb-2">Section type "{section.type}" editor is in development.</p>
              <p>You can still edit the content directly in the preview by clicking on text elements.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Raw Content (JSON)</label>
              <Textarea
                value={JSON.stringify(section.content, null, 2)}
                onChange={(e) => {
                  try {
                    const newContent = JSON.parse(e.target.value);
                    updateSectionContent(section.id, newContent);
                  } catch (error) {
                    // Invalid JSON, ignore
                  }
                }}
                placeholder="Edit raw JSON content"
                rows={8}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
    }
  };

  const renderSectionPreview = (section: any) => {
    const isVisible = section.visibility?.[deviceMode] !== false;
    if (!isVisible) return null;

    switch (section.type) {
      case 'hero':
        return (
          <div 
            className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-white"
            style={{ 
              backgroundImage: section.content.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
            }}
          >
            <div className="text-center max-w-4xl px-4">
              <h1 className={`${deviceMode === 'mobile' ? 'text-2xl' : 'text-3xl md:text-5xl lg:text-6xl'} mb-4`}>
                {renderInlineEditor(section.id, 'title', section.content.title || 'Your Title Here')}
              </h1>
              <p className={`${deviceMode === 'mobile' ? 'text-base' : 'text-lg md:text-xl'} mb-8 opacity-90`}>
                {renderInlineEditor(section.id, 'subtitle', section.content.subtitle || 'Your subtitle here', 'textarea')}
              </p>
              <Button size={deviceMode === 'mobile' ? "default" : "lg"} className="bg-white text-black hover:bg-gray-100">
                {renderInlineEditor(section.id, 'buttonText', section.content.buttonText || 'Call to Action')}
              </Button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl mb-6">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'About Us')}
                </h2>
                <p className="text-lg text-gray-600">
                  {renderInlineEditor(section.id, 'description', section.content.description || 'Your about description goes here.', 'textarea')}
                </p>
              </div>
              {section.content.image && (
                <div className="text-center">
                  <ImageWithFallback
                    src={section.content.image}
                    alt={section.content.imageAlt || 'About image'}
                    className="w-64 h-64 mx-auto rounded-lg object-cover"
                  />
                </div>
              )}
              {section.content.stats && section.content.stats.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12">
                  {section.content.stats.map((stat: any, index: number) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-primary">{stat.number}</div>
                      <div className="text-gray-600">{stat.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Features')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                {(section.content.features || []).map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Our Services')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                {(section.content.services || []).map((service: any, index: number) => (
                  <Card key={index} className="p-6 text-center">
                    {service.image && (
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="w-full h-40 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    {service.price && (
                      <p className="text-primary font-semibold">{service.price}</p>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Our Team')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'}`}>
                {(section.content.members || []).map((member: any, index: number) => (
                  <Card key={index} className="p-6 text-center">
                    {member.image && (
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-24 h-24 rounded-full object-cover mx-auto mb-4"
                      />
                    )}
                    <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                    <p className="text-primary text-sm mb-2">{member.role}</p>
                    <p className="text-gray-600 text-sm">{member.bio}</p>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Pricing')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
                {(section.content.plans || []).map((plan: any, index: number) => (
                  <Card key={index} className={`p-6 text-center relative ${plan.popular ? 'ring-2 ring-primary' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <ul className="space-y-2 mb-6">
                      {(plan.features || []).map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="text-sm text-gray-600">
                          ✓ {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full">Get Started</Button>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'gallery':
      case 'portfolio':
        return (
          <div className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Gallery')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-6 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2 md:grid-cols-3'}`}>
                {(section.content.items || section.content.projects || []).map((item: any, index: number) => (
                  <Card key={index} className="overflow-hidden">
                    {item.image && (
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-primary mb-2">{item.category}</p>
                      {item.description && (
                        <p className="text-sm text-gray-600">{item.description}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl mb-4">
                  {renderInlineEditor(section.id, 'title', section.content.title || 'Contact Us')}
                </h2>
                {section.content.description && (
                  <p className="text-lg text-gray-600">
                    {renderInlineEditor(section.id, 'description', section.content.description, 'textarea')}
                  </p>
                )}
              </div>
              <div className={`grid gap-8 ${deviceMode === 'mobile' ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    {section.content.email && (
                      <div>
                        <strong>Email:</strong>
                        <p className="text-gray-600">{section.content.email}</p>
                      </div>
                    )}
                    {section.content.phone && (
                      <div>
                        <strong>Phone:</strong>
                        <p className="text-gray-600">{section.content.phone}</p>
                      </div>
                    )}
                    {section.content.address && (
                      <div>
                        <strong>Address:</strong>
                        <p className="text-gray-600 whitespace-pre-line">{section.content.address}</p>
                      </div>
                    )}
                    {section.content.hours && (
                      <div>
                        <strong>Hours:</strong>
                        <p className="text-gray-600 whitespace-pre-line">{section.content.hours}</p>
                      </div>
                    )}
                  </div>
                </Card>
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Send us a message</h3>
                  <div className="space-y-4">
                    <Input placeholder="Your Name" />
                    <Input placeholder="Your Email" />
                    <Textarea placeholder="Your Message" rows={4} />
                    <Button className="w-full">Send Message</Button>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer className="bg-gray-900 text-white py-8 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">
                  {section.content.companyName || 'Company Name'}
                </h3>
                {section.content.description && (
                  <p className="text-gray-400 mb-4">{section.content.description}</p>
                )}
                <div className="flex justify-center space-x-6 text-sm">
                  {(section.content.links || []).map((link: string, index: number) => (
                    <a key={index} href="#" className="text-gray-400 hover:text-white">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        );

      default:
        return (
          <div className="py-8 px-4 bg-muted/30 text-center">
            <p className="text-muted-foreground">
              {formatSectionTitle(section.type)} section preview
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Use the sidebar editor to customize this section
            </p>
          </div>
        );
    }
  };

  const renderContentTab = () => {
    if (!currentPage) return null;

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
          {currentPage.sections.map(renderSectionEditor)}
        </div>
      </div>
    );
  };

  const renderDesignTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Global Colors
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={globalStyles.colors.primary}
                  onChange={(e) => updateGlobalStyles({ 
                    colors: { ...globalStyles.colors, primary: e.target.value }
                  })}
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <Input 
                  value={globalStyles.colors.primary}
                  onChange={(e) => updateGlobalStyles({ 
                    colors: { ...globalStyles.colors, primary: e.target.value }
                  })}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  value={globalStyles.colors.secondary}
                  onChange={(e) => updateGlobalStyles({ 
                    colors: { ...globalStyles.colors, secondary: e.target.value }
                  })}
                  className="w-10 h-10 rounded border border-gray-300"
                />
                <Input 
                  value={globalStyles.colors.secondary}
                  onChange={(e) => updateGlobalStyles({ 
                    colors: { ...globalStyles.colors, secondary: e.target.value }
                  })}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <Select 
                value={globalStyles.theme}
                onValueChange={(value) => updateGlobalStyles({ theme: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Light</SelectItem>
                  <SelectItem value="dark">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Type className="h-5 w-5" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Heading Font</label>
              <Select 
                value={globalStyles.fonts.heading}
                onValueChange={(value) => updateGlobalStyles({ 
                  fonts: { ...globalStyles.fonts, heading: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Body Font</label>
              <Select 
                value={globalStyles.fonts.body}
                onValueChange={(value) => updateGlobalStyles({ 
                  fonts: { ...globalStyles.fonts, body: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPagesTab = () => {
    return (
      <div className="space-y-6">
        <Button onClick={addPage} className="w-full" variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add New Page
        </Button>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">Pages</h3>
          {currentProject.content.pages.map(page => (
            <Card key={page.id} className={`cursor-pointer ${page.id === currentPageId ? 'ring-2 ring-blue-500' : ''}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1"
                    onClick={() => setCurrentPageId(page.id)}
                  >
                    <h4 className="font-medium">{page.name}</h4>
                    <p className="text-sm text-muted-foreground">{page.path}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {currentProject.content.pages.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deletePage(page.id)}
                        title="Delete page"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderSEOTab = () => {
    const seo = currentProject.content.seo || {
      title: '',
      description: '',
      keywords: '',
      ogImage: ''
    };

    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <Input 
                value={seo.title}
                onChange={(e) => updateSEO({ title: e.target.value })}
                placeholder="Your awesome website title"
                maxLength={60}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seo.title.length}/60 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <Textarea 
                value={seo.description}
                onChange={(e) => updateSEO({ description: e.target.value })}
                placeholder="Describe your website for search engines"
                rows={3}
                maxLength={160}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {seo.description.length}/160 characters
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <Input 
                value={seo.keywords}
                onChange={(e) => updateSEO({ keywords: e.target.value })}
                placeholder="keyword1, keyword2, keyword3"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span>Overall Score</span>
              <span className={`font-bold ${performanceScore >= 80 ? 'text-green-600' : performanceScore >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                {performanceScore}/100
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <div 
                className={`h-2 rounded-full ${performanceScore >= 80 ? 'bg-green-600' : performanceScore >= 60 ? 'bg-yellow-600' : 'bg-red-600'}`}
                style={{ width: `${performanceScore}%` }}
              />
            </div>
            
            {validationErrors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-red-600">Issues to Fix:</h4>
                {validationErrors.map((error, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    {error}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSettingsTab = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Project Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Project Name</label>
              <Input
                value={currentProject.name}
                onChange={(e) => setCurrentProject({ ...currentProject, name: e.target.value })}
                placeholder="Enter project name"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Publication Status</span>
              <Badge variant={currentProject.isPublished ? "default" : "secondary"}>
                {currentProject.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-save</span>
              <div className="flex items-center gap-2">
                {hasUnsavedChanges && <Clock className="h-4 w-4 text-yellow-500" />}
                <Switch checked={true} />
              </div>
            </div>
            
            {currentProject.publishUrl && (
              <div>
                <label className="block text-sm font-medium mb-2">Published URL</label>
                <div className="flex items-center gap-2">
                  <Input value={currentProject.publishUrl} readOnly />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(currentProject.publishUrl, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Version History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowVersionHistory(true)}
            >
              View Version History ({currentProject.versions?.length || 0})
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPreview = () => {
    if (!currentPage) return null;
    
    const navigation = currentPage.sections.find(section => section.type === 'navigation');

    return (
      <div className={`${getDeviceWidth()} mx-auto bg-white transition-all duration-300`}>
        {/* Navigation Preview */}
        {navigation && (
          <nav className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-bold text-xl text-primary">
                {navigation.content.logo || 'Logo'}
              </div>
              <div className={`${deviceMode === 'mobile' ? 'hidden' : 'flex'} items-center space-x-6`}>
                {navigation.content.menuItems?.map((item: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      const targetPage = currentProject.content.pages.find(page => 
                        page.name.toLowerCase() === item.toLowerCase()
                      );
                      if (targetPage) {
                        setCurrentPageId(targetPage.id);
                      }
                    }}
                    className={`hover:text-primary transition-colors ${
                      currentPage?.name.toLowerCase() === item.toLowerCase() 
                        ? 'text-primary font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        )}

        {/* Render other sections */}
        {currentPage.sections.filter(section => section.type !== 'navigation').map(section => (
          <div key={section.id} className="relative">
            {renderSectionPreview(section)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-semibold">{currentProject.name}</h1>
            <Badge variant="outline" className="text-xs">
              {currentProject.isPublished ? "Published" : "Draft"}
            </Badge>
            {hasUnsavedChanges && (
              <Badge variant="secondary" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Unsaved
              </Badge>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {/* Undo/Redo */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button variant="ghost" size="sm" disabled>
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" disabled>
                <Redo className="h-4 w-4" />
              </Button>
            </div>

            {/* Edit/Preview Toggle */}
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={!previewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(false)}
                className="text-xs px-3"
              >
                <Edit3 className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant={previewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(true)}
                className="text-xs px-3"
              >
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Button>
            </div>

            {/* Device Preview */}
            {previewMode && (
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={deviceMode === 'desktop' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceMode('desktop')}
                  className="text-xs px-2"
                >
                  <Monitor className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceMode === 'tablet' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceMode('tablet')}
                  className="text-xs px-2"
                >
                  <Tablet className="h-3 w-3" />
                </Button>
                <Button
                  variant={deviceMode === 'mobile' ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setDeviceMode('mobile')}
                  className="text-xs px-2"
                >
                  <Smartphone className="h-3 w-3" />
                </Button>
              </div>
            )}

            <Separator orientation="vertical" className="h-6" />
            
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
            <Button onClick={handlePublish}>
              <Globe className="h-4 w-4 mr-2" />
              {currentProject.isPublished ? "Update" : "Publish"}
            </Button>
          </div>
        </div>
      </header>

      {/* Page Navigation */}
      <div className="border-b bg-background px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Editing:</span>
            {currentProject.content.pages.map((page) => (
              <Badge
                key={page.id}
                variant={page.id === currentPageId ? "default" : "outline"}
                className="cursor-pointer text-xs"
                onClick={() => setCurrentPageId(page.id)}
              >
                {page.name}
              </Badge>
            ))}
          </div>
          
          {/* Validation Status */}
          <div className="flex items-center space-x-2">
            {validationErrors.length > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertTriangle className="h-3 w-3 mr-1" />
                {validationErrors.length} issues
              </Badge>
            )}
            <Badge 
              variant={performanceScore >= 80 ? "default" : "secondary"} 
              className="text-xs"
            >
              <Target className="h-3 w-3 mr-1" />
              Score: {performanceScore}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-121px)]">
        {/* Editor Sidebar */}
        {!previewMode && (
          <div className="w-80 border-r bg-background flex flex-col">
            {/* Sidebar Tabs */}
            <div className="border-b px-4 py-3">
              <Tabs value={sidebarTab} onValueChange={(value) => setSidebarTab(value as any)}>
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="content" className="text-xs">
                    <Layers className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-xs">
                    <Palette className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="pages" className="text-xs">
                    <FileText className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs">
                    <Search className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Settings className="h-3 w-3" />
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Sidebar Content */}
            <div className="flex-1 overflow-y-auto p-4">
              <Tabs value={sidebarTab}>
                <TabsContent value="content">
                  {renderContentTab()}
                </TabsContent>
                <TabsContent value="design">
                  {renderDesignTab()}
                </TabsContent>
                <TabsContent value="pages">
                  {renderPagesTab()}
                </TabsContent>
                <TabsContent value="seo">
                  {renderSEOTab()}
                </TabsContent>
                <TabsContent value="settings">
                  {renderSettingsTab()}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Preview Area */}
        <div className="flex-1 overflow-y-auto bg-white">
          <div className={previewMode ? 'h-full' : 'h-full border-l'}>
            {renderPreview()}
          </div>
        </div>
      </div>

      {/* Section Library Dialog */}
      <SectionLibrary
        isOpen={showSectionLibrary}
        onClose={() => setShowSectionLibrary(false)}
        onAddSection={addSection}
      />

      {/* Media Manager */}
      <MediaManager
        isOpen={isMediaManagerOpen}
        onClose={() => {
          setIsMediaManagerOpen(false);
          setCurrentImageField(null);
        }}
        onSelectMedia={handleMediaSelect}
        acceptedTypes={['image']}
      />

      {/* Version History Dialog */}
      <Dialog open={showVersionHistory} onOpenChange={setShowVersionHistory}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Version History</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {currentProject.versions?.map(version => (
              <Card key={version.id} className="p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{version.description}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(version.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Restore
                  </Button>
                </div>
              </Card>
            )) || (
              <p className="text-muted-foreground text-center py-8">No versions saved yet</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}