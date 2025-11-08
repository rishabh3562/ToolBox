import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { SnippetService } from "@/lib/db/services/snippetService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/snippets - Get all code snippets
async function handleGetSnippets(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get("language");
    const tag = searchParams.get("tag");

    // Fetch snippets from database
    let snippets;

    if (language) {
      snippets = await SnippetService.getSnippetsByLanguage(language);
    } else {
      snippets = await SnippetService.getAllSnippets();
    }

    // Filter by tag if specified
    if (tag) {
      snippets = snippets.filter((s) => s.tags?.includes(tag));
    }

    return NextResponse.json({
      success: true,
      data: snippets,
      count: snippets.length,
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
    // Check authentication (supports both session and API token)
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to create snippets" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const { title, description, language, code, tags, category } = body;

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

    // Create snippet in database
    const newSnippet = await SnippetService.createSnippet({
      title,
      description: description || "",
      language: language.toLowerCase(),
      code,
      tags: tags || [],
      category: category || "general",
      isPublic: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

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
