import type { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import Tool from '@/lib/db/models/Tool';
import { evaluateSpam } from '@/lib/services/spam';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user) return res.status(401).json({ error: 'Unauthorized' });
  await connectDB();

  if (req.method === 'POST') {
    const { name, description } = req.body as { name?: string; description?: string };
    if (!name || !description) return res.status(400).json({ error: 'Missing name or description' });

    let spam: { isSpam: boolean; score: number; reasons: string[] } = { isSpam: false, score: 0, reasons: [] };
    if (process.env.ENABLE_SPAM_CHECK === 'true') {
      const evalRes = await evaluateSpam({
        content: `${name}\n${description}`,
        ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || undefined,
        userAgent: req.headers['user-agent'] as string,
        authorEmail: (session.user as any).email,
        authorName: (session.user as any).name,
      });
      spam = { isSpam: evalRes.score >= 5 || evalRes.akismet === 'spam', score: evalRes.score, reasons: evalRes.reasons };
    }

    const tool = new Tool({
      name,
      description,
      userId: (session.user as any).id,
      status: 'pending',
      isSpam: spam.isSpam,
      spamScore: spam.score,
      spamReasons: spam.reasons,
      createdAt: new Date(),
    });
    await tool.save();
    return res.status(200).json({ message: 'Tool submitted' });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
