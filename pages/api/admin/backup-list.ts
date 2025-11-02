import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import fs from 'fs/promises';
import path from 'path';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;

  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const dir = path.join(process.cwd(), 'backups');
    const entries = await fs.readdir(dir, { withFileTypes: true }).catch(() => [] as any);
    const stats = await Promise.all(
      entries
        .filter((e: any) => e.isFile())
        .map(async (e: any) => {
          const p = path.join(dir, e.name);
          const s = await fs.stat(p);
          return { name: e.name, mtime: s.mtime.toISOString?.() || String(s.mtime), size: s.size };
        })
    );
    stats.sort((a, b) => (a.mtime > b.mtime ? -1 : 1));
    return res.status(200).json({ files: stats });
  } catch (err) {
    console.error('backup-list error', err);
    return res.status(500).json({ error: 'Failed to list backups' });
  }
}