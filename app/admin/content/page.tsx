'use client';

import { useEffect, useMemo, useState } from 'react';
import { Table, Button, Popconfirm, Switch, Tag, message, Select, Input, Space } from 'antd';

interface ContentRow {
  _id: string;
  title: string;
  body?: string;
  userId?: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  featured?: boolean;
  createdAt?: string;
}

export default function AdminContentPage() {
  const [rows, setRows] = useState<ContentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [q, setQ] = useState('');
  const [onlyFeatured, setOnlyFeatured] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchQueue = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    if (onlyFeatured) params.set('featured', 'true');
    const res = await fetch(`/api/admin/content?${params.toString()}`);
    if (!res.ok) {
      message.error('Failed to load content');
      setRows([]);
      setLoading(false);
      return;
    }
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchQueue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, q, onlyFeatured]);

  const approve = async (row: ContentRow) => {
    const res = await fetch(`/api/admin/content?id=${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve' }),
    });
    if (res.ok) {
      message.success('Approved');
      fetchQueue();
    } else {
      message.error('Failed to approve');
    }
  };

  const reject = async (row: ContentRow) => {
    const res = await fetch(`/api/admin/content?id=${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject' }),
    });
    if (res.ok) {
      message.success('Rejected');
      fetchQueue();
    } else {
      message.error('Failed to reject');
    }
  };

  const bulkAction = async (action: 'approve' | 'reject') => {
    if (selectedRowKeys.length === 0) return;
    const res = await fetch('/api/admin/content', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action, ids: selectedRowKeys }),
    });
    if (res.ok) {
      message.success(`Bulk ${action} complete`);
      setSelectedRowKeys([]);
      fetchQueue();
    } else {
      message.error(`Bulk ${action} failed`);
    }
  };

  const toggleFeatured = async (row: ContentRow, featured: boolean) => {
    const res = await fetch(`/api/admin/content/${row._id}/featured`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ featured }),
    });
    if (res.ok) {
      message.success('Updated featured');
      fetchQueue();
    } else {
      message.error('Failed to update featured');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => <Tag color={s === 'pending' ? 'orange' : s === 'approved' ? 'green' : 'red'}>{s}</Tag> },
    { title: 'Featured', dataIndex: 'featured', render: (_: any, row: ContentRow) => (
      <Switch checked={!!row.featured} onChange={(checked) => toggleFeatured(row, checked)} />
    ) },
    { title: 'Actions', render: (_: any, row: ContentRow) => (
      <>
        <Button type="primary" onClick={() => approve(row)} style={{ marginRight: 8 }}>Approve</Button>
        <Popconfirm title="Reject this item?" onConfirm={() => reject(row)}>
          <Button danger>Reject</Button>
        </Popconfirm>
      </>
    ) },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  };

  return (
    <div>
      <h2>Content Moderation</h2>
      <Space style={{ marginBottom: 12 }} wrap>
        <Select
          value={status}
          onChange={setStatus as any}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'all', label: 'All' },
          ]}
          style={{ width: 140 }}
        />
        <Input.Search placeholder="Search title" allowClear value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
        <Button type={onlyFeatured ? 'primary' : 'default'} onClick={() => setOnlyFeatured((v) => !v)}>
          {onlyFeatured ? 'Featured: On' : 'Featured: Off'}
        </Button>
        <Button onClick={() => bulkAction('approve')} disabled={selectedRowKeys.length === 0} type="primary">
          Bulk Approve
        </Button>
        <Button onClick={() => bulkAction('reject')} disabled={selectedRowKeys.length === 0} danger>
          Bulk Reject
        </Button>
      </Space>
      <Table
        loading={loading}
        dataSource={rows}
        columns={columns as any}
        rowKey="_id"
        rowSelection={rowSelection}
      />
    </div>
  );
}
