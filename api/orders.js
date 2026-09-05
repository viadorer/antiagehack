// POST /api/orders  -> create order in HerbPharm Neon DB
// Body: { customer, items, shipping, source?, consentMarketing? }
import { sql, setCors, json } from './_lib/db.js';

function genOrderNumber() {
  const now = new Date();
  const ymd = now.toISOString().slice(0, 10).replaceAll('-', '');
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AAH-${ymd}-${rand}`;
}

function validEmail(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || ''); }
function validPhone(s) { return /^\+?[\d\s\-\/]{6,20}$/.test(s || ''); }

export default async function handler(req, res) {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { customer = {}, items = [], shipping = {}, source = 'antiagehack-shop', consentMarketing = false } = body;

    if (!customer.name || !customer.email || !customer.phone || !customer.address) {
      return json(res, 400, { error: 'Chybí povinné údaje zákazníka' });
    }
    if (!validEmail(customer.email)) return json(res, 400, { error: 'Neplatný e-mail' });
    if (!validPhone(customer.phone)) return json(res, 400, { error: 'Neplatný telefon' });
    if (!Array.isArray(items) || items.length === 0) return json(res, 400, { error: 'Prázdný košík' });
    if (!shipping.id) return json(res, 400, { error: 'Chybí způsob dopravy' });

    const slugs = items.map(it => String(it.slug)).filter(Boolean);
    const products = await sql(
      `select id, slug, name, price, cost_price, in_stock from products where slug = any($1::text[]) and visible = true`,
      [slugs],
    );
    if (products.length !== slugs.length) return json(res, 400, { error: 'Neznámý produkt v košíku' });
    const bySlug = Object.fromEntries(products.map(p => [p.slug, p]));

    const orderItems = items.map(it => {
      const p = bySlug[it.slug];
      if (!p.in_stock) throw new Error('OUT_OF_STOCK:' + p.name);
      const qty = Math.max(1, Math.min(20, parseInt(it.quantity || 1, 10)));
      return { slug: p.slug, name: p.name, unitPrice: p.price, unitCost: p.cost_price, quantity: qty };
    });
    const subtotal = orderItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);
    const shippingPrice = Math.max(0, parseInt(shipping.price || 0, 10));
    const total = subtotal + shippingPrice;

    const existing = await sql`select id from customers where email = ${customer.email} limit 1`;
    let customerId;
    if (existing.length) {
      customerId = existing[0].id;
      await sql`update customers set name = coalesce(${customer.name}, name), phone = coalesce(${customer.phone}, phone), consent_marketing = ${!!consentMarketing}, updated_at = now() where id = ${customerId}`;
    } else {
      const inserted = await sql`insert into customers (email, name, phone, consent_marketing) values (${customer.email}, ${customer.name}, ${customer.phone}, ${!!consentMarketing}) returning id`;
      customerId = inserted[0].id;
    }

    const orderNumber = genOrderNumber();
    const pickup = customer.pickup || {};
    const inserted = await sql`
      insert into orders (order_number, customer_id, name, email, phone, address, note, shipping_id, shipping_price, total, status, source, pickup_point_id, pickup_point_name, pickup_carrier_id, pickup_carrier_point_id)
      values (${orderNumber}, ${customerId}, ${customer.name}, ${customer.email}, ${customer.phone}, ${customer.address}, ${customer.note || null}, ${shipping.id}, ${shippingPrice}, ${total}, 'nova', ${source}, ${pickup.id || null}, ${pickup.name || null}, ${pickup.carrierId || null}, ${pickup.carrierPointId || null})
      returning id`;
    const orderId = inserted[0].id;

    for (const [idx, it] of orderItems.entries()) {
      await sql`insert into order_items (order_id, product_slug, product_name, unit_price, unit_cost, quantity, sort_order) values (${orderId}, ${it.slug}, ${it.name}, ${it.unitPrice}, ${it.unitCost || null}, ${it.quantity}, ${idx})`;
    }

    return json(res, 201, { orderNumber, total, subtotal, shippingPrice, itemsCount: orderItems.length, status: 'nova' });
  } catch (err) {
    console.error('[api/orders]', err);
    if (err.message && err.message.startsWith('OUT_OF_STOCK:')) {
      return json(res, 409, { error: 'Produkt je vyprodán', productName: err.message.split(':')[1] });
    }
    return json(res, 500, { error: 'Chyba při vytváření objednávky', message: err.message });
  }
}
