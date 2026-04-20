import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { 
  Search,
  Star,
  Users,
  MapPin,
  FileText,
  Image as ImageIcon,
  Type,
  Zap,
  ShoppingBag,
  Calendar,
  MessageSquare,
  BarChart3,
  Globe,
  Coffee,
  Briefcase,
  Camera,
  Heart,
  Music,
  Palette,
  Target,
  TrendingUp,
  Award
} from 'lucide-react';

interface SectionTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  preview: string;
  content: any;
  tags: string[];
}

interface SectionLibraryProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (sectionType: string, content?: any) => void;
}

export function SectionLibrary({ isOpen, onClose, onAddSection }: SectionLibraryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const sectionTemplates: SectionTemplate[] = [
    // Hero Sections
    {
      id: 'hero-basic',
      type: 'hero',
      name: 'Basic Hero',
      description: 'Simple hero with title, subtitle, and CTA button',
      category: 'hero',
      icon: Type,
      preview: '/api/placeholder/400/200',
      tags: ['landing', 'header', 'cta'],
      content: {
        title: 'Welcome to Our Website',
        subtitle: 'Discover amazing products and services',
        buttonText: 'Get Started',
        backgroundImage: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&h=600&fit=crop'
      }
    },
    {
      id: 'hero-video',
      type: 'hero',
      name: 'Video Hero',
      description: 'Hero section with background video',
      category: 'hero',
      icon: Type,
      preview: '/api/placeholder/400/200',
      tags: ['video', 'landing', 'modern'],
      content: {
        title: 'Experience Innovation',
        subtitle: 'Leading the way in technology',
        buttonText: 'Watch Demo',
        backgroundVideo: 'https://example.com/hero-video.mp4',
        backgroundImage: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop'
      }
    },

    // About Sections
    {
      id: 'about-story',
      type: 'about',
      name: 'Our Story',
      description: 'About section with company story and image',
      category: 'about',
      icon: FileText,
      preview: '/api/placeholder/400/200',
      tags: ['story', 'company', 'image'],
      content: {
        title: 'Our Story',
        description: 'Founded in 2020, we have been dedicated to providing exceptional services to our clients. Our journey began with a simple vision: to make technology accessible to everyone.',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop',
        imageAlt: 'Our team working together'
      }
    },
    {
      id: 'about-stats',
      type: 'about',
      name: 'About with Stats',
      description: 'About section featuring key statistics',
      category: 'about',
      icon: BarChart3,
      preview: '/api/placeholder/400/200',
      tags: ['statistics', 'numbers', 'achievements'],
      content: {
        title: 'About Our Company',
        description: 'We are a leading provider of innovative solutions with a track record of success.',
        stats: [
          { number: '500+', label: 'Happy Clients' },
          { number: '10+', label: 'Years Experience' },
          { number: '99%', label: 'Success Rate' },
          { number: '50+', label: 'Team Members' }
        ]
      }
    },

    // Services Sections
    {
      id: 'services-grid',
      type: 'services',
      name: 'Services Grid',
      description: 'Grid layout for showcasing services',
      category: 'services',
      icon: Star,
      preview: '/api/placeholder/400/200',
      tags: ['grid', 'cards', 'services'],
      content: {
        title: 'Our Services',
        description: 'We offer comprehensive solutions for your business needs',
        services: [
          {
            name: 'Web Development',
            description: 'Custom websites and web applications',
            icon: '🌐',
            price: 'From $2,000'
          },
          {
            name: 'Mobile Apps',
            description: 'iOS and Android app development',
            icon: '📱',
            price: 'From $5,000'
          },
          {
            name: 'Digital Marketing',
            description: 'SEO, PPC, and social media marketing',
            icon: '📈',
            price: 'From $1,000'
          }
        ]
      }
    },
    {
      id: 'services-pricing',
      type: 'pricing',
      name: 'Pricing Table',
      description: 'Pricing plans with features comparison',
      category: 'services',
      icon: TrendingUp,
      preview: '/api/placeholder/400/200',
      tags: ['pricing', 'plans', 'comparison'],
      content: {
        title: 'Choose Your Plan',
        description: 'Select the perfect plan for your needs',
        plans: [
          {
            name: 'Basic',
            price: '$19',
            period: '/month',
            features: ['10 Projects', 'Basic Support', '1GB Storage'],
            popular: false
          },
          {
            name: 'Pro',
            price: '$49',
            period: '/month',
            features: ['Unlimited Projects', 'Priority Support', '10GB Storage', 'Advanced Analytics'],
            popular: true
          },
          {
            name: 'Enterprise',
            price: '$99',
            period: '/month',
            features: ['Everything in Pro', 'Custom Integrations', 'Dedicated Manager'],
            popular: false
          }
        ]
      }
    },

    // Team Sections
    {
      id: 'team-cards',
      type: 'team',
      name: 'Team Cards',
      description: 'Team member cards with photos and bios',
      category: 'team',
      icon: Users,
      preview: '/api/placeholder/400/200',
      tags: ['team', 'people', 'bios'],
      content: {
        title: 'Meet Our Team',
        description: 'Our experienced professionals are here to help you succeed',
        members: [
          {
            name: 'John Smith',
            role: 'CEO & Founder',
            image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop',
            bio: 'With over 15 years of experience in business strategy'
          },
          {
            name: 'Sarah Johnson',
            role: 'Lead Developer',
            image: 'https://images.unsplash.com/photo-1494790108755-2616b332c2f2?w=300&h=300&fit=crop',
            bio: 'Expert in full-stack development and system architecture'
          },
          {
            name: 'Michael Brown',
            role: 'Marketing Director',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop',
            bio: 'Specializes in digital marketing and brand strategy'
          }
        ]
      }
    },

    // Features Sections
    {
      id: 'features-grid',
      type: 'features',
      name: 'Features Grid',
      description: 'Grid of features with icons',
      category: 'features',
      icon: Zap,
      preview: '/api/placeholder/400/200',
      tags: ['features', 'benefits', 'icons'],
      content: {
        title: 'Why Choose Us',
        description: 'Discover what makes us different',
        features: [
          {
            icon: '⚡',
            title: 'Fast Performance',
            description: 'Lightning-fast loading times'
          },
          {
            icon: '🔒',
            title: 'Secure',
            description: 'Enterprise-grade security'
          },
          {
            icon: '📱',
            title: 'Mobile Friendly',
            description: 'Responsive on all devices'
          },
          {
            icon: '🎯',
            title: 'Targeted Solutions',
            description: 'Customized for your needs'
          },
          {
            icon: '📈',
            title: 'Analytics',
            description: 'Detailed insights and reports'
          },
          {
            icon: '🚀',
            title: 'Easy to Use',
            description: 'Intuitive and user-friendly'
          }
        ]
      }
    },

    // Testimonial Sections
    {
      id: 'testimonials-cards',
      type: 'testimonials',
      name: 'Testimonial Cards',
      description: 'Customer testimonials in card format',
      category: 'testimonials',
      icon: MessageSquare,
      preview: '/api/placeholder/400/200',
      tags: ['reviews', 'customers', 'social proof'],
      content: {
        title: 'What Our Clients Say',
        testimonials: [
          {
            name: 'Emily Davis',
            role: 'Marketing Manager',
            company: 'TechCorp',
            image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
            content: 'Outstanding service and incredible results. Highly recommended!',
            rating: 5
          },
          {
            name: 'David Wilson',
            role: 'CEO',
            company: 'StartupXYZ',
            image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
            content: 'They exceeded our expectations in every way possible.',
            rating: 5
          }
        ]
      }
    },

    // Gallery Sections
    {
      id: 'gallery-grid',
      type: 'gallery',
      name: 'Image Gallery',
      description: 'Responsive image gallery grid',
      category: 'gallery',
      icon: ImageIcon,
      preview: '/api/placeholder/400/200',
      tags: ['images', 'portfolio', 'gallery'],
      content: {
        title: 'Our Work',
        description: 'Explore our portfolio of successful projects',
        items: [
          {
            title: 'Project Alpha',
            category: 'Web Design',
            image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop'
          },
          {
            title: 'Project Beta',
            category: 'Mobile App',
            image: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop'
          },
          {
            title: 'Project Gamma',
            category: 'Branding',
            image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop'
          }
        ]
      }
    },

    // Contact Sections
    {
      id: 'contact-form',
      type: 'contact',
      name: 'Contact Form',
      description: 'Contact section with form and info',
      category: 'contact',
      icon: MapPin,
      preview: '/api/placeholder/400/200',
      tags: ['contact', 'form', 'info'],
      content: {
        title: 'Get In Touch',
        description: 'Ready to start your project? Contact us today',
        email: 'hello@example.com',
        phone: '+1 (555) 123-4567',
        address: '123 Business Street\nSuite 100\nNew York, NY 10001',
        hours: 'Mon-Fri: 9AM-6PM'
      }
    },

    // FAQ Sections
    {
      id: 'faq-accordion',
      type: 'faq',
      name: 'FAQ Accordion',
      description: 'Frequently asked questions in accordion format',
      category: 'faq',
      icon: FileText,
      preview: '/api/placeholder/400/200',
      tags: ['faq', 'questions', 'accordion'],
      content: {
        title: 'Frequently Asked Questions',
        description: 'Find answers to common questions',
        faqs: [
          {
            question: 'How long does a typical project take?',
            answer: 'Project timelines vary depending on scope and complexity, but most projects are completed within 4-8 weeks.'
          },
          {
            question: 'Do you offer ongoing support?',
            answer: 'Yes, we provide ongoing maintenance and support packages for all our clients.'
          },
          {
            question: 'What is your pricing structure?',
            answer: 'We offer flexible pricing based on project requirements. Contact us for a custom quote.'
          }
        ]
      }
    }
  ];

  const categories = [
    { id: 'all', name: 'All Sections', count: sectionTemplates.length },
    { id: 'hero', name: 'Hero', count: sectionTemplates.filter(s => s.category === 'hero').length },
    { id: 'about', name: 'About', count: sectionTemplates.filter(s => s.category === 'about').length },
    { id: 'services', name: 'Services', count: sectionTemplates.filter(s => s.category === 'services').length },
    { id: 'team', name: 'Team', count: sectionTemplates.filter(s => s.category === 'team').length },
    { id: 'features', name: 'Features', count: sectionTemplates.filter(s => s.category === 'features').length },
    { id: 'testimonials', name: 'Testimonials', count: sectionTemplates.filter(s => s.category === 'testimonials').length },
    { id: 'gallery', name: 'Gallery', count: sectionTemplates.filter(s => s.category === 'gallery').length },
    { id: 'contact', name: 'Contact', count: sectionTemplates.filter(s => s.category === 'contact').length },
    { id: 'faq', name: 'FAQ', count: sectionTemplates.filter(s => s.category === 'faq').length }
  ];

  const filteredSections = sectionTemplates.filter(section => {
    const matchesSearch = section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         section.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || section.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleAddSection = (section: SectionTemplate) => {
    onAddSection(section.type, section.content);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Zap className="h-5 w-5" />
            <span>Section Library</span>
          </DialogTitle>
        </DialogHeader>
        
        {/* Search and Filter */}
        <div className="flex items-center space-x-4 p-4 border-b">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            {categories.slice(0, 5).map(category => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5 md:grid-cols-10 gap-1">
              {categories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="text-xs px-2"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Sections Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredSections.length === 0 ? (
            <div className="text-center py-20">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No sections found</h3>
              <p className="text-gray-600">Try adjusting your search or category filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSections.map(section => (
                <Card 
                  key={section.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-200 group"
                  onClick={() => handleAddSection(section)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <section.icon className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{section.name}</CardTitle>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {section.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Preview Image */}
                    <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                      <section.icon className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {section.description}
                    </p>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {section.tags.slice(0, 3).map(tag => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {section.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{section.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                    
                    <Button 
                      className="w-full opacity-0 group-hover:opacity-100 transition-opacity"
                      size="sm"
                    >
                      Add Section
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}