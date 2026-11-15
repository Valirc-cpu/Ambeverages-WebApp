import { NextResponse } from 'next/server';
import sql from '@/lib/db';

export async function POST(request) {
  try {
    if (!sql) {
      return NextResponse.json({ error: 'Database tidak terhubung.' }, { status: 500 });
    }

    await sql`TRUNCATE TABLE order_items CASCADE`;
    await sql`TRUNCATE TABLE orders CASCADE`;
    await sql`TRUNCATE TABLE drinks CASCADE`;

    return NextResponse.json({
      success: true,
      message: 'Seluruh data minuman, pesanan, dan rincian pesanan di Supabase berhasil dikosongkan.',
    });
  } catch (error) {
    console.error('Error resetting database:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    if (!sql) {
      return new Response('Database tidak terhubung.', { status: 500 });
    }

    await sql`TRUNCATE TABLE order_items CASCADE`;
    await sql`TRUNCATE TABLE orders CASCADE`;
    await sql`TRUNCATE TABLE drinks CASCADE`;

    return new Response(
      `<pre style="background:#121417;color:#fff;padding:24px;border-radius:16px;font-family:monospace;font-size:14px;line-height:1.6;margin:40px auto;max-width:640px;box-shadow:0 10px 30px rgba(0,0,0,0.5);">
<strong>Ambeverages — Reset Database Supabase</strong>
--------------------------------------------------------
[✓] TRUNCATE TABLE order_items (0 baris)
[✓] TRUNCATE TABLE orders (0 baris)
[✓] TRUNCATE TABLE drinks (0 baris)

STATUS: Seluruh data minuman dan pesanan di Supabase berhasil dikosongkan 100%!
Database kini benar-benar bersih dan siap Anda kelola sendiri dari Panel Admin.

Tautan Cepat:
- <a href="/admin/drinks" style="color:#FA4B00;text-decoration:underline;">Buka Kelola Menu Minuman (Admin)</a>
- <a href="/admin/orders" style="color:#FA4B00;text-decoration:underline;">Buka Kelola Pesanan (Admin)</a>
- <a href="/" style="color:#FA4B00;text-decoration:underline;">Buka Halaman Utama Pelanggan</a>
</pre>`,
      { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Error resetting database via GET:', error);
    return new Response('Gagal mengosongkan database: ' + error.message, { status: 500 });
  }
}
