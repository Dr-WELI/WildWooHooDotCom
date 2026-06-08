# WildWooHoo — Font System

**Status:** the three main brand fonts below are the canonical voice. Supporting fonts remain available for editorial accents and HUD-microtext contexts. Earlier v4.2 fonts (Big Shoulders Display, Montserrat) are retained only as fallbacks.

---

## The three main brand fonts

### 1. Headers — **Comfortaa**

CSS token: `--font-headers` (the canonical headline voice)
Weights loaded: 400 / 500 / 600 / 700
Use for: page-band h1, section h2, modal h2 titles, card titles, hero headlines, and every other heading across the site. The main headers font, throughout.

Comfortaa is a rounded geometric sans by Johan Aakerlund. Friendly, contemporary, sits in the same typographic family as the outlined wordmark. Pairs with the chip's rounded-square silhouette and with Syne for display moments.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Comfortaa
- Licence: SIL OFL

### 2. Display — **Syne**

CSS token: `--font-display`
Weights loaded: 500 / 600 / 700 / 800 (regular + italic)
Use for: hero display, big quote moments, the "evolved for" / cosmic / signature-voice surfaces. Syne italic 800 has been the brand's heaviest display voice. Use it where Comfortaa would feel too soft and the headline needs more presence.

Syne is a contemporary geometric display family by Bonjour Monde and Lucas Le Bihan.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Syne
- Licence: SIL OFL

### 3. Body — **Inter**

CSS token: `--font-sans` (primary), with `Montserrat`, `system-ui`, sans-serif as fallbacks
Weights loaded: 400 / 500 / 600 / 700
Use for: body text, navigation, UI labels, tags, paragraph content, anywhere the brand voice is operational rather than expressive.

Inter is the standard contemporary humanist sans, designed for screen reading at all sizes.

- Distribution: Google Fonts. https://fonts.google.com/specimen/Inter
- Licence: SIL OFL

---

## Supporting fonts (kept available, used in specific contexts)

| Token | Family | Where it earns its place |
|---|---|---|
| `--font-serif` | **Libre Baskerville** (400 / 700) | Specific serif moments: long-form editorial, programme notes, academic-poster body, magazine-feel sections. Currently used for some modal project titles on M&E and the research-line h3 family on R&E. |
| `--font-italic` | **Instrument Serif Italic** | One emphasised word inside a serif headline. The italic emphasis voice. |
| `--font-script` | **Caveat** (500 / 700) | Handwritten emphasis, captions under photography, signature lines, personal-voice moments. |
| `--font-mono` | **JetBrains Mono** (400 / 500 / 600 / 700) | HUD-style microtext: `[TRANSMITTING]`, `[ABOUT]`, `[CLICK TO TUNE IN]`, the SECTOR / ANZSIC / ARTIST tag-cluster pills site-wide, the EVIDENCE / ANCHOR / PEER REVIEWED tags on R&E. The same JetBrains Mono micro-text appears inside the chip mark itself (the BIT_INTENSITY_ATTITULATE / WILDWOCHOO labels) so the type system reads internally consistent from the chip outward. |
| `--font-display-editorial` | **DM Serif Display** | Editorial serif-display headlines. Kept from v3 / v4.2 lineage; secondary to Syne. |

---

## Legacy / v4.2 fallbacks (retained for backwards-compat)

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

- **Default heading + body.** Comfortaa (header) + Inter (body underneath). The standard pairing across the site.
- **Display + body.** Syne (display headline) + Inter (body). For the heaviest hero moments where Comfortaa is too soft.
- **Editorial serif moments.** Libre Baskerville for the section headline; Instrument Serif Italic for the one emphasised word inside it. Use for programme-note / academic-poster / magazine-feel contexts only.
- **Caveat.** Script accent, captions under photography, signature lines. Never as body, never as headline.
- **JetBrains Mono.** HUD microtext (tags, eyebrows, pills, `[TRANSMITTING]`-style labels). Never body, never headline.
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
- Evolved-for slogan CSS: `wwh-darkmode.css` (look for `.wwh-evolved-slogan`)
- Legacy brand guidelines (pre-evolution baseline): `brand-kit/legacy-brand/BRAND-GUIDELINES.md` v4.2 (2026-05-21)

---

*Last updated 2026-06-08 to confirm Comfortaa as the main headers font throughout (per WELI), Syne as display, Inter as body. Comfortaa replaces Libre Baskerville as the primary headline voice in this round; Libre Baskerville stays available as a serif supporting font for editorial / programme-note / academic-poster contexts. Site CSS using Libre Baskerville for headers on M&E + R&E may need to migrate to Comfortaa to match the canonical system documented here.*
