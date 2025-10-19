export type PlatformType = 'youtube' | 'linkedin' | 'instagram' | 'twitter' | 'github' | 'medium';

export interface Profile {
  id: string;
  name: string;
  handle: string;
  platform: PlatformType;
  imageUrl?: string;
  description: string;
  categories: string[];
  favoriteContent: FavoriteContent[];
  url: string;
  createdAt: string;
  updatedAt: string;
}

export interface FavoriteContent {
  id: string;
  title: string;
  url: string;
  type: 'video' | 'post' | 'article' | 'tweet' | 'reel';
  description?: string;
  addedAt: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color?: string;
}

export interface Platform {
  id: PlatformType;
  name: string;
  icon: string;
  color: string;
  baseUrl: string;
}