/* ==========================================================================
   WildWooHoo - Brand Effects (glow direction — May 2026)
   The header monogram and hero wordmark used to be built inline as the
   old "rainbow rim" design with hover animation. We now load the static
   glow SVGs from brand-kit/logos/ directly so the site renders the same
   mark used in the favicon, app icon, and social profile pictures.
   The static SVGs already carry the soft halo bloom (white core through
   amber, coral, lavender, green); CSS still adds the splash-hero halo
   drop-shadow and the click-burst animation on the wordmark.
   ========================================================================== */
(function () {
  'use strict';

  var MONOGRAM_SRC = '/brand-kit/logos/monogram-glow.png';
  // WORDMARK_SRC const removed 2026-06-05 - was declared but never used.
  // The wordmark is built INLINE by buildWordmark() below, not loaded from
  // the wordmark-glow.svg file.

  var ns = 'http://www.w3.org/2000/svg';
  var idSeq = 0;

  /* Parse an SVG string into a live SVG element. Uses DOMParser instead of
     `svg.innerHTML = ...` because Safari (especially older iOS) treats
     innerHTML on SVGElement inconsistently for namespaced children — rects
     and gradients get parsed as unknown HTML elements and never render.
     DOMParser + importNode is the cross-browser reliable path. */
  function svgFromTemplate(viewBox, className, ariaLabel, innerSvg) {
    var src = '<svg xmlns="http://www.w3.org/2000/svg" ' +
      'viewBox="' + viewBox + '" ' +
      'class="' + className + '" ' +
      'role="img" ' +
      'aria-label="' + ariaLabel + '">' + innerSvg + '</svg>';
    var doc = new DOMParser().parseFromString(src, 'image/svg+xml');
    if (doc.querySelector('parsererror')) {
      throw new Error('SVG parse error: ' + (doc.querySelector('parsererror').textContent || 'unknown'));
    }
    return document.importNode(doc.documentElement, true);
  }

  // -------- Wordmark: built inline so the rainbow shine layer can be
  // animated by CSS on hover. Rest state is clean cream outline with a
  // subtle vertical chrome gradient — premium without competing with
  // the showreel imagery behind. Hover triggers a glow halo (CSS) plus
  // the diagonal rainbow shine sweep (animation on the shine rect).
  // ------------------------------------------------------------------------

  function buildWordmark() {
    var n = ++idSeq;
    var sh = 'wm-sh-' + n;
    var mk = 'wm-mk-' + n;
    var mkS = 'wm-mks-' + n;  // shine clip mask (2026-06-05)
    // Letter geometry — same coords in the mask and the outer group.
    var letters =
      '<path d="M 23 55 L 60.5 120 L 103 65 L 145.5 120 L 183 55" %WC%/>' +
      '<line x1="212" y1="70" x2="212" y2="120" %LC%/>' +
      '<line x1="230" y1="55" x2="230" y2="120" %LC%/>' +
      '<line x1="273" y1="55" x2="273" y2="120" %LC%/>' +
      '<path d="M 273 70 A 25 25 0 0 0 273 120" %LC%/>' +
      '<path d="M 299.5 55 L 337 120 L 379.5 65 L 422 120 L 459.5 55" %WC%/>' +
      '<circle cx="504" cy="95" r="18" %LC%/>' +
      '<circle cx="558" cy="95" r="18" %LC%/>' +
      '<line x1="608" y1="55" x2="608" y2="120" %WC%/>' +
      '<line x1="758" y1="55" x2="758" y2="120" %WC%/>' +
      '<line x1="608" y1="87" x2="758" y2="87" %WC%/>' +
      '<circle cx="808" cy="95" r="18" %LC%/>' +
      '<circle cx="862" cy="95" r="18" %LC%/>';
    var innerStrokes = letters
      .replace(/%WC%/g, 'stroke-width="15"')
      .replace(/%LC%/g, 'stroke-width="7"');
    var outerStrokes = letters
      .replace(/%WC%/g, 'stroke-width="22"')
      .replace(/%LC%/g, 'stroke-width="14"');
    // WELI 2026-06-08: instead of cutting NOTCHES in the outer edge of the
    // leftmost W and rightmost o (which removed material), add small solid
    // cream "tabs" that extend INWARD from the outer edge. The shape
    // mirrors the chip's edge slot but as a positive form: a small
    // horizontal cream bar attached to the outer edge of the letter,
    // pointing inward. Two per side (upper + lower) for visual rhythm.
    // Rendered after the outline ring so they sit ON TOP and read as
    // part of the same brand-mark language as the chip.
    var edgeTabs =
      '<g fill="#FBF7EE">' +
        // Left W: upper tab attached to outer-left of first descending stroke
        '<rect x="23" y="72" width="18" height="5"/>' +
        // Left W: lower tab (further in as the diagonal stroke descends right)
        '<rect x="42" y="103" width="18" height="5"/>' +
        // Right o: upper tab attached to outer-right of right arc
        '<rect x="864" y="80" width="18" height="5"/>' +
        // Right o: lower tab attached to outer-right of right arc
        '<rect x="864" y="110" width="18" height="5"/>' +
      '</g>';

    var html =
      '<defs>' +
        // Rainbow shine band — the brand spectrum with rich darks at the
        // edges, swept diagonally across on hover via CSS.
        '<linearGradient id="' + sh + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%"   stop-color="#1F1620" stop-opacity="0"/>' +
          '<stop offset="14%"  stop-color="#7A4030" stop-opacity=".45"/>' +
          '<stop offset="28%"  stop-color="#C97A66" stop-opacity=".58"/>' +
          '<stop offset="42%"  stop-color="#E5B96D" stop-opacity=".65"/>' +
          '<stop offset="50%"  stop-color="#FFFFFF" stop-opacity=".82"/>' +
          '<stop offset="58%"  stop-color="#27A05B" stop-opacity=".62"/>' +
          '<stop offset="72%"  stop-color="#B07F30" stop-opacity=".55"/>' +
          '<stop offset="86%"  stop-color="#9985A8" stop-opacity=".45"/>' +
          '<stop offset="100%" stop-color="#1A1825" stop-opacity="0"/>' +
        '</linearGradient>' +
        // Mask 1: outer stroke painted, inner stroke cut out -> outline ring.
        '<mask id="' + mk + '" maskUnits="userSpaceOnUse">' +
          '<rect width="900" height="160" fill="white"/>' +
          '<g fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round">' +
            innerStrokes +
          '</g>' +
        '</mask>' +
        // Mask 2: shine clip — only render where the WORDMARK OUTLINE RING is.
        // black bg (hidden) + white outer strokes (visible) + black inner
        // strokes (re-hidden) = exact outline-ring shape. WELI 2026-06-05:
        // 'fix the rainbow effect - it moves as a rectangle and ends like
        // a rectangle. We want it done to the wordart shapes.'
        '<mask id="' + mkS + '" maskUnits="userSpaceOnUse">' +
          '<rect width="900" height="160" fill="black"/>' +
          '<g fill="none" stroke="white" stroke-linecap="round" stroke-linejoin="round">' +
            outerStrokes +
          '</g>' +
          '<g fill="none" stroke="black" stroke-linecap="round" stroke-linejoin="round">' +
            innerStrokes +
          '</g>' +
        '</mask>' +
      '</defs>' +
      // Outline ring filled with solid cream so every letter renders
      // identically — Safari sometimes drops gradient strokes on <line>
      // elements which left the H invisible in screenshots.
      '<g fill="none" stroke="#FBF7EE" stroke-linecap="round" stroke-linejoin="round" mask="url(#' + mk + ')">' +
        outerStrokes +
      '</g>' +
      // Edge tabs: solid cream bars on the outer edges of leftmost W +
      // rightmost o that mirror the chip's slot cuts as a positive form.
      edgeTabs +
      // i dot — single filled element, solid cream too.
      '<circle cx="212" cy="58" r="5" fill="#FBF7EE"/>' +
      // Rainbow shine band: sits off-screen at rest, sweeps left→right on
      // hover via CSS. Now mask-clipped to the wordmark outline ring, so the
      // sweep follows the letters' shape and naturally vanishes as it
      // leaves the letters (no visible rectangle boundary).
      '<g class="wwh-wm-shine" mask="url(#' + mkS + ')">' +
        '<rect x="-100" y="-10" width="160" height="180" fill="url(#' + sh + ')" transform="rotate(12 -40 80)"/>' +
      '</g>';
    return svgFromTemplate('0 0 900 160', 'wwh-wordmark', 'WildWooHoo', html);
  }

  // -------- Monogram: inline SVG so the hover animation can target the
  // individual child layers. Rest state matches brand-kit/logos/monogram-
  // glow.svg (black tile + single cream W + soft halo bloom). On hover
  // the layered animation kicks in: a brief mirror-W ghost, a rainbow
  // rim glow at the perimeter, the cream horizon switching to spectrum,
  // a single white shine sweeping across.
  // ------------------------------------------------------------------------

  // Returns an <img> pointing at the high-res raster master. The mark is
  // now a Gemini-generated 1720×1720 PNG with the debossed/embossed 3D
  // treatment and chromatic aberration baked in — SVG drawing can't
  // match that fidelity, so we ship the raster directly. CSS handles
  // any hover-state effects (filter glow, transform, etc.) on the img.
  function buildMonogram() {
    var img = document.createElement('img');
    img.src = MONOGRAM_SRC;
    img.className = 'wwh-mono';
    img.alt = 'WildWooHoo';
    img.setAttribute('role', 'img');
    img.setAttribute('draggable', 'false');
    return img;
  }

  // -------- Splash hero hookup ---------------------------------------------
  // The static <img class="wwh-wordmark-fallback"> was removed from index.html
  // on 2026-06-05 per WELI (old artwork structure cleanup). The wordmark is
  // now ONLY built by buildWordmark() below.

  function upgradeSplashLogo(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    /* WELI 2026-06-06: home page uses a Caveat lowercase TEXT wordmark
       with a yellow-marker highlight instead of the SVG outline build.
       Mark the host with data-wordmark-mode="text" to skip the SVG. */
    if (host.dataset.wordmarkMode === 'text') {
      host.dataset.wwhUpgraded = '1';
      return;
    }

    var nameSpan = host.querySelector('.name');
    var altText = nameSpan ? nameSpan.textContent.trim() : 'WildWooHoo';
    if (altText.replace(/\s+/g, '').toLowerCase() !== 'wildwoohoo') return;

    try {
      var wm = buildWordmark();
      host.setAttribute('role', 'button');
      host.setAttribute('tabindex', '0');
      host.setAttribute('aria-label', 'WildWooHoo - hover or click for prism light effect');
      host.innerHTML = '';
      host.appendChild(wm);
      host.dataset.wwhUpgraded = '1';
    } catch (err) {
      if (window && window.console) console.error('[wwh] splash wordmark build failed:', err);
      return;
    }

    function burst() {
      host.classList.remove('is-burst');
      void host.offsetWidth;
      host.classList.add('is-burst');
      window.setTimeout(function () { host.classList.remove('is-burst'); }, 1400);
    }

    /* WELI 2026-06-06: 'logo moving in big, you click on it, there is music
       and the wordart comes magically from the logo.' Path A (minimal
       version): clicking the wordmark also triggers the music button if
       it hasn't been played yet. The wordmark already animates in via
       wwh-wordmark-intro 3s on page load - the click just adds the music
       layer so the moment is 'press play -> identity sings'. */
    function startMusicIfIdle() {
      if (window.__wwhUniverseAudio) return; /* already playing or paused */
      var musicBtn = document.querySelector('.wwh-universe-music-btn');
      if (musicBtn) {
        musicBtn.click();
        host.classList.add('is-music-triggered');
      }
    }

    function activate() {
      burst();
      startMusicIfIdle();
    }

    host.addEventListener('click', activate);
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); activate(); }
    });
  }

  // -------- Header brand hookup --------------------------------------------
  // The HTML now ships with a static <img class="wwh-mono-fallback"> inside
  // each .wwh-awal-brand so the glow monogram always renders, even if this
  // script never executes. When it does execute and the inline SVG builds
  // successfully, we remove the fallback so the rainbow-rim hover animation
  // can run. Any error during build leaves the static fallback in place.

  function upgradeHeaderBrand(host) {
    // DISABLED 2026-06-05: this function was removing the static
    // .wwh-mono-fallback <img src="/apple-touch-icon.png"> (now the
    // GRAY chip) and replacing it with buildMonogram() which uses
    // MONOGRAM_SRC = '/brand-kit/logos/monogram-glow.png' (the OLD
    // cream-pebble). That's the 'white logo with green in the
    // background' WELI kept seeing on click. Leave the static gray
    // IMG in place; do nothing.
    return;
  }

  // -------- Footer brand hookup --------------------------------------------
  // Replaces the "WildWooHoo" text in `.wwh-footer-brand` anchors with the
  // outlined SVG wordmark, so the brand appears as its proper drawn form
  // everywhere - not as a font fallback.

  function upgradeFooterBrand(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    try {
      var wm = buildWordmark();
      host.setAttribute('aria-label', 'WildWooHoo');
      host.innerHTML = '';
      host.appendChild(wm);
      host.dataset.wwhUpgraded = '1';
    } catch (err) {
      if (window && window.console) console.error('[wwh] footer wordmark build failed:', err);
    }
  }

  // -------- Init -----------------------------------------------------------

  /* WELI 2026-06-06: 'evolved-for' reveal section — outlined SVG wordmark
     with the rainbow shine sweeping ambient-infinite. Each host element
     gets buildWordmark() rendered into it. CSS handles the always-on
     animation via .wwh-evolved-wordmark-host .wwh-wm-shine animation. */
  function upgradeEvolvedWordmark(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    try {
      var wm = buildWordmark();
      host.innerHTML = '';
      host.appendChild(wm);
      host.dataset.wwhUpgraded = '1';
    } catch (err) {
      if (window && window.console) console.error('[wwh] evolved wordmark build failed:', err);
    }
  }

  function init() {
    Array.prototype.forEach.call(
      document.querySelectorAll('.wwh-splash-logo'),
      upgradeSplashLogo
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('.wwh-awal-brand'),
      upgradeHeaderBrand
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('.wwh-footer-brand'),
      upgradeFooterBrand
    );
    Array.prototype.forEach.call(
      document.querySelectorAll('.wwh-evolved-wordmark-host'),
      upgradeEvolvedWordmark
    );
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
