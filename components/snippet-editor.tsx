'use client';

import { useState } from 'react';
import { Editor } from '@monaco-editor/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Copy, Save } from 'lucide-react';
import { Snippet } from '@/types/snippet';

interface SnippetEditorProps {
  snippet?: Snippet;
  onSave: (snippet: Partial<Snippet>) => void;
}

export function SnippetEditor({ snippet, onSave }: SnippetEditorProps) {
  const [code, setCode] = useState(snippet?.code || '');
  const [title, setTitle] = useState(snippet?.title || '');
  const [description, setDescription] = useState(snippet?.description || '');
  const [language, setLanguage] = useState(snippet?.language || 'javascript');
  const [documentation, setDocumentation] = useState(snippet?.documentation || '');

  const handleSave = () => {
    onSave({
      title,
      description,
      code,
      language,
      tags: [],
      documentation,
      updatedAt: new Date().toISOString()
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter snippet title"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter snippet description"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="typescript">TypeScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="sql">SQL</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Code</Label>
          <div className="border rounded-md overflow-hidden">
            <Editor
              height="300px"
              language={language}
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="documentation">Documentation (Markdown)</Label>
          <Textarea
            id="documentation"
            value={documentation}
            onChange={(e) => setDocumentation(e.target.value)}
            placeholder="Enter documentation in Markdown format"
            className="min-h-[100px]"
          />
        </div>

        <div className="flex gap-4">
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Save Snippet
          </Button>
          <Button variant="outline" onClick={copyToClipboard}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Code
          </Button>
        </div>
      </div>
    </Card>
  );
}