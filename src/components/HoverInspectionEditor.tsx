import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
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
import { Slider } from './ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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
  Rocket,
  Grid3X3,
  Move,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  PaintBucket,
  MousePointer2,
  Info,
  Zap,
  Bot,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Volume2
} from 'lucide-react';
import { toast } from 'sonner';
import { ImageWithFallback } from './common/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';

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
        locked?: boolean;
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
}

interface HoverInspectionEditorProps {
  project: UserProject;
  onSave: (project: UserProject) => void;
  onPublish: (project: UserProject) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

interface ElementMetadata {
  type: string;
  position: { row: number; column: number; parent: string };
  visibility: { desktop: boolean; tablet: boolean; mobile: boolean };
  accessibility: { 
    altText?: string; 
    ariaLabel?: string; 
    contrast?: 'good' | 'poor' | 'excellent';
    missing?: string[];
  };
  seo: {
    heading?: string;
    importance?: 'high' | 'medium' | 'low';
    issues?: string[];
  };
}

interface SmartSuggestion {
  id: string;
  type: 'section' | 'layout' | 'content' | 'style';
  title: string;
  description: string;
  icon: any;
  action: () => void;
}

export function HoverInspectionEditor({ project, onSave, onPublish, onNavigate }: HoverInspectionEditorProps) {
  const [currentProject, setCurrentProject] = useState<UserProject>(project);
  const [currentPageId, setCurrentPageId] = useState(project.content.pages[0]?.id || '');
  const [hoveredElement, setHoveredElement] = useState<string | null>(null);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [inspectionMode, setInspectionMode] = useState(true);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [showGrid, setShowGrid] = useState(false);
  const [showSpacing, setShowSpacing] = useState(false);
  const [elementMetadata, setElementMetadata] = useState<{ [key: string]: ElementMetadata }>({});
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'inspector' | 'content' | 'style' | 'ai' | 'versions'>('inspector');
  const [dragMode, setDragMode] = useState(false);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<SmartSuggestion[]>([]);
  const [showEmptyStateHelper, setShowEmptyStateHelper] = useState(false);
  const [accessibilityChecks, setAccessibilityChecks] = useState<{ [key: string]: string[] }>({});
  const [seoScore, setSeoScore] = useState({ score: 85, issues: ['Missing meta description', 'Image alt text needed'] });
  const [aiAssistant, setAiAssistant] = useState({ active: false, suggestions: [] });

  const currentPage = useMemo(() => {
    return currentProject.content.pages.find(page => page.id === currentPageId);
  }, [currentProject.content.pages, currentPageId]);

  const autosaveTimeout = useRef<NodeJS.Timeout>();

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

  // Generate element metadata
  useEffect(() => {
    const metadata: { [key: string]: ElementMetadata } = {};
    
    currentPage?.sections.forEach((section, index) => {
      metadata[section.id] = {
        type: section.type,
        position: { row: index, column: 0, parent: 'page' },
        visibility: section.visibility || { desktop: true, tablet: true, mobile: true },
        accessibility: {
          contrast: section.content.backgroundImage ? 'poor' : 'good',
          missing: []
        },
        seo: {
          heading: section.type === 'hero' ? 'H1' : section.type === 'about' ? 'H2' : undefined,
          importance: section.type === 'hero' ? 'high' : 'medium',
          issues: []
        }
      };
      
      // Check accessibility issues
      if (section.content.backgroundImage && !section.content.backgroundImageAlt) {
        metadata[section.id].accessibility.missing?.push('Alt text for background image');
      }
      
      // Check SEO issues
      if (section.type === 'hero' && !section.content.title) {
        metadata[section.id].seo.issues?.push('Missing title');
      }
    });
    
    setElementMetadata(metadata);
  }, [currentPage]);

  // Generate smart suggestions
  useEffect(() => {
    const suggestions: SmartSuggestion[] = [];
    
    if (!currentPage?.sections.length) {
      suggestions.push({
        id: 'add-hero',
        type: 'section',
        title: 'Add Hero Banner',
        description: 'Start with an impressive hero section',
        icon: Type,
        action: () => addSection('hero')
      });
      suggestions.push({
        id: 'add-about',
        type: 'section',
        title: 'Add About Section',
        description: 'Tell your story',
        icon: FileText,
        action: () => addSection('about')
      });
      setShowEmptyStateHelper(true);
    } else {
      setShowEmptyStateHelper(false);
    }
    
    if (selectedElement) {
      const element = currentPage?.sections.find(s => s.id === selectedElement);
      if (element?.type === 'hero' && !element.content.buttonText) {
        suggestions.push({
          id: 'add-cta',
          type: 'content',
          title: 'Add Call-to-Action',
          description: 'Increase conversions with a clear CTA',
          icon: Target,
          action: () => updateSectionContent(selectedElement, { buttonText: 'Get Started' })
        });
      }
    }
    
    setSmartSuggestions(suggestions);
  }, [currentPage, selectedElement]);

  const handleAutoSave = () => {
    toast.success('Auto-saved', { duration: 1000 });
    setHasUnsavedChanges(false);
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

  const addSection = (sectionType: string) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: sectionType as any,
      content: getDefaultSectionContent(sectionType),
      visibility: { desktop: true, tablet: true, mobile: true },
      locked: false
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
    
    setSelectedElement(newSection.id);
    toast.success(`${sectionType.charAt(0).toUpperCase() + sectionType.slice(1)} section added`);
  };

  const deleteSection = (sectionId: string) => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page => ({
        ...page,
        sections: page.sections.filter(s => s.id !== sectionId)
      }))
    }));
    
    if (selectedElement === sectionId) {
      setSelectedElement(null);
    }
    toast.success('Section deleted');
  };

  const duplicateSection = (sectionId: string) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (section) {
      const duplicatedSection = {
        ...section,
        id: `section-${Date.now()}`,
      };
      
      updateProjectContent(projectContent => {
        const pageIndex = projectContent.pages.findIndex(p => p.id === currentPageId);
        if (pageIndex === -1) return projectContent;
        
        const sections = [...projectContent.pages[pageIndex].sections];
        const sectionIndex = sections.findIndex(s => s.id === sectionId);
        sections.splice(sectionIndex + 1, 0, duplicatedSection);
        
        const newPages = [...projectContent.pages];
        newPages[pageIndex] = { ...newPages[pageIndex], sections };
        
        return { ...projectContent, pages: newPages };
      });
      
      toast.success('Section duplicated');
    }
  };

  const toggleSectionLock = (sectionId: string) => {
    updateProjectContent(content => ({
      ...content,
      pages: content.pages.map(page => ({
        ...page,
        sections: page.sections.map(section =>
          section.id === sectionId
            ? { ...section, locked: !section.locked }
            : section
        )
      }))
    }));
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    updateProjectContent(content => {
      const pageIndex = content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return content;
      
      const sections = [...content.pages[pageIndex].sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);
      
      if (currentIndex === -1) return content;
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sections.length) return content;
      
      // Swap sections
      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];
      
      const newPages = [...content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };
      
      return { ...content, pages: newPages };
    });
  };

  const toggleDeviceVisibility = (sectionId: string, device: 'desktop' | 'tablet' | 'mobile') => {
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

  const handleSave = () => {
    const updatedProject = {
      ...currentProject,
      lastModified: new Date().toISOString()
    };
    
    setCurrentProject(updatedProject);
    onSave(updatedProject);
    setHasUnsavedChanges(false);
    toast.success('Project saved!');
  };

  const getDefaultSectionContent = (sectionType: string) => {
    const defaults: { [key: string]: any } = {
      hero: {
        title: 'Your Amazing Headline',
        subtitle: 'Compelling subtitle that describes your value proposition',
        buttonText: 'Get Started',
        backgroundImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
        backgroundImageAlt: 'Hero background'
      },
      about: {
        title: 'About Us',
        description: 'Tell your story and connect with your audience',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=400&fit=crop',
        imageAlt: 'About us image'
      },
      services: {
        title: 'Our Services',
        description: 'What we offer to help you succeed',
        services: [
          {
            name: 'Service One',
            description: 'Description of your first service',
            price: 'From $99',
            image: ''
          }
        ]
      },
      contact: {
        title: 'Contact Us',
        description: 'Get in touch with our team',
        email: 'hello@company.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business St\nYour City, State 12345'
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

  const getSectionIcon = (type: string) => {
    const icons = {
      navigation: FileText,
      hero: Type,
      about: FileText,
      services: Star,
      team: Users,
      contact: MapPin,
      gallery: ImageIcon,
      features: Star,
      pricing: Star,
      footer: FileText
    };
    return icons[type as keyof typeof icons] || FileText;
  };

  const renderElementMetadata = (elementId: string) => {
    const metadata = elementMetadata[elementId];
    if (!metadata) return null;

    return (
      <Card className="absolute top-0 right-0 w-80 z-50 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Info className="h-4 w-4" />
            Section Metadata
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Type</p>
            <p className="text-sm">{metadata.type.charAt(0).toUpperCase() + metadata.type.slice(1)}</p>
          </div>
          
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Position</p>
            <p className="text-sm">Row {metadata.position.row + 1}, Parent: {metadata.position.parent}</p>
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Responsive Visibility</p>
            <div className="flex gap-2">
              <Badge variant={metadata.visibility.desktop ? 'default' : 'secondary'}>
                <Monitor className="h-3 w-3 mr-1" />
                Desktop
              </Badge>
              <Badge variant={metadata.visibility.tablet ? 'default' : 'secondary'}>
                <Tablet className="h-3 w-3 mr-1" />
                Tablet
              </Badge>
              <Badge variant={metadata.visibility.mobile ? 'default' : 'secondary'}>
                <Smartphone className="h-3 w-3 mr-1" />
                Mobile
              </Badge>
            </div>
          </div>

          {metadata.accessibility.missing && metadata.accessibility.missing.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">Accessibility Issues</p>
              {metadata.accessibility.missing.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-orange-600 text-sm">
                  <AlertTriangle className="h-3 w-3" />
                  {issue}
                </div>
              ))}
            </div>
          )}

          {metadata.seo.issues && metadata.seo.issues.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1">SEO Issues</p>
              {metadata.seo.issues.map((issue, index) => (
                <div key={index} className="flex items-center gap-2 text-red-600 text-sm">
                  <XCircle className="h-3 w-3" />
                  {issue}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderInlineEditor = (sectionId: string) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return null;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="absolute top-0 right-0 w-96 bg-white border shadow-xl rounded-lg z-50"
      >
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="content">
              <Edit3 className="h-4 w-4 mr-1" />
              Content
            </TabsTrigger>
            <TabsTrigger value="style">
              <PaintBucket className="h-4 w-4 mr-1" />
              Style
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="content" className="p-4 space-y-4">
            {section.type === 'hero' && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={section.content.title || ''}
                    onChange={(e) => updateSectionContent(sectionId, { title: e.target.value })}
                    placeholder="Enter hero title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Subtitle</label>
                  <Textarea
                    value={section.content.subtitle || ''}
                    onChange={(e) => updateSectionContent(sectionId, { subtitle: e.target.value })}
                    placeholder="Enter subtitle"
                    rows={2}
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Button Text</label>
                  <Input
                    value={section.content.buttonText || ''}
                    onChange={(e) => updateSectionContent(sectionId, { buttonText: e.target.value })}
                    placeholder="Enter button text"
                    className="mt-1"
                  />
                </div>
              </>
            )}
            
            {section.type === 'about' && (
              <>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Title</label>
                  <Input
                    value={section.content.title || ''}
                    onChange={(e) => updateSectionContent(sectionId, { title: e.target.value })}
                    placeholder="About section title"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground">Description</label>
                  <Textarea
                    value={section.content.description || ''}
                    onChange={(e) => updateSectionContent(sectionId, { description: e.target.value })}
                    placeholder="Tell your story"
                    rows={3}
                    className="mt-1"
                  />
                </div>
              </>
            )}
          </TabsContent>
          
          <TabsContent value="style" className="p-4 space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Device Visibility</label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Monitor className="h-4 w-4" />
                    <span className="text-sm">Desktop</span>
                  </div>
                  <Switch
                    checked={section.visibility?.desktop !== false}
                    onCheckedChange={() => toggleDeviceVisibility(sectionId, 'desktop')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Tablet className="h-4 w-4" />
                    <span className="text-sm">Tablet</span>
                  </div>
                  <Switch
                    checked={section.visibility?.tablet !== false}
                    onCheckedChange={() => toggleDeviceVisibility(sectionId, 'tablet')}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    <span className="text-sm">Mobile</span>
                  </div>
                  <Switch
                    checked={section.visibility?.mobile !== false}
                    onCheckedChange={() => toggleDeviceVisibility(sectionId, 'mobile')}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-2 block">Section Actions</label>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => duplicateSection(sectionId)}
                >
                  <Copy className="h-3 w-3 mr-1" />
                  Duplicate
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleSectionLock(sectionId)}
                >
                  {section.locked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
                  {section.locked ? 'Unlock' : 'Lock'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSection(sectionId)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    );
  };

  const renderSmartSuggestions = () => {
    if (smartSuggestions.length === 0) return null;

    return (
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white border shadow-xl rounded-lg p-4 max-w-sm"
        >
          <h3 className="font-medium mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-500" />
            Smart Suggestions
          </h3>
          <div className="space-y-2">
            {smartSuggestions.slice(0, 3).map((suggestion) => (
              <button
                key={suggestion.id}
                onClick={suggestion.action}
                className="w-full text-left p-2 rounded hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start gap-2">
                  <suggestion.icon className="h-4 w-4 mt-0.5 text-primary" />
                  <div>
                    <p className="font-medium text-sm">{suggestion.title}</p>
                    <p className="text-xs text-muted-foreground">{suggestion.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    );
  };

  const renderSectionPreview = (section: any, index: number) => {
    const isVisible = section.visibility?.[deviceMode] !== false;
    const isHovered = hoveredElement === section.id;
    const isSelected = selectedElement === section.id;
    const isLocked = section.locked;
    
    if (!isVisible) return null;

    const hoverStyles = isHovered && inspectionMode ? 'ring-2 ring-blue-500 ring-opacity-50' : '';
    const selectedStyles = isSelected ? 'ring-2 ring-primary' : '';
    
    return (
      <div
        key={section.id}
        className={`relative group transition-all ${hoverStyles} ${selectedStyles}`}
        onMouseEnter={() => inspectionMode && setHoveredElement(section.id)}
        onMouseLeave={() => setHoveredElement(null)}
        onClick={() => !isLocked && setSelectedElement(isSelected ? null : section.id)}
      >
        {/* Grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
        )}
        
        {/* Spacing guides */}
        {showSpacing && (
          <div className="absolute inset-0 border-2 border-dashed border-blue-300 pointer-events-none">
            <div className="absolute -top-4 left-0 text-xs text-blue-600 bg-blue-100 px-1 rounded">
              {section.type}
            </div>
          </div>
        )}

        {/* Section controls overlay */}
        <AnimatePresence>
          {(isHovered || isSelected) && inspectionMode && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute top-2 right-2 z-40 flex gap-1"
            >
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  moveSection(section.id, 'up');
                }}
                disabled={index === 0}
              >
                <ChevronUp className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  moveSection(section.id, 'down');
                }}
                disabled={index === (currentPage?.sections.length || 1) - 1}
              >
                <ChevronDown className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-6 w-6 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  duplicateSection(section.id);
                }}
              >
                <Copy className="h-3 w-3" />
              </Button>
              {isLocked ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionLock(section.id);
                  }}
                >
                  <Lock className="h-3 w-3" />
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  className="h-6 w-6 p-0"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(section.id);
                  }}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Locked indicator */}
        {isLocked && (
          <div className="absolute top-2 left-2 z-40">
            <Badge variant="secondary" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Locked
            </Badge>
          </div>
        )}

        {/* Section content */}
        {renderSectionContent(section)}
        
        {/* Metadata panel */}
        {isSelected && sidebarTab === 'inspector' && renderElementMetadata(section.id)}
        
        {/* Inline editor */}
        {isSelected && renderInlineEditor(section.id)}
      </div>
    );
  };

  const renderSectionContent = (section: any) => {
    switch (section.type) {
      case 'hero':
        return (
          <div 
            className="relative min-h-[500px] flex items-center justify-center text-white"
            style={{ 
              backgroundImage: section.content.backgroundImage ? `url(${section.content.backgroundImage})` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="relative text-center max-w-4xl mx-auto px-6">
              <h1 className="text-5xl font-bold mb-6">{section.content.title}</h1>
              <p className="text-xl mb-8 opacity-90">{section.content.subtitle}</p>
              {section.content.buttonText && (
                <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                  {section.content.buttonText}
                </button>
              )}
            </div>
          </div>
        );
      
      case 'about':
        return (
          <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">{section.content.title}</h2>
                <p className="text-gray-600 leading-relaxed">{section.content.description}</p>
              </div>
              {section.content.image && (
                <div className="relative">
                  <ImageWithFallback
                    src={section.content.image}
                    alt={section.content.imageAlt || section.content.title}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        );
      
      case 'contact':
        return (
          <div className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{section.content.title}</h2>
              <p className="text-gray-600 mb-8">{section.content.description}</p>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-2">📧</div>
                  <p className="font-medium">{section.content.email}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-2">📞</div>
                  <p className="font-medium">{section.content.phone}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="text-blue-600 mb-2">📍</div>
                  <p className="font-medium whitespace-pre-line">{section.content.address}</p>
                </div>
              </div>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="py-12 px-6 bg-gray-100 border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <h3 className="font-medium">{section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section</h3>
              <p className="text-sm">Click to edit content</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-white sticky top-0 z-50">
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
                Unsaved changes
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Device Preview */}
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

            {/* Visual Helpers */}
            <Button
              variant={showGrid ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={showSpacing ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowSpacing(!showSpacing)}
            >
              <Move className="h-4 w-4" />
            </Button>

            <Button
              variant={inspectionMode ? 'default' : 'outline'}
              size="sm"
              onClick={() => setInspectionMode(!inspectionMode)}
            >
              <MousePointer2 className="h-4 w-4" />
            </Button>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
            <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
              <Redo className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" onClick={handleSave} disabled={!hasUnsavedChanges}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>

            <Button onClick={() => onPublish(currentProject)}>
              <Rocket className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        {sidebarVisible && (
          <div className="w-80 border-r bg-white overflow-y-auto">
            <div className="p-6">
              <Tabs value={sidebarTab} onValueChange={(v) => setSidebarTab(v as any)} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="inspector">
                    <Info className="h-4 w-4 mr-1" />
                    Inspect
                  </TabsTrigger>
                  <TabsTrigger value="content">
                    <Edit3 className="h-4 w-4 mr-1" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="ai">
                    <Bot className="h-4 w-4 mr-1" />
                    AI
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="inspector" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-medium mb-4">Element Inspector</h3>
                    {selectedElement ? (
                      <div className="space-y-4">
                        <div className="p-3 border rounded-lg">
                          <p className="text-sm font-medium">Selected Element</p>
                          <p className="text-xs text-muted-foreground">
                            {currentPage?.sections.find(s => s.id === selectedElement)?.type} section
                          </p>
                        </div>
                        
                        <div>
                          <p className="text-sm font-medium mb-2">Quick Actions</p>
                          <div className="grid grid-cols-2 gap-2">
                            <Button variant="outline" size="sm" onClick={() => duplicateSection(selectedElement)}>
                              <Copy className="h-3 w-3 mr-1" />
                              Duplicate
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => deleteSection(selectedElement)}>
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">Click on any section to inspect it</p>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium mb-4">SEO Score</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Overall Score</span>
                        <Badge variant={seoScore.score > 80 ? 'default' : 'secondary'}>
                          {seoScore.score}/100
                        </Badge>
                      </div>
                      <Progress value={seoScore.score} className="h-2" />
                      {seoScore.issues.length > 0 && (
                        <div className="mt-2">
                          <p className="text-xs font-medium text-muted-foreground mb-1">Issues</p>
                          {seoScore.issues.map((issue, index) => (
                            <div key={index} className="flex items-center gap-2 text-orange-600 text-xs">
                              <AlertCircle className="h-3 w-3" />
                              {issue}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="space-y-6 mt-6">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-medium">Page Sections</h3>
                      <Button size="sm" onClick={() => addSection('hero')}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add
                      </Button>
                    </div>
                    
                    <div className="space-y-2">
                      {currentPage?.sections.map((section, index) => {
                        const Icon = getSectionIcon(section.type);
                        return (
                          <div
                            key={section.id}
                            className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                              selectedElement === section.id ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                            }`}
                            onClick={() => setSelectedElement(section.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <Icon className="h-4 w-4" />
                                <span className="font-medium text-sm">
                                  {section.type.charAt(0).toUpperCase() + section.type.slice(1)}
                                </span>
                                {section.locked && <Lock className="h-3 w-3 text-muted-foreground" />}
                              </div>
                              <div className="flex gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSection(section.id, 'up');
                                  }}
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    moveSection(section.id, 'down');
                                  }}
                                  disabled={index === (currentPage?.sections.length || 1) - 1}
                                >
                                  <ChevronDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="mt-2 flex gap-1">
                              <Badge variant={section.visibility?.desktop !== false ? 'default' : 'secondary'} className="text-xs">
                                <Monitor className="h-2 w-2 mr-1" />
                                D
                              </Badge>
                              <Badge variant={section.visibility?.tablet !== false ? 'default' : 'secondary'} className="text-xs">
                                <Tablet className="h-2 w-2 mr-1" />
                                T
                              </Badge>
                              <Badge variant={section.visibility?.mobile !== false ? 'default' : 'secondary'} className="text-xs">
                                <Smartphone className="h-2 w-2 mr-1" />
                                M
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {/* Quick Add Buttons */}
                    <div className="mt-4 space-y-2">
                      <p className="text-sm font-medium text-muted-foreground">Quick Add:</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline" size="sm" onClick={() => addSection('hero')}>
                          <Type className="h-3 w-3 mr-1" />
                          Hero
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addSection('about')}>
                          <FileText className="h-3 w-3 mr-1" />
                          About
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addSection('services')}>
                          <Star className="h-3 w-3 mr-1" />
                          Services
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => addSection('contact')}>
                          <MapPin className="h-3 w-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="ai" className="space-y-6 mt-6">
                  <div>
                    <h3 className="font-medium mb-4 flex items-center gap-2">
                      <Bot className="h-5 w-5" />
                      AI Assistant
                    </h3>
                    <div className="space-y-4">
                      <Button variant="outline" className="w-full justify-start">
                        <Zap className="h-4 w-4 mr-2" />
                        Generate Content
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Palette className="h-4 w-4 mr-2" />
                        Suggest Colors
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Target className="h-4 w-4 mr-2" />
                        SEO Optimize
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Accessibility Check
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className={`mx-auto transition-all duration-300 ${getDeviceWidth()}`}>
            <div className="bg-white min-h-full shadow-sm">
              {currentPage?.sections.map((section, index) => 
                renderSectionPreview(section, index)
              )}
              
              {/* Empty state */}
              {(!currentPage?.sections || currentPage.sections.length === 0) && (
                <div className="flex items-center justify-center min-h-[60vh]">
                  <div className="text-center">
                    <Layers className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-medium mb-2">Start Building Your Page</h3>
                    <p className="text-muted-foreground mb-4">Add sections to create your website</p>
                    <Button onClick={() => addSection('hero')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Section
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Smart Suggestions */}
      {renderSmartSuggestions()}

      {/* Sidebar Toggle */}
      <Button
        variant="outline"
        size="sm"
        className="fixed top-1/2 left-0 transform -translate-y-1/2 z-40"
        onClick={() => setSidebarVisible(!sidebarVisible)}
      >
        {sidebarVisible ? '←' : '→'}
      </Button>
    </div>
  );
}