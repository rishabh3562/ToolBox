"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, Loader2, Database, Code, Save, Trash2 } from 'lucide-react';
import { generateSchema, generateSQLCode } from '@/lib/schema/generate-schema';
import { SchemaService } from '@/lib/db/services/schemaService';
import { Schema, DatabaseType, SchemaGeneratorResponse } from '@/types/schema';
import { Spinner } from '@/components/ui/spinner';
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Loader2, Database, Code, Save, Trash2 } from "lucide-react";
import { generateSchema, generateSQLCode } from "@/lib/schema/generate-schema";
import { SchemaService } from "@/lib/db/services/schemaService";
import { Schema, DatabaseType, SchemaGeneratorResponse } from "@/types/schema";

export default function SchemaGeneratorPage() {
  const [prompt, setPrompt] = useState("");
  const [dbType, setDbType] = useState<DatabaseType>("mysql");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedSchema, setGeneratedSchema] = useState<Schema>();
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [optimizations, setOptimizations] = useState<string[]>([]);
  const [sqlCode, setSqlCode] = useState("");
  const [savedSchemas, setSavedSchemas] = useState<Schema[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedSchemas();
  }, []);

  const loadSavedSchemas = async () => {
    try {
      setLoading(true);
      const schemas = await SchemaService.getAllSchemas();
      setSavedSchemas(schemas);
    } catch (error) {
      console.error("Error loading schemas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    let fullResponse = "";

    try {
      await generateSchema(prompt, dbType, ({ text, done }) => {
        if (!done) {
          fullResponse += text;
          try {
            const parsed: SchemaGeneratorResponse = JSON.parse(fullResponse);
            setGeneratedSchema(parsed.schema);
            setSuggestions(parsed.suggestions);
            setOptimizations(parsed.optimizations);
            setSqlCode(generateSQLCode(parsed.schema));
          } catch (e) {
            // Partial JSON, continue accumulating
          }
        }
      });
    } catch (error) {
      console.error("Error generating schema:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSchema = async () => {
    if (!generatedSchema) return;

    try {
      const savedSchema = await SchemaService.createSchema(generatedSchema);
      setSavedSchemas([savedSchema, ...savedSchemas]);
    } catch (error) {
      console.error("Error saving schema:", error);
    }
  };

  const handleDeleteSchema = async (schemaId: string) => {
    try {
      const success = await SchemaService.deleteSchema(schemaId);
      if (success) {
        setSavedSchemas(savedSchemas.filter((s) => s.id !== schemaId));
      }
    } catch (error) {
      console.error("Error deleting schema:", error);
    }
  };

  const handleLoadSchema = (schema: Schema) => {
    setGeneratedSchema(schema);
    setSqlCode(generateSQLCode(schema));
  };

  const downloadSQL = () => {
    const blob = new Blob([sqlCode], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "schema.sql";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Schema Generator</h1>
          <p className="text-muted-foreground">
            Generate database schemas from natural language descriptions using
            AI
          </p>
        </div>

        <div className="grid gap-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Database Type</Label>
                <Select
                  value={dbType}
                  onValueChange={(value) => setDbType(value as DatabaseType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select database type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="mongodb">MongoDB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Describe Your Database</Label>
                <Textarea
                  placeholder="Describe your database requirements in natural language..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[150px]"
                />
              </div>

              <Button
                onClick={handleGenerate}
                disabled={!prompt || isGenerating}
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Schema...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Generate Schema
                  </>
                )}
              </Button>
            </div>
          </Card>

          {generatedSchema && (
            <Tabs defaultValue="schema" className="space-y-4">
              <TabsList>
                <TabsTrigger value="schema">Schema</TabsTrigger>
                <TabsTrigger value="sql">SQL Code</TabsTrigger>
                <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
                <TabsTrigger value="saved">Saved Schemas</TabsTrigger>
              </TabsList>

              <TabsContent value="schema">
                <Card className="p-6">
                  <div className="flex justify-end mb-4">
                    <Button onClick={handleSaveSchema}>
                      <Save className="mr-2 h-4 w-4" />
                      Save Schema
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap overflow-auto">
                    {JSON.stringify(generatedSchema, null, 2)}
                  </pre>
                </Card>
              </TabsContent>

              <TabsContent value="sql">
                <Card className="p-6">
                  <div className="flex justify-end mb-4">
                    <Button variant="outline" onClick={downloadSQL}>
                      <Download className="mr-2 h-4 w-4" />
                      Download SQL
                    </Button>
                  </div>
                  <pre className="whitespace-pre-wrap overflow-auto bg-muted p-4 rounded-md">
                    {sqlCode}
                  </pre>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Suggestions
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {suggestions.map((suggestion, index) => (
                          <li key={index}>{suggestion}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Optimizations
                      </h3>
                      <ul className="list-disc pl-6 space-y-2">
                        {optimizations.map((optimization, index) => (
                          <li key={index}>{optimization}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="saved">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Saved Schemas</h3>
                  {loading ? (
                    <div className="text-center py-8">
                      <Spinner size="lg" className="mx-auto" />
                      <p className="mt-2 text-muted-foreground">Loading schemas...</p>
                      <Loader2 className="h-8 w-8 animate-spin mx-auto" />
                      <p className="mt-2 text-muted-foreground">
                        Loading schemas...
                      </p>
                    </div>
                  ) : savedSchemas.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">
                      No saved schemas found.
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {savedSchemas.map((schema) => (
                        <div
                          key={schema.id}
                          className="p-4 border rounded-lg hover:bg-accent cursor-pointer"
                        >
                          <div className="flex justify-between items-start">
                            <div onClick={() => handleLoadSchema(schema)}>
                              <h4 className="font-medium">{schema.name}</h4>
                              <p className="text-sm text-muted-foreground">
                                {schema.description}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {schema.tables.length} tables
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSchema(schema.id!);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
