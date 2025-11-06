/**
 * Admin Tools API - App Router
 * Manages tool submissions, approvals, and reviews
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Tool from '@/lib/db/models/Tool';
import Log from '@/lib/db/models/Log';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * GET /api/admin/tools?status=pending&q=search
 * List tools with filtering
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
  const q = searchParams.get('q');

  const filter: any = {};
  if (status && status !== 'all') filter.status = status;
  if (q) filter.name = { $regex: q, $options: 'i' };

  const tools = await Tool.find(filter)
    .sort({ createdAt: -1 })
    .lean();

  return NextResponse.json({ tools });
}

/**
 * PUT /api/admin/tools?id=xxx
 * Update tool (approve, reject, request changes)
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
  const { action, ids, notes, reason } = body;

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
        : action === 'reject'
        ? { status: 'rejected' }
        : { status: 'changes_requested' };

    const result = await Tool.updateMany(
      { _id: { $in: ids } },
      { $set: update }
    );

    // Log bulk action
    await Log.create({
      userId: session.user.id,
      action: `TOOL_BULK_${action.toUpperCase()}`,
      details: JSON.stringify({ ids }),
    });

    return NextResponse.json({
      message: 'Bulk tools updated',
      matched: (result as any).matchedCount ?? 0,
      modified: (result as any).modifiedCount ?? 0,
    });
  }

  // Single update by id
  if (!id) {
    return NextResponse.json(
      { error: 'Missing id' },
      { status: 400 }
    );
  }

  const tool = await Tool.findById(id);

  if (!tool) {
    return NextResponse.json(
      { error: 'Tool not found' },
      { status: 404 }
    );
  }

  if (action === 'approve') tool.status = 'approved';
  if (action === 'reject') tool.status = 'rejected';
  if (action === 'request_changes') tool.status = 'changes_requested';

  // Update review metadata
  tool.review = {
    reviewerId: session.user.id,
    reviewerEmail: session.user.email,
    reviewedAt: new Date(),
    notes: notes || tool.review?.notes,
    rejectionReason: reason || tool.review?.rejectionReason,
  } as any;

  await tool.save();

  // Log the action
  await Log.create({
    userId: session.user.id,
    action: `TOOL_${action.toUpperCase()}`,
    details: JSON.stringify({ id, notes, reason }),
  });

  return NextResponse.json({ message: 'Tool updated' });
}
