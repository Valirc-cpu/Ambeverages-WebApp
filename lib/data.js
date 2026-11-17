import sql from './db';

export function formatImageUrl(image) {
  if (!image) return null;
  let str = String(image).trim();
  if (str.startsWith('/storage/data:')) {
    str = str.replace('/storage/', '');
  }
  if (str.startsWith('data:') || str.startsWith('http://') || str.startsWith('https://') || str.startsWith('/')) {
    return str;
  }
  return `/storage/${str}`;
}

export async function getDrinks() {
  if (!sql) return [];
  try {
    const rows = await sql`
      SELECT id, name, price, stock, image, description, category, is_active, created_at
      FROM drinks
      WHERE is_active = true
      ORDER BY id ASC
    `;

    if (!rows || rows.length === 0) {
      return [];
    }

    return rows.map((drink) => ({
      ...drink,
      image_url: formatImageUrl(drink.image),
      formatted_price: 'Rp ' + Number(drink.price).toLocaleString('id-ID'),
    }));
  } catch (error) {
    console.error('Error fetching drinks:', error);
    return [];
  }
}

export async function getAdminDrinks({ search = '', category = 'Semua' } = {}) {
  if (!sql) {
    return { drinks: [], categories: [], stats: { total_drinks: 0, total_stock: 0, low_stock: 0 } };
  }
  try {
    let rows = await sql`
      SELECT id, name, price, stock, image, description, category, is_active, created_at
      FROM drinks
      ORDER BY created_at DESC
    `;

    if (search) {
      const q = search.toLowerCase();
      rows = rows.filter((d) => d.name?.toLowerCase().includes(q) || d.description?.toLowerCase().includes(q));
    }

    if (category && category !== 'Semua') {
      rows = rows.filter((d) => d.category === category);
    }

    const allDrinks = await sql`SELECT category, stock FROM drinks`;
    const categories = Array.from(new Set(allDrinks.map((d) => d.category).filter(Boolean)));
    const totalDrinks = allDrinks.length;
    const totalStock = allDrinks.reduce((sum, d) => sum + (Number(d.stock) || 0), 0);
    const lowStock = allDrinks.filter((d) => Number(d.stock) <= 5).length;

    return {
      drinks: rows.map((drink) => ({
        ...drink,
        image_url: formatImageUrl(drink.image),
        formatted_price: 'Rp ' + Number(drink.price).toLocaleString('id-ID'),
      })),
      categories: categories.length ? categories : ['Ambanas', 'Amberry', 'Ambanggo'],
      stats: {
        total_drinks: totalDrinks,
        total_stock: totalStock,
        low_stock: lowStock,
      },
    };
  } catch (error) {
    console.error('Error fetching admin drinks:', error);
    return { drinks: [], categories: [], stats: { total_drinks: 0, total_stock: 0, low_stock: 0 } };
  }
}

export async function getAdminOrders({ status = 'all', search = '', page = 1, perPage = 10 } = {}) {
  if (!sql) return { orders: { data: [], total: 0, from: 0, to: 0, links: [] }, stats: {} };
  try {
    let orderRows = await sql`
      SELECT id, order_code, customer_name, customer_phone, notes, total_price, status, confirmed_at, created_at
      FROM orders
      ORDER BY created_at DESC
    `;

    const allOrders = [...orderRows];

    if (status && status !== 'all') {
      orderRows = orderRows.filter((o) => o.status === status);
    }

    if (search) {
      const q = search.toLowerCase();
      orderRows = orderRows.filter(
        (o) => o.order_code?.toLowerCase().includes(q) || o.customer_name?.toLowerCase().includes(q)
      );
    }

    // Attach items
    const orderIds = orderRows.map((o) => o.id);
    let items = [];
    if (orderIds.length > 0) {
      items = await sql`
        SELECT id, order_id, drink_id, drink_name, quantity, price, subtotal
        FROM order_items
        WHERE order_id IN ${sql(orderIds)}
      `;
    }

    const itemsByOrder = {};
    for (const item of items) {
      if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
      itemsByOrder[item.order_id].push({
        ...item,
        formatted_subtotal: 'Rp ' + Number(item.subtotal).toLocaleString('id-ID'),
      });
    }

    const total = orderRows.length;
    const startIndex = (page - 1) * perPage;
    const paginatedOrders = orderRows.slice(startIndex, startIndex + perPage).map((o) => ({
      ...o,
      formatted_total_price: 'Rp ' + Number(o.total_price).toLocaleString('id-ID'),
      items: itemsByOrder[o.id] || [],
    }));

    const pendingOrders = allOrders.filter((o) => o.status === 'pending').length;
    const confirmedOrders = allOrders.filter((o) => o.status === 'confirmed').length;
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders
      .filter((o) => o.status === 'confirmed')
      .reduce((sum, o) => sum + (Number(o.total_price) || 0), 0);

    return {
      orders: {
        data: paginatedOrders,
        total,
        from: total > 0 ? startIndex + 1 : 0,
        to: Math.min(startIndex + perPage, total),
        per_page: perPage,
        current_page: page,
        last_page: Math.ceil(total / perPage) || 1,
      },
      stats: {
        pending_orders: pendingOrders,
        confirmed_orders: confirmedOrders,
        total_orders: totalOrders,
        total_revenue: totalRevenue,
        formatted_total_revenue: 'Rp ' + Number(totalRevenue).toLocaleString('id-ID'),
      },
    };
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return { orders: { data: [], total: 0, from: 0, to: 0, links: [] }, stats: {} };
  }
}

// In-memory fallback if sql is unavailable
const memorySettings = {
  is_catalog_open: true,
};

export async function getStoreSettings() {
  if (!sql) return { ...memorySettings };
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const rows = await sql`
      SELECT key, value
      FROM store_settings
      WHERE key = 'is_catalog_open'
      LIMIT 1
    `;

    if (rows && rows.length > 0) {
      const isOpen = rows[0].value === 'true';
      memorySettings.is_catalog_open = isOpen;
      return { is_catalog_open: isOpen };
    }

    return { is_catalog_open: true };
  } catch (error) {
    console.error('Error fetching store settings:', error);
    return { ...memorySettings };
  }
}

export async function setCatalogOpenStatus(isOpen) {
  const boolVal = Boolean(isOpen);
  memorySettings.is_catalog_open = boolVal;

  if (!sql) return true;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS store_settings (
        key VARCHAR(50) PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    const val = boolVal ? 'true' : 'false';
    await sql`
      INSERT INTO store_settings (key, value, updated_at)
      VALUES ('is_catalog_open', ${val}, NOW())
      ON CONFLICT (key) DO UPDATE
      SET value = ${val}, updated_at = NOW()
    `;

    return true;
  } catch (error) {
    console.error('Error updating catalog status:', error);
    return false;
  }
}

