import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import Log from '@/lib/db/models/Log';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'GET') {
    const users = await User.find().select('name email role banned isAdmin createdAt').lean();
    return res.status(200).json(users);
  }

  if (req.method === 'PATCH') {
    const { id, banned, role, isAdmin } = req.body as { id?: string; banned?: boolean; role?: string; isAdmin?: boolean };
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const updates: any = {};
    if (typeof banned !== 'undefined') updates.banned = !!banned;
    if (typeof role !== 'undefined') updates.role = role;
    if (typeof isAdmin !== 'undefined') updates.isAdmin = !!isAdmin;
    const user = await User.findByIdAndUpdate(id, updates, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await getServerSession(req, res, authOptions);
    await Log.create({ userId: (session?.user as any)?.id, action: 'USER_UPDATE', details: JSON.stringify({ id, updates }) });
    return res.status(200).json({ message: 'User updated' });
  }

  if (req.method === 'DELETE') {
    const { id } = req.query as { id?: string };
    if (!id) return res.status(400).json({ error: 'Missing id' });
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const session = await getServerSession(req, res, authOptions);
    await Log.create({ userId: (session?.user as any)?.id, action: 'USER_DELETE', details: JSON.stringify({ id }) });
    return res.status(200).json({ message: 'User deleted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
