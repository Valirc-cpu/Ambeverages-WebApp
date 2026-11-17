import { NextResponse } from 'next/server';
import { getStoreSettings, setCatalogOpenStatus } from '@/lib/data';

export async function GET() {
  try {
    const settings = await getStoreSettings();
    return NextResponse.json({
      success: true,
      is_catalog_open: settings.is_catalog_open,
    });
  } catch (error) {
    console.error('Error in GET /api/admin/store-status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { is_catalog_open } = body;

    if (typeof is_catalog_open !== 'boolean') {
      return NextResponse.json(
        { error: 'Parameter is_catalog_open harus berupa boolean (true atau false).' },
        { status: 400 }
      );
    }

    const result = await setCatalogOpenStatus(is_catalog_open);
    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Gagal memperbarui status katalog ke database.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      is_catalog_open,
      message: is_catalog_open
        ? 'Katalog minuman berhasil DIBUKA untuk umum.'
        : 'Katalog minuman berhasil DITUTUP dari akses umum.',
    });
  } catch (error) {
    console.error('Error in POST /api/admin/store-status:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
