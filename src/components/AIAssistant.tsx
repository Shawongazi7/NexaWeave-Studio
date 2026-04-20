import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Progress } from './ui/progress';
import { 
  Bot, 
  Sparkles, 
  Target, 
  Palette, 
  Type, 
  Image as ImageIcon,
  Zap,
  CheckCircle2,
  Lightbulb,
  Wand2,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Download,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'motion/react';

interface AIAssistantProps {
  content: any;
  selectedSection?: string;
  onApplySuggestion: (sectionId: string, content: any) => void;
  onUpdateGlobalStyles: (styles: any) => void;
}

interface AISuggestion {
  id: string;
  type: 'content' | 'style' | 'seo' | 'accessibility' | 'layout';
  title: string;
  description: string;
  content: any;
  confidence: number;
  reasoning: string;
}

export function AIAssistant({ content, selectedSection, onApplySuggestion, onUpdateGlobalStyles }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'suggest' | 'generate' | 'optimize' | 'analyze'>('suggest');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [userPrompt, setUserPrompt] = useState('');
  const [industryType, setIndustryType] = useState('business');
  const [targetAudience, setTargetAudience] = useState('professionals');
  const [brandTone, setBrandTone] = useState('professional');

  // Generate AI suggestions based on content analysis
  useEffect(() => {
    if (content && selectedSection) {
      generateSuggestions();
    }
  }, [content, selectedSection]);

  const generateSuggestions = async () => {
    setIsGenerating(true);
    setGenerationProgress(0);

    // Simulate AI processing with progress
    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 10, 90));
    }, 200);

    // Simulate API delay
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);
      
      const mockSuggestions: AISuggestion[] = [
        {
          id: '1',
          type: 'content',
          title: 'Improve Hero Headline',
          description: 'Make your headline more compelling and action-oriented',
          content: {
            title: 'Transform Your Business with AI-Powered Solutions',
            subtitle: 'Join 10,000+ companies already using our platform to increase efficiency by 300%'
          },
          confidence: 92,
          reasoning: 'Added specific benefits, social proof, and measurable outcomes'
        },
        {
          id: '2',
          type: 'style',
          title: 'Enhance Color Contrast',
          description: 'Improve accessibility with better color contrast ratios',
          content: {
            colors: {
              primary: '#2563eb',
              secondary: '#64748b',
              accent: '#f59e0b'
            }
          },
          confidence: 88,
          reasoning: 'Ensures WCAG AA compliance for better accessibility'
        },
        {
          id: '3',
          type: 'seo',
          title: 'Optimize Meta Tags',
          description: 'Improve search engine visibility with better meta descriptions',
          content: {
            title: 'AI-Powered Business Solutions | Transform Your Workflow',
            description: 'Discover how AI can revolutionize your business operations. Get started with our proven platform trusted by 10,000+ companies worldwide.',
            keywords: 'AI solutions, business automation, workflow optimization, enterprise AI'
          },
          confidence: 85,
          reasoning: 'Incorporates target keywords while maintaining readability'
        },
        {
          id: '4',
          type: 'accessibility',
          title: 'Add Alt Text',
          description: 'Improve accessibility by adding descriptive alt text to images',
          content: {
            backgroundImageAlt: 'Modern office space with professionals collaborating on AI-powered solutions',
            imageAlt: 'Team of diverse professionals working together on laptops and tablets'
          },
          confidence: 95,
          reasoning: 'Descriptive alt text helps screen readers and improves SEO'
        }
      ];

      setSuggestions(mockSuggestions);
      setIsGenerating(false);
    }, 2000);
  };

  const applySuggestion = (suggestion: AISuggestion) => {
    if (selectedSection) {
      if (suggestion.type === 'style') {
        onUpdateGlobalStyles(suggestion.content);
      } else {
        onApplySuggestion(selectedSection, suggestion.content);
      }
      toast.success('AI suggestion applied successfully!');
    }
  };

  const generateContent = async () => {
    if (!userPrompt.trim()) {
      toast.error('Please enter a prompt for content generation');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(0);

    const progressInterval = setInterval(() => {
      setGenerationProgress(prev => Math.min(prev + 15, 90));
    }, 300);

    // Simulate content generation
    setTimeout(() => {
      clearInterval(progressInterval);
      setGenerationProgress(100);

      const generatedContent = {
        title: `${userPrompt} - Generated by AI`,
        description: `This is AI-generated content based on your prompt: "${userPrompt}". The content is tailored for ${industryType} industry with a ${brandTone} tone, targeting ${targetAudience}.`,
        features: [
          'AI-powered automation',
          'Scalable solutions',
          'Real-time analytics',
          '24/7 support'
        ]
      };

      if (selectedSection) {
        onApplySuggestion(selectedSection, generatedContent);
        toast.success('Content generated and applied!');
      }
      
      setIsGenerating(false);
      setUserPrompt('');
    }, 3000);
  };

  const analyzeContent = () => {
    const analysis = {
      readabilityScore: 78,
      seoScore: 85,
      accessibilityScore: 92,
      engagementScore: 67,
      issues: [
        'Consider shorter paragraphs for better readability',
        'Add more internal links for better SEO',
        'Include call-to-action buttons in key sections'
      ],
      strengths: [
        'Good use of headings for structure',
        'Strong keyword optimization',
        'Excellent accessibility features'
      ]
    };

    return analysis;
  };

  const renderSuggestionsTab = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">AI Suggestions</h3>
        <Button variant="outline" size="sm" onClick={generateSuggestions}>
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </Button>
      </div>

      {isGenerating ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse text-primary" />
            <span className="text-sm">Analyzing your content...</span>
          </div>
          <Progress value={generationProgress} className="h-2" />
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion) => (
            <motion.div
              key={suggestion.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {suggestion.type === 'content' && <Type className="h-4 w-4 text-blue-500" />}
                  {suggestion.type === 'style' && <Palette className="h-4 w-4 text-purple-500" />}
                  {suggestion.type === 'seo' && <Target className="h-4 w-4 text-green-500" />}
                  {suggestion.type === 'accessibility' && <CheckCircle2 className="h-4 w-4 text-orange-500" />}
                  <h4 className="font-medium text-sm">{suggestion.title}</h4>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {suggestion.confidence}% confident
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground mb-3">{suggestion.description}</p>
              
              <div className="text-xs text-muted-foreground mb-3 italic">
                Reasoning: {suggestion.reasoning}
              </div>
              
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => applySuggestion(suggestion)}>
                  <Wand2 className="h-3 w-3 mr-1" />
                  Apply
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsDown className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );

  const renderGenerateTab = () => (
    <div className="space-y-4">
      <h3 className="font-medium">Generate Content</h3>
      
      <div className="space-y-3">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Industry Type</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md"
            value={industryType}
            onChange={(e) => setIndustryType(e.target.value)}
          >
            <option value="business">Business & Professional</option>
            <option value="ecommerce">E-commerce & Retail</option>
            <option value="healthcare">Healthcare & Medical</option>
            <option value="education">Education & Training</option>
            <option value="technology">Technology & Software</option>
            <option value="creative">Creative & Design</option>
            <option value="hospitality">Hospitality & Food</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Target Audience</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
          >
            <option value="professionals">Business Professionals</option>
            <option value="consumers">General Consumers</option>
            <option value="students">Students & Educators</option>
            <option value="seniors">Senior Citizens</option>
            <option value="millennials">Millennials</option>
            <option value="gen-z">Generation Z</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Brand Tone</label>
          <select 
            className="w-full mt-1 p-2 border rounded-md"
            value={brandTone}
            onChange={(e) => setBrandTone(e.target.value)}
          >
            <option value="professional">Professional</option>
            <option value="friendly">Friendly & Casual</option>
            <option value="authoritative">Authoritative</option>
            <option value="playful">Playful & Fun</option>
            <option value="luxury">Luxury & Premium</option>
            <option value="trustworthy">Trustworthy & Reliable</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-muted-foreground">Content Prompt</label>
          <Textarea
            placeholder="Describe what you want to generate (e.g., 'A compelling hero section for a SaaS product that helps businesses automate their workflows')"
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            rows={3}
            className="mt-1"
          />
        </div>

        {isGenerating ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 animate-pulse text-primary" />
              <span className="text-sm">Generating content...</span>
            </div>
            <Progress value={generationProgress} className="h-2" />
          </div>
        ) : (
          <Button onClick={generateContent} className="w-full">
            <Zap className="h-4 w-4 mr-2" />
            Generate Content
          </Button>
        )}
      </div>
    </div>
  );

  const renderAnalyzeTab = () => {
    const analysis = analyzeContent();
    
    return (
      <div className="space-y-4">
        <h3 className="font-medium">Content Analysis</h3>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{analysis.readabilityScore}</div>
            <div className="text-xs text-muted-foreground">Readability</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{analysis.seoScore}</div>
            <div className="text-xs text-muted-foreground">SEO Score</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-purple-600">{analysis.accessibilityScore}</div>
            <div className="text-xs text-muted-foreground">Accessibility</div>
          </div>
          <div className="p-3 border rounded-lg text-center">
            <div className="text-2xl font-bold text-orange-600">{analysis.engagementScore}</div>
            <div className="text-xs text-muted-foreground">Engagement</div>
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 text-red-600">Issues to Address</h4>
          <div className="space-y-1">
            {analysis.issues.map((issue, index) => (
              <div key={index} className="text-sm flex items-start gap-2">
                <div className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                {issue}
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-medium text-sm mb-2 text-green-600">Strengths</h4>
          <div className="space-y-1">
            {analysis.strengths.map((strength, index) => (
              <div key={index} className="text-sm flex items-start gap-2">
                <CheckCircle2 className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                {strength}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-50"
      >
        <Bot className="h-4 w-4 mr-2" />
        AI Assistant
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI Assistant
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="flex border-b">
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'suggest'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('suggest')}
              >
                <Lightbulb className="h-4 w-4 mr-1 inline" />
                Suggestions
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'generate'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('generate')}
              >
                <Zap className="h-4 w-4 mr-1 inline" />
                Generate
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'analyze'
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab('analyze')}
              >
                <Target className="h-4 w-4 mr-1 inline" />
                Analyze
              </button>
            </div>

            <div className="mt-4">
              {activeTab === 'suggest' && renderSuggestionsTab()}
              {activeTab === 'generate' && renderGenerateTab()}
              {activeTab === 'analyze' && renderAnalyzeTab()}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}