"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Plus, Tag } from "lucide-react";
import { CategoryTree } from "@/components/category-tree";
import { SnippetEditor } from "@/components/snippet-editor";
import { defaultCategories } from "@/lib/snippets/default-categories";
import { Snippet, Category } from "@/types/snippet";
import { api } from "@/lib/api/client";

interface SnippetLibraryClientProps {
  initialSnippets: Snippet[];
}

export function SnippetLibraryClient({
  initialSnippets,
}: SnippetLibraryClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useState("");
  const [categories] = useState<Category[]>(defaultCategories);
  const [snippets, setSnippets] = useState<Snippet[]>(initialSnippets);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet>();
  const [loading, setLoading] = useState(false);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>(initialSnippets);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchQuery, selectedCategory]);

  const filterSnippets = async () => {
    try {
      if (searchQuery) {
        const searchResults = await api.snippets.search(searchQuery);
        setFilteredSnippets(searchResults);
      } else if (selectedCategory) {
        const categoryResults = await api.snippets.getByCategory(selectedCategory);
        setFilteredSnippets(categoryResults);
      } else {
        setFilteredSnippets(snippets);
      }
    } catch (error) {
      console.error("Error filtering snippets:", error);
    }
  };

  const handleSnippetUpdate = async (snippet: Snippet) => {
    try {
      const updated = await api.snippets.update(snippet.id, snippet);
      setSnippets(snippets.map((s) => (s.id === snippet.id ? updated : s)));
      setSelectedSnippet(updated);
    } catch (error) {
      console.error("Error updating snippet:", error);
    }
  };

  const handleSnippetCreate = async () => {
    try {
      const newSnippet = await api.snippets.create({
        title: "New Snippet",
        code: "",
        language: "javascript",
        tags: [],
        category: selectedCategory || "javascript",
      });
      setSnippets([newSnippet, ...snippets]);
      setSelectedSnippet(newSnippet);
    } catch (error) {
      console.error("Error creating snippet:", error);
    }
  };

  const handleSnippetDelete = async (id: string) => {
    try {
      await api.snippets.delete(id);
      setSnippets(snippets.filter((s) => s.id !== id));
      setSelectedSnippet(undefined);
    } catch (error) {
      console.error("Error deleting snippet:", error);
    }
  };

  if (loading && snippets.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Loading snippets...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">Snippet Library</h1>
          <p className="text-muted-foreground">
            Organize and manage your code snippets
          </p>
        </div>

        <div className="flex justify-between items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search snippets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={handleSnippetCreate}>
            <Plus className="h-4 w-4 mr-2" />
            New Snippet
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          <div className="md:col-span-1">
            <Card className="p-4">
              <h3 className="font-semibold mb-4">Categories</h3>
              <CategoryTree
                categories={categories}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </Card>
          </div>

          <div className="md:col-span-3">
            {filteredSnippets.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-muted-foreground">
                  No snippets found. Create your first snippet!
                </p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredSnippets.map((snippet) => (
                  <Card
                    key={snippet.id}
                    className="p-4 cursor-pointer hover:border-primary"
                    onClick={() => setSelectedSnippet(snippet)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">{snippet.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {snippet.language}
                        </p>
                      </div>
                      {snippet.tags && snippet.tags.length > 0 && (
                        <div className="flex gap-2">
                          {snippet.tags.map((tag, i) => (
                            <span
                              key={i}
                              className="text-xs bg-secondary px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {selectedSnippet && (
          <SnippetEditor
            snippet={selectedSnippet}
            onUpdate={handleSnippetUpdate}
            onDelete={handleSnippetDelete}
            onClose={() => setSelectedSnippet(undefined)}
          />
        )}
      </div>
    </div>
  );
}
