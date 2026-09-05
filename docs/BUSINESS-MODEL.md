# ANTI AGE HACK — Obchodní model (v1)

Rozhodnuto 2026-09-05. Tento dokument je zdroj pravdy pro web, ceník i priority vývoje.
Změny modelu se dělají nejdřív tady, teprve pak na webu.

## Rozhodnutí (zafixováno)

| Otázka | Rozhodnutí |
|---|---|
| Motor byznysu | **Model C: Protokol first** — hlavní jednotka prodeje je Startovní protokol (produkty + program v ceně), koučink je upsell |
| Tvář programu | **David osobně** (jméno, foto, bio v sekci O nás) |
| Platby | **Přes HerbPharm** (objednávka, převod, Zásilkovna, admin) — Eshopsys Stripe až později |
| Kapacita koučinku | **3–5 h týdně** → měsíční check-iny, max ~20 souběžných klientů s vedením |

## Role systémů

```
ANTI AGE HACK (antiagehack.cz)   ZNAČKA + AKVIZICE + COACH FRONT
  landing → quiz → skóre → prodej Startovního protokolu
  nahrazuje stránku „coach" v Eshopsys

ESHOPSYS                         OBSAH PROGRAMU (member area)
  denní rutiny, kurzy, 26 týdnů, tiery
  zatím NENAPOJUJEME — přístup se aktivuje ručně po objednávce

HERBPHARM (herbpharm.cz + Neon)  PRODUKTY + OBJEDNÁVKY + PENÍZE
  Zinzino produkty, checkout, Zásilkovna, admin
  antiagehack do něj zapisuje přes /api/orders (sdílená Neon DB)
```

## Produktová pyramida

### 0) Zdarma — Vstupní dotazník + Skóre vitality
Lead magnet. Už funguje (onboarding.html, /api/quiz).

### 1) Vstup — STARTOVNÍ PROTOKOL ⭐ (hlavní produkt)
Obsah balíčku:
- **BalanceTest** — změření poměru Omega-6:3 na startu
- **4× BalanceOil+** — 120denní protokol dle metodiky (0,15 ml/kg/den)
- **Přístup do 26týdenního programu** (Eshopsys) v ceně

Hodnota jednotlivě: 1 479 + 4× 979 = **5 395 Kč** + program.
Návrh ceny bundle: **4 990 Kč** (potvrdit). Úspora 405 Kč + program „zdarma".

Positioning: *„Nekupujete olej. Kupujete měřitelný 120denní protokol."*
Diferenciace proti nákupu Zinzina kdekoli jinde = program + vedení + retest.

### 2) Retence — Pokračování po 120 dnech
- **Retest** (druhý BalanceTest) → klient vidí posun svého čísla
- **Měsíční doplňování** BalanceOil+ (~979 Kč/měs) — recurring
- HerbPharm už umí `refill_due_at` a „komu dochází zboží" → aktivně oslovovat

### 3) Premium — OSOBNÍ VEDENÍ (upsell, limitovaná kapacita)
- Měsíční 30min 1:1 check-in + podpora, po dobu 26 týdnů
- Kapacita: 20 klientů × 30 min/měs = 10 h/měs ≈ 2,5 h/týden (sedí do 3–5 h)
- Návrh ceny: **24 900 Kč / 26 týdnů** (potvrdit)
- Scarcity je reálná → na webu komunikovat „max 20 klientů"

## Cesta klienta

1. Reklama/obsah → antiagehack.cz
2. Quiz (5 otázek) → Skóre vitality + priority
3. **CTA: Startovní protokol** → objednávka přes /api/orders (source=`antiagehack-protokol`)
4. Fulfillment: HerbPharm odešle test + oleje; **ručně** aktivace programu v Eshopsys
5. Týdny 1–26: program v member area, denní rutiny
6. Den ~120: nabídka retestu → viditelný posun čísla → pokračovací subscription
7. ~10 % klientů: upsell Osobní vedení

## Ekonomika (vzorec, čísla doplnit z reálných nákupních cen)

Na klienta Startovního protokolu:
- Tržba bundle: 4 990 Kč
- Náklad: nákupní ceny Zinzino (cost_price v HerbPharm DB) + doprava
- Marže produktová: dle Zinzino partner podmínek (doplnit %)
- Retence: +979 Kč/měs × průměrná délka (cíl 6+ měsíců)
- Upsell koučink: 24 900 Kč × ~10 % klientů

Cíl roku 1 (konzervativně): 100 protokolů + 10 koučinků
= ~499 000 (protokoly) + ~249 000 (koučink) + recurring doplňky.

## Co z toho plyne pro web (TODO)

1. **Přestavět pricing sekci**: místo 3 tierů (Essentials/Standard/Premium)
   → **Startovní protokol** jako hero produkt + **Osobní vedení** jako druhá karta
2. **Quiz výsledek**: hlavní CTA = Startovní protokol bundle (ne jednotlivé produkty)
3. **HerbPharm admin**: založit produkt `startovni-protokol` (kategorie `sady`, cena 4 990)
   → pak jde objednat přes existující /api/orders bez dalšího kódu
4. **Sekce O nás**: doplnit Davidovo jméno, foto, bio (podklady dodá David)
5. **Kapacita**: u Osobního vedení uvést „max 20 klientů" (pravdivé)
6. **Retest flow**: e-mail v den ~110 („změřte si posun") — až bude e-mail pipeline

## Otevřené položky (čekají na Davida)

- [ ] Potvrdit cenu Startovního protokolu (návrh 4 990 Kč)
- [ ] Potvrdit cenu Osobního vedení (návrh 24 900 Kč / 26 týdnů)
- [ ] Dodat foto + bio + kvalifikace pro sekci O nás
- [ ] Založit `startovni-protokol` v HerbPharm adminu (nebo dodat cost_price, založím SQL)
- [ ] Provozovatel (jméno/IČO/sídlo) do patičky a legal stránek
- [ ] DATABASE_URL do Vercel env (aby /api/* běželo na produkci)
