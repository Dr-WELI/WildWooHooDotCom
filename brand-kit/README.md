# WildWooHoo — Brand Kit

> *The animal kingdom - including us.*

This kit contains everything needed to use the WildWooHoo brand: logo files, the wordmark, the colour palette, the spectrum, the typography system, the philosophy, and where to apply each. Downloadable, shareable, and ready for Canva, Gmail, presentation decks, social profiles, merchandise, and trademark filings.

**Version:** v5.0 (locked). **Owner:** Dr Weliton Menário Costa. **Last updated:** 2026-05-24.

---

## 1. The story in one paragraph

WildWooHoo is a creative studio for the **animal kingdom - including us**. We draw parallels between animal and human societies through music, audiovisuals, and educational materials. The brand is built around three visual ideas:

1. **A single unified glyph** — the W of WildWooHoo, the H of "Hoo," and the two "oo" pairs are drawn as one connected figure on a black tile. Read one way it's a crown. Read another, it's a pair of glasses. Read closely, one of the o's becomes a musical note. The mark hides several identities in one outline — the brand's whole thesis (parallel worlds in a single body) compressed into a sigil.
2. **The horizon-cut tile** — the black tile that holds the glyph has a soft semicircular pinch on each side at the midline. This horizon-cut shape is the brand's signature silhouette. It carries everywhere: the mark, the social profile picture, the OG card frame, accents in section dividers.
3. **Monochrome at rest, full spectrum at interaction.** The mark sits in cream-on-black with a debossed 3D treatment and a faint chromatic aberration baked in. The full rainbow spectrum only appears in interaction — the wordmark's hover shine, the click-burst halo, the radial bloom on the OG card, the soft glow around the header monogram.

---

## 2. Files in this kit

```
brand-kit/
├── README.md                       ← you are here (text reference)
├── index.html                      ← visual brand kit (open in a browser)
├── wildwoohoo-brand-kit.zip        ← whole kit zipped, ready to share
├── starfield.svg                   ← Southern Cross hero backdrop
├── logos/
│   ├── monogram-glow.png           (primary 2048-px raster master)
│   ├── monogram-glow.svg           (PNG-wrapped-in-SVG for HTML use)
│   ├── monogram-glow-cutout.png    (alpha-cut variant for overlay use)
│   ├── wordmark.svg                (ink — for cream surfaces)
│   ├── wordmark-white.svg          (cream — for dark surfaces)
│   ├── wordmark-glow.svg           (with rainbow shine on hover)
│   ├── png/
│   │   ├── monogram-glow-{64,128,256,512,1024,2048}.png
│   │   ├── wordmark-{1200,2400,4800}.png            (ink)
│   │   ├── wordmark-white-{1200,2400,4800}.png      (cream)
│   │   ├── wordmark-glow-{1200,2400,4800}.png       (glow variant)
│   │   └── legacy/                  (v4 variants — historical reference)
│   ├── legacy/                      (v4 SVG variants — historical reference)
│   └── _source/                     (raw Gemini outputs + working PSDs)
├── social/
│   ├── profile-glow-{512,1024,2048}.png    (primary profile picture)
│   ├── WILDWOOHOO YT BANNER.png            (YouTube banner)
│   └── WildWooHoo - YT.png                 (YouTube profile)
├── og/
│   ├── og-card.png                  (link previews — Twitter/LinkedIn/FB)
│   ├── og-rect-1200x630.png         (legacy)
│   ├── og-square-1080.png           (square IG / general)
│   └── _og-template.html            (HTML template - edit & re-render)
└── legacy-brand/                    (full v3/v4 brand work, archived)
```

**SVG** — vector for the wordmark, scales without loss.
**PNG** — raster for the monogram (the chromatic aberration + embossed treatment cannot be reproduced as SVG paths). The 2048-px master is the canonical file.

---

## 3. The mark

The mark is a **black horizon-cut tile** with the unified W+H+oo glyph rendered in cream, with a **debossed 3D treatment** and a faint **chromatic aberration** (red and cyan offsets at the edges) that gives the surface a printed-with-light quality. A soft halo sits around the glyph.

### Why a single variant

Earlier brand iterations (v4.x) offered four colour variants — black, inverted, savanna green, rainbow rim. v5 collapses these to a single primary mark. The reason: the chromatic aberration and embossed surface already carry the full brand palette in trace amounts; offering a "rainbow rim" variant alongside duplicated the message. The single mark works on every surface because the tile is dark and self-contained.

For light-on-light contexts (e.g. cream poster paper) where the black tile is too heavy, use the **wordmark** instead. The rule (§5) below explains.

### Recommended export sizes

| Pixel size | Use |
|---|---|
| 64 | Inline icon, tiny app context |
| 128 | Small avatar, list-row icon |
| 256 | Medium avatar |
| 512 | Profile pictures (Twitter / X, LinkedIn) — minimum |
| 1024 | Profile pictures (Instagram, TikTok, YouTube) — recommended |
| 2048 | Print, large display, slide masters |

### The horizon-cut silhouette

The tile pinches inward at the midline — a soft semicircular cut on the left and right sides — so the silhouette is never a plain rounded square. This shape is the brand's signature and reappears as:

- The frame behind the OG share card centre
- The shape of the favicon and the app tile
- Subtle dividers between sections on web (future)
- The shape language of any future merch tags, business cards, stickers

---

## 4. The wordmark

**"WildWooHoo"** drawn as **outlined geometric monoline letters** — AWAL-style. Every letter shows two parallel hairlines tracing the borders of a thick stroke. The interior of each letter is transparent so background images read through. The two Ws and the H share the heavier stroke; the lowercase i, l, d, o use a lighter stroke. H is drawn at the same visual width as W so the caps read with equal weight. A small filled dot above the i.

**Hover state** (web only): a soft cream-amber-coral-lavender-savanna halo blooms behind the letters, and a diagonal rainbow shine sweeps left-to-right across the strokes. Click-burst fires the same on touch.

**Three colour variants** are provided:
- `wordmark.svg` — **ink** (`#0E0E0F`). Default. Use on cream / light surfaces.
- `wordmark-white.svg` — **cream** (`#FBF7EE`). Use on night-savanna / dark surfaces / photography where the dark wordmark would disappear.
- `wordmark-glow.svg` — for hero / display use on dark surfaces, with built-in halo.

Use the wordmark for: splash hero on the website, footer, posters, T-shirts and merchandise, presentation title slides, business cards, mastheads.

---

## 5. The rule — never together

**The mark and the wordmark are never used together.** The W in the wordmark already plays the role of the mark — pairing them duplicates the message and weakens both. If a context needs "an icon and a name," use the **wordmark only**. If it needs just an icon (favicon, app tile, profile picture), use the **mark only**.

---

## 6. Colour palette

### Core inks
| Token | Hex | RGB | Role |
|---|---|---|---|
| `brand-cream` | `#FBF7EE` | `251, 247, 238` | Primary surface; the glyph in the mark; reverse text on dark surfaces. |
| `brand-ink` | `#0E0E0F` | `14, 14, 15` | Primary text; the tile of the mark. |
| `brand-sand` | `#F4ECDD` | `244, 236, 221` | Soft secondary surface. |
| `brand-night-savanna` | `#0A1F14` | `10, 31, 20` | Deep green-black for dark surfaces. |

### Brand accents
| Token | Hex | RGB | Role |
|---|---|---|---|
| `brand-savanna` | `#27A05B` | `39, 160, 91` | Savanna emerald — links, active states. |
| `brand-savanna-deep` | `#1A4A28` | `26, 74, 40` | Deep forest — dense hover emphasis. |
| `brand-honey` | `#E5B96D` | `229, 185, 109` | Golden honey — secondary warm accent. |
| `brand-amber` | `#B07F30` | `176, 127, 48` | Deep amber — tertiary warm accent. |

### Site primary
The website's primary palette is **monochrome**: cream surface + ink text + the mark in its single primary form. Colour appears only as the **spectrum** at the moment of interaction (hover, focus, active states, halo around the mark).

---

## 7. The spectrum (the rainbow)

The brand's rainbow is sampled pixel-by-pixel from the two reference photos (rainbow-kangaroo at sunset + kangaroo mob in the green savanna). It only ever appears at **moments of interaction or atmosphere**: the chromatic aberration baked into the mark, the halo around the small monogram, the wordmark's hover shine, the click-burst, the radial bloom on the OG share card, the slow ambient cycle on header em words. **Never as flat decoration.**

| Token | Hex | RGB | Sampled from |
|---|---|---|---|
| `spectrum-red` | `#C97A66` | `201, 122, 102` | Rainbow band, dusty terracotta |
| `spectrum-peach` | `#D89E78` | `216, 158, 120` | Horizon glow, warm peach |
| `spectrum-honey` | `#E5B96D` | `229, 185, 109` | Golden honey transition |
| `spectrum-savanna` | `#27A05B` | `39, 160, 91` | Savanna green (centre of spectrum) |
| `spectrum-amber` | `#B07F30` | `176, 127, 48` | Deep golden hour amber |
| `spectrum-sage` | `#B59B6D` | `181, 155, 109` | Bush sage |
| `spectrum-lavender` | `#9985A8` | `153, 133, 168` | Upper sky, dusk lavender |
| `spectrum-violet` | `#7D6E92` | `125, 110, 146` | Deepest sky, twilight |

The order from left to right in any spectrum gradient: **red → peach → honey → savanna → amber → sage → lavender → violet**.

---

## 8. Typography

| Role | Family | Source | Weights used |
|---|---|---|---|
| **Headlines, navigation, CTAs** | Comfortaa | Google Fonts | 400, 500, 600, 700 |
| **Italic accent words inside heads** | Syne | Google Fonts | 500, 600, 700, 800 |
| **Body, UI, paragraphs** | Inter | Google Fonts | 400, 500, 600, 700 |
| **Italic body emphasis** | Instrument Serif | Google Fonts | 400 italic |
| **Handwritten / signature accents** | Caveat | Google Fonts | 500, 700 |
| **Editorial display (sparingly)** | Big Shoulders Display | Google Fonts | 700, 800, 900 |
| **Editorial alt (sparingly)** | Libre Baskerville | Google Fonts | 400, 700 |

### The font logic, in one paragraph

**Comfortaa** carries every headline, nav link, and CTA — its rounded geometry rhymes with the monogram's circular o's and the wordmark's curved letter terminals. When a headline contains an emphasised word in italics (*including us*, *travels*, *moving*, *partners*), that word switches to **Syne** in italic — Syne is sharper, more angular, gives the accent word lift. **Inter** runs all body copy, captions, menus, button text, footer. **Instrument Serif Italic** is reserved for italic prose emphasis within paragraphs. **Caveat** is the brand's handwritten voice — used for signatures, margin notes, occasional headline accents (e.g. brand-kit page subheads). Big Shoulders Display and Libre Baskerville are retained as legacy editorial alternates but rarely used.

### Installing the fonts

**On the web (any page):** paste this into the `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Comfortaa:wght@400;500;600;700&family=Syne:wght@500;600;700;800&family=Inter:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&family=Caveat:wght@500;700&family=Big+Shoulders+Display:wght@700;800;900&family=Libre+Baskerville:wght@400;700&display=swap">
```

**On your computer (for Keynote, PowerPoint, Word, Pages, Figma desktop, Canva desktop):** download each family from `fonts.google.com/specimen/<family-name>` and install the .ttf files. Once installed, the families appear in every app's font picker.

**Canva:** Comfortaa, Syne, Inter, Instrument Serif, Caveat, Big Shoulders Display, and Libre Baskerville are all in Canva's library — search by name.

**Google Workspace (Gmail / Docs / Slides):** all listed families are available in the "more fonts" picker in Docs and Slides (click the font dropdown, then "More fonts", then search). Gmail signatures use a fixed font set; pair the wordmark PNG with system fonts for body text.

---

## 9. How the mark and the wordmark talk to each other

They share **one principle (parallel identities in one body)** and **one device (chromatic light)**:

- The **mark** compresses the whole brand into a single tile. One glyph is W and H and oo and crown and glasses and (when you look at one o) a music note. The horizon-cut on the tile signals the parallel-worlds idea before the eye even reads the glyph.
- The **wordmark** stretches the same principle across a word. Two outlined Ws, a heavy H, and four o's — every letter is two parallel hairlines, like a stroke that's been outlined.
- The **spectrum** stays out of both at rest. It appears only in atmosphere (the chromatic aberration baked into the mark, the halo around small instances) and motion (the wordmark's hover shine, the click-burst). Three different presences, one shared palette.

The **monochrome at rest, rainbow at interaction** rule is the brand's whole tension. Quiet most of the time, alive in the moments of contact.

---

## 10. Where to use what

| Context | Asset | Notes |
|---|---|---|
| Website header, favicon, app tile | `monogram-glow.svg` (or .png 256) | The PNG-wrapped SVG renders cleanly at any size; small (~42px) head context. |
| Social profile pictures | `social/profile-glow-1024.png` | Square format, circle-safe. 1024 for IG/TikTok/YouTube, 512 minimum for X / LinkedIn. |
| Splash hero / landing page | `wordmark-glow.svg` | SVG so the outline + hover halo render cleanly. |
| Presentation title slides | `png/wordmark-2400.png` or `png/wordmark-white-2400.png` | High-res raster; pick the colour based on slide background. |
| Posters, T-shirts, merchandise | `wordmark.svg` (vector) | Single-ink works because letters are already outlined. |
| Email signature | `png/wordmark-1200.png` | Resize to max 200px tall in your signature editor. |
| Watermark on photography | `png/monogram-glow-128.png` at ~30% opacity | Bottom-right corner. |
| OG share card (link previews) | `og/og-card.png` (or site root `/og-card.png`) | 1200×630, centred wordmark + spectrum bloom + tagline. |
| YouTube banner | `social/WILDWOOHOO YT BANNER.png` | 2560×1440 with safe-area centred. |
| Trademark filing | `monogram-glow.svg` + `wordmark.svg` as a separate mark | Register the mark and wordmark separately; see §12. |

---

## 11. Quick start in popular software

**Canva.** Upload the SVGs (wordmark) and PNGs (monogram) to your Brand Kit (Canva Pro). Drop them into any design — vectors scale without loss; the monogram raster at 2048 is plenty for most layouts. Paste the hex codes from §6 into your Brand Kit colour swatches. Pre-loaded fonts: Comfortaa, Syne, Inter, Instrument Serif, Caveat, Big Shoulders Display, Libre Baskerville.

**Google Slides.** Insert → Image → Upload from computer. Pick the wordmark SVG (Slides accepts SVG since 2023) and the monogram PNG at 2048. For body text, change the theme fonts to Inter (body) + Comfortaa (heads) via the "more fonts" picker.

**Keynote / PowerPoint.** Insert the PNG version for the monogram; the wordmark SVG should also import cleanly into Keynote (and via Insert → Picture on PowerPoint 365+). Use the 2048 monogram or 4800 wordmark for highest quality.

**Figma.** Drop the SVGs (wordmark) into a new file. The monogram is best brought in as a PNG at 2048 for raster fidelity, or use the SVG wrapper if you just need a placeholder.

**Gmail signature.** Upload the 1200-wide wordmark PNG to a host (your domain works) and reference the URL in your signature image. Recommended max 200px tall on display.

**Notion.** Drag SVG or PNG into a page. For the cover image, use a wordmark PNG (4800-wide for retina).

**Adobe Illustrator / Photoshop.** Open the wordmark SVGs directly in Illustrator. For the monogram, open the 2048 PNG in Photoshop and treat as a smart object.

---

## 12. For commercial use & trademark registration

The mark and the wordmark are **two separate intellectual works** — register them as separate trademarks for maximum protection.

**For trademark filing:**
- **The mark.** Submit `monogram-glow.png` (the 2048-px master) or `monogram-glow.svg` (PNG-wrapped). Description: *"A square tile with semicircular concave indentations on each side at its vertical midpoint (a 'horizon-cut' tile). The tile is rendered in dark ink. Inside the tile is a unified cream-coloured glyph combining the letters W, H, and two double-o pairs in a single connected outline, with a soft chromatic aberration around the stroke edges."* Class likely 9 (digital/audiovisual goods) and/or 41 (entertainment, education services).
- **The wordmark.** Submit `wordmark.svg`. Description: *"The wordmark 'WildWooHoo' rendered in a custom geometric monoline outlined typeface. The capital letters W and H are drawn at equal cap-width and use a heavier stroke than the lowercase i, l, d, o. The interior of each glyph is transparent. A small filled dot sits above the lowercase i."* Same classes.
- **The colour palette and the spectrum** are described in §6-7 but typically aren't claimed in standard wordmark/figurative trademark registrations (would require a separate colour mark filing, rarely worth it).

**Founder & first use.** WildWooHoo is owned by **Dr Weliton Menário Costa** (Sydney-based Brazilian-born behavioural ecologist + music artist, PhD ANU). First use of the v5 brand identity: **2026-05-24**. Earlier iterations (v3/v4) exist in `legacy-brand/` and in the project's git history if continuity-of-use needs to be demonstrated.

**Domain.** `wildwoohoo.com` — registered.

---

## 13. Sharing this kit

This whole directory (`brand-kit/`) is self-contained. To share with a designer, a printer, a journalist, a venue, or anyone who needs the brand:

1. Use the prepared `wildwoohoo-brand-kit.zip` in this directory (regenerated each release), or
2. Zip a fresh snapshot: `cd brand-kit/.. && zip -r wildwoohoo-brand-kit.zip brand-kit/ -x "*/_source/*" "*/.DS_Store"`

Send via email, Drive, Dropbox, WeTransfer. The recipient gets every file they need plus this README. No internet connection required to view (HTML brand kit and SVGs are all local).

---

## 14. Versioning

| Version | Date | What changed |
|---|---|---|
| **v5.0** | 2026-05-24 | Single primary mark (Gemini-derived W+H+oo unified glyph on horizon-cut black tile with embossed/chromatic treatment). Font system simplified to Comfortaa heads / Syne italic accents / Inter body. Multi-variant marks (black/inverted/green/rainbow-rim) retired to `legacy/`. Wordmark unchanged. New `og-card.png` for social shares. |
| v4.3 | 2026-05-21 | Wordmark d fixed. Brand kit assembled. |
| v4.2 | 2026-05-21 | Outline wordmark, inverted mark as primary, rainbow headers, rainbow CTAs. |
| v4.1 | 2026-05-21 | Three mark variants, restored wordmark logic, rainbow CTA shine. |
| v4.0 | 2026-05-21 | Locked monochrome direction, font system, new hover behaviour. |
| v3.x | 2026-05-18 | Photographic spectrum direction (retired). |
| v2.x | 2026-05-15 | DM Serif Display wordmark + globe monogram (retired). |

---

*Designed with Claude Opus 4.7. Brand DNA, decisions, and the studio it serves belong to Dr Weli.*
