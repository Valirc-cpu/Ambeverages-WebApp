import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { customer_name, customer_phone, notes, items } = body;

    if (!customer_name || !customer_phone || !items || items.length === 0) {
      return NextResponse.json({ error: 'Data pemesanan tidak lengkap.' }, { status: 422 });
    }

    // Get drink records to calculate prices accurately
    let drinks = [];
    if (sql) {
      const ids = items.map((i) => i.drink_id);
      drinks = await sql`SELECT id, name, price, stock FROM drinks WHERE id IN ${sql(ids)}`;
    }

    const drinkMap = new Map();
    drinks.forEach((d) => drinkMap.set(d.id, d));

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const drink = drinkMap.get(item.drink_id);
      const price = drink ? Number(drink.price) : 25000;
      const name = drink ? drink.name : `Minuman #${item.drink_id}`;
      const qty = Math.max(1, Number(item.quantity) || 1);
      const subtotal = price * qty;
      totalPrice += subtotal;

      validatedItems.push({
        drink_id: item.drink_id,
        drink_name: name,
        quantity: qty,
        price,
        subtotal,
      });
    }

    // Generate Order Code: AMB-YYYYMMDD-XXXX
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const randStr = Math.floor(1000 + Math.random() * 9000);
    const orderCode = `AMB-${dateStr}-${randStr}`;

    let orderId = Date.now();

    if (sql) {
      const [newOrder] = await sql`
        INSERT INTO orders (order_code, customer_name, customer_phone, notes, total_price, status, created_at, updated_at)
        VALUES (${orderCode}, ${customer_name}, ${customer_phone}, ${notes || null}, ${totalPrice}, 'pending', NOW(), NOW())
        RETURNING id, order_code, customer_name, customer_phone, notes, total_price, status, created_at
      `;
      orderId = newOrder.id;

      for (const item of validatedItems) {
        await sql`
          INSERT INTO order_items (order_id, drink_id, drink_name, quantity, price, subtotal, created_at, updated_at)
          VALUES (${orderId}, ${item.drink_id}, ${item.drink_name}, ${item.quantity}, ${item.price}, ${item.subtotal}, NOW(), NOW())
        `;
      }
    }

    // Construct Clean Human Official WhatsApp Message
    const adminPhone = process.env.WHATSAPP_ADMIN_NUMBER || '6289620378128';
    const cleanAdminPhone = adminPhone.replace(/[^0-9]/g, '');
    const formattedTotal = 'Rp ' + Number(totalPrice).toLocaleString('id-ID');

    let itemLines = '';
    validatedItems.forEach((i, idx) => {
      itemLines += `${idx + 1}. ${i.drink_name} x${i.quantity} (Rp ${Number(i.subtotal).toLocaleString('id-ID')})\n`;
    });

    const notesLine = notes ? `Catatan: ${notes}\n` : '';

    const waText = 
`Halo Admin Ambeverages!
Saya ingin konfirmasi pesanan baru:

Kode Pesanan: ${orderCode}
Nama Pemesan: ${customer_name}
No. WhatsApp: ${customer_phone}

Daftar Minuman:
${itemLines}
Total Pembayaran: ${formattedTotal}
${notesLine}
Mohon segera dikonfirmasi ya. Terima kasih!`;

    const whatsappUrl = `https://wa.me/${cleanAdminPhone}?text=${encodeURIComponent(waText)}`;

    return NextResponse.json({
      success: true,
      order: {
        id: orderId,
        order_code: orderCode,
        customer_name,
        customer_phone,
        total_price: totalPrice,
        formatted_total_price: formattedTotal,
        items: validatedItems,
        whatsapp_url: whatsappUrl,
      },
    });
  } catch (error) {
    console.error('Checkout API error:', error);
    return NextResponse.json({ error: 'Gagal memproses pesanan: ' + error.message }, { status: 500 });
  }
}
