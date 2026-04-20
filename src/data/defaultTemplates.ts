import type { Template } from "../types/app";

export const defaultTemplates: Template[] =     [
      {
        id: "1",
        title: "Modern Business",
        description:
          "Clean and professional template for modern businesses",
        category: "Business",
        thumbnail:
          "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "BusinessPro",
                    menuItems: [
                      "Home",
                      "About",
                      "Services",
                      "Team",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-1",
                  type: "hero",
                  content: {
                    title: "Transform Your Business Today",
                    subtitle:
                      "Professional solutions for modern companies",
                    buttonText: "Get Started",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1200&h=600&fit=crop",
                  },
                },
                {
                  id: "features-1",
                  type: "features",
                  content: {
                    title: "Why Choose Us",
                    features: [
                      {
                        icon: "âš¡",
                        title: "Fast Delivery",
                        description: "Quick turnaround times",
                      },
                      {
                        icon: "ðŸŽ¯",
                        title: "Strategic Focus",
                        description: "Goal-oriented solutions",
                      },
                      {
                        icon: "ðŸ”§",
                        title: "Expert Support",
                        description:
                          "24/7 professional assistance",
                      },
                    ],
                  },
                },
                {
                  id: "footer-1",
                  type: "footer",
                  content: {
                    companyName: "BusinessPro",
                    description:
                      "Professional solutions for modern companies",
                    links: ["Privacy", "Terms", "Contact"],
                  },
                },
              ],
            },
            {
              id: "about",
              name: "About",
              path: "/about",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "BusinessPro",
                    menuItems: [
                      "Home",
                      "About",
                      "Services",
                      "Team",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "about-1",
                  type: "about",
                  content: {
                    title: "About Our Company",
                    description:
                      "We provide innovative solutions to help your business grow and succeed in today's competitive market. Our team of experts has over 20 years of combined experience.",
                    image:
                      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=500&h=400&fit=crop",
                    stats: [
                      {
                        number: "500+",
                        label: "Happy Clients",
                      },
                      {
                        number: "10+",
                        label: "Years Experience",
                      },
                      {
                        number: "50+",
                        label: "Projects Completed",
                      },
                    ],
                  },
                },
                {
                  id: "footer-2",
                  type: "footer",
                  content: {
                    companyName: "BusinessPro",
                    description:
                      "Professional solutions for modern companies",
                    links: ["Privacy", "Terms", "Contact"],
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-3",
                  type: "navigation",
                  content: {
                    logo: "BusinessPro",
                    menuItems: [
                      "Home",
                      "About",
                      "Services",
                      "Team",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-1",
                  type: "services",
                  content: {
                    title: "Our Services",
                    description:
                      "We offer comprehensive business solutions",
                    services: [
                      {
                        name: "Business Consulting",
                        description:
                          "Strategic business consulting and planning",
                        price: "From $500",
                        image:
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=200&fit=crop",
                      },
                      {
                        name: "Software Development",
                        description:
                          "Custom software development solutions",
                        price: "From $2000",
                        image:
                          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=300&h=200&fit=crop",
                      },
                      {
                        name: "Digital Marketing",
                        description:
                          "Comprehensive digital marketing strategies",
                        price: "From $800",
                        image:
                          "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=300&h=200&fit=crop",
                      },
                      {
                        name: "Data Analytics",
                        description:
                          "Advanced data analysis and insights",
                        price: "From $1200",
                        image:
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300&h=200&fit=crop",
                      },
                    ],
                  },
                },
                {
                  id: "footer-3",
                  type: "footer",
                  content: {
                    companyName: "BusinessPro",
                    description:
                      "Professional solutions for modern companies",
                    links: ["Privacy", "Terms", "Contact"],
                  },
                },
              ],
            },
            {
              id: "team",
              name: "Team",
              path: "/team",
              sections: [
                {
                  id: "navigation-4",
                  type: "navigation",
                  content: {
                    logo: "BusinessPro",
                    menuItems: [
                      "Home",
                      "About",
                      "Services",
                      "Team",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "team-1",
                  type: "team",
                  content: {
                    title: "Meet Our Team",
                    description:
                      "Our experienced professionals are here to help you succeed",
                    members: [
                      {
                        name: "John Smith",
                        role: "CEO & Founder",
                        image:
                          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
                        bio: "With over 15 years of experience in business strategy",
                      },
                      {
                        name: "Sarah Johnson",
                        role: "Lead Developer",
                        image:
                          "https://images.unsplash.com/photo-1494790108755-2616b332c2f2?w=300&h=300&fit=crop",
                        bio: "Expert in full-stack development and system architecture",
                      },
                      {
                        name: "Michael Brown",
                        role: "Marketing Director",
                        image:
                          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
                        bio: "Specializes in digital marketing and brand strategy",
                      },
                      {
                        name: "Emily Davis",
                        role: "Data Analyst",
                        image:
                          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop",
                        bio: "Expert in data science and business intelligence",
                      },
                    ],
                  },
                },
                {
                  id: "footer-4",
                  type: "footer",
                  content: {
                    companyName: "BusinessPro",
                    description:
                      "Professional solutions for modern companies",
                    links: ["Privacy", "Terms", "Contact"],
                  },
                },
              ],
            },
            {
              id: "contact",
              name: "Contact",
              path: "/contact",
              sections: [
                {
                  id: "navigation-5",
                  type: "navigation",
                  content: {
                    logo: "BusinessPro",
                    menuItems: [
                      "Home",
                      "About",
                      "Services",
                      "Team",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "contact-1",
                  type: "contact",
                  content: {
                    title: "Get In Touch",
                    description:
                      "Ready to transform your business? Contact us today",
                    address:
                      "123 Business Street, Suite 100\nNew York, NY 10001",
                    phone: "+1 (555) 123-4567",
                    email: "hello@businesspro.com",
                    hours: "Mon-Fri: 9AM-6PM",
                  },
                },
                {
                  id: "footer-5",
                  type: "footer",
                  content: {
                    companyName: "BusinessPro",
                    description:
                      "Professional solutions for modern companies",
                    links: ["Privacy", "Terms", "Contact"],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "2",
        title: "Creative Portfolio",
        description: "Showcase your creative work beautifully",
        category: "Portfolio",
        thumbnail:
          "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Alex Creative",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-2",
                  type: "hero",
                  content: {
                    title: "Creative Designer",
                    subtitle:
                      "Bringing ideas to life through design",
                    buttonText: "View Portfolio",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=600&fit=crop",
                  },
                },
                {
                  id: "portfolio-preview",
                  type: "portfolio",
                  content: {
                    title: "Featured Work",
                    description:
                      "A selection of my recent projects",
                    projects: [
                      {
                        title: "Brand Identity",
                        category: "Branding",
                        image:
                          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Web Design",
                        category: "Digital",
                        image:
                          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Print Design",
                        category: "Print",
                        image:
                          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "portfolio",
              name: "Portfolio",
              path: "/portfolio",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Alex Creative",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-1",
                  type: "gallery",
                  content: {
                    title: "My Work",
                    description:
                      "Explore my creative projects across different mediums",
                    items: [
                      {
                        title: "Corporate Branding",
                        category: "Branding",
                        image:
                          "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=400&h=300&fit=crop",
                        description:
                          "Complete brand identity for tech startup",
                      },
                      {
                        title: "E-commerce Website",
                        category: "Web Design",
                        image:
                          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop",
                        description:
                          "Modern e-commerce platform design",
                      },
                      {
                        title: "Magazine Layout",
                        category: "Print",
                        image:
                          "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
                        description:
                          "Editorial design for lifestyle magazine",
                      },
                      {
                        title: "Mobile App UI",
                        category: "Digital",
                        image:
                          "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=300&fit=crop",
                        description:
                          "Intuitive mobile application interface",
                      },
                      {
                        title: "Packaging Design",
                        category: "Product",
                        image:
                          "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
                        description:
                          "Sustainable packaging solutions",
                      },
                      {
                        title: "Logo Collection",
                        category: "Branding",
                        image:
                          "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
                        description:
                          "Various logo designs for different clients",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "about",
              name: "About",
              path: "/about",
              sections: [
                {
                  id: "navigation-3",
                  type: "navigation",
                  content: {
                    logo: "Alex Creative",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "about-2",
                  type: "about",
                  content: {
                    title: "About Me",
                    description:
                      "I'm a passionate creative designer with 8+ years of experience in branding, web design, and visual communication. I believe in creating designs that not only look beautiful but also tell meaningful stories.",
                    image:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop",
                    skills: [
                      "Graphic Design",
                      "Web Design",
                      "Branding",
                      "Photography",
                      "Illustration",
                      "Motion Graphics",
                    ],
                  },
                },
              ],
            },
            {
              id: "contact",
              name: "Contact",
              path: "/contact",
              sections: [
                {
                  id: "navigation-4",
                  type: "navigation",
                  content: {
                    logo: "Alex Creative",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "contact-2",
                  type: "contact",
                  content: {
                    title: "Let's Work Together",
                    description:
                      "Have a project in mind? I'd love to hear about it",
                    email: "hello@alexcreative.com",
                    phone: "+1 (555) 987-6543",
                    social: [
                      "Instagram",
                      "Behance",
                      "Dribbble",
                      "LinkedIn",
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "3",
        title: "Restaurant Menu",
        description:
          "Perfect for restaurants and food businesses",
        category: "Restaurant",
        thumbnail:
          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Bella Vista",
                    menuItems: [
                      "Home",
                      "Menu",
                      "About",
                      "Locations",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-3",
                  type: "hero",
                  content: {
                    title: "Delicious Dining Experience",
                    subtitle:
                      "Fresh ingredients, exceptional flavors",
                    buttonText: "View Menu",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=600&fit=crop",
                  },
                },
                {
                  id: "features-2",
                  type: "features",
                  content: {
                    title: "Why Choose Bella Vista",
                    features: [
                      {
                        icon: "ðŸŒ±",
                        title: "Fresh Ingredients",
                        description:
                          "Locally sourced, organic produce",
                      },
                      {
                        icon: "ðŸ‘¨â€ðŸ³",
                        title: "Expert Chefs",
                        description:
                          "Award-winning culinary team",
                      },
                      {
                        icon: "ðŸ†",
                        title: "Fine Dining",
                        description:
                          "Elegant atmosphere and service",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "menu",
              name: "Menu",
              path: "/menu",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Bella Vista",
                    menuItems: [
                      "Home",
                      "Menu",
                      "About",
                      "Locations",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "menu-1",
                  type: "menu",
                  content: {
                    title: "Our Menu",
                    description:
                      "Carefully crafted dishes made with the finest ingredients",
                    categories: [
                      {
                        name: "Appetizers",
                        items: [
                          {
                            name: "Bruschetta Trio",
                            description:
                              "Three varieties of our signature bruschetta",
                            price: "$14",
                          },
                          {
                            name: "Burrata Caprese",
                            description:
                              "Fresh burrata with heirloom tomatoes",
                            price: "$18",
                          },
                          {
                            name: "Crispy Calamari",
                            description:
                              "With spicy marinara sauce",
                            price: "$16",
                          },
                        ],
                      },
                      {
                        name: "Main Courses",
                        items: [
                          {
                            name: "Osso Buco",
                            description:
                              "Braised veal shank with risotto milanese",
                            price: "$38",
                          },
                          {
                            name: "Grilled Branzino",
                            description:
                              "Mediterranean sea bass with lemon herbs",
                            price: "$32",
                          },
                          {
                            name: "Ribeye Steak",
                            description:
                              "16oz dry-aged with truffle butter",
                            price: "$45",
                          },
                        ],
                      },
                      {
                        name: "Desserts",
                        items: [
                          {
                            name: "Tiramisu",
                            description:
                              "Classic Italian dessert",
                            price: "$12",
                          },
                          {
                            name: "Panna Cotta",
                            description:
                              "Vanilla bean with berry compote",
                            price: "$10",
                          },
                          {
                            name: "Gelato Selection",
                            description:
                              "Three scoops of artisanal gelato",
                            price: "$8",
                          },
                        ],
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "about",
              name: "About",
              path: "/about",
              sections: [
                {
                  id: "navigation-3",
                  type: "navigation",
                  content: {
                    logo: "Bella Vista",
                    menuItems: [
                      "Home",
                      "Menu",
                      "About",
                      "Locations",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "about-3",
                  type: "about",
                  content: {
                    title: "Our Story",
                    description:
                      "Founded in 1995, Bella Vista has been serving authentic Italian cuisine with a modern twist. Our passion for food and commitment to quality has made us a beloved destination for food lovers.",
                    image:
                      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&h=400&fit=crop",
                    chef: {
                      name: "Chef Marco Rossi",
                      bio: "With over 20 years of experience in Michelin-starred restaurants",
                      image:
                        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop",
                    },
                  },
                },
              ],
            },
            {
              id: "locations",
              name: "Locations",
              path: "/locations",
              sections: [
                {
                  id: "navigation-4",
                  type: "navigation",
                  content: {
                    logo: "Bella Vista",
                    menuItems: [
                      "Home",
                      "Menu",
                      "About",
                      "Locations",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "locations-1",
                  type: "locations",
                  content: {
                    title: "Visit Us",
                    locations: [
                      {
                        name: "Downtown Location",
                        address:
                          "123 Main Street\nDowntown, NY 10001",
                        phone: "(555) 123-4567",
                        hours:
                          "Mon-Thu: 5PM-10PM\nFri-Sat: 5PM-11PM\nSun: 4PM-9PM",
                        image:
                          "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
                      },
                      {
                        name: "Waterfront Location",
                        address:
                          "456 Harbor View\nWaterfront, NY 10002",
                        phone: "(555) 765-4321",
                        hours: "Daily: 4PM-10PM",
                        image:
                          "https://images.unsplash.com/photo-1552566565-ad4becc81211?w=400&h=300&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "contact",
              name: "Contact",
              path: "/contact",
              sections: [
                {
                  id: "navigation-5",
                  type: "navigation",
                  content: {
                    logo: "Bella Vista",
                    menuItems: [
                      "Home",
                      "Menu",
                      "About",
                      "Locations",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "contact-3",
                  type: "contact",
                  content: {
                    title: "Make a Reservation",
                    description:
                      "Book your table for an unforgettable dining experience",
                    phone: "+1 (555) 123-4567",
                    email: "reservations@bellavista.com",
                    reservationNote:
                      "We recommend booking 24 hours in advance",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "4",
        title: "Tech Startup",
        description: "Modern template for technology companies",
        category: "Technology",
        thumbnail:
          "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "TechFlow",
                    menuItems: [
                      "Home",
                      "Product",
                      "Pricing",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-4",
                  type: "hero",
                  content: {
                    title: "Innovation at Scale",
                    subtitle:
                      "Building the future with cutting-edge technology",
                    buttonText: "Get Started Free",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&h=600&fit=crop",
                  },
                },
                {
                  id: "features-3",
                  type: "features",
                  content: {
                    title: "Powerful Features",
                    features: [
                      {
                        icon: "ðŸš€",
                        title: "Lightning Fast",
                        description:
                          "Optimized for speed and performance",
                      },
                      {
                        icon: "ðŸ”’",
                        title: "Secure by Design",
                        description:
                          "Enterprise-grade security built-in",
                      },
                      {
                        icon: "ðŸ“Š",
                        title: "Real-time Analytics",
                        description:
                          "Comprehensive insights and reporting",
                      },
                      {
                        icon: "ðŸ”§",
                        title: "Easy Integration",
                        description:
                          "Connect with your existing tools",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "product",
              name: "Product",
              path: "/product",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "TechFlow",
                    menuItems: [
                      "Home",
                      "Product",
                      "Pricing",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "features-4",
                  type: "features",
                  content: {
                    title: "Product Features",
                    description:
                      "Everything you need to scale your business",
                    features: [
                      {
                        icon: "ðŸŽ¯",
                        title: "Smart Dashboard",
                        description:
                          "Intuitive interface with customizable widgets and real-time data visualization",
                      },
                      {
                        icon: "ðŸ¤–",
                        title: "AI-Powered Insights",
                        description:
                          "Machine learning algorithms that provide actionable business intelligence",
                      },
                      {
                        icon: "ðŸ“±",
                        title: "Mobile First",
                        description:
                          "Responsive design that works perfectly on all devices and platforms",
                      },
                      {
                        icon: "ðŸ”„",
                        title: "Automated Workflows",
                        description:
                          "Streamline your processes with intelligent automation and triggers",
                      },
                      {
                        icon: "ðŸŒ",
                        title: "Global Scalability",
                        description:
                          "Built to handle millions of users with 99.9% uptime guarantee",
                      },
                      {
                        icon: "ðŸ“ˆ",
                        title: "Advanced Reports",
                        description:
                          "Comprehensive analytics with exportable reports and custom metrics",
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "pricing",
              name: "Pricing",
              path: "/pricing",
              sections: [
                {
                  id: "navigation-3",
                  type: "navigation",
                  content: {
                    logo: "TechFlow",
                    menuItems: [
                      "Home",
                      "Product",
                      "Pricing",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "pricing-1",
                  type: "pricing",
                  content: {
                    title: "Simple, Transparent Pricing",
                    description:
                      "Choose the plan that fits your needs",
                    plans: [
                      {
                        name: "Starter",
                        price: "$29",
                        period: "/month",
                        features: [
                          "Up to 10 users",
                          "Basic analytics",
                          "Email support",
                          "1GB storage",
                        ],
                        popular: false,
                      },
                      {
                        name: "Professional",
                        price: "$79",
                        period: "/month",
                        features: [
                          "Up to 50 users",
                          "Advanced analytics",
                          "Priority support",
                          "10GB storage",
                          "API access",
                        ],
                        popular: true,
                      },
                      {
                        name: "Enterprise",
                        price: "$199",
                        period: "/month",
                        features: [
                          "Unlimited users",
                          "Custom analytics",
                          "24/7 support",
                          "Unlimited storage",
                          "White-label options",
                        ],
                        popular: false,
                      },
                    ],
                  },
                },
              ],
            },
            {
              id: "about",
              name: "About",
              path: "/about",
              sections: [
                {
                  id: "navigation-4",
                  type: "navigation",
                  content: {
                    logo: "TechFlow",
                    menuItems: [
                      "Home",
                      "Product",
                      "Pricing",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "about-4",
                  type: "about",
                  content: {
                    title: "About TechFlow",
                    description:
                      "We're on a mission to democratize access to powerful business tools. Founded in 2020, TechFlow has helped over 10,000 companies streamline their operations.",
                    image:
                      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop",
                    stats: [
                      {
                        number: "10K+",
                        label: "Happy Customers",
                      },
                      { number: "99.9%", label: "Uptime" },
                      { number: "24/7", label: "Support" },
                    ],
                  },
                },
              ],
            },
            {
              id: "contact",
              name: "Contact",
              path: "/contact",
              sections: [
                {
                  id: "navigation-5",
                  type: "navigation",
                  content: {
                    logo: "TechFlow",
                    menuItems: [
                      "Home",
                      "Product",
                      "Pricing",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "contact-4",
                  type: "contact",
                  content: {
                    title: "Get in Touch",
                    description:
                      "Ready to transform your business? Let's talk",
                    email: "hello@techflow.com",
                    phone: "+1 (555) 234-5678",
                    address:
                      "456 Tech Avenue\nSan Francisco, CA 94107",
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "5",
        title: "Fashion Brand",
        description:
          "Elegant template for fashion and lifestyle brands",
        category: "Fashion",
        thumbnail:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "LUXE",
                    menuItems: [
                      "Home",
                      "Collections",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-5",
                  type: "hero",
                  content: {
                    title: "Style Redefined",
                    subtitle:
                      "Discover the latest in fashion and lifestyle",
                    buttonText: "Shop Collection",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "collections",
              name: "Collections",
              path: "/collections",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "LUXE",
                    menuItems: [
                      "Home",
                      "Collections",
                      "About",
                      "Blog",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-2",
                  type: "gallery",
                  content: {
                    title: "Latest Collections",
                    items: [
                      {
                        title: "Summer Essentials",
                        category: "Women",
                        image:
                          "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=500&fit=crop",
                      },
                      {
                        title: "Urban Streetwear",
                        category: "Men",
                        image:
                          "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=400&h=500&fit=crop",
                      },
                      {
                        title: "Luxury Accessories",
                        category: "Accessories",
                        image:
                          "https://images.unsplash.com/photo-1553062407-98eeb64c6674?w=400&h=500&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "6",
        title: "Real Estate",
        description:
          "Professional template for real estate agencies",
        category: "Real Estate",
        thumbnail:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Prime Properties",
                    menuItems: [
                      "Home",
                      "Properties",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-6",
                  type: "hero",
                  content: {
                    title: "Find Your Dream Home",
                    subtitle:
                      "Premium properties in prime locations",
                    buttonText: "Browse Properties",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "properties",
              name: "Properties",
              path: "/properties",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Prime Properties",
                    menuItems: [
                      "Home",
                      "Properties",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-3",
                  type: "gallery",
                  content: {
                    title: "Featured Properties",
                    items: [
                      {
                        title: "Modern Downtown Condo",
                        category: "Condo",
                        image:
                          "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=300&fit=crop",
                        description: "$750,000 â€¢ 2 bed, 2 bath",
                      },
                      {
                        title: "Suburban Family Home",
                        category: "House",
                        image:
                          "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
                        description: "$850,000 â€¢ 4 bed, 3 bath",
                      },
                      {
                        title: "Luxury Penthouse",
                        category: "Penthouse",
                        image:
                          "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop",
                        description:
                          "$1,500,000 â€¢ 3 bed, 2 bath",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "7",
        title: "Health & Wellness",
        description:
          "Clean template for health and wellness businesses",
        category: "Health",
        thumbnail:
          "https://images.unsplash.com/photo-1704223523169-52feeed90365?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Wellness Center",
                    menuItems: [
                      "Home",
                      "Services",
                      "Programs",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-7",
                  type: "hero",
                  content: {
                    title: "Your Health Journey Starts Here",
                    subtitle:
                      "Comprehensive wellness solutions for a better life",
                    buttonText: "Book Consultation",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1704223523169-52feeed90365?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Wellness Center",
                    menuItems: [
                      "Home",
                      "Services",
                      "Programs",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-2",
                  type: "services",
                  content: {
                    title: "Our Services",
                    services: [
                      {
                        name: "Nutrition Counseling",
                        description:
                          "Personalized nutrition plans",
                        price: "From $150",
                      },
                      {
                        name: "Fitness Training",
                        description:
                          "One-on-one personal training",
                        price: "From $75",
                      },
                      {
                        name: "Wellness Coaching",
                        description:
                          "Holistic lifestyle coaching",
                        price: "From $200",
                      },
                      {
                        name: "Meditation Classes",
                        description:
                          "Group and private sessions",
                        price: "From $30",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "8",
        title: "Educational Platform",
        description: "Perfect for online courses and education",
        category: "Education",
        thumbnail:
          "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "EduFlow",
                    menuItems: [
                      "Home",
                      "Courses",
                      "Instructors",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-8",
                  type: "hero",
                  content: {
                    title: "Learn Without Limits",
                    subtitle:
                      "Access thousands of courses from expert instructors",
                    buttonText: "Start Learning",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "courses",
              name: "Courses",
              path: "/courses",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "EduFlow",
                    menuItems: [
                      "Home",
                      "Courses",
                      "Instructors",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-4",
                  type: "gallery",
                  content: {
                    title: "Popular Courses",
                    items: [
                      {
                        title: "Web Development Bootcamp",
                        category: "Programming",
                        image:
                          "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop",
                        description: "12 weeks â€¢ $899",
                      },
                      {
                        title: "Digital Marketing Mastery",
                        category: "Marketing",
                        image:
                          "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400&h=300&fit=crop",
                        description: "8 weeks â€¢ $599",
                      },
                      {
                        title: "Data Science Fundamentals",
                        category: "Data",
                        image:
                          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop",
                        description: "10 weeks â€¢ $799",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "9",
        title: "Event Planning",
        description: "Beautiful template for event planners",
        category: "Events",
        thumbnail:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Elegant Events",
                    menuItems: [
                      "Home",
                      "Services",
                      "Gallery",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-9",
                  type: "hero",
                  content: {
                    title: "Unforgettable Events",
                    subtitle:
                      "Creating magical moments for every occasion",
                    buttonText: "Plan Your Event",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Elegant Events",
                    menuItems: [
                      "Home",
                      "Services",
                      "Gallery",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-3",
                  type: "services",
                  content: {
                    title: "Event Services",
                    services: [
                      {
                        name: "Wedding Planning",
                        description:
                          "Complete wedding coordination",
                        price: "From $3000",
                      },
                      {
                        name: "Corporate Events",
                        description:
                          "Professional business gatherings",
                        price: "From $2000",
                      },
                      {
                        name: "Birthday Parties",
                        description:
                          "Memorable birthday celebrations",
                        price: "From $800",
                      },
                      {
                        name: "Anniversary Celebrations",
                        description: "Special milestone events",
                        price: "From $1500",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "10",
        title: "Fitness Studio",
        description:
          "Dynamic template for fitness and gym businesses",
        category: "Fitness",
        thumbnail:
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "FitLife Studio",
                    menuItems: [
                      "Home",
                      "Classes",
                      "Trainers",
                      "Membership",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-10",
                  type: "hero",
                  content: {
                    title: "Transform Your Body",
                    subtitle:
                      "Professional training for lasting results",
                    buttonText: "Start Your Journey",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "classes",
              name: "Classes",
              path: "/classes",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "FitLife Studio",
                    menuItems: [
                      "Home",
                      "Classes",
                      "Trainers",
                      "Membership",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-4",
                  type: "services",
                  content: {
                    title: "Fitness Classes",
                    services: [
                      {
                        name: "HIIT Training",
                        description:
                          "High-intensity interval training",
                        price: "$25/class",
                      },
                      {
                        name: "Yoga Flow",
                        description:
                          "Mindful movement and flexibility",
                        price: "$20/class",
                      },
                      {
                        name: "Strength Training",
                        description: "Build muscle and power",
                        price: "$30/class",
                      },
                      {
                        name: "Cardio Blast",
                        description:
                          "Heart-pumping cardio workout",
                        price: "$22/class",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "11",
        title: "Travel Agency",
        description:
          "Inspiring template for travel and tourism",
        category: "Travel",
        thumbnail:
          "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Wanderlust Travel",
                    menuItems: [
                      "Home",
                      "Destinations",
                      "Packages",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-11",
                  type: "hero",
                  content: {
                    title: "Explore the World",
                    subtitle:
                      "Discover amazing destinations and create memories",
                    buttonText: "Book Your Adventure",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "destinations",
              name: "Destinations",
              path: "/destinations",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Wanderlust Travel",
                    menuItems: [
                      "Home",
                      "Destinations",
                      "Packages",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-5",
                  type: "gallery",
                  content: {
                    title: "Popular Destinations",
                    items: [
                      {
                        title: "Tropical Paradise",
                        category: "Beach",
                        image:
                          "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
                        description: "From $1299/person",
                      },
                      {
                        title: "Mountain Adventure",
                        category: "Adventure",
                        image:
                          "https://images.unsplash.com/photo-1464822759844-d150baed4e0d?w=400&h=300&fit=crop",
                        description: "From $899/person",
                      },
                      {
                        title: "Cultural Explorer",
                        category: "Culture",
                        image:
                          "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?w=400&h=300&fit=crop",
                        description: "From $1599/person",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "12",
        title: "Law Firm",
        description: "Professional template for legal services",
        category: "Legal",
        thumbnail:
          "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Justice & Associates",
                    menuItems: [
                      "Home",
                      "Practice Areas",
                      "Attorneys",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-12",
                  type: "hero",
                  content: {
                    title: "Expert Legal Counsel",
                    subtitle:
                      "Protecting your rights with experienced representation",
                    buttonText: "Free Consultation",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "practice-areas",
              name: "Practice Areas",
              path: "/practice-areas",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Justice & Associates",
                    menuItems: [
                      "Home",
                      "Practice Areas",
                      "Attorneys",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-5",
                  type: "services",
                  content: {
                    title: "Practice Areas",
                    services: [
                      {
                        name: "Personal Injury",
                        description:
                          "Compensation for accidents and injuries",
                      },
                      {
                        name: "Family Law",
                        description:
                          "Divorce, custody, and family matters",
                      },
                      {
                        name: "Criminal Defense",
                        description:
                          "Defending your rights in criminal cases",
                      },
                      {
                        name: "Business Law",
                        description:
                          "Corporate legal services and contracts",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "13",
        title: "Photography Studio",
        description: "Stunning template for photographers",
        category: "Photography",
        thumbnail:
          "https://images.unsplash.com/photo-1554048612-b6a482b224b7?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Lens & Light",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-13",
                  type: "hero",
                  content: {
                    title: "Capturing Life's Moments",
                    subtitle:
                      "Professional photography for every occasion",
                    buttonText: "View Portfolio",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1554048612-b6a482b224b7?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "portfolio",
              name: "Portfolio",
              path: "/portfolio",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Lens & Light",
                    menuItems: [
                      "Home",
                      "Portfolio",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-6",
                  type: "gallery",
                  content: {
                    title: "Photography Portfolio",
                    items: [
                      {
                        title: "Wedding Photography",
                        category: "Weddings",
                        image:
                          "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Portrait Sessions",
                        category: "Portraits",
                        image:
                          "https://images.unsplash.com/photo-1494790108755-2616b332c2f2?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Event Photography",
                        category: "Events",
                        image:
                          "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=300&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "14",
        title: "Consulting Firm",
        description:
          "Corporate template for consulting businesses",
        category: "Consulting",
        thumbnail:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Strategic Advisors",
                    menuItems: [
                      "Home",
                      "Services",
                      "Industries",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-14",
                  type: "hero",
                  content: {
                    title: "Strategic Solutions",
                    subtitle:
                      "Expert consulting to drive your business forward",
                    buttonText: "Get Started",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Strategic Advisors",
                    menuItems: [
                      "Home",
                      "Services",
                      "Industries",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-6",
                  type: "services",
                  content: {
                    title: "Consulting Services",
                    services: [
                      {
                        name: "Strategy Development",
                        description:
                          "Long-term strategic planning",
                      },
                      {
                        name: "Operations Optimization",
                        description:
                          "Streamline business processes",
                      },
                      {
                        name: "Digital Transformation",
                        description:
                          "Technology-driven solutions",
                      },
                      {
                        name: "Change Management",
                        description:
                          "Navigate organizational change",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "15",
        title: "Art Gallery",
        description:
          "Elegant template for artists and galleries",
        category: "Art",
        thumbnail:
          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Artisan Gallery",
                    menuItems: [
                      "Home",
                      "Exhibitions",
                      "Artists",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-15",
                  type: "hero",
                  content: {
                    title: "Contemporary Art Collection",
                    subtitle:
                      "Discover exceptional works from talented artists",
                    buttonText: "Explore Gallery",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "exhibitions",
              name: "Exhibitions",
              path: "/exhibitions",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Artisan Gallery",
                    menuItems: [
                      "Home",
                      "Exhibitions",
                      "Artists",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-7",
                  type: "gallery",
                  content: {
                    title: "Current Exhibitions",
                    items: [
                      {
                        title: "Modern Abstracts",
                        category: "Abstract",
                        image:
                          "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Urban Landscapes",
                        category: "Photography",
                        image:
                          "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Sculptural Forms",
                        category: "Sculpture",
                        image:
                          "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=400&h=300&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "16",
        title: "Music Studio",
        description:
          "Creative template for musicians and studios",
        category: "Music",
        thumbnail:
          "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "SoundWave Studios",
                    menuItems: [
                      "Home",
                      "Services",
                      "Artists",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-16",
                  type: "hero",
                  content: {
                    title: "Sound That Moves You",
                    subtitle:
                      "Professional recording and music production",
                    buttonText: "Book Studio Time",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "SoundWave Studios",
                    menuItems: [
                      "Home",
                      "Services",
                      "Artists",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-7",
                  type: "services",
                  content: {
                    title: "Studio Services",
                    services: [
                      {
                        name: "Recording Sessions",
                        description:
                          "Professional recording in our state-of-the-art studio",
                        price: "$150/hour",
                      },
                      {
                        name: "Music Production",
                        description:
                          "Full production services from concept to master",
                        price: "From $2000",
                      },
                      {
                        name: "Mixing & Mastering",
                        description:
                          "Professional mixing and mastering services",
                        price: "$300/song",
                      },
                      {
                        name: "Voice-Over Recording",
                        description:
                          "Crystal clear voice recording for all purposes",
                        price: "$100/hour",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "17",
        title: "Architecture Firm",
        description:
          "Modern template for architects and designers",
        category: "Architecture",
        thumbnail:
          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Modern Design Studio",
                    menuItems: [
                      "Home",
                      "Projects",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-17",
                  type: "hero",
                  content: {
                    title: "Designing the Future",
                    subtitle:
                      "Innovative architecture for modern living",
                    buttonText: "View Projects",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "projects",
              name: "Projects",
              path: "/projects",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Modern Design Studio",
                    menuItems: [
                      "Home",
                      "Projects",
                      "Services",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "gallery-8",
                  type: "gallery",
                  content: {
                    title: "Featured Projects",
                    items: [
                      {
                        title: "Residential Complex",
                        category: "Residential",
                        image:
                          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Office Tower",
                        category: "Commercial",
                        image:
                          "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
                      },
                      {
                        title: "Cultural Center",
                        category: "Public",
                        image:
                          "https://images.unsplash.com/photo-1487958449943-2429e8be8625?w=400&h=300&fit=crop",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
      {
        id: "18",
        title: "Digital Agency",
        description:
          "Contemporary template for digital agencies",
        category: "Digital",
        thumbnail:
          "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        previewUrl: "",
        content: {
          pages: [
            {
              id: "home",
              name: "Home",
              path: "/",
              sections: [
                {
                  id: "navigation-1",
                  type: "navigation",
                  content: {
                    logo: "Digital Innovators",
                    menuItems: [
                      "Home",
                      "Services",
                      "Work",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "hero-18",
                  type: "hero",
                  content: {
                    title: "Digital Excellence",
                    subtitle:
                      "Transforming brands through digital innovation",
                    buttonText: "See Our Work",
                    backgroundImage:
                      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop",
                  },
                },
              ],
            },
            {
              id: "services",
              name: "Services",
              path: "/services",
              sections: [
                {
                  id: "navigation-2",
                  type: "navigation",
                  content: {
                    logo: "Digital Innovators",
                    menuItems: [
                      "Home",
                      "Services",
                      "Work",
                      "About",
                      "Contact",
                    ],
                  },
                },
                {
                  id: "services-8",
                  type: "services",
                  content: {
                    title: "Digital Services",
                    services: [
                      {
                        name: "Web Development",
                        description:
                          "Custom websites and web applications",
                      },
                      {
                        name: "Brand Design",
                        description:
                          "Complete brand identity and design systems",
                      },
                      {
                        name: "Digital Marketing",
                        description:
                          "SEO, PPC, and social media marketing",
                      },
                      {
                        name: "Mobile Apps",
                        description:
                          "Native and cross-platform mobile applications",
                      },
                    ],
                  },
                },
              ],
            },
          ],
        },
      },
    ];

