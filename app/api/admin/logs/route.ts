/**
 * Admin Logs API - App Router
 * View audit logs of admin actions
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Log from '@/lib/db/models/Log';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * GET /api/admin/logs
 * List recent audit logs
 */
export const GET = withAdmin(async (req, session) => {
  await connectDB();

  const logs = await Log.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 })
    .limit(100)
    .lean();

  return NextResponse.json({ logs });
});
