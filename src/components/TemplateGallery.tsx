import React, { useState, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Search, 
  Grid3X3, 
  List, 
  Filter,
  ArrowLeft,
  Globe,
  Eye,
  Smartphone,
  Monitor,
  Star,
  Heart,
  Download,
  Zap,
  Sparkles
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  content: any;
}

interface TemplateGalleryProps {
  templates: Template[];
  onSelectTemplate: (template: Template) => void;
  onNavigate: (page: 'landing' | 'gallery' | 'preview' | 'editor' | 'dashboard') => void;
}

export function TemplateGallery({ templates, onSelectTemplate, onNavigate }: TemplateGalleryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [favorites, setFavorites] = useState<Set<string>>(new Set());

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(templates.map(t => t.category.toLowerCase()))];
    return cats.map(cat => ({
      id: cat,
      name: cat === 'all' ? 'All Templates' : cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? templates.length : templates.filter(t => t.category.toLowerCase() === cat).length
    }));
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    let filtered = templates.filter(template => {
      const matchesSearch = template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           template.category.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'all' || 
                             template.category.toLowerCase() === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    // Sort templates
    switch (sortBy) {
      case 'popular':
        // Simulate popularity by template order
        break;
      case 'newest':
        filtered = [...filtered].reverse();
        break;
      case 'name':
        filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  }, [templates, searchQuery, selectedCategory, sortBy]);

  const toggleFavorite = (templateId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(templateId)) {
        newFavorites.delete(templateId);
      } else {
        newFavorites.add(templateId);
      }
      return newFavorites;
    });
  };

  const handlePreviewTemplate = (template: Template) => {
    onSelectTemplate(template);
  };

  const renderTemplateCard = (template: Template) => {
    const isFavorited = favorites.has(template.id);
    
    if (viewMode === 'list') {
      return (
        <Card key={template.id} className="hover:shadow-lg transition-all duration-300 group">
          <CardContent className="p-0">
            <div className="flex">
              <div className="w-64 h-40 relative overflow-hidden rounded-l-lg">
                <ImageWithFallback
                  src={template.thumbnail}
                  alt={template.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                </div>
              </div>
              
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">{template.title}</h3>
                      <Badge variant="secondary">{template.category}</Badge>
                      {template.id <= '6' && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Star className="h-3 w-3 mr-1" />
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{template.description}</p>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavorite(template.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Heart className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Monitor className="h-4 w-4 mr-1" />
                      Responsive
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      Fast Setup
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                    >
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      onClick={() => handlePreviewTemplate(template)}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return (
      <Card key={template.id} className="group cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className="relative">
          <ImageWithFallback
            src={template.thumbnail}
            alt={template.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-2">
            <Button 
              size="sm" 
              variant="secondary"
              onClick={() => handlePreviewTemplate(template)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button 
              size="sm"
              onClick={() => handlePreviewTemplate(template)}
            >
              Use Template
            </Button>
          </div>

          {/* Badges */}
          <div className="absolute top-3 left-3 flex space-x-2">
            <Badge variant="secondary" className="bg-white/90 text-gray-900">
              {template.category}
            </Badge>
            {template.id <= '6' && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                <Star className="h-3 w-3 mr-1" />
                Popular
              </Badge>
            )}
          </div>

          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              toggleFavorite(template.id);
            }}
            className="absolute top-3 right-3 text-white hover:text-red-500 bg-black/20 hover:bg-black/40"
          >
            <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
          </Button>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold group-hover:text-blue-600 transition-colors">
              {template.title}
            </h3>
          </div>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {template.description}
          </p>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <Monitor className="h-3 w-3 mr-1" />
                Responsive
              </div>
              <div className="flex items-center">
                <Zap className="h-3 w-3 mr-1" />
                Fast
              </div>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-blue-600 hover:text-blue-700 p-0 h-auto"
              onClick={() => handlePreviewTemplate(template)}
            >
              Use Template →
            </Button>
          </div>
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
                Template Gallery
              </h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={() => onNavigate('dashboard')}>
              Dashboard
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Professionally designed templates for every industry. Each template is fully customizable, 
            mobile-responsive, and ready to launch in minutes.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Sparkles className="h-4 w-4 mr-2 text-yellow-500" />
              {templates.length} Premium Templates
            </div>
            <div className="flex items-center">
              <Monitor className="h-4 w-4 mr-2 text-blue-500" />
              100% Mobile Responsive
            </div>
            <div className="flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-500" />
              One-Click Setup
            </div>
          </div>
        </div>
      </section>

      {/* Filters and Search */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search templates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popular">Popular</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>

                {/* View Mode */}
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
          </div>
        </div>
      </section>

      {/* Category Tabs */}
      <section className="px-4 mb-8">
        <div className="max-w-7xl mx-auto">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 h-auto p-1 bg-white border">
              {categories.slice(0, 8).map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-sm py-2 px-3 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Results Header */}
      <section className="px-4 mb-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                Showing {filteredTemplates.length} of {templates.length} templates
                {searchQuery && ` for "${searchQuery}"`}
                {selectedCategory !== 'all' && ` in ${categories.find(c => c.id === selectedCategory)?.name}`}
              </p>
            </div>
            
            {filteredTemplates.length === 0 && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Templates Grid/List */}
      <main className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or browse all templates
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
              >
                View All Templates
              </Button>
            </div>
          ) : (
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                : 'space-y-6'
            }`}>
              {filteredTemplates.map(renderTemplateCard)}
            </div>
          )}
        </div>
      </main>

      {/* Bottom CTA */}
      <section className="px-4 py-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Can't Find the Perfect Template?
          </h2>
          <p className="text-xl mb-6 opacity-90">
            Start with a blank canvas or request a custom template from our design team
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-blue-600 hover:bg-gray-100"
            >
              Start from Scratch
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-blue-600"
            >
              Request Custom Design
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}