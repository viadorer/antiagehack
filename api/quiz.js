// POST /api/quiz  → uloží výsledek vstupního dotazníku do quiz_results
// Body: { answers, score, category, email?, name?, consentMarketing? }
// Když je e-mail vyplněný, upsertneme i customera (lead capture).
import { sql, setCors, json } from './_lib/db.js';

function validEmail(s) { return !s || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }

export default async function handler(req, res) {
  setCors(res, req.headers.origin);
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') return json(res, 405, { error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const { answers = {}, score = 0, category = '', email = null, name = null, consentMarketing = false } = body;

    if (!answers || typeof answers !== 'object') return json(res, 400, { error: 'Chybí odpovědi' });
    if (email && !validEmail(email)) return json(res, 400, { error: 'Neplatný e-mail' });

    // Score/category odpovídají naší kalkulaci v onboarding.html
    const scoreInt = Math.max(0, Math.min(100, parseInt(score, 10) || 0));
    const bandStr = (category || '').slice(0, 40);
    // mg_per_day není náš quiz relevantní, ukládáme 0 jako placeholder
    // Schema z HerbPharm má mg_per_day + score + band + variant + motivation
    // My používáme jen score + band. Variant = 'anti-age-hack', motivation = data.goal.
    const variant = 'anti-age-hack';
    const motivation = (answers.goal || null);

    let customerId = null;
    if (email) {
      const existing = await sql`select id from customers where email = ${email} limit 1`;
      if (existing.length) {
        customerId = existing[0].id;
        await sql`
          update customers
          set name = coalesce(${name}, name),
              quiz_score = ${scoreInt},
              quiz_band = ${bandStr},
              quiz_variant = ${variant},
              quiz_answers = ${JSON.stringify(answers)}::jsonb,
              consent_marketing = ${!!consentMarketing},
              updated_at = now()
          where id = ${customerId}
        `;
      } else {
        const inserted = await sql`
          insert into customers (email, name, quiz_score, quiz_band, quiz_variant, quiz_answers, consent_marketing)
          values (${email}, ${name}, ${scoreInt}, ${bandStr}, ${variant}, ${JSON.stringify(answers)}::jsonb, ${!!consentMarketing})
          returning id
        `;
        customerId = inserted[0].id;
      }
    }

    await sql`
      insert into quiz_results (customer_id, answers, mg_per_day, score, band, variant, motivation)
      values (${customerId}, ${JSON.stringify(answers)}::jsonb, 0, ${scoreInt}, ${bandStr || 'unknown'}, ${variant}, ${motivation})
    `;

    return json(res, 201, { ok: true, customerId, score: scoreInt, category: bandStr });
  } catch (err) {
    console.error('[api/quiz]', err);
    return json(res, 500, { error: 'Chyba při ukládání dotazníku', message: err.message });
  }
}
