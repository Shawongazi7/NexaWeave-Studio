import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { ImageWithFallback } from './common/ImageWithFallback';

interface PublishedSiteViewerProps {
  projectId: string;
  onNavigate: (page: string) => void;
  projects: Array<{
    id: string;
    name: string;
    content: {
      pages: Array<{
        id: string;
        name: string;
        path: string;
        sections: Array<{
          id: string;
          type: string;
          content: any;
        }>;
      }>;
    };
    isPublished: boolean;
    publishUrl?: string;
  }>;
}

export function PublishedSiteViewer({ projectId, onNavigate, projects }: PublishedSiteViewerProps) {
  const project = projects.find(p => p.id === projectId && p.isPublished);
  const [currentPageId, setCurrentPageId] = useState(project?.content.pages[0]?.id || '');
  
  const currentPage = project?.content.pages.find(page => page.id === currentPageId);
  const navigation = currentPage?.sections.find(section => section.type === 'navigation');

  const renderSection = (section: any) => {
    switch (section.type) {
      case 'navigation':
        return (
          <nav key={section.id} className="bg-white border-b sticky top-0 z-40">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <div className="font-bold text-xl text-primary">
                {section.content.logo}
              </div>
              <div className="hidden md:flex items-center space-x-6">
                {section.content.menuItems?.map((item: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => {
                      const targetPage = project?.content.pages.find(page => 
                        page.name.toLowerCase() === item.toLowerCase()
                      );
                      if (targetPage) {
                        setCurrentPageId(targetPage.id);
                      }
                    }}
                    className={`hover:text-primary transition-colors ${
                      currentPage?.name.toLowerCase() === item.toLowerCase() 
                        ? 'text-primary font-medium' 
                        : 'text-gray-600'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          </nav>
        );

      case 'hero':
        return (
          <section 
            key={section.id}
            className="relative h-96 md:h-[500px] bg-cover bg-center flex items-center justify-center text-white"
            style={{ 
              backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${section.content.backgroundImage})` 
            }}
          >
            <div className="text-center max-w-4xl px-4">
              <h1 className="text-3xl md:text-5xl lg:text-6xl mb-4">
                {section.content.title}
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                {section.content.subtitle}
              </p>
              <Button size="lg" className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100">
                {section.content.buttonText || 'Get Started'}
              </Button>
            </div>
          </section>
        );

      case 'features':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-12">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12 max-w-3xl mx-auto">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {section.content.features?.map((feature: any, index: number) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="text-xl mb-2">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'about':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl md:text-4xl mb-6">
                    {section.content.title}
                  </h2>
                  <p className="text-lg text-gray-600 mb-6">
                    {section.content.description}
                  </p>
                  {section.content.stats && (
                    <div className="grid grid-cols-3 gap-4">
                      {section.content.stats.map((stat: any, index: number) => (
                        <div key={index} className="text-center">
                          <div className="text-2xl font-bold text-primary">{stat.number}</div>
                          <div className="text-sm text-gray-600">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.content.skills && (
                    <div className="flex flex-wrap gap-2 mt-6">
                      {section.content.skills.map((skill: string, index: number) => (
                        <Badge key={index} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  )}
                  {section.content.chef && (
                    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <ImageWithFallback
                          src={section.content.chef.image}
                          alt={section.content.chef.name}
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="font-semibold">{section.content.chef.name}</h4>
                          <p className="text-sm text-gray-600">{section.content.chef.bio}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {section.content.image && (
                  <div className="order-first md:order-last">
                    <ImageWithFallback
                      src={section.content.image}
                      alt="About"
                      className="w-full h-64 md:h-96 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'services':
        return (
          <section key={section.id} className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-6">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {section.content.services?.map((service: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    {service.image && (
                      <ImageWithFallback
                        src={service.image}
                        alt={service.name}
                        className="w-full h-32 object-cover rounded mb-4"
                      />
                    )}
                    <h3 className="text-xl mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-3">{service.description}</p>
                    {service.price && (
                      <p className="text-primary font-semibold">{service.price}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'team':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-6">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.content.members?.map((member: any, index: number) => (
                  <div key={index} className="text-center">
                    <ImageWithFallback
                      src={member.image}
                      alt={member.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl mb-1">{member.name}</h3>
                    <p className="text-primary mb-2">{member.role}</p>
                    <p className="text-sm text-gray-600">{member.bio}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'gallery':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-12">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.content.items?.map((item: any, index: number) => (
                  <div key={index} className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-lg">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.title}
                        className="w-full h-64 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="text-white text-center">
                          <h3 className="text-lg font-semibold mb-1">{item.title}</h3>
                          <p className="text-sm">{item.category}</p>
                        </div>
                      </div>
                    </div>
                    {item.description && (
                      <p className="text-sm text-gray-600 mt-2">{item.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'portfolio':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-12">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-3 gap-6">
                {section.content.projects?.map((project: any, index: number) => (
                  <div key={index} className="group">
                    <ImageWithFallback
                      src={project.image}
                      alt={project.title}
                      className="w-full h-64 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold">{project.title}</h3>
                    <p className="text-primary text-sm">{project.category}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'pricing':
        return (
          <section key={section.id} className="py-16 px-4 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-6">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="grid md:grid-cols-3 gap-8">
                {section.content.plans?.map((plan: any, index: number) => (
                  <div 
                    key={index} 
                    className={`bg-white p-8 rounded-lg shadow-sm relative ${
                      plan.popular ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        Most Popular
                      </Badge>
                    )}
                    <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="text-gray-600">{plan.period}</span>
                    </div>
                    <ul className="space-y-2 mb-8">
                      {plan.features?.map((feature: string, featureIndex: number) => (
                        <li key={featureIndex} className="flex items-center">
                          <span className="text-green-500 mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                      Get Started
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'menu':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-6">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-center text-gray-600 mb-12">
                  {section.content.description}
                </p>
              )}
              <div className="space-y-12">
                {section.content.categories?.map((category: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-2xl font-semibold mb-6 text-center">{category.name}</h3>
                    <div className="space-y-4">
                      {category.items?.map((item: any, itemIndex: number) => (
                        <div key={itemIndex} className="flex justify-between items-start border-b pb-4">
                          <div className="flex-1">
                            <h4 className="font-semibold">{item.name}</h4>
                            <p className="text-gray-600 text-sm">{item.description}</p>
                          </div>
                          <span className="font-bold text-primary ml-4">{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'locations':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl text-center mb-12">
                {section.content.title}
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {section.content.locations?.map((location: any, index: number) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    {location.image && (
                      <ImageWithFallback
                        src={location.image}
                        alt={location.name}
                        className="w-full h-48 object-cover rounded mb-4"
                      />
                    )}
                    <h3 className="text-xl font-semibold mb-3">{location.name}</h3>
                    <div className="space-y-2 text-gray-600">
                      <p className="whitespace-pre-line">{location.address}</p>
                      <p><strong>Phone:</strong> {location.phone}</p>
                      <p><strong>Hours:</strong></p>
                      <p className="whitespace-pre-line text-sm">{location.hours}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact':
        return (
          <section key={section.id} className="py-16 px-4">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl mb-6">
                {section.content.title}
              </h2>
              {section.content.description && (
                <p className="text-lg text-gray-600 mb-8">
                  {section.content.description}
                </p>
              )}
              <div className="space-y-4">
                {section.content.email && (
                  <p className="text-lg">
                    <strong>Email:</strong>{' '}
                    <a href={`mailto:${section.content.email}`} className="text-primary hover:underline">
                      {section.content.email}
                    </a>
                  </p>
                )}
                {section.content.phone && (
                  <p className="text-lg">
                    <strong>Phone:</strong>{' '}
                    <a href={`tel:${section.content.phone}`} className="text-primary hover:underline">
                      {section.content.phone}
                    </a>
                  </p>
                )}
                {section.content.address && (
                  <p className="text-lg whitespace-pre-line">
                    <strong>Address:</strong><br />
                    {section.content.address}
                  </p>
                )}
                {section.content.hours && (
                  <p className="text-lg">
                    <strong>Hours:</strong> {section.content.hours}
                  </p>
                )}
                {section.content.social && (
                  <div className="pt-4">
                    <p className="mb-2"><strong>Follow us:</strong></p>
                    <div className="flex justify-center space-x-4">
                      {section.content.social.map((platform: string, index: number) => (
                        <Badge key={index} variant="outline">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {section.content.reservationNote && (
                  <p className="text-sm text-gray-600 italic">
                    {section.content.reservationNote}
                  </p>
                )}
              </div>
            </div>
          </section>
        );

      case 'footer':
        return (
          <footer key={section.id} className="bg-gray-900 text-white py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h4 className="font-semibold mb-4">{section.content.companyName}</h4>
                  <p className="text-gray-400 text-sm">{section.content.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    {section.content.links?.map((link: string, index: number) => (
                      <li key={index}>{link}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                © 2025 {section.content.companyName || 'Your Company'}. All rights reserved.
              </div>
            </div>
          </footer>
        );
      
      default:
        return null;
    }
  };

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Site Not Found</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              This published site could not be found or is no longer available.
            </p>
            <Button onClick={() => onNavigate('landing')} className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!currentPage) {
    return <div>Page not found</div>;
  }

  return (
    <div className="min-h-screen">
      {/* Published site header */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onNavigate('landing')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Builder
            </Button>
            <div className="text-sm text-muted-foreground">
              Viewing: <span className="text-foreground">{project.name}</span> - {currentPage.name}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center space-x-2">
              {project.content.pages.map((page) => (
                <Badge
                  key={page.id}
                  variant={page.id === currentPageId ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => setCurrentPageId(page.id)}
                >
                  {page.name}
                </Badge>
              ))}
            </div>
            <Badge variant="outline">
              <ExternalLink className="w-3 h-3 mr-1" />
              Published
            </Badge>
          </div>
        </div>
      </div>

      {/* Render the current page content */}
      <div className="published-site">
        {currentPage.sections.map(renderSection)}
      </div>
    </div>
  );
}