import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Alert, AlertDescription } from './ui/alert';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  Type, 
  MousePointer, 
  Volume2,
  Contrast,
  Focus,
  Navigation,
  Info,
  ExternalLink,
  RefreshCw,
  Download
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AccessibilityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'color' | 'text' | 'navigation' | 'images' | 'forms' | 'structure';
  title: string;
  description: string;
  element?: string;
  wcagLevel: 'A' | 'AA' | 'AAA';
  impact: 'critical' | 'serious' | 'moderate' | 'minor';
  solution: string;
  learnMoreUrl?: string;
}

interface AccessibilityReport {
  score: number;
  issues: AccessibilityIssue[];
  compliantRules: number;
  totalRules: number;
  lastScanned: string;
}

interface AccessibilityCheckerProps {
  content: any;
  onFixIssue: (issueId: string, fix: any) => void;
}

export function AccessibilityChecker({ content, onFixIssue }: AccessibilityCheckerProps) {
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [autoFixAvailable, setAutoFixAvailable] = useState<string[]>([]);

  const scanAccessibility = async () => {
    setIsScanning(true);
    
    // Simulate accessibility scanning
    setTimeout(() => {
      const mockIssues: AccessibilityIssue[] = [
        {
          id: '1',
          type: 'error',
          category: 'images',
          title: 'Missing Alt Text',
          description: 'Images must have alternative text for screen readers',
          element: 'Hero background image',
          wcagLevel: 'A',
          impact: 'critical',
          solution: 'Add descriptive alt text to all images',
          learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/non-text-content.html'
        },
        {
          id: '2',
          type: 'warning',
          category: 'color',
          title: 'Poor Color Contrast',
          description: 'Text does not meet minimum contrast ratio requirements',
          element: 'Button text on colored background',
          wcagLevel: 'AA',
          impact: 'serious',
          solution: 'Use darker text or lighter background colors',
          learnMoreUrl: 'https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html'
        },
        {
          id: '3',
          type: 'warning',
          category: 'structure',
          title: 'Missing Heading Hierarchy',
          description: 'Page skips heading levels (H1 to H3)',
          element: 'About section',
          wcagLevel: 'AA',
          impact: 'moderate',
          solution: 'Use proper heading hierarchy (H1, H2, H3, etc.)'
        },
        {
          id: '4',
          type: 'info',
          category: 'navigation',
          title: 'No Skip Link',
          description: 'Consider adding skip navigation links',
          wcagLevel: 'A',
          impact: 'minor',
          solution: 'Add "Skip to main content" link for keyboard users'
        },
        {
          id: '5',
          type: 'error',
          category: 'forms',
          title: 'Form Labels Missing',
          description: 'Form inputs must have associated labels',
          element: 'Contact form',
          wcagLevel: 'A',
          impact: 'critical',
          solution: 'Add proper labels to all form inputs'
        }
      ];

      const score = Math.round(((50 - mockIssues.filter(i => i.type === 'error').length * 10 - mockIssues.filter(i => i.type === 'warning').length * 5) / 50) * 100);
      
      setReport({
        score: Math.max(score, 0),
        issues: mockIssues,
        compliantRules: 45,
        totalRules: 50,
        lastScanned: new Date().toISOString()
      });

      // Simulate auto-fix availability
      setAutoFixAvailable(['1', '3', '4']);
      setIsScanning(false);
    }, 2000);
  };

  useEffect(() => {
    if (content) {
      scanAccessibility();
    }
  }, [content]);

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'error': return XCircle;
      case 'warning': return AlertTriangle;
      case 'info': return Info;
      default: return Info;
    }
  };

  const getIssueColor = (type: string) => {
    switch (type) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'color': return Contrast;
      case 'text': return Type;
      case 'navigation': return Navigation;
      case 'images': return Eye;
      case 'forms': return MousePointer;
      case 'structure': return Focus;
      default: return Info;
    }
  };

  const autoFixIssue = (issueId: string) => {
    const issue = report?.issues.find(i => i.id === issueId);
    if (!issue) return;

    let fix = {};
    
    switch (issue.category) {
      case 'images':
        fix = { backgroundImageAlt: 'Professional business environment showcasing modern workflow solutions' };
        break;
      case 'structure':
        fix = { headingLevel: 'h2' };
        break;
      case 'navigation':
        fix = { skipLink: true };
        break;
      default:
        fix = {};
    }

    onFixIssue(issueId, fix);
    
    // Remove the fixed issue from the report
    if (report) {
      const updatedIssues = report.issues.filter(i => i.id !== issueId);
      const newScore = Math.round(((50 - updatedIssues.filter(i => i.type === 'error').length * 10 - updatedIssues.filter(i => i.type === 'warning').length * 5) / 50) * 100);
      
      setReport({
        ...report,
        issues: updatedIssues,
        score: Math.max(newScore, 0)
      });
    }
  };

  const filteredIssues = selectedCategory 
    ? report?.issues.filter(issue => issue.category === selectedCategory) || []
    : report?.issues || [];

  const categories = [
    { id: 'color', name: 'Color & Contrast', icon: Contrast },
    { id: 'text', name: 'Text & Typography', icon: Type },
    { id: 'navigation', name: 'Navigation', icon: Navigation },
    { id: 'images', name: 'Images & Media', icon: Eye },
    { id: 'forms', name: 'Forms & Controls', icon: MousePointer },
    { id: 'structure', name: 'Document Structure', icon: Focus },
  ];

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreDescription = (score: number) => {
    if (score >= 90) return 'Excellent - Meets most accessibility standards';
    if (score >= 70) return 'Good - Some improvements needed';
    if (score >= 50) return 'Fair - Several issues to address';
    return 'Poor - Significant accessibility barriers';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          Accessibility Checker
        </h3>
        <Button variant="outline" size="sm" onClick={scanAccessibility} disabled={isScanning}>
          <RefreshCw className={`h-4 w-4 mr-1 ${isScanning ? 'animate-spin' : ''}`} />
          {isScanning ? 'Scanning...' : 'Re-scan'}
        </Button>
      </div>

      {isScanning ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 animate-pulse text-primary" />
            <span className="text-sm">Analyzing accessibility...</span>
          </div>
          <Progress value={65} className="h-2" />
          <p className="text-xs text-muted-foreground">
            Checking color contrast, heading structure, image alt text, and more...
          </p>
        </div>
      ) : report ? (
        <>
          {/* Score Overview */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className={`text-3xl font-bold ${getScoreColor(report.score)}`}>
                    {report.score}/100
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getScoreDescription(report.score)}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {report.compliantRules}/{report.totalRules}
                  </div>
                  <p className="text-xs text-muted-foreground">Rules passed</p>
                </div>
              </div>
              <Progress value={report.score} className="h-3" />
              <div className="mt-2 text-xs text-muted-foreground">
                Last scanned: {new Date(report.lastScanned).toLocaleString()}
              </div>
            </CardContent>
          </Card>

          {/* Issue Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4 text-center border-red-200 bg-red-50">
              <div className="text-2xl font-bold text-red-600">
                {report.issues.filter(i => i.type === 'error').length}
              </div>
              <div className="text-sm text-red-700">Errors</div>
            </Card>
            <Card className="p-4 text-center border-orange-200 bg-orange-50">
              <div className="text-2xl font-bold text-orange-600">
                {report.issues.filter(i => i.type === 'warning').length}
              </div>
              <div className="text-sm text-orange-700">Warnings</div>
            </Card>
            <Card className="p-4 text-center border-blue-200 bg-blue-50">
              <div className="text-2xl font-bold text-blue-600">
                {report.issues.filter(i => i.type === 'info').length}
              </div>
              <div className="text-sm text-blue-700">Info</div>
            </Card>
          </div>

          {/* Category Filter */}
          <div>
            <h4 className="font-medium mb-3">Filter by Category</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Issues ({report.issues.length})
              </Button>
              {categories.map(category => {
                const categoryIssues = report.issues.filter(i => i.category === category.id);
                const CategoryIcon = category.icon;
                
                if (categoryIssues.length === 0) return null;
                
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <CategoryIcon className="h-3 w-3 mr-1" />
                    {category.name} ({categoryIssues.length})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            <AnimatePresence>
              {filteredIssues.map((issue) => {
                const IssueIcon = getIssueIcon(issue.type);
                const isAutoFixable = autoFixAvailable.includes(issue.id);
                
                return (
                  <motion.div
                    key={issue.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <Card className={`border ${getIssueColor(issue.type)}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <IssueIcon className="h-4 w-4" />
                            <h4 className="font-medium">{issue.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              WCAG {issue.wcagLevel}
                            </Badge>
                            <Badge variant={issue.impact === 'critical' ? 'destructive' : 'secondary'} className="text-xs">
                              {issue.impact}
                            </Badge>
                          </div>
                          {isAutoFixable && (
                            <Button
                              size="sm"
                              onClick={() => autoFixIssue(issue.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Auto Fix
                            </Button>
                          )}
                        </div>
                        
                        <p className="text-sm mb-2">{issue.description}</p>
                        
                        {issue.element && (
                          <p className="text-xs text-muted-foreground mb-2">
                            Element: <code className="bg-muted px-1 rounded">{issue.element}</code>
                          </p>
                        )}
                        
                        <div className="bg-background p-3 rounded border mb-3">
                          <h5 className="text-xs font-medium mb-1">Solution:</h5>
                          <p className="text-xs">{issue.solution}</p>
                        </div>
                        
                        {issue.learnMoreUrl && (
                          <Button variant="ghost" size="sm" className="text-xs p-0 h-auto">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Learn more about this guideline
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Export Report */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View WCAG Guidelines
            </Button>
          </div>
        </>
      ) : (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            No accessibility report available. Click "Re-scan" to analyze your content.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}