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
    const { collection } = (req.query || {}) as { collection?: string };
    if (!collection) return res.status(400).json({ error: 'Missing collection query param ?collection=' });

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupFileName = `${collection}-backup-${timestamp}.json`;
    const backupDir = path.join(process.cwd(), 'backups');

    try {
      await fs.mkdir(backupDir, { recursive: true });
    } catch (mkdirError) {
      console.error('Error creating backup directory:', mkdirError);
      return res.status(500).json({ error: 'Failed to create backup directory' });
    }

    const backupFilePath = path.join(backupDir, backupFileName);

    try {
      if (mongoose.connection.readyState !== 1) {
        await mongoose.connect(process.env.MONGODB_URI!);
      }

      const db = mongoose.connection.db;
      if (!db) throw new Error('Database connection not initialized');
      const data = await db.collection(collection).find().toArray();
      await fs.writeFile(backupFilePath, JSON.stringify(data, null, 2));

      return res.status(200).json({ message: 'Backup created', file: backupFileName });
    } catch (error) {
      console.error('Error creating backup:', error);
      return res.status(500).json({ error: 'Failed to create backup' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
