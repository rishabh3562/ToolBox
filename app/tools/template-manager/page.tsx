'use client';

import { useState, useEffect } from 'react';
import { Template, Variable } from '@/types';
import { TemplateEditor } from '@/components/template-editor';
import { VariableForm } from '@/components/variable-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Spinner } from '@/components/ui/spinner';

export default function TemplateManagerPage() {
  const [variables, setVariables] = useState<Variable[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Initialize default data if needed
      const templatesRes = await fetch("/api/templates");
      const variablesRes = await fetch("/api/variables");
      const templatesData = await templatesRes.json();
      const variablesData = await variablesRes.json();


      setTemplates(templatesData);
      setVariables(variablesData);

      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleCreateTemplate = async () => {
    try {
      const res = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Untitled',
          category: 'blog',
          content: 'New content...',
        }),
      });
      const newTemplate = await res.json();
      setTemplates([newTemplate, ...templates]);
      setSelectedTemplate(newTemplate);
    } catch (error) {
      console.error('Error creating template:', error);
    }
  };

  const handleVariableChange = async (key: string, value: string) => {
    try {
      const variableToUpdate = variables.find(v => v.key === key);
      const res = await fetch(`/api/variables`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key,
          value,
          label: variableToUpdate?.label || '',
          description: variableToUpdate?.description,
        }),
      });
      const updatedVariable = await res.json();
      if (updatedVariable) {
        setVariables(variables.map((v) => (v.key === key ? updatedVariable : v)));
      }
    } catch (error) {
      console.error('Error updating variable:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" className="w-32 h-32 border-b-2" />
          <p className="mt-4 text-muted-foreground">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Template Manager</h1>
          <p className="text-muted-foreground">
            Create and manage your professional templates with ease
          </p>
        </div>
        <button onClick={handleCreateTemplate} className="btn btn-primary">
          + New Template
        </button>

        <div className="grid md:grid-cols-2 gap-8">
          <VariableForm
            variables={variables}
            onVariableChange={handleVariableChange}
          />

          <div className="space-y-6">
            {selectedTemplate && (
              <Tabs defaultValue={selectedTemplate.id}>
                <TabsList className="w-full">
                  {templates.map((template) => (
                    <TabsTrigger
                      key={template.id}
                      value={template.id}
                      onClick={() => setSelectedTemplate(template)}
                    >
                      {template.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {templates.map((template) => (
                  <TabsContent key={template.id} value={template.id}>
                    <TemplateEditor
                      template={template}
                      variables={variables}
                    />
                  </TabsContent>
                ))}
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}