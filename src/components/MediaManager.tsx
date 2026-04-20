import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Upload, 
  Image as ImageIcon, 
  Video, 
  File,
  Trash2,
  Download,
  Copy,
  Search,
  Grid3X3,
  List,
  FolderPlus,
  MoreVertical,
  X,
  Check,
  Eye,
  Edit,
  Star,
  Clock,
  Filter
} from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface MediaFile {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document';
  url: string;
  thumbnail?: string;
  size: number;
  uploadedAt: string;
  tags: string[];
  folder?: string;
}

interface MediaManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectMedia?: (media: MediaFile) => void;
  allowMultiple?: boolean;
  acceptedTypes?: ('image' | 'video' | 'document')[];
}

export function MediaManager({ 
  isOpen, 
  onClose, 
  onSelectMedia, 
  allowMultiple = false,
  acceptedTypes = ['image', 'video', 'document']
}: MediaManagerProps) {
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      name: 'hero-background.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=300&h=200&fit=crop',
      size: 245760,
      uploadedAt: '2024-01-15T10:30:00Z',
      tags: ['business', 'professional'],
      folder: 'images'
    },
    {
      id: '2',
      name: 'team-photo.jpg',
      type: 'image',
      url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=300&h=200&fit=crop',
      size: 189440,
      uploadedAt: '2024-01-14T15:45:00Z',
      tags: ['team', 'people'],
      folder: 'images'
    },
    {
      id: '3',
      name: 'product-demo.mp4',
      type: 'video',
      url: 'https://example.com/demo.mp4',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop',
      size: 15728640,
      uploadedAt: '2024-01-13T09:20:00Z',
      tags: ['demo', 'product'],
      folder: 'videos'
    }
  ]);

  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: number }>({});
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const folders = [
    { id: 'all', name: 'All Files', count: mediaFiles.length },
    { id: 'images', name: 'Images', count: mediaFiles.filter(f => f.type === 'image').length },
    { id: 'videos', name: 'Videos', count: mediaFiles.filter(f => f.type === 'video').length },
    { id: 'documents', name: 'Documents', count: mediaFiles.filter(f => f.type === 'document').length }
  ];

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesFolder = currentFolder === 'all' || file.folder === currentFolder;
    const matchesType = acceptedTypes.includes(file.type);
    
    return matchesSearch && matchesFolder && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleFileSelect = (fileId: string) => {
    if (allowMultiple) {
      setSelectedFiles(prev => {
        const newSelected = new Set(prev);
        if (newSelected.has(fileId)) {
          newSelected.delete(fileId);
        } else {
          newSelected.add(fileId);
        }
        return newSelected;
      });
    } else {
      setSelectedFiles(new Set([fileId]));
    }
  };

  const handleSelectMedia = () => {
    if (onSelectMedia && selectedFiles.size > 0) {
      const selectedFile = mediaFiles.find(f => selectedFiles.has(f.id));
      if (selectedFile) {
        onSelectMedia(selectedFile);
        onClose();
      }
    }
  };

  const handleUpload = useCallback(async (files: FileList) => {
    setIsUploading(true);
    
    Array.from(files).forEach(async (file, index) => {
      const fileId = `upload-${Date.now()}-${index}`;
      
      // Simulate upload progress
      for (let progress = 0; progress <= 100; progress += 10) {
        setUploadProgress(prev => ({ ...prev, [fileId]: progress }));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // Simulate file upload completion
      const newFile: MediaFile = {
        id: fileId,
        name: file.name,
        type: file.type.startsWith('image/') ? 'image' : 
              file.type.startsWith('video/') ? 'video' : 'document',
        url: URL.createObjectURL(file),
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        size: file.size,
        uploadedAt: new Date().toISOString(),
        tags: [],
        folder: file.type.startsWith('image/') ? 'images' : 
               file.type.startsWith('video/') ? 'videos' : 'documents'
      };
      
      setMediaFiles(prev => [newFile, ...prev]);
      setUploadProgress(prev => {
        const newProgress = { ...prev };
        delete newProgress[fileId];
        return newProgress;
      });
    });
    
    setIsUploading(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleUpload(files);
    }
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="h-6 w-6" />;
      case 'video':
        return <Video className="h-6 w-6" />;
      default:
        return <File className="h-6 w-6" />;
    }
  };

  const renderFileCard = (file: MediaFile) => {
    const isSelected = selectedFiles.has(file.id);
    
    if (viewMode === 'list') {
      return (
        <div 
          key={file.id}
          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
            isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => handleFileSelect(file.id)}
        >
          <div className="flex-shrink-0 mr-4">
            {file.type === 'image' ? (
              <ImageWithFallback
                src={file.thumbnail || file.url}
                alt={file.name}
                className="w-12 h-12 object-cover rounded"
              />
            ) : (
              <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium truncate">{file.name}</h4>
            <p className="text-sm text-gray-500">
              {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
            </p>
            {file.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1">
                {file.tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
            {isSelected && <Check className="h-5 w-5 text-blue-500" />}
          </div>
        </div>
      );
    }

    return (
      <Card 
        key={file.id}
        className={`cursor-pointer transition-all duration-200 ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : 'hover:shadow-md'
        }`}
        onClick={() => handleFileSelect(file.id)}
      >
        <CardContent className="p-3">
          <div className="relative mb-3">
            {file.type === 'image' ? (
              <ImageWithFallback
                src={file.thumbnail || file.url}
                alt={file.name}
                className="w-full h-32 object-cover rounded"
              />
            ) : (
              <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                {getFileIcon(file.type)}
              </div>
            )}
            
            {isSelected && (
              <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            
            <div className="absolute bottom-2 left-2">
              <Badge variant="secondary" className="text-xs">
                {file.type}
              </Badge>
            </div>
          </div>
          
          <h4 className="font-medium text-sm truncate mb-1">{file.name}</h4>
          <p className="text-xs text-gray-500">
            {formatFileSize(file.size)}
          </p>
          
          {file.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {file.tags.slice(0, 2).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {file.tags.length > 2 && (
                <Badge variant="outline" className="text-xs">
                  +{file.tags.length - 2}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const searchUnsplashImages = async (query: string) => {
    try {
      // This would integrate with Unsplash API
      // For now, use a placeholder image
      const imageUrl = `https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80&auto=format&fit=crop`;
      
      const newFile: MediaFile = {
        id: `unsplash-${Date.now()}`,
        name: `${query.replace(/\s+/g, '-')}.jpg`,
        type: 'image',
        url: imageUrl,
        thumbnail: imageUrl,
        size: 0, // Unknown for external images
        uploadedAt: new Date().toISOString(),
        tags: query.split(' '),
        folder: 'images'
      };
      
      setMediaFiles(prev => [newFile, ...prev]);
    } catch (error) {
      // Handle Unsplash image fetch error silently
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ImageIcon className="h-5 w-5" />
            <span>Media Manager</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 border-r pr-4 flex flex-col">
            {/* Upload Area */}
            <div
              ref={dropZoneRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4 hover:border-blue-400 transition-colors cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-2">
                Drag files here or click to upload
              </p>
              <p className="text-xs text-gray-400">
                PNG, JPG, MP4 up to 10MB
              </p>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx"
              onChange={(e) => e.target.files && handleUpload(e.target.files)}
              className="hidden"
            />

            {/* Upload Progress */}
            {Object.keys(uploadProgress).length > 0 && (
              <div className="mb-4 space-y-2">
                {Object.entries(uploadProgress).map(([fileId, progress]) => (
                  <div key={fileId}>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Uploading...</span>
                      <span>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                ))}
              </div>
            )}

            {/* Folders */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Folders</h3>
              {folders.map(folder => (
                <Button
                  key={folder.id}
                  variant={currentFolder === folder.id ? 'default' : 'ghost'}
                  className="w-full justify-between text-sm"
                  onClick={() => setCurrentFolder(folder.id)}
                >
                  <span>{folder.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {folder.count}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-4 space-y-2">
              <h3 className="font-medium text-sm">Quick Actions</h3>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-sm"
                onClick={() => searchUnsplashImages('business')}
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Add from Unsplash
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 pl-4 flex flex-col">
            {/* Search and Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center border rounded-lg p-1">
                  <Button
                    variant={viewMode === 'grid' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'list' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Files Grid/List */}
            <div className="flex-1 overflow-auto">
              {filteredFiles.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="font-medium mb-2">No files found</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Upload some files or adjust your search filters
                    </p>
                    <Button onClick={() => fileInputRef.current?.click()}>
                      Upload Files
                    </Button>
                  </div>
                </div>
              ) : (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4' 
                    : 'space-y-2'
                }`}>
                  {filteredFiles.map(renderFileCard)}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="border-t pt-4 mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                {selectedFiles.size > 0 && `${selectedFiles.size} file(s) selected`}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                {onSelectMedia && (
                  <Button 
                    onClick={handleSelectMedia}
                    disabled={selectedFiles.size === 0}
                  >
                    {allowMultiple && selectedFiles.size > 1 
                      ? `Select ${selectedFiles.size} Files` 
                      : 'Select File'
                    }
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}