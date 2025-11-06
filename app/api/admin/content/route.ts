/**
 * Admin Content API - App Router
 * Manages content moderation, approval, and featuring
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Content from '@/lib/db/models/Content';
import Log from '@/lib/db/models/Log';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * GET /api/admin/content?status=pending&featured=true&q=search
 * List content with filtering
 */
export async function GET(req: NextRequest) {
  const sessionOrError = await withAdmin(async (r, s) => {
    return NextResponse.json({ session: s });
  })(req);

  if (sessionOrError.status !== 200) {
    return sessionOrError;
  }

  await connectDB();

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') || 'pending';
  const featured = searchParams.get('featured');
  const q = searchParams.get('q');

  const filter: any = {};
  if (status && status !== 'all') filter.status = status;
  if (featured !== null) filter.featured = featured === 'true';
  if (q) filter.title = { $regex: q, $options: 'i' };

  const content = await Content.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ content });
}

/**
 * PUT /api/admin/content?id=xxx
 * Update content (approve, reject, reorder)
 */
export async function PUT(req: NextRequest) {
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
  const id = searchParams.get('id');

  const body = await req.json();
  const { action, ids, order } = body;

  if (!action) {
    return NextResponse.json(
      { error: 'Missing action' },
      { status: 400 }
    );
  }

  // Bulk update
  if (Array.isArray(ids) && ids.length > 0) {
    const update: any =
      action === 'approve'
        ? { status: 'approved' }
        : { status: 'rejected' };

    const result = await Content.updateMany(
      { _id: { $in: ids } },
      { $set: update }
    );

    return NextResponse.json({
      message: 'Bulk content updated',
      matched: (result as any).matchedCount ?? 0,
      modified: (result as any).modifiedCount ?? 0,
    });
  }

  // Reorder featured list
  if (action === 'reorder') {
    if (!order || !Array.isArray(order)) {
      return NextResponse.json(
        { error: 'Missing order array' },
        { status: 400 }
      );
    }

    const bulk = order.map((o: any) => ({
      updateOne: {
        filter: { _id: o.id },
        update: { $set: { featuredOrder: o.featuredOrder } },
      },
    }));

    if (bulk.length) {
      await Content.bulkWrite(bulk as any);
    }

    return NextResponse.json({ message: 'Order updated' });
  }

  // Single update by id
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id' },
      { status: 400 }
    );
  }

  const doc = await Content.findById(id);

  if (!doc) {
    return NextResponse.json(
      { error: 'Content not found' },
      { status: 404 }
    );
  }

  if (action === 'approve') doc.status = 'approved';
  if (action === 'reject') doc.status = 'rejected';

  await doc.save();

  // Log the action
  await Log.create({
    userId: session.user.id,
    action: `CONTENT_${action.toUpperCase()}`,
    details: JSON.stringify({ id }),
  });

  return NextResponse.json({ message: 'Content updated' });
}
