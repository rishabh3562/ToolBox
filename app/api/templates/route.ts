import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { TemplateService } from "@/lib/db/services/templateService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/templates - Get all templates
async function handleGetTemplates(request: NextRequest): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search");
    const categories = searchParams.get("categories");
    const tags = searchParams.get("tags");

    let templates;

    // Check if filters are provided
    if (searchQuery || categories || tags) {
      templates = await TemplateService.getFilteredTemplates({
        searchQuery: searchQuery || undefined,
        categories: categories ? categories.split(",") : undefined,
        tags: tags ? tags.split(",") : undefined,
      });
    } else {
      templates = await TemplateService.getAllTemplates();
    }

    return NextResponse.json({
      success: true,
      data: templates,
      count: templates.length,
    });
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}

// POST /api/templates - Create a new template
async function handleCreateTemplate(
  request: NextRequest,
): Promise<NextResponse> {
  try {
    // Check authentication (supports both session and API token)
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to create templates" },
        { status: 401 },
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Accept both 'name' and 'title' for compatibility
    const { name, title, description, content, category, tags } =
      (body as Record<string, unknown>) ?? {};

    // Use 'name' if provided, otherwise use 'title'
    const templateName = (name as string) || (title as string);

    if (typeof templateName !== "string" || typeof content !== "string") {
      return NextResponse.json(
        { error: "Name/title and content are required" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!templateName || !content) {
      return NextResponse.json(
        { error: "Name/title and content are required" },
        { status: 400 },
      );
    }

    // Create template in database
    const newTemplate = await TemplateService.createTemplate({
      name: templateName, // Use the resolved name
      content,
      category: (typeof category === "string" ? category : "general") as "email" | "blog" | "social" | "general",
      tags: Array.isArray(tags) ? tags.map(String) : [],
    });

    return NextResponse.json(
      {
        success: true,
        data: newTemplate,
        message: "Template created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating template:", error);
    return NextResponse.json(
      { error: "Failed to create template" },
      { status: 500 },
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.templates(handleGetTemplates);
export const POST = rateLimitMiddleware.templates(handleCreateTemplate);
