import React, { useState } from 'react';
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
  ArrowLeft,
  Monitor,
  Smartphone,
  Type,
  FileText,
  Users,
  Star,
  MapPin,
  Image as ImageIcon,
  Globe,
  Settings,
  Layers
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';
import { toast } from 'sonner';

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

interface SimpleTemplateEditorProps {
  project: UserProject;
  onSave: (project: UserProject) => void;
  onPublish: (project: UserProject) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

export function SimpleTemplateEditor({ project, onSave, onPublish, onNavigate }: SimpleTemplateEditorProps) {
  const [currentProject, setCurrentProject] = useState<UserProject>(project);
  const [currentPageId, setCurrentPageId] = useState(project.content.pages[0]?.id || '');
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isMobilePreview, setIsMobilePreview] = useState(false);

  const currentPage = currentProject.content.pages.find(page => page.id === currentPageId);

  // Sync local editor state when parent project changes (e.g., id or content updated)
  React.useEffect(() => {
    setCurrentProject(project);
    if (project.content?.pages?.length) {
      const exists = project.content.pages.some(p => p.id === currentPageId);
      if (!exists) {
        setCurrentPageId(project.content.pages[0].id);
      }
    }
  }, [project]);

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

  const renderSectionEditor = (section: any) => {
    const Icon = getSectionIcon(section.type);
    
    return (
      <Card key={section.id} className="mb-4">
        <CardHeader 
          className={`cursor-pointer transition-colors ${selectedSection === section.id ? 'bg-muted/50' : ''}`}
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
              <label className="block text-sm font-medium mb-2">Background Image URL</label>
              <Input
                value={section.content.backgroundImage || ''}
                onChange={(e) => updateSectionContent(section.id, { backgroundImage: e.target.value })}
                placeholder="Enter image URL"
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
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <Input
                value={section.content.image || ''}
                onChange={(e) => updateSectionContent(section.id, { image: e.target.value })}
                placeholder="Enter image URL"
              />
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
              <div className="text-xs text-muted-foreground mb-2">
                This template includes {section.content.services?.length || 0} services. Advanced service editing will be available in future updates.
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
              <div className="text-xs text-muted-foreground mb-2">
                This template includes {section.content.members?.length || 0} team members. Advanced member editing will be available in future updates.
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
            Editing for "{section.type}" sections will be available in future updates.
          </div>
        );
    }
  };

  const renderSectionPreview = (section: any) => {
    switch (section.type) {
      case 'hero':
        return (
          <div 
            className="relative min-h-[400px] flex items-center justify-center text-white"
            style={{ 
              backgroundImage: section.content.backgroundImage 
                ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})` 
                : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            <div className="text-center max-w-4xl px-6">
              <h1 className={`${isMobilePreview ? 'text-2xl' : 'text-4xl md:text-5xl'} font-bold mb-6`}>
                {section.content.title || 'Your Amazing Title'}
              </h1>
              <p className={`${isMobilePreview ? 'text-base' : 'text-lg md:text-xl'} mb-8 opacity-90`}>
                {section.content.subtitle || 'Your compelling subtitle goes here'}
              </p>
              {section.content.buttonText && (
                <Button size={isMobilePreview ? "default" : "lg"} className="bg-white text-blue-600 hover:bg-gray-100">
                  {section.content.buttonText}
                </Button>
              )}
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">
                  {section.content.title || 'About Us'}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {section.content.description || 'Tell your story and connect with your audience. Share what makes your business unique.'}
                </p>
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

      case 'services':
        return (
          <div className="py-16 px-6 bg-gray-50">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Our Services'}
              </h2>
              <p className="text-gray-600 mb-12">
                {section.content.description || 'We offer comprehensive solutions to help you succeed'}
              </p>
              {section.content.services && (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {section.content.services.slice(0, 6).map((service: any, index: number) => (
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
          <div className="py-16 px-6">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Meet Our Team'}
              </h2>
              <p className="text-gray-600 mb-12">
                {section.content.description || 'Our experienced professionals are here to help you succeed'}
              </p>
              {section.content.members && (
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {section.content.members.slice(0, 8).map((member: any, index: number) => (
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

      case 'contact':
        return (
          <div className="py-16 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">
                {section.content.title || 'Contact Us'}
              </h2>
              <p className="text-gray-600 mb-8">
                {section.content.description || 'Get in touch with us today'}
              </p>
              <div className="grid md:grid-cols-3 gap-6">
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
          <footer className="bg-gray-900 text-white py-12 px-6">
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

      default:
        return (
          <div className="py-12 px-6 bg-gray-100 border-2 border-dashed border-gray-300">
            <div className="text-center text-gray-500">
              <div className="text-4xl mb-2">📄</div>
              <h3 className="font-medium">{formatSectionTitle(section.type)} Section</h3>
              <p className="text-sm">This section type is not yet supported in preview</p>
            </div>
          </div>
        );
    }
  };

  const renderPreview = () => {
    if (!currentPage) return null;
    
    const navigation = currentPage.sections.find(section => section.type === 'navigation');

    return (
      <div className={`${isMobilePreview ? 'max-w-sm mx-auto' : 'w-full'} bg-white min-h-screen`}>
        {/* Navigation Preview */}
        {navigation && (
          <nav className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-bold text-xl text-primary">
                {navigation.content.logo || 'Logo'}
              </div>
              {!isMobilePreview && (
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

        {/* Render other sections */}
        {currentPage.sections
          .filter(section => section.type !== 'navigation')
          .map(section => (
            <div key={section.id}>
              {renderSectionPreview(section)}
            </div>
          ))}
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
            {/* Preview Mode Toggle */}
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(!previewMode)}
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Button>

            {/* Device Toggle */}
            <div className="flex items-center border rounded-lg">
              <Button
                variant={!isMobilePreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsMobilePreview(false)}
              >
                <Monitor className="h-4 w-4" />
              </Button>
              <Button
                variant={isMobilePreview ? "default" : "ghost"}
                size="sm"
                onClick={() => setIsMobilePreview(true)}
              >
                <Smartphone className="h-4 w-4" />
              </Button>
            </div>

            <Separator orientation="vertical" className="h-6" />

            {/* Actions */}
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
        {/* Sidebar - Only show in edit mode */}
        {!previewMode && (
          <div className="w-80 border-r bg-white overflow-y-auto">
            <div className="p-6">
              {/* Page Selector */}
              {currentProject.content.pages.length > 1 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Current Page</label>
                  <select 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    value={currentPageId}
                    onChange={(e) => setCurrentPageId(e.target.value)}
                  >
                    {currentProject.content.pages.map(page => (
                      <option key={page.id} value={page.id}>{page.name}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Sections */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Layers className="h-5 w-5 mr-2" />
                  Page Sections
                </h3>
                {currentPage?.sections.map(renderSectionEditor)}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-50">
          <div className="p-4">
            {renderPreview()}
          </div>
        </div>
      </div>
    </div>
  );
}