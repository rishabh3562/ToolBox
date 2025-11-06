/**
 * Admin Backup API - App Router
 * Creates and manages database backups stored in MongoDB
 *
 * IMPORTANT: This now stores backups in MongoDB instead of file system
 * This ensures backups work properly in serverless environments like Vercel
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Backup from '@/lib/db/models/Backup';
import mongoose from 'mongoose';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * GET /api/admin/backup
 * List all backups
 */
export const GET = withAdmin(async (req, session) => {
  await connectDB();

  const backups = await Backup.find()
    .select('collection createdAt size metadata createdBy')
    .populate('createdBy', 'name email')
    .sort({ createdAt: -1 })
    .limit(50)
    .lean();

  return NextResponse.json({
    backups: backups.map(b => ({
      id: b._id,
      collection: b.collection,
      createdAt: b.createdAt,
      size: b.size,
      documentCount: b.metadata.documentCount,
      createdBy: b.createdBy,
    }))
  });
});

/**
 * POST /api/admin/backup?collection=xxx
 * Create a new backup of specified collection
 */
export async function POST(req: NextRequest) {
  const sessionOrError = await withAdmin(async (r, s) => {
    return NextResponse.json({ session: s });
  })(req);

  if (sessionOrError.status !== 200) {
    return sessionOrError;
  }

  const sessionData = await sessionOrError.json();
  const session = sessionData.session;

  await connectDB();

  const { searchParams } = new URL(req.url);
  const collection = searchParams.get('collection');

  if (!collection) {
    return NextResponse.json(
      { error: 'Missing collection query parameter' },
      { status: 400 }
    );
  }

  try {
    // Ensure MongoDB connection is ready
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI!);
    }

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database connection not initialized');
    }

    // Fetch all documents from the collection
    const data = await db.collection(collection).find().toArray();

    // Calculate size
    const dataString = JSON.stringify(data);
    const size = Buffer.byteLength(dataString, 'utf8');

    // Store backup in MongoDB
    const backup = await Backup.create({
      collection,
      data,
      createdBy: session.user.id,
      size,
      metadata: {
        documentCount: data.length,
        compressed: false,
      }
    });

    return NextResponse.json({
      message: 'Backup created successfully',
      backup: {
        id: backup._id,
        collection: backup.collection,
        documentCount: data.length,
        size: backup.size,
        createdAt: backup.createdAt,
      }
    });
  } catch (error) {
    console.error('Backup creation error:', error);
    return NextResponse.json(
      { error: 'Failed to create backup' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/backup?id=xxx
 * Delete a backup
 */
export async function DELETE(req: NextRequest) {
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

  const backup = await Backup.findByIdAndDelete(id);

  if (!backup) {
    return NextResponse.json(
      { error: 'Backup not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: 'Backup deleted successfully',
  });
}
