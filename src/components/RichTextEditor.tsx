import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { 
  Bold, 
  Italic, 
  Underline, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  Link,
  Type,
  Palette
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({ value, onChange, placeholder, className }: RichTextEditorProps) {
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleTextColor = (color: string) => {
    formatText('foreColor', color);
  };

  const handleFontSize = (size: string) => {
    formatText('fontSize', size);
  };

  const insertLink = () => {
    if (linkUrl && linkText) {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        let range: Range | null = null;
        try {
          range = selection.getRangeAt(0);
        } catch (e) {
          console.warn('[RichTextEditor] Failed to get selection range', e);
        }
        if (range) {
          range.deleteContents();
          const link = document.createElement('a');
          link.href = linkUrl;
          link.textContent = linkText;
          link.className = 'text-blue-600 underline';
          range.insertNode(link);
        }
      } else {
        console.warn('[RichTextEditor] No selection range available for link insertion');
      }
      setIsLinkDialogOpen(false);
      setLinkUrl('');
      setLinkText('');
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }
  };

  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b p-2 flex items-center gap-1 flex-wrap">
        {/* Font Size */}
        <Select onValueChange={handleFontSize}>
          <SelectTrigger className="w-20 h-8 text-xs">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Small</SelectItem>
            <SelectItem value="3">Medium</SelectItem>
            <SelectItem value="5">Large</SelectItem>
            <SelectItem value="7">Extra Large</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Formatting */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('bold')}
          className="h-8 w-8 p-0"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('italic')}
          className="h-8 w-8 p-0"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('underline')}
          className="h-8 w-8 p-0"
        >
          <Underline className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Text Color */}
        <div className="flex items-center gap-1">
          <Type className="h-4 w-4 text-gray-500" />
          <input
            type="color"
            onChange={(e) => handleTextColor(e.target.value)}
            className="w-6 h-6 rounded border cursor-pointer"
            title="Text Color"
          />
        </div>

        <Separator orientation="vertical" className="h-6" />

        {/* Alignment */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyLeft')}
          className="h-8 w-8 p-0"
        >
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyCenter')}
          className="h-8 w-8 p-0"
        >
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('justifyRight')}
          className="h-8 w-8 p-0"
        >
          <AlignRight className="h-4 w-4" />
        </Button>

        <Separator orientation="vertical" className="h-6" />

        {/* Lists */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => formatText('insertUnorderedList')}
          className="h-8 w-8 p-0"
        >
          <List className="h-4 w-4" />
        </Button>

        {/* Link */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsLinkDialogOpen(true)}
          className="h-8 w-8 p-0"
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="p-4 min-h-[120px] focus:outline-none"
        onInput={(e) => onChange((e.target as HTMLDivElement).innerHTML)}
        dangerouslySetInnerHTML={{ __html: value }}
        style={{ whiteSpace: 'pre-wrap' }}
      />

      {/* Link Dialog */}
      {isLinkDialogOpen && (
        <div className="border-t bg-gray-50 p-3 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-12">Text:</span>
            <Input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              className="flex-1 h-8"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium w-12">URL:</span>
            <Input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 h-8"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsLinkDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={insertLink}
              disabled={!linkUrl || !linkText}
            >
              Insert Link
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}