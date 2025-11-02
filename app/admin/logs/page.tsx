'use client';

import { useEffect, useState } from 'react';
import { Table } from 'antd';

interface LogRow {
  _id: string;
  userId?: string;
  action: string;
  details?: string;
  createdAt?: string;
}

export default function AdminLogsPage() {
  const [rows, setRows] = useState<LogRow[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/logs');
    if (res.ok) {
      const data = await res.json();
      setRows(data);
    } else {
      setRows([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const columns = [
    { title: 'Time', dataIndex: 'createdAt' },
    { title: 'User', dataIndex: 'userId' },
    { title: 'Action', dataIndex: 'action' },
    { title: 'Details', dataIndex: 'details' },
  ];

  return (
    <div>
      <h2>Audit Logs</h2>
      <Table loading={loading} dataSource={rows} columns={columns as any} rowKey="_id" />
    </div>
  );
}