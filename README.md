# wildwoohoo.com

The studio site. Plain HTML, one shared design system, built by Eleventy and
published to GitHub Pages by GitHub Actions on every push to `main`.

## How the build works

The site is migrating one page at a time. Two kinds of page live side by side:

| Kind | Source | What the build does |
|---|---|---|
| **Static** | `some-page/index.html`, plus every image, script and stylesheet | Copies it to `_site/` byte for byte, at the same path |
| **Migrated** | `some-page/index.njk` | Renders it through the shared layout to the same URL |

After every build, `scripts/verify-build.mjs` checks that every static file
arrived unchanged, every URL in `sitemap.xml` still resolves, and every built
page has the GA4 tag, no broken internal links, and no em-dashes or curly
quotes. **If the check fails, nothing deploys** and the live site keeps its last
good version.

Files that are build machinery and never published: `package*.json`,
`eleventy.config.mjs`, `scripts/`, `_includes/`, `_data/`, `.github/`, this
README, and every `.njk` file. The list lives in `scripts/static-files.mjs`.

## The shared system

| File | What it holds |
|---|---|
| `_includes/css/tokens.css` | **The one tokens file.** Palette v4, type, spacing, radius. Change a value here and every migrated page follows |
| `_includes/css/system.css` | The components: header, hero, proof strip, section head, rows, steps, FAQ, form, footer |
| `_includes/layouts/base.njk` | The page shell: head, header, footer |
| `_includes/partials/` | `head.njk` (meta, fonts, GA4 `G-49XFV97ZRF`), `header.njk` (the nav), `footer.njk` |
| `_data/site.json` | The nav items, the header call to action, the site URL, the GA4 id |
| `assets/js/wwh-system.js` | Mobile nav, the masthead starfield, video facades, form enhancement |

The stylesheet is published at `/assets/css/wwh-system.css`. Its `?v=` is a hash of
its content, set by the `bust` filter, so migrated pages never need a manual
cache-bust. **Un-migrated pages still need their `?v=` bumped by hand** when a
file they load changes.

## Images

Write a plain `<img src="/assets/img/photo.jpg" alt="..." sizes="...">` in a
`.njk` page. The build turns it into a `<picture>` with WebP and JPEG (or PNG)
at three widths, sets `width` and `height`, and strips EXIF and GPS. Outputs go
to `/assets/img/r/`. Override the widths for one image with
`eleventy:widths="360,720,1080"`. Do not set `width` on the source `<img>`:
the build reads it as "make only this one size". Images on static pages are
untouched.

## Migrating a page

1. `git mv some-page/index.html some-page/index.njk`.
2. Replace the head, header and footer with front matter and the layout:
   `layout: layouts/base.njk`, plus `title`, `description` and the page's
   social and structured-data values, copied exactly.
3. Rebuild the body from the components in `system.css`. **Keep the copy word
   for word**; a migration changes the look, not the words.
4. `npm run build`, then check the page at 1440 and 375 px, with a clean
   console and AA contrast.

## Local preview

```
npm ci
npm run dev        # http://localhost:4173, live reload
npm run build      # the full build plus the parity check, as CI runs it
```
