'use client';

import { useEffect, useState } from 'react';
import { Table, Button, Switch, Popconfirm, message, Tag } from 'antd';

interface UserRow {
  _id: string;
  name?: string;
  email: string;
  role?: string;
  isAdmin?: boolean;
  banned?: boolean;
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    setRows(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onToggleBan = async (user: UserRow, banned: boolean) => {
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: user._id, banned }),
    });
    if (res.ok) {
      message.success(banned ? 'User banned' : 'User unbanned');
      fetchUsers();
    } else {
      message.error('Failed to update user');
    }
  };

  const onDelete = async (user: UserRow) => {
    const res = await fetch(`/api/admin/users?id=${user._id}`, { method: 'DELETE' });
    if (res.ok) {
      message.success('User deleted');
      fetchUsers();
    } else {
      message.error('Failed to delete user');
    }
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Role', dataIndex: 'role', render: (r: string, row: UserRow) => (row.isAdmin ? <Tag color="geekblue">Admin</Tag> : (r || 'user')) },
    { title: 'Banned', dataIndex: 'banned', render: (_: any, row: UserRow) => (
      <Switch checked={!!row.banned} onChange={(checked) => onToggleBan(row, checked)} />
    ) },
    { title: 'Actions', render: (_: any, row: UserRow) => (
      <Popconfirm title="Delete user?" onConfirm={() => onDelete(row)}>
        <Button danger>Delete</Button>
      </Popconfirm>
    )},
  ];

  return (
    <div>
      <h2>User Management</h2>
      <Table loading={loading} dataSource={rows} columns={columns as any} rowKey="_id" />
    </div>
  );
}
