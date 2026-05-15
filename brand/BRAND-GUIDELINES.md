# WildWooHoo — Brand Guidelines

> Natural light. Modern-classic. The logo is the word, sliced by a beam. The "colour" of the brand is the gradient itself, not any single hue.

---

## 1. Essence

**WildWooHoo** is a creative studio working at the intersection of nature, music, and popular culture, with social impact at the centre. Songs, music videos, animated series, books, and public moments. Founded by Dr WELI.

Two layers of feeling carry the brand:

- **Photographs** — kangaroos, performers, golden-hour landscapes, the night sky. These do the work of *nature and performance*.
- **The logo + light** — a custom WildWooHoo wordmark sliced by a diagonal beam. At rest, monochrome. On interaction, a spectrum refracts through the slit. Modern-classic. Simple, then suddenly magical.

The reference image is `/assets/img/05-rainbow-weli.jpg` — a kangaroo in golden grass, lavender sky, faint rainbow. Every brand colour was sampled pixel-by-pixel from it.

---

## 2. The wordmark and the W monogram

Two marks. One job each. **Never use them together.**

| Mark | Used where | Interaction |
|---|---|---|
| **Wordmark** — full "WildWooHoo" with diagonal cut | Splash hero (`.wwh-splash-logo`), footer brand | **Click** on the splash to fire the prism burst. Once. Secretive. |
| **W monogram** — single W with the same cut | Header brand link (`.wwh-awal-brand`), favicon, app icon | **Hover** to reveal the spectrum (the header is more responsive, more "lit up"). |

The W monogram exists *because* the full wordmark already lives in the hero. We don't repeat it in the header.

### The beam rule

The spectrum **only ever appears inside the diagonal gap** between the upper and lower halves of the cut letterforms. It never extends past the letters, never sits as a separate stripe, never becomes a coloured background. The beam lives where the letters reveal it. Nowhere else.

### Files

| File | Use |
|---|---|
| `wordmark.svg` | Full wordmark — three layers: upper (currentColor, clipped above the cut), lower (currentColor, below), middle (spectrum gradient, clipped to the gap). |
| `monogram.svg` | W version of the same construction. |
| `starfield.svg` | The hero/header background atmosphere — dusk gradient + ambient stars + Southern Cross constellation. |
| `../favicon.svg` | W monogram on dusk-deep squircle. The spectrum band is baked in (the static magical glimpse). |
| `../brand-effects.js` | Injects the wordmark into `.wwh-splash-logo` (click burst) and the W monogram into `.wwh-awal-brand` (hover reveal). |
| `legacy/` | Earlier kangaroo character + coral squircle assets. Kept for *Kanga-Kangaroo* (the animated series sub-brand). Do not delete. |

### Don't

- Don't put the W monogram and the wordmark together in any layout.
- Don't show the beam outside the diagonal cut zone.
- Don't put the wordmark on a coloured squircle background. It is letterforms on cream, on ink, or on photography. That is all.
- Don't change the cut angle (≈ –7° from horizontal) or the refraction offset.
- Don't substitute the font. DM Serif Display is the letterform.

---

## 3. Palette — sampled from the reference photo

The brand's "colour" is the gradient from dusk lavender, through warm horizon, into the gold grass. Every token below is a real pixel from `05-rainbow-weli.jpg`. The discipline is to use them as **gradients and washes**, never as solid blocks across a whole section.

### Surface

| Token | Hex | Role |
|---|---|---|
| `--brand-cream` | `#FBF7EE` | Paper Cream. Default surface below the hero. |
| `--brand-paper` | `#FFFFFF` | The cleanest paper, when needed. |
| `--brand-sand` | `#F4ECDD` | Warm Sand. Secondary cards. |
| `--brand-ink` | `#0E0E0F` | Ink. Primary text and the floor of the sky. |
| `--brand-ink-warm` | `#1B1822` | Slightly violet ink for dusk transitions. |
| `--brand-stone` | `#807872` | Mid neutral, captions. |

### Dusk (the sky)

| Token | Hex | Role |
|---|---|---|
| `--brand-dusk-deep` | `#2B1F2F` | Deepest twilight. The header + hero base. The theme-color meta tag. |
| `--brand-dusk` | `#4A3E50` | Middle dusk. |
| `--brand-dusk-soft` | `#9B8AA1` | Lavender direct from the photo's top sky. |
| `--brand-mauve` | `#AD94A3` | Mid-sky mauve. |
| `--brand-rose` | `#C09B9F` | Rose-pink from the rainbow band region. |

### Golden hour (the horizon and the grass)

| Token | Hex | Role |
|---|---|---|
| `--brand-haze` | `#DAB7B5` | Warm haze near the horizon. |
| `--brand-peach` | `#C58777` | Horizon peach. |
| `--brand-gold` | `#DD843F` | Gold grass. The brand's warm accent. |
| `--brand-gold-soft` | `#F5C77C` | Softer gold for washes. |
| `--brand-amber` | `#F5C545` | Brightest gold, used in the spectrum and in the header hover state. |
| `--brand-earth` | `#915C4B` | Burnt earth, deeper grass. |

### Spectrum (only inside the cut)

| Token | Hex |
|---|---|
| `--spectrum-red` | `#E8493B` |
| `--spectrum-orange` | `#F08A30` |
| `--spectrum-gold` | `#F5C545` |
| `--spectrum-green` | `#6AB04A` |
| `--spectrum-blue` | `#3D7EE0` |
| `--spectrum-violet` | `#6B4FB8` |

### Legacy (sparing accent only — not primary)

`--brand-signal` (`#FB6E5A`, the original coral) is retained as a legacy accent for very specific CTAs. **It is not the primary site colour.** The site is anchored on cream + ink + dusk + golden-hour gradients.

### How to use the palette

- Default surface: `--brand-cream` with `--brand-ink` text.
- Hero, header, top of every page: dusk gradient + Southern Cross starfield.
- Section CTA accent: a hairline of `--brand-gold` or a hover state in `--brand-amber`.
- Never paint a section with a single saturated colour. Always reach for a gradient or a wash.

---

## 4. Typography

Four families. Each has one job.

| Token | Family | Use |
|---|---|---|
| `--font-display` | **DM Serif Display** | The wordmark + the W monogram. Hero numbers. The single largest moment per page. |
| `--font-serif` | Libre Baskerville | Section headlines, subheads, manifesto copy. |
| `--font-italic` | Instrument Serif Italic | The single emphasised word inside a serif headline. |
| `--font-sans` | Montserrat | Body, navigation, UI, labels. |

---

## 5. Motion — two interaction tiers

- **Header W monogram** — *hover* reveals the spectrum in the cut, with a small horizontal shear (top right, bottom left) and a soft golden glow. The header is the page's "lit" element. Hovering it is rewarded.
- **Splash wordmark** — *click* (or Enter / Space) fires the prism burst. The cut opens, the spectrum flashes through, the wordmark settles back over 900 ms. The hero burst is rarer. It is the brand's celebration moment.

Both interactions respect `prefers-reduced-motion: reduce`. Users with that preference see the wordmark stay at rest.

---

## 6. Photography distribution

To keep the visual world fresh across pages and avoid the same five photos appearing everywhere:

| Page | Subject matter |
|---|---|
| `/` (home) | Original five-photo showreel — **do not change**. |
| `/music` | Kangaroo Time video photos, single covers, atmospheric portraits. |
| `/educational` | KT Kids event photography, Kanga-Kangaroo animation stills, animal behaviour photography. |
| `/impact` | Human group photography (e.g. people playing as a kangaroo group), kangaroo-at-sunset silhouettes. |
| `/projects` | Photography appropriate to each project. |

Files in `/assets/img/` are the canonical pool. Add new photos there.

---

## 7. Atmosphere — the Southern Cross

The hero and the header share one background: a dusk-gradient sky with the **Southern Cross** constellation in the upper-right quadrant. Acrux (brightest, at the foot of the cross), Mimosa, Gacrux, Imai, plus faint Epsilon Crucis. Around them, a scatter of ambient stars. A subtle horizon glow at the lower right echoes the residual sunset of the reference photo.

The starfield is `brand/starfield.svg`. It is applied via `background-image` to `.wwh-splash` and to the sticky header. The night sky runs across the top of the site, continuously, from the browser chrome down through the showreel. The site below the hero is cream + warm gradients — the day on the other side of the horizon.

---

## 8. Quick-start

Splash hero:

```html
<a href="/" class="wwh-splash-logo" role="button" tabindex="0">
  <span class="name">WildWooHoo</span>
</a>
<script src="/brand-effects.js"></script>
```

Header brand link:

```html
<a href="/" class="wwh-awal-brand">WildWooHoo</a>
```

(`brand-effects.js` injects the W monogram and wires the hover behaviour. The "WildWooHoo" text remains in the DOM for accessibility and SEO but is visually replaced by the SVG.)

---

*Last updated: 2026-05-15. Owner: Dr WELI.*
