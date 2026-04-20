import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { 
  History, 
  RotateCcw, 
  Redo, 
  Save, 
  Clock, 
  GitBranch, 
  GitCompare,
  FileText,
  User,
  Calendar,
  Tag,
  Archive,
  Download,
  Upload,
  AlertTriangle,
  CheckCircle,
  Eye
} from 'lucide-react';

interface Version {
  id: string;
  timestamp: string;
  content: any;
  description: string;
  author?: string;
  tags?: string[];
  isAutoSave?: boolean;
  changesSummary?: {
    added: number;
    modified: number;
    deleted: number;
  };
}

interface VersionControlProps {
  currentContent: any;
  versions: Version[];
  onSaveVersion: (description: string, tags?: string[]) => void;
  onRestoreVersion: (versionId: string) => void;
  onDeleteVersion: (versionId: string) => void;
  onCompareVersions: (versionId1: string, versionId2: string) => void;
  onExportVersion: (versionId: string) => void;
  onImportVersion: (content: any) => void;
  hasUnsavedChanges: boolean;
  undoStack: any[];
  redoStack: any[];
  onUndo: () => void;
  onRedo: () => void;
  maxVersions?: number;
}

export function VersionControl({
  currentContent,
  versions,
  onSaveVersion,
  onRestoreVersion,
  onDeleteVersion,
  onCompareVersions,
  onExportVersion,
  onImportVersion,
  hasUnsavedChanges,
  undoStack,
  redoStack,
  onUndo,
  onRedo,
  maxVersions = 50
}: VersionControlProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [saveDescription, setSaveDescription] = useState('');
  const [saveTags, setSaveTags] = useState('');
  const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
  const [showVersionDetails, setShowVersionDetails] = useState<string | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  useEffect(() => {
    // Auto-save every 5 minutes if enabled and there are unsaved changes
    if (autoSaveEnabled && hasUnsavedChanges) {
      const interval = setInterval(() => {
        handleAutoSave();
      }, 5 * 60 * 1000); // 5 minutes

      return () => clearInterval(interval);
    }
  }, [autoSaveEnabled, hasUnsavedChanges]);

  const handleAutoSave = () => {
    const timestamp = new Date().toISOString();
    onSaveVersion(`Auto-save ${new Date().toLocaleTimeString()}`, ['auto-save']);
  };

  const handleManualSave = () => {
    if (!saveDescription.trim()) {
      setSaveDescription(`Manual save ${new Date().toLocaleString()}`);
    }
    
    const tags = saveTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    onSaveVersion(saveDescription, tags);
    setSaveDescription('');
    setSaveTags('');
    setShowSaveDialog(false);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getVersionIcon = (version: Version) => {
    if (version.isAutoSave) return <Clock className="h-4 w-4 text-blue-500" />;
    if (version.tags?.includes('milestone')) return <Tag className="h-4 w-4 text-purple-500" />;
    if (version.tags?.includes('release')) return <Archive className="h-4 w-4 text-green-500" />;
    return <FileText className="h-4 w-4 text-gray-500" />;
  };

  const getVersionBadgeColor = (version: Version) => {
    if (version.isAutoSave) return 'secondary';
    if (version.tags?.includes('milestone')) return 'outline';
    if (version.tags?.includes('release')) return 'default';
    return 'secondary';
  };

  const toggleVersionSelection = (versionId: string) => {
    setSelectedVersions(prev => {
      if (prev.includes(versionId)) {
        return prev.filter(id => id !== versionId);
      } else if (prev.length < 2) {
        return [...prev, versionId];
      } else {
        return [versionId];
      }
    });
  };

  const compareSelected = () => {
    if (selectedVersions.length === 2) {
      onCompareVersions(selectedVersions[0], selectedVersions[1]);
    }
  };

  const calculateChangesSummary = (version: Version, previousVersion?: Version) => {
    // This is a simplified calculation - in a real app you'd do proper diff analysis
    if (!previousVersion) {
      return { added: 1, modified: 0, deleted: 0 };
    }

    const currentPages = version.content?.pages || [];
    const previousPages = previousVersion.content?.pages || [];

    return {
      added: Math.max(0, currentPages.length - previousPages.length),
      modified: Math.min(currentPages.length, previousPages.length),
      deleted: Math.max(0, previousPages.length - currentPages.length)
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <History className="h-5 w-5" />
            Version Control
          </h3>
          <p className="text-sm text-muted-foreground">
            {versions.length} versions • {hasUnsavedChanges ? 'Unsaved changes' : 'All changes saved'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onUndo}
            disabled={undoStack.length === 0}
          >
            <RotateCcw className="h-4 w-4 mr-1" />
            Undo
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRedo}
            disabled={redoStack.length === 0}
          >
            <Redo className="h-4 w-4 mr-1" />
            Redo
          </Button>
          <Button
            onClick={() => setShowSaveDialog(true)}
            disabled={!hasUnsavedChanges}
          >
            <Save className="h-4 w-4 mr-1" />
            Save Version
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>You have unsaved changes.</span>
            <div className="flex items-center gap-2 ml-4">
              <span className="text-xs text-muted-foreground">Auto-save:</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
                className={autoSaveEnabled ? 'text-green-600' : 'text-gray-400'}
              >
                {autoSaveEnabled ? 'ON' : 'OFF'}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {selectedVersions.length === 2 && (
        <Alert>
          <GitCompare className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>2 versions selected for comparison</span>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={compareSelected}>
                <GitCompare className="h-4 w-4 mr-1" />
                Compare
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setSelectedVersions([])}>
                Clear
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Version History</span>
            <div className="flex items-center gap-2">
              {versions.length >= maxVersions && (
                <Badge variant="outline" className="text-xs">
                  Limit: {maxVersions}
                </Badge>
              )}
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-1" />
                Export
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {versions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No versions saved yet</p>
              <p className="text-sm">Save your first version to start tracking changes</p>
            </div>
          ) : (
            <div className="space-y-3">
              {versions
                .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                .map((version, index) => {
                  const previousVersion = versions[index + 1];
                  const changes = calculateChangesSummary(version, previousVersion);
                  const isSelected = selectedVersions.includes(version.id);

                  return (
                    <div
                      key={version.id}
                      className={`p-4 border rounded-lg transition-colors ${
                        isSelected ? 'border-primary bg-primary/5' : 'hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            {getVersionIcon(version)}
                            <h4 className="font-medium truncate">{version.description}</h4>
                            {version.isAutoSave && (
                              <Badge variant="secondary" className="text-xs">Auto</Badge>
                            )}
                            {version.tags?.map(tag => (
                              <Badge key={tag} variant={getVersionBadgeColor(version)} className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatTimestamp(version.timestamp)}
                            </span>
                            {version.author && (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {version.author}
                              </span>
                            )}
                            <span className="flex items-center gap-2 text-xs">
                              {changes.added > 0 && (
                                <span className="text-green-600">+{changes.added}</span>
                              )}
                              {changes.modified > 0 && (
                                <span className="text-blue-600">~{changes.modified}</span>
                              )}
                              {changes.deleted > 0 && (
                                <span className="text-red-600">-{changes.deleted}</span>
                              )}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleVersionSelection(version.id)}
                            className={isSelected ? 'bg-primary/10' : ''}
                          >
                            <GitCompare className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowVersionDetails(version.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onExportVersion(version.id)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onRestoreVersion(version.id)}
                          >
                            Restore
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save Version Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save New Version</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Version Description</label>
              <Input
                value={saveDescription}
                onChange={(e) => setSaveDescription(e.target.value)}
                placeholder="Describe what changed in this version"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Tags (optional)</label>
              <Input
                value={saveTags}
                onChange={(e) => setSaveTags(e.target.value)}
                placeholder="milestone, release, feature (comma separated)"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Common tags: milestone, release, feature, bugfix, backup
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
              <Button onClick={handleManualSave}>
                <Save className="h-4 w-4 mr-1" />
                Save Version
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Version Details Dialog */}
      <Dialog 
        open={!!showVersionDetails} 
        onOpenChange={() => setShowVersionDetails(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Version Details</DialogTitle>
          </DialogHeader>
          {showVersionDetails && (
            <div className="space-y-4">
              {(() => {
                const version = versions.find(v => v.id === showVersionDetails);
                if (!version) return null;

                return (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Description</label>
                        <p>{version.description}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Date</label>
                        <p>{new Date(version.timestamp).toLocaleString()}</p>
                      </div>
                      {version.author && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Author</label>
                          <p>{version.author}</p>
                        </div>
                      )}
                      {version.tags && version.tags.length > 0 && (
                        <div>
                          <label className="text-sm font-medium text-muted-foreground">Tags</label>
                          <div className="flex gap-1 mt-1">
                            {version.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <Separator />
                    
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Content Summary</label>
                      <div className="mt-2 p-3 bg-muted rounded text-sm">
                        <p>Pages: {version.content?.pages?.length || 0}</p>
                        <p>Sections: {version.content?.pages?.reduce((total: number, page: any) => 
                          total + (page.sections?.length || 0), 0) || 0}</p>
                        {version.content?.globalStyles && (
                          <p>Global styles configured</p>
                        )}
                        {version.content?.seo && (
                          <p>SEO settings configured</p>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => onExportVersion(version.id)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Export
                      </Button>
                      <Button
                        onClick={() => {
                          onRestoreVersion(version.id);
                          setShowVersionDetails(null);
                        }}
                      >
                        Restore This Version
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}