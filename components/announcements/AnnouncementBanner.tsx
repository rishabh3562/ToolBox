"use client";

import { useEffect, useState } from 'react';

type Announcement = { _id: string; title: string; message: string };

export default function AnnouncementBanner() {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/announcements');
        const data = await res.json();
        setItems(data.data || []);
      } catch {}
    })();
  }, []);

  if (!items.length) return null;

  return (
    <div style={{ background: '#fffbeb', borderBottom: '1px solid #f59e0b', padding: '8px 12px' }}>
      {items.map((a) => (
        <div key={a._id} style={{ marginBottom: 6 }}>
          <strong>{a.title}: </strong>
          <span>{a.message}</span>
        </div>
      ))}
    </div>
  );
}
