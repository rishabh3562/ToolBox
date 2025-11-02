import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import Announcement from '@/lib/db/models/Announcement';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'GET') {
    const items = await Announcement.find({}).sort({ createdAt: -1 }).limit(50).lean();
    return res.status(200).json(items);
  }

  if (req.method === 'POST') {
    const { title, message, published, startsAt, endsAt } = req.body as { title?: string; message?: string; published?: boolean; startsAt?: string; endsAt?: string };
    if (!title || !message) return res.status(400).json({ error: 'Missing title or message' });
    const announcement = new Announcement({
      title,
      message,
      published: typeof published === 'boolean' ? published : true,
      startsAt: startsAt ? new Date(startsAt) : undefined,
      endsAt: endsAt ? new Date(endsAt) : undefined,
    });
    await announcement.save();
    return res.status(200).json({ message: 'Announcement created' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
