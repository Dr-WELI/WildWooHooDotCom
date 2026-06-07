# WildWooHoo — Font System

**Status:** the three main brand fonts below are the canonical voice of the post-v4.2 brand evolution (2026-06). Supporting fonts remain available for editorial accents and HUD-microtext contexts. The earlier v4.2 fonts (Big Shoulders Display, Montserrat) are retained only as fallbacks behind the new primary three.

---

## The three main brand fonts

### 1. Display — **Syne**

CSS token: `--font-display` (primary), with `Big Shoulders Display` as fallback
Weights loaded: 500 / 600 / 700 / 800 (regular + italic)
Use for: hero headlines, h1, h2, big display moments, the evolved-for section eyebrow, project modal titles, anywhere the brand needs heavy display voice.

Syne is a contemporary geometric display family by Bonjour Monde and Lucas Le Bihan. Variable, modern, distinct. Italic 800 has been the brand's signature display voice through 2026-06.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Syne
- Licence: SIL OFL

### 2. Sans body — **Inter**

CSS token: `--font-sans` (primary), with `Montserrat`, `system-ui`, sans-serif as fallbacks
Weights loaded: 400 / 500 / 600 / 700
Use for: body text, navigation, UI labels, tags, anywhere the brand voice is operational rather than expressive.

Inter is the standard contemporary humanist sans, designed for screen reading at all sizes. Replaces the v4.2 Montserrat primary; Montserrat stays as the fallback for backwards-compat.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Inter
- Licence: SIL OFL

### 3. Serif — **Libre Baskerville**

CSS token: `--font-serif`
Weights loaded: 400 / 700
Use for: section headlines, the project-modal `<h2>` family on M&E, the "Line 01 — Behavioural ecology" research-line titles on R&E, long-form body that wants to feel like a magazine, programme notes.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Libre+Baskerville
- Licence: SIL OFL

---

## Supporting fonts (kept available, used in specific contexts)

| Token | Family | Where it earns its place |
|---|---|---|
| `--font-italic` | **Instrument Serif Italic** | One emphasised word inside a serif headline. The italic emphasis voice. |
| `--font-script` | **Caveat** (500 / 700) | Handwritten emphasis, captions under photography, signature lines, personal-voice moments. |
| `--font-mono` | **JetBrains Mono** (400 / 500 / 600 / 700) | HUD-style microtext: `[TRANSMITTING]`, `[ABOUT]`, `[CLICK TO TUNE IN]`, the SECTOR / ANZSIC / ARTIST tag-cluster pills site-wide, the EVIDENCE / ANCHOR / PEER REVIEWED tags on R&E. The same JetBrains Mono micro-text appears inside the chip mark itself (the BIT_INTENSITY_ATTITULATE / WILDWOCHOO labels) so the type system reads internally consistent from the chip outward. |
| `--font-display-editorial` | **DM Serif Display** | Editorial display headlines that want serif gravity. Kept from v3 / v4.2 lineage; secondary to Syne. |

### Specific context font (NOT one of the main three)

- **Comfortaa** (400 / 500 / 600 / 700) — used **only** for the evolved-for slogan on the home page ("what we evolved *for*"). Rounded geometric sans, paired specifically with the outlined wordmark + grayscale chip in that lockup. Do not use Comfortaa for body, headlines, or any other section. The slogan use is the only canonical home for it.

### Legacy / v4.2 fallbacks (retained for backwards-compat)

| Family | Why it's still loaded |
|---|---|
| **Montserrat** (400 / 500 / 700) | Fallback behind Inter in `--font-sans`. Site components that haven't migrated to Inter yet still render in Montserrat. |
| **Big Shoulders Display** (700 / 800 / 900) | Fallback behind Syne in `--font-display` for surfaces where Syne hasn't loaded yet. |

---

## Installation (Google Fonts CDN)

All fonts above are loaded from Google Fonts on every page. The current Google Fonts URL on the home page:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:ital,wght@0,500;0,600;0,700;0,800;1,500;1,600;1,700;1,800&family=Comfortaa:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Libre+Baskerville:wght@400;700&family=Big+Shoulders+Display:wght@700;800;900&family=Caveat:wght@500;700&family=Montserrat:wght@400;500;700&display=swap">
```

For PowerPoint / Keynote / Google Slides, download the TTF files from each fonts.google.com specimen page and install on the system.

---

## Pairing rules

- **Display + sans body.** Syne for the headline, Inter for the body underneath. Default pairing across the site.
- **Serif headline + italic emphasis.** Libre Baskerville for the section headline; Instrument Serif Italic for the one emphasised word inside it.
- **Caveat.** Script accent, captions under photography, signature lines. Never as body, never as headline.
- **JetBrains Mono.** HUD microtext (tags, eyebrows, pills, `[TRANSMITTING]`-style labels). Never body, never headline.
- **Comfortaa.** Evolved-for slogan only. Do not introduce elsewhere without an explicit brand decision.
- **DM Serif Display.** Editorial-display fallback. Secondary to Syne.

---

## Anti-AI-tell discipline (carries across all type)

- No em-dashes. Use hyphens or commas.
- No curly quotes. Use straight quotes.
- No "Furthermore" / "Moreover" / "Additionally" / "In conclusion" / "Importantly" / "leverage" / "robust" / "delve" / "tapestry".
- Headlines never end with a full stop.

---

## Source files (where these are referenced in code)

- Brand-kit token block: `brand-kit/index.html` head (look for `--bk-font-*`)
- Site-wide token aliases: `wwh-archive.css` (look for `--wwh-sans`, `--wwh-serif`, `--wwh-italic`)
- Legacy brand guidelines (pre-evolution baseline): `brand-kit/legacy-brand/BRAND-GUIDELINES.md` v4.2 (2026-05-21)

---

*Last updated 2026-06-08 to correct the canonical-three from the legacy v4.2 trio (Big Shoulders Display / Libre Baskerville / Montserrat) to the post-evolution trio (Syne / Inter / Libre Baskerville). Comfortaa is documented as a slogan-only context font, not a main brand voice.*
