import React, { useState, useRef, useCallback, useEffect } from 'react';
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
import { Slider } from './ui/slider';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { 
  Save, 
  Eye, 
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Type,
  FileText,
  Users,
  Star,
  MapPin,
  Image as ImageIcon,
  Globe,
  Settings,
  Layers,
  Plus,
  Copy,
  Trash2,
  Move,
  GripVertical,
  Edit3,
  Palette,
  Layout,
  Smartphone as MobileIcon,
  RotateCcw,
  Redo,
  Search,
  Grid3X3,
  MousePointer2,
  ChevronUp,
  ChevronDown,
  Lock,
  Unlock,
  Zap,
  PaintBucket,
  Upload,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Bold,
  Italic,
  Link,
  List,
  ExternalLink,
  History,
  Wand2,
  Tags,
  Crop,
  Layers3,
  Target,
  Sparkles,
  Timer,
  Undo2
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';
import { MediaManager } from './MediaManager';
import { SEOPanel } from './SEOPanel';
import { RichTextEditor } from './RichTextEditor';
import { toast } from 'sonner';
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
        styles?: {
          background?: string;
          backgroundImage?: string;
          padding?: string;
          textAlign?: 'left' | 'center' | 'right';
          backgroundColor?: string;
        };
        visibility?: {
          desktop: boolean;
          tablet: boolean;
          mobile: boolean;
        };
        locked?: boolean;
      }>;
    }>;
    globalStyles?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
      buttonStyle?: string;
    };
  };
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
}

interface AdvancedSimpleTemplateEditorProps {
  project: UserProject;
  onSave: (project: UserProject) => void;
  onPublish: (project: UserProject) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

interface SectionTemplate {
  id: string;
  type: string;
  name: string;
  category: string;
  icon: any;
  description: string;
  defaultContent: any;
}

export function AdvancedSimpleTemplateEditor({ project, onSave, onPublish, onNavigate }: AdvancedSimpleTemplateEditorProps) {
  const [currentProject, setCurrentProject] = useState<UserProject>(project);
  const [currentPageId, setCurrentPageId] = useState(project.content.pages[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [inspectionMode, setInspectionMode] = useState(true);
  // Keep local state in sync when parent passes a new project (e.g., temp -> persisted id)
  useEffect(() => {
    setCurrentProject(project);
    if (project.content?.pages?.length) {
      const stillExists = project.content.pages.some(p => p.id === currentPageId);
      if (!stillExists) {
        setCurrentPageId(project.content.pages[0].id);
      }
    }
  }, [project]);
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [sidebarTab, setSidebarTab] = useState<'content' | 'design' | 'sections' | 'seo' | 'settings'>('content');
  const [showGrid, setShowGrid] = useState(false);
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, field: string} | null>(null);
  const [undoStack, setUndoStack] = useState<any[]>([]);
  const [redoStack, setRedoStack] = useState<any[]>([]);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const [dragOverSection, setDragOverSection] = useState<string | null>(null);
  
  // Enhanced Features State
  const [hoveredElement, setHoveredElement] = useState<{ sectionId: string; type: string; index?: number } | null>(null);
  const [inlineToolbarPosition, setInlineToolbarPosition] = useState<{ x: number; y: number } | null>(null);
  const [showElementLabels, setShowElementLabels] = useState(true);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [globalTheme, setGlobalTheme] = useState('default');
  const [sectionVariants, setSectionVariants] = useState<{ [key: string]: any }>({});
  const [reusableBlocks, setReusableBlocks] = useState<any[]>([]);
  const [inlineEditingId, setInlineEditingId] = useState<string | null>(null);
  const [richTextMode, setRichTextMode] = useState(false);
  
  // Animation Features State
  const [recentlyAddedSections, setRecentlyAddedSections] = useState<Set<string>>(new Set());
  const [deletedSections, setDeletedSections] = useState<Array<{id: string, section: any, index: number, timestamp: number}>>([]);
  const [animationSettings, setAnimationSettings] = useState({
    duration: 250,
    enableAnimations: true,
    autoScroll: true,
    showUndoToasts: true
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragPreview, setDragPreview] = useState<{x: number, y: number, section: any} | null>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Keep internal state in sync if parent supplies a different project instance (e.g., temp -> real ID after create)
  useEffect(() => {
    if (project.id !== currentProject.id) {
      // Preserve current page if still exists
      const newFirstPage = project.content.pages[0]?.id || '';
      setCurrentProject(project);
      setCurrentPageId(prev => project.content.pages.some(p => p.id === prev) ? prev : newFirstPage);
    }
  }, [project, currentProject.id]);

  const currentPage = currentProject.content.pages.find(page => page.id === currentPageId);

  // Theme presets
  const themePresets = {
    default: {
      name: 'Default',
      primaryColor: '#3b82f6',
      secondaryColor: '#64748b',
      fontFamily: 'Inter'
    },
    modern: {
      name: 'Modern',
      primaryColor: '#000000',
      secondaryColor: '#f3f4f6',
      fontFamily: 'Poppins'
    },
    warm: {
      name: 'Warm',
      primaryColor: '#f59e0b',
      secondaryColor: '#fbbf24',
      fontFamily: 'Open Sans'
    },
    elegant: {
      name: 'Elegant',
      primaryColor: '#7c3aed',
      secondaryColor: '#a78bfa',
      fontFamily: 'Playfair Display'
    }
  };

  // Section variants for different layouts
  const getSectionVariants = (sectionType: string) => {
    const variants: { [key: string]: any } = {
      hero: {
        standard: { name: 'Standard', layout: 'center' },
        split: { name: 'Split Layout', layout: 'split' },
        minimal: { name: 'Minimal', layout: 'minimal' },
        video: { name: 'Video Background', layout: 'video' }
      },
      features: {
        grid: { name: 'Grid Layout', columns: 3 },
        list: { name: 'List Layout', columns: 1 },
        cards: { name: 'Card Layout', style: 'cards' }
      },
      team: {
        grid: { name: 'Grid Layout', columns: 4 },
        carousel: { name: 'Carousel', style: 'carousel' },
        list: { name: 'List Layout', columns: 2 }
      }
    };
    return variants[sectionType] || {};
  };

  // Section templates for the library
  const sectionTemplates: SectionTemplate[] = [
    {
      id: 'hero',
      type: 'hero',
      name: 'Hero Banner',
      category: 'Headers',
      icon: Type,
      description: 'Eye-catching header section with title and CTA',
      defaultContent: {
        title: 'Your Amazing Headline',
        subtitle: 'Compelling subtitle that describes your value proposition',
        buttonText: 'Get Started',
        backgroundImage: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop'
      }
    },
    {
      id: 'about',
      type: 'about',
      name: 'About Section',
      category: 'Content',
      icon: FileText,
      description: 'Tell your story with text and image',
      defaultContent: {
        title: 'About Us',
        description: 'Tell your story and connect with your audience',
        image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=400&fit=crop'
      }
    },
    {
      id: 'features',
      type: 'features',
      name: 'Features Grid',
      category: 'Content',
      icon: Star,
      description: 'Highlight key features or benefits',
      defaultContent: {
        title: 'Our Features',
        features: [
          { icon: '⚡', title: 'Fast', description: 'Lightning fast performance' },
          { icon: '🔒', title: 'Secure', description: 'Bank-level security' },
          { icon: '📱', title: 'Mobile', description: 'Mobile-first design' }
        ]
      }
    },
    {
      id: 'services',
      type: 'services',
      name: 'Services',
      category: 'Business',
      icon: Star,
      description: 'Showcase your services or products',
      defaultContent: {
        title: 'Our Services',
        description: 'What we offer to help you succeed',
        services: [
          {
            name: 'Service One',
            description: 'Description of your first service',
            price: 'From $99',
            image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop'
          }
        ]
      }
    },
    {
      id: 'team',
      type: 'team',
      name: 'Team Members',
      category: 'Business',
      icon: Users,
      description: 'Introduce your team',
      defaultContent: {
        title: 'Meet Our Team',
        description: 'Our experienced professionals',
        members: [
          {
            name: 'John Doe',
            role: 'CEO',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
            bio: 'Experienced leader with 10+ years in the industry'
          }
        ]
      }
    },
    {
      id: 'pricing',
      type: 'pricing',
      name: 'Pricing Plans',
      category: 'Business',
      icon: Star,
      description: 'Display your pricing options',
      defaultContent: {
        title: 'Choose Your Plan',
        plans: [
          {
            name: 'Basic',
            price: '$29',
            period: '/month',
            features: ['Feature 1', 'Feature 2', 'Feature 3'],
            popular: false
          },
          {
            name: 'Pro',
            price: '$59',
            period: '/month',
            features: ['Everything in Basic', 'Feature 4', 'Feature 5'],
            popular: true
          }
        ]
      }
    },
    {
      id: 'gallery',
      type: 'gallery',
      name: 'Image Gallery',
      category: 'Media',
      icon: ImageIcon,
      description: 'Showcase images in a grid',
      defaultContent: {
        title: 'Gallery',
        items: [
          {
            title: 'Image 1',
            image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop',
            category: 'Design'
          }
        ]
      }
    },
    {
      id: 'testimonials',
      type: 'testimonials',
      name: 'Testimonials',
      category: 'Social Proof',
      icon: Star,
      description: 'Customer reviews and testimonials',
      defaultContent: {
        title: 'What Our Customers Say',
        testimonials: [
          {
            name: 'Jane Smith',
            role: 'Customer',
            content: 'Amazing service and great results!',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b332c2f2?w=300&h=300&fit=crop'
          }
        ]
      }
    },
    {
      id: 'contact',
      type: 'contact',
      name: 'Contact Info',
      category: 'Contact',
      icon: MapPin,
      description: 'Contact information and details',
      defaultContent: {
        title: 'Contact Us',
        description: 'Get in touch with us',
        email: 'hello@company.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business St\nYour City, State 12345'
      }
    },
    {
      id: 'navigation',
      type: 'navigation',
      name: 'Navigation',
      category: 'Navigation',
      icon: FileText,
      description: 'Site navigation header',
      defaultContent: {
        logo: 'Your Logo',
        menuItems: ['Home', 'About', 'Services', 'Contact']
      }
    },
    {
      id: 'footer',
      type: 'footer',
      name: 'Footer',
      category: 'Navigation',
      icon: FileText,
      description: 'Site footer with links and info',
      defaultContent: {
        companyName: 'Your Company',
        description: 'Your company description',
        links: ['Privacy', 'Terms', 'Contact']
      }
    },
    {
      id: 'faq',
      type: 'faq',
      name: 'FAQ Section',
      category: 'Content',
      icon: FileText,
      description: 'Frequently asked questions',
      defaultContent: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions',
        faqs: [
          {
            question: 'How do I get started?',
            answer: 'Simply sign up and follow our onboarding process.'
          },
          {
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit cards and PayPal.'
          }
        ]
      }
    },
    {
      id: 'blog',
      type: 'blog',
      name: 'Blog Section',
      category: 'Content',
      icon: FileText,
      description: 'Blog posts and articles',
      defaultContent: {
        title: 'Latest Blog Posts',
        description: 'Stay updated with our latest insights',
        posts: [
          {
            title: 'Getting Started Guide',
            excerpt: 'Learn the basics in this comprehensive guide',
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
            date: '2024-01-15',
            author: 'John Doe'
          }
        ]
      }
    },
    {
      id: 'portfolio',
      type: 'portfolio',
      name: 'Portfolio',
      category: 'Media',
      icon: ImageIcon,
      description: 'Showcase your work and projects',
      defaultContent: {
        title: 'My Portfolio',
        description: 'A collection of my best work',
        projects: [
          {
            title: 'Project One',
            category: 'Web Design',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
            description: 'Modern web design project'
          }
        ]
      }
    },
    {
      id: 'menu',
      type: 'menu',
      name: 'Menu',
      category: 'Business',
      icon: FileText,
      description: 'Restaurant or cafe menu',
      defaultContent: {
        title: 'Our Menu',
        description: 'Fresh ingredients, exceptional flavors',
        categories: [
          {
            name: 'Appetizers',
            items: [
              {
                name: 'Caesar Salad',
                description: 'Fresh romaine with parmesan',
                price: '$12'
              }
            ]
          }
        ]
      }
    },
    {
      id: 'locations',
      type: 'locations',
      name: 'Locations',
      category: 'Business',
      icon: MapPin,
      description: 'Business locations and addresses',
      defaultContent: {
        title: 'Our Locations',
        description: 'Visit us at any of our convenient locations',
        locations: [
          {
            name: 'Downtown Location',
            address: '123 Main Street\nDowntown, NY 10001',
            phone: '(555) 123-4567',
            hours: 'Mon-Fri: 9AM-6PM',
            image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop'
          }
        ]
      }
    }
  ];

  // Undo/Redo functionality
  const saveToUndoStack = useCallback(() => {
    setUndoStack(prev => [...prev.slice(-19), JSON.parse(JSON.stringify(currentProject.content))]);
    setRedoStack([]);
  }, [currentProject.content]);

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [...prev, JSON.parse(JSON.stringify(currentProject.content))]);
      setUndoStack(prev => prev.slice(0, -1));
      setCurrentProject(prev => ({
        ...prev,
        content: previousState
      }));
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
    }
  };



  const updateProject = useCallback((updater: (project: UserProject) => UserProject) => {
    saveToUndoStack();
    setCurrentProject(updater);
  }, [saveToUndoStack]);

  // Enhanced hover inspection
  const handleElementHover = useCallback((sectionId: string, event: React.MouseEvent, elementType?: string, elementIndex?: number) => {
    if (inspectionMode) {
      setHoveredSection(sectionId);
      setHoveredElement({ 
        sectionId, 
        type: elementType || 'section', 
        index: elementIndex 
      });
      
      // Calculate inline toolbar position
      const rect = (event.target as HTMLElement).getBoundingClientRect();
      setInlineToolbarPosition({
        x: rect.left + rect.width / 2,
        y: rect.top - 10
      });
    }
  }, [inspectionMode]);

  const handleElementLeave = useCallback(() => {
    if (inspectionMode) {
      setHoveredElement(null);
      setInlineToolbarPosition(null);
    }
  }, [inspectionMode]);

  // Apply global theme
  const applyTheme = (themeName: string) => {
    const theme = themePresets[themeName as keyof typeof themePresets];
    if (theme) {
      updateProject(project => ({
        ...project,
        content: {
          ...project.content,
          globalStyles: {
            ...project.content.globalStyles,
            primaryColor: theme.primaryColor,
            secondaryColor: theme.secondaryColor,
            fontFamily: theme.fontFamily
          }
        }
      }));
      setGlobalTheme(themeName);
      toast.success(`Applied ${theme.name} theme`);
    }
  };

  // Save reusable block
  const saveAsReusableBlock = (sectionId: string) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (section) {
      const blockName = prompt('Enter a name for this reusable block:', `${section.type} block`);
      if (blockName) {
        const newBlock = {
          id: `block-${Date.now()}`,
          name: blockName,
          type: section.type,
          content: JSON.parse(JSON.stringify(section.content)),
          styles: JSON.parse(JSON.stringify(section.styles || {}))
        };
        setReusableBlocks(prev => [...prev, newBlock]);
        toast.success('Block saved for reuse');
      }
    }
  };

  const handleSave = () => {
    const updatedProject = {
      ...currentProject,
      lastModified: new Date().toISOString()
    };
    setCurrentProject(updatedProject);
    onSave(updatedProject);
    toast.success('Project saved successfully!');
  };

  const handlePublish = () => {
    const updatedProject = {
      ...currentProject,
      lastModified: new Date().toISOString()
    };
    onPublish(updatedProject);
    toast.success('Project published successfully!');
  };

  const updateSectionContent = (sectionId: string, newContent: any) => {
    updateProject(project => ({
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages.map(page => ({
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId
              ? { ...section, content: { ...section.content, ...newContent } }
              : section
          )
        }))
      }
    }));
  };

  const updateSectionStyles = (sectionId: string, newStyles: any) => {
    updateProject(project => ({
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages.map(page => ({
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId
              ? { ...section, styles: { ...section.styles, ...newStyles } }
              : section
          )
        }))
      }
    }));
  };

  const addSection = (template: SectionTemplate) => {
    const newSection = {
      id: `section-${Date.now()}`,
      type: template.type as any,
      content: template.defaultContent,
      styles: {},
      visibility: { desktop: true, tablet: true, mobile: true },
      locked: false
    };

    updateProject(project => {
      const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return project;

      const sections = [...project.content.pages[pageIndex].sections];
      sections.push(newSection);

      const newPages = [...project.content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };

      return { ...project, content: { ...project.content, pages: newPages } };
    });

    // Animation: Mark as recently added for highlight effect
    setRecentlyAddedSections(prev => new Set([...prev, newSection.id]));
    
    // Animation: Auto-scroll to new section after DOM update
    if (animationSettings.autoScroll) {
      setTimeout(() => {
        const element = document.getElementById(`section-${newSection.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    // Remove highlight after animation duration
    setTimeout(() => {
      setRecentlyAddedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(newSection.id);
        return newSet;
      });
    }, 2000);

    setSelectedSection(newSection.id);
    setShowSectionLibrary(false);
    toast.success(`${template.name} section added`);
  };

  const duplicateSection = (sectionId: string) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const duplicatedSection = {
      ...section,
      id: `section-${Date.now()}`,
    };

    updateProject(project => {
      const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return project;

      const sections = [...project.content.pages[pageIndex].sections];
      const sectionIndex = sections.findIndex(s => s.id === sectionId);
      sections.splice(sectionIndex + 1, 0, duplicatedSection);

      const newPages = [...project.content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };

      return { ...project, content: { ...project.content, pages: newPages } };
    });

    // Animation: Mark as recently added for highlight effect
    setRecentlyAddedSections(prev => new Set([...prev, duplicatedSection.id]));
    
    // Animation: Auto-scroll to duplicated section
    if (animationSettings.autoScroll) {
      setTimeout(() => {
        const element = document.getElementById(`section-${duplicatedSection.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    // Remove highlight after animation duration
    setTimeout(() => {
      setRecentlyAddedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(duplicatedSection.id);
        return newSet;
      });
    }, 2000);

    toast.success('Section duplicated');
  };

  const deleteSection = (sectionId: string) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const sectionIndex = currentPage.sections.findIndex(s => s.id === sectionId);

    // Store deleted section for undo functionality
    const deletedSection = {
      id: sectionId,
      section: { ...section },
      index: sectionIndex,
      timestamp: Date.now()
    };

    updateProject(project => ({
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages.map(page => ({
          ...page,
          sections: page.sections.filter(s => s.id !== sectionId)
        }))
      }
    }));

    // Add to deleted sections for undo
    setDeletedSections(prev => [...prev, deletedSection]);

    // Show undo toast if enabled
    if (animationSettings.showUndoToasts) {
      const undoToast = toast.success('Section deleted', {
        action: {
          label: 'Undo',
          onClick: () => undoDeleteSection(deletedSection.id)
        },
        duration: 5000
      });
    } else {
      toast.success('Section deleted');
    }

    // Clean up deleted sections older than 10 minutes
    setTimeout(() => {
      setDeletedSections(prev => 
        prev.filter(deleted => Date.now() - deleted.timestamp < 600000)
      );
    }, 600000);

    if (selectedSection === sectionId) {
      setSelectedSection(null);
    }
  };

  const undoDeleteSection = (deletedSectionId: string) => {
    const deletedSection = deletedSections.find(d => d.id === deletedSectionId);
    if (!deletedSection) return;

    updateProject(project => {
      const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return project;

      const sections = [...project.content.pages[pageIndex].sections];
      sections.splice(deletedSection.index, 0, deletedSection.section);

      const newPages = [...project.content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };

      return { ...project, content: { ...project.content, pages: newPages } };
    });

    // Remove from deleted sections
    setDeletedSections(prev => prev.filter(d => d.id !== deletedSectionId));
    
    // Mark as recently added for highlight effect
    setRecentlyAddedSections(prev => new Set([...prev, deletedSection.section.id]));
    
    // Auto-scroll to restored section
    if (animationSettings.autoScroll) {
      setTimeout(() => {
        const element = document.getElementById(`section-${deletedSection.section.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
    
    // Remove highlight after animation duration
    setTimeout(() => {
      setRecentlyAddedSections(prev => {
        const newSet = new Set(prev);
        newSet.delete(deletedSection.section.id);
        return newSet;
      });
    }, 2000);

    toast.success('Section restored');
  };

  const moveSection = (sectionId: string, direction: 'up' | 'down') => {
    updateProject(project => {
      const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return project;

      const sections = [...project.content.pages[pageIndex].sections];
      const currentIndex = sections.findIndex(s => s.id === sectionId);

      if (currentIndex === -1) return project;

      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      if (newIndex < 0 || newIndex >= sections.length) return project;

      [sections[currentIndex], sections[newIndex]] = [sections[newIndex], sections[currentIndex]];

      const newPages = [...project.content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };

      return { ...project, content: { ...project.content, pages: newPages } };
    });
  };

  const toggleSectionLock = (sectionId: string) => {
    updateProject(project => ({
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages.map(page => ({
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId
              ? { ...section, locked: !section.locked }
              : section
          )
        }))
      }
    }));
  };

  const toggleDeviceVisibility = (sectionId: string, device: 'desktop' | 'tablet' | 'mobile') => {
    updateProject(project => ({
      ...project,
      content: {
        ...project.content,
        pages: project.content.pages.map(page => ({
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
      }
    }));
  };

  const handleImageUpload = (sectionId: string, field: string) => {
    setCurrentImageField({ sectionId, field });
    setIsMediaManagerOpen(true);
  };

  const handleMediaSelect = (media: any) => {
    if (currentImageField) {
      const { sectionId, field } = currentImageField;
      
      // Handle nested field paths like 'services.0.image'
      if (field.includes('.')) {
        const fieldParts = field.split('.');
        const section = currentPage?.sections.find(s => s.id === sectionId);
        if (section) {
          const arrayField = fieldParts[0];
          const itemIndex = parseInt(fieldParts[1]);
          const itemField = fieldParts[2];
          
          updateArrayItem(sectionId, arrayField, itemIndex, { [itemField]: media.url });
        }
      } else {
        // Handle simple field paths
        updateSectionContent(sectionId, { [field]: media.url });
      }
      
      setCurrentImageField(null);
    }
    setIsMediaManagerOpen(false);
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
      testimonials: Star,
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

  // Inline toolbar component
  const renderInlineToolbar = () => {
    if (!inlineToolbarPosition || !hoveredElement) return null;

    return (
      <div 
        className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-1 flex items-center gap-1"
        style={{
          left: inlineToolbarPosition.x - 100,
          top: inlineToolbarPosition.y - 50,
          transform: 'translateX(-50%)'
        }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setSelectedSection(hoveredElement.sectionId)}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => duplicateSection(hoveredElement.sectionId)}
              >
                <Copy className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Duplicate</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => saveAsReusableBlock(hoveredElement.sectionId)}
              >
                <Layers3 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Save as Block</TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => deleteSection(hoveredElement.sectionId)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Delete</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  };

  // Enhanced Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, sectionId: string) => {
    setDraggedSection(sectionId);
    setIsDragging(true);
    
    // Create drag preview
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (section) {
      setDragPreview({
        x: e.clientX,
        y: e.clientY,
        section
      });
    }
    
    // Set drag effect
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', sectionId);
  };

  const handleDragOver = (e: React.DragEvent, sectionId: string) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverSection(sectionId);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragPreview(null);
    setDraggedSection(null);
    setDragOverSection(null);
  };

  const handleDrop = (e: React.DragEvent, targetSectionId: string) => {
    e.preventDefault();
    
    if (!draggedSection || draggedSection === targetSectionId) {
      handleDragEnd();
      return;
    }

    updateProject(project => {
      const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
      if (pageIndex === -1) return project;

      const sections = [...project.content.pages[pageIndex].sections];
      const draggedIndex = sections.findIndex(s => s.id === draggedSection);
      const targetIndex = sections.findIndex(s => s.id === targetSectionId);

      if (draggedIndex === -1 || targetIndex === -1) return project;

      const [removed] = sections.splice(draggedIndex, 1);
      sections.splice(targetIndex, 0, removed);

      const newPages = [...project.content.pages];
      newPages[pageIndex] = { ...newPages[pageIndex], sections };

      return { ...project, content: { ...project.content, pages: newPages } };
    });

    handleDragEnd();
    toast.success('Section reordered');
  };

  // Handle mouse move for drag preview
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (dragPreview) {
      setDragPreview(prev => prev ? {
        ...prev,
        x: e.clientX,
        y: e.clientY
      } : null);
    }
  }, [dragPreview]);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      return () => document.removeEventListener('mousemove', handleMouseMove);
    }
  }, [isDragging, handleMouseMove]);

  // Add/remove array items for dynamic content
  const addArrayItem = (sectionId: string, arrayField: string, defaultItem: any) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const currentArray = section.content[arrayField] || [];
    const newArray = [...currentArray, { ...defaultItem, id: Date.now() }];
    
    updateSectionContent(sectionId, { [arrayField]: newArray });
  };

  const updateArrayItem = (sectionId: string, arrayField: string, itemIndex: number, updates: any) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const currentArray = section.content[arrayField] || [];
    const newArray = [...currentArray];
    newArray[itemIndex] = { ...newArray[itemIndex], ...updates };
    
    updateSectionContent(sectionId, { [arrayField]: newArray });
  };

  const removeArrayItem = (sectionId: string, arrayField: string, itemIndex: number) => {
    const section = currentPage?.sections.find(s => s.id === sectionId);
    if (!section) return;

    const currentArray = section.content[arrayField] || [];
    const newArray = currentArray.filter((_, index) => index !== itemIndex);
    
    updateSectionContent(sectionId, { [arrayField]: newArray });
  };

  // Enhanced Section rendering with animations
  const renderSectionPreview = (section: any, index: number) => {
    const isVisible = section.visibility?.[deviceMode] !== false;
    const isHovered = hoveredSection === section.id;
    const isSelected = selectedSection === section.id;
    const isLocked = section.locked;
    const isDraggedOver = dragOverSection === section.id;
    const isRecentlyAdded = recentlyAddedSections.has(section.id);
    const isDraggedItem = draggedSection === section.id;
    
    if (!isVisible && deviceMode !== 'desktop') return null;

    const sectionStyles = {
      ...section.styles,
      opacity: !isVisible ? 0.3 : isDraggedItem ? 0.5 : 1,
    };

    return (
      <motion.div
        key={section.id}
        id={`section-${section.id}`}
        initial={animationSettings.enableAnimations ? { 
          opacity: 0, 
          y: 20, 
          scale: 0.95 
        } : false}
        animate={{ 
          opacity: !isVisible ? 0.3 : isDraggedItem ? 0.5 : 1, 
          y: 0, 
          scale: isDraggedOver ? 1.02 : 1,
          boxShadow: isRecentlyAdded 
            ? '0 0 20px rgba(59, 130, 246, 0.5)' 
            : isDraggedOver 
            ? '0 4px 20px rgba(34, 197, 94, 0.3)'
            : '0 0 0px rgba(0, 0, 0, 0)'
        }}
        exit={animationSettings.enableAnimations ? { 
          opacity: 0, 
          y: -20, 
          scale: 0.95,
          transition: { duration: animationSettings.duration / 1000 }
        } : false}
        transition={{ 
          duration: animationSettings.duration / 1000,
          ease: "easeInOut"
        }}
        layout={animationSettings.enableAnimations}
        onMouseEnter={(e) => handleElementHover(section.id, e, formatSectionTitle(section.type))}
        onMouseLeave={handleElementLeave}
        className={`relative group transition-all ${
          isHovered && inspectionMode ? 'ring-2 ring-blue-400 ring-opacity-50' : ''
        } ${
          isSelected ? 'ring-2 ring-primary' : ''
        } ${
          isDraggedOver ? 'ring-2 ring-green-400 bg-green-50' : ''
        } ${
          isLocked ? 'opacity-75' : ''
        } ${
          isRecentlyAdded ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}
        style={sectionStyles}
        onClick={() => !isLocked && setSelectedSection(isSelected ? null : section.id)}
        draggable={!isLocked && animationSettings.enableAnimations}
        onDragStart={(e) => handleDragStart(e, section.id)}
        onDragOver={(e) => handleDragOver(e, section.id)}
        onDragEnd={handleDragEnd}
        onDrop={(e) => handleDrop(e, section.id)}
      >
        {/* Grid overlay */}
        {showGrid && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-full border-2 border-dashed border-blue-300 opacity-30" />
            <div className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-br">
              {formatSectionTitle(section.type)}
            </div>
          </div>
        )}

        {/* Section controls overlay */}
        <AnimatePresence>
          {(isHovered || isSelected) && inspectionMode && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-2 right-2 z-40 flex gap-1 bg-white shadow-lg rounded-lg p-1"
            >
              {!isLocked && (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.id, 'up');
                    }}
                    disabled={index === 0}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      moveSection(section.id, 'down');
                    }}
                    disabled={index === (currentPage?.sections.length || 1) - 1}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0"
                    onClick={(e) => {
                      e.stopPropagation();
                      duplicateSection(section.id);
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button
                size="sm"
                variant="ghost"
                className="h-8 w-8 p-0"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleSectionLock(section.id);
                }}
              >
                {isLocked ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              </Button>
              {!isLocked && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSection(section.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
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

        {/* Drag handle */}
        {isSelected && !isLocked && (
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2 z-40">
            <div className="bg-white shadow-lg rounded p-1 cursor-move">
              <GripVertical className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* Enhanced element labels */}
        {showElementLabels && isHovered && inspectionMode && (
          <div className="absolute bottom-2 left-2 z-40">
            <Badge variant="default" className="text-xs bg-blue-500">
              <div className="flex items-center gap-1">
                {React.createElement(getSectionIcon(section.type), { className: "h-3 w-3" })}
                {formatSectionTitle(section.type)}
              </div>
            </Badge>
          </div>
        )}

        {/* Section content */}
        {renderSectionContent(section)}
      </motion.div>
    );
  };

  const renderSectionContent = (section: any) => {
    const styles = section.styles || {};
    
    // Build comprehensive style classes and inline styles
    const buildSectionClasses = (baseClasses: string = "relative") => {
      const classes = [baseClasses];
      
      if (styles.fontSize) classes.push(styles.fontSize);
      if (styles.fontWeight) classes.push(styles.fontWeight);
      if (styles.italic) classes.push('italic');
      if (styles.underline) classes.push('underline');
      if (styles.borderWidth) classes.push(styles.borderWidth);
      if (styles.borderRadius) classes.push(styles.borderRadius);
      if (styles.shadow) classes.push(styles.shadow);
      if (styles.textAlign) classes.push(`text-${styles.textAlign}`);
      
      return classes.join(' ');
    };

    const buildSectionStyles = (additionalStyles: any = {}) => ({
      ...additionalStyles,
      backgroundColor: styles.backgroundColor,
      backgroundImage: styles.backgroundImage ? `url(${styles.backgroundImage})` : undefined,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: styles.textColor,
      borderColor: styles.borderColor,
      padding: styles.padding || undefined,
      ...additionalStyles
    });

    const baseClasses = buildSectionClasses();
    const backgroundStyle = buildSectionStyles();

    switch (section.type) {
      case 'hero':
        return (
          <div 
            className={`${baseClasses} min-h-[400px] flex items-center justify-center text-white`}
            style={{
              ...backgroundStyle,
              backgroundImage: section.content.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            <div className="text-center max-w-4xl px-6">
              <h1 className={`${deviceMode === 'mobile' ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold mb-6`}>
                {section.content.title || 'Your Amazing Title'}
              </h1>
              <p className={`${deviceMode === 'mobile' ? 'text-base' : 'text-lg md:text-xl'} mb-8 opacity-90`}>
                {section.content.subtitle || 'Your compelling subtitle goes here'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {section.content.buttons?.map((button: any, index: number) => (
                  <Button 
                    key={index}
                    size={deviceMode === 'mobile' ? "default" : "lg"} 
                    variant={button.style === 'secondary' ? 'secondary' : button.style === 'outline' ? 'outline' : 'default'}
                    className={button.style === 'primary' ? 'bg-white text-blue-600 hover:bg-gray-100' : ''}
                  >
                    {button.text}
                  </Button>
                ))}
                {/* Legacy single button support */}
                {section.content.buttonText && !section.content.buttons && (
                  <Button size={deviceMode === 'mobile' ? "default" : "lg"} className="bg-white text-blue-600 hover:bg-gray-100">
                    {section.content.buttonText}
                  </Button>
                )}
              </div>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {section.content.title || 'About Us'}
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  {section.content.description || 'Tell your story and connect with your audience.'}
                </p>
                {section.content.stats && (
                  <div className="grid grid-cols-3 gap-4">
                    {section.content.stats.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-2xl font-bold text-primary">{stat.number}</div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {section.content.image && (
                <div className="relative">
                  <ImageWithFallback
                    src={section.content.image}
                    alt={section.content.title || 'About us'}
                    className="w-full h-80 object-cover rounded-lg shadow-lg"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'features':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Our Features'}
              </h2>
              {section.content.description && (
                <p className="text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              {section.content.features && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {section.content.features.map((feature: any, index: number) => (
                    <div key={index} className="text-center p-6">
                      <div className="text-4xl mb-4">{feature.icon}</div>
                      <h3 className="font-semibold mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'services':
        return (
          <div className={`${baseClasses} py-16 px-6 bg-gray-50`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Our Services'}
              </h2>
              <p className="text-gray-600 mb-12">
                {section.content.description || 'We offer comprehensive solutions'}
              </p>
              {section.content.services && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {section.content.services.map((service: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                      {service.image && (
                        <ImageWithFallback
                          src={service.image}
                          alt={service.name}
                          className="w-full h-32 object-cover rounded-lg mb-4"
                        />
                      )}
                      <h3 className="font-semibold mb-2">{service.name}</h3>
                      <p className="text-gray-600 mb-3">{service.description}</p>
                      {service.price && (
                        <p className="text-primary font-medium">{service.price}</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'team':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Meet Our Team'}
              </h2>
              <p className="text-gray-600 mb-12">
                {section.content.description || 'Our experienced professionals'}
              </p>
              {section.content.members && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-4'} gap-8`}>
                  {section.content.members.map((member: any, index: number) => (
                    <div key={index} className="text-center">
                      <ImageWithFallback
                        src={member.image}
                        alt={member.name}
                        className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                      />
                      <h3 className="font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary mb-2">{member.role}</p>
                      <p className="text-gray-600 text-sm">{member.bio}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Choose Your Plan'}
              </h2>
              {section.content.description && (
                <p className="text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              {section.content.plans && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {section.content.plans.map((plan: any, index: number) => (
                    <div key={index} className={`bg-white p-8 rounded-lg shadow-sm border-2 ${plan.popular ? 'border-primary' : 'border-gray-200'} relative`}>
                      {plan.popular && (
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                          <Badge className="bg-primary text-white">Most Popular</Badge>
                        </div>
                      )}
                      <h3 className="font-semibold text-xl mb-2">{plan.name}</h3>
                      <div className="mb-6">
                        <span className="text-4xl font-bold">{plan.price}</span>
                        <span className="text-gray-600">{plan.period}</span>
                      </div>
                      <ul className="space-y-3 mb-8">
                        {plan.features?.map((feature: string, featureIndex: number) => (
                          <li key={featureIndex} className="text-gray-600">✓ {feature}</li>
                        ))}
                      </ul>
                      <Button className={`w-full ${plan.popular ? 'bg-primary' : 'bg-gray-800'}`}>
                        Choose Plan
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'gallery':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Gallery'}
              </h2>
              {section.content.description && (
                <p className="text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              {section.content.items && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {section.content.items.map((item: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{item.title}</h3>
                        {item.category && (
                          <p className="text-primary text-sm mb-2">{item.category}</p>
                        )}
                        {item.description && (
                          <p className="text-gray-600 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className={`${baseClasses} py-16 px-6 bg-gray-50`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'What Our Customers Say'}
              </h2>
              {section.content.testimonials && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {section.content.testimonials.map((testimonial: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                      <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                      <div className="flex items-center">
                        <ImageWithFallback
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="w-12 h-12 rounded-full mr-4 object-cover"
                        />
                        <div className="text-left">
                          <div className="font-semibold">{testimonial.name}</div>
                          <div className="text-gray-600 text-sm">{testimonial.role}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className={`${baseClasses} py-16 px-6 bg-gray-50`} style={backgroundStyle}>
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Contact Us'}
              </h2>
              <p className="text-gray-600 mb-8">
                {section.content.description || 'Get in touch with us today'}
              </p>
              <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-3'} gap-6`}>
                {section.content.email && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-blue-600 mb-2 text-2xl">📧</div>
                    <h3 className="font-medium mb-1">Email</h3>
                    <p className="text-gray-600">{section.content.email}</p>
                  </div>
                )}
                {section.content.phone && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-blue-600 mb-2 text-2xl">📞</div>
                    <h3 className="font-medium mb-1">Phone</h3>
                    <p className="text-gray-600">{section.content.phone}</p>
                  </div>
                )}
                {section.content.address && (
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <div className="text-blue-600 mb-2 text-2xl">📍</div>
                    <h3 className="font-medium mb-1">Address</h3>
                    <p className="text-gray-600 whitespace-pre-line">{section.content.address}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'footer':
        return (
          <footer className={`${baseClasses} bg-gray-900 text-white py-12 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h3 className="text-xl font-bold mb-2">
                {section.content.companyName || 'Your Company'}
              </h3>
              <p className="text-gray-400 mb-6">
                {section.content.description || 'Your company description'}
              </p>
              {section.content.links && (
                <div className="flex justify-center gap-6">
                  {section.content.links.map((link: string, index: number) => (
                    <button key={index} className="text-gray-400 hover:text-white transition-colors">
                      {link}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </footer>
        );

      case 'faq':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  {section.content.title || 'Frequently Asked Questions'}
                </h2>
                {section.content.description && (
                  <p className="text-gray-600">
                    {section.content.description}
                  </p>
                )}
              </div>
              {section.content.faqs && (
                <div className="space-y-4">
                  {section.content.faqs.map((faq: any, index: number) => (
                    <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-gray-600">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  {section.content.title || 'Latest Blog Posts'}
                </h2>
                {section.content.description && (
                  <p className="text-gray-600">
                    {section.content.description}
                  </p>
                )}
              </div>
              {section.content.posts && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-8`}>
                  {section.content.posts.map((post: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {post.image && (
                        <ImageWithFallback
                          src={post.image}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold mb-2">{post.title}</h3>
                        <p className="text-gray-600 mb-4">{post.excerpt}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <span>{post.author}</span>
                          <span className="mx-2">•</span>
                          <span>{post.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Portfolio'}
              </h2>
              {section.content.description && (
                <p className="text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              {section.content.projects && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'} gap-6`}>
                  {section.content.projects.map((project: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      <ImageWithFallback
                        src={project.image}
                        alt={project.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold mb-1">{project.title}</h3>
                        <p className="text-primary text-sm mb-2">{project.category}</p>
                        {project.description && (
                          <p className="text-gray-600 text-sm">{project.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-6">
                  {section.content.title || 'Menu'}
                </h2>
                {section.content.description && (
                  <p className="text-gray-600">
                    {section.content.description}
                  </p>
                )}
              </div>
              {section.content.categories && (
                <div className="space-y-12">
                  {section.content.categories.map((category: any, index: number) => (
                    <div key={index}>
                      <h3 className="text-2xl font-semibold mb-6 text-center">{category.name}</h3>
                      <div className="space-y-4">
                        {category.items?.map((item: any, itemIndex: number) => (
                          <div key={itemIndex} className="flex justify-between items-start p-4 border-b">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-gray-600 text-sm">{item.description}</p>
                            </div>
                            <div className="text-primary font-semibold ml-4">{item.price}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className={`${baseClasses} py-16 px-6`} style={backgroundStyle}>
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Our Locations'}
              </h2>
              {section.content.description && (
                <p className="text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              {section.content.locations && (
                <div className={`grid ${deviceMode === 'mobile' ? 'grid-cols-1' : 'md:grid-cols-2'} gap-8`}>
                  {section.content.locations.map((location: any, index: number) => (
                    <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {location.image && (
                        <ImageWithFallback
                          src={location.image}
                          alt={location.name}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="font-semibold mb-4">{location.name}</h3>
                        <div className="space-y-2 text-left">
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600">📍</span>
                            <p className="text-gray-600 whitespace-pre-line">{location.address}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600">📞</span>
                            <p className="text-gray-600">{location.phone}</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-blue-600">🕒</span>
                            <p className="text-gray-600 whitespace-pre-line">{location.hours}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className={`${baseClasses} py-12 px-6 bg-gray-100 border-2 border-dashed border-gray-300`} style={backgroundStyle}>
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <h3 className="font-medium">{formatSectionTitle(section.type)} Section</h3>
              <p className="text-sm">Click to edit content</p>
            </div>
          </div>
        );
    }
  };

  // Content editing forms
  const renderContentEditor = () => {
    if (!selectedSection) {
      return (
        <div className="text-center text-gray-500 py-8">
          <Edit3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a section to edit its content</p>
        </div>
      );
    }

    const section = currentPage?.sections.find(s => s.id === selectedSection);
    if (!section) return null;

    const Icon = getSectionIcon(section.type);

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon className="h-5 w-5" />
          <h3 className="font-semibold">{formatSectionTitle(section.type)}</h3>
        </div>

        {renderSectionEditor(section)}
      </div>
    );
  };

  const renderSectionEditor = (section: any) => {
    switch (section.type) {
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
              <label className="block text-sm font-medium mb-2">Call-to-Action Buttons</label>
              {section.content.buttons?.map((button: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Button {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'buttons', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={button.text}
                      onChange={(e) => updateArrayItem(section.id, 'buttons', index, { text: e.target.value })}
                      placeholder="Button text"
                    />
                    <Input
                      value={button.link || ''}
                      onChange={(e) => updateArrayItem(section.id, 'buttons', index, { link: e.target.value })}
                      placeholder="Button link (optional)"
                    />
                    <Select 
                      value={button.style || 'primary'} 
                      onValueChange={(value) => updateArrayItem(section.id, 'buttons', index, { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Button</SelectItem>
                        <SelectItem value="secondary">Secondary Button</SelectItem>
                        <SelectItem value="outline">Outline Button</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'buttons', { 
                  text: 'New Button', 
                  link: '',
                  style: 'primary'
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Button
              </Button>
              {/* Legacy single button support */}
              {section.content.buttonText && !section.content.buttons && (
                <div className="border rounded-lg p-3 bg-yellow-50">
                  <div className="text-sm text-yellow-800 mb-2">Legacy Button (click "Convert to Multiple Buttons")</div>
                  <Input
                    value={section.content.buttonText || ''}
                    onChange={(e) => updateSectionContent(section.id, { buttonText: e.target.value })}
                    placeholder="Enter button text"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      const buttons = [{ text: section.content.buttonText || 'Get Started', link: '', style: 'primary' }];
                      updateSectionContent(section.id, { buttons, buttonText: undefined });
                    }}
                  >
                    Convert to Multiple Buttons
                  </Button>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <div className="flex items-center gap-2">
                <Input
                  value={section.content.backgroundImage || ''}
                  onChange={(e) => updateSectionContent(section.id, { backgroundImage: e.target.value })}
                  placeholder="Enter image URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(section.id, 'backgroundImage')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
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
                  placeholder="Enter image URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(section.id, 'image')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {section.content.stats && (
              <div>
                <label className="block text-sm font-medium mb-2">Statistics</label>
                {section.content.stats.map((stat: any, index: number) => (
                  <div key={index} className="grid grid-cols-2 gap-2 mb-2">
                    <Input
                      value={stat.number}
                      onChange={(e) => updateArrayItem(section.id, 'stats', index, { number: e.target.value })}
                      placeholder="Number"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) => updateArrayItem(section.id, 'stats', index, { label: e.target.value })}
                      placeholder="Label"
                    />
                  </div>
                ))}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addArrayItem(section.id, 'stats', { number: '100+', label: 'New Stat' })}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Statistic
                </Button>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-2">Call-to-Action Buttons</label>
              {section.content.buttons?.map((button: any, index: number) => (
                <div key={index} className="border rounded-lg p-3 mb-2">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Button {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'buttons', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={button.text}
                      onChange={(e) => updateArrayItem(section.id, 'buttons', index, { text: e.target.value })}
                      placeholder="Button text"
                    />
                    <Input
                      value={button.link || ''}
                      onChange={(e) => updateArrayItem(section.id, 'buttons', index, { link: e.target.value })}
                      placeholder="Button link (optional)"
                    />
                    <Select 
                      value={button.style || 'primary'} 
                      onValueChange={(value) => updateArrayItem(section.id, 'buttons', index, { style: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="primary">Primary Button</SelectItem>
                        <SelectItem value="secondary">Secondary Button</SelectItem>
                        <SelectItem value="outline">Outline Button</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'buttons', { 
                  text: 'Learn More', 
                  link: '',
                  style: 'primary'
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Button
              </Button>
            </div>
          </div>
        );

      case 'features':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Features title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Features description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Features</label>
              {section.content.features?.map((feature: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Feature {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'features', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={feature.icon}
                      onChange={(e) => updateArrayItem(section.id, 'features', index, { icon: e.target.value })}
                      placeholder="Icon (emoji)"
                    />
                    <Input
                      value={feature.title}
                      onChange={(e) => updateArrayItem(section.id, 'features', index, { title: e.target.value })}
                      placeholder="Feature title"
                    />
                    <Textarea
                      value={feature.description}
                      onChange={(e) => updateArrayItem(section.id, 'features', index, { description: e.target.value })}
                      placeholder="Feature description"
                      rows={2}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'features', { 
                  icon: '⭐', 
                  title: 'New Feature', 
                  description: 'Feature description' 
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Feature
              </Button>
            </div>
          </div>
        );

      case 'services':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Services title"
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
              <label className="block text-sm font-medium mb-2">Services</label>
              {section.content.services?.map((service: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Service {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'services', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={service.name}
                      onChange={(e) => updateArrayItem(section.id, 'services', index, { name: e.target.value })}
                      placeholder="Service name"
                    />
                    <Textarea
                      value={service.description}
                      onChange={(e) => updateArrayItem(section.id, 'services', index, { description: e.target.value })}
                      placeholder="Service description"
                      rows={2}
                    />
                    <Input
                      value={service.price}
                      onChange={(e) => updateArrayItem(section.id, 'services', index, { price: e.target.value })}
                      placeholder="Price (e.g., From $99)"
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={service.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'services', index, { image: e.target.value })}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `services.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'services', { 
                  name: 'New Service', 
                  description: 'Service description',
                  price: 'From $99',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Service
              </Button>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
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
              <label className="block text-sm font-medium mb-2">Team Members</label>
              {section.content.members?.map((member: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Member {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'members', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={member.name}
                      onChange={(e) => updateArrayItem(section.id, 'members', index, { name: e.target.value })}
                      placeholder="Name"
                    />
                    <Input
                      value={member.role}
                      onChange={(e) => updateArrayItem(section.id, 'members', index, { role: e.target.value })}
                      placeholder="Role/Position"
                    />
                    <Textarea
                      value={member.bio}
                      onChange={(e) => updateArrayItem(section.id, 'members', index, { bio: e.target.value })}
                      placeholder="Bio"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={member.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'members', index, { image: e.target.value })}
                        placeholder="Photo URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `members.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'members', { 
                  name: 'Team Member', 
                  role: 'Position',
                  bio: 'Bio description',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Team Member
              </Button>
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
                type="email"
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
                placeholder="123 Main Street, City, State"
                rows={2}
              />
            </div>
          </div>
        );

      case 'pricing':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
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
              <label className="block text-sm font-medium mb-2">Pricing Plans</label>
              {section.content.plans?.map((plan: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Plan {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'plans', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={plan.name}
                      onChange={(e) => updateArrayItem(section.id, 'plans', index, { name: e.target.value })}
                      placeholder="Plan name"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={plan.price}
                        onChange={(e) => updateArrayItem(section.id, 'plans', index, { price: e.target.value })}
                        placeholder="$29"
                      />
                      <Input
                        value={plan.period}
                        onChange={(e) => updateArrayItem(section.id, 'plans', index, { period: e.target.value })}
                        placeholder="/month"
                      />
                    </div>
                    <Textarea
                      value={plan.features?.join('\n') || ''}
                      onChange={(e) => updateArrayItem(section.id, 'plans', index, { 
                        features: e.target.value.split('\n').filter(f => f.trim()) 
                      })}
                      placeholder="Feature 1\nFeature 2\nFeature 3"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={plan.popular || false}
                        onChange={(e) => updateArrayItem(section.id, 'plans', index, { popular: e.target.checked })}
                        className="rounded"
                      />
                      <span className="text-sm">Mark as popular</span>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'plans', { 
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
          </div>
        );

      case 'gallery':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Gallery title"
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
              <label className="block text-sm font-medium mb-2">Gallery Items</label>
              {section.content.items?.map((item: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Item {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'items', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={item.title}
                      onChange={(e) => updateArrayItem(section.id, 'items', index, { title: e.target.value })}
                      placeholder="Item title"
                    />
                    <Input
                      value={item.category}
                      onChange={(e) => updateArrayItem(section.id, 'items', index, { category: e.target.value })}
                      placeholder="Category"
                    />
                    <Textarea
                      value={item.description || ''}
                      onChange={(e) => updateArrayItem(section.id, 'items', index, { description: e.target.value })}
                      placeholder="Description"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={item.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'items', index, { image: e.target.value })}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `items.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'items', { 
                  title: 'New Item', 
                  category: 'Category',
                  description: '',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>
          </div>
        );

      case 'testimonials':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Testimonials title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Testimonials description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Testimonials</label>
              {section.content.testimonials?.map((testimonial: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Testimonial {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'testimonials', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={testimonial.name}
                      onChange={(e) => updateArrayItem(section.id, 'testimonials', index, { name: e.target.value })}
                      placeholder="Name"
                    />
                    <Input
                      value={testimonial.role}
                      onChange={(e) => updateArrayItem(section.id, 'testimonials', index, { role: e.target.value })}
                      placeholder="Role/Company"
                    />
                    <Textarea
                      value={testimonial.content}
                      onChange={(e) => updateArrayItem(section.id, 'testimonials', index, { content: e.target.value })}
                      placeholder="Testimonial content"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={testimonial.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'testimonials', index, { image: e.target.value })}
                        placeholder="Photo URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `testimonials.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'testimonials', { 
                  name: 'Customer Name', 
                  role: 'Position',
                  content: 'Great service!',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Testimonial
              </Button>
            </div>
          </div>
        );

      case 'faq':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="FAQ title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="FAQ description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">FAQ Items</label>
              {section.content.faqs?.map((faq: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">FAQ {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'faqs', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={faq.question}
                      onChange={(e) => updateArrayItem(section.id, 'faqs', index, { question: e.target.value })}
                      placeholder="Question"
                    />
                    <Textarea
                      value={faq.answer}
                      onChange={(e) => updateArrayItem(section.id, 'faqs', index, { answer: e.target.value })}
                      placeholder="Answer"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'faqs', { 
                  question: 'Frequently asked question?', 
                  answer: 'Answer to the question.'
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add FAQ
              </Button>
            </div>
          </div>
        );

      case 'navigation':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Logo/Brand Name</label>
              <Input
                value={section.content.logo || ''}
                onChange={(e) => updateSectionContent(section.id, { logo: e.target.value })}
                placeholder="Your Logo"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Menu Items (one per line)</label>
              <Textarea
                value={section.content.menuItems?.join('\n') || ''}
                onChange={(e) => updateSectionContent(section.id, { 
                  menuItems: e.target.value.split('\n').filter(item => item.trim()) 
                })}
                placeholder="Home\nAbout\nServices\nContact"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo Image</label>
              <div className="flex items-center gap-2">
                <Input
                  value={section.content.logoImage || ''}
                  onChange={(e) => updateSectionContent(section.id, { logoImage: e.target.value })}
                  placeholder="Logo image URL (optional)"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(section.id, 'logoImage')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
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
              <label className="block text-sm font-medium mb-2">Links (one per line)</label>
              <Textarea
                value={section.content.links?.join('\n') || ''}
                onChange={(e) => updateSectionContent(section.id, { 
                  links: e.target.value.split('\n').filter(link => link.trim()) 
                })}
                placeholder="Privacy\nTerms\nContact"
                rows={3}
              />
            </div>
          </div>
        );

      case 'blog':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Blog section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Blog description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Blog Posts</label>
              {section.content.posts?.map((post: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Post {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'posts', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={post.title}
                      onChange={(e) => updateArrayItem(section.id, 'posts', index, { title: e.target.value })}
                      placeholder="Post title"
                    />
                    <Textarea
                      value={post.excerpt}
                      onChange={(e) => updateArrayItem(section.id, 'posts', index, { excerpt: e.target.value })}
                      placeholder="Post excerpt"
                      rows={2}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        value={post.author}
                        onChange={(e) => updateArrayItem(section.id, 'posts', index, { author: e.target.value })}
                        placeholder="Author"
                      />
                      <Input
                        type="date"
                        value={post.date}
                        onChange={(e) => updateArrayItem(section.id, 'posts', index, { date: e.target.value })}
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Input
                        value={post.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'posts', index, { image: e.target.value })}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `posts.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'posts', { 
                  title: 'Blog Post Title', 
                  excerpt: 'Post excerpt...',
                  author: 'Author Name',
                  date: new Date().toISOString().split('T')[0],
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Blog Post
              </Button>
            </div>
          </div>
        );

      case 'portfolio':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Portfolio title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Portfolio description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Portfolio Projects</label>
              {section.content.projects?.map((project: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Project {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'projects', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={project.title}
                      onChange={(e) => updateArrayItem(section.id, 'projects', index, { title: e.target.value })}
                      placeholder="Project title"
                    />
                    <Input
                      value={project.category}
                      onChange={(e) => updateArrayItem(section.id, 'projects', index, { category: e.target.value })}
                      placeholder="Category"
                    />
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => updateArrayItem(section.id, 'projects', index, { description: e.target.value })}
                      placeholder="Project description"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={project.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'projects', index, { image: e.target.value })}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `projects.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'projects', { 
                  title: 'Project Title', 
                  category: 'Category',
                  description: 'Project description',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Project
              </Button>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Menu title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Menu description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Menu Categories</label>
              {section.content.categories?.map((category: any, categoryIndex: number) => (
                <div key={categoryIndex} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Category {categoryIndex + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'categories', categoryIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <Input
                      value={category.name}
                      onChange={(e) => updateArrayItem(section.id, 'categories', categoryIndex, { name: e.target.value })}
                      placeholder="Category name"
                    />
                    <div className="ml-4 space-y-2">
                      {category.items?.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="grid grid-cols-3 gap-2 p-2 bg-gray-50 rounded">
                          <Input
                            value={item.name}
                            onChange={(e) => {
                              const newItems = [...category.items];
                              newItems[itemIndex] = { ...item, name: e.target.value };
                              updateArrayItem(section.id, 'categories', categoryIndex, { items: newItems });
                            }}
                            placeholder="Item name"
                          />
                          <Input
                            value={item.description}
                            onChange={(e) => {
                              const newItems = [...category.items];
                              newItems[itemIndex] = { ...item, description: e.target.value };
                              updateArrayItem(section.id, 'categories', categoryIndex, { items: newItems });
                            }}
                            placeholder="Description"
                          />
                          <div className="flex gap-1">
                            <Input
                              value={item.price}
                              onChange={(e) => {
                                const newItems = [...category.items];
                                newItems[itemIndex] = { ...item, price: e.target.value };
                                updateArrayItem(section.id, 'categories', categoryIndex, { items: newItems });
                              }}
                              placeholder="Price"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newItems = category.items.filter((_: any, i: number) => i !== itemIndex);
                                updateArrayItem(section.id, 'categories', categoryIndex, { items: newItems });
                              }}
                              className="text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const newItems = [...(category.items || []), { name: 'New Item', description: 'Description', price: '$10' }];
                          updateArrayItem(section.id, 'categories', categoryIndex, { items: newItems });
                        }}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'categories', { 
                  name: 'New Category', 
                  items: [{ name: 'Sample Item', description: 'Item description', price: '$10' }]
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Category
              </Button>
            </div>
          </div>
        );

      case 'locations':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Section Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Locations title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Locations description"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Locations</label>
              {section.content.locations?.map((location: any, index: number) => (
                <div key={index} className="border rounded-lg p-4 mb-3">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-sm font-medium">Location {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeArrayItem(section.id, 'locations', index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid gap-2">
                    <Input
                      value={location.name}
                      onChange={(e) => updateArrayItem(section.id, 'locations', index, { name: e.target.value })}
                      placeholder="Location name"
                    />
                    <Textarea
                      value={location.address}
                      onChange={(e) => updateArrayItem(section.id, 'locations', index, { address: e.target.value })}
                      placeholder="Address"
                      rows={2}
                    />
                    <Input
                      value={location.phone}
                      onChange={(e) => updateArrayItem(section.id, 'locations', index, { phone: e.target.value })}
                      placeholder="Phone number"
                    />
                    <Textarea
                      value={location.hours}
                      onChange={(e) => updateArrayItem(section.id, 'locations', index, { hours: e.target.value })}
                      placeholder="Hours"
                      rows={2}
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        value={location.image || ''}
                        onChange={(e) => updateArrayItem(section.id, 'locations', index, { image: e.target.value })}
                        placeholder="Image URL"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleImageUpload(section.id, `locations.${index}.image`)}
                      >
                        <Upload className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => addArrayItem(section.id, 'locations', { 
                  name: 'New Location', 
                  address: 'Address here',
                  phone: 'Phone number',
                  hours: 'Hours here',
                  image: ''
                })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Location
              </Button>
            </div>
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="text-muted-foreground text-sm mb-4">
              Basic editing for "{section.type}" section:
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={section.content.title || ''}
                onChange={(e) => updateSectionContent(section.id, { title: e.target.value })}
                placeholder="Section title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={section.content.description || ''}
                onChange={(e) => updateSectionContent(section.id, { description: e.target.value })}
                placeholder="Section description"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content (JSON)</label>
              <Textarea
                value={JSON.stringify(section.content, null, 2)}
                onChange={(e) => {
                  try {
                    const newContent = JSON.parse(e.target.value);
                    updateSectionContent(section.id, newContent);
                  } catch (error) {
                    // Invalid JSON, don't update
                  }
                }}
                placeholder="Edit section content as JSON"
                rows={6}
                className="font-mono text-sm"
              />
            </div>
          </div>
        );
    }
  };

  // Design editor
  const renderDesignEditor = () => {
    if (!selectedSection) {
      return (
        <div className="text-center text-gray-500 py-8">
          <PaintBucket className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select a section to edit its design</p>
        </div>
      );
    }

    const section = currentPage?.sections.find(s => s.id === selectedSection);
    if (!section) return null;

    const styles = section.styles || {};

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <PaintBucket className="h-5 w-5" />
          <h3 className="font-semibold">Design Settings</h3>
        </div>

        {/* Typography Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4" />
              Typography
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Text Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.textColor || '#000000'}
                  onChange={(e) => updateSectionStyles(selectedSection, { textColor: e.target.value })}
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={styles.textColor || ''}
                  onChange={(e) => updateSectionStyles(selectedSection, { textColor: e.target.value })}
                  placeholder="#000000"
                />
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Size</label>
              <Select
                value={styles.fontSize || 'text-base'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { fontSize: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text-xs">Extra Small</SelectItem>
                  <SelectItem value="text-sm">Small</SelectItem>
                  <SelectItem value="text-base">Base</SelectItem>
                  <SelectItem value="text-lg">Large</SelectItem>
                  <SelectItem value="text-xl">Extra Large</SelectItem>
                  <SelectItem value="text-2xl">2X Large</SelectItem>
                  <SelectItem value="text-3xl">3X Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-sm font-medium mb-2">Font Weight</label>
              <Select
                value={styles.fontWeight || 'font-normal'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { fontWeight: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="font-light">Light</SelectItem>
                  <SelectItem value="font-normal">Normal</SelectItem>
                  <SelectItem value="font-medium">Medium</SelectItem>
                  <SelectItem value="font-semibold">Semibold</SelectItem>
                  <SelectItem value="font-bold">Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Styling */}
            <div>
              <label className="block text-sm font-medium mb-2">Text Style</label>
              <div className="flex gap-2">
                <Button
                  variant={styles.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSectionStyles(selectedSection, { italic: !styles.italic })}
                >
                  <Italic className="h-4 w-4" />
                </Button>
                <Button
                  variant={styles.underline ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSectionStyles(selectedSection, { underline: !styles.underline })}
                >
                  <span className="underline text-sm">U</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Background Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Background
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Background Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#ffffff'}
                  onChange={(e) => updateSectionStyles(selectedSection, { backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={styles.backgroundColor || ''}
                  onChange={(e) => updateSectionStyles(selectedSection, { backgroundColor: e.target.value })}
                  placeholder="#ffffff"
                />
              </div>
            </div>

            {/* Background Image */}
            <div>
              <label className="block text-sm font-medium mb-2">Background Image</label>
              <div className="flex items-center gap-2">
                <Input
                  value={styles.backgroundImage || ''}
                  onChange={(e) => updateSectionStyles(selectedSection, { backgroundImage: e.target.value })}
                  placeholder="Image URL"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleImageUpload(selectedSection, 'backgroundImage')}
                >
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Layout Controls */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Layout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Padding */}
            <div>
              <label className="block text-sm font-medium mb-2">Padding</label>
              <Select
                value={styles.padding || 'py-16 px-6'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { padding: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="py-8 px-4">Small</SelectItem>
                  <SelectItem value="py-12 px-6">Medium</SelectItem>
                  <SelectItem value="py-16 px-6">Large</SelectItem>
                  <SelectItem value="py-24 px-8">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Text Alignment */}
            <div>
              <label className="block text-sm font-medium mb-2">Text Alignment</label>
              <div className="flex gap-2">
                <Button
                  variant={styles.textAlign === 'left' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSectionStyles(selectedSection, { textAlign: 'left' })}
                >
                  <AlignLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant={styles.textAlign === 'center' || !styles.textAlign ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSectionStyles(selectedSection, { textAlign: 'center' })}
                >
                  <AlignCenter className="h-4 w-4" />
                </Button>
                <Button
                  variant={styles.textAlign === 'right' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateSectionStyles(selectedSection, { textAlign: 'right' })}
                >
                  <AlignRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Border and Effects */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Crop className="h-4 w-4" />
              Border & Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Border Color */}
            <div>
              <label className="block text-sm font-medium mb-2">Border Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.borderColor || '#e5e7eb'}
                  onChange={(e) => updateSectionStyles(selectedSection, { borderColor: e.target.value })}
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={styles.borderColor || ''}
                  onChange={(e) => updateSectionStyles(selectedSection, { borderColor: e.target.value })}
                  placeholder="#e5e7eb"
                />
              </div>
            </div>

            {/* Border Width */}
            <div>
              <label className="block text-sm font-medium mb-2">Border Width</label>
              <Select
                value={styles.borderWidth || 'border-0'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { borderWidth: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="border-0">None</SelectItem>
                  <SelectItem value="border">1px</SelectItem>
                  <SelectItem value="border-2">2px</SelectItem>
                  <SelectItem value="border-4">4px</SelectItem>
                  <SelectItem value="border-8">8px</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Border Radius */}
            <div>
              <label className="block text-sm font-medium mb-2">Border Radius</label>
              <Select
                value={styles.borderRadius || 'rounded-none'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { borderRadius: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rounded-none">None</SelectItem>
                  <SelectItem value="rounded-sm">Small</SelectItem>
                  <SelectItem value="rounded">Medium</SelectItem>
                  <SelectItem value="rounded-lg">Large</SelectItem>
                  <SelectItem value="rounded-xl">Extra Large</SelectItem>
                  <SelectItem value="rounded-full">Full</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shadow */}
            <div>
              <label className="block text-sm font-medium mb-2">Shadow</label>
              <Select
                value={styles.shadow || 'shadow-none'}
                onValueChange={(value) => updateSectionStyles(selectedSection, { shadow: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="shadow-none">None</SelectItem>
                  <SelectItem value="shadow-sm">Small</SelectItem>
                  <SelectItem value="shadow">Medium</SelectItem>
                  <SelectItem value="shadow-lg">Large</SelectItem>
                  <SelectItem value="shadow-xl">Extra Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Responsive Visibility */}
        <div>
          <label className="block text-sm font-medium mb-2">Device Visibility</label>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4" />
                <span className="text-sm">Desktop</span>
              </div>
              <Switch
                checked={section.visibility?.desktop !== false}
                onCheckedChange={() => toggleDeviceVisibility(selectedSection, 'desktop')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tablet className="h-4 w-4" />
                <span className="text-sm">Tablet</span>
              </div>
              <Switch
                checked={section.visibility?.tablet !== false}
                onCheckedChange={() => toggleDeviceVisibility(selectedSection, 'tablet')}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <span className="text-sm">Mobile</span>
              </div>
              <Switch
                checked={section.visibility?.mobile !== false}
                onCheckedChange={() => toggleDeviceVisibility(selectedSection, 'mobile')}
              />
            </div>
          </div>
        </div>

        {/* Section Actions */}
        <div>
          <label className="block text-sm font-medium mb-2">Section Actions</label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => duplicateSection(selectedSection)}
            >
              <Copy className="h-3 w-3 mr-1" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggleSectionLock(selectedSection)}
            >
              {section.locked ? <Unlock className="h-3 w-3 mr-1" /> : <Lock className="h-3 w-3 mr-1" />}
              {section.locked ? 'Unlock' : 'Lock'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteSection(selectedSection)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-3 w-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  };

  // Section library
  const renderSectionLibrary = () => {
    const categories = [...new Set(sectionTemplates.map(t => t.category))];

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Plus className="h-5 w-5" />
          <h3 className="font-semibold">Add Section</h3>
        </div>

        {categories.map(category => (
          <div key={category}>
            <h4 className="font-medium mb-3 text-gray-700">{category}</h4>
            <div className="grid grid-cols-1 gap-2">
              {sectionTemplates
                .filter(template => template.category === category)
                .map(template => (
                  <button
                    key={template.id}
                    onClick={() => addSection(template)}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <template.icon className="h-5 w-5 mt-0.5 text-primary" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{template.name}</div>
                      <div className="text-xs text-gray-600">{template.description}</div>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Settings tab
  const renderSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="h-5 w-5" />
          <h3 className="font-semibold">Global Settings</h3>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Project Settings</CardTitle>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Global Styles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentProject.content.globalStyles?.primaryColor || '#3b82f6'}
                  onChange={(e) => updateProject(project => ({
                    ...project,
                    content: {
                      ...project.content,
                      globalStyles: {
                        ...project.content.globalStyles,
                        primaryColor: e.target.value
                      }
                    }
                  }))}
                  className="w-10 h-10 rounded border"
                />
                <Input
                  value={currentProject.content.globalStyles?.primaryColor || ''}
                  onChange={(e) => updateProject(project => ({
                    ...project,
                    content: {
                      ...project.content,
                      globalStyles: {
                        ...project.content.globalStyles,
                        primaryColor: e.target.value
                      }
                    }
                  }))}
                  placeholder="#3b82f6"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <Select
                value={currentProject.content.globalStyles?.fontFamily || 'Inter'}
                onValueChange={(value) => updateProject(project => ({
                  ...project,
                  content: {
                    ...project.content,
                    globalStyles: {
                      ...project.content.globalStyles,
                      fontFamily: value
                    }
                  }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Inter">Inter</SelectItem>
                  <SelectItem value="Roboto">Roboto</SelectItem>
                  <SelectItem value="Open Sans">Open Sans</SelectItem>
                  <SelectItem value="Poppins">Poppins</SelectItem>
                  <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Theme Presets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Wand2 className="h-4 w-4" />
              Theme Presets
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themePresets).map(([key, theme]) => (
                <Button
                  key={key}
                  variant={globalTheme === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => applyTheme(key)}
                  className="h-auto p-2 flex flex-col items-start"
                >
                  <div className="font-medium text-xs">{theme.name}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.primaryColor }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: theme.secondaryColor }}
                    />
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Inspector Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <MousePointer2 className="h-4 w-4" />
              Inspector Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Show Element Labels</span>
              <Switch
                checked={showElementLabels}
                onCheckedChange={setShowElementLabels}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Grid Overlay</span>
              <Switch
                checked={showGrid}
                onCheckedChange={setShowGrid}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Inspection Mode</span>
              <Switch
                checked={inspectionMode}
                onCheckedChange={setInspectionMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Animation Settings */}
        <Card className="overflow-visible">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Animation Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 overflow-visible">
            <div className="flex items-center justify-between py-1">
              <span className="text-sm select-none">Enable Animations</span>
              <Switch
                checked={animationSettings.enableAnimations}
                onCheckedChange={(checked) => setAnimationSettings(prev => ({ ...prev, enableAnimations: checked }))}
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm select-none">Auto-scroll to New Sections</span>
              <Switch
                checked={animationSettings.autoScroll}
                onCheckedChange={(checked) => setAnimationSettings(prev => ({ ...prev, autoScroll: checked }))}
              />
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-sm select-none">Show Undo Toasts</span>
              <Switch
                checked={animationSettings.showUndoToasts}
                onCheckedChange={(checked) => setAnimationSettings(prev => ({ ...prev, showUndoToasts: checked }))}
              />
            </div>
            <div className="py-2">
              <label className="block text-sm font-medium mb-3 flex items-center gap-2 select-none">
                <Timer className="h-3 w-3" />
                Animation Duration: {animationSettings.duration}ms
              </label>
              <div className="px-2">
                <Slider
                  value={[animationSettings.duration]}
                  onValueChange={([value]) => setAnimationSettings(prev => ({ ...prev, duration: value }))}
                  min={100}
                  max={500}
                  step={25}
                  className="w-full"
                />
              </div>
            </div>
            {deletedSections.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  <Undo2 className="h-3 w-3" />
                  Recently Deleted ({deletedSections.length})
                </label>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {deletedSections.slice(-5).map(deleted => (
                    <div key={deleted.id} className="flex items-center justify-between p-2 text-xs bg-gray-50 rounded">
                      <span className="truncate">{formatSectionTitle(deleted.section.type)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => undoDeleteSection(deleted.id)}
                        className="h-6 w-6 p-0"
                      >
                        <Undo2 className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Reusable Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Layers3 className="h-4 w-4" />
              Saved Blocks
            </CardTitle>
          </CardHeader>
          <CardContent>
            {reusableBlocks.length === 0 ? (
              <p className="text-sm text-gray-500">No saved blocks yet. Hover over a section and click the block icon to save it.</p>
            ) : (
              <div className="space-y-2">
                {reusableBlocks.map(block => (
                  <div key={block.id} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      {React.createElement(getSectionIcon(block.type), { className: "h-4 w-4" })}
                      <span className="text-sm font-medium">{block.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newSection = {
                            id: `section-${Date.now()}`,
                            type: block.type,
                            content: JSON.parse(JSON.stringify(block.content)),
                            styles: JSON.parse(JSON.stringify(block.styles)),
                            visibility: { desktop: true, tablet: true, mobile: true },
                            locked: false
                          };
                          
                          updateProject(project => {
                            const pageIndex = project.content.pages.findIndex(p => p.id === currentPageId);
                            if (pageIndex === -1) return project;
                      
                            const sections = [...project.content.pages[pageIndex].sections];
                            sections.push(newSection);
                      
                            const newPages = [...project.content.pages];
                            newPages[pageIndex] = { ...newPages[pageIndex], sections };
                      
                            return { ...project, content: { ...project.content, pages: newPages } };
                          });
                          
                          // Mark as recently added for animation
                          setRecentlyAddedSections(prev => new Set([...prev, newSection.id]));
                          setTimeout(() => {
                            setRecentlyAddedSections(prev => {
                              const newSet = new Set(prev);
                              newSet.delete(newSection.id);
                              return newSet;
                            });
                          }, 2000);
                          
                          toast.success('Block added to page');
                        }}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setReusableBlocks(prev => prev.filter(b => b.id !== block.id));
                          toast.success('Block removed');
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderPreview = () => {
    if (!currentPage) return null;
    
    const navigation = currentPage.sections.find(section => section.type === 'navigation');

    return (
      <div className={`${getDeviceWidth()} mx-auto bg-white min-h-screen transition-all duration-300`}>
        {/* Navigation Preview */}
        {navigation && (
          <nav className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-bold text-xl text-primary">
                {navigation.content.logo || 'Logo'}
              </div>
              {deviceMode !== 'mobile' && (
                <div className="flex items-center space-x-6">
                  {navigation.content.menuItems?.map((item: string, index: number) => (
                    <button
                      key={index}
                      className="text-gray-600 hover:text-primary transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        )}

        {/* Render other sections with animations */}
  {/* Removed mode="wait" to prevent warning when animating multiple sibling sections */}
  <AnimatePresence>
          {currentPage.sections
            .filter(section => section.type !== 'navigation')
            .map((section, index) => renderSectionPreview(section, index))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
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
          </div>

          <div className="flex items-center space-x-2">
            {/* Device Preview */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={deviceMode === 'desktop' ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceMode('desktop')}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'tablet' ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceMode('tablet')}
              >
                <Tablet className="h-4 w-4" />
              </Button>
              <Button
                variant={deviceMode === 'mobile' ? "default" : "ghost"}
                size="sm"
                onClick={() => setDeviceMode('mobile')}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Visual Helpers */}
            <Button
              variant={showGrid ? "default" : "outline"}
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            
            <Button
              variant={inspectionMode ? "default" : "outline"}
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
            
            <Button variant="outline" onClick={handleSave}>
              <Save className="h-4 w-4 mr-1" />
              Save
            </Button>

            <Button onClick={handlePublish}>
              <Globe className="h-4 w-4 mr-1" />
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <div className="w-96 border-r bg-white flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <div className="p-6">
            {/* Page Management */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">Pages</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newPage = {
                      id: `page-${Date.now()}`,
                      name: 'New Page',
                      path: `/page-${Date.now()}`,
                      sections: [
                        {
                          id: `navigation-${Date.now()}`,
                          type: 'navigation' as const,
                          content: {
                            logo: 'Your Logo',
                            menuItems: ['Home', 'About', 'Services', 'Contact']
                          }
                        },
                        {
                          id: `footer-${Date.now()}`,
                          type: 'footer' as const,
                          content: {
                            companyName: 'Your Company',
                            description: 'Your company description',
                            links: ['Privacy', 'Terms', 'Contact']
                          }
                        }
                      ]
                    };
                    updateProject(project => ({
                      ...project,
                      content: {
                        ...project.content,
                        pages: [...project.content.pages, newPage]
                      }
                    }));
                    setCurrentPageId(newPage.id);
                    toast.success('New page created');
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                {currentProject.content.pages.map((page, index) => (
                  <div key={page.id} className={`flex items-center justify-between p-2 rounded border ${currentPageId === page.id ? 'bg-primary/10 border-primary' : 'bg-gray-50'}`}>
                    <div className="flex-1 cursor-pointer" onClick={() => setCurrentPageId(page.id)}>
                      <div className="font-medium text-sm">{page.name}</div>
                      <div className="text-xs text-gray-500">{page.path}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          const newName = prompt('Enter page name:', page.name);
                          const newPath = prompt('Enter page path:', page.path);
                          if (newName && newPath) {
                            updateProject(project => ({
                              ...project,
                              content: {
                                ...project.content,
                                pages: project.content.pages.map(p => 
                                  p.id === page.id ? { ...p, name: newName, path: newPath } : p
                                )
                              }
                            }));
                          }
                        }}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      {currentProject.content.pages.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Delete page "${page.name}"?`)) {
                              updateProject(project => ({
                                ...project,
                                content: {
                                  ...project.content,
                                  pages: project.content.pages.filter(p => p.id !== page.id)
                                }
                              }));
                              if (currentPageId === page.id) {
                                setCurrentPageId(project.content.pages[0].id);
                              }
                              toast.success('Page deleted');
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar Tabs */}
            <Tabs value={sidebarTab} onValueChange={(v) => setSidebarTab(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-6 sticky top-0 z-10 bg-white">
                <TabsTrigger value="content" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <Edit3 className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">Content</span>
                </TabsTrigger>
                <TabsTrigger value="design" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <PaintBucket className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">Design</span>
                </TabsTrigger>
                <TabsTrigger value="sections" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <Plus className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">Sections</span>
                </TabsTrigger>
                <TabsTrigger value="seo" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <Target className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">SEO</span>
                </TabsTrigger>
                <TabsTrigger value="history" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <History className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">History</span>
                </TabsTrigger>
                <TabsTrigger value="settings" className="flex flex-col items-center gap-1 py-2 px-1 data-[state=active]:bg-primary/10">
                  <Settings className="h-4 w-4" />
                  <span className="text-xs hidden sm:block">Settings</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="mt-6">
                {renderContentEditor()}
              </TabsContent>

              <TabsContent value="design" className="mt-6">
                {renderDesignEditor()}
              </TabsContent>

              <TabsContent value="sections" className="mt-6">
                {renderSectionLibrary()}
              </TabsContent>

              <TabsContent value="seo" className="mt-6">
                <SEOPanel
                  pages={currentProject.content.pages.map(page => ({
                    ...page,
                    seo: (page as any).seo || {
                      title: '',
                      description: '',
                      keywords: '',
                      slug: page.path,
                      noIndex: false,
                      noFollow: false,
                      customMeta: []
                    }
                  }))}
                  currentPageId={currentPageId}
                  onUpdatePageSEO={(pageId, seoData) => {
                    updateProject(project => {
                      const newPages = project.content.pages.map(page => 
                        page.id === pageId ? { ...page, seo: seoData } as any : page
                      );
                      return {
                        ...project,
                        content: { ...project.content, pages: newPages }
                      };
                    });
                    toast.success('SEO settings updated');
                  }}
                  onGenerateMetaTags={() => toast.success('Meta tags generated')}
                  onPreviewSEO={() => toast.success('SEO preview opened')}
                  onExportSitemap={() => toast.success('Sitemap exported')}
                />
              </TabsContent>

              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">Version History</h3>
                      <p className="text-sm text-muted-foreground">
                        Track changes and restore previous versions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleUndo} disabled={undoStack.length === 0}>
                        <RotateCcw className="h-4 w-4 mr-1" />
                        Undo
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleRedo} disabled={redoStack.length === 0}>
                        <Redo className="h-4 w-4 mr-1" />
                        Redo
                      </Button>
                    </div>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Recent Changes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {undoStack.slice(-10).reverse().map((_, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded">
                            <div className="flex items-center gap-2">
                              <History className="h-4 w-4 text-gray-500" />
                              <div>
                                <div className="text-sm font-medium">Version {undoStack.length - index}</div>
                                <div className="text-xs text-gray-500">
                                  {new Date().toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const stepsBack = index + 1;
                                for (let i = 0; i < stepsBack; i++) {
                                  handleUndo();
                                }
                                toast.success('Version restored');
                              }}
                            >
                              Restore
                            </Button>
                          </div>
                        ))}
                        {undoStack.length === 0 && (
                          <p className="text-sm text-gray-500 text-center py-4">
                            No version history yet. Make changes to start tracking versions.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Auto-Save Status</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm">Auto-save enabled</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Changes are automatically saved every 30 seconds
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="mt-6">
                {renderSettings()}
              </TabsContent>
            </Tabs>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50" ref={previewContainerRef}>
          <div className="p-6">
            {renderPreview()}
          </div>
        </div>
      </div>

      {/* Section Library Dialog */}
      <Dialog open={showSectionLibrary} onOpenChange={setShowSectionLibrary}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Section</DialogTitle>
          </DialogHeader>
          {renderSectionLibrary()}
        </DialogContent>
      </Dialog>

      {/* Media Manager */}
      {isMediaManagerOpen && (
        <MediaManager
          isOpen={isMediaManagerOpen}
          onSelectMedia={handleMediaSelect}
          onClose={() => setIsMediaManagerOpen(false)}
          allowMultiple={false}
          acceptedTypes={['image']}
        />
      )}

      {/* Inline Toolbar */}
      {renderInlineToolbar()}

      {/* Drag Preview */}
      {dragPreview && isDragging && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: dragPreview.x - 100,
            top: dragPreview.y - 20,
            transform: 'translate(-50%, -50%)'
          }}
        >
          <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-3 opacity-90">
            <div className="flex items-center gap-2">
              {React.createElement(getSectionIcon(dragPreview.section.type), { className: "h-4 w-4 text-primary" })}
              <span className="text-sm font-medium">{formatSectionTitle(dragPreview.section.type)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}