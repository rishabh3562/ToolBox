import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { SchemaService } from "@/lib/db/services/schemaService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/schemas/[id] - Get a single schema by ID
async function handleGetSchema(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const schema = await SchemaService.getSchemaById(params.id);

    if (!schema) {
      return NextResponse.json(
        { error: "Schema not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: schema,
    });
  } catch (error) {
    console.error("Error fetching schema:", error);
    return NextResponse.json(
      { error: "Failed to fetch schema" },
      { status: 500 }
    );
  }
}

// DELETE /api/schemas/[id] - Delete a schema
async function handleDeleteSchema(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to delete schemas" },
        { status: 401 }
      );
    }

    const deleted = await SchemaService.deleteSchema(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Schema not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Schema deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting schema:", error);
    return NextResponse.json(
      { error: "Failed to delete schema" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleGetSchema(req, { params }))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleDeleteSchema(req, { params }))(request);
}
