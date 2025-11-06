import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import type { DefaultUser, Session } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Extend the User interface
interface User extends DefaultUser {
  isAdmin?: boolean;
  role?: string;
}

// Override the Session type
interface CustomSession extends Session {
  user?: User; // Make user optional to handle potential null values
}

/**
 * Ensures the requester is an authenticated admin.
 * Returns true if allowed; otherwise writes an error response and returns false.
 */
export async function adminMiddleware(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  try {
    const session = (await getServerSession(req, res, authOptions)) as CustomSession | null;

    if (!session) {
      res.status(401).json({ error: 'Unauthorized: No session found' });
      return false;
    }

    if (!session.user?.isAdmin) {
      res.status(403).json({ error: 'Access denied: Insufficient permissions' });
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in adminMiddleware:', error);
    res.status(500).json({ error: 'Internal Server Error' });
    return false;
  }
}
