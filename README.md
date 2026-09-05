# ANTI AGE HACK

Strukturovaný 26týdenní program životního stylu pro muže 45–60 let. Pět pilířů, biometrický tracker, cílená suplementace.

## 🏗️ Struktura

```
/                         Public landing (konverze, lead capture)
/login                    Přihlášení
/register                 Registrace
/onboarding               5-otázkový vstupní dotazník
/app/dashboard            Member dashboard (Vitality Score, 5 pilířů)
/app/biometrics           Biometrický tracker (HRV, VO2, glukóza, spánek)
/app/protocol             Denní protokol (rutina, suplementy, regenerace)
/legal/privacy            Zásady ochrany osobních údajů
/legal/terms              Obchodní podmínky
/legal/contact            Kontakt + provozovatel

/assets/tailwind-config.js   Sdílená Tailwind konfigurace
/assets/app.css              Sdílené styly (glass cards, helix bg, buttons)
/assets/app.js               Klientská logika (storage, API, lead form, FAQ)
```

## 🎨 Design system

- **Vibe**: Medical-Tech, glassmorphism, deep slate
- **Fonts**: Inter (UI), Geist (data, labels)
- **Colors**: Primary `#8aebff`, Secondary `#4de082`, Background `#0b1326`
- **Source**: `stitch_anti_age_hack_protocol/precision_longevity/DESIGN.md`

## 🔌 Eshopsys integrace

Frontend volá Eshopsys backend pro auth + member data. Konfigurace je v `assets/app.js`:

```js
AAH.config = {
  API_BASE: 'https://api.eshopsys.com',
  TENANT_ID: 'anti-age-hack',
};
```

Klíčové endpointy (viz Eshopsys repo):
- `POST /auth/register` – registrace s GDPR consenty
- `POST /auth/login` – login → JWT token
- `POST /quiz/submit` – odeslání vstupního dotazníku
- `GET /members/dashboard` – data pro dashboard
- `GET /members/my-membership` – status členství
- `POST /members/activate-trial` – aktivace zkušebního období

## ⚖️ Compliance

Stránka prodává doplňky stravy. Všechen marketing copy splňuje:
- **Nařízení EU 1924/2006** (health claims)
- **Nařízení EU 432/2012** (registr povolených zdravotních tvrzení)
- **Nařízení EU 1169/2011** (informace pro spotřebitele)
- **Vyhláška 58/2018 Sb.** (doplňky stravy)
- **Zákon 40/1995 Sb.** (regulace reklamy, § 5d zákaz disease claims)
- **Nařízení 2016/679 (GDPR)** – consent forms, právní šablony

### Pravidlo: pouze povolené EU registry claims na látky
- Vitamin D → „přispívá k normální funkci svalů a imunitního systému"
- Vitamin K → „přispívá k udržení normálního stavu kostí"
- EPA + DHA (≥250 mg/d) → „přispívá k normální činnosti srdce"
- DHA (≥250 mg/d) → „přispívá k udržení normální činnosti mozku"
- Niacin (B3) → „přispívá ke snížení míry únavy a vyčerpání"
- Hořčík → „přispívá k normální činnosti svalů"

### Pravidlo: žádné neautorizované claims
Před každou změnou copy projít EU Register of nutrition and health claims
(https://ec.europa.eu/food/safety/labelling-and-nutrition/claims/register).
Bez položky v registru → claim nesmí být použit ani parafrázován.
Disease prevention/treatment claims jsou vždy zakázané (§ 5d zák. 40/1995).

### Compliance proces při změnách obsahu
1. Žádné claims na konkrétní zdravotní výsledky (čísla redukcí, % zlepšení vitálních funkcí, snížení rizika nemoci, antiage efekty bez EU registru).
2. Žádné názvy nemocí v marketing kontextu.
3. U jednotlivých látek pouze EU registry claim (viz výše).
4. Testimoniály – pouze subjektivní zkušenosti, nikoliv konkrétní zdravotní čísla.
5. Disclaimer na každé stránce s doplňky stravy a member trackerem.
6. GDPR consent u všech form submissions s odkazem na zásady.


## 🗄️ Napojení na Neon DB (HerbPharm)

Frontend čte produkty a zapisuje objednávky přímo do sdílené Neon Postgres databáze HerbPharm. **Jedna DB, dva frontendy** – ceny, dostupnost i objednávky vidíš na jednom místě v HerbPharm admin panelu.

### Setup ve Vercelu (jednorázově)

1. **Vercel Dashboard** → antiagehack → **Settings** → **Environment Variables**
2. Přidej proměnnou:
   - **Name**: `DATABASE_URL`
   - **Value**: pooled connection string z Neonu (zkopíruj ho z HerbPharm projektu – měl by končit `-pooler.eu-central-1.aws.neon.tech/neondb?sslmode=require`)
   - **Environments**: Production, Preview, Development
3. Redeploy: `vercel --prod` (nebo push do main)

### API endpointy

| Endpoint | Metoda | Účel |
|---|---|---|
| `/api/products` | GET | Všechny viditelné produkty |
| `/api/products?slug=xxx` | GET | Detail jednoho produktu |
| `/api/products?category=omega3` | GET | Filtr podle kategorie |
| `/api/products?recommended=1` | GET | 8 curated pro ANTI AGE HACK cílovku |
| `/api/orders` | POST | Vytvoří objednávku v `orders` + `order_items` |
| `/api/quiz` | POST | Uloží quiz výsledek do `quiz_results` + upsert customer |

### Kde se objednávky objeví

Po POST `/api/orders` se objednávka zapíše do stejné `orders` tabulky, kterou používá HerbPharm. **Admin panel HerbPharm** (`/admin/objednavky`) je uvidí okamžitě – rozlišíš je podle sloupce `source = 'antiagehack-shop'`.

Odesílání mailů (Resend) probíhá v HerbPharm pipeline; případně přidej `RESEND_API_KEY` i sem, když budeš chtít maily posílat přímo z ANTI AGE HACK.

## 🚀 Deploy

### Vercel (doporučeno)

```bash
# První deploy
vercel

# Production deploy
vercel --prod
```

`vercel.json` zajišťuje:
- Clean URLs (žádné `.html` v URL)
- Bezpečnostní hlavičky (X-Frame-Options, CSP)
- Redirecty pro krátké URL (`/dashboard` → `/app/dashboard`)
- Cache pro `/assets/*`

### GitHub
```bash
git push origin main
```

Vercel autodeployuje při push do main, pokud je propojen s GitHub repem.

## ✅ Před spuštěním na produkci doplnit

- [ ] **Provozovatel** – jméno, IČO, sídlo (v patičce + legal stránkách)
- [ ] **E-maily** – `hello@`, `support@`
- [ ] **Datumy účinnosti** – Privacy + VOP
- [ ] **Reálné testimoniály** – nahradit fiktivní jména
- [ ] **API endpoint** – nastavit produkční Eshopsys URL
- [ ] **Tenant** v Eshopsys – `anti-age-hack` musí existovat
- [ ] **CORS** – povolit produkční doménu v Eshopsys backend
- [ ] **Stripe** – setup payment links pro trial → paid
- [ ] **Email service** – připojit Resend / SendGrid pro magic links
- [ ] **Cookie consent banner** – přidat (doporučujeme Cookiebot / vlastní)
- [ ] **Tailwind production build** – nahradit CDN za build pipeline (rychlost + offline)
- [ ] **Reálné supplement balíčky** – ověřit dávkování (Omega-3 EPA+DHA min. 250 mg/d)

## 🔐 Bezpečnost

- JWT token v `localStorage` (zvážit `httpOnly` cookie pro produkci)
- HTTPS only (zajištěno Vercel)
- GDPR consent vyžadován u všech form submits
- Žádný PII v URL
- Compliance disclaimery na každé stránce

## 📜 Licence

Proprietary © 2026 ANTI AGE HACK. Všechna práva vyhrazena.
