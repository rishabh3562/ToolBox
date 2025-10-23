# Rate Limiting Documentation

## Overview

ToolBox implements comprehensive rate limiting to protect API routes against abuse and ensure fair usage across all users. The rate limiting system uses IP-based tracking with configurable limits per endpoint type.

## Rate Limits

### Default Limits

| Endpoint Type | Rate Limit         | Description                        |
| ------------- | ------------------ | ---------------------------------- |
| **Default**   | 100 requests/hour  | General endpoints                  |
| **API**       | 60 requests/minute | Standard API operations            |
| **Templates** | 30 requests/minute | Template CRUD operations           |
| **Snippets**  | 50 requests/minute | Code snippet operations            |
| **AI**        | 10 requests/minute | AI-powered features (strict limit) |
| **Auth**      | 5 requests/minute  | Authentication endpoints           |
| **Upload**    | 20 requests/minute | File upload operations             |

### Specific API Endpoints

| Endpoint                | Rate Limit | Type      |
| ----------------------- | ---------- | --------- |
| `GET /api/templates`    | 30/minute  | Templates |
| `POST /api/templates`   | 30/minute  | Templates |
| `GET /api/snippets`     | 50/minute  | Snippets  |
| `POST /api/snippets`    | 50/minute  | Snippets  |
| `POST /api/ai/generate` | 10/minute  | AI        |
| `GET /api/health`       | 60/minute  | API       |

## Implementation

### Rate Limiting Middleware

```typescript
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

// Apply rate limiting to API route
export const GET = rateLimitMiddleware.templates(handleGetTemplates);
export const POST = rateLimitMiddleware.ai(handleAIGenerate);
```

### Available Middleware

- `rateLimitMiddleware.api()` - Standard API rate limiting
- `rateLimitMiddleware.templates()` - Template operations
- `rateLimitMiddleware.snippets()` - Snippet operations
- `rateLimitMiddleware.ai()` - AI features (strict)
- `rateLimitMiddleware.auth()` - Authentication
- `rateLimitMiddleware.upload()` - File uploads

### Custom Rate Limiting

```typescript
import { withRateLimit } from "@/lib/middleware/rate-limit-middleware";

// First, add to lib/rate-limit.ts:
// export const RATE_LIMIT_CONFIG = {
//   ...existing config,
//   custom: { requests: 25, window: "1m" }
// } as const;
//
// export const rateLimiters = {
//   ...existing limiters,
//   custom: createRateLimiter(RATE_LIMIT_CONFIG.custom)
// };

export async function GET(request: NextRequest) {
  return withRateLimit(
    request,
    async (req) => {
      // Your handler logic
      return NextResponse.json({ success: true });
    },
    "custom",
  ); // Must match a key in rateLimiters
}
```

## Rate Limit Headers

All responses include rate limiting headers:

```
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 59
X-RateLimit-Reset: 1640995200000
X-RateLimit-Policy: sliding-window
```

### Header Descriptions

- **X-RateLimit-Limit**: Maximum requests allowed in the time window
- **X-RateLimit-Remaining**: Requests remaining in current window
- **X-RateLimit-Reset**: Unix timestamp when the rate limit resets
- **X-RateLimit-Policy**: Rate limiting algorithm used

## Rate Limit Exceeded Response

When rate limits are exceeded, the API returns a `429 Too Many Requests` status:

```json
{
  "error": "Rate limit exceeded",
  "message": "Too many requests. Limit: 10 requests. Try again in 45 seconds.",
  "retryAfter": 45,
  "resetTime": "2024-01-01T12:00:00.000Z"
}
```

Additional headers:

- `Retry-After`: Seconds to wait before retrying
- `X-RateLimit-Remaining`: Always "0" when rate limited

## Configuration

### Environment Variables

```bash
# Production: Use Upstash Redis for distributed rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-token

# Development: Uses in-memory LRU cache if Redis not configured
```

### Storage Options

1. **Redis (Production)**: Distributed rate limiting using Upstash Redis for multiple instances
2. **In-Memory (Development)**: Custom sliding-window limiter for single-instance deployments

**Note**: Upstash Ratelimit requires a Redis backend. The in-memory option is a separate custom implementation, not an LRU cache passed to Upstash.

## IP Address Detection

The rate limiter intelligently detects client IP addresses:

1. **X-Forwarded-For** header (load balancers/proxies)
2. **X-Real-IP** header (reverse proxies)
3. **Fallback**: `127.0.0.1` for development

## Security Features

- **Sliding Window Algorithm**: More accurate than fixed windows
- **IP-based Tracking**: Prevents abuse from individual sources
- **Graceful Degradation**: Falls back to in-memory if Redis unavailable
- **Proxy-aware**: Correctly identifies client IPs behind proxies
- **Type-specific Limits**: Different limits for different operations

## Usage Examples

### Basic API Route

```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from "next/server";
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

async function handleExample(request: NextRequest) {
  return NextResponse.json({ message: "Hello World" });
}

export const GET = rateLimitMiddleware.api(handleExample);
```

### AI-powered Endpoint

```typescript
// app/api/ai/chat/route.ts
import { rateLimitMiddleware } from "@/lib/middleware/rate-limit-middleware";

async function handleAIChat(request: NextRequest) {
  // AI processing logic
  return NextResponse.json({ response: "AI response" });
}

// Strict rate limiting for AI endpoints
export const POST = rateLimitMiddleware.ai(handleAIChat);
```

### Custom Rate Limiting

```typescript
import { createRateLimitedHandler } from "@/lib/middleware/rate-limit-middleware";

const customHandler = createRateLimitedHandler(
  async (request) => {
    return NextResponse.json({ success: true });
  },
  "custom-type", // Uses default rate limits
);

export const GET = customHandler;
```

## Testing

### Running Tests

```bash
npm test -- rate-limiting.test.ts
```

### Test Coverage

- Rate limit configuration validation
- Middleware functionality
- IP address detection
- Error handling
- Header validation
- Different rate limit types

## Monitoring

### Health Check

The `/api/health` endpoint includes rate limiting status:

```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "rateLimit": {
      "enabled": true,
      "provider": "redis"
    }
  }
}
```

### Logging

Rate limiting events are logged for monitoring:

```
Rate limit exceeded for IP 192.168.1.1 on ai endpoint
```

## Production Deployment

### With Redis (Recommended)

1. Set up Upstash Redis account
2. Configure environment variables:
   ```bash
   UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token
   ```
3. Deploy application

### Without Redis

The system automatically falls back to in-memory LRU cache for single-instance deployments.

## Customization

### Modifying Rate Limits

Edit `lib/rate-limit.ts`:

```typescript
export const RATE_LIMIT_CONFIG = {
  default: { requests: 100, window: "1h" },
  api: { requests: 60, window: "1m" },
  // Add custom configurations
  custom: { requests: 25, window: "1m" },
} as const;
```

### Adding New Rate Limit Types

1. Add configuration to `RATE_LIMIT_CONFIG`
2. Create rate limiter in `rateLimiters` object
3. Add middleware function to `rateLimitMiddleware`

## Troubleshooting

### Common Issues

1. **Rate limits too restrictive**: Adjust limits in configuration
2. **Redis connection issues**: Check `UPSTASH_REDIS_REST_URL` and token
3. **Incorrect IP detection**: Verify proxy headers configuration

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` to see rate limiting decisions.

## Security Considerations

- Rate limits are per IP address, not per user
- Consider implementing user-based rate limiting for authenticated endpoints
- Monitor logs for potential abuse patterns
- Adjust limits based on actual usage patterns
- Use Redis in production for consistency across multiple instances
