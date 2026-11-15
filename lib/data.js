import sql from './db';

// Fallback initial artisanal drinks if database has no drinks yet
export const DEFAULT_DRINKS = [
  {
    id: 1,
    name: 'Ambmanggo Supreme',
    price: 24000,
    formatted_price: 'Rp 24.000',
    stock: 25,
    category: 'Ambmanggo',
    description: 'Mangga harum manis segar dipadu dengan hint citrus asam manis yang menyegarkan.',
    image_url: 'https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    id: 2,
    name: 'Amberry Sparkling',
    price: 26000,
    formatted_price: 'Rp 26.000',
    stock: 18,
    category: 'Amberry',
    description: 'Campuran buah berry pilihan dengan soda dingin yang meletup segar di tenggorokan.',
    image_url: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
  {
    id: 3,
    name: 'Ambpinaple Tropical',
    price: 22000,
    formatted_price: 'Rp 22.000',
    stock: 30,
    category: 'Ambpinaple',
    description: 'Nanas madu tropis alami berpadu dengan dinginnya es batu artisanal.',
    image_url: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
    is_active: true,
  },
];

export async function getDrinks() {
  if (!sql) return DEFAULT_DRINKS;
  try {
    const rows = await sql`
      SELECT id, name, price, stock, image, description, category, is_active, created_at
      FROM drinks
      WHERE is_active = true
      ORDER BY name ASC
    `;
    if (!rows || rows.length === 0) {
      return DEFAULT_DRINKS;
    }
    return rows.map((drink) => ({
      ...drink,
      image_url: drink.image
        ? (drink.image.startsWith('http') ? drink.image : `/storage/${drink.image}`)
        : null,
      formatted_price: 'Rp ' + Number(drink.price).toLocaleString('id-ID'),
    }));
  } catch (error) {
    console.error('Error fetching drinks:', error);
    return DEFAULT_DRINKS;
  }
}

export async function getAdminDrinks({ search = '', category = 'Semua' } = {}) {
  if (!sql) return { drinks: DEFAULT_DRINKS, categories: ['Ambmanggo', 'Amberry', 'Ambpinaple'], stats: {} };
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
        image_url: drink.image
          ? (drink.image.startsWith('http') ? drink.image : `/storage/${drink.image}`)
          : null,
        formatted_price: 'Rp ' + Number(drink.price).toLocaleString('id-ID'),
      })),
      categories: categories.length ? categories : ['Ambmanggo', 'Amberry', 'Ambpinaple'],
      stats: {
        total_drinks: totalDrinks,
        total_stock: totalStock,
        low_stock: lowStock,
      },
    };
  } catch (error) {
    console.error('Error fetching admin drinks:', error);
    return { drinks: DEFAULT_DRINKS, categories: ['Ambmanggo', 'Amberry', 'Ambpinaple'], stats: {} };
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
