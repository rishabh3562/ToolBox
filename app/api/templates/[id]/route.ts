import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { TemplateService } from "@/lib/db/services/templateService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/templates/[id] - Get a single template by ID
async function handleGetTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const template = await TemplateService.getTemplateById(params.id);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: template,
    });
  } catch (error) {
    console.error("Error fetching template:", error);
    return NextResponse.json(
      { error: "Failed to fetch template" },
      { status: 500 }
    );
  }
}

// PUT /api/templates/[id] - Update a template
async function handleUpdateTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to update templates" },
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

    // Update template in database
    const updatedTemplate = await TemplateService.updateTemplate(
      params.id,
      updateData
    );

    if (!updatedTemplate) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedTemplate,
      message: "Template updated successfully",
    });
  } catch (error) {
    console.error("Error updating template:", error);
    return NextResponse.json(
      { error: "Failed to update template" },
      { status: 500 }
    );
  }
}

// DELETE /api/templates/[id] - Delete a template
async function handleDeleteTemplate(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to delete templates" },
        { status: 401 }
      );
    }

    const deleted = await TemplateService.deleteTemplate(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Template deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template:", error);
    return NextResponse.json(
      { error: "Failed to delete template" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.templates((req) => handleGetTemplate(req, { params }))(request);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.templates((req) => handleUpdateTemplate(req, { params }))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.templates((req) => handleDeleteTemplate(req, { params }))(request);
}
