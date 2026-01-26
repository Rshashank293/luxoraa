
export enum ViewType {
  HOME = 'HOME',
  CONCIERGE = 'CONCIERGE',
  VISUALS = 'VISUALS',
  CINEMA = 'CINEMA',
  VOICE = 'VOICE',
  LIFESTYLE = 'LIFESTYLE'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  sources?: Array<{ title: string; uri: string }>;
}

export interface LifestyleData {
  category: string;
  value: number;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: Date;
}

export interface GeneratedVideo {
  url: string;
  prompt: string;
  timestamp: Date;
}
