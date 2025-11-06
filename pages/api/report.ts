import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import Report from '@/lib/db/models/Report';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });
  await connectDB();

  if (req.method === 'POST') {
    const { contentId, reason } = req.body as { contentId?: string; reason?: string };
    if (!contentId || !reason) return res.status(400).json({ error: 'Missing contentId or reason' });
    const report = new Report({
      userId: (session.user as any).id,
      contentId,
      reason,
      createdAt: new Date(),
    });
    await report.save();
    return res.status(200).json({ message: 'Report submitted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
