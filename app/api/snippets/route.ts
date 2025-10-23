import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// GET /api/snippets - Get all code snippets
async function handleGetSnippets(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const tag = searchParams.get("tag");

    // Simulate fetching snippets from database
    const snippets = [
      {
        id: "1",
        title: "Array Chunk Function",
        description: "Split array into chunks of specified size",
        language: "javascript",
        code: "function chunk(array, size) {\n  const chunks = [];\n  for (let i = 0; i < array.length; i += size) {\n    chunks.push(array.slice(i, i + size));\n  }\n  return chunks;\n}",
        tags: ["array", "utility", "javascript"],
        createdAt: new Date().toISOString(),
      },
      {
        id: "2",
        title: "Debounce Function",
        description: "Delay function execution until after delay",
        language: "typescript",
        code: "function debounce<T extends (...args: any[]) => any>(\n  func: T,\n  delay: number\n): (...args: Parameters<T>) => void {\n  let timeoutId: NodeJS.Timeout;\n  return (...args: Parameters<T>) => {\n    clearTimeout(timeoutId);\n    timeoutId = setTimeout(() => func(...args), delay);\n  };\n}",
        tags: ["performance", "utility", "typescript"],
        createdAt: new Date().toISOString(),
      },
    ];

    // Filter by language if specified
    let filteredSnippets = snippets;
    if (language) {
      filteredSnippets = filteredSnippets.filter(
        (s) => s.language === language,
      );
    }
    if (tag) {
      filteredSnippets = filteredSnippets.filter((s) => s.tags.includes(tag));
    }

    return NextResponse.json({
      success: true,
      data: filteredSnippets,
      count: filteredSnippets.length,
      filters: { language, tag },
    });
  } catch (error) {
    console.error("Error fetching snippets:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippets" },
      { status: 500 },
    );
  }
}

// POST /api/snippets - Create a new code snippet
async function handleCreateSnippet(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const { title, description, language, code, tags } = body;

    // Validate required fields
    if (!title || !code || !language) {
      return NextResponse.json(
        { error: "Title, code, and language are required" },
        { status: 400 },
      );
    }

    // Validate language
    const supportedLanguages = [
      "javascript",
      "typescript",
      "python",
      "java",
      "go",
      "rust",
      "cpp",
      "c",
      "csharp",
      "php",
      "ruby",
      "swift",
    ];
    if (!supportedLanguages.includes(language.toLowerCase())) {
      return NextResponse.json(
        {
          error: `Unsupported language. Supported: ${supportedLanguages.join(", ")}`,
        },
        { status: 400 },
      );
    }

    // Simulate creating snippet in database
    const newSnippet = {
      id: crypto.randomUUID(),
      title,
      description: description || "",
      language: language.toLowerCase(),
      code,
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newSnippet,
        message: "Snippet created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating snippet:", error);
    return NextResponse.json(
      { error: "Failed to create snippet" },
      { status: 500 },
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.snippets(handleGetSnippets);
export const POST = rateLimitMiddleware.snippets(handleCreateSnippet);
