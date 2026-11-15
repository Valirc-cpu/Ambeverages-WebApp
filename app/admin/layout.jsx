import AdminLayoutClient from '@/components/Admin/AdminLayoutClient';

export const metadata = {
  title: 'Admin Workspace — Ambeverages',
};

export default function AdminLayout({ children }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
