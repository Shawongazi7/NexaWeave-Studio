import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { 
  Search, 
  Globe, 
  Share2, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  ExternalLink,
  Copy,
  Eye,
  BarChart3,
  Target,
  Users,
  MessageSquare,
  Image as ImageIcon,
  Link,
  Clock
} from 'lucide-react';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  slug: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterCard?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
  noFollow?: boolean;
  structuredData?: any;
  customMeta?: Array<{
    name: string;
    content: string;
  }>;
}

interface Page {
  id: string;
  name: string;
  path: string;
  seo?: SEOData;
}

interface SEOPanelProps {
  pages: Page[];
  currentPageId: string;
  onUpdatePageSEO: (pageId: string, seo: SEOData) => void;
  onGenerateMetaTags: (pageId: string) => void;
  onPreviewSEO: (pageId: string) => void;
  onExportSitemap: () => void;
}

const SEO_BEST_PRACTICES = {
  title: {
    min: 30,
    max: 60,
    optimal: 50
  },
  description: {
    min: 120,
    max: 160,
    optimal: 140
  },
  keywords: {
    min: 3,
    max: 10,
    optimal: 5
  }
};

export function SEOPanel({ 
  pages, 
  currentPageId, 
  onUpdatePageSEO, 
  onGenerateMetaTags, 
  onPreviewSEO,
  onExportSitemap 
}: SEOPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [seoScore, setSeoScore] = useState(0);
  const [seoIssues, setSeoIssues] = useState<string[]>([]);

  const currentPage = pages.find(page => page.id === currentPageId);
  const seoData = currentPage?.seo || {
    title: '',
    description: '',
    keywords: '',
    slug: currentPage?.path || '',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    noIndex: false,
    noFollow: false,
    customMeta: []
  };

  useEffect(() => {
    calculateSEOScore();
  }, [seoData]);

  const updateSEO = (updates: Partial<SEOData>) => {
    const updatedSEO = { ...seoData, ...updates };
    onUpdatePageSEO(currentPageId, updatedSEO);
  };

  const calculateSEOScore = () => {
    let score = 0;
    const issues: string[] = [];

    // Title checks
    if (seoData.title) {
      score += 20;
      if (seoData.title.length >= SEO_BEST_PRACTICES.title.min && 
          seoData.title.length <= SEO_BEST_PRACTICES.title.max) {
        score += 10;
      } else {
        issues.push(`Title should be ${SEO_BEST_PRACTICES.title.min}-${SEO_BEST_PRACTICES.title.max} characters`);
      }
    } else {
      issues.push('Missing page title');
    }

    // Description checks
    if (seoData.description) {
      score += 20;
      if (seoData.description.length >= SEO_BEST_PRACTICES.description.min && 
          seoData.description.length <= SEO_BEST_PRACTICES.description.max) {
        score += 10;
      } else {
        issues.push(`Description should be ${SEO_BEST_PRACTICES.description.min}-${SEO_BEST_PRACTICES.description.max} characters`);
      }
    } else {
      issues.push('Missing meta description');
    }

    // Keywords checks
    if (seoData.keywords) {
      const keywordCount = seoData.keywords.split(',').filter(k => k.trim()).length;
      score += 10;
      if (keywordCount >= SEO_BEST_PRACTICES.keywords.min && 
          keywordCount <= SEO_BEST_PRACTICES.keywords.max) {
        score += 10;
      } else {
        issues.push(`Use ${SEO_BEST_PRACTICES.keywords.min}-${SEO_BEST_PRACTICES.keywords.max} keywords`);
      }
    } else {
      issues.push('Missing keywords');
    }

    // Slug checks
    if (seoData.slug && seoData.slug !== '/') {
      score += 10;
      if (!/\s/.test(seoData.slug) && /^[a-z0-9-/]+$/.test(seoData.slug)) {
        score += 5;
      } else {
        issues.push('URL slug should be lowercase with hyphens');
      }
    }

    // Open Graph checks
    if (seoData.ogTitle || seoData.ogDescription) {
      score += 10;
    }
    if (seoData.ogImage) {
      score += 5;
    }

    setSeoScore(Math.min(score, 100));
    setSeoIssues(issues);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBackground = (score: number) => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const addCustomMeta = () => {
    const newMeta = [...(seoData.customMeta || []), { name: '', content: '' }];
    updateSEO({ customMeta: newMeta });
  };

  const updateCustomMeta = (index: number, field: 'name' | 'content', value: string) => {
    const newMeta = [...(seoData.customMeta || [])];
    newMeta[index] = { ...newMeta[index], [field]: value };
    updateSEO({ customMeta: newMeta });
  };

  const removeCustomMeta = (index: number) => {
    const newMeta = [...(seoData.customMeta || [])];
    newMeta.splice(index, 1);
    updateSEO({ customMeta: newMeta });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">SEO Optimization</h3>
          <p className="text-sm text-muted-foreground">
            Optimize your site for search engines
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onExportSitemap}>
            <FileText className="h-4 w-4 mr-1" />
            Sitemap
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPreviewSEO(currentPageId)}>
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
        </div>
      </div>

      {/* SEO Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              SEO Score
            </span>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(seoScore)} ${getScoreColor(seoScore)}`}>
              {seoScore}/100
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={seoScore} className="w-full" />
          
          {seoIssues.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Issues to fix:</p>
              {seoIssues.map((issue, index) => (
                <div key={index} className="flex items-start gap-2 text-sm">
                  <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <span>{issue}</span>
                </div>
              ))}
            </div>
          )}

          {seoScore >= 80 && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <CheckCircle className="h-4 w-4" />
              <span>Great! Your SEO looks good.</span>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">
            <Search className="h-4 w-4 mr-1" />
            Basic SEO
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="h-4 w-4 mr-1" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="advanced">
            <Target className="h-4 w-4 mr-1" />
            Advanced
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Page Title
                  <Badge variant="outline" className="ml-2">
                    {seoData.title.length}/{SEO_BEST_PRACTICES.title.max}
                  </Badge>
                </label>
                <Input
                  value={seoData.title}
                  onChange={(e) => updateSEO({ title: e.target.value })}
                  placeholder="Enter page title"
                  maxLength={70}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal length: {SEO_BEST_PRACTICES.title.min}-{SEO_BEST_PRACTICES.title.max} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Meta Description
                  <Badge variant="outline" className="ml-2">
                    {seoData.description.length}/{SEO_BEST_PRACTICES.description.max}
                  </Badge>
                </label>
                <Textarea
                  value={seoData.description}
                  onChange={(e) => updateSEO({ description: e.target.value })}
                  placeholder="Enter meta description"
                  rows={3}
                  maxLength={200}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Optimal length: {SEO_BEST_PRACTICES.description.min}-{SEO_BEST_PRACTICES.description.max} characters
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Keywords
                  <Badge variant="outline" className="ml-2">
                    {seoData.keywords ? seoData.keywords.split(',').filter(k => k.trim()).length : 0} keywords
                  </Badge>
                </label>
                <Input
                  value={seoData.keywords}
                  onChange={(e) => updateSEO({ keywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Separate keywords with commas. Optimal: {SEO_BEST_PRACTICES.keywords.optimal} keywords
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">URL Slug</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={seoData.slug}
                    onChange={(e) => updateSEO({ slug: e.target.value })}
                    placeholder="/page-url"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSEO({ slug: `/${generateSlug(seoData.title)}` })}
                    disabled={!seoData.title}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Use lowercase letters, numbers, and hyphens only
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Canonical URL (optional)</label>
                <Input
                  value={seoData.canonicalUrl || ''}
                  onChange={(e) => updateSEO({ canonicalUrl: e.target.value })}
                  placeholder="https://example.com/canonical-url"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Specify the preferred URL for this content
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={seoData.noIndex || false}
                      onCheckedChange={(checked) => updateSEO({ noIndex: checked })}
                    />
                    <label className="text-sm font-medium">No Index</label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Prevent search engines from indexing this page
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={seoData.noFollow || false}
                      onCheckedChange={(checked) => updateSEO({ noFollow: checked })}
                    />
                    <label className="text-sm font-medium">No Follow</label>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Don't pass link authority from this page
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Open Graph (Facebook)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">OG Title</label>
                <Input
                  value={seoData.ogTitle || ''}
                  onChange={(e) => updateSEO({ ogTitle: e.target.value })}
                  placeholder={seoData.title || "Enter Open Graph title"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OG Description</label>
                <Textarea
                  value={seoData.ogDescription || ''}
                  onChange={(e) => updateSEO({ ogDescription: e.target.value })}
                  placeholder={seoData.description || "Enter Open Graph description"}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OG Image</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={seoData.ogImage || ''}
                    onChange={(e) => updateSEO({ ogImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 1200x630px (1.91:1 ratio)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">OG Type</label>
                <Input
                  value={seoData.ogType || 'website'}
                  onChange={(e) => updateSEO({ ogType: e.target.value })}
                  placeholder="website"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Twitter Card
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Twitter Card Type</label>
                <Input
                  value={seoData.twitterCard || 'summary_large_image'}
                  onChange={(e) => updateSEO({ twitterCard: e.target.value })}
                  placeholder="summary_large_image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter Title</label>
                <Input
                  value={seoData.twitterTitle || ''}
                  onChange={(e) => updateSEO({ twitterTitle: e.target.value })}
                  placeholder={seoData.title || "Enter Twitter title"}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter Description</label>
                <Textarea
                  value={seoData.twitterDescription || ''}
                  onChange={(e) => updateSEO({ twitterDescription: e.target.value })}
                  placeholder={seoData.description || "Enter Twitter description"}
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Twitter Image</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={seoData.twitterImage || ''}
                    onChange={(e) => updateSEO({ twitterImage: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                  />
                  <Button variant="outline" size="sm">
                    <ImageIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Custom Meta Tags</span>
                <Button variant="outline" size="sm" onClick={addCustomMeta}>
                  Add Meta Tag
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(seoData.customMeta || []).length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No custom meta tags. Click "Add Meta Tag" to create one.
                </p>
              ) : (
                <div className="space-y-3">
                  {(seoData.customMeta || []).map((meta, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={meta.name}
                        onChange={(e) => updateCustomMeta(index, 'name', e.target.value)}
                        placeholder="Meta name (e.g., author)"
                        className="w-40"
                      />
                      <Input
                        value={meta.content}
                        onChange={(e) => updateCustomMeta(index, 'content', e.target.value)}
                        placeholder="Meta content"
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeCustomMeta(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Structured Data</CardTitle>
            </CardHeader>
            <CardContent>
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Structured data helps search engines understand your content better. 
                  This feature will be available in a future update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SEO Analysis for All Pages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pages.map((page) => {
                  const pageSEO = page.seo || {};
                  const hasTitle = !!pageSEO.title;
                  const hasDescription = !!pageSEO.description;
                  const hasKeywords = !!pageSEO.keywords;
                  
                  return (
                    <div key={page.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{page.name}</h4>
                        <p className="text-sm text-muted-foreground">{page.path}</p>
                        <div className="flex items-center gap-2 mt-1">
                          {hasTitle ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs">Title</span>
                          
                          {hasDescription ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs">Description</span>
                          
                          {hasKeywords ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-xs">Keywords</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPreviewSEO(page.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Preview
                      </Button>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Optimize Images</p>
                    <p className="text-sm text-muted-foreground">
                      Use appropriate alt tags and compressed images
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Internal Linking</p>
                    <p className="text-sm text-muted-foreground">
                      Link between related pages on your site
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Mobile Friendly</p>
                    <p className="text-sm text-muted-foreground">
                      Ensure your site works well on mobile devices
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                  <div>
                    <p className="font-medium">Page Speed</p>
                    <p className="text-sm text-muted-foreground">
                      Optimize loading times for better user experience
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}