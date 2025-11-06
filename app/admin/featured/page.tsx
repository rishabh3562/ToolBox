'use client';

import { useEffect, useState } from 'react';
import { Table, InputNumber, DatePicker, Button, message, Space, Tag } from 'antd';
import dayjs from 'dayjs';

interface Row {
  _id: string;
  title: string;
  featuredOrder?: number;
  featuredStart?: string;
  featuredEnd?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
}

export default function AdminFeaturedPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/content?status=approved&featured=true');
    if (!res.ok) {
      message.error('Failed to load');
      setRows([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    data.sort((a: any, b: any) => (a.featuredOrder ?? 0) - (b.featuredOrder ?? 0));
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const saveRow = async (r: Row) => {
    const body: any = {
      featured: true,
      featuredOrder: r.featuredOrder ?? 0,
      featuredStart: r.featuredStart || undefined,
      featuredEnd: r.featuredEnd || undefined,
    };
    const res = await fetch(`/api/admin/content/${r._id}/featured`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      message.success('Saved');
      load();
    } else {
      message.error('Save failed');
    }
  };

  const saveAllOrder = async () => {
    setSaving(true);
    const order = rows.map((r, i) => ({ id: r._id, featuredOrder: r.featuredOrder ?? i }));
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reorder', order }),
    });
    setSaving(false);
    if (res.ok) {
      message.success('Order updated');
      load();
    } else {
      message.error('Failed to update order');
    }
  };

  const columns = [
    { title: 'Order', dataIndex: 'featuredOrder', render: (_: any, r: Row, idx: number) => (
      <InputNumber value={r.featuredOrder ?? idx} onChange={(v) => setRows(rows.map(x => x._id === r._id ? { ...x, featuredOrder: Number(v) } : x))} />
    ) },
    { title: 'Title', dataIndex: 'title' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'approved' ? 'green' : 'orange'}>{s}</Tag> },
    { title: 'Start', dataIndex: 'featuredStart', render: (_: any, r: Row) => (
      <DatePicker
        value={r.featuredStart ? dayjs(r.featuredStart) : undefined}
        onChange={(d) => setRows(rows.map(x => x._id === r._id ? { ...x, featuredStart: d?.toISOString() } : x))}
        showTime
      />
    ) },
    { title: 'End', dataIndex: 'featuredEnd', render: (_: any, r: Row) => (
      <DatePicker
        value={r.featuredEnd ? dayjs(r.featuredEnd) : undefined}
        onChange={(d) => setRows(rows.map(x => x._id === r._id ? { ...x, featuredEnd: d?.toISOString() } : x))}
        showTime
      />
    ) },
    { title: 'Save', render: (_: any, r: Row) => (
      <Button onClick={() => saveRow(r)}>Save</Button>
    )},
  ];

  return (
    <div>
      <h2>Featured Content</h2>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={saveAllOrder} loading={saving}>Save All Order</Button>
        <Button onClick={load}>Refresh</Button>
      </Space>
      <Table loading={loading} dataSource={rows} columns={columns as any} rowKey="_id" />
    </div>
  );
}
