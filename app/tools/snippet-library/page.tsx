'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Tag } from 'lucide-react';
import { CategoryTree } from '@/components/category-tree';
import { SnippetEditor } from '@/components/snippet-editor';
import { defaultCategories } from '@/lib/snippets/default-categories';
import { SnippetService } from '@/lib/db/services/snippetService';
import { Snippet, Category } from '@/types/snippet';

export default function SnippetLibraryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories] = useState<Category[]>(defaultCategories);
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [selectedSnippet, setSelectedSnippet] = useState<Snippet>();
  const [loading, setLoading] = useState(true);
  const [filteredSnippets, setFilteredSnippets] = useState<Snippet[]>([]);

  useEffect(() => {
    loadSnippets();
  }, []);

  useEffect(() => {
    filterSnippets();
  }, [snippets, searchQuery, selectedCategory]);

  const loadSnippets = async () => {
    try {
      setLoading(true);
      const snippetsData = await SnippetService.getAllSnippets();
      setSnippets(snippetsData);
    } catch (error) {
      console.error('Error loading snippets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterSnippets = async () => {
    try {
      if (searchQuery) {
        const searchResults = await SnippetService.searchSnippets(searchQuery, selectedCategory);
        setFilteredSnippets(searchResults);
      } else if (selectedCategory) {
        const categoryResults = await SnippetService.getSnippetsByCategory(selectedCategory);
        setFilteredSnippets(categoryResults);
      } else {
        setFilteredSnippets(snippets);
      }
    } catch (error) {
      console.error('Error filtering snippets:', error);
      setFilteredSnippets(snippets);
    }
  };

  const handleSaveSnippet = async (snippetData: Partial<Snippet>) => {
    try {
      if (selectedSnippet) {
        // Update existing snippet
        const updatedSnippet = await SnippetService.updateSnippet(selectedSnippet.id, snippetData);
        if (updatedSnippet) {
          setSnippets(snippets.map(s => 
            s.id === selectedSnippet.id ? updatedSnippet : s
          ));
        }
      } else {
        // Create new snippet
        const newSnippet = await SnippetService.createSnippet({
          title: snippetData.title || '',
          description: snippetData.description || '',
          code: snippetData.code || '',
          language: snippetData.language || 'javascript',
          category: selectedCategory || 'uncategorized',
          tags: snippetData.tags || [],
          documentation: snippetData.documentation,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          isPublic: false,
        });
        setSnippets([newSnippet, ...snippets]);
      }
      setSelectedSnippet(undefined);
    } catch (error) {
      console.error('Error saving snippet:', error);
    }
  };

  const handleDeleteSnippet = async (snippet: Snippet) => {
    try {
      const success = await SnippetService.deleteSnippet(snippet.id);
      if (success) {
        setSnippets(snippets.filter(s => s.id !== snippet.id));
        if (selectedSnippet?.id === snippet.id) {
          setSelectedSnippet(undefined);
        }
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
    }
  };

  if (loading) {
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
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Snippet Library</h1>
          <p className="text-muted-foreground">
            Store, organize, and manage your code snippets
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <Card className="col-span-3 p-4">
            <Tabs defaultValue="categories">
              <TabsList className="w-full">
                <TabsTrigger value="categories">Categories</TabsTrigger>
                <TabsTrigger value="tags">Tags</TabsTrigger>
              </TabsList>
              
              <TabsContent value="categories">
                <CategoryTree
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onSelect={setSelectedCategory}
                  onAdd={(parentId) => {
                    // Handle adding new category
                  }}
                  className="mt-4"
                />
              </TabsContent>
              
              <TabsContent value="tags">
                <div className="space-y-2 mt-4">
                  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent cursor-pointer">
                    <Tag className="w-4 h-4" />
                    <span>javascript</span>
                    <span className="ml-auto text-sm text-muted-foreground">12</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          {/* Main Content */}
          <div className="col-span-9 space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search snippets..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={() => setSelectedSnippet(undefined)}>
                <Plus className="w-4 h-4 mr-2" />
                New Snippet
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Snippet List */}
              <Card className="p-4 space-y-4">
                <h2 className="text-lg font-semibold">Your Snippets</h2>
                {filteredSnippets.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">
                    No snippets found. Create your first snippet!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {filteredSnippets.map((snippet) => (
                      <div
                        key={snippet.id}
                        className="p-4 rounded-md hover:bg-accent cursor-pointer group"
                        onClick={() => setSelectedSnippet(snippet)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium">{snippet.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {snippet.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteSnippet(snippet);
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Snippet Editor */}
              <Card className="p-4">
                <h2 className="text-lg font-semibold mb-4">
                  {selectedSnippet ? 'Edit Snippet' : 'New Snippet'}
                </h2>
                <SnippetEditor
                  snippet={selectedSnippet}
                  onSave={handleSaveSnippet}
                />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}