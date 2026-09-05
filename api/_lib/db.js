// Sdílený Neon klient pro Vercel Serverless Functions.
// DATABASE_URL nastavíš ve Vercelu: Settings → Environment Variables.
// Připojujeme se lazy (až při prvním dotazu), abychom nespadli na buildu.
import { neon } from '@neondatabase/serverless';

let client = null;

export function sql(...args) {
  if (!client) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error('DATABASE_URL není nastavená (Vercel → Settings → Environment Variables)');
    }
    client = neon(url);
  }
  return client(...args);
}

// CORS helper – povolí volání z libovolné antiagehack.* domény i lokálu.
export function setCors(res, origin) {
  const allowed = [
    'https://antiagehack.cz',
    'https://www.antiagehack.cz',
    'https://antiagehack.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ];
  const o = origin && allowed.includes(origin) ? origin : allowed[0];
  res.setHeader('Access-Control-Allow-Origin', o);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Vary', 'Origin');
}

// Jednotné JSON response
export function json(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}
