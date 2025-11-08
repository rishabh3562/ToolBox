import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { SnippetService } from "@/lib/db/services/snippetService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/snippets/[id] - Get a single snippet by ID
async function handleGetSnippet(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const snippet = await SnippetService.getSnippetById(params.id);

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: snippet,
    });
  } catch (error) {
    console.error("Error fetching snippet:", error);
    return NextResponse.json(
      { error: "Failed to fetch snippet" },
      { status: 500 }
    );
  }
}

// PUT /api/snippets/[id] - Update a snippet
async function handleUpdateSnippet(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to update snippets" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const updateData = body as Record<string, unknown>;

    // Update snippet in database
    const updatedSnippet = await SnippetService.updateSnippet(
      params.id,
      updateData
    );

    if (!updatedSnippet) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedSnippet,
      message: "Snippet updated successfully",
    });
  } catch (error) {
    console.error("Error updating snippet:", error);
    return NextResponse.json(
      { error: "Failed to update snippet" },
      { status: 500 }
    );
  }
}

// DELETE /api/snippets/[id] - Delete a snippet
async function handleDeleteSnippet(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to delete snippets" },
        { status: 401 }
      );
    }

    const deleted = await SnippetService.deleteSnippet(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Snippet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Snippet deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return NextResponse.json(
      { error: "Failed to delete snippet" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.snippets((req) => handleGetSnippet(req, { params }))(request);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.snippets((req) => handleUpdateSnippet(req, { params }))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.snippets((req) => handleDeleteSnippet(req, { params }))(request);
}
