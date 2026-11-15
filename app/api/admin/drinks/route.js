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

    return NextResponse.json({ success: true, drink: newDrink });
  } catch (error) {
    console.error('Error creating drink:', error);
    return NextResponse.json({ error: 'Gagal menambahkan minuman: ' + error.message }, { status: 500 });
  }
}
