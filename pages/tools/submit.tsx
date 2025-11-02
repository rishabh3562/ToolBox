import { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import { useRouter } from 'next/router';

const ToolSubmitPage = () => {
  const [form] = Form.useForm();
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const res = await fetch('/api/tools/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(values),
    });
    if (res.ok) {
      message.success('Tool submitted for approval');
      router.push('/tools');
    } else {
      message.error('Failed to submit tool');
    }
  };

  return (
    <Form form={form} onFinish={handleSubmit}>
      <Form.Item name="name" label="Tool Name" rules={[{ required: true }] }>
        <Input />
      </Form.Item>
      <Form.Item name="description" label="Description" rules={[{ required: true }]}>
        <Input.TextArea />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default ToolSubmitPage;
