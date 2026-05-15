# WildWooHoo — Brand Guidelines

> Modern-classic. Natural energy and beauty. The logo is the word itself, refracted by a beam of light.

---

## 1. Essence

**WildWooHoo** is a creative studio working at the intersection of nature, music, and popular culture, with social impact at the centre. Songs, music videos, animated series, books, and public moments. Founded by Dr WELI.

The brand carries two layers of feeling:
- **Imagery** — the photos and the showreel give *nature and performance*: kangaroos, landscapes, performers mid-motion, golden-hour light.
- **The logo + light** — the wordmark and its interactions give *natural energy and beauty*: white light, sunset gold, a diagonal beam refracting into a prism on touch.

The voice stays the same: confident, not loud; warm, not cute; specific, not generic.

---

## 2. The wordmark

The logo is the studio name set in **DM Serif Display** with one signature move: a single diagonal beam passes through the wordmark at roughly minus 7° from horizontal. The letters above the beam sit slightly to the right; the letters below sit slightly to the left. The wordmark reads as a beam of light refracting the word as it passes through.

The case is **WildWooHoo** — the three capital W's are the brand's rhythm; the four o's are the closing chord.

### Files (in this folder)

| File | Use |
|---|---|
| `wordmark.svg` | The full wordmark with the diagonal cut + refraction offset built in. The brand's primary mark for any hero or large display surface. Uses `currentColor` so the page controls fill. |
| `monogram.svg` | Single W with the same diagonal cut treatment. For tight spaces — header brand link, small badges. |
| `monogram-onCoral.svg` | W monogram on the Roo Coral squircle. The favicon and app icon. |
| `monogram-onGold.svg` | W monogram on the Golden Hour squircle. Alternate badge for golden moments. |
| `../favicon.svg` | Browser-tab favicon (W monogram on coral). |
| `../apple-touch-icon.png` | 180×180 iOS home-screen icon. |
| `../brand-effects.js` | The site-wide script that injects the inline wordmark into every `.wwh-splash-logo` and wires the click-to-burst behaviour. |
| `og-image-1200x630.png` | Social share image. |
| `legacy/` | The earlier kangaroo character mark. Archived but kept — it remains the visual identity for the *Kanga-Kangaroo* animated series sub-brand. Do not retire. |

### Clear space

Leave at least **one cap-height** of clear space around the wordmark on all sides. The diagonal beam must extend to the edges of the cut zone unobstructed — never overlay text or graphics across the beam line.

### Don't

- Don't typeset the wordmark in any font other than DM Serif Display. The treatment depends on the specific letterforms.
- Don't change the cut angle. The minus-7° beam is a constant.
- Don't apply the cut at sizes below 28px display height — the refraction offset becomes illegible. Use the W monogram instead.
- Don't recolour the spectrum inside the burst — the six bands are the brand's diffraction signature and must stay in the order red, orange, gold, green, blue, violet.
- Don't use the wordmark *and* a separate icon together as a stacked logo. The wordmark stands alone.

---

## 3. Colour palette

The palette has three layers. **Surface** is the everyday paper. **Signal** is the warm accent that shows up in CTAs and headlines. **Spectrum** is the diffraction story — it only appears when light is in play (the prism burst, drop-shadows, hover glows).

### Surface

| Token | Hex | Role |
|---|---|---|
| `--brand-cream` | `#FBF7EE` | Paper Cream. Primary surface, warmer than white. |
| `--brand-sand` | `#F4ECDD` | Warm Sand. Secondary cards, soft panels. |
| `--brand-ink` | `#0E0E0F` | Ink Black. Primary text, dark surfaces. |
| `--brand-stone` | `#807872` | Mid neutral. Captions, secondary text. |

### Signal

| Token | Hex | Role |
|---|---|---|
| `--brand-signal` | `#FB6E5A` | Roo Coral. Primary warm signal — CTAs, the favicon. Reads as sunset itself. |
| `--brand-signal-deep` | `#E5482F` | Burnt Coral. Hover, emphasis, dense text on cream. |
| `--brand-gold` | `#E89D2C` | Golden Hour. Secondary warm — used in drop-shadows on the wordmark, accents. |
| `--brand-amber` | `#F5C545` | Amber. The brightest hour, used inside the burst. |
| `--brand-forest` | `#163A32` | Wild Green. Anchors nature half. Footers, deep accents. |

### Spectrum (diffraction)

These six colours only appear when light is in play. They run in spectral order along the beam during a burst.

| Token | Hex | Role |
|---|---|---|
| `--spectrum-red` | `#E8493B` | Beam stop 0%. |
| `--spectrum-orange` | `#F08A30` | Beam stop 18%. |
| `--spectrum-gold` | `#F5C545` | Beam stop 38%. |
| `--spectrum-green` | `#6AB04A` | Beam stop 58%. |
| `--spectrum-blue` | `#3D7EE0` | Beam stop 78%. |
| `--spectrum-violet` | `#6B4FB8` | Beam stop 100%. |

### Pairings

- **Default surface:** `--brand-ink` text on `--brand-cream`, with a single `--brand-signal` accent.
- **Golden-hour panel:** `--brand-cream` text on a warm gradient from `--brand-forest-deep` → `--brand-gold-deep` → `--brand-gold` (matches sunset light gradient).
- **Hero on photography:** `--brand-cream` wordmark on photographic background, with a `drop-shadow(0 0 22px rgba(245,197,69,0.55))` glow on hover.

One accent colour per screen, always. The spectrum only fires as the burst — it is never a static decoration.

---

## 4. Typography

Four families. Each has one job.

| Token | Family | Use |
|---|---|---|
| `--font-display` | **DM Serif Display** (400, italic) | The wordmark. Hero numbers, the largest headline moments. |
| `--font-serif` | Libre Baskerville (400, 700) | Section headlines, sub-display, manifesto copy. |
| `--font-italic` | Instrument Serif Italic | The emphasised word inside a serif headline — *one* word per screen. |
| `--font-sans` | Montserrat (400, 500, 700, 900) | Body, navigation, UI, labels. |

Display sizes:
- **Wordmark hero:** `clamp(56px, 11vw, 156px)` — once per page.
- **Section headline:** `clamp(34px, 4.5vw, 54px)` — Libre Baskerville Bold.
- **Subhead / card title:** `clamp(20px, 2vw, 26px)`.
- **Body:** 16 px / line-height 1.5.
- **Label / caption:** 0.78 rem, letter-spacing 0.12 em, uppercase, weight 800.

---

## 5. Motion — the prism burst

The wordmark is interactive. The behaviour is captured in `brand-effects.js` + the keyframes in `wwh-archive.css`:

- **At rest:** monochrome ink (or cream on dark). Beam is hidden.
- **On hover (pointer devices):** a soft golden-hour drop-shadow appears around the wordmark — `drop-shadow(0 0 22px rgba(245,197,69,0.55))`, 250 ms ease-in.
- **On click or Enter/Space:** the beam fades in along the cut, the upper half of the wordmark shifts further right, the lower half further left, then everything snaps back over 900 ms. The whole effect is `cubic-bezier(.22, 1, .36, 1)`.

The burst is governed by `prefers-reduced-motion: reduce`. Users with that preference will see the wordmark stay at rest.

The burst is the brand's celebration moment. It is not autoplaying or attention-grabbing. Visitors discover it.

---

## 6. Voice and copy

- Sentences are short. One idea per sentence.
- Name partners and outlets specifically — Science Magazine, The Guardian, Falling Walls Engage 2025.
- Close with action: *Work with us.*
- The wordmark is the studio. The kangaroo is *Kanga-Kangaroo* (the animated series). Don't conflate them.

---

## 7. Quick-start

To place the wordmark in any page:

```html
<a href="/" class="wwh-splash-logo" role="button" tabindex="0">
  <span class="name">WildWooHoo</span>
</a>
<script src="/brand-effects.js"></script>
```

The script upgrades the span into the inline wordmark SVG and wires the burst. If JavaScript is disabled, the fallback `<span class="name">` renders the wordmark in DM Serif Display without the cut treatment — still readable, still on-brand.

For the W monogram (favicon, badges, header brand link):

```html
<img src="/brand/monogram-onCoral.svg" alt="WildWooHoo" width="32" height="32">
```

---

*Last updated: 2026-05-15. Owner: Dr WELI.*
