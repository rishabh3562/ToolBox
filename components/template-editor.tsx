'use client';

import { useState } from 'react';
import { Template, Variable } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { TemplateService } from '@/lib/db/services/templateService';

interface TemplateEditorProps {
  template: Template;
  variables: Variable[];
}

export function TemplateEditor({ template, variables }: TemplateEditorProps) {
  const [content, setContent] = useState(template.content);
  const [category, setCategory] = useState(template.category);
  const [tags, setTags] = useState(template.tags.join(', '));
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(null);
      await TemplateService.updateTemplate(template.id, {
        content,
        category,
        tags: tags.split(',').map(t => t.trim()),
      });
      setSuccess('Template saved successfully!');
    } catch (err) {
      setError('Failed to save template.');
    }
  };

  const generateContent = () => {
    let result = content;
    variables.forEach((variable) => {
      const regex = new RegExp(`{{${variable.key}}}`, 'g');
      result = result.replace(regex, variable.value || `[${variable.label}]`);
    });
    return result;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateContent());
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">{template.name}</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Category"
          />
          <Input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="Tags (comma-separated)"
          />
        </div>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[200px] font-mono"
        />
        <div className="space-y-4">
          <h4 className="font-medium">Preview:</h4>
          <div className="p-4 rounded-md bg-muted whitespace-pre-wrap">
            {generateContent()}
          </div>
          <div className="flex gap-4">
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </div>
      </div>
    </Card>
  );
}