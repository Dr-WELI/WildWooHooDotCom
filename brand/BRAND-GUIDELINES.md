# WildWooHoo — Brand Guidelines

> Bold and modern. Nature, music, and popular culture for social impact. A creative studio with a kangaroo at its centre.

---

## 1. Essence

**WildWooHoo** is a creative studio working at the intersection of nature, music, and popular culture, with social impact at the centre. Songs, music videos, animated series, books, and public moments. Founded by Dr WELI.

The brand voice is:
- **Confident, not loud.** We speak about big ideas in plain language.
- **Warm, not cute.** We are playful, but never twee.
- **Specific, not generic.** "Kangaroo behaviour" beats "wildlife." "Dance Your PhD 2024 winner" beats "award-winning."
- **Australian-Brazilian-global.** English is the default; Portuguese, Spanish, French, German are first-class.

---

## 2. Logo system

The mark is a leaping kangaroo silhouette — ears up, snout forward, hindleg flat on the ground, tail as counterweight. It descends directly from *Kangaroo Time* (the flagship) and *Kanga-Kangaroo* (the animated series in development).

The studio name **WildWooHoo** is set in **Libre Baskerville Bold**, tight tracking, one word, capital W twice in the middle.

### Files (in this folder)

| File | Use |
|---|---|
| `logo-mark.svg` | Mark only, single colour (`currentColor`). Drop into anywhere that supports inline SVG. |
| `logo-mark-onCoral.svg` | Mark + coral squircle background. Default favicon, app icon, social square. |
| `logo-mark-onCream.svg` | Mark + cream squircle. Use on coral or photographic backgrounds. |
| `logo-mark-onForest.svg` | Mark + forest squircle. Use on dark photographic backgrounds or for collaborator decks. |
| `logo-horizontal.svg` | Mark + "WildWooHoo" wordmark, horizontal lockup. Use in headers, email signatures, presentation footers. |
| `../favicon.svg` | Coral squircle favicon for the browser tab. |
| `../apple-touch-icon.png` | 180×180 iOS home-screen icon. |
| `og-image-1200x630.png` | Social share image. |

### Clear space

Always leave at least **one ear height** of clear space around the mark on all sides. Do not crop the tail.

### Don't

- Don't recolour the mark in any colour that isn't in the palette below.
- Don't apply drop shadows, outlines, or gradients to the mark.
- Don't rotate or skew the mark. The kangaroo always faces right.
- Don't separate the mark from the wordmark in the horizontal lockup, or change the spacing between them.
- Don't use the placeholder "W" favicon — it has been retired.

---

## 3. Colour palette

The palette is anchored on two signals — **Roo Coral** and **Wild Green** — surfaced on warm neutrals.

| Token | Hex | Role |
|---|---|---|
| `--brand-signal` | `#FB6E5A` | Roo Coral. The single most important colour. Used for the mark, the CTA, the splash accent. |
| `--brand-signal-deep` | `#E5482F` | Burnt Coral. Hover state, emphasis, dense text on cream. |
| `--brand-signal-soft` | `#FFB3A4` | Coral Wash. Soft tints, hairlines, subtle backgrounds. |
| `--brand-forest` | `#163A32` | Wild Green. Anchors the "nature" half. Backgrounds, footer, deep accents. |
| `--brand-forest-deep` | `#0A2620` | Deep Wild. The darkest green, used sparingly for the strongest contrast. |
| `--brand-forest-soft` | `#C5D6CE` | Sage Wash. Soft pill backgrounds, tag chips. |
| `--brand-ink` | `#0E0E0F` | Ink Black. Primary text. Slightly warm. |
| `--brand-cream` | `#FBF7EE` | Paper Cream. Primary surface. Warmer than white. |
| `--brand-sand` | `#F4ECDD` | Warm Sand. Secondary surface, card backgrounds. |
| `--brand-stone` | `#807872` | Mid neutral. Secondary text, captions. |
| `--brand-rule` | `rgba(14,14,15,0.10)` | Hairlines, borders. |
| `--brand-rule-strong` | `rgba(14,14,15,0.22)` | Stronger borders, focus rings. |

### Pairings

- **Default:** `--brand-ink` text on `--brand-cream` background, `--brand-signal` for one accent per screen.
- **Hero / footer:** `--brand-cream` text on `--brand-forest` background, `--brand-signal` for the kangaroo.
- **Card:** `--brand-ink` text on `--brand-sand` background, no accent unless it's a CTA.

Avoid more than one accent colour per screen — the discipline is part of the brand.

---

## 4. Typography

The existing type stack is strong and we keep it. Three families, one job each.

| Token | Family | Use |
|---|---|---|
| `--font-serif` | Libre Baskerville (700) | Display, headlines, the WildWooHoo wordmark. |
| `--font-italic` | Instrument Serif Italic | The emphasised word inside a serif headline — *one* word per screen. |
| `--font-sans` | Montserrat (400/500/700/900) | Body, navigation, UI, labels. |

### Scale

- **Splash display:** `clamp(56px, 11vw, 156px)` — used once per page.
- **Section headline:** `clamp(34px, 4.5vw, 54px)`.
- **Subhead / card title:** `clamp(20px, 2vw, 26px)`.
- **Body:** `16px` / `line-height 1.5`.
- **Caption / label:** `0.78rem`, `letter-spacing 0.12em`, `uppercase`, `font-weight 800`.

Italic Instrument Serif works hardest at the *headline* level — *"One creative world."* — and should not appear in body copy.

---

## 5. Spacing, radii, motion

| Token | Value | Use |
|---|---|---|
| `--radius-pill` | `999px` | Buttons, chips, the header. |
| `--radius-xl` | `34px` | Large cards, framework panels. |
| `--radius-lg` | `26px` | Standard cards, project tiles. |
| `--radius-md` | `18px` | Inline pills, embed wrappers. |
| `--space-1` to `--space-7` | `10px → 104px` | Existing scale, kept. |

Motion is subtle: 200–250ms ease, no bouncy easings. The kangaroo does the leaping; the UI stays still.

---

## 6. Voice and copy

- Sentences are short. One idea per sentence.
- We say what we make ("Songs, music videos, animated series, books"), not what we do ("solutions").
- We name partners and outlets specifically (Science Magazine, The Guardian, Falling Walls Engage 2025).
- We close with action: *Work with us.*

---

## 7. Quick-start CSS

To use the brand tokens in any page, the stylesheet `styles.css` exposes them on `:root`. Reference them directly:

```css
.wwh-button-primary {
  background: var(--brand-signal);
  color: var(--brand-cream);
  border-radius: var(--radius-pill);
  font-family: var(--font-sans);
  font-weight: 700;
}
```

For the mark, the preferred inline pattern is:

```html
<span class="brand-mark" aria-hidden="true">
  <svg viewBox="0 0 100 100" width="48" height="48">
    <use href="/brand/logo-mark.svg#root"/>
  </svg>
</span>
```

…or simply `<img src="/brand/logo-mark-onCoral.svg" alt="WildWooHoo">` for the squircle versions.

---

*Last updated: 2026-05-14. Owner: Dr WELI.*
