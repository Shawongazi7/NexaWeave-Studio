import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { Progress } from './ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { 
  Globe, 
  Download, 
  Upload, 
  ExternalLink, 
  Copy, 
  Settings, 
  CheckCircle, 
  AlertTriangle,
  Zap,
  Share2,
  Code,
  FileText,
  Smartphone,
  Monitor,
  Tablet,
  Search,
  BarChart3,
  Clock,
  Shield,
  Rocket,
  Link
} from 'lucide-react';

interface PublishingSettings {
  customDomain?: string;
  subdomain?: string;
  password?: string;
  seoOptimized: boolean;
  responsive: boolean;
  favicon?: string;
  analytics?: {
    googleAnalytics?: string;
    facebookPixel?: string;
    customTracking?: string;
  };
  performance: {
    imageOptimization: boolean;
    caching: boolean;
    compression: boolean;
    lazyLoading: boolean;
  };
  security: {
    httpsRedirect: boolean;
    passwordProtection: boolean;
    comingSoonMode: boolean;
  };
}

interface DeploymentStatus {
  status: 'idle' | 'building' | 'deploying' | 'success' | 'error';
  progress: number;
  message: string;
  url?: string;
  timestamp?: string;
  buildTime?: number;
}

interface PublishingPanelProps {
  projectName: string;
  content: any;
  settings: PublishingSettings;
  deploymentStatus: DeploymentStatus;
  onUpdateSettings: (settings: Partial<PublishingSettings>) => void;
  onPublish: (settings: PublishingSettings) => void;
  onExportStatic: () => void;
  onPreviewDeployment: () => void;
  onGenerateQR: () => void;
  isPublished: boolean;
  publishUrl?: string;
}

const DEPLOYMENT_PROVIDERS = [
  {
    id: 'vercel',
    name: 'Vercel',
    description: 'Deploy instantly with zero configuration',
    icon: '▲',
    features: ['Global CDN', 'Instant deployment', 'Auto SSL'],
    free: true
  },
  {
    id: 'netlify',
    name: 'Netlify',
    description: 'Deploy with forms and serverless functions',
    icon: '🌐',
    features: ['Form handling', 'Serverless functions', 'Split testing'],
    free: true
  },
  {
    id: 'github-pages',
    name: 'GitHub Pages',
    description: 'Free hosting for static sites',
    icon: '🐙',
    features: ['GitHub integration', 'Version control', 'Custom domains'],
    free: true
  },
  {
    id: 'custom',
    name: 'Custom FTP',
    description: 'Deploy to your own server',
    icon: '🗄️',
    features: ['Full control', 'Custom configuration', 'Any provider'],
    free: false
  }
];

export function PublishingPanel({
  projectName,
  content,
  settings,
  deploymentStatus,
  onUpdateSettings,
  onPublish,
  onExportStatic,
  onPreviewDeployment,
  onGenerateQR,
  isPublished,
  publishUrl
}: PublishingPanelProps) {
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [preflightChecks, setPreflightChecks] = useState<Record<string, boolean>>({});

  useEffect(() => {
    runPreflightChecks();
  }, [content, settings]);

  const runPreflightChecks = () => {
    const checks = {
      hasContent: content?.pages?.length > 0,
      hasTitle: content?.seo?.title?.length > 0,
      hasDescription: content?.seo?.description?.length > 0,
      responsiveDesign: settings.responsive,
      seoOptimized: settings.seoOptimized,
      httpsEnabled: settings.security.httpsRedirect,
      imagesOptimized: settings.performance.imageOptimization
    };
    setPreflightChecks(checks);
  };

  const getCheckIcon = (passed: boolean) => 
    passed ? <CheckCircle className="h-4 w-4 text-green-500" /> : <AlertTriangle className="h-4 w-4 text-yellow-500" />;

  const getDeploymentStatusColor = () => {
    switch (deploymentStatus.status) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'building':
      case 'deploying': return 'text-blue-600';
      default: return 'text-muted-foreground';
    }
  };

  const generateSubdomain = () => {
    const slug = projectName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    return `${slug}-${randomSuffix}`;
  };

  const updateSettings = (updates: Partial<PublishingSettings>) => {
    onUpdateSettings({ ...settings, ...updates });
  };

  const handlePublish = () => {
    if (!settings.subdomain) {
      updateSettings({ subdomain: generateSubdomain() });
    }
    onPublish(settings);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Publishing & Deployment
          </h3>
          <p className="text-sm text-muted-foreground">
            Deploy your site to the web
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isPublished && publishUrl && (
            <Button variant="outline" size="sm" onClick={() => window.open(publishUrl, '_blank')}>
              <ExternalLink className="h-4 w-4 mr-1" />
              View Live
            </Button>
          )}
          <Button variant="outline" size="sm" onClick={onExportStatic}>
            <Download className="h-4 w-4 mr-1" />
            Export HTML
          </Button>
        </div>
      </div>

      {/* Deployment Status */}
      {deploymentStatus.status !== 'idle' && (
        <Card>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${getDeploymentStatusColor()}`}>
              <div className="flex items-center gap-2">
                {deploymentStatus.status === 'building' || deploymentStatus.status === 'deploying' ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
                ) : deploymentStatus.status === 'success' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertTriangle className="h-4 w-4" />
                )}
                {deploymentStatus.status === 'building' && 'Building...'}
                {deploymentStatus.status === 'deploying' && 'Deploying...'}
                {deploymentStatus.status === 'success' && 'Deployment Successful'}
                {deploymentStatus.status === 'error' && 'Deployment Failed'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Progress value={deploymentStatus.progress} className="w-full" />
              <p className="text-sm text-muted-foreground">{deploymentStatus.message}</p>
              
              {deploymentStatus.status === 'success' && deploymentStatus.url && (
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <Globe className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">
                    Your site is live at:
                  </span>
                  <a 
                    href={deploymentStatus.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-green-600 hover:underline"
                  >
                    {deploymentStatus.url}
                  </a>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => copyToClipboard(deploymentStatus.url!)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {deploymentStatus.buildTime && (
                <p className="text-xs text-muted-foreground">
                  Build completed in {deploymentStatus.buildTime}s
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="deploy" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="deploy">
            <Rocket className="h-4 w-4 mr-1" />
            Deploy
          </TabsTrigger>
          <TabsTrigger value="domain">
            <Link className="h-4 w-4 mr-1" />
            Domain
          </TabsTrigger>
          <TabsTrigger value="performance">
            <Zap className="h-4 w-4 mr-1" />
            Performance
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <BarChart3 className="h-4 w-4 mr-1" />
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="deploy" className="space-y-6">
          {/* Preflight Checks */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Pre-flight Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Has content</span>
                  {getCheckIcon(preflightChecks.hasContent)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SEO title set</span>
                  {getCheckIcon(preflightChecks.hasTitle)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Meta description set</span>
                  {getCheckIcon(preflightChecks.hasDescription)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Responsive design</span>
                  {getCheckIcon(preflightChecks.responsiveDesign)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">SEO optimized</span>
                  {getCheckIcon(preflightChecks.seoOptimized)}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HTTPS enabled</span>
                  {getCheckIcon(preflightChecks.httpsEnabled)}
                </div>
              </div>

              {Object.values(preflightChecks).every(check => check) && (
                <Alert className="mt-4">
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    All checks passed! Your site is ready to deploy.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Deployment Providers */}
          <Card>
            <CardHeader>
              <CardTitle>Choose Deployment Provider</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DEPLOYMENT_PROVIDERS.map(provider => (
                  <div
                    key={provider.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedProvider === provider.id
                        ? 'border-primary bg-primary/5'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => setSelectedProvider(provider.id)}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{provider.icon}</span>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{provider.name}</h4>
                          {provider.free && (
                            <Badge variant="secondary" className="text-xs">Free</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {provider.description}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {provider.features.map(feature => (
                            <Badge key={feature} variant="outline" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Deploy Button */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium mb-1">Ready to deploy?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your site will be live in seconds
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={onPreviewDeployment}>
                    <Eye className="h-4 w-4 mr-1" />
                    Preview
                  </Button>
                  <Button 
                    onClick={handlePublish}
                    disabled={deploymentStatus.status === 'building' || deploymentStatus.status === 'deploying'}
                    className="min-w-[120px]"
                  >
                    {deploymentStatus.status === 'building' || deploymentStatus.status === 'deploying' ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2" />
                        Deploying...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-4 w-4 mr-1" />
                        {isPublished ? 'Redeploy' : 'Deploy Site'}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="domain" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Domain Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Subdomain</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={settings.subdomain || ''}
                    onChange={(e) => updateSettings({ subdomain: e.target.value })}
                    placeholder="my-awesome-site"
                  />
                  <span className="text-sm text-muted-foreground">.nexaweave.site</span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => updateSettings({ subdomain: generateSubdomain() })}
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This will be your site URL: {settings.subdomain || 'your-site'}.nexaweave.site
                </p>
              </div>

              <Separator />

              <div>
                <label className="block text-sm font-medium mb-2">Custom Domain (Pro)</label>
                <Input
                  value={settings.customDomain || ''}
                  onChange={(e) => updateSettings({ customDomain: e.target.value })}
                  placeholder="www.yoursite.com"
                  disabled
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Upgrade to Pro to use your own domain
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">HTTPS Redirect</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically redirect HTTP to HTTPS
                  </p>
                </div>
                <Switch
                  checked={settings.security.httpsRedirect}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      security: { ...settings.security, httpsRedirect: checked } 
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Password Protection</label>
                  <p className="text-sm text-muted-foreground">
                    Require password to access site
                  </p>
                </div>
                <Switch
                  checked={settings.security.passwordProtection}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      security: { ...settings.security, passwordProtection: checked } 
                    })
                  }
                />
              </div>

              {settings.security.passwordProtection && (
                <div>
                  <label className="block text-sm font-medium mb-2">Site Password</label>
                  <Input
                    type="password"
                    value={settings.password || ''}
                    onChange={(e) => updateSettings({ password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              )}

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Coming Soon Mode</label>
                  <p className="text-sm text-muted-foreground">
                    Show coming soon page instead of site
                  </p>
                </div>
                <Switch
                  checked={settings.security.comingSoonMode}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      security: { ...settings.security, comingSoonMode: checked } 
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Performance Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Image Optimization</label>
                  <p className="text-sm text-muted-foreground">
                    Automatically compress and resize images
                  </p>
                </div>
                <Switch
                  checked={settings.performance.imageOptimization}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      performance: { ...settings.performance, imageOptimization: checked } 
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Browser Caching</label>
                  <p className="text-sm text-muted-foreground">
                    Cache resources for faster loading
                  </p>
                </div>
                <Switch
                  checked={settings.performance.caching}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      performance: { ...settings.performance, caching: checked } 
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Gzip Compression</label>
                  <p className="text-sm text-muted-foreground">
                    Compress files to reduce bandwidth
                  </p>
                </div>
                <Switch
                  checked={settings.performance.compression}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      performance: { ...settings.performance, compression: checked } 
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Lazy Loading</label>
                  <p className="text-sm text-muted-foreground">
                    Load images only when visible
                  </p>
                </div>
                <Switch
                  checked={settings.performance.lazyLoading}
                  onCheckedChange={(checked) => 
                    updateSettings({ 
                      performance: { ...settings.performance, lazyLoading: checked } 
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>SEO & Responsive</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">SEO Optimization</label>
                  <p className="text-sm text-muted-foreground">
                    Include meta tags and structured data
                  </p>
                </div>
                <Switch
                  checked={settings.seoOptimized}
                  onCheckedChange={(checked) => updateSettings({ seoOptimized: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label className="font-medium">Responsive Design</label>
                  <p className="text-sm text-muted-foreground">
                    Optimize for mobile and tablet devices
                  </p>
                </div>
                <Switch
                  checked={settings.responsive}
                  onCheckedChange={(checked) => updateSettings({ responsive: checked })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Favicon</label>
                <div className="flex items-center gap-2">
                  <Input
                    value={settings.favicon || ''}
                    onChange={(e) => updateSettings({ favicon: e.target.value })}
                    placeholder="https://yoursite.com/favicon.ico"
                  />
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Analytics & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Google Analytics ID</label>
                <Input
                  value={settings.analytics?.googleAnalytics || ''}
                  onChange={(e) => updateSettings({ 
                    analytics: { 
                      ...settings.analytics, 
                      googleAnalytics: e.target.value 
                    } 
                  })}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Track page views, user behavior, and conversions
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Facebook Pixel ID</label>
                <Input
                  value={settings.analytics?.facebookPixel || ''}
                  onChange={(e) => updateSettings({ 
                    analytics: { 
                      ...settings.analytics, 
                      facebookPixel: e.target.value 
                    } 
                  })}
                  placeholder="123456789012345"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Track conversions for Facebook ads
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Custom Tracking Code</label>
                <Textarea
                  value={settings.analytics?.customTracking || ''}
                  onChange={(e) => updateSettings({ 
                    analytics: { 
                      ...settings.analytics, 
                      customTracking: e.target.value 
                    } 
                  })}
                  placeholder="<!-- Your custom tracking code -->"
                  rows={4}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Add custom analytics or tracking scripts
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sharing & QR Code</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={onGenerateQR} className="flex-1">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Generate QR Code
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Link
                </Button>
              </div>

              {isPublished && publishUrl && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-2">Share your site:</p>
                  <div className="flex items-center gap-2">
                    <Input value={publishUrl} readOnly className="text-sm" />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(publishUrl)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}