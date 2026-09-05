// GET /api/products                → seznam viditelných produktů
// GET /api/products?slug=xxx        → detail jednoho produktu
// GET /api/products?category=omega3 → filtrovat podle kategorie
// GET /api/products?recommended=1   → pouze curated pro ANTI AGE HACK cílovku
//
// Data se čtou z HerbPharm Neon Postgres (sdílené DB, jeden zdroj pravdy).
import { sql, setCors, json } from './_lib/db.js';

const RECOMMENDED_SLUGS = [
  'balanceoil-plus-orange-lemon-mint',
  'zinobiotic-plus',
  'zinoshine-plus',
  'xtend-plus',
  'balancetest-omega-6-3',
  'hba1c-test',
  'balanceoil-plus-vita-immunity',
  'viva-plus',
];

const SELECT = `
  select p.id, p.slug, p.name, p.tagline, p.description, p.category,
         p.price, p.list_price, p.unit, p.days_supply, p.dose_per_kg_ml,
         p.volume_ml, p.in_stock, p.stock_count, p.badges, p.sort_order,
         coalesce(
           (select array_agg(i.id order by i.sort_order, i.id)
            from product_images i where i.product_id = p.id),
           '{}'
         ) as image_ids
  from products p
  where p.visible = true
`;

function mapRow(r) {
  return {
    id: Number(r.id),
    slug: r.slug,
    name: r.name,
    tagline: r.tagline,
    description: r.description || [],
    category: r.category,
    price: r.price,
    listPrice: r.list_price,
    unit: r.unit,
    daysSupply: r.days_supply,
    dosePerKgMl: r.dose_per_kg_ml == null ? null : Number(r.dose_per_kg_ml),
    volumeMl: r.volume_ml,
    inStock: r.in_stock,
    stockCount: r.stock_count,
    badges: r.badges || [],
    sortOrder: r.sort_order,
    // Obrázky servírujeme z HerbPharm proxy (šetří traffic + jedno místo)
    images: (r.image_ids || []).filter(Boolean).map((id) => `https://herbpharm.cz/obrazky/${id}`),
    // Deep-link do HerbPharm checkoutu s UTM
    url: `https://herbpharm.cz/produkty/${r.slug}?utm_source=antiagehack&utm_medium=web&utm_campaign=api`,
  };
}

export default async function handler(req, res) {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'GET') return json(res, 405, { error: 'Method not allowed' });

  try {
    const { slug, category, recommended } = req.query || {};

    if (slug) {
      const rows = await sql(`${SELECT} and p.slug = $1 limit 1`, [slug]);
      if (!rows.length) return json(res, 404, { error: 'Product not found' });
      return json(res, 200, mapRow(rows[0]));
    }

    let query = `${SELECT} order by p.sort_order, p.name`;
    let params = [];
    if (category) {
      query = `${SELECT} and p.category = $1 order by p.sort_order, p.name`;
      params = [category];
    }
    let rows = await sql(query, params);
    let items = rows.map(mapRow);

    if (recommended === '1' || recommended === 'true') {
      items = items
        .filter((p) => RECOMMENDED_SLUGS.includes(p.slug))
        .sort((a, b) => RECOMMENDED_SLUGS.indexOf(a.slug) - RECOMMENDED_SLUGS.indexOf(b.slug));
    }

    // Krátká edge cache – produkty se mění zřídka
    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=3600');
    return json(res, 200, { items, count: items.length });
  } catch (err) {
    console.error('[api/products]', err);
    return json(res, 500, { error: 'DB error', message: err.message });
  }
}
