'use client';

import { Layout, Menu } from 'antd';
import Link from 'next/link';

const { Header, Content, Footer, Sider } = Layout;

const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Layout>
      <Header style={{ background: '#001529', color: '#fff' }}>
        <h1 style={{ margin: 0 }}>Admin Dashboard</h1>
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#333' }}>
          <Menu mode="inline" defaultSelectedKeys={['/admin']} items={[
            { key: '/admin/users', label: <Link href="/admin/users">User Management</Link> },
            { key: '/admin/tools', label: <Link href="/admin/tools">Tools Approval</Link> },
            { key: '/admin/content', label: <Link href="/admin/content">Content Moderation</Link> },
            { key: '/admin/announcements', label: <Link href="/admin/announcements">Announcements</Link> },
            { key: '/admin/featured', label: <Link href="/admin/featured">Featured</Link> },
            { key: '/admin/backup', label: <Link href="/admin/backup">Backup/Restore</Link> },
          ]} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
          <Content style={{ margin: '24px 0 0', minHeight: 280 }}>
            {children}
          </Content>
        </Layout>
      </Layout>
      <Footer style={{ textAlign: 'center' }}>
        Admin Dashboard ©2025
      </Footer>
    </Layout>
  );
};

export default DashboardLayout;
