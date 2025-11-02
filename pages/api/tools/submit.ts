import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import Tool from '@/lib/db/models/Tool';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });
  await connectDB();

  if (req.method === 'POST') {
    const { name, description } = req.body as { name?: string; description?: string };
    if (!name || !description) return res.status(400).json({ error: 'Missing name or description' });

    const tool = new Tool({
      name,
      description,
      userId: (session.user as any).id,
      status: 'pending',
      createdAt: new Date(),
    });
    await tool.save();
    return res.status(200).json({ message: 'Tool submitted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
