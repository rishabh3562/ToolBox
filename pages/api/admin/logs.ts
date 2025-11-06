import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import Log from '@/lib/db/models/Log';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'GET') {
    const { limit = '100' } = req.query as { limit?: string };
    const n = Math.min(parseInt(limit as string, 10) || 100, 500);
    const logs = await Log.find({}).sort({ createdAt: -1 }).limit(n).lean();
    return res.status(200).json(logs);
  }

  return res.status(405).json({ error: 'Method not allowed' });
}