"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Loader2 } from "lucide-react";
import {
  generateDescription,
  generateTags,
  generateReadme,
} from "@/lib/gemini";

export default function GitHubHelperPage() {
  const [projectDescription, setProjectDescription] = useState("");
  const [generatedDescription, setGeneratedDescription] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);
  const [readmeContent, setReadmeContent] = useState("");
  const [isLoading, setIsLoading] = useState({
    description: false,
    tags: false,
    readme: false,
  });
  const [projectData, setProjectData] = useState({
    title: "",
    features: "",
    installation: "",
    usage: "",
    contributing: "",
    license: "MIT",
  });

  const handleGenerateDescription = async () => {
    setIsLoading((prev) => ({ ...prev, description: true }));
    let fullDescription = "";

    await generateDescription(projectDescription, ({ text, done }) => {
      if (!done) {
        fullDescription += text;
        setGeneratedDescription(fullDescription);
      }
    });

    setIsLoading((prev) => ({ ...prev, description: false }));
  };

  const handleGenerateTags = async () => {
    setIsLoading((prev) => ({ ...prev, tags: true }));
    let fullTags = "";

    await generateTags(projectDescription, ({ text, done }) => {
      if (!done) {
        fullTags += text;
        setGeneratedTags(fullTags.split(",").map((tag) => tag.trim()));
      }
    });

    setIsLoading((prev) => ({ ...prev, tags: false }));
  };

  const handleGenerateReadme = async () => {
    setIsLoading((prev) => ({ ...prev, readme: true }));
    let fullReadme = "";

    await generateReadme(
      {
        ...projectData,
        description: generatedDescription,
        features: projectData.features.split("\n"),
      },
      ({ text, done }) => {
        if (!done) {
          fullReadme += text;
          setReadmeContent(fullReadme);
        }
      },
    );

    setIsLoading((prev) => ({ ...prev, readme: false }));
  };

  const downloadReadme = () => {
    const blob = new Blob([readmeContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "README.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">GitHub Project Helper</h1>
          <p className="text-muted-foreground">
            Generate professional GitHub repository descriptions, tags, and
            README files
          </p>
        </div>

        <Tabs defaultValue="description" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="readme">README</TabsTrigger>
          </TabsList>

          <TabsContent value="description">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="project-description">
                    Project Description
                  </Label>
                  <Textarea
                    id="project-description"
                    placeholder="Enter your project description..."
                    value={projectDescription}
                    onChange={(e) => setProjectDescription(e.target.value)}
                    className="min-h-[100px]"
                  />
                </div>
                <Button
                  onClick={handleGenerateDescription}
                  disabled={!projectDescription || isLoading.description}
                >
                  {isLoading.description && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Description
                </Button>
                {generatedDescription && (
                  <div className="space-y-2">
                    <Label>Generated Description</Label>
                    <div className="p-4 rounded-md bg-muted">
                      {generatedDescription}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="tags">
            <Card className="p-6">
              <div className="space-y-4">
                <Button
                  onClick={handleGenerateTags}
                  disabled={!projectDescription || isLoading.tags}
                >
                  {isLoading.tags && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Generate Tags
                </Button>
                {generatedTags.length > 0 && (
                  <div className="space-y-2">
                    <Label>Generated Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="readme">
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="project-title">Project Title</Label>
                    <Input
                      id="project-title"
                      value={projectData.title}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          title: e.target.value,
                        })
                      }
                      placeholder="Enter project title"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-features">
                      Features (one per line)
                    </Label>
                    <Textarea
                      id="project-features"
                      value={projectData.features}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          features: e.target.value,
                        })
                      }
                      placeholder="Enter project features"
                      className="min-h-[100px]"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-installation">
                      Installation (optional)
                    </Label>
                    <Textarea
                      id="project-installation"
                      value={projectData.installation}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          installation: e.target.value,
                        })
                      }
                      placeholder="Enter installation instructions"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-usage">Usage (optional)</Label>
                    <Textarea
                      id="project-usage"
                      value={projectData.usage}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          usage: e.target.value,
                        })
                      }
                      placeholder="Enter usage examples"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="project-license">License</Label>
                    <Input
                      id="project-license"
                      value={projectData.license}
                      onChange={(e) =>
                        setProjectData({
                          ...projectData,
                          license: e.target.value,
                        })
                      }
                      placeholder="Enter license (default: MIT)"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button
                    onClick={handleGenerateReadme}
                    disabled={
                      !projectData.title ||
                      !projectData.features ||
                      !generatedDescription ||
                      isLoading.readme
                    }
                  >
                    {isLoading.readme && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    Generate README
                  </Button>
                  {readmeContent && (
                    <Button onClick={downloadReadme} variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download README.md
                    </Button>
                  )}
                </div>
                {readmeContent && (
                  <div className="space-y-2">
                    <Label>Generated README</Label>
                    <div className="p-4 rounded-md bg-muted prose dark:prose-invert max-w-none">
                      <pre className="whitespace-pre-wrap">{readmeContent}</pre>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
