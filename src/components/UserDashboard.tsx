import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Plus, 
  Search, 
  Globe, 
  Edit, 
  Trash2, 
  Copy, 
  MoreVertical,
  ArrowLeft,
  Grid3X3,
  List,
  Filter,
  Calendar,
  Eye,
  Download,
  Share,
  Settings,
  Folder,
  Clock,
  TrendingUp,
  Users,
  Target,
  Star,
  Zap,
  Activity,
  BarChart3,
  ExternalLink
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface UserProject {
  id: string;
  name: string;
  templateId: string;
  content: any;
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
  thumbnail?: string;
  category?: string;
  views?: number;
  status?: 'draft' | 'published' | 'archived';
}

interface UserDashboardProps {
  projects: UserProject[];
  onEditProject: (project: UserProject) => void;
  onDeleteProject: (projectId: string) => void;
  onViewPublished: (projectId: string) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

export function UserDashboard({ 
  projects, 
  onEditProject, 
  onDeleteProject, 
  onViewPublished, 
  onNavigate 
}: UserDashboardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('modified');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  // Generate thumbnails for projects that don't have them
  const projectsWithThumbnails = projects.map(project => ({
    ...project,
    thumbnail: project.thumbnail || getThumbnailByTemplate(project.templateId),
    category: project.category || getCategoryByTemplate(project.templateId),
    views: project.views || Math.floor(Math.random() * 1000),
    status: project.status || (project.isPublished ? 'published' : 'draft')
  }));

  function getThumbnailByTemplate(templateId: string): string {
    const thumbnails: { [key: string]: string } = {
      '1': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop',
      '2': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop',
      '3': 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
      '4': 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop',
    };
    return thumbnails[templateId] || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop';
  }

  function getCategoryByTemplate(templateId: string): string {
    const categories: { [key: string]: string } = {
      '1': 'Business',
      '2': 'Portfolio',
      '3': 'Restaurant',
      '4': 'Technology',
    };
    return categories[templateId] || 'General';
  }

  const filteredProjects = projectsWithThumbnails.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || project.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.name.localeCompare(b.name);
      case 'created':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'modified':
        return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime();
      case 'views':
        return (b.views || 0) - (a.views || 0);
      default:
        return 0;
    }
  });

  const stats = {
    totalProjects: projects.length,
    publishedProjects: projects.filter(p => p.isPublished).length,
    draftProjects: projects.filter(p => !p.isPublished).length,
    totalViews: projectsWithThumbnails.reduce((sum, p) => sum + (p.views || 0), 0)
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleSelectProject = (projectId: string) => {
    setSelectedProjects(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(projectId)) {
        newSelected.delete(projectId);
      } else {
        newSelected.add(projectId);
      }
      return newSelected;
    });
  };

  const handleBulkDelete = () => {
    selectedProjects.forEach(projectId => onDeleteProject(projectId));
    setSelectedProjects(new Set());
  };

  const duplicateProject = (project: UserProject) => {
    const duplicatedProject = {
      ...project,
      id: `temp-duplicate-${Date.now()}`, // Use temp prefix to indicate it needs saving
      name: `${project.name} (Copy)`,
      isPublished: false,
      publishUrl: undefined,
      lastModified: new Date().toISOString()
    };
    // This would normally call a function to add the project
    console.log('Duplicating project:', duplicatedProject);
    // For now, we'll show a toast notification
    import('sonner').then(({ toast }) => {
      toast.info(`Project duplicated! Remember to save it to persist changes.`);
    });
  };

  const exportProject = (project: UserProject) => {
    // Export project as JSON
    const exportData = {
      name: project.name,
      category: project.category,
      content: project.content,
      thumbnail: project.thumbnail,
      lastModified: project.lastModified
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_export.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    import('sonner').then(({ toast }) => {
      toast.success(`Project "${project.name}" exported successfully!`);
    });
  };

  const shareProject = (project: UserProject) => {
    // Copy share link to clipboard
    if (project.isPublished && project.publishUrl) {
      navigator.clipboard.writeText(project.publishUrl).then(() => {
        import('sonner').then(({ toast }) => {
          toast.success('Published link copied to clipboard!');
        });
      }).catch(() => {
        import('sonner').then(({ toast }) => {
          toast.error('Failed to copy link to clipboard');
        });
      });
    } else {
      // Share project data or show publish first message
      const shareUrl = `${window.location.origin}/shared/${project.id}`;
      navigator.clipboard.writeText(shareUrl).then(() => {
        import('sonner').then(({ toast }) => {
          toast.success('Share link copied to clipboard!');
        });
      }).catch(() => {
        import('sonner').then(({ toast }) => {
          toast.error('Failed to copy share link');
        });
      });
    }
  };

  const renderProjectCard = (project: UserProject) => {
    const isSelected = selectedProjects.has(project.id);

    if (viewMode === 'list') {
      return (
        <Card key={project.id} className={`hover:shadow-md transition-all duration-200 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleSelectProject(project.id)}
                className="rounded border-gray-300"
              />
              
              <div className="w-16 h-12 rounded overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={project.thumbnail!}
                  alt={project.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="font-semibold truncate">{project.name}</h3>
                  <Badge 
                    variant={project.status === 'published' ? 'default' : 'secondary'}
                    className="text-xs"
                  >
                    {project.status}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {project.category}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500">
                  Modified {formatDate(project.lastModified)}
                </p>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-1" />
                  {project.views}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEditProject(project)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
                
                {project.isPublished && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewPublished(project.id)}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                )}
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem onClick={() => duplicateProject(project)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => exportProject(project)}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => shareProject(project)}>
                      <Share className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => onDeleteProject(project.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={project.id} className={`group hover:shadow-xl transition-all duration-300 overflow-hidden ${isSelected ? 'ring-2 ring-blue-500' : ''}`}>
        <div className="relative">
          <ImageWithFallback
            src={project.thumbnail!}
            alt={project.name}
            className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => handleSelectProject(project.id)}
            className="absolute top-3 left-3 rounded border-gray-300 bg-white/80"
          />
          
          <div className="absolute top-3 right-3 flex space-x-1">
            <Badge 
              variant={project.status === 'published' ? 'default' : 'secondary'}
              className="bg-white/90 text-gray-900"
            >
              {project.status}
            </Badge>
          </div>
          
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => onEditProject(project)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            {project.isPublished && (
              <Button 
                size="sm"
                onClick={() => onViewPublished(project.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
            )}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold truncate">{project.name}</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => duplicateProject(project)}>
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportProject(project)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareProject(project)}>
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => onDeleteProject(project.id)}
                  className="text-red-600"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <Badge variant="outline" className="text-xs">
              {project.category}
            </Badge>
            <div className="flex items-center">
              <Eye className="h-3 w-3 mr-1" />
              {project.views}
            </div>
          </div>
          
          <p className="text-xs text-gray-500">
            Modified {formatDate(project.lastModified)}
          </p>
          
          {project.isPublished && (
            <div className="mt-3 pt-3 border-t">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full text-xs"
                onClick={() => window.open(project.publishUrl, '_blank')}
              >
                <Globe className="h-3 w-3 mr-2" />
                View Live Site
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={() => onNavigate('landing')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Globe className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                My Dashboard
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button 
              onClick={() => onNavigate('gallery')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Projects</p>
                  <p className="text-2xl font-bold">{stats.totalProjects}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Folder className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Published</p>
                  <p className="text-2xl font-bold">{stats.publishedProjects}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Globe className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Drafts</p>
                  <p className="text-2xl font-bold">{stats.draftProjects}</p>
                </div>
                <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Edit className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                onClick={() => onNavigate('gallery')}
              >
                <Plus className="h-6 w-6" />
                <span>Create New Project</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
                disabled={projects.length === 0}
              >
                <Copy className="h-6 w-6" />
                <span>Duplicate Recent</span>
              </Button>
              
              <Button 
                variant="outline" 
                className="h-20 flex flex-col space-y-2"
              >
                <Download className="h-6 w-6" />
                <span>Import Project</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Filters and Search */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="modified">Last Modified</SelectItem>
                    <SelectItem value="created">Date Created</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="views">Views</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                {selectedProjects.size > 0 && (
                  <div className="flex items-center space-x-2 mr-4">
                    <span className="text-sm text-gray-600">
                      {selectedProjects.size} selected
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleBulkDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
                
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className="px-3"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className="px-3"
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projects Grid/List */}
        {sortedProjects.length === 0 ? (
          <Card>
            <CardContent className="p-20 text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Folder className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No projects found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? 'Try adjusting your search criteria' : 'Get started by creating your first project'}
              </p>
              <Button 
                onClick={() => onNavigate('gallery')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {sortedProjects.map(renderProjectCard)}
          </div>
        )}
      </div>
    </div>
  );
}