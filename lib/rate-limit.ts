import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

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

// Helper function to parse window string to milliseconds
function parseWindowToMs(window: string): number {
  const match = /^(\d+)\s*([smhd])$/.exec(window);
  if (!match) throw new Error(`Invalid window format: ${window}`);
  
  const value = Number(match[1]);
  const unit = match[2];
  
  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: throw new Error(`Invalid time unit: ${unit}`);
  }
}

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
      limiter: Ratelimit.slidingWindow(config.requests, config.window as any),
      analytics: true,
      ephemeralCache: new Map<string, number>(),
    });
  } else {
    // Pure in-memory limiter for single-instance/dev environments
    const windowMs = parseWindowToMs(config.window);
    const limit = config.requests;
    const buckets = new Map<string, number[]>(); // timestamps in ms
    
    return {
      async limit(identifier: string) {
        const now = Date.now();
        const cutoff = now - windowMs;
        const timestamps = (buckets.get(identifier) ?? []).filter(t => t > cutoff);
        const allowed = timestamps.length < limit;
        
        if (allowed) {
          timestamps.push(now);
        }
        buckets.set(identifier, timestamps);
        
        const remaining = Math.max(0, limit - timestamps.length);
        const oldest = timestamps[0] ?? now;
        const reset = oldest + windowMs;
        
        return { 
          success: allowed, 
          limit, 
          remaining, 
          reset 
        };
      },
    };
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
    reset: number;
  }
): Response {
  response.headers.set("X-RateLimit-Limit", String(result.limit));
  response.headers.set("X-RateLimit-Remaining", String(result.remaining));
  response.headers.set("X-RateLimit-Reset", String(result.reset));
  response.headers.set("X-RateLimit-Policy", "sliding-window");
  return response;
}

// Rate limit exceeded error response
export function createRateLimitErrorResponse(
  result: {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
  }
): Response {
  const retryAfter = Math.max(0, Math.ceil((result.reset - Date.now()) / 1000));

  const headers = new Headers({
    "Content-Type": "application/json",
    "X-RateLimit-Limit": result.limit.toString(),
    "X-RateLimit-Remaining": "0",
    "X-RateLimit-Reset": String(result.reset),
    "Retry-After": retryAfter.toString(),
  });

  return new Response(
    JSON.stringify({
      error: "Rate limit exceeded",
      message: `Too many requests. Limit: ${result.limit} requests. Try again in ${retryAfter} seconds.`,
      retryAfter,
      resetTime: new Date(result.reset).toISOString(),
    }),
    {
      status: 429,
      headers,
    }
  );
}
