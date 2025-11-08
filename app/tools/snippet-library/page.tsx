import { Metadata } from "next";
import { SnippetService } from "@/lib/db/services/snippetService";
import { SnippetLibraryClient } from "./_components/snippet-library-client";

export const metadata: Metadata = {
  title: "Snippet Library | ToolBox",
  description:
    "Organize and manage your code snippets across multiple languages. Search, filter, and categorize snippets for quick access.",
  openGraph: {
    title: "Snippet Library | ToolBox",
    description:
      "Organize and manage your code snippets across multiple languages",
    type: "website",
  },
};

export default async function SnippetLibraryPage() {
  // Server-side data fetching
  let initialSnippets;

  try {
    initialSnippets = await SnippetService.getAllSnippets();
  } catch (error) {
    console.error("Error loading initial snippets:", error);
    initialSnippets = [];
  }

  return <SnippetLibraryClient initialSnippets={initialSnippets} />;
}
