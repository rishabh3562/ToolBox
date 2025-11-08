import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { ProfileService } from "@/lib/db/services/profileService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/profiles - Get all profiles
async function handleGetProfiles(request: NextRequest): Promise<NextResponse> {
  try {
    const profiles = await ProfileService.getAllProfiles();

    return NextResponse.json({
      success: true,
      data: profiles,
      count: profiles.length,
    });
  } catch (error) {
    console.error("Error fetching profiles:", error);
    return NextResponse.json(
      { error: "Failed to fetch profiles" },
      { status: 500 }
    );
  }
}

// POST /api/profiles - Create a new profile
async function handleCreateProfile(
  request: NextRequest
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to create profiles" },
        { status: 401 }
      );
    }

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const { name, handle, platform, url, description, categories } =
      (body as Record<string, unknown>) ?? {};

    // Validate required fields
    if (
      typeof name !== "string" ||
      typeof handle !== "string" ||
      typeof platform !== "string" ||
      typeof url !== "string"
    ) {
      return NextResponse.json(
        { error: "Name, handle, platform, and URL are required" },
        { status: 400 }
      );
    }

    if (!name || !handle || !platform || !url) {
      return NextResponse.json(
        { error: "Name, handle, platform, and URL cannot be empty" },
        { status: 400 }
      );
    }

    // Create profile in database
    const newProfile = await ProfileService.createProfile({
      name,
      handle,
      platform: platform as any,
      url,
      description: typeof description === "string" ? description : "",
      categories: Array.isArray(categories) ? categories : [],
      favoriteContent: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        data: newProfile,
        message: "Profile created successfully",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json(
      { error: "Failed to create profile" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export const GET = rateLimitMiddleware.api(handleGetProfiles);
export const POST = rateLimitMiddleware.api(handleCreateProfile);
