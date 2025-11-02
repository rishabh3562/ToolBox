import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import Tool from '@/lib/db/models/Tool';
import Log from '@/lib/db/models/Log';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'GET') {
    const { status = 'pending', q } = req.query as { status?: string; q?: string };
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (q) filter.name = { $regex: q, $options: 'i' };
    const tools = await Tool.find(filter).sort({ createdAt: -1 }).lean();
    return res.status(200).json(tools);
  }

  if (req.method === 'PUT') {
    const { id } = req.query as { id?: string };
    const { action, ids, notes, reason } = req.body as { action?: 'approve' | 'reject' | 'request_changes'; ids?: string[]; notes?: string; reason?: string };
    if (!action) return res.status(400).json({ error: 'Missing action' });

    const session = await getServerSession(req, res, authOptions);

    // Bulk
    if (Array.isArray(ids) && ids.length > 0) {
      const update: any = action === 'approve' ? { status: 'approved' } : action === 'reject' ? { status: 'rejected' } : { status: 'changes_requested' };
      const result = await Tool.updateMany({ _id: { $in: ids } }, { $set: update });
      await Log.create({ userId: (session?.user as any)?.id, action: `TOOL_BULK_${action.toUpperCase()}`, details: JSON.stringify({ ids }) });
      return res.status(200).json({ message: 'Bulk tools updated', matched: (result as any).matchedCount ?? 0, modified: (result as any).modifiedCount ?? 0 });
    }

    if (!id) return res.status(400).json({ error: 'Missing id' });
    const tool = await Tool.findById(id);
    if (!tool) return res.status(404).json({ error: 'Tool not found' });

    if (action === 'approve') tool.status = 'approved';
    if (action === 'reject') tool.status = 'rejected';
    if (action === 'request_changes') tool.status = 'changes_requested';

    tool.review = {
      reviewerId: (session?.user as any)?.id,
      reviewerEmail: (session?.user as any)?.email,
      reviewedAt: new Date(),
      notes: notes || tool.review?.notes,
      rejectionReason: reason || tool.review?.rejectionReason,
    } as any;

    await tool.save();
    await Log.create({ userId: (session?.user as any)?.id, action: `TOOL_${action.toUpperCase()}`, details: JSON.stringify({ id, notes, reason }) });
    return res.status(200).json({ message: 'Tool updated' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
