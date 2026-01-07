
export interface TeamMember {
  id: string;
  name: string;
  role: string;
  contact: string;
  avatar?: string;
  parentId?: string; // For hierarchy
}

export interface Achievement {
  id: string;
  title: string;
  type: 'award' | 'publication' | 'visit';
  date: string;
  description: string;
  imageUrl?: string;
}

export interface BIMFile {
  id: string;
  name: string;
  type: 'pdf' | 'dwg' | 'rvt' | 'nwd' | 'jpg' | 'doc' | 'xlsx' | 'mp4' | string;
  size: string;
  url: string; // Mock URL or Base64 Data URL
}

export interface Highlight {
  id: string;
  title: string;
  summary: string;
  fullDescription: string;
  thumbnail: string;
  images: string[];
  files: BIMFile[];
  technicalSpecs?: Record<string, string>;
  videoUrl?: string;
}

export interface HeroVideo {
  id: string;
  title: string;
  videoUrl: string; // Local blob URL or remote URL
  coverUrl: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface LocationSlide {
  id: number | string;
  image: string;
  title: string;
  description: string;
  iconName?: 'MapPin' | 'Layers' | 'User'; // Store icon name for persistence
}

export interface SiteSlide {
  id: number | string;
  image: string;
  tag: string;
  title: string;
  desc: string;
}

export interface AIConfig {
  provider: 'deepseek' | 'moonshot' | 'zhipu' | 'custom';
  providerName: string;
  apiKey: string;
  baseUrl: string;
  model: string;
  systemPrompt: string;
}