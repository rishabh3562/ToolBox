import { NextRequest, NextResponse } from "next/server";
import { rateLimiters, getClientIP, addRateLimitHeaders, createRateLimitErrorResponse } from "../rate-limit";

export type RateLimitType = keyof typeof rateLimiters;

/**
 * Rate limiting middleware for Next.js API routes
 */
export async function withRateLimit(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>,
  type: RateLimitType = "default"
): Promise<NextResponse> {
  try {
    const clientIP = getClientIP(request);
    const identifier = `${clientIP}:${type}`;
    
    // Check rate limit
    const rateLimiter = rateLimiters[type];
    const result = await rateLimiter.limit(identifier);

    // If rate limit exceeded, return error response
    if (!result.success) {
      console.warn(`Rate limit exceeded for IP ${clientIP} on ${type} endpoint`);
      return createRateLimitErrorResponse(result);
    }

    // Execute the handler
    const response = await handler(request);

    // Add rate limit headers to successful responses
    return addRateLimitHeaders(response, result);
  } catch (error) {
    console.error("Rate limiting error:", error);
    // If rate limiting fails, allow the request to proceed
    return await handler(request);
  }
}

/**
 * Higher-order function to wrap API route handlers with rate limiting
 */
export function createRateLimitedHandler(
  handler: (req: NextRequest) => Promise<NextResponse>,
  type: RateLimitType = "default"
) {
  return async (request: NextRequest): Promise<NextResponse> => {
    return withRateLimit(request, handler, type);
  };
}

/**
 * Middleware for specific endpoint types
 */
export const rateLimitMiddleware = {
  api: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "api"),
  
  templates: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "templates"),
  
  snippets: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "snippets"),
  
  ai: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "ai"),
  
  auth: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "auth"),
  
  upload: (handler: (req: NextRequest) => Promise<NextResponse>) =>
    createRateLimitedHandler(handler, "upload"),
};

/**
 * Utility function to check rate limit without consuming it
 */
export async function checkRateLimit(
  request: NextRequest,
  type: RateLimitType = "default"
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: Date;
}> {
  const clientIP = getClientIP(request);
  const identifier = `${clientIP}:${type}`;
  const rateLimiter = rateLimiters[type];
  
  return await rateLimiter.limit(identifier);
}
