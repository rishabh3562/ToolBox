import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { VariableService } from "@/lib/db/services/variableService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/variables - Get all variables
async function handleGetVariables(request: NextRequest): Promise<NextResponse> {
  try {
    const variables = await VariableService.getAllVariables();

    return NextResponse.json({
      success: true,
      data: variables,
      count: variables.length,
    });
  } catch (error) {
    console.error("Error fetching variables:", error);
    return NextResponse.json(
      { error: "Failed to fetch variables" },
      { status: 500 }
    );
  }
}

// POST /api/variables - Create a new variable
async function handleCreateVariable(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to create variables" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { key, value, description } = (body as Record<string, unknown>) ?? {};

    // Validate required fields
    if (typeof key !== "string" || typeof value !== "string") {
      return NextResponse.json(
        { error: "Key and value are required" },
        { status: 400 }
      );
    }

    if (!key || !value) {
      return NextResponse.json(
        { error: "Key and value cannot be empty" },
        { status: 400 }
      );
    }

    // Create variable in database
    const newVariable = await VariableService.createVariable({
      key,
      value,
      label: key,
      description: typeof description === "string" ? description : "",
    });

    return NextResponse.json(
      {
        success: true,
        data: newVariable,
        message: "Variable created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating variable:", error);
    return NextResponse.json(
      { error: "Failed to create variable" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.api(handleGetVariables);
export const POST = rateLimitMiddleware.api(handleCreateVariable);
