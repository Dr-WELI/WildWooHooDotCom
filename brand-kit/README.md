# WildWooHoo — Brand Kit

> *The animal kingdom — including us.*

This kit contains everything needed to use the WildWooHoo brand: logo files, wordmark files, the colour palette, the spectrum, the typography system, the philosophy, and where to apply each. Downloadable, shareable, and ready for Canva, Gmail, presentation decks, social profiles, merchandise, and trademark filings.

**Version:** v4.3 (locked). **Owner:** Dr Weliton Menário Costa. **Last updated:** 2026-05-21.

---

## 1. The story in one paragraph

WildWooHoo is a creative studio for the **animal kingdom — including us**. We draw parallels between animal and human societies through music, audiovisuals, and educational materials. The brand is built around **two visual ideas**: a custom-drawn W (the brand's first letter, also a "mirror" of itself), and a **horizon hairline** that runs through the middle of every mark and word — the seam where two worlds (the animal and the human) meet. The mark hides this duality in a single shape; the wordmark spreads it across "WildWooHoo." Colour stays mostly **monochrome at rest**, with the **full rainbow spectrum** appearing only at moments of interaction — like light catching a prism.

---

## 2. Files in this kit

```
brand-kit/
├── README.md                       ← you are here (text reference)
├── index.html                      ← visual brand kit (open in a browser)
├── wildwoohoo-brand-kit.zip        ← whole kit zipped, ready to share
├── logos/
│   ├── monogram-inverted.svg       (primary)
│   ├── monogram-black.svg
│   ├── monogram-green.svg
│   ├── monogram-rainbow.svg        (rainbow-rim variant)
│   ├── wordmark.svg                (ink — for cream surfaces)
│   ├── wordmark-white.svg          (cream — for dark surfaces)
│   └── png/
│       ├── monogram-inverted-{64,128,256,512,1024,2048}.png
│       ├── monogram-black-{64,128,256,512,1024,2048}.png
│       ├── monogram-green-{64,128,256,512,1024,2048}.png
│       ├── monogram-rainbow-{64,128,256,512,1024,2048}.png
│       ├── wordmark-{1200,2400,4800}.png            (ink)
│       └── wordmark-white-{1200,2400,4800}.png      (cream)
├── social/
│   ├── profile-inverted-{512,1024,2048}.png    (primary profile picture)
│   ├── profile-black-1024.png
│   ├── profile-green-1024.png
│   └── profile-rainbow-1024.png
└── og/
    ├── og-rect-1200x630.png        (link previews — Twitter/LinkedIn/FB)
    ├── og-square-1080.png          (square IG / general)
    └── _og-template.html           (HTML template - edit & re-render to regenerate)
```

**SVG = vector** — use for the website, the deck master, anything that scales without loss.
**PNG = raster** — use for Canva, Gmail signatures, social profiles, presentations, anything that wants a pixel image.

---

## 3. The mark — three variants

The mark is a horizon-pinched square tile. Inside it sits a custom W on top, a faint reflected M underneath, and a **horizon hairline** running through the middle. The tile shape itself **pinches inward** at the horizon — the icon embodies "two worlds meeting" before you even read the W.

| Variant | Tile | Glyph | When to use |
|---|---|---|---|
| **Inverted** *(primary)* | Cream `#FBF7EE` | Ink `#0E0E0F` | The default. Use on dark surfaces, photographic backgrounds, the website header. Light tile lets the silhouette punch out as a paper shape. |
| **Black** | Ink `#0E0E0F` | Cream `#FBF7EE` | Use on cream/light surfaces. The dark mark gives strong contrast. Good for print, single-ink merch, light-themed slides. |
| **Savanna green** | Green `#1A4A28` | Cream `#FBF7EE` | Festive / warm contexts. Profile pictures on platforms with a green-leaning aesthetic, or moments where the brand wants to feel alive rather than minimal. |
| **Rainbow rim** | Ink centre + spectrum rim | Cream `#FBF7EE` | The hover-end frame of the black mark, frozen as a still. Most of the tile is ink black; the rainbow only glows at the perimeter. For launches, anniversaries, end-of-year posts, anything that wants the brand to feel alive without losing its dark elegance. |

**Hover state** (web only): both Ws fade and converge to the centre — a single unified W emerges on the horizon, slightly larger; a spectrum bloom flashes outward once; a **rainbow rim glow** appears at the perimeter; the horizon hairline turns rainbow. The static SVG/PNG variants are the rest state.

### Recommended export sizes

| Pixel size | Use |
|---|---|
| 64 | Inline icon, tiny app context |
| 128 | Small avatar, list-row icon |
| 256 | Medium avatar |
| 512 | Profile pictures (Twitter / X, LinkedIn) — minimum |
| 1024 | Profile pictures (Instagram, TikTok, YouTube) — recommended |
| 2048 | Print, large display, slide masters |

---

## 4. The wordmark

**"WildWooHoo"** drawn as **outlined geometric monoline letters** — AWAL-style. Every letter shows two parallel hairlines tracing the borders of a thick stroke. The interior of each letter is transparent so background images read through. The two Ws and the H share the heavy stroke of the monogram (the same brand W appears identically in the icon and the wordmark). The lowercase i, l, d, o use a lighter stroke. H is drawn at the same visual width as W so the caps read with equal weight.

**Hover state** (web only): a rainbow shine sweeps left-to-right across the wordmark.

**Two colour variants** are provided:
- `wordmark.svg` — **ink** (`#0E0E0F`). Default. Use on cream / light surfaces.
- `wordmark-white.svg` — **cream** (`#FBF7EE`). Use on night-savanna / dark surfaces / photography where the dark wordmark would disappear.

Use the wordmark for: splash hero on the website, footer, posters, T-shirts and merchandise, presentation title slides, business cards, mastheads.

---

## 5. The rule — never together

**The mark and the wordmark are never used together.** The W in the wordmark already plays the role of the mark — pairing them duplicates the message and weakens both. If a context needs "an icon and a name," use the **wordmark only**. If it needs just an icon (favicon, app tile, profile picture), use the **mark only**.

---

## 6. Colour palette

### Core inks
| Token | Hex | RGB | Role |
|---|---|---|---|
| `mark-glyph` / `brand-cream` | `#FBF7EE` | `251, 247, 238` | Primary surface; the W in the inverted mark; reverse text on dark surfaces. |
| `brand-ink` / `mark-tile` | `#0E0E0F` | `14, 14, 15` | Primary text; the tile of the black mark; the W in the inverted mark. |
| `brand-sand` | `#F4ECDD` | `244, 236, 221` | Soft secondary surface. |
| `brand-night-savanna` | `#0A1F14` | `10, 31, 20` | Deep green-black for dark surfaces. |

### Brand accents
| Token | Hex | RGB | Role |
|---|---|---|---|
| `brand-savanna` | `#27A05B` | `39, 160, 91` | Savanna emerald — links, active states. |
| `brand-savanna-deep` | `#1A4A28` | `26, 74, 40` | Deep forest — the green mark's tile, dense hover emphasis. |
| `brand-honey` | `#E5B96D` | `229, 185, 109` | Golden honey — secondary warm accent. |
| `brand-amber` | `#B07F30` | `176, 127, 48` | Deep amber — tertiary warm accent. |

### Site primary
The website's primary palette is **monochrome**: cream surface + ink text + the mark in inverted form. Colour appears only as the **spectrum** at the moment of interaction (hover, focus, active states).

---

## 7. The spectrum (the rainbow)

The brand's rainbow is sampled pixel-by-pixel from the two reference photos (rainbow-kangaroo at sunset + kangaroo mob in the green savanna). It only ever appears at **moments of interaction**: hover, the wordmark's signature horizon hairline, the mark's hover rim, the CTA shine, the slow ambient cycle on header em words. **Never as static decoration.**

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
| **Mark / display** | Big Shoulders Inline Display *(primary)* with Big Shoulders Display as fallback | Google Fonts | 700, 800, 900 |
| **Editorial display** | DM Serif Display | Google Fonts | 400 (regular + italic) |
| **Section headlines** | Libre Baskerville | Google Fonts | 400, 700 |
| **Italic emphasis** | Instrument Serif Italic | Google Fonts | 400 italic |
| **Handwritten emphasis** | Caveat | Google Fonts | 500, 700 |
| **Body, navigation, UI** | Montserrat | Google Fonts | 400, 500, 700 |

**Why Big Shoulders Inline Display for the mark / display:** the brand's W is a custom-drawn geometric monoline (heavy thick lines, sharp angular vertices, round caps, well-spaced like a zig-zag). Big Shoulders Inline Display has built-in parallel inner strokes — the closest free typeface to the brand W's outline DNA. When you need to write display text in the brand's voice (a headline, a slide title, a poster), this is the font that matches the logo.

### Installing the fonts

**On the web (any page):** paste this into the `<head>`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Big+Shoulders+Display:wght@700;800;900&family=Big+Shoulders+Inline+Display:wght@700;800;900&family=Caveat:wght@500;700&family=DM+Serif+Display:ital@0;1&family=Instrument+Serif:ital@0;1&family=Libre+Baskerville:wght@400;700&family=Montserrat:wght@400;500;700&display=swap">
```

**On your computer (for Keynote, PowerPoint, Word, Pages, Figma desktop, Canva desktop):** download each family from `fonts.google.com/specimen/<family-name>` and install the .ttf files. Once installed, the families appear in every app's font picker.

**Canva:** Big Shoulders Display, DM Serif Display, Libre Baskerville, Montserrat, Caveat, and Instrument Serif are already in Canva's library — search by name. Big Shoulders **Inline** Display is on Google Fonts but not yet in Canva's default library; if you need it specifically, use the **Brand Kit → Upload font** flow on Canva Pro to add it from the .ttf you've downloaded.

**Google Workspace (Gmail / Docs / Slides):** Big Shoulders Display, Caveat, DM Serif Display, Libre Baskerville, Instrument Serif and Montserrat are all available in the "more fonts" picker in Docs and Slides (click the font dropdown, then "More fonts", then search). Gmail signatures use a fixed font set; pair the wordmark PNG with system fonts for body text.

---

## 9. How the mark and the wordmark talk to each other

They share **one shape (the W)** and **one device (the horizon line)**:

- The **mark** is the W compressed into a square. The W sits on top, its mirror M sits underneath, and the horizon hairline is the seam between them. The whole brand is hidden inside one tile.
- The **wordmark** is the W stretched into a word. The same custom W path appears as the capital W at the start of "Wild" and at the start of "Woo." The H of "Hoo" is drawn at the same width as the W so the caps read with equal weight. The horizon hairline lives implicitly in the seam of every letter — every glyph shows two parallel hairlines, like a stroke that's been outlined.
- The **spectrum** stays out of both at rest. It appears only in motion — the mark's hover rim, the wordmark's hover shine, the CTA sweep on every button. Three different motions, one shared palette.

The **monochrome at rest, rainbow at interaction** rule is the brand's whole tension. Quiet most of the time, alive in the moments of contact.

---

## 10. Where to use what

| Context | Asset | Notes |
|---|---|---|
| Website header, favicon, app tile | `monogram-inverted.svg` (primary) | The inverted variant. Cream on the cream surface reads as paper. |
| Social profile pictures (Instagram, LinkedIn, TikTok, YouTube) | `png/monogram-inverted-1024.png` | Square format. Use 1024 for high-res platforms; 512 minimum. |
| Splash hero / landing page | `wordmark.svg` | Always SVG on the web so the outline renders cleanly. |
| Presentation title slides | `png/wordmark-2400.png` | High-res raster; place on cream slide for the outline to read. |
| Posters, T-shirts, merchandise | `wordmark.svg` (vector) | Vector for scaling; single-ink works because letters are already outlined. |
| Email signature | `png/wordmark-1200.png` + brand colours | Resize the PNG to max 200px tall in your signature editor. |
| Watermark on photography | `monogram-black-128.png` at low opacity | Bottom-right corner, ~30-40% opacity. |
| OG share card (link previews) | TBD `og/` exports | Use site's existing `og-image-1200x630.png` for now. |
| Trademark filing | `monogram-inverted.svg` + the wordmark as a separate mark | Register the mark and wordmark separately; see §12 below. |

---

## 11. Quick start in popular software

**Canva.** Upload the SVGs to your Brand Kit (Canva Pro). Then drop them into any design — they scale without quality loss. For the colour palette, paste the hex codes from §6 into your Brand Kit colour swatches. Pre-loaded fonts: Big Shoulders Display, DM Serif Display, Libre Baskerville, Montserrat, Caveat, Instrument Serif.

**Google Slides.** Insert → Image → Upload from computer. Pick the SVG (Slides accepts SVG since 2023). For body text, change the theme fonts to Montserrat (body) + Libre Baskerville (headings) + Big Shoulders Display (display) via the "more fonts" picker.

**Keynote / PowerPoint.** Insert the PNG version (these apps don't render SVG natively at full fidelity). Use the 2048 monogram or 4800 wordmark for highest quality.

**Figma.** Drop the SVGs into a new file. The mask-based wordmark will render with full outline fidelity. Set up brand colour styles using the §6 hex codes.

**Gmail signature.** Upload the 1200-wide wordmark PNG to a host (your domain works) and reference the URL in your signature image. Recommended max 200px tall on display.

**Notion.** Drag SVG or PNG into a page. For the cover image, use a wordmark PNG (4800-wide for retina).

**Adobe Illustrator / Photoshop.** Open the SVGs directly in Illustrator. Photoshop: import the PNGs or import the SVGs as smart objects.

---

## 12. For commercial use & trademark registration

The mark and the wordmark are **two separate intellectual works** — register them as separate trademarks for maximum protection.

**For trademark filing:**
- **The mark.** Submit `monogram-inverted.svg` (the primary) or `monogram-black.svg` (the black-and-white version is what trademark offices prefer for unrestricted colour use). Description: *"A horizon-pinched square tile containing a stylised W glyph in the upper half, its mirror M in the lower half at reduced opacity, separated by a horizontal hairline."* Class likely 9 (digital/audiovisual goods) and/or 41 (entertainment, education services).
- **The wordmark.** Submit `wordmark.svg`. Description: *"The wordmark 'WildWooHoo' rendered in a custom geometric monoline outlined typeface. The capital letters W and H are drawn at equal cap-width and use a heavier stroke than the lowercase i, l, d, o. The interior of each glyph is transparent."* Same classes.
- **The colour palette and the spectrum** are described in §6-7 but typically aren't claimed in standard wordmark/figurative trademark registrations (would require a separate colour mark filing, rarely worth it).

**Founder & first use.** WildWooHoo is owned by **Dr Weliton Menário Costa** (Brazilian-Australian behavioural ecologist, PhD ANU). First use of the v4 brand identity: **2026-05-21**. Earlier iterations exist in the project's git history if continuity-of-use needs to be demonstrated.

**Domain.** `wildwoohoo.com` — registered.

---

## 13. Sharing this kit

This whole directory (`brand-kit/`) is self-contained. To share with a designer, a printer, a journalist, a venue, or anyone who needs the brand:

1. Zip the directory: `zip -r wildwoohoo-brand-kit.zip brand-kit/`
2. Send via email, Drive, Dropbox, WeTransfer.

The recipient gets every file they could need plus this README. No internet connection required to view (HTML brand kit and SVGs are all local).

---

## 14. Versioning

| Version | Date | What changed |
|---|---|---|
| **v4.3** | 2026-05-21 | Wordmark d fixed (now reads as "d" not "ol"). Brand kit assembled. |
| v4.2 | 2026-05-21 | Outline wordmark, inverted mark as primary, rainbow headers, rainbow CTAs. |
| v4.1 | 2026-05-21 | Three mark variants, restored wordmark logic, rainbow CTA shine. |
| v4.0 | 2026-05-21 | Locked monochrome direction, font system, new hover behaviour. |
| v3.x | 2026-05-18 | Photographic spectrum direction (retired). |
| v2.x | 2026-05-15 | DM Serif Display wordmark + globe monogram (retired). |

---

*Designed with Claude Opus 4.7. Brand DNA, decisions, and the studio it serves belong to Dr Weli.*
