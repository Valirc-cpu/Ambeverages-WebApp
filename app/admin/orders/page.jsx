import { getAdminOrders } from '@/lib/data';
import OrdersClient from '@/components/Admin/OrdersClient';

export const revalidate = 0;

export default async function AdminOrdersPage() {
  const { orders, stats } = await getAdminOrders();

  return <OrdersClient initialOrders={orders} initialStats={stats} />;
}
