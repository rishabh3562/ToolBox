/**
 * Tool Submission API - App Router
 * Allows users to submit new tools for review
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectDB } from '@/lib/db/connection';
import Tool from '@/lib/db/models/Tool';

/**
 * POST /api/tools/submit
 * Submit a new tool for review
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
  const { name, description } = body;

  if (!name || !description) {
    return NextResponse.json(
      { error: 'Missing name or description' },
      { status: 400 }
    );
  }

  const tool = new Tool({
    name,
    description,
    userId: (session.user as any).id,
    status: 'pending',
    createdAt: new Date(),
  });

  await tool.save();

  return NextResponse.json({ message: 'Tool submitted successfully' });
}
