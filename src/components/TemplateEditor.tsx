import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
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
  Upload,
  FileText,
  Users,
  Star,
  MapPin,
  Layers,
  Plus,
  Move,
  Copy,
  Trash2,
  RotateCcw,
  Redo,
  Zap,
  MousePointer
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';
import { MediaManager } from './MediaManager';

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
      }>;
    }>;
  };
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
}

interface TemplateEditorProps {
  project: UserProject;
  onSave: (project: UserProject) => void;
  onPublish: (project: UserProject) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

export function TemplateEditor({ project, onSave, onPublish, onNavigate }: TemplateEditorProps) {
  const [currentProject, setCurrentProject] = useState<UserProject>(project);
  const [currentPageId, setCurrentPageId] = useState(project.content.pages[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);
  const [isMediaManagerOpen, setIsMediaManagerOpen] = useState(false);
  const [currentImageField, setCurrentImageField] = useState<{sectionId: string, field: string} | null>(null);
  const [sidebarTab, setSidebarTab] = useState<'content' | 'design' | 'settings'>('content');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPage = currentProject.content.pages.find(page => page.id === currentPageId);

  const handleSave = () => {
    onSave(currentProject);
  };

  const handlePublish = () => {
    onPublish(currentProject);
  };

  const updateSectionContent = (sectionId: string, newContent: any) => {
    const updatedProject = {
      ...currentProject,
      content: {
        ...currentProject.content,
        pages: currentProject.content.pages.map(page => ({
          ...page,
          sections: page.sections.map(section =>
            section.id === sectionId
              ? { ...section, content: { ...section.content, ...newContent } }
              : section
          )
        }))
      }
    };
    setCurrentProject(updatedProject);
  };

  const handleImageUpload = (sectionId: string, field: string) => {
    setCurrentImageField({ sectionId, field });
    setIsMediaManagerOpen(true);
  };

  const handleMediaSelect = (media: any) => {
    if (currentImageField) {
      updateSectionContent(currentImageField.sectionId, { 
        [currentImageField.field]: media.url 
      });
      setCurrentImageField(null);
    }
  };

  const renderSectionEditor = (section: any) => {
    const Icon = getSectionIcon(section.type);
    
    return (
      <Card key={section.id} className="mb-4">
        <CardHeader 
          className={`cursor-pointer ${selectedSection === section.id ? 'bg-muted/50' : ''}`}
          onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
        >
          <CardTitle className="flex items-center gap-2 text-base">
            <Icon className="h-4 w-4" />
            {formatSectionTitle(section.type)}
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
      footer: FileText
    };
    return iconMap[type] || FileText;
  };

  const formatSectionTitle = (type: string) => {
    return type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');
  };

  const renderSectionFields = (section: any) => {
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
                  menuItems: e.target.value.split(',').map(item => item.trim()) 
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
              <label className="block text-sm font-medium mb-2">Image URL</label>
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
              <p className="text-xs text-muted-foreground mb-2">
                Services are managed in the template structure. Contact support to modify service items.
              </p>
              <div className="bg-muted/30 p-3 rounded">
                {section.content.services?.length || 0} services configured
              </div>
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
              <p className="text-xs text-muted-foreground mb-2">
                Team members are managed in the template structure. Contact support to modify team members.
              </p>
              <div className="bg-muted/30 p-3 rounded">
                {section.content.members?.length || 0} team members configured
              </div>
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
              <label className="block text-sm font-medium mb-2">Links (comma separated)</label>
              <Input
                value={section.content.links?.join(', ') || ''}
                onChange={(e) => updateSectionContent(section.id, { 
                  links: e.target.value.split(',').map(item => item.trim()) 
                })}
                placeholder="Privacy, Terms, Contact"
              />
            </div>
          </div>
        );

      default:
        return (
          <div className="text-muted-foreground text-sm">
            Section type "{section.type}" editor not implemented yet.
          </div>
        );
    }
  };

  const renderPreview = () => {
    if (!currentPage) return null;
    
    const navigation = currentPage.sections.find(section => section.type === 'navigation');

    return (
      <div className={`${isMobilePreview ? 'max-w-sm mx-auto' : 'w-full'} bg-white`}>
        {/* Navigation Preview */}
        {navigation && (
          <nav className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-bold text-xl text-primary">
                {navigation.content.logo || 'Logo'}
              </div>
              <div className={`${isMobilePreview ? 'hidden' : 'flex'} items-center space-x-6`}>
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

  const renderSectionPreview = (section: any) => {
    switch (section.type) {
      case 'hero':
        return (
          <div 
            className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-white"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})` 
            }}
          >
            <div className="text-center max-w-4xl px-4">
              <h1 className={`${isMobilePreview ? 'text-2xl' : 'text-3xl md:text-5xl lg:text-6xl'} mb-4`}>
                {section.content.title || 'Your Title Here'}
              </h1>
              <p className={`${isMobilePreview ? 'text-base' : 'text-lg md:text-xl'} mb-8 opacity-90`}>
                {section.content.subtitle || 'Your subtitle here'}
              </p>
              <Button size={isMobilePreview ? "default" : "lg"} className="bg-white text-black hover:bg-gray-100">
                {section.content.buttonText || 'Call to Action'}
              </Button>
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-16 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl mb-6">{section.content.title || 'About Us'}</h2>
              <p className="text-lg text-gray-600">
                {section.content.description || 'Your about description goes here.'}
              </p>
              {section.content.image && (
                <div className="mt-8">
                  <ImageWithFallback
                    src={section.content.image}
                    alt="About"
                    className="w-64 h-64 mx-auto rounded-lg object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="py-16 px-4 bg-gray-50">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl mb-6">{section.content.title || 'Contact Us'}</h2>
              <p className="text-lg text-gray-600 mb-8">
                {section.content.description || 'Get in touch with us'}
              </p>
              <div className="space-y-4">
                {section.content.email && (
                  <p className="text-lg">
                    <strong>Email:</strong> {section.content.email}
                  </p>
                )}
                {section.content.phone && (
                  <p className="text-lg">
                    <strong>Phone:</strong> {section.content.phone}
                  </p>
                )}
                {section.content.address && (
                  <p className="text-lg whitespace-pre-line">
                    <strong>Address:</strong><br />
                    {section.content.address}
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="py-8 px-4 bg-muted/30 text-center">
            <p className="text-muted-foreground">
              {formatSectionTitle(section.type)} section preview
            </p>
          </div>
        );
    }
  };

  const renderContentTab = () => {
    if (!currentPage) return null;

    return (
      <div className="space-y-6">
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
              Theme Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Primary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  className="w-10 h-10 rounded border border-gray-300"
                  defaultValue="#3b82f6"
                />
                <Input placeholder="#3b82f6" defaultValue="#3b82f6" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Secondary Color</label>
              <div className="flex items-center space-x-2">
                <input 
                  type="color" 
                  className="w-10 h-10 rounded border border-gray-300"
                  defaultValue="#8b5cf6"
                />
                <Input placeholder="#8b5cf6" defaultValue="#8b5cf6" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Font Family</label>
              <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                <option>Inter</option>
                <option>Roboto</option>
                <option>Open Sans</option>
                <option>Poppins</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Plus className="h-4 w-4 mr-2" />
              Add Section
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <ImageIcon className="h-4 w-4 mr-2" />
              Media Library
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Copy className="h-4 w-4 mr-2" />
              Duplicate Page
            </Button>
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
                    <Globe className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              SEO Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Page Title</label>
              <Input placeholder="Your awesome website title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Meta Description</label>
              <Textarea 
                placeholder="Describe your website for search engines"
                rows={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keywords</label>
              <Input placeholder="keyword1, keyword2, keyword3" />
            </div>
          </CardContent>
        </Card>
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
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center bg-muted rounded-lg p-1">
              <Button
                variant={!previewMode ? "default" : "ghost"}
                size="sm"
                onClick={() => setPreviewMode(false)}
                className="text-xs px-3"
              >
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

            {previewMode && (
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={!isMobilePreview ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsMobilePreview(false)}
                  className="text-xs px-2"
                >
                  <Monitor className="h-3 w-3" />
                </Button>
                <Button
                  variant={isMobilePreview ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setIsMobilePreview(true)}
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
      </div>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-121px)]">
        {/* Editor Sidebar */}
        {!previewMode && (
          <div className="w-80 border-r bg-background flex flex-col">
            {/* Sidebar Tabs */}
            <div className="border-b px-4 py-3">
              <Tabs value={sidebarTab} onValueChange={(value) => setSidebarTab(value as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="content" className="text-xs">
                    <Type className="h-3 w-3 mr-1" />
                    Content
                  </TabsTrigger>
                  <TabsTrigger value="design" className="text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Design
                  </TabsTrigger>
                  <TabsTrigger value="settings" className="text-xs">
                    <Settings className="h-3 w-3 mr-1" />
                    Settings
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

      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}