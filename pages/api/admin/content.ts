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

  if (req.method === 'GET') {
    const { status = 'pending', featured, q } = req.query as { status?: string; featured?: string; q?: string };
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (typeof featured !== 'undefined') filter.featured = featured === 'true';
    if (q) filter.title = { $regex: q, $options: 'i' };
    const content = await Content.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(content);
  }

  if (req.method === 'PUT') {
    const { id } = req.query as { id?: string };
    const { action, ids } = req.body as { action?: 'approve' | 'reject' | 'reorder'; ids?: string[] };
    if (!action) return res.status(400).json({ error: 'Missing action' });

    // Bulk update
    if (Array.isArray(ids) && ids.length > 0) {
      const update: any = action === 'approve' ? { status: 'approved' } : { status: 'rejected' };
      const result = await Content.updateMany({ _id: { $in: ids } }, { $set: update });
      return res.status(200).json({ message: 'Bulk content updated', matched: (result as any).matchedCount ?? 0, modified: (result as any).modifiedCount ?? 0 });
    }

    // Reorder featured list
    if (action === 'reorder') {
      const { order } = req.body as { order?: { id: string; featuredOrder: number }[] };
      if (!order) return res.status(400).json({ error: 'Missing order' });
      const bulk = order.map(o => ({ updateOne: { filter: { _id: o.id }, update: { $set: { featuredOrder: o.featuredOrder } } } }));
      if (bulk.length) await Content.bulkWrite(bulk as any);
      return res.status(200).json({ message: 'Order updated' });
    }

    // Single update by id in query
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const doc = await Content.findById(id);
    if (!doc) return res.status(404).json({ error: 'Content not found' });
    if (action === 'approve') doc.status = 'approved';
    if (action === 'reject') doc.status = 'rejected';
    await doc.save();

    const session = await getServerSession(req, res, authOptions);
    await Log.create({ userId: (session?.user as any)?.id, action: `CONTENT_${action.toUpperCase()}` as any, details: JSON.stringify({ id }) });
    return res.status(200).json({ message: 'Content updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
