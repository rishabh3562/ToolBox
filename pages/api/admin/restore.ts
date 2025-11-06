import type { NextApiRequest, NextApiResponse } from 'next';
import { adminMiddleware } from '@/lib/middleware/adminMiddleware';
import { connectDB } from '@/lib/db/connection';
import fs from 'fs/promises';
import path from 'path';
import mongoose from 'mongoose';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!(await adminMiddleware(req, res))) return;
  await connectDB();

  if (req.method === 'POST') {
    const { collection, file } = req.query as { collection?: string; file?: string };
    if (!collection || !file) return res.status(400).json({ error: 'Missing collection or file query param' });

    try {
      const backupPath = path.join(process.cwd(), 'backups', file);
      const content = await fs.readFile(backupPath, 'utf8');
      const data = JSON.parse(content);
      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not initialized');
      await db.collection(collection).insertMany(data);
      return res.status(200).json({ message: 'Restore completed' });
    } catch (error) {
      console.error('Error restoring backup:', error);
      return res.status(500).json({ error: 'Failed to restore backup' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
