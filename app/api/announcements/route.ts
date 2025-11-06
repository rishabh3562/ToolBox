import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connection';
import Announcement from '@/lib/db/models/Announcement';

export async function GET() {
  await connectDB();
  const now = new Date();
  const items = await Announcement.find({
    published: true,
    $and: [
      { $or: [{ startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: { $exists: false } }, { endsAt: { $gte: now } }] },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  return NextResponse.json({ success: true, data: items });
}
