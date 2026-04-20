import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Slider } from './ui/slider';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Palette, 
  Type, 
  Layout, 
  RotateCcw,
  Eye,
  Copy,
  Download,
  Upload,
  Wand2,
  Sun,
  Moon
} from 'lucide-react';

interface GlobalStyles {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
  fonts: {
    heading: string;
    body: string;
    mono: string;
  };
  spacing: {
    scale: number; // 0.5 to 2.0
    containerWidth: string;
    sectionPadding: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
  theme: 'light' | 'dark' | 'auto';
  animations: {
    duration: 'slow' | 'normal' | 'fast';
    easing: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';
  };
}

interface GlobalStylePanelProps {
  styles: GlobalStyles;
  onUpdateStyles: (styles: Partial<GlobalStyles>) => void;
  onPreviewTheme: (theme: 'light' | 'dark') => void;
  onExportTheme: () => void;
  onImportTheme: (theme: GlobalStyles) => void;
}

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter (Modern Sans)' },
  { value: 'Roboto', label: 'Roboto (Clean Sans)' },
  { value: 'Poppins', label: 'Poppins (Rounded Sans)' },
  { value: 'Open Sans', label: 'Open Sans (Friendly Sans)' },
  { value: 'Playfair Display', label: 'Playfair Display (Elegant Serif)' },
  { value: 'Merriweather', label: 'Merriweather (Readable Serif)' },
  { value: 'Lora', label: 'Lora (Modern Serif)' },
  { value: 'Source Sans Pro', label: 'Source Sans Pro (Professional)' },
  { value: 'Montserrat', label: 'Montserrat (Geometric Sans)' },
  { value: 'Nunito', label: 'Nunito (Soft Sans)' }
];

const COLOR_PALETTES = [
  {
    name: 'Modern Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#8b5cf6',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    name: 'Elegant Purple',
    colors: {
      primary: '#8b5cf6',
      secondary: '#3b82f6',
      accent: '#ec4899',
      background: '#ffffff',
      surface: '#faf8ff',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    name: 'Warm Orange',
    colors: {
      primary: '#ea580c',
      secondary: '#dc2626',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#fffaf0',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    name: 'Nature Green',
    colors: {
      primary: '#059669',
      secondary: '#0891b2',
      accent: '#f59e0b',
      background: '#ffffff',
      surface: '#f0fdf4',
      text: '#1f2937',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    }
  },
  {
    name: 'Dark Theme',
    colors: {
      primary: '#60a5fa',
      secondary: '#a78bfa',
      accent: '#fbbf24',
      background: '#111827',
      surface: '#1f2937',
      text: '#f9fafb',
      textSecondary: '#d1d5db',
      border: '#374151',
      success: '#34d399',
      warning: '#fbbf24',
      error: '#f87171'
    }
  }
];

export function GlobalStylePanel({ 
  styles, 
  onUpdateStyles, 
  onPreviewTheme, 
  onExportTheme, 
  onImportTheme 
}: GlobalStylePanelProps) {
  const [activeColorPicker, setActiveColorPicker] = useState<string | null>(null);

  const updateColor = (colorKey: string, value: string) => {
    onUpdateStyles({
      colors: {
        ...styles.colors,
        [colorKey]: value
      }
    });
  };

  const applyColorPalette = (palette: typeof COLOR_PALETTES[0]) => {
    onUpdateStyles({
      colors: palette.colors
    });
  };

  const updateFont = (fontType: 'heading' | 'body' | 'mono', value: string) => {
    onUpdateStyles({
      fonts: {
        ...styles.fonts,
        [fontType]: value
      }
    });
  };

  const updateSpacing = (key: string, value: string | number) => {
    onUpdateStyles({
      spacing: {
        ...styles.spacing,
        [key]: value
      }
    });
  };

  const updateBorderRadius = (key: string, value: string) => {
    onUpdateStyles({
      borderRadius: {
        ...styles.borderRadius,
        [key]: value
      }
    });
  };

  const resetStyles = () => {
    const defaultStyles: GlobalStyles = {
      colors: COLOR_PALETTES[0].colors,
      fonts: {
        heading: 'Inter',
        body: 'Inter',
        mono: 'Monaco'
      },
      spacing: {
        scale: 1,
        containerWidth: '1200px',
        sectionPadding: '4rem'
      },
      borderRadius: {
        sm: '0.25rem',
        md: '0.5rem',
        lg: '0.75rem',
        xl: '1rem'
      },
      shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
      },
      theme: 'light',
      animations: {
        duration: 'normal',
        easing: 'ease-in-out'
      }
    };
    onUpdateStyles(defaultStyles);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Global Styles</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExportTheme}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={resetStyles}>
            <RotateCcw className="h-4 w-4 mr-1" />
            Reset
          </Button>
        </div>
      </div>

      <Tabs defaultValue="colors" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="colors" className="flex items-center gap-1">
            <Palette className="h-4 w-4" />
            Colors
          </TabsTrigger>
          <TabsTrigger value="typography" className="flex items-center gap-1">
            <Type className="h-4 w-4" />
            Typography
          </TabsTrigger>
          <TabsTrigger value="spacing" className="flex items-center gap-1">
            <Layout className="h-4 w-4" />
            Layout
          </TabsTrigger>
          <TabsTrigger value="theme" className="flex items-center gap-1">
            <Sun className="h-4 w-4" />
            Theme
          </TabsTrigger>
        </TabsList>

        <TabsContent value="colors" className="space-y-6">
          {/* Color Palettes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Quick Palettes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                {COLOR_PALETTES.map((palette, index) => (
                  <div 
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => applyColorPalette(palette)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: palette.colors.primary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: palette.colors.secondary }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: palette.colors.accent }}
                        />
                      </div>
                      <span className="font-medium">{palette.name}</span>
                    </div>
                    <Button variant="ghost" size="sm">
                      Apply
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Individual Colors */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Colors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(styles.colors).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <label className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={value}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                      />
                      <Input 
                        value={value}
                        onChange={(e) => updateColor(key, e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="typography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Font Families</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Heading Font</label>
                <Select value={styles.fonts.heading} onValueChange={(value) => updateFont('heading', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Body Font</label>
                <Select value={styles.fonts.body} onValueChange={(value) => updateFont('body', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_OPTIONS.map((font) => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Monospace Font</label>
                <Select value={styles.fonts.mono} onValueChange={(value) => updateFont('mono', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Monaco">Monaco</SelectItem>
                    <SelectItem value="Consolas">Consolas</SelectItem>
                    <SelectItem value="Source Code Pro">Source Code Pro</SelectItem>
                    <SelectItem value="Fira Code">Fira Code</SelectItem>
                    <SelectItem value="JetBrains Mono">JetBrains Mono</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Typography Preview */}
          <Card>
            <CardHeader>
              <CardTitle>Typography Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4" style={{ 
                fontFamily: styles.fonts.body,
                color: styles.colors.text 
              }}>
                <h1 style={{ fontFamily: styles.fonts.heading }}>
                  Heading 1 - {styles.fonts.heading}
                </h1>
                <h2 style={{ fontFamily: styles.fonts.heading }}>
                  Heading 2 - {styles.fonts.heading}
                </h2>
                <p>
                  Body text - {styles.fonts.body}. This is how your regular content will look.
                </p>
                <code 
                  className="p-2 bg-muted rounded"
                  style={{ fontFamily: styles.fonts.mono }}
                >
                  Code text - {styles.fonts.mono}
                </code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="spacing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Layout Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Spacing Scale: {styles.spacing.scale}x
                </label>
                <Slider
                  value={[styles.spacing.scale]}
                  onValueChange={([value]) => updateSpacing('scale', value)}
                  min={0.5}
                  max={2}
                  step={0.1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>Compact</span>
                  <span>Normal</span>
                  <span>Spacious</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Container Max Width</label>
                <Select 
                  value={styles.spacing.containerWidth} 
                  onValueChange={(value) => updateSpacing('containerWidth', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1024px">Small (1024px)</SelectItem>
                    <SelectItem value="1200px">Medium (1200px)</SelectItem>
                    <SelectItem value="1400px">Large (1400px)</SelectItem>
                    <SelectItem value="100%">Full Width</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Section Padding</label>
                <Select 
                  value={styles.spacing.sectionPadding} 
                  onValueChange={(value) => updateSpacing('sectionPadding', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2rem">Compact (2rem)</SelectItem>
                    <SelectItem value="4rem">Normal (4rem)</SelectItem>
                    <SelectItem value="6rem">Spacious (6rem)</SelectItem>
                    <SelectItem value="8rem">Extra Spacious (8rem)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Border Radius</label>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(styles.borderRadius).map(([key, value]) => (
                    <div key={key}>
                      <label className="text-xs text-muted-foreground capitalize">{key}</label>
                      <Input
                        value={value}
                        onChange={(e) => updateBorderRadius(key, e.target.value)}
                        placeholder="e.g., 0.5rem"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Theme Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-3">Theme Mode</label>
                <div className="flex gap-2">
                  <Button
                    variant={styles.theme === 'light' ? 'default' : 'outline'}
                    onClick={() => onUpdateStyles({ theme: 'light' })}
                    className="flex-1"
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={styles.theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => onUpdateStyles({ theme: 'dark' })}
                    className="flex-1"
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                  <Button
                    variant={styles.theme === 'auto' ? 'default' : 'outline'}
                    onClick={() => onUpdateStyles({ theme: 'auto' })}
                    className="flex-1"
                  >
                    Auto
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-3">Animation Settings</label>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Animation Speed</label>
                    <Select 
                      value={styles.animations.duration} 
                      onValueChange={(value: 'slow' | 'normal' | 'fast') => 
                        onUpdateStyles({ 
                          animations: { ...styles.animations, duration: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="slow">Slow (600ms)</SelectItem>
                        <SelectItem value="normal">Normal (300ms)</SelectItem>
                        <SelectItem value="fast">Fast (150ms)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">Animation Easing</label>
                    <Select 
                      value={styles.animations.easing} 
                      onValueChange={(value: any) => 
                        onUpdateStyles({ 
                          animations: { ...styles.animations, easing: value } 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="linear">Linear</SelectItem>
                        <SelectItem value="ease">Ease</SelectItem>
                        <SelectItem value="ease-in">Ease In</SelectItem>
                        <SelectItem value="ease-out">Ease Out</SelectItem>
                        <SelectItem value="ease-in-out">Ease In Out</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <label className="block text-sm font-medium mb-3">Theme Preview</label>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => onPreviewTheme('light')}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Light
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => onPreviewTheme('dark')}
                    className="flex-1"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Preview Dark
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}