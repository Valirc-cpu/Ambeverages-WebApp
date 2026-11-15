import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, price, stock, category, description, image_url, is_active } = body;

    if (!sql) {
      return NextResponse.json({ success: true });
    }

    const [updated] = await sql`
      UPDATE drinks
      SET 
        name = ${name},
        price = ${Number(price)},
        stock = ${Number(stock)},
        category = ${category || 'Ambmanggo'},
        description = ${description || null},
        image = ${image_url || null},
        is_active = ${is_active !== undefined ? Boolean(is_active) : true},
        updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    return NextResponse.json({ success: true, drink: updated });
  } catch (error) {
    console.error('Error updating drink:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { stock } = body;

    if (!sql) {
      return NextResponse.json({ success: true, stock });
    }

    const [updated] = await sql`
      UPDATE drinks
      SET stock = ${Math.max(0, Number(stock))}, updated_at = NOW()
      WHERE id = ${id}
      RETURNING id, stock
    `;

    return NextResponse.json({ success: true, drink: updated });
  } catch (error) {
    console.error('Error updating stock:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    if (!sql) {
      return NextResponse.json({ success: true });
    }

    await sql`DELETE FROM drinks WHERE id = ${id}`;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting drink:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
