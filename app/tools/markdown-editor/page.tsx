"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Copy } from "lucide-react";

const defaultMarkdown = `# Welcome to the Markdown Editor

## Features

- **Live Preview**: See your changes in real-time
- **GitHub Flavored Markdown**: Tables, task lists, and more
- **Syntax Highlighting**: For code blocks
- **Responsive Design**: Works on all devices

## Example Table

| Feature | Description |
|---------|-------------|
| Preview | Real-time markdown preview |
| Export | Copy to clipboard |
| GFM | GitHub Flavored Markdown |

## Code Example

\`\`\`javascript
function hello() {
  console.log('Hello, World!');
}
\`\`\`

## Task List

- [x] Create markdown editor
- [x] Add live preview
- [ ] Add more features

> This is a blockquote. You can use it to highlight important information.
`;

export default function MarkdownEditorPage() {
  const [markdown, setMarkdown] = useState(defaultMarkdown);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Markdown Editor</h1>
          <p className="text-muted-foreground">
            A powerful markdown editor with live preview
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Editor</h2>
              <Button variant="outline" size="sm" onClick={copyToClipboard}>
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
            </div>
            <Textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="min-h-[600px] font-mono"
              placeholder="Enter your markdown here..."
            />
          </Card>

          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Preview</h2>
            <div className="prose prose-sm dark:prose-invert max-w-none min-h-[600px] p-4 rounded-md bg-muted/50">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {markdown}
              </ReactMarkdown>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
