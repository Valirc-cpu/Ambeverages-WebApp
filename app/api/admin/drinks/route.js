import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, price, stock, category, description, image_url } = body;

    if (!name || price === undefined || stock === undefined) {
      return NextResponse.json({ error: 'Nama, harga, dan stok wajib diisi.' }, { status: 422 });
    }

    if (!sql) {
      return NextResponse.json({ success: true, message: 'Simulated success (dev mode)' });
    }

    // Ensure image column is TEXT to store large base64 data URLs without VARCHAR(255) limitation
    try {
      await sql`ALTER TABLE drinks ALTER COLUMN image TYPE TEXT`;
    } catch {}

    const [newDrink] = await sql`
      INSERT INTO drinks (name, price, stock, category, description, image, is_active, created_at, updated_at)
      VALUES (
        ${name},
        ${Number(price)},
        ${Number(stock)},
        ${category || 'Ambmanggo'},
        ${description || null},
        ${image_url || null},
        true,
        NOW(),
        NOW()
      )
      RETURNING *
    `;

    return NextResponse.json({ 
      success: true, 
      drink: {
        ...newDrink,
        image_url: newDrink.image || null,
        formatted_price: 'Rp ' + Number(newDrink.price).toLocaleString('id-ID'),
      } 
    });
  } catch (error) {
    console.error('Error creating drink:', error);
    return NextResponse.json({ error: 'Gagal menambahkan minuman: ' + error.message }, { status: 500 });
  }
}
