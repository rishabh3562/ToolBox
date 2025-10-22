import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { LRUCache } from "lru-cache";

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIG = {
  default: { requests: 100, window: "1h" }, // Default rate limit
  api: { requests: 60, window: "1m" }, // API endpoints
  templates: { requests: 30, window: "1m" }, // Template operations
  snippets: { requests: 50, window: "1m" }, // Snippet operations
  ai: { requests: 10, window: "1m" }, // AI-powered features
  auth: { requests: 5, window: "1m" }, // Authentication endpoints
  upload: { requests: 20, window: "1m" }, // File upload endpoints
} as const;

// Create Redis instance for production or LRU cache for development
function createRateLimiter(config: { requests: number; window: string }) {
  // Check if we have Redis configuration
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    // Use Redis for production
    const redis = new Redis({
      url: redisUrl,
      token: redisToken,
    });

    return new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      analytics: true,
    });
  } else {
    // Use in-memory cache for development
    const cache = new LRUCache({
      max: 1000,
      ttl: 60000, // 1 minute
    });

    return new Ratelimit({
      redis: cache as any,
      limiter: Ratelimit.slidingWindow(config.requests, config.window),
      analytics: false,
    });
  }
}

// Create rate limiters for different endpoint types
export const rateLimiters = {
  default: createRateLimiter(RATE_LIMIT_CONFIG.default),
  api: createRateLimiter(RATE_LIMIT_CONFIG.api),
  templates: createRateLimiter(RATE_LIMIT_CONFIG.templates),
  snippets: createRateLimiter(RATE_LIMIT_CONFIG.snippets),
  ai: createRateLimiter(RATE_LIMIT_CONFIG.ai),
  auth: createRateLimiter(RATE_LIMIT_CONFIG.auth),
  upload: createRateLimiter(RATE_LIMIT_CONFIG.upload),
};

// Helper function to get client IP address
export function getClientIP(request: Request): string {
  // Check for forwarded headers (common in production with load balancers)
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIP = request.headers.get("x-real-ip");
  if (realIP) {
    return realIP;
  }

  // Fallback to a default identifier for development
  return "127.0.0.1";
}

// Rate limit response headers
export function addRateLimitHeaders(
  response: Response,
  result: {
    success: boolean;
    limit: number;
    remaining: number;
    reset: Date;
  }
): Response {
  const headers = new Headers(response.headers);
  
  headers.set("X-RateLimit-Limit", result.limit.toString());
  headers.set("X-RateLimit-Remaining", result.remaining.toString());
  headers.set("X-RateLimit-Reset", result.reset.getTime().toString());
  headers.set("X-RateLimit-Policy", "sliding-window");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

// Rate limit exceeded error response
export function createRateLimitErrorResponse(
  result: {
    success: boolean;
    limit: number;
    remaining: number;
    reset: Date;
  }
): Response {
  const retryAfter = Math.ceil((result.reset.getTime() - Date.now()) / 1000);

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": result.reset.getTime().toString(),
    "Retry-After": retryAfter.toString(),
  });

  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: `Too many requests. Limit: ${result.limit} requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
      resetTime: result.reset.toISOString(),
    }),
    {
      status: 429,
      headers,
    }
  );
}
