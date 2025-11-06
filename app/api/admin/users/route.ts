/**
 * Admin Users API - App Router
 * Manages user accounts, bans, roles, and permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import User from '@/lib/db/models/User';
import Log from '@/lib/db/models/Log';
import { withAdmin } from '@/lib/helpers/adminAuth';

/**
 * GET /api/admin/users
 * List all users
 */
export const GET = withAdmin(async (req, session) => {
  await connectDB();

  const users = await User.find()
    .select('name email role banned isAdmin createdAt')
    .lean();

  return NextResponse.json(users);
});

/**
 * PATCH /api/admin/users
 * Update user (ban, role, admin status)
 */
export const PATCH = withAdmin(async (req, session) => {
  await connectDB();

  const body = await req.json();
  const { id, banned, role, isAdmin } = body;

  if (!id) {
    return NextResponse.json(
      { error: 'Missing user id' },
      { status: 400 }
    );
  }

  // Build updates object
  const updates: any = {};
  if (typeof banned !== 'undefined') updates.banned = !!banned;
  if (typeof role !== 'undefined') updates.role = role;
  if (typeof isAdmin !== 'undefined') updates.isAdmin = !!isAdmin;

  // Update user
  const user = await User.findByIdAndUpdate(id, updates, { new: true });

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Log the action
  await Log.create({
    userId: session.user.id,
    action: 'USER_UPDATE',
    details: JSON.stringify({ id, updates }),
  });

  return NextResponse.json({
    message: 'User updated successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      banned: user.banned,
      isAdmin: user.isAdmin,
    }
  });
});

/**
 * DELETE /api/admin/users?id=xxx
 * Delete a user account
 */
export async function DELETE(req: NextRequest) {
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

  if (!id) {
    return NextResponse.json(
      { error: 'Missing user id' },
      { status: 400 }
    );
  }

  // Delete user
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  // Log the action
  await Log.create({
    userId: session.user.id,
    action: 'USER_DELETE',
    details: JSON.stringify({ id, email: user.email }),
  });

  return NextResponse.json({
    message: 'User deleted successfully',
  });
}
