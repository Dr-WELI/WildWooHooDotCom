# WildWooHoo — Google Search & Domain Setup

This is the *Google-readable* side of the brand kit. It covers everything that makes the site show up correctly in **Google Search**, **Google Knowledge Panel**, **link previews** (when someone shares wildwoohoo.com on WhatsApp, Slack, X, LinkedIn, Facebook, etc.), and **iOS / Android home-screen icons** — all with the new rainbow-rim logo.

**The two domains:** `wildwoohoo.com` (the studio) and `drweli.com` (the founder). Both should be verified and submitted to Google. The kit below applies to both; drweli.com needs its own copy of the verification + structured data because Search Console treats each domain as a separate property.

---

## 1. What's already wired up on `wildwoohoo.com`

You don't have to do anything to make these work — they're already in `index.html` and the live site as of this commit:

### Favicon & app icon (browser tabs, iOS home screen, Android shortcuts)
```
/favicon.svg                  ← rainbow-rim, vector, modern browsers
/favicon-16.png               ← 16×16 raster fallback
/favicon-32.png               ← 32×32 raster fallback
/apple-touch-icon.png         ← 180×180, iOS home-screen + Google logo source
```

### Link-preview image (Open Graph / Twitter Card)
When anyone shares a wildwoohoo.com link on social, in a chat, or via email, Facebook / WhatsApp / LinkedIn / Slack / Twitter pull this image:
```html
<meta property="og:image"    content="https://wildwoohoo.com/apple-touch-icon.png">
<meta name="twitter:image"   content="https://wildwoohoo.com/apple-touch-icon.png">
```
Both point at `apple-touch-icon.png`, which is now the rainbow-rim mark. **You don't need to do anything** — next time someone shares the site, the new logo will show. (Note: Facebook + LinkedIn cache aggressively; see §3 for force-refresh.)

### Structured data (Knowledge Panel, brand recognition in Google Search)
The JSON-LD block in `index.html`:
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "WildWooHoo",
  "url": "https://wildwoohoo.com",
  "logo": "https://wildwoohoo.com/apple-touch-icon.png",
  "image": "https://wildwoohoo.com/apple-touch-icon.png",
  "founder": { "@type": "Person", "name": "Dr WELI", "url": "https://drweli.com" },
  …
}
```
Google reads this and uses it to build the **Knowledge Panel** (the brand info card that appears on the right when someone searches "WildWooHoo"). The `logo` field is already pointing at the rainbow-rim mark.

---

## 2. What you need to do once on Google

### Step 1 — Google Search Console (the registration)
1. Go to **[search.google.com/search-console](https://search.google.com/search-console)**.
2. Click **Add property**. Choose **URL prefix**: enter `https://wildwoohoo.com`.
3. Verify ownership. Easiest method: **HTML tag**.
   - Google gives you a meta tag like `<meta name="google-site-verification" content="ABC123…" />`.
   - Paste it into the `<head>` of `index.html` (anywhere before `</head>`).
   - Push. GitHub Pages serves it within ~1 minute.
   - Back in Search Console, click **Verify**. Done.
4. Repeat for `https://drweli.com` (same flow, separate property).

### Step 2 — Submit your sitemap
Search Console will then ask for a sitemap so it can crawl every page.
- For wildwoohoo.com, submit `https://wildwoohoo.com/sitemap.xml` (already exists in the repo).
- For drweli.com, submit `https://drweli.com/sitemap.xml` if it has one (or create one from the pages list).

### Step 3 — Request re-indexing of the homepage
- In Search Console → **URL Inspection** → paste `https://wildwoohoo.com/` → click **Request Indexing**.
- This tells Google "I updated the logo — please re-crawl." Within hours to a day, the Knowledge Panel and link previews start showing the rainbow-rim mark.

### Step 4 — Validate the structured data
- Open **[search.google.com/test/rich-results](https://search.google.com/test/rich-results)**, paste `https://wildwoohoo.com/`, click **Test URL**.
- Expected: ✅ Organization detected, ✅ Logo URL valid (the rainbow-rim mark).
- Also: **[validator.schema.org](https://validator.schema.org/)** for cross-validation.

### Step 5 — Force-refresh the social caches
Facebook and LinkedIn aggressively cache OG images. After the rainbow-rim logo is live, scrape once via:
- Facebook: **[developers.facebook.com/tools/debug](https://developers.facebook.com/tools/debug/)** → paste the URL → **Scrape Again**.
- LinkedIn: **[linkedin.com/post-inspector](https://www.linkedin.com/post-inspector/)** → paste the URL → **Inspect**.
- Twitter / X auto-updates on next share, usually no action needed.

---

## 3. For drweli.com (the founder's site)

Same setup pattern. drweli.com isn't in this repo — when you edit that site:

1. **Verify in Search Console** (Step 1 above), separate property.
2. **Add WildWooHoo's logo as a `sameAs` Organization link** in drweli.com's structured data. Sample JSON-LD for Dr WELI's Person schema:
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Person",
     "name": "Dr Weliton Menário Costa",
     "alternateName": "Dr WELI",
     "url": "https://drweli.com",
     "image": "https://drweli.com/path-to-photo.jpg",
     "jobTitle": "Behavioural ecologist, musician, founder",
     "affiliation": {
       "@type": "Organization",
       "name": "WildWooHoo",
       "url": "https://wildwoohoo.com",
       "logo": "https://wildwoohoo.com/apple-touch-icon.png"
     },
     "sameAs": [
       "https://wildwoohoo.com",
       "https://www.instagram.com/welimusic/",
       "https://www.youtube.com/@welimusician",
       "https://open.spotify.com/intl-pt/artist/50lLmw55L8IEvin7efZ063"
     ]
   }
   ```
3. **Use the same OG image source pattern.** drweli.com should have its own `apple-touch-icon.png` (could be a portrait, could be a Dr WELI wordmark, could be the WildWooHoo logo if Dr WELI's site is studio-branded). Point `og:image` and the JSON-LD `image` field at that file.

---

## 4. Quick reference — what file shows where in Google

| Where in Google | What it shows | File |
|---|---|---|
| Browser tab (Chrome, Safari, Firefox, Edge) | The favicon | `/favicon.svg` (vector) + `/favicon-32.png`, `/favicon-16.png` fallbacks |
| Google Search result favicon (next to the title) | Same as browser tab | `/favicon.svg` |
| Google Knowledge Panel (brand card) — the round logo | Square version | `/apple-touch-icon.png` (referenced in JSON-LD `logo`) |
| Search-result rich snippet image (when present) | Square or rectangle | `/apple-touch-icon.png` (referenced in JSON-LD `image`) |
| Social link previews (WhatsApp, Slack, Discord, FB, X, LinkedIn) | Rectangle, 1200×630 | `og:image` meta — currently `/apple-touch-icon.png`; could point at `/brand/og-image-1200x630.png` for richer composition |
| Twitter/X large card | Rectangle, 1200×630 | `twitter:image` meta — same |
| Apple home-screen icon (iOS Safari add-to-home) | 180×180 with iOS mask applied | `/apple-touch-icon.png` |
| Android add-to-home / PWA | Various sizes | `/favicon-32.png`, `/favicon-16.png`, plus the SVG |

---

## 5. Rich-snippet bonus — `og:image` upgrade

For richer link previews than just the icon, point the `og:image` and `twitter:image` to the **composed** 1200×630 card we generated:

```html
<meta property="og:image"  content="https://wildwoohoo.com/brand/og-image-1200x630.png">
<meta property="og:image:width"  content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:image" content="https://wildwoohoo.com/brand/og-image-1200x630.png">
```

The composed card (in `/brand-kit/og/og-rect-1200x630.png`, also copied to `/brand/og-image-1200x630.png`) shows the rainbow-rim mark + "WildWooHoo" wordmark + tagline. It's a stronger link preview than a bare icon.

If you want me to swap the meta tags to point at this richer image, say the word and I'll update `index.html`.

---

*Last updated: 2026-05-21 — alongside the rainbow-rim primary swap.*
