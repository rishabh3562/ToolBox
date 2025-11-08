import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { VariableService } from "@/lib/db/services/variableService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/variables/[key] - Get a single variable by key
async function handleGetVariable(
  request: NextRequest,
  { params }: { params: { key: string } }
): Promise<NextResponse> {
  try {
    const variable = await VariableService.getVariableByKey(params.key);

    if (!variable) {
      return NextResponse.json(
        { error: "Variable not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: variable,
    });
  } catch (error) {
    console.error("Error fetching variable:", error);
    return NextResponse.json(
      { error: "Failed to fetch variable" },
      { status: 500 }
    );
  }
}

// PUT /api/variables/[key] - Update a variable
async function handleUpdateVariable(
  request: NextRequest,
  { params }: { params: { key: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to update variables" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { value, description } = (body as Record<string, unknown>) ?? {};

    if (typeof value !== "string") {
      return NextResponse.json(
        { error: "Value is required and must be a string" },
        { status: 400 }
      );
    }

    // Update variable in database
    const updatedVariable = await VariableService.updateVariable(params.key, {
      value,
      description: typeof description === "string" ? description : undefined,
    });

    if (!updatedVariable) {
      return NextResponse.json(
        { error: "Variable not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedVariable,
      message: "Variable updated successfully",
    });
  } catch (error) {
    console.error("Error updating variable:", error);
    return NextResponse.json(
      { error: "Failed to update variable" },
      { status: 500 }
    );
  }
}

// DELETE /api/variables/[key] - Delete a variable
async function handleDeleteVariable(
  request: NextRequest,
  { params }: { params: { key: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to delete variables" },
        { status: 401 }
      );
    }

    const deleted = await VariableService.deleteVariable(params.key);

    if (!deleted) {
      return NextResponse.json(
        { error: "Variable not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Variable deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting variable:", error);
    return NextResponse.json(
      { error: "Failed to delete variable" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export async function GET(request: NextRequest, context: { params: Promise<{ key: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleGetVariable(req, { params }))(request);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ key: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleUpdateVariable(req, { params }))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ key: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleDeleteVariable(req, { params }))(request);
}
