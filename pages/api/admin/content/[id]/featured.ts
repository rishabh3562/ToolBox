import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import Content from '@/lib/db/models/Content';
import Log from '@/lib/db/models/Log';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'PUT') {
    const { id } = req.query as { id?: string };
    const { featured, featuredOrder, featuredStart, featuredEnd } = req.body as { featured?: boolean; featuredOrder?: number; featuredStart?: string; featuredEnd?: string };
    if (!id || typeof featured === 'undefined') return res.status(400).json({ error: 'Missing id or featured' });
    const content = await Content.findById(id);
    if (!content) return res.status(404).json({ error: 'Content not found' });
    content.featured = featured;
    if (typeof featuredOrder !== 'undefined') content.featuredOrder = featuredOrder;
    if (featuredStart) content.featuredStart = new Date(featuredStart);
    if (featuredEnd) content.featuredEnd = new Date(featuredEnd);
    await content.save();

    const session = await getServerSession(req, res, authOptions);
    await Log.create({ userId: (session?.user as any)?.id, action: 'CONTENT_FEATURED', details: JSON.stringify({ id, featured }) });
    return res.status(200).json({ message: 'Featured status updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
