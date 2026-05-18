# WildWooHoo - Brand Guidelines (locked v8)

> The animal kingdom - including us. Music, audiovisuals and educational materials born from animal behaviour, ecology and evolution. Photographic. Modern-classic. A single light moment as the brand's interactive signature.

---

## 1. Essence

**WildWooHoo** is a creative studio for **the animal kingdom - including us**. Edge: animal behaviour and sociality seen through evolution. We draw **parallels** between animal and human societies through music, audiovisuals and educational materials. Despite all the worlds we have built, biologically we remain part of the animal kingdom.

Adjacent territory the work touches: ecology, ecosystems, evolution, social evolution, anthropology, traditional and First Nations knowledge.

Founded by **Dr WELI**, Brazilian-Australian behavioural ecologist (PhD, ANU).

---

## 2. The wordmark and the W monogram

### Wordmark (splash hero, footer)
Custom set in **DM Serif Display**, diagonal cut, refraction offset at rest (top half +4 right, bottom half -4 left, plus an additional ±2 visual exaggeration on hover). On hover:
1. Rainbow zipper sweeps left to right via stroke-dashoffset
2. Bright spark rides the leading edge of the zipper
3. Top and bot halves slide together IN SYNC with the zipper's progress
4. At 78-95% an unclipped solid "WildWooHoo" fades in, erasing the cut
5. Clipped halves fade out at 85-100%
6. End-state while hovering: one solid clean word. No rainbow. No glow.

### W monogram (header, favicon)
Mirror W globe. Faint 3D sphere (radial gradient, meridian, equator) behind two W's: one upright, one reflected. White + rainbow line at the reflection plane. On hover:
1. White sunlight + rainbow line flash in (0-15%)
2. Reflected bottom W flips up and merges with the top W (15-38%)
3. Globe meridian spins 720° clockwise; equator spins -720° counter (15-100%)
4. Beams fade out (60-85%)
5. **Rainbow finale (78-100%)**: cream W + globe lines fade to rainbow - the entire mark ends as a glowing rainbow inside a rainbow globe

The W carries a constant 0.6/0.8 drop-shadow at all times so it has 3D depth vested around the globe.

### The rule
**Never use them together.** Header = monogram only. Splash + footer = wordmark only.

---

## 3. The photographic spectrum (the rainbow inside the cut)

Sampled pixel-by-pixel from the two reference photos: the rainbow-kangaroo at sunset and the kangaroo mob in the green savanna. Every band belongs inside those images.

| Token | Hex | Sampled from |
|---|---|---|
| `--spectrum-red` | `#C97A66` | Rainbow band, dusty terracotta |
| `--spectrum-orange` | `#D89E78` | Horizon glow, warm peach |
| `--spectrum-gold` | `#D2B07A` | Lit grass tips, pale gold |
| `--spectrum-green` | `#7D8B5D` | Bush sage (photo 2) |
| `--spectrum-blue` | `#9985A8` | Upper sky, dusk lavender |
| `--spectrum-violet` | `#7D6E92` | Deepest sky, twilight |

The spectrum **only ever** appears inside the diagonal cut (wordmark) or in the rainbow finale of the monogram. Never as a static decoration.

---

## 4. Brand palette - sampled from the two photos

### Surface (paper)
| Token | Hex | Role |
|---|---|---|
| `--brand-cream` | `#FBF7EE` | Primary surface |
| `--brand-paper` | `#FFFFFF` | Cleanest paper |
| `--brand-sand` | `#F4ECDD` | Soft secondary |
| `--brand-wheat` | `#E8DCC0` | Warm secondary, golden hour grass |

### Ink (the dark, the night savanna)
| Token | Hex | Role |
|---|---|---|
| `--brand-ink` | `#0E0E0F` | Primary text + ground |
| `--brand-night` | `#1A1A12` | Slightly green-black for night |
| `--brand-forest-ink` | `#2C3A1D` | Forest-dark, the deepest bush at night |
| `--brand-stone` | `#807872` | Secondary text |

### Earth + golden hour (warm side, the kangaroos + grass)
| Token | Hex | Role |
|---|---|---|
| `--brand-signal` / `--brand-gold` | `#C97A40` | **PRIMARY SIGNAL.** Nav active, link hover, italic emphasis, all warm accents. |
| `--brand-gold-deep` | `#8E5320` | Burnt Sienna - hover, dense emphasis |
| `--brand-wheat-gold` | `#B59B6D` | Pale grass |
| `--brand-tan` | `#A48970` | Kangaroo fur |
| `--brand-earth` | `#6E5C3F` | Mid earth |
| `--brand-deep-earth` | `#4A3A24` | Deep earth shadow |

### Sage + dusk (cool side, the bush + sky)
| Token | Hex | Role |
|---|---|---|
| `--brand-sage` | `#7D8B5D` | Bush in light |
| `--brand-bush` | `#4A5E33` | Mid-green bush |
| `--brand-forest` | `#3D4F2C` | Deep bush |
| `--brand-haze` | `#BBA5B0` | Rose-haze sky |
| `--brand-dusk` | `#9985A8` | Lavender sky |
| `--brand-twilight` | `#7D6E92` | Deepest twilight |

**Brand color = the hex passing through the light of the photos.** Solid colours rarely sit alone in sections - they appear with golden-hour rim, rose haze, or sage shimmer overlays so the page reads as nature-with-light, not flat colour blocks.

Coral `#FB6E5A` is **retired**. Do not use anywhere.

---

## 5. Typography

| Token | Family | Use |
|---|---|---|
| `--font-display` | DM Serif Display | The wordmark + the W monogram |
| `--font-serif` | Libre Baskerville (400, 700) | Section headlines |
| `--font-italic` | Instrument Serif Italic | One emphasised word inside a headline |
| `--font-sans` | Montserrat (400, 500, 700) | Body, navigation, UI, labels |

Headlines never end with a full stop. Em-dashes (—) are replaced with hyphens (-) throughout.

---

## 6. Navigation

Header: **Projects · Impact · Music & Video · Educational · Open Calls · Portal**.

Folder `/network/` was renamed to `/open-calls/` in this iteration. All internal links use `/open-calls/`.

---

## 7. CTAs

- "**Work with us**" — header CTA (the studio invites partnership)
- "**Express interest in collaboration**" — replaces "Pitch a project" (we're the home of projects; collaborators express interest)
- "**Apply to the pool**" — open-calls apply form (paid or time-for-print)
- "**Apply to join**" — alternate header CTA on Open Calls + Portal

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

## 10. Social pack

`brand/social/`:
- `profile-monogram-1024.png` — 1024×1024 mirror-W globe favicon at high resolution (IG / TikTok / YouTube / LinkedIn profile)
- `profile-wordmark-1024.png` — square wordmark profile
- `youtube-banner-2560x1440.png` — YouTube channel art
- `linkedin-personal-1584x396.png` — LinkedIn personal cover
- `linkedin-company-1128x191.png` — LinkedIn company cover
- `social-square-1080x1080.png` — universal social square
- `ig-story-1080x1920.png` — IG story format
- `wordmark-burst-720.gif` — 2.5s animated burst loop (email signatures, decks)
- `wordmark-burst-1080.mp4` — 1080p MP4 burst (LinkedIn Cover Story, IG Reel cover)
- `og-image-1200x630.png` — social share card
- `og-square-512.png` — social square card

All regenerated with the photographic spectrum (terracotta → twilight).

---

*Last updated: 2026-05-18. Owner: Dr WELI.*
