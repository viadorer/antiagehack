# Obrázky a ikony

## Aktuální použití
Projekt používá **Material Symbols Outlined** (font, načítaný z Google Fonts) pro veškeré ikony. Žádné custom SVG nejsou potřeba.

## Struktura
```
images/
├── hero/             # Hero pozadí (volitelné, momentálně nahrazeno gradientem + DNA glow)
└── testimonials/     # Reálné fotky klientů (po doplnění souhlasů)
```

## Hero pozadí
- **Aktuální stav**: vizuální pozadí je tvořeno CSS (`helix-bg`, `dna-glow`) – žádný obrázek nutný.
- **Volitelně**: pokud chcete přidat foto, použijte tmavou abstraktní DNA/medical-tech texturu, 1920×1080+, formát WebP.

## Testimonials
Po doplnění reálných referencí s podepsaným souhlasem:
- Rozměr: 200×200 px, čtvercový crop
- Formát: WebP nebo JPG
- Bez retušování, profesionální headshot
- Pojmenování: `jmeno-prijmeni.webp`

## Doporučené zdroje (v souladu s licencí)
- **Foto klientů**: vlastní fotograf + souhlas s použitím
- **Stockové fotky** (pokud reálné nejsou): Unsplash, Pexels (free)
- **Ikony**: Material Symbols (už integrováno)
