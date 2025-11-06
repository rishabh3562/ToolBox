export interface Template {
  id: string;
  userId?: string;
  name: string;
  category: string;
  content: string;
  tags: string[];
}

export interface Variable {
  userId?: string;
  key: string;
  value: string;
  label: string;
  description?: string;
}

export interface GeneratedContent {
  templateId: string;
  content: string;
  variables: Record<string, string>;
}
