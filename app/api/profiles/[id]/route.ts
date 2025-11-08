import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";
import { ProfileService } from "@/lib/db/services/profileService";
import { getAuthenticatedUser } from "@/lib/helpers/apiAuth";

// GET /api/profiles/[id] - Get a single profile by ID
async function handleGetProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    const profile = await ProfileService.getProfileById(params.id);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

// PUT /api/profiles/[id] - Update a profile
async function handleUpdateProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to update profiles" },
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

    // Add updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();

    // Update profile in database
    const updatedProfile = await ProfileService.updateProfile(
      params.id,
      updateData
    );

    if (!updatedProfile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProfile,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

// DELETE /api/profiles/[id] - Delete a profile
async function handleDeleteProfile(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse> {
  try {
    // Check authentication
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login to delete profiles" },
        { status: 401 }
      );
    }

    const deleted = await ProfileService.deleteProfile(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profile deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting profile:", error);
    return NextResponse.json(
      { error: "Failed to delete profile" },
      { status: 500 }
    );
  }
}

// Apply rate limiting to the handlers
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleGetProfile(req, { params }))(request);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleUpdateProfile(req, { params }))(request);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const params = await context.params;
  return rateLimitMiddleware.api((req) => handleDeleteProfile(req, { params }))(request);
}
