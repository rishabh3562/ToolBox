import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { VariableService } from "@/lib/db/services/variableService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// POST /api/variables/initialize - Initialize default variables
async function handleInitializeVariables(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to initialize variables" },
        { status: 401 }
      );
    }

    // Initialize default variables
    await VariableService.initializeDefaultVariables();

    const variables = await VariableService.getAllVariables();

    return NextResponse.json({
      success: true,
      data: variables,
      message: "Default variables initialized successfully",
      count: variables.length,
    });
  } catch (error) {
    console.error("Error initializing variables:", error);
    return NextResponse.json(
      { error: "Failed to initialize variables" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handler
export const POST = rateLimitMiddleware.api(handleInitializeVariables);
