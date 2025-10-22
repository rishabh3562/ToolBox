import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// GET /api/health - Health check endpoint
async function handleHealthCheck(request: NextRequest): Promise<NextResponse> {
  try {
    const health = {
      status: "healthy",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || "1.0.0",
      environment: process.env.NODE_ENV || "development",
      services: {
        database: "connected", // Placeholder
        redis: process.env.UPSTASH_REDIS_REST_URL ? "connected" : "disabled",
        ai: "available", // Placeholder
      },
      rateLimit: {
        enabled: true,
        provider: process.env.UPSTASH_REDIS_REST_URL ? "redis" : "memory",
      },
    };

    return NextResponse.json({
      success: true,
      data: health,
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        error: "Health check failed",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}

// Apply default rate limiting to health check
export const GET = rateLimitMiddleware.api(handleHealthCheck);
