/**
 * Admin Restore API - App Router
 * Restores database collections from MongoDB-stored backups
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Backup from '@/lib/db/models/Backup';
import mongoose from 'mongoose';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * POST /api/admin/restore?id=xxx
 * Restore a collection from backup
 */
export async function POST(req: NextRequest) {
  const sessionOrError = await withAdmin(async (r, s) => {
    return NextResponse.json({ session: s });
  })(req);

  if (sessionOrError.status !== 200) {
    return sessionOrError;
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json(
      { error: 'Missing backup id' },
      { status: 400 }
    );
  }

  try {
    // Find the backup
    const backup = await Backup.findById(id);

    if (!backup) {
      return NextResponse.json(
        { error: 'Backup not found' },
        { status: 404 }
      );
    }

    // Ensure MongoDB connection is ready
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not initialized');
    }

    const collection = db.collection(backup.collection);

    // Delete existing data
    await collection.deleteMany({});

    // Restore from backup
    if (backup.data && Array.isArray(backup.data) && backup.data.length > 0) {
      await collection.insertMany(backup.data);
    }

    return NextResponse.json({
      message: 'Backup restored successfully',
      collection: backup.collection,
      documentsRestored: backup.metadata.documentCount,
    });
  } catch (error) {
    console.error('Restore error:', error);
    return NextResponse.json(
      { error: 'Failed to restore backup' },
      { status: 500 }
    );
  }
}
