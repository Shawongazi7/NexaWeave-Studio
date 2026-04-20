import React, { useState, useRef, useCallback } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { 
  GripVertical, 
  Plus, 
  Copy, 
  Trash2,
  Move,
  Lock,
  Unlock,
  ChevronDown,
  ChevronUp,
  Layers,
  Type,
  Image as ImageIcon,
  Star,
  Users,
  MapPin,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'motion/react';
import { toast } from 'sonner';

interface Section {
  id: string;
  type: string;
  content: any;
  locked?: boolean;
  visibility?: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
}

interface DragDropSystemProps {
  sections: Section[];
  onReorderSections: (sections: Section[]) => void;
  onAddSection: (type: string, afterIndex?: number) => void;
  onDuplicateSection: (sectionId: string) => void;
  onDeleteSection: (sectionId: string) => void;
  onToggleLock: (sectionId: string) => void;
  selectedSectionId?: string | null;
  onSelectSection: (sectionId: string | null) => void;
}

interface DragState {
  isDragging: boolean;
  draggedId: string | null;
  dropZoneId: string | null;
  insertPosition: 'before' | 'after' | null;
}

const SECTION_LIBRARY = [
  { type: 'hero', name: 'Hero Section', icon: Type, description: 'Eye-catching banner section' },
  { type: 'about', name: 'About', icon: FileText, description: 'Tell your story' },
  { type: 'services', name: 'Services', icon: Star, description: 'Showcase what you offer' },
  { type: 'team', name: 'Team', icon: Users, description: 'Meet the team' },
  { type: 'contact', name: 'Contact', icon: MapPin, description: 'Get in touch section' },
  { type: 'gallery', name: 'Gallery', icon: ImageIcon, description: 'Image showcase' },
  { type: 'features', name: 'Features', icon: Star, description: 'Highlight key features' },
];

export function DragDropSystem({
  sections,
  onReorderSections,
  onAddSection,
  onDuplicateSection,
  onDeleteSection,
  onToggleLock,
  selectedSectionId,
  onSelectSection
}: DragDropSystemProps) {
  const [dragState, setDragState] = useState<DragState>({
    isDragging: false,
    draggedId: null,
    dropZoneId: null,
    insertPosition: null
  });
  const [showSectionLibrary, setShowSectionLibrary] = useState(false);
  const [insertPosition, setInsertPosition] = useState<{ afterIndex: number } | null>(null);

  const handleDragStart = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (section?.locked) {
      toast.error('Cannot move locked section');
      return;
    }
    
    setDragState({
      isDragging: true,
      draggedId: sectionId,
      dropZoneId: null,
      insertPosition: null
    });
  };

  const handleDragEnd = () => {
    setDragState({
      isDragging: false,
      draggedId: null,
      dropZoneId: null,
      insertPosition: null
    });
  };

  const getSectionIcon = (type: string) => {
    const sectionType = SECTION_LIBRARY.find(s => s.type === type);
    return sectionType?.icon || FileText;
  };

  const getSectionName = (type: string) => {
    const sectionType = SECTION_LIBRARY.find(s => s.type === type);
    return sectionType?.name || type.charAt(0).toUpperCase() + type.slice(1);
  };

  const renderDropZone = (index: number) => {
    const isActive = dragState.isDragging && dragState.dropZoneId === `zone-${index}`;
    
    return (
      <motion.div
        key={`dropzone-${index}`}
        className={`h-2 mx-4 rounded-full transition-all duration-200 ${
          isActive ? 'bg-primary h-8 flex items-center justify-center' : 'bg-transparent hover:bg-muted'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragState(prev => ({ ...prev, dropZoneId: `zone-${index}` }));
        }}
        onDragLeave={() => {
          setDragState(prev => ({ ...prev, dropZoneId: null }));
        }}
        onDrop={(e) => {
          e.preventDefault();
          const draggedIndex = sections.findIndex(s => s.id === dragState.draggedId);
          if (draggedIndex === -1) return;
          
          const newSections = [...sections];
          const [draggedSection] = newSections.splice(draggedIndex, 1);
          
          const insertIndex = index > draggedIndex ? index - 1 : index;
          newSections.splice(insertIndex, 0, draggedSection);
          
          onReorderSections(newSections);
          handleDragEnd();
          toast.success('Section moved successfully');
        }}
      >
        <AnimatePresence>
          {isActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-primary-foreground text-sm font-medium bg-primary px-3 py-1 rounded-full"
            >
              Drop here
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const renderSectionItem = (section: Section, index: number) => {
    const Icon = getSectionIcon(section.type);
    const isDragged = dragState.draggedId === section.id;
    const isSelected = selectedSectionId === section.id;
    
    return (
      <motion.div
        key={section.id}
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isDragged ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className={`group relative border rounded-lg transition-all duration-200 ${
          isSelected ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
        } ${isDragged ? 'shadow-lg scale-105' : 'hover:shadow-md'}`}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <button
              className={`cursor-move p-1 rounded hover:bg-muted transition-colors ${
                section.locked ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              draggable={!section.locked}
              onDragStart={() => handleDragStart(section.id)}
              onDragEnd={handleDragEnd}
              disabled={section.locked}
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            {/* Section Info */}
            <div 
              className="flex-1 flex items-center gap-2 cursor-pointer"
              onClick={() => onSelectSection(isSelected ? null : section.id)}
            >
              <Icon className="h-4 w-4 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">
                  {getSectionName(section.type)}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {section.content.title || 'No title set'}
                </p>
              </div>
            </div>

            {/* Visibility Badges */}
            <div className="flex gap-1">
              <Badge 
                variant={section.visibility?.desktop !== false ? 'default' : 'secondary'}
                className="text-xs px-1"
              >
                D
              </Badge>
              <Badge 
                variant={section.visibility?.tablet !== false ? 'default' : 'secondary'}
                className="text-xs px-1"
              >
                T
              </Badge>
              <Badge 
                variant={section.visibility?.mobile !== false ? 'default' : 'secondary'}
                className="text-xs px-1"
              >
                M
              </Badge>
            </div>

            {/* Lock Status */}
            {section.locked && (
              <Lock className="h-4 w-4 text-muted-foreground" />
            )}

            {/* Action Buttons */}
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onDuplicateSection(section.id)}
                title="Duplicate section"
              >
                <Copy className="h-3 w-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0"
                onClick={() => onToggleLock(section.id)}
                title={section.locked ? 'Unlock section' : 'Lock section'}
              >
                {section.locked ? <Unlock className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                onClick={() => onDeleteSection(section.id)}
                title="Delete section"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Move Buttons */}
          <div className="flex justify-between items-center mt-2 pt-2 border-t opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  const newIndex = Math.max(0, index - 1);
                  const newSections = [...sections];
                  const [movedSection] = newSections.splice(index, 1);
                  newSections.splice(newIndex, 0, movedSection);
                  onReorderSections(newSections);
                }}
                disabled={index === 0 || section.locked}
              >
                <ChevronUp className="h-3 w-3 mr-1" />
                Up
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                className="h-6 text-xs"
                onClick={() => {
                  const newIndex = Math.min(sections.length - 1, index + 1);
                  const newSections = [...sections];
                  const [movedSection] = newSections.splice(index, 1);
                  newSections.splice(newIndex, 0, movedSection);
                  onReorderSections(newSections);
                }}
                disabled={index === sections.length - 1 || section.locked}
              >
                <ChevronDown className="h-3 w-3 mr-1" />
                Down
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              onClick={() => {
                setInsertPosition({ afterIndex: index });
                setShowSectionLibrary(true);
              }}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Below
            </Button>
          </div>
        </div>

        {/* Quick Add Zone */}
        <motion.div
          className="absolute -bottom-1 left-4 right-4 h-2 bg-transparent hover:bg-primary/20 rounded-full cursor-pointer flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => {
            setInsertPosition({ afterIndex: index });
            setShowSectionLibrary(true);
          }}
          whileHover={{ scale: 1.05 }}
        >
          <Plus className="h-3 w-3 text-primary opacity-0 group-hover:opacity-100" />
        </motion.div>
      </motion.div>
    );
  };

  const renderSectionLibrary = () => (
    <AnimatePresence>
      {showSectionLibrary && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
          onClick={() => setShowSectionLibrary(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Layers className="h-5 w-5" />
                Add Section
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowSectionLibrary(false)}
              >
                ✕
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {SECTION_LIBRARY.map((sectionType) => {
                const Icon = sectionType.icon;
                return (
                  <motion.div
                    key={sectionType.type}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-4 border rounded-lg cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                    onClick={() => {
                      onAddSection(sectionType.type, insertPosition?.afterIndex);
                      setShowSectionLibrary(false);
                      setInsertPosition(null);
                      toast.success(`${sectionType.name} added successfully`);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-medium">{sectionType.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {sectionType.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium flex items-center gap-2">
          <Move className="h-4 w-4" />
          Page Sections ({sections.length})
        </h3>
        <Button
          size="sm"
          onClick={() => {
            setInsertPosition({ afterIndex: sections.length - 1 });
            setShowSectionLibrary(true);
          }}
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Section
        </Button>
      </div>

      {sections.length === 0 ? (
        <Card className="p-8 text-center">
          <Layers className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h4 className="font-medium mb-2">No sections yet</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Start building your page by adding sections
          </p>
          <Button
            onClick={() => {
              setInsertPosition({ afterIndex: -1 });
              setShowSectionLibrary(true);
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add First Section
          </Button>
        </Card>
      ) : (
        <div className="space-y-1">
          {renderDropZone(0)}
          {sections.map((section, index) => (
            <React.Fragment key={section.id}>
              {renderSectionItem(section, index)}
              {renderDropZone(index + 1)}
            </React.Fragment>
          ))}
        </div>
      )}

      {renderSectionLibrary()}

      {/* Drag Overlay */}
      <AnimatePresence>
        {dragState.isDragging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-primary/10 pointer-events-none z-40"
          >
            <div className="flex items-center justify-center h-full">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="bg-white border-2 border-primary rounded-lg p-4 shadow-lg"
              >
                <Move className="h-6 w-6 text-primary mx-auto" />
                <p className="text-sm text-center mt-2">Dragging section...</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}