'use client';

import { useState, useEffect } from 'react';
import { TemplateService } from '@/lib/db/services/templateService';
import { VariableService } from '@/lib/db/services/variableService';
import { Template, Variable } from '@/types';
import { TemplateEditor } from '@/components/template-editor';
import { VariableForm } from '@/components/variable-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      await TemplateService.initializeDefaultTemplates();
      await VariableService.initializeDefaultVariables();

      // Load data
      const [templatesData, variablesData] = await Promise.all([
        TemplateService.getAllTemplates(),
        VariableService.getAllVariables()
      ]);

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
    const newTemplate = await TemplateService.createTemplate({
      name: 'Untitled',
      category: 'blog',
      content: 'New content...',
    });
    setTemplates([newTemplate, ...templates]);
    setSelectedTemplate(newTemplate);
  };

  const handleVariableChange = async (key: string, value: string) => {
    try {
      const updatedVariable = await VariableService.updateVariable(key, {
        key,
        value,
        label: variables.find(v => v.key === key)?.label || '',
        description: variables.find(v => v.key === key)?.description
      });

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
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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