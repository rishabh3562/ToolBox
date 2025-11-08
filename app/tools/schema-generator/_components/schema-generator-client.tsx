"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api/client";

interface Schema {
  id: string;
  name: string;
  description?: string;
  type: "Article" | "Product" | "Event" | "Organization" | "Custom";
  schema: Record<string, any>;
  createdAt: string;
}

interface SchemaGeneratorClientProps {
  initialSchemas: Schema[];
}

export function SchemaGeneratorClient({
  initialSchemas,
}: SchemaGeneratorClientProps) {
  const [schemas, setSchemas] = useState<Schema[]>(initialSchemas);
  const [schemaType, setSchemaType] = useState<string>("Article");
  const [schemaName, setSchemaName] = useState("");
  const [schemaDescription, setSchemaDescription] = useState("");
  const [schemaData, setSchemaData] = useState("{}");
  const [generatedSchema, setGeneratedSchema] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    try {
      const parsed = JSON.parse(schemaData);
      const schema = {
        "@context": "https://schema.org",
        "@type": schemaType,
        ...parsed,
      };
      setGeneratedSchema(JSON.stringify(schema, null, 2));
    } catch (error) {
      console.error("Invalid JSON:", error);
      alert("Invalid JSON format");
    }
  };

  const handleSave = async () => {
    try {
      if (!schemaName || !generatedSchema) {
        alert("Please provide a name and generate a schema first");
        return;
      }

      const newSchema = await api.schemas.create({
        name: schemaName,
        description: schemaDescription,
        type: schemaType as any,
        schema: JSON.parse(generatedSchema),
      });

      setSchemas([newSchema, ...schemas]);
      setSchemaName("");
      setSchemaDescription("");
      setSchemaData("{}");
      setGeneratedSchema("");
    } catch (error) {
      console.error("Error saving schema:", error);
      alert("Failed to save schema");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.schemas.delete(id);
      setSchemas(schemas.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Error deleting schema:", error);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Schema Generator</h1>
          <p className="text-muted-foreground">
            Generate structured data schemas for better SEO
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Create New Schema</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="schema-name">Schema Name</Label>
                <Input
                  id="schema-name"
                  value={schemaName}
                  onChange={(e) => setSchemaName(e.target.value)}
                  placeholder="My Schema"
                />
              </div>

              <div>
                <Label htmlFor="schema-description">Description (Optional)</Label>
                <Input
                  id="schema-description"
                  value={schemaDescription}
                  onChange={(e) => setSchemaDescription(e.target.value)}
                  placeholder="Description of this schema"
                />
              </div>

              <div>
                <Label htmlFor="schema-type">Schema Type</Label>
                <Select value={schemaType} onValueChange={setSchemaType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select schema type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Article">Article</SelectItem>
                    <SelectItem value="Product">Product</SelectItem>
                    <SelectItem value="Event">Event</SelectItem>
                    <SelectItem value="Organization">Organization</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="schema-data">Schema Data (JSON)</Label>
                <Textarea
                  id="schema-data"
                  value={schemaData}
                  onChange={(e) => setSchemaData(e.target.value)}
                  placeholder='{"name": "Example", "description": "..."}'
                  rows={10}
                  className="font-mono text-sm"
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={handleGenerate} className="flex-1">
                  Generate
                </Button>
                <Button
                  onClick={handleSave}
                  variant="secondary"
                  className="flex-1"
                  disabled={!generatedSchema}
                >
                  Save Schema
                </Button>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-4">Generated Schema</h3>
            {generatedSchema ? (
              <div className="space-y-4">
                <Textarea
                  value={generatedSchema}
                  readOnly
                  rows={15}
                  className="font-mono text-sm"
                />
                <Button
                  onClick={() => copyToClipboard(generatedSchema)}
                  className="w-full"
                >
                  Copy to Clipboard
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Fill in the form and click Generate to create a schema
              </p>
            )}
          </Card>
        </div>

        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Saved Schemas</h3>
          {schemas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No saved schemas yet. Create your first schema above!
            </p>
          ) : (
            <div className="space-y-4">
              {schemas.map((schema) => (
                <Card key={schema.id} className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold">{schema.name}</h4>
                      {schema.description && (
                        <p className="text-sm text-muted-foreground">
                          {schema.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Type: {schema.type}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          copyToClipboard(JSON.stringify(schema.schema, null, 2))
                        }
                      >
                        Copy
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(schema.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    value={JSON.stringify(schema.schema, null, 2)}
                    readOnly
                    rows={6}
                    className="font-mono text-xs"
                  />
                </Card>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
