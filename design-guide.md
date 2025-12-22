# ANTI AGE HACK - Design Guide & Obrazová Strategie

## 1. BAREVNÁ PALETA (Medical Green-Gold)

### Primary Colors
```
Tmavě zelená (Primary): #2d5016
Zlatá (Accent): #d4af37
Světle zelená (Background): #e8f5e1
```

### Supporting Colors
```
Text - Dark: #1a1a1a
Text - Medium: #4a4a4a
Text - Light: #666666
Background White: #ffffff
Background Subtle: #fafafa
```

### Gradient Kombinace
```css
/* Hero gradient */
background: linear-gradient(135deg, #e8f5e1 0%, #ffffff 100%);

/* CTA gradient */
background: linear-gradient(135deg, #2d5016 0%, #1a3a0d 100%);

/* Button gradient */
background: linear-gradient(135deg, #d4af37 0%, #c9a236 100%);

/* Number/Badge gradient */
background: linear-gradient(135deg, #2d5016 0%, #d4af37 100%);
```

---

## 2. LOGO SPECIFIKACE

**Hlavní logo:** DNA helix (zeleno-zlatá)
- Formát: PNG s průhledným pozadím
- Rozměry: 
  - Desktop hero: 180px šířka
  - Mobile hero: 140px šířka
  - Favicon: 512×512px
- Umístění: `/images/anti-age-hack-dna-logo.png`

**Logo variace:**
- Plná verze: DNA helix + text "ANTI AGE HACK"
- Icon only: Pouze DNA helix (pro favicon, social media)
- Inverted: Bílá verze pro tmavé pozadí

---

## 3. OBRAZOVÁ STRATEGIE

### 3.1 Kde použít obrázky (Priority)

**Hero sekce:**
- DNA helix logo (už máš)
- Případně: Full-width hero background (subtle DNA pattern)

**Science sekce:**
- Ikony pro každý research box:
  * Epigenetické hodiny → DNA spiral icon
  * Autofagie → Cell regeneration icon
  * VO2 Max → Heart rate / fitness icon
- Rozměry: 48×48px, jednoduchá line art, zeleno-zlatá

**5 Hacků sekce:**
- Pro každý hack ikona nebo ilustrace:
  * H1 (Metabolický): Hourglass / Clock
  * H2 (Pohybový): Muscle / Heart
  * H3 (Spánkový): Moon / Brain
  * H4 (Stresový): Fire / Ice
  * H5 (Suplementační): Pills / DNA supplement
- Styl: Medical illustration, minimalistické
- Rozměry: 64×64px nebo 80×80px

**Testimonial/Case study:**
- Before/after fotky (s consent)
- Nebo: Data visualization (blood markers improvement)
- Rozměry: 400×300px landscape

### 3.2 Typy obrázků, které NEPOTŘEBUJEŠ

❌ Stock fotky smějících se lidí v posilovně
❌ Generic "wellness" imagery  
❌ Celebrity endorsements
❌ Overwhelming infografiky
❌ Příliš mnoho různých stylů

✅ Méně obrázků, větší dopad
✅ Konzistentní medicínská estetika
✅ Data visualizations
✅ Simple iconography

---

## 4. IMAGE PLACEHOLDER SPECIFIKACE

### Pro landing page potřebuješ tyto obrázky:

#### 4.1 HERO SECTION
```
Soubor: hero-dna-background.png (optional)
Rozměry: 1920×600px
Popis: Subtle DNA pattern na pozadí, opacity 5-10%
Barvy: Light green (#e8f5e1) s golden highlights
Použití: CSS background-image v .hero
```

#### 4.2 SCIENCE ICONS (3 ikony)
```
Soubor: icon-epigenetics.svg
Rozměry: 48×48px
Popis: DNA spiral / clock combination
Barvy: Primary green (#2d5016) + Accent gold (#d4af37)

Soubor: icon-autophagy.svg  
Rozměry: 48×48px
Popis: Cell recycling symbol
Barvy: Primary green + Accent gold

Soubor: icon-vo2max.svg
Rozměry: 48×48px  
Popis: Heart with upward arrow
Barvy: Primary green + Accent gold
```

#### 4.3 HACK ICONS (5 ikon)
```
icon-hack-metabolic.svg (64×64px) - Hourglass/clock
icon-hack-movement.svg (64×64px) - Dumbbell + heart
icon-hack-sleep.svg (64×64px) - Moon + brain waves
icon-hack-stress.svg (64×64px) - Fire/ice symbol
icon-hack-supplements.svg (64×64px) - Pill bottle + DNA
```

Všechny ikony:
- Line art styl
- 2-3px stroke width
- Green-gold gradient nebo solid colors
- SVG formát (scalable)

#### 4.4 CASE STUDY VISUALIZATION
```
Soubor: case-study-martin-results.png
Rozměry: 800×500px
Popis: Before/after data visualization
- Bar charts showing biological age drop
- Blood marker improvements
- VO2 max increase
Style: Clean, medical, použij brand colors
```

#### 4.5 SOCIAL PROOF AVATARS (optional)
```
3× avatar images pro testimonials
Rozměry: 80×80px circle
Typ: Real photos nebo placeholder ilustrace
Style: Grayscale s green border
```

---

## 5. TYPOGRAFIE

### Font Stack
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 
             'Roboto', 'Helvetica Neue', sans-serif;
```

### Hierarchy
```
H1: 56px, font-weight: 700, color: #2d5016
H2: 36px, font-weight: 600, color: #2d5016  
H3: 24px, font-weight: 600, color: #2d5016
Body: 17px, font-weight: 400, color: #1a1a1a
Small: 14px, font-weight: 400, color: #666666
```

---

## 6. DESIGN PRINCIPLES

### Medical + Premium aesthetic
1. **Čistota** - white space je tvůj přítel
2. **Důvěryhodnost** - medical look, ne wellness spa
3. **Data-driven** - čísla, grafy, research
4. **Minimalism** - každý element má účel

### Visual hierarchy
1. DNA logo (brand recognition)
2. Headline (clear value prop)
3. Numbers/stats (proof)
4. Hack sections (educate)
5. CTA (convert)

### Consistency rules
- Všechny zaoblené rohy: 12px (boxes), 8px (buttons)
- Všechny shadows: `0 4px 16px rgba(45, 80, 22, 0.08)`
- Všechny gradients: 135deg angle
- Všechny transitions: 0.3s ease

---

## 7. IMPLEMENTAČNÍ CHECKLIST

### Fáze 1: Must-have (před launch)
- [x] DNA logo (zeleno-zlatá verze)
- [ ] 3× Science icons (SVG)
- [ ] 5× Hack icons (SVG)
- [ ] Favicon (512×512px PNG)
- [ ] OG image pro social sharing (1200×630px)

### Fáze 2: Nice-to-have (post-launch optimization)
- [ ] Hero background pattern
- [ ] Case study visualization
- [ ] Testimonial avatars
- [ ] Video thumbnail (pro embed)
- [ ] Email template graphics

### Fáze 3: Advanced (scale phase)
- [ ] Animated DNA helix (CSS or Lottie)
- [ ] Interactive data visualizations
- [ ] Custom illustrations pro každý hack
- [ ] Video explainers

---

## 8. SOURCING IMAGES

### Option A: Design sám (Canva/Figma)
**Canva Pro:**
- Templates: "Medical infographic", "Science poster"
- Elements: Search "DNA", "cell", "medical icon"
- Export: PNG with transparent background
- Time: 2-3 hodiny pro všechny ikony

**Figma:**
- Použij Iconify plugin (free medical icons)
- Customize colors k brand palette
- Export as SVG
- Time: 1-2 hodiny

### Option B: Fiverr designer
**Brief:**
"Need 8 medical-style icons (SVG) for longevity/anti-aging program:
- Color palette: Green (#2d5016) + Gold (#d4af37)
- Style: Minimalist line art, medical aesthetic
- Deliverables: 3× 48px + 5× 64px SVG icons
- Reference: [attach DNA logo image]"

**Budget:** 500-1000 Kč
**Timeline:** 2-3 dny

### Option C: Stock + customize
**Websites:**
- Iconfinder.com (medical icons)
- Flaticon.com (science icons)
- TheNounProject.com (symbols)

**Process:**
1. Download base icons (free or premium)
2. Recolor in Figma/Canva k brand colors
3. Export SVG
4. Total cost: 0-500 Kč

---

## 9. SOCIAL MEDIA ASSETS

### Facebook/LinkedIn Ads
```
Formát: 1200×628px
Content: DNA helix + "53 let, biologicky 47"
CTA overlay: "Zjistěte svůj biologický věk"
```

### Instagram Stories/Reels
```
Formát: 1080×1920px
Style: Vertical DNA animation
Text overlay: "5 Anti-Age Hacků"
```

### YouTube Thumbnail
```
Formát: 1280×720px  
Content: Tvoje foto + DNA helix + text "ANTI AGE HACK"
Colors: High contrast green/gold
```

---

## 10. QUICK START GUIDE

**Pokud chceš spustit landing page do 48 hodin:**

1. **Použij DNA logo co máš** ✓
2. **Zbylé ikony nahraď emoji/unicode dočasně:**
   - Epigenetics: 🧬
   - Autophagy: ♻️
   - VO2 Max: ❤️
   - Metabolic: ⏱️
   - Movement: 💪
   - Sleep: 🌙
   - Stress: 🔥
   - Supplements: 💊

3. **Po launch si objednej finální ikony** (2-3 dny delivery)

4. **Replace emoji s SVG ikony** iterativně

**Priorita = content > perfektní grafika**

Landing page s emoji ikony > žádná landing page

---

## DALŠÍ KROKY

Co potřebuješ jako první?

1. **Brief pro Fiverr designera** (připravím ti hotový text)
2. **Canva template link** (ukážu ti jak vytvořit ikony)
3. **HTML update** (implementuji placeholder obrázky)
4. **Social media templates** (Facebook ad, Instagram story)

Řekni směr.