"use client";

import { useState, useEffect, useCallback } from "react";
import { Template, Variable } from "@/types";
import { api } from "@/lib/api/client";
import { TemplateEditor } from "@/components/template-editor";
import { VariableForm } from "@/components/variable-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";

interface TemplateManagerClientProps {
  initialTemplates: Template[];
  initialVariables: Variable[];
}

export function TemplateManagerClient({
  initialTemplates,
  initialVariables,
}: TemplateManagerClientProps) {
  const [variables, setVariables] = useState<Variable[]>(initialVariables);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(
    initialTemplates[0] || null
  );
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Use API client instead of direct service calls
      const templatesData = await api.templates.getAll({
        search: searchQuery,
        categories: selectedCategories,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t),
      });

      const variablesData = await api.variables.getAll();

      setTemplates(templatesData);
      setVariables(variablesData);

      if (templatesData.length > 0) {
        setSelectedTemplate(templatesData[0]);
      } else {
        setSelectedTemplate(null);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedCategories, tags]);

  useEffect(() => {
    // Only reload if filters change (not on initial mount)
    if (searchQuery || selectedCategories.length > 0 || tags) {
      loadData();
    }
  }, [searchQuery, selectedCategories, tags]);

  const handleCreateTemplate = async () => {
    try {
      setError(null);
      const newTemplate = await api.templates.create({
        name: "Untitled",
        category: "blog",
        content: "New content...",
        tags: [],
      });
      setTemplates([newTemplate, ...templates]);
      setSelectedTemplate(newTemplate);
    } catch (err) {
      setError("Failed to create template.");
    }
  };

  const handleVariableChange = async (key: string, value: string) => {
    try {
      const updatedVariable = await api.variables.update(key, {
        value,
        description: variables.find((v) => v.key === key)?.description,
      });

      if (updatedVariable) {
        setVariables(
          variables.map((v) => (v.key === key ? updatedVariable : v))
        );
      }
    } catch (error) {
      console.error("Error updating variable:", error);
      setError("Failed to update variable");
    }
  };

  const getHighlightedText = (text: string, highlight: string) => {
    if (!highlight) return <span>{text}</span>;
    const escaped = highlight.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = text.split(new RegExp(`(${escaped})`, "gi"));
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === highlight.toLowerCase() ? (
            <strong key={i}>{part}</strong>
          ) : (
            part
          )
        )}
      </span>
    );
  };

  if (loading && templates.length === 0) {
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
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            <MultiSelect
              options={[
                { label: "Email", value: "email" },
                { label: "Blog", value: "blog" },
                { label: "Social", value: "social" },
              ]}
              onValueChange={setSelectedCategories}
              defaultValue={selectedCategories}
              placeholder="Filter by category"
            />
            <Input
              placeholder="Filter by tags (comma-separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="max-w-xs"
            />
          </div>
          <button onClick={handleCreateTemplate} className="btn btn-primary">
            + New Template
          </button>
        </div>
        {error && <p className="text-red-500">{error}</p>}

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
                      {getHighlightedText(template.name, searchQuery)}
                    </TabsTrigger>
                  ))}
                </TabsList>
                {templates.map((template) => (
                  <TabsContent key={template.id} value={template.id}>
                    <TemplateEditor template={template} variables={variables} />
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
