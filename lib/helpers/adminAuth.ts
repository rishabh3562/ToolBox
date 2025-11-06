/**
 * Admin Authentication Helper for App Router
 *
 * Provides admin authentication and authorization for App Router API routes
 */

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { NextResponse } from 'next/server';

export interface AdminSession {
  user: {
    id: string;
    email: string;
    name?: string;
    isAdmin: boolean;
  };
}

/**
 * Verify that the current session is an admin
 * Returns the session if valid, or null if not
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return null;
  }

  const user = session.user as any;

  if (!user.isAdmin) {
    return null;
  }

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      isAdmin: user.isAdmin,
    }
  };
}

/**
 * Require admin authentication
 * Returns the session if authenticated, or an error response
 *
 * Usage:
 * ```typescript
 * const sessionOrError = await requireAdmin();
 * if (sessionOrError instanceof NextResponse) return sessionOrError;
 * // Now sessionOrError is AdminSession
 * ```
 */
export async function requireAdmin(): Promise<AdminSession | NextResponse> {
  const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized - Admin access required' },
      { status: 401 }
    );
  }

  return session;
}

/**
 * Wrapper for admin-only route handlers
 * Automatically handles authentication and only calls handler if admin
 *
 * Usage:
 * ```typescript
 * export const GET = withAdmin(async (req, session) => {
 *   // Your handler code here
 *   return NextResponse.json({ data: [] });
 * });
 * ```
 */
export function withAdmin<T extends any[]>(
  handler: (request: Request, session: AdminSession, ...args: T) => Promise<NextResponse>
) {
  return async (request: Request, ...args: T): Promise<NextResponse> => {
    const sessionOrError = await requireAdmin();

    if (sessionOrError instanceof NextResponse) {
      return sessionOrError;
    }

    try {
      return await handler(request, sessionOrError, ...args);
    } catch (error) {
      console.error('Admin route error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
