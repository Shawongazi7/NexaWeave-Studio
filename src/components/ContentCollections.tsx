import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  Database, 
  Plus, 
  Edit3, 
  Trash2, 
  FileText, 
  Image as ImageIcon, 
  Calendar, 
  Tag, 
  User, 
  Search,
  Filter,
  Download,
  Upload,
  Copy,
  Eye,
  Settings,
  Folder,
  Grid,
  List,
  SortAsc,
  SortDesc
} from 'lucide-react';

interface CollectionField {
  id: string;
  name: string;
  type: 'text' | 'textarea' | 'image' | 'date' | 'select' | 'tags' | 'boolean';
  label: string;
  required?: boolean;
  options?: string[]; // For select fields
  defaultValue?: any;
}

interface CollectionSchema {
  id: string;
  name: string;
  slug: string;
  description?: string;
  fields: CollectionField[];
  icon: string;
  color: string;
  settings: {
    enableDrafts: boolean;
    enableCategories: boolean;
    enableTags: boolean;
    enableComments: boolean;
    sortField: string;
    sortOrder: 'asc' | 'desc';
  };
}

interface CollectionItem {
  id: string;
  collectionId: string;
  data: Record<string, any>;
  status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
  author?: string;
  category?: string;
  tags?: string[];
}

interface ContentCollectionsProps {
  collections: CollectionSchema[];
  items: CollectionItem[];
  onCreateCollection: (collection: Omit<CollectionSchema, 'id'>) => void;
  onUpdateCollection: (id: string, collection: Partial<CollectionSchema>) => void;
  onDeleteCollection: (id: string) => void;
  onCreateItem: (collectionId: string, item: Omit<CollectionItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateItem: (id: string, item: Partial<CollectionItem>) => void;
  onDeleteItem: (id: string) => void;
  onImportData: (collectionId: string, data: any[]) => void;
  onExportData: (collectionId: string) => void;
}

const FIELD_TYPES = [
  { value: 'text', label: 'Text', icon: '📝' },
  { value: 'textarea', label: 'Long Text', icon: '📄' },
  { value: 'image', label: 'Image', icon: '🖼️' },
  { value: 'date', label: 'Date', icon: '📅' },
  { value: 'select', label: 'Select', icon: '📋' },
  { value: 'tags', label: 'Tags', icon: '🏷️' },
  { value: 'boolean', label: 'Yes/No', icon: '✅' }
];

const COLLECTION_TEMPLATES = [
  {
    name: 'Blog Posts',
    slug: 'blog-posts',
    description: 'Articles and blog content',
    icon: '📝',
    color: '#3b82f6',
    fields: [
      { id: 'title', name: 'title', type: 'text', label: 'Title', required: true },
      { id: 'excerpt', name: 'excerpt', type: 'textarea', label: 'Excerpt' },
      { id: 'content', name: 'content', type: 'textarea', label: 'Content', required: true },
      { id: 'featuredImage', name: 'featuredImage', type: 'image', label: 'Featured Image' },
      { id: 'publishDate', name: 'publishDate', type: 'date', label: 'Publish Date', required: true },
      { id: 'author', name: 'author', type: 'text', label: 'Author' }
    ]
  },
  {
    name: 'Products',
    slug: 'products',
    description: 'Product catalog items',
    icon: '🛍️',
    color: '#10b981',
    fields: [
      { id: 'name', name: 'name', type: 'text', label: 'Product Name', required: true },
      { id: 'description', name: 'description', type: 'textarea', label: 'Description' },
      { id: 'price', name: 'price', type: 'text', label: 'Price', required: true },
      { id: 'image', name: 'image', type: 'image', label: 'Product Image' },
      { id: 'category', name: 'category', type: 'select', label: 'Category', options: ['Electronics', 'Clothing', 'Home', 'Sports'] },
      { id: 'inStock', name: 'inStock', type: 'boolean', label: 'In Stock' }
    ]
  },
  {
    name: 'Team Members',
    slug: 'team-members',
    description: 'Staff and team information',
    icon: '👥',
    color: '#8b5cf6',
    fields: [
      { id: 'name', name: 'name', type: 'text', label: 'Full Name', required: true },
      { id: 'role', name: 'role', type: 'text', label: 'Job Title', required: true },
      { id: 'bio', name: 'bio', type: 'textarea', label: 'Biography' },
      { id: 'photo', name: 'photo', type: 'image', label: 'Profile Photo' },
      { id: 'email', name: 'email', type: 'text', label: 'Email' },
      { id: 'department', name: 'department', type: 'select', label: 'Department', options: ['Engineering', 'Marketing', 'Sales', 'Design'] }
    ]
  },
  {
    name: 'Portfolio Projects',
    slug: 'portfolio-projects',
    description: 'Creative work and projects',
    icon: '🎨',
    color: '#f59e0b',
    fields: [
      { id: 'title', name: 'title', type: 'text', label: 'Project Title', required: true },
      { id: 'description', name: 'description', type: 'textarea', label: 'Description' },
      { id: 'image', name: 'image', type: 'image', label: 'Cover Image' },
      { id: 'category', name: 'category', type: 'select', label: 'Category', options: ['Web Design', 'Branding', 'Photography', 'Print'] },
      { id: 'completedDate', name: 'completedDate', type: 'date', label: 'Completion Date' },
      { id: 'featured', name: 'featured', type: 'boolean', label: 'Featured Project' }
    ]
  }
];

export function ContentCollections({
  collections,
  items,
  onCreateCollection,
  onUpdateCollection,
  onDeleteCollection,
  onCreateItem,
  onUpdateItem,
  onDeleteItem,
  onImportData,
  onExportData
}: ContentCollectionsProps) {
  const [activeCollection, setActiveCollection] = useState<string | null>(
    collections.length > 0 ? collections[0].id : null
  );
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [showCreateItem, setShowCreateItem] = useState(false);
  const [editingItem, setEditingItem] = useState<CollectionItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'published' | 'draft'>('all');
  const [sortField, setSortField] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const activeCollectionData = collections.find(c => c.id === activeCollection);
  const collectionItems = items.filter(item => 
    item.collectionId === activeCollection &&
    (filterStatus === 'all' || item.status === filterStatus) &&
    (!searchTerm || Object.values(item.data).some(value => 
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    ))
  ).sort((a, b) => {
    const aValue = sortField === 'updatedAt' || sortField === 'createdAt' 
      ? new Date(a[sortField]).getTime()
      : a.data[sortField] || '';
    const bValue = sortField === 'updatedAt' || sortField === 'createdAt'
      ? new Date(b[sortField]).getTime() 
      : b.data[sortField] || '';
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const createCollectionFromTemplate = (template: typeof COLLECTION_TEMPLATES[0]) => {
    const newCollection: Omit<CollectionSchema, 'id'> = {
      name: template.name,
      slug: template.slug,
      description: template.description,
      fields: template.fields.map(field => ({
        ...field,
        id: `field-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      })) as CollectionField[],
      icon: template.icon,
      color: template.color,
      settings: {
        enableDrafts: true,
        enableCategories: true,
        enableTags: true,
        enableComments: false,
        sortField: 'updatedAt',
        sortOrder: 'desc'
      }
    };
    onCreateCollection(newCollection);
    setShowCreateCollection(false);
  };

  const renderFieldInput = (field: CollectionField, value: any, onChange: (value: any) => void) => {
    switch (field.type) {
      case 'text':
        return (
          <Input
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
          />
        );
      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={`Enter ${field.label.toLowerCase()}`}
            rows={4}
          />
        );
      case 'image':
        return (
          <div className="flex items-center gap-2">
            <Input
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="Image URL"
            />
            <Button variant="outline" size="sm">
              <ImageIcon className="h-4 w-4" />
            </Button>
          </div>
        );
      case 'date':
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'select':
        return (
          <Select value={value || ''} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
            </SelectTrigger>
            <SelectContent>
              {field.options?.map(option => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'tags':
        return (
          <Input
            value={Array.isArray(value) ? value.join(', ') : value || ''}
            onChange={(e) => onChange(e.target.value.split(',').map(tag => tag.trim()).filter(Boolean))}
            placeholder="Enter tags separated by commas"
          />
        );
      case 'boolean':
        return (
          <Switch
            checked={!!value}
            onCheckedChange={onChange}
          />
        );
      default:
        return null;
    }
  };

  const renderItemCard = (item: CollectionItem) => {
    const titleField = activeCollectionData?.fields.find(f => f.name === 'title' || f.name === 'name');
    const imageField = activeCollectionData?.fields.find(f => f.type === 'image');
    const title = titleField ? item.data[titleField.name] : 'Untitled';
    const image = imageField ? item.data[imageField.name] : null;

    if (viewMode === 'grid') {
      return (
        <Card key={item.id} className="overflow-hidden">
          {image && (
            <div className="aspect-video bg-muted">
              <img src={image} alt={title} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-medium truncate">{title}</h4>
              <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
                {item.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-3">
              Updated {new Date(item.updatedAt).toLocaleDateString()}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => onDeleteItem(item.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    } else {
      return (
        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="flex items-center gap-3">
            {image && (
              <img src={image} alt={title} className="w-12 h-12 rounded object-cover" />
            )}
            <div>
              <h4 className="font-medium">{title}</h4>
              <p className="text-sm text-muted-foreground">
                Updated {new Date(item.updatedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={item.status === 'published' ? 'default' : 'secondary'}>
              {item.status}
            </Badge>
            <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onDeleteItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5" />
            Content Collections
          </h3>
          <p className="text-sm text-muted-foreground">
            Manage your site's dynamic content
          </p>
        </div>
        <Button onClick={() => setShowCreateCollection(true)}>
          <Plus className="h-4 w-4 mr-1" />
          New Collection
        </Button>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Collections Sidebar */}
        <div className="col-span-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Collections</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {collections.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Database className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No collections yet</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {collections.map(collection => (
                    <div
                      key={collection.id}
                      className={`p-3 cursor-pointer transition-colors ${
                        activeCollection === collection.id
                          ? 'bg-primary/10 border-r-2 border-primary'
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setActiveCollection(collection.id)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{collection.icon}</span>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{collection.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {items.filter(i => i.collectionId === collection.id).length} items
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="col-span-9">
          {!activeCollectionData ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Collection Selected</h3>
                <p className="text-muted-foreground mb-4">
                  Create a collection to start managing your content
                </p>
                <Button onClick={() => setShowCreateCollection(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Create Collection
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Collection Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{activeCollectionData.icon}</span>
                      <div>
                        <CardTitle>{activeCollectionData.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                          {activeCollectionData.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onExportData(activeCollection!)}>
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-1" />
                        Settings
                      </Button>
                      <Button onClick={() => setShowCreateItem(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Filters and Controls */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 flex-1">
                      <Search className="h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm"
                      />
                      <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                          <SelectItem value="draft">Draft</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select value={sortField} onValueChange={setSortField}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="updatedAt">Updated</SelectItem>
                          <SelectItem value="createdAt">Created</SelectItem>
                          {activeCollectionData.fields.map(field => (
                            <SelectItem key={field.id} value={field.name}>
                              {field.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                      >
                        {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Items Grid/List */}
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-3'}>
                {collectionItems.length === 0 ? (
                  <Card className="col-span-full">
                    <CardContent className="p-8 text-center">
                      <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <h3 className="text-lg font-medium mb-2">No items yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Create your first item to get started
                      </p>
                      <Button onClick={() => setShowCreateItem(true)}>
                        <Plus className="h-4 w-4 mr-1" />
                        Add Item
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  collectionItems.map(renderItemCard)
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Create Collection Dialog */}
      <Dialog open={showCreateCollection} onOpenChange={setShowCreateCollection}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Collection</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Choose a Template</h3>
              <div className="grid grid-cols-2 gap-4">
                {COLLECTION_TEMPLATES.map(template => (
                  <Card
                    key={template.slug}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => createCollectionFromTemplate(template)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">{template.icon}</span>
                        <div>
                          <h4 className="font-medium">{template.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {template.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {template.fields.length} fields
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="text-center">
              <Button variant="outline">
                Create Custom Collection
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create/Edit Item Dialog */}
      <Dialog 
        open={showCreateItem || !!editingItem} 
        onOpenChange={() => {
          setShowCreateItem(false);
          setEditingItem(null);
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingItem ? 'Edit Item' : 'Create New Item'}
            </DialogTitle>
          </DialogHeader>
          {activeCollectionData && (
            <ItemForm
              collection={activeCollectionData}
              item={editingItem}
              onSave={(data, status) => {
                if (editingItem) {
                  onUpdateItem(editingItem.id, { data, status, updatedAt: new Date().toISOString() });
                  setEditingItem(null);
                } else {
                  onCreateItem(activeCollection!, {
                    collectionId: activeCollection!,
                    data,
                    status,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                  });
                  setShowCreateItem(false);
                }
              }}
              onCancel={() => {
                setShowCreateItem(false);
                setEditingItem(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Separate component for the item form
function ItemForm({ 
  collection, 
  item, 
  onSave, 
  onCancel 
}: {
  collection: CollectionSchema;
  item: CollectionItem | null;
  onSave: (data: Record<string, any>, status: 'draft' | 'published') => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Record<string, any>>(
    item?.data || collection.fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue || '';
      return acc;
    }, {} as Record<string, any>)
  );
  const [status, setStatus] = useState<'draft' | 'published'>(item?.status || 'draft');

  const updateField = (fieldName: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const handleSave = () => {
    onSave(formData, status);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {collection.fields.map(field => (
          <div key={field.id}>
            <label className="block text-sm font-medium mb-2">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {/* Render field input using the existing renderFieldInput function */}
            <Input
              value={formData[field.name] || ''}
              onChange={(e) => updateField(field.name, e.target.value)}
              placeholder={`Enter ${field.label.toLowerCase()}`}
            />
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium">Status:</label>
          <Select value={status} onValueChange={(value: 'draft' | 'published') => setStatus(value)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {item ? 'Update' : 'Create'}
          </Button>
        </div>
      </div>
    </div>
  );
}