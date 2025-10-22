/**
 * @jest-environment node
 */

import { NextRequest } from "next/server";
import { withRateLimit, checkRateLimit } from "../lib/middleware/rate-limit-middleware";
import { RATE_LIMIT_CONFIG } from "../lib/rate-limit";

// Mock the rate limiter for testing
jest.mock("../lib/rate-limit", () => ({
  ...jest.requireActual("../lib/rate-limit"),
  rateLimiters: {
    default: {
      limit: jest.fn(),
    },
    api: {
      limit: jest.fn(),
    },
    templates: {
      limit: jest.fn(),
    },
    snippets: {
      limit: jest.fn(),
    },
    ai: {
      limit: jest.fn(),
    },
    auth: {
      limit: jest.fn(),
    },
    upload: {
      limit: jest.fn(),
    },
  },
}));

describe("Rate Limiting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rate Limit Configuration", () => {
    it("should have correct rate limit configurations", () => {
      expect(RATE_LIMIT_CONFIG.default).toEqual({ requests: 100, window: "1h" });
      expect(RATE_LIMIT_CONFIG.api).toEqual({ requests: 60, window: "1m" });
      expect(RATE_LIMIT_CONFIG.templates).toEqual({ requests: 30, window: "1m" });
      expect(RATE_LIMIT_CONFIG.snippets).toEqual({ requests: 50, window: "1m" });
      expect(RATE_LIMIT_CONFIG.ai).toEqual({ requests: 10, window: "1m" });
      expect(RATE_LIMIT_CONFIG.auth).toEqual({ requests: 5, window: "1m" });
      expect(RATE_LIMIT_CONFIG.upload).toEqual({ requests: 20, window: "1m" });
    });
  });

  describe("Rate Limiting Middleware", () => {
    const mockHandler = jest.fn();
    const mockRequest = new NextRequest("http://localhost:3000/api/test", {
      headers: {
        "x-forwarded-for": "192.168.1.1",
      },
    });

    beforeEach(() => {
      mockHandler.mockClear();
    });

    it("should allow requests within rate limit", async () => {
      const { rateLimiters } = require("../lib/rate-limit");
      rateLimiters.default.limit.mockResolvedValue({
        success: true,
        limit: 100,
        remaining: 99,
        reset: Date.now() + 3600000,
      });

      mockHandler.mockResolvedValue(new Response("OK"));

      const response = await withRateLimit(mockRequest, mockHandler, "default");

      expect(rateLimiters.default.limit).toHaveBeenCalledWith("192.168.1.1:default");
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(response.status).toBe(200);
    });

    it("should block requests exceeding rate limit", async () => {
      const { rateLimiters } = require("../lib/rate-limit");
      rateLimiters.default.limit.mockResolvedValue({
        success: false,
        limit: 100,
        remaining: 0,
        reset: Date.now() + 3600000,
      });

      const response = await withRateLimit(mockRequest, mockHandler, "default");

      expect(rateLimiters.default.limit).toHaveBeenCalledWith("192.168.1.1:default");
      expect(mockHandler).not.toHaveBeenCalled();
      expect(response.status).toBe(429);

      const body = await response.json();
      expect(body.error).toBe("Rate limit exceeded");
    });

    it("should add rate limit headers to successful responses", async () => {
      const { rateLimiters } = require("../lib/rate-limit");
      rateLimiters.api.limit.mockResolvedValue({
        success: true,
        limit: 60,
        remaining: 59,
        reset: Date.now() + 60000,
      });

      mockHandler.mockResolvedValue(new Response("OK"));

      const response = await withRateLimit(mockRequest, mockHandler, "api");

      expect(response.headers.get("X-RateLimit-Limit")).toBe("60");
      expect(response.headers.get("X-RateLimit-Remaining")).toBe("59");
      expect(response.headers.get("X-RateLimit-Policy")).toBe("sliding-window");
    });

    it("should handle different rate limit types", async () => {
      const { rateLimiters } = require("../lib/rate-limit");
      
      // Test AI rate limiting (strictest)
      rateLimiters.ai.limit.mockResolvedValue({
        success: true,
        limit: 10,
        remaining: 9,
        reset: Date.now() + 60000,
      });

      mockHandler.mockResolvedValue(new Response("OK"));

      const response = await withRateLimit(mockRequest, mockHandler, "ai");

      expect(rateLimiters.ai.limit).toHaveBeenCalledWith("192.168.1.1:ai");
      expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
    });

    it("should handle rate limiting errors gracefully", async () => {
      const { rateLimiters } = require("../lib/rate-limit");
      rateLimiters.default.limit.mockRejectedValue(new Error("Redis connection failed"));

      mockHandler.mockResolvedValue(new Response("OK"));

      const response = await withRateLimit(mockRequest, mockHandler, "default");

      // Should allow request to proceed if rate limiting fails
      expect(mockHandler).toHaveBeenCalledWith(mockRequest);
      expect(response.status).toBe(200);
    });
  });

  describe("IP Address Detection", () => {
    it("should extract IP from X-Forwarded-For header", () => {
      const { getClientIP } = require("../lib/rate-limit");
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          "x-forwarded-for": "192.168.1.1, 10.0.0.1",
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe("192.168.1.1");
    });

    it("should extract IP from X-Real-IP header", () => {
      const { getClientIP } = require("../lib/rate-limit");
      const request = new NextRequest("http://localhost:3000/api/test", {
        headers: {
          "x-real-ip": "192.168.1.2",
        },
      });

      const ip = getClientIP(request);
      expect(ip).toBe("192.168.1.2");
    });

    it("should fallback to default IP", () => {
      const { getClientIP } = require("../lib/rate-limit");
      const request = new NextRequest("http://localhost:3000/api/test");

      const ip = getClientIP(request);
      expect(ip).toBe("127.0.0.1");
    });
  });
});

describe("Rate Limit Error Responses", () => {
  it("should create proper error response format", () => {
    const { createRateLimitErrorResponse } = require("../lib/rate-limit");
    const result = {
      success: false,
      limit: 10,
      remaining: 0,
      reset: new Date("2024-01-01T12:00:00Z").getTime(),
    };

    const response = createRateLimitErrorResponse(result);

    expect(response.status).toBe(429);
    expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("0");
    expect(response.headers.get("Retry-After")).toBeTruthy();
  });
});
