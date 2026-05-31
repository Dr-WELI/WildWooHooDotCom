# WildWooHoo - Brand Guidelines (locked v4.2)

> The animal kingdom - including us. Music, audiovisuals and educational materials born from animal behaviour, ecology and evolution. Photographic. Modern-classic. A monochrome mark with a horizon seam, opening into a spectrum only at the moment of interaction.

---

## 1. Essence

**WildWooHoo** is a creative studio for **the animal kingdom - including us**. Edge: animal behaviour and sociality seen through evolution. We draw **parallels** between animal and human societies through music, audiovisuals and educational materials. Despite all the worlds we have built, biologically we remain part of the animal kingdom.

Adjacent territory the work touches: ecology, ecosystems, evolution, social evolution, anthropology, traditional and First Nations knowledge.

Founded by **Dr WELI**, Sydney-based Brazilian-born behavioural ecologist (PhD, ANU).

---

## 2. The mark and the wordmark

### Mark — the W monogram (header, favicon, app tile, social profile, sticker, OG square)

A horizon-pinched tile with a cream W on top, a cream reflected M underneath, and a cream horizon hairline across the seam. The tile shape itself pinches inward at the horizon — the icon embodies "two worlds meeting" before you even read the W. Three colour variants are available.

| Variant | Tile | Glyph | File | Use |
|---|---|---|---|---|
| **Inverted (primary)** | `#FBF7EE` | `#0E0E0F` | `brand/monogram.svg` | The default. Cream tile, ink W mirror — feels light, photographic, paper-like. Used in header, favicon, splash, all default contexts. |
| **Black** | `#0E0E0F` | `#FBF7EE` | `brand/monogram-inverted.svg` (legacy name — kept as alternate) | The dark variant. For dark surfaces or contexts where the icon should sit on a heavy ground. |
| **Savanna green** | `#1A4A28` | `#FBF7EE` | `brand/monogram-green.svg` | Festive / brand-warm. Profile pictures on social platforms with a green-leaning aesthetic. |

**Rest state.** W (`#FBF7EE` / `#0E0E0F`) on top half. Reflected M (0.42 opacity) on bottom half. Horizon hairline at y=50. Tile has a subtle top-left specular highlight and a bottom-right shadow — polished without being shiny.

**Hover state.** Both Ws fade and converge to the centre — a single unified W emerges on the horizon, scaled to 1.12. A spectrum bloom flashes outward once and dies. A rainbow rim glow appears at the perimeter. The horizon hairline turns rainbow. A single white shine sweeps across.

The primary black mark lives in: `brand/monogram.svg`, `favicon.svg`, `favicon-16.png`, `favicon-32.png`, `apple-touch-icon.png`, and is built at runtime by `brand-effects.js`. The two alternate variants live as standalone SVGs.

### Wordmark (splash hero, footer, t-shirts, posters, decks)

**"WildWooHoo" drawn as outlined geometric monoline letters** — AWAL-style. Every letter shows **two parallel hairlines** tracing the borders of a thick stroke (achieved via SVG mask: outer stroke painted, inner stroke cut out, the difference is a thin ring outline). No diagonal cut, no font dependency, no split halves. The **two capital W's and the H** all use the heavy stroke from the monogram (outer stroke 22, inner mask 15 → 3.5-unit outline); **H is drawn at the same visual width as W** (verticals 150 apart) so the wordmark reads with equal cap-weight emphasis. The **lowercase i, l, d and o** use lighter stroke (outer 14, inner mask 7) for typographic balance. The dot on the i is the only filled element. The interior of every letter is transparent so background images read through cleanly.

**Hover state.** A rainbow shine sweeps left to right across the wordmark — the same shine that lives on the W monogram and the CTAs.

The wordmark lives in: `brand/wordmark.svg` and is built at runtime by `brand-effects.js`.

### The rule
**Never use them together.** Header = mark only. Splash + footer = wordmark only. If a context needs "an icon and a name", use the wordmark — its custom W already plays the role of a mark.

### B&W greyscale variant
For monochrome contexts (B&W print, watermarks, single-ink merch, B&W social profiles), use either:
- **Ink on paper:** black tile `#0E0E0F` + cream `#FBF7EE` W (default — same as primary mark)
- **Paper on ink:** cream `#FBF7EE` tile + ink `#0E0E0F` W (inverted, for use on dark surfaces)

---

## 3. The font system

The logo W is a custom-drawn glyph in a style we'd call **geometric monoline display** — uniform thick stroke, no contrast variation, sharp angular vertices, round line caps and joins, well-spaced like a zig-zag. The closest available free font carrying this DNA is **Big Shoulders Display** (Patric King &amp; Production Type, distributed by Google Fonts).

| Token | Family | Use |
|---|---|---|
| `--font-mark` | Big Shoulders Inline Display (700 / 800 / 900), with Big Shoulders Display as fallback | Hero headlines, slide titles, poster type, big labels — anywhere the brand needs heavy display type. **Big Shoulders Inline Display** has built-in parallel inner strokes, the closest free typeface to the brand W's outline DNA. Falls back to Big Shoulders Display where the inline variant isn't loaded. |
| `--font-mark-solid` | Big Shoulders Display (700 / 800 / 900) | Solid (filled, no inline) display use when an inline letterform would compete with image content behind it. |
| `--font-script` | Caveat (500 / 700) | Handwritten emphasis, captions under photography, signature lines, "personal" voice moments. (Not used in the v4.1 wordmark — kept available for editorial accents.) |
| `--font-display` | DM Serif Display | Editorial display headlines that want serif gravity (kept from v3 for editorial layouts; secondary to `--font-mark`). |
| `--font-serif` | Libre Baskerville (400 / 700) | Section headlines, long-form body that wants to feel like a magazine. |
| `--font-italic` | Instrument Serif Italic | One emphasised word inside a serif headline. |
| `--font-sans` | Montserrat (400 / 500 / 700) | Body, navigation, UI, labels. |

**Installation.** Loaded from Google Fonts on every page:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Caveat:wght@500;700&family=DM+Serif+Display:ital@0;1&family=Instrument+Serif:ital@0;1&family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@400;500;700&display=swap">
```

For PowerPoint / Keynote / Google Slides, download the TTF files from `fonts.google.com/specimen/Big+Shoulders+Display` and `fonts.google.com/specimen/Caveat` and install on your system.

Headlines never end with a full stop. Em-dashes (—) are replaced with hyphens (-) throughout.

---

## 4. The spectrum (the rainbow inside the seam)

Sampled pixel-by-pixel from the two reference photos. Every band belongs inside those images. The spectrum **only ever** appears inside the wordmark's horizon hairline, inside the diffraction bands on hover, in the monogram's hover-state rainbow rim, or in the green-centred festive profile variant. **Never as a static decoration.**

| Token | Hex | Sampled from |
|---|---|---|
| `--spectrum-red` | `#C97A66` | Rainbow band, dusty terracotta |
| `--spectrum-peach` | `#D89E78` | Horizon glow, warm peach |
| `--spectrum-gold` | `#D2B07A` | Lit grass tips, pale gold |
| `--spectrum-amber` | `#B07F30` | Deep golden hour amber |
| `--spectrum-honey` | `#E5B96D` | Golden honey transition |
| `--spectrum-savanna` | `#27A05B` | Savanna green (centre of spectrum) |
| `--spectrum-sage` | `#B59B6D` | Bush sage |
| `--spectrum-lavender` | `#9985A8` | Upper sky, dusk lavender |
| `--spectrum-violet` | `#7D6E92` | Deepest sky, twilight |

---

## 5. Brand palette (the locked monochrome direction)

### The mark itself
| Token | Hex | Role |
|---|---|---|
| `--mark-tile` | `#0E0E0F` | The mark's tile colour. Pure black. |
| `--mark-glyph` | `#FBF7EE` | The W, the horizon hairline, the centre nub. Cream. |

### Surface (paper)
| Token | Hex | Role |
|---|---|---|
| `--brand-cream` | `#FBF7EE` | Primary surface |
| `--brand-paper` | `#FFFFFF` | Cleanest paper |
| `--brand-sand` | `#F4ECDD` | Soft secondary |
| `--brand-wheat` | `#E8DCC0` | Warm secondary, golden hour grass |

### Ink (the dark)
| Token | Hex | Role |
|---|---|---|
| `--brand-ink` | `#0E0E0F` | Primary text + ground (matches mark tile) |
| `--brand-night-savanna` | `#0A1F14` | Deep green-black, for dark surfaces |
| `--brand-stone` | `#807872` | Secondary text |

### Accent palette (use sparingly)
| Token | Hex | Role |
|---|---|---|
| `--brand-savanna` | `#27A05B` | Savanna emerald — accent, links, active state |
| `--brand-savanna-deep` | `#1A4A28` | Deep forest — hover, dense emphasis |
| `--brand-honey` | `#E5B96D` | Golden honey — secondary accent, warm pairing |
| `--brand-amber` | `#B07F30` | Deep amber — tertiary accent |
| `--brand-signal` / `--brand-gold` | `#C97A40` | **PRIMARY SIGNAL.** Nav active, link hover, italic emphasis. (Kept from v3 for continuity with existing site styles.) |

The locked direction is **monochrome-first**: the brand is carried by the cream-on-black silhouette and the horizon seam. Colour only appears at the moment of interaction (the hover spectrum, the diffraction bloom, the rainbow rim).

---

## 6. Navigation

Header: **Projects · Impact · Music & Video · Educational · Open Calls · Portal**.

Folder `/network/` is `/open-calls/` (renamed in v3, retained in v4). All internal links use `/open-calls/`.

---

## 7. CTAs

- "**Work with us**" — header CTA (the studio invites partnership)
- "**Express interest in collaboration**" — replaces "Pitch a project" (we're the home of projects; collaborators express interest)
- "**Apply to the pool**" — open-calls apply form (paid or time-for-print)
- "**Apply to join**" — alternate header CTA on Open Calls + Portal

**Hover effect.** Every CTA — `.wwh-awal-header-cta`, `.wwh-highlight-cta`, `.wwh-trend-call-cta`, `.wwh-form-submit`, `.wwh-footer-back-top`, `.wwh-services-cta h2 a` — carries the **rainbow shine sweep** on hover. A rainbow gradient band sweeps left-to-right under a brighter white core, echoing the rainbow shine that lives on the W monogram and the wordmark. Same DNA across every interactive element.

**Header rainbow.** Emphasised words (set in `<em>`) inside section headings (`.wwh-page-band h1`, `.wwh-departments h2`, `.wwh-highlight-copy h2`, `.wwh-trending-head h2`, `.wwh-feature-video-head h2`, `.wwh-roster-slider-head h2`, `.wwh-project h2`) carry a **slowly-cycling spectrum gradient** as their text fill — the same palette as the logo's hover rainbow, slowed to an 8-second cycle so it reads as quiet motion. The previous single signal-gold treatment is retired in v4.2.

---

## 8. Photography decks

Each subpage uses its own showreel deck via `body[data-deck]`:

| Page | Deck |
|---|---|
| `/` home | Original five-photo showreel, including the rainbow-kangaroo reference |
| `/music` | KT video photography (ballet, drag queen, samba, group models) |
| `/educational` | KT-Kids events + Kanga-Kangaroo animation stills |
| `/projects` | Cross-project visuals |
| `/impact` | Animal-behaviour photography (playfight, hog deer, sunset silhouette) |
| `/open-calls` | No showreel - briefs only |
| `/portal` | No showreel - members area |

---

## 9. Atmosphere

`brand/starfield.svg` — night savanna sky (dusk gradient → savanna green → black), Southern Cross constellation upper-right, faint warm horizon glow. Applied as background to `.wwh-splash` and the sticky header so the night sky runs continuously across the top of every page.

Body shimmer dust (rainbow-tinted micro-dots, opacity 0.13) sits as a fixed `::after` pseudo-element across every page - the pop-culture sparkle.

CTAs carry a hover light-sweep - warm golden-hour gradient travelling left-to-right on hover.

---

## 10. Retired in v4 / restored in v4.1

- **The globe behind the W.** Read as WordPress / Volkswagen at small sizes. Replaced by the horizon-pinched tile. **Stays retired.**
- **DM Serif Display as the wordmark face.** Too fragile at hairline serifs and didn't match the monogram. Replaced by Big Shoulders Display Black. (DM Serif Display retained for editorial display layouts only.)
- **The two-tone forest-green-and-golden-honey mark direction (v3 draft).** Considered and rejected during the v4 lab — landed on monochrome. **Stays retired.**
- **The horizon-hairline + Caveat-lowercase wordmark (v4 draft).** Shipped briefly but the founder preferred the old diagonal-cut logic. **Restored in v4.1:** the diagonal-cut + rainbow-zipper animation is back, now set in Big Shoulders Display Black instead of DM Serif Display.
- **The golden-hour CTA shine.** Replaced by the **rainbow shine** matching the monogram and wordmark.

---

*Last updated: 2026-05-21. Owner: Dr WELI.*
