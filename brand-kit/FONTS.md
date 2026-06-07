# WildWooHoo — Font System

**Source:** the locked v4.2 brand guidelines at `brand-kit/legacy-brand/BRAND-GUIDELINES.md` (2026-05-21).
**Status:** the 3 main fonts below are the canonical brand voice. Supporting fonts (Caveat, DM Serif Display, Instrument Serif) are kept available for editorial accents. Later-added accents (Comfortaa, Syne, JetBrains Mono) are noted at the bottom — they coexist with but do not displace the canonical 3.

---

## The three main brand fonts

### 1. Display — **Big Shoulders Display** (700 / 800 / 900)

CSS token: `--font-mark`
Use for: hero headlines, poster type, slide titles, big labels, anywhere the brand needs heavy display type.

The closest free typeface to the brand W's outline DNA. Big Shoulders Inline Display (the inline variant) carries built-in parallel inner strokes that echo the wordmark outline; falls back to Big Shoulders Display where the inline variant isn't loaded.

- Source: Patric King and Production Type
- Distribution: Google Fonts. https://fonts.google.com/specimen/Big+Shoulders+Display
- Licence: SIL OFL

### 2. Serif — **Libre Baskerville** (400 / 700)

CSS token: `--font-serif`
Use for: section headlines, long-form body that wants to feel like a magazine; project titles in modal pop-ups; the "Lines of research" h3 family on R&E.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Libre+Baskerville
- Licence: SIL OFL

### 3. Sans body — **Montserrat** (400 / 500 / 700)

CSS token: `--font-sans`
Use for: body text, navigation, UI labels, tags, anywhere the brand voice is operational rather than expressive.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Montserrat
- Licence: SIL OFL

---

## Supporting fonts (kept from v4.2)

| Token | Family | Use |
|---|---|---|
| `--font-script` | Caveat (500 / 700) | Handwritten emphasis, captions under photography, signature lines |
| `--font-display` | DM Serif Display | Editorial display headlines that want serif gravity |
| `--font-italic` | Instrument Serif Italic | One emphasised word inside a serif headline |

---

## Later additions (post-v4.2, kept as accents)

These were added during the 2026-06 brand-evolution pass. They are NOT a replacement for the main 3 above; they fill specific roles where the main three were the wrong register.

| Family | Where it earns its place |
|---|---|
| **Syne** (500-800, italic available) | Original choice for the evolved-for slogan; now mostly retired from the lockup. Kept available for other contexts. |
| **Comfortaa** (500 / 700) | Current evolved-for slogan font. Rounded geometric sans, sits in typographic family with the outlined wordmark. |
| **JetBrains Mono** (400-700) | HUD-style microtext: `[TRANSMITTING]`, `[ABOUT]`, `[CLICK TO TUNE IN]`, tag-cluster monospace labels, the `[ANCHOR : ANU CPAS]` style pills on R&E. The same JetBrains Mono micro-text appears inside the chip mark itself (the BIT_INTENSITY_ATTITULATE / WILDWOCHOO labels) — keeping the type system internally consistent. |

---

## Installation

All seven of the v4.2 fonts plus the later-additions are loaded from Google Fonts on every page. The current Google Fonts URL on home is:

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600;1,700;1,800&family=Comfortaa:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Libre+Baskerville:wght@400;700&family=Big+Shoulders+Display:wght@700;800;900&family=Caveat:wght@500;700&family=Montserrat:wght@400;500;700&display=swap">
```

For PowerPoint / Keynote / Google Slides, download the TTF files from each fonts.google.com specimen page and install on the system.

---

## Pairing rules

- **Wordmark and Big Shoulders Display** carry the same outline DNA — never use a third heavy display face on the same surface.
- **Libre Baskerville with Instrument Serif Italic** — the italic is for one emphasis word inside a Baskerville headline.
- **Montserrat with Big Shoulders** — body type under display type.
- **Comfortaa stays paired with the evolved-for chip + outlined wordmark only** — do not use it for body or section headlines.
- **JetBrains Mono stays in HUD-microtext and tag-pill contexts only** — never as body type, never as headlines.

---

## Anti-AI-tell discipline (carries across all type)

- No em-dashes. Use hyphens or commas.
- No curly quotes. Use straight quotes.
- No "Furthermore" / "Moreover" / "Additionally" / "In conclusion" / "Importantly" / "leverage" / "robust" / "delve" / "tapestry".
- Headlines never end with a full stop.

---

*Sourced from BRAND-GUIDELINES.md v4.2 (2026-05-21). Last updated 2026-06-08.*
