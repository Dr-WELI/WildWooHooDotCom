# WildWooHoo — Trademark Submission Package

**For:** IP Australia trademark application
**Applicant:** Dr Weliton Menário Costa (Dr WELI) / WildWooHoo
**Prepared:** 2026-06-08
**Source repo commit:** see git log

This folder contains the canonical WildWooHoo brand mark in all the forms IP Australia or any other registrar is likely to ask for.

---

## 1. Files in this package

### Vector (preferred for TM submission)

| File | What it is | Use |
|---|---|---|
| `wildwoohoo-lockup-color.svg` | Full lockup (chip + wordmark + tagline), brand colour palette | Canonical mark |
| `wildwoohoo-lockup-grayscale.svg` | Same lockup, chip greyscaled, neutral text | Print, grayscale reproduction |
| `wildwoohoo-lockup-black.svg` | Full lockup, pure black, single colour | Stamps, faxed forms, single-ink printing |
| `wildwoohoo-wordmark-only.svg` | Wordmark alone (no chip, no tagline) | If filing wordmark separately |

### Raster (chip only)

| File | What it is | Resolution |
|---|---|---|
| `wildwoohoo-chip-green.png` | Cleaned green chip, full transparency | 2048 x 2048 |
| `wildwoohoo-chip-grayscale.png` | Greyscale chip | 2048 x 2048 |
| `wildwoohoo-chip-black.png` | Black silhouette | 2048 x 2048 |
| `wildwoohoo-chip-white.png` | White silhouette | 2048 x 2048 |

### Preview / PNG export

| File | What it is |
|---|---|
| `lockup-preview.html` | Self-contained interactive preview. Open in any modern browser to switch between backgrounds (dark / cream / transparent), variants (color / dark-on-light / all-black / all-white), and chip treatments (green / grayscale / black). Export to PNG via Cmd+Shift+4 on Mac, or Chrome DevTools "Capture node screenshot". |

---

## 2. Mark description (for the TM form)

The mark consists of three elements arranged vertically:

1. **The chip mark.** A rounded-square device tile rendered in emerald/sage green with a stylised "W" monogram at its centre. The W is flanked at the lower half by two filled circles (cyan and yellow) and crowned by a small filled triangle (magenta). HUD-style microtext sits around the inner border. The chip has small horizontal slot cuts on its left and right outer edges that establish a brand-mark signature shape.

2. **The wordmark "WildWooHoo".** An open-outline display lettering in cream (#FBF7EE), drawn as connected zig-zag, vertical, arc and circle elements. The leftmost W and rightmost o carry small slot cuts on their outer edges with a small inward projection inside the letter — mirroring the chip's edge cuts.

3. **The tagline "what we evolved for".** Set in Comfortaa Medium 500, with the closing word "for" in Comfortaa Bold 700 in a brand sage green (#82BC97), the rest in light sage (#C5DFC3).

The three elements form a single brand lockup. The chip-to-wordmark spacing is approximately 1x the wordmark cap-height; the wordmark-to-tagline spacing is approximately 0.5x cap-height.

---

## 3. Brand specifications

### Colour palette

| Role | Name | Hex | Notes |
|---|---|---|---|
| Chip body | Emerald | #437055 | Anchor brand colour |
| Chip body, mid | Forest mid | #355B42 | |
| Chip dots | Cyan | #5DDFE6 | |
| Chip dots | Yellow | #F0E572 | |
| Chip triangle | Magenta | #DC3CAD | |
| Wordmark + tagline base | Cream | #FBF7EE | |
| Tagline base | Sage light | #C5DFC3 | |
| Tagline accent ("for") | Sage bright | #82BC97 | Main brand accent green |
| Backdrop | Void deep | #0A0A0D | Dark backdrop |

### Typography

| Element | Font | Weight |
|---|---|---|
| Wordmark | Custom (outlined geometric, defined by the SVG paths in this package) | — |
| Tagline base | Comfortaa | 500 (Medium) |
| Tagline accent | Comfortaa | 700 (Bold) |

Comfortaa is open-source (SIL OFL). https://fonts.google.com/specimen/Comfortaa

---

## 4. Clear-space and minimum-size rules (for the TM brand book section, if asked)

- **Clear space around the lockup.** Maintain clear space of at least the chip-height on all sides; do not place text or other marks within that zone.
- **Minimum size.** The chip mark must be reproduced at minimum 16 px square. The full lockup must be reproduced at minimum 240 px wide.
- **Backgrounds.** The colour lockup is intended for dark backgrounds (canonical use). The dark-on-light variant is for cream/paper backgrounds. The all-black and all-white variants are for single-colour reproduction (stamps, fax, single-ink print).
- **Do not.** Do not recolour the chip body to any colour other than emerald, greyscale, black, or white. Do not change the wordmark proportions, replace the tagline font, or rearrange the vertical order.

---

## 5. Provenance

The current canonical files in this folder were generated from the live wildwoohoo.com site as at 2026-06-08 commit `361f980` (CSS) and `99248a7` (wordmark cuts). The chip was cleaned from a Gemini-AI-assisted source upload (commit `dc7e5f8`); the source PNG had a burned-in checkerboard "background" and a small Gemini-watermark sparkle that were both removed via Python+PIL+scipy chroma-key + corner-clear. The cleaned chip is the master.

If a registrar prefers different sizing, asks for white-background flat PNGs, or wants the wordmark filed as a separate mark, the source SVG and the `lockup-preview.html` browser exporter handle every combination without re-rendering from the live site.

---

## 6. Contact

- Applicant: Dr Weliton Menário Costa
- Trading as: WildWooHoo
- Email: hello@wildwoohoo.com
- Website: https://wildwoohoo.com
- Studio location: Sydney, NSW, Australia
