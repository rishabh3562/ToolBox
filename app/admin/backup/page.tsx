'use client';

import { useEffect, useState } from 'react';
import { Button, Input, Space, message, Table } from 'antd';

interface BackupFile { name: string; mtime?: string; size?: number }

export default function AdminBackupPage() {
  const [collection, setCollection] = useState('toolbox');
  const [backupFile, setBackupFile] = useState('');
  const [files, setFiles] = useState<BackupFile[]>([]);
  const [loadingList, setLoadingList] = useState(false);
  const [busy, setBusy] = useState(false);

  const fetchList = async () => {
    setLoadingList(true);
    try {
      const res = await fetch('/api/admin/backup-list');
      if (res.ok) {
        const data = await res.json();
        setFiles(data.files || []);
      }
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleBackup = async () => {
    if (!collection) return message.error('Enter collection');
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/backup?collection=${encodeURIComponent(collection)}`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        message.success('Backup created');
        setBackupFile(data.file);
        fetchList();
      } else {
        message.error(data.error || 'Failed to create backup');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleRestore = async () => {
    if (!collection || !backupFile) return message.error('Enter collection and file');
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/restore?collection=${encodeURIComponent(collection)}&file=${encodeURIComponent(backupFile)}`, { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        message.success('Restore completed');
      } else {
        message.error(data.error || 'Failed to restore');
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2>Backup & Restore</h2>
      <Space direction="vertical" size="middle" style={{ display: 'flex', maxWidth: 700 }}>
        <div>
          <div style={{ marginBottom: 8 }}>Collection</div>
          <Input placeholder="collection" value={collection} onChange={(e) => setCollection(e.target.value)} style={{ maxWidth: 300 }} />
        </div>
        <Space>
          <Button type="primary" onClick={handleBackup} loading={busy}>Create Backup</Button>
          <Input placeholder="backup file name" value={backupFile} onChange={(e) => setBackupFile(e.target.value)} style={{ width: 320 }} />
          <Button danger onClick={handleRestore} loading={busy}>Restore from Backup</Button>
        </Space>
        <div>
          <Space style={{ marginBottom: 8 }}>
            <strong>Backups</strong>
            <Button size="small" onClick={fetchList} loading={loadingList}>Refresh</Button>
          </Space>
          <Table
            size="small"
            dataSource={files}
            rowKey="name"
            columns={[
              { title: 'File', dataIndex: 'name' },
              { title: 'Modified', dataIndex: 'mtime' },
              { title: 'Size (bytes)', dataIndex: 'size' },
              { title: 'Action', render: (_: any, row: BackupFile) => (
                <Button onClick={() => setBackupFile(row.name)}>Use</Button>
              )},
            ] as any}
          />
        </div>
      </Space>
    </div>
  );
}
