"use client";

import { useEffect, useState } from 'react';
import { Table, Button, Popconfirm, Tag, message, Select, Input, Space, Modal, Form } from 'antd';

interface ToolRow {
  _id: string;
  name: string;
  description?: string;
  userId?: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
}

export default function AdminToolsPage() {
  const [rows, setRows] = useState<ToolRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [q, setQ] = useState('');
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<ToolRow | null>(null);
  const [form] = Form.useForm();

  const fetchQueue = async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (q) params.set('q', q);
    const res = await fetch(`/api/admin/tools?${params.toString()}`);
    if (!res.ok) {
      message.error('Failed to load tools');
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
  }, [status, q]);

  const approve = async (row: ToolRow, bodyExtra: any = {}) => {
    const res = await fetch(`/api/admin/tools?id=${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'approve', ...bodyExtra }),
    });
    if (res.ok) {
      message.success('Approved');
      fetchQueue();
    } else {
      message.error('Failed to approve');
    }
  };

  const reject = async (row: ToolRow, bodyExtra: any = {}) => {
    const res = await fetch(`/api/admin/tools?id=${row._id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reject', ...bodyExtra }),
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
    const res = await fetch('/api/admin/tools', {
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

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Status', dataIndex: 'status', render: (s: string) => {
      const color = s === 'pending' ? 'orange' : s === 'approved' ? 'green' : s === 'changes_requested' ? 'gold' : 'red';
      return <Tag color={color}>{s}</Tag>;
    } },
    { title: 'Description', dataIndex: 'description' },
    { title: 'Actions', render: (_: any, row: ToolRow) => (
      <>
        <Button onClick={() => { setActive(row); form.resetFields(); setOpen(true); }} style={{ marginRight: 8 }}>View</Button>
        <Button type="primary" onClick={() => approve(row)} style={{ marginRight: 8 }}>Approve</Button>
        <Popconfirm title="Reject this tool?" onConfirm={() => reject(row)}>
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
      <h2>Tools Approval</h2>
      <Space style={{ marginBottom: 12 }} wrap>
        <Select
          value={status}
          onChange={setStatus as any}
          options={[
            { value: 'pending', label: 'Pending' },
            { value: 'approved', label: 'Approved' },
            { value: 'rejected', label: 'Rejected' },
            { value: 'changes_requested', label: 'Changes Requested' },
            { value: 'all', label: 'All' },
          ]}
          style={{ width: 180 }}
        />
        <Input.Search placeholder="Search name" allowClear value={q} onChange={(e) => setQ(e.target.value)} style={{ width: 220 }} />
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

      <Modal
        open={open}
        title={active ? `Review: ${active.name}` : 'Review'}
        onCancel={() => setOpen(false)}
        footer={null}
      >
        <p><strong>Description:</strong></p>
        <p style={{ whiteSpace: 'pre-wrap' }}>{active?.description}</p>
        <Form form={form} layout="vertical">
          <Form.Item name="notes" label="Notes to author">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="reason" label="Rejection reason">
            <Input />
          </Form.Item>
          <Space>
            <Button type="primary" onClick={async () => { const v = await form.validateFields().catch(()=>null); if (!active) return; await approve(active, v || {}); setOpen(false); }}>Approve</Button>
            <Button danger onClick={async () => { const v = await form.validateFields().catch(()=>null); if (!active) return; await reject(active, v || {}); setOpen(false); }}>Reject</Button>
            <Button onClick={async () => { const v = await form.validateFields().catch(()=>null); if (!active) return; await fetch(`/api/admin/tools?id=${active._id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'request_changes', ...(v||{}) }) }); message.success('Changes requested'); setOpen(false); fetchQueue(); }}>Request Changes</Button>
          </Space>
        </Form>
      </Modal>
    </div>
  );
}
