'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function AdminHome() {
  const items = [
    { href: '/admin/users', label: 'User Management' },
    { href: '/admin/tools', label: 'Tools Approval' },
    { href: '/admin/content', label: 'Content Moderation' },
    { href: '/admin/announcements', label: 'Announcements' },
    { href: '/admin/featured', label: 'Featured Content' },
    { href: '/admin/backup', label: 'Backup/Restore' },
    { href: '/admin/logs', label: 'Audit Logs' },
  ];

  const [health, setHealth] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch('/api/health');
        const data = await res.json();
        setHealth(data.data || data);
      } catch {}
      setLoading(false);
    })();
  }, []);

  const uptime = useMemo(() => {
    const s = Number(health?.uptime ?? health?.data?.uptime ?? 0);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = Math.floor(s % 60);
    return s ? `${h}h ${m}m ${ss}s` : '-';
  }, [health]);

  const cards = [
    { title: 'Status', value: loading ? 'loading…' : health?.status || 'unknown' },
    { title: 'Uptime', value: uptime },
    { title: 'Version', value: health?.version || '-' },
    { title: 'Environment', value: health?.environment || health?.data?.environment || '-' },
    { title: 'Database', value: health?.services?.database || '-' },
    { title: 'Redis', value: health?.services?.redis || '-' },
    { title: 'AI Service', value: health?.services?.ai || '-' },
    { title: 'Rate Limit', value: health?.rateLimit ? `${health.rateLimit.provider}` : '-' },
  ];

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <h2>Admin Dashboard</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {cards.map((c) => (
          <div key={c.title} style={{ padding: 12, border: '1px solid #e5e7eb', borderRadius: 8 }}>
            <div style={{ color: '#6b7280', fontSize: 12 }}>{c.title}</div>
            <div style={{ fontSize: 18, fontWeight: 600 }}>{String(c.value)}</div>
          </div>
        ))}
      </div>
      <div>
        <ul>
          {items.map((i) => (
            <li key={i.href}>
              <Link href={i.href}>{i.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
