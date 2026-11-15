import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request, { params }) {
  try {
    const { id } = await params;

    if (!sql) {
      return NextResponse.json({ success: true });
    }

    const [order] = await sql`SELECT id, status FROM orders WHERE id = ${id}`;
    if (!order) {
      return NextResponse.json({ error: 'Pesanan tidak ditemukan.' }, { status: 404 });
    }

    // If order was confirmed, restore stock
    if (order.status === 'confirmed') {
      const items = await sql`SELECT drink_id, quantity FROM order_items WHERE order_id = ${id}`;
      for (const item of items) {
        await sql`
          UPDATE drinks 
          SET stock = stock + ${item.quantity}, updated_at = NOW()
          WHERE id = ${item.drink_id}
        `;
      }
    }

    await sql`
      UPDATE orders 
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${id}
    `;

    return NextResponse.json({ success: true, message: 'Pesanan dibatalkan.' });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
