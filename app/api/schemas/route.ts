import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { SchemaService } from "@/lib/db/services/schemaService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/schemas - Get all schemas
async function handleGetSchemas(request: NextRequest): Promise<NextResponse> {
  try {
    const schemas = await SchemaService.getAllSchemas();

    return NextResponse.json({
      success: true,
      data: schemas,
      count: schemas.length,
    });
  } catch (error) {
    console.error("Error fetching schemas:", error);
    return NextResponse.json(
      { error: "Failed to fetch schemas" },
      { status: 500 }
    );
  }
}

// POST /api/schemas - Create a new schema
async function handleCreateSchema(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to create schemas" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, description, tables } =
      (body as Record<string, unknown>) ?? {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      !Array.isArray(tables)
    ) {
      return NextResponse.json(
        { error: "Name and tables are required" },
        { status: 400 }
      );
    }

    if (!name || tables.length === 0) {
      return NextResponse.json(
        { error: "Name and tables cannot be empty" },
        { status: 400 }
      );
    }

    // Create schema in database
    const newSchema = await SchemaService.createSchema({
      name,
      description: typeof description === "string" ? description : "",
      tables,
    });

    return NextResponse.json(
      {
        success: true,
        data: newSchema,
        message: "Schema created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating schema:", error);
    return NextResponse.json(
      { error: "Failed to create schema" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.api(handleGetSchemas);
export const POST = rateLimitMiddleware.api(handleCreateSchema);
