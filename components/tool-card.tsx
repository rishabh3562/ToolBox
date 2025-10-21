import { Tool } from '@/types/tool';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as Icons from 'lucide-react';

interface ToolCardProps {
  tool: Tool;
}

export function ToolCard({ tool }: ToolCardProps) {
  const Icon = Icons[tool.icon as keyof typeof Icons] as React.ComponentType<{ className?: string }>;

  return (
    <Card className="p-6 flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-primary/10 rounded-lg">
          {Icon && <Icon className="h-6 w-6 text-primary" />}
        </div>
      </div>
      <h3 className="text-lg font-semibold mb-2">{tool.name}</h3>
      <p className="text-muted-foreground flex-grow mb-4">{tool.description}</p>
      <Link href={tool.path} className="block">
        <Button className="w-full">Open Tool</Button>
      </Link>
    </Card>
  );
}