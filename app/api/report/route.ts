/**
 * Report API - App Router
 * Allows users to report inappropriate content
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import Report from '@/lib/db/models/Report';

/**
 * POST /api/report
 * Submit a content report
 */
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  await connectDB();

  const body = await req.json();
  const { contentId, reason } = body;

  if (!contentId || !reason) {
    return NextResponse.json(
      { error: 'Missing contentId or reason' },
      { status: 400 }
    );
  }

  const report = new Report({
    userId: (session.user as any).id,
    contentId,
    reason,
    createdAt: new Date(),
  });

  await report.save();

  return NextResponse.json({ message: 'Report submitted successfully' });
}
