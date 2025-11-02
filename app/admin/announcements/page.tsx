'use client';

import { useEffect, useState } from 'react';
import { Form, Input, Button, message, Table, Switch, DatePicker } from 'antd';

interface AnnouncementRow {
  _id: string;
  title: string;
  message: string;
  published?: boolean;
  startsAt?: string;
  endsAt?: string;
  createdAt?: string;
}

export default function AdminAnnouncementsPage() {
  const [form] = Form.useForm();
  const [rows, setRows] = useState<AnnouncementRow[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAnnouncements = async () => {
    const res = await fetch('/api/admin/announcements');
    if (res.ok) {
      const data = await res.json();
      setRows(data);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const onFinish = async (values: { title: string; message: string; published?: boolean; startsAt?: any; endsAt?: any }) => {
    setLoading(true);
    const payload = {
      ...values,
      startsAt: values.startsAt ? values.startsAt.toISOString?.() : undefined,
      endsAt: values.endsAt ? values.endsAt.toISOString?.() : undefined,
    };
    const res = await fetch('/api/admin/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (res.ok) {
      message.success('Announcement created');
      form.resetFields();
      fetchAnnouncements();
    } else {
      const err = await res.json().catch(() => ({}));
      message.error(err.error || 'Failed to create announcement');
    }
  };

  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Message', dataIndex: 'message' },
    { title: 'Published', dataIndex: 'published', render: (v: boolean) => (v ? 'Yes' : 'No') },
    { title: 'Starts', dataIndex: 'startsAt' },
    { title: 'Ends', dataIndex: 'endsAt' },
    { title: 'Created', dataIndex: 'createdAt' },
  ];

  return (
    <div>
      <h2>Announcements</h2>
      <Form form={form} layout="vertical" onFinish={onFinish} style={{ maxWidth: 640 }} initialValues={{ published: true }}>
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="message" label="Message" rules={[{ required: true }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item name="published" label="Published" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item name="startsAt" label="Starts">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="endsAt" label="Ends">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Create Announcement
          </Button>
        </Form.Item>
      </Form>

      <Table style={{ marginTop: 24 }} dataSource={rows} columns={columns as any} rowKey="_id" />
    </div>
  );
}
