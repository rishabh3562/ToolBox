import { Tool } from '@/types/tool';
import { FileText, FileEdit, Github, Code, Database, Users } from 'lucide-react';

export const tools: Tool[] = [
  {
    id: 'template-manager',
    name: 'Template Manager',
    description: 'Create and manage professional templates with customizable variables',
    icon: 'FileText',
    path: '/tools/template-manager'
  },
  {
    id: 'markdown-editor',
    name: 'Markdown Editor',
    description: 'A powerful markdown editor with live preview and syntax highlighting',
    icon: 'FileEdit',
    path: '/tools/markdown-editor'
  },
  {
    id: 'github-helper',
    name: 'GitHub Project Helper',
    description: 'Generate professional GitHub repository descriptions, tags, and README files',
    icon: 'Github',
    path: '/tools/github-helper'
  },
  {
    id: 'snippet-library',
    name: 'Snippet Library',
    description: 'Store, organize, and manage your code snippets with powerful search and categorization',
    icon: 'Code',
    path: '/tools/snippet-library'
  },
  {
    id: 'schema-generator',
    name: 'Schema Generator',
    description: 'Generate database schemas from natural language descriptions using AI',
    icon: 'Database',
    path: '/tools/schema-generator'
  },
  {
    id: 'profile-tracker',
    name: 'Profile Tracker',
    description: 'Track and organize your favorite creators across different platforms',
    icon: 'Users',
    path: '/tools/profile-tracker'
  }
];