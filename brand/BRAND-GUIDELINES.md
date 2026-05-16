# WildWooHoo — Brand Guidelines

> The animal kingdom — including us. Music, video and stories born from animal behaviour research. Modern-classic, photographic, with a single light moment as the brand's interactive signature.

---

## 1. Essence

**WildWooHoo** is a creative studio for **the animal kingdom — including us**. The edge is **animal behaviour**. Humans are an extension of the animal kingdom, not separate from it. The studio translates behavioural ecology into songs, videos, animated series, books and public moments so the conversation moves — about how we live with one another, and how we live with the rest of the kingdom.

Founded by **Dr WELI**, Brazilian-Australian behavioural ecologist (PhD, ANU) and recording artist.

Adjacent territory we'll touch (but the cherry on top stays animal behaviour): ecology, ecosystems, evolution, social evolution, anthropology, traditional and First Nations knowledge of nature.

---

## 2. Voice

- Sentences are short. One idea per sentence.
- "Animal behaviour" before "nature". "Behavioural ecology" before "the wild".
- Humans framed as *one species inside the animal kingdom*, never as observers looking at it from outside.
- Specific over generic. Science Magazine. The Guardian. Falling Walls Engage 2025. *Behavioral Ecology* journal.
- Close with action: *Work with us. Apply. Express interest.*

---

## 3. The wordmark and the W monogram

Two marks. One job each. **Never use them together.**

| Mark | Where | Interaction |
|---|---|---|
| **Wordmark** (full WildWooHoo with diagonal cut) | Splash hero (`.wwh-splash-logo`), footer brand | **Click** on the splash → rainbow beam flashes through the cut. Secretive. |
| **W monogram** (single W with the same cut) | Header brand link (`.wwh-awal-brand`), favicon | **Hover** to reveal the rainbow beam. The header is the lit element. |

### The beam rule

The beam is a **clean rainbow line** running through the diagonal gap between the upper and lower halves of the cut letters. The line is invisible at rest; on interaction it fades in and thickens for ~900 ms then settles back. It never extends past the wordmark vertically or carries letter-shape inside it. Just a beam of light through the cut.

### Files

| File | Use |
|---|---|
| `wordmark.svg` | Full wordmark — upper half clipped above the cut, lower clipped below, both `currentColor`. A `<line>` element carries the rainbow gradient as the beam (opacity 0 at rest). |
| `monogram.svg` | Single W with the same construction. |
| `starfield.svg` | Hero/header background — dusk gradient at top, warm savanna horizon mid-low, black at the ground. Southern Cross constellation in upper right. |
| `../favicon.svg` | W monogram on dusk-deep squircle with the rainbow beam baked in (static, since favicons don't hover). |
| `../brand-effects.js` | Injects the wordmark into `.wwh-splash-logo` (click-burst) and the W into `.wwh-awal-brand` (hover-reveal). |

### Don't

- Don't show the wordmark and the W monogram together.
- Don't fill the letters with rainbow. The beam is a *line through the cut*, not a coloured letterform.
- Don't change the cut angle (~ –7° from horizontal) or the refraction offset (top half shifts right, bottom shifts left).
- Don't put the wordmark on a coloured square. Letterforms sit on cream, on ink, or on photography.
- Don't substitute the display font. DM Serif Display is the wordmark.

---

## 4. Palette — natural light

Palette sampled pixel-by-pixel from `/assets/img/05-rainbow-weli.jpg` (kangaroo, golden grass, lavender sky, faint rainbow). The brand "colour" is the gradient itself.

### Primary accent — Savanna Gold

**Coral is retired.** Every place that used coral now uses savanna gold.

| Token | Hex | Role |
|---|---|---|
| `--brand-signal` | `#DD843F` | Savanna Gold. Nav active, link hover, italic emphasis, pillar/step/project numbers, form focus, footer accents. |
| `--brand-signal-deep` | `#B36C2D` | Burnt Gold. Hover / dense emphasis. |
| `--brand-signal-soft` | `#F2B47C` | Gold Wash. Subtle accents. |

### Surface

| Token | Hex | Role |
|---|---|---|
| `--brand-cream` | `#FBF7EE` | Default surface below the hero. |
| `--brand-sand` | `#F4ECDD` | Secondary cards. |
| `--brand-ink` | `#0E0E0F` | Primary text and ground. |
| `--brand-ink-warm` | `#1B1822` | Slight violet ink for dusk transitions. |

### Dusk (top of the sky)

| Token | Hex |
|---|---|
| `--brand-dusk-deep` | `#2B1F2F` |
| `--brand-dusk` | `#4A3E50` |
| `--brand-dusk-soft` | `#9B8AA1` |
| `--brand-mauve` | `#AD94A3` |
| `--brand-rose` | `#C09B9F` |

### Golden hour (horizon and ground)

| Token | Hex |
|---|---|
| `--brand-haze` | `#DAB7B5` |
| `--brand-peach` | `#C58777` |
| `--brand-gold` | `#DD843F` |
| `--brand-gold-soft` | `#F5C77C` |
| `--brand-amber` | `#F5C545` |
| `--brand-earth` | `#915C4B` |

### Spectrum — only inside the beam

`--spectrum-red #E8493B` · `-orange #F08A30` · `-gold #F5C545` · `-green #6AB04A` · `-blue #3D7EE0` · `-violet #6B4FB8`. Used by the rainbow line in the cut and nowhere else.

### Sky and ground (the hero gradient)

The splash hero is a single vertical gradient: dusk lavender at the top → dusk-deep mid → warm savanna mid-low → near-black at the ground. The showreel photos sit against this. Pairs naturally with golden-hour and savanna photography.

```css
background:
  url('/brand/starfield.svg') center top / cover no-repeat,
  linear-gradient(180deg,
    #5E4F62 0%,    /* dusk lavender */
    #3A2D40 22%,
    #1F1726 50%,
    #2D1F12 76%,   /* warm savanna */
    #1A0F08 92%,
    #000000 100%); /* black ground */
```

The header uses a darker, slimmer version of the same gradient (dusk-deep → ink-warm), so the night sky runs continuously across the top of every page.

---

## 5. Typography

| Token | Family | Use |
|---|---|---|
| `--font-display` | DM Serif Display | The wordmark + W monogram. |
| `--font-serif` | Libre Baskerville (400, 700) | Section headlines, manifesto copy. |
| `--font-italic` | Instrument Serif Italic | One emphasised word inside a serif headline. |
| `--font-sans` | Montserrat | Body, navigation, UI, labels. |

---

## 6. Navigation

The header carries six links. **Open Calls** and **Portal** are both top-level (no longer buried).

Order (left → right): Projects · Impact · Music & Video · Educational · Open Calls · Portal.

The original `/network/` folder has been renamed to `/open-calls/`. Internal references and footer menus all point to `/open-calls/`.

---

## 7. CTAs — language

- "**Work with us**" — header CTA (the studio invites partnership).
- "**Express interest in collaboration**" — replaces the old "Pitch a project". We're the home for the projects; collaborators express interest.
- "**Apply to the pool**" — the open-calls apply form (the collaborator pool, not a club).
- "**See the projects**" / "**Listen**" / "**Watch**" — single-verb action links.

---

## 8. Photography distribution

| Page | Subject |
|---|---|
| `/` home | Original five-image showreel + new variety on cards/trending (KT video shots, drag queen, samba, group models, golden-hour portraits, kangaroo playfight, Kanga-Kangaroo animation, KT-Kids singer). |
| `/music` | KT video photography end-to-end (ballet, drag queen, samba, Indian dance, golden-hour silhouettes, group models). |
| `/educational` | KT Kids event series, Kanga-Kangaroo animation stills, animal-behaviour photography. |
| `/impact` | Human group photo (kangaroo behaviour-as-game), kangaroo silhouette at sunset, academic-credit block linking *Behavioral Ecology* paper + drweli.com. |
| `/projects` | Project-specific imagery. |
| `/open-calls` | Briefs only, no decorative imagery. |

URL-encode any filename with a space (`KT kids event1.jpg` → `KT%20kids%20event1.jpg`) for production safety.

---

## 9. Academic foundation

Every project carries a paper, a fieldwork base, or a behavioural finding underneath it. The impact page surfaces this with the *Behavioral Ecology* kangaroo paper, a Mirror-Worlds chapter list, and a clear out-link to **drweli.com** as the parallel academic site. The two sites cite each other.

---

*Last updated: 2026-05-16. Owner: Dr WELI.*
