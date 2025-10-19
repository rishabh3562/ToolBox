'use client';

import { useState } from 'react';
import { Template, Variable } from '@/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

interface TemplateEditorProps {
  template: Template;
  variables: Variable[];
}

export function TemplateEditor({ template, variables }: TemplateEditorProps) {
  const [content, setContent] = useState(template.content);

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
          <Button onClick={copyToClipboard}>Copy to Clipboard</Button>
        </div>
      </div>
    </Card>
  );
}