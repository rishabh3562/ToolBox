export interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  category: string;
  subCategory?: string;
  tags: string[];
  documentation?: string;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  parentId?: string;
  subCategories?: Category[];
}

export interface Tag {
  id: string;
  name: string;
  count: number;
}