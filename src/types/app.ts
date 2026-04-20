export type Page =
  | "landing"
  | "gallery"
  | "preview"
  | "editor"
  | "dashboard"
  | "published";

export type TemplateSectionType =
  | "hero"
  | "about"
  | "services"
  | "contact"
  | "footer"
  | "gallery"
  | "testimonials"
  | "team"
  | "pricing"
  | "features"
  | "blog"
  | "portfolio"
  | "menu"
  | "locations"
  | "faq"
  | "navigation";

export interface TemplateSection {
  id: string;
  type: TemplateSectionType;
  content: any;
  styles?: {
    background?: string;
    backgroundImage?: string;
    padding?: string;
    textAlign?: "left" | "center" | "right";
    backgroundColor?: string;
  };
  visibility?: {
    desktop: boolean;
    tablet: boolean;
    mobile: boolean;
  };
  locked?: boolean;
}

export interface TemplatePage {
  id: string;
  name: string;
  path: string;
  sections: TemplateSection[];
}

export interface TemplateContent {
  pages: TemplatePage[];
  globalStyles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    buttonStyle?: string;
  };
}

export interface Template {
  id: string;
  title: string;
  description: string;
  category: string;
  thumbnail: string;
  previewUrl: string;
  content: TemplateContent;
}

export interface UserProject {
  id: string;
  name: string;
  templateId: string;
  content: TemplateContent;
  lastModified: string;
  isPublished: boolean;
  publishUrl?: string;
}
