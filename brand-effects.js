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

  var MONOGRAM_SRC = '/brand-kit/logos/monogram-glow.svg';
  var WORDMARK_SRC = '/brand-kit/logos/wordmark-glow.svg';

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
        // Mask: outer stroke painted, inner stroke cut out -> outline ring.
        '<mask id="' + mk + '" maskUnits="userSpaceOnUse">' +
          '<rect width="900" height="160" fill="white"/>' +
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
      // i dot — single filled element, solid cream too.
      '<circle cx="212" cy="58" r="5" fill="#FBF7EE"/>' +
      // Rainbow shine band: sits off-screen at rest, sweeps left→right on
      // hover via CSS. The .wwh-wm-shine class is the hook.
      '<g class="wwh-wm-shine">' +
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

  function buildMonogram() {
    var n = ++idSeq;
    var tf = 'mn-tilefill-' + n;
    var sp = 'mn-spec-' + n;
    var sh = 'mn-shadow-' + n;
    var rm = 'mn-rim-' + n;
    var hr = 'mn-horizon-' + n;
    var sn = 'mn-shine-' + n;
    var cl = 'mn-tile-' + n;
    // Tile with PRONOUNCED horizon cuts on left + right sides — the "horizon
     // notches" mark the seam where two worlds meet, brand-signature.
    var tile = 'M 24 4 H 76 C 92 4, 96 8, 96 24 V 40 C 96 42, 93 44, 88 46 L 86 50 L 88 54 C 93 56, 96 58, 96 60 V 76 C 96 92, 92 96, 76 96 H 24 C 8 96, 4 92, 4 76 V 60 C 4 58, 7 56, 12 54 L 14 50 L 12 46 C 7 44, 4 42, 4 40 V 24 C 4 8, 8 4, 24 4 Z';
    // Glyph geometry shared by main + chromatic ghost layers.
    var glyphStrokes =
      '<path d="M 25 20 L 37 42 L 50 20 L 63 42 L 75 20" stroke-width="7" fill="none"/>' +
      '<line x1="37" y1="42" x2="37" y2="76" stroke-width="5"/>' +
      '<line x1="63" y1="42" x2="63" y2="76" stroke-width="5"/>' +
      '<line x1="37" y1="51" x2="63" y2="51" stroke-width="5"/>' +
      '<circle cx="63" cy="82" r="5" stroke-width="3.5" fill="none"/>';
    var glyphFills =
      '<path d="M 50 28 L 45 36 L 55 36 Z" stroke="none"/>' +
      '<circle cx="37" cy="82" r="5" stroke="none"/>';
    var html =
      '<defs>' +
        // Cream tile fill with subtle radial cream gradient.
        '<radialGradient id="' + tf + '" cx="50%" cy="50%" r="70%">' +
          '<stop offset="0%"   stop-color="#FFFFFF"/>' +
          '<stop offset="60%"  stop-color="#FBF7EE"/>' +
          '<stop offset="100%" stop-color="#F2EAD8"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + sp + '" cx="32%" cy="22%" r="55%">' +
          '<stop offset="0%"  stop-color="#FFFFFF" stop-opacity=".85"/>' +
          '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + sh + '" cx="78%" cy="82%" r="55%">' +
          '<stop offset="0%"  stop-color="#000000" stop-opacity=".07"/>' +
          '<stop offset="60%" stop-color="#000000" stop-opacity="0"/>' +
        '</radialGradient>' +
        // Rainbow rim: hidden at rest, fades in on hover.
        '<radialGradient id="' + rm + '" cx="50%" cy="50%" r="62%">' +
          '<stop offset="0%"   stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="58%"  stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="74%"  stop-color="#C97A66" stop-opacity=".42"/>' +
          '<stop offset="88%"  stop-color="#9985A8" stop-opacity=".50"/>' +
          '<stop offset="100%" stop-color="#7D6E92" stop-opacity=".48"/>' +
        '</radialGradient>' +
        '<linearGradient id="' + hr + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%"   stop-color="#C97A66"/>' +
          '<stop offset="22%"  stop-color="#D89E78"/>' +
          '<stop offset="40%"  stop-color="#E5B96D"/>' +
          '<stop offset="50%"  stop-color="#27A05B"/>' +
          '<stop offset="60%"  stop-color="#B07F30"/>' +
          '<stop offset="78%"  stop-color="#B59B6D"/>' +
          '<stop offset="100%" stop-color="#7D6E92"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + sn + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%"  stop-color="#FFFFFF" stop-opacity="0"/>' +
          '<stop offset="45%" stop-color="#FFFFFF" stop-opacity=".55"/>' +
          '<stop offset="55%" stop-color="#FFFFFF" stop-opacity=".55"/>' +
          '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<clipPath id="' + cl + '"><path d="' + tile + '"/></clipPath>' +
      '</defs>' +
      '<g clip-path="url(#' + cl + ')">' +
        '<rect width="100" height="100" fill="url(#' + tf + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sp + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sh + ')"/>' +
        // Chromatic aberration ghost layers — coral / cyan / lavender
        // copies of the glyph offset by ~1.5px so the dark central form
        // reads with a quiet rainbow shimmer at the edges.
        '<g stroke="#E0584A" fill="#E0584A" stroke-linecap="round" stroke-linejoin="round" ' +
           'opacity=".55" transform="translate(-2.2, 0)" style="mix-blend-mode:multiply">' +
          glyphStrokes + glyphFills +
        '</g>' +
        '<g stroke="#3AAEC6" fill="#3AAEC6" stroke-linecap="round" stroke-linejoin="round" ' +
           'opacity=".55" transform="translate(2.2, 0.6)" style="mix-blend-mode:multiply">' +
          glyphStrokes + glyphFills +
        '</g>' +
        '<g stroke="#9985A8" fill="#9985A8" stroke-linecap="round" stroke-linejoin="round" ' +
           'opacity=".50" transform="translate(0, -1.4)" style="mix-blend-mode:multiply">' +
          glyphStrokes + glyphFills +
        '</g>' +
        // Rainbow rim: hidden at rest, fades in on hover.
        '<rect class="wwh-mono-rim" width="100" height="100" fill="url(#' + rm + ')"/>' +
        // ===== Main W+H+oo glyph (a face) =====
        // W = crown / brow (with a small triangular jewel inside). H =
        // body / verticals from the W's valleys, crossbar at the horizon.
        // oo = eyes / music notes: LEFT filled (closed note head), RIGHT
        // outlined (open note head).
        '<g class="wwh-mono-final" stroke="#0E0E0F" fill="#0E0E0F" ' +
           'stroke-linecap="round" stroke-linejoin="round">' +
          glyphStrokes + glyphFills +
        '</g>' +
        // Mirror W layer kept for hover ghost-flash animation.
        '<g class="wwh-mono-top">' +
          '<path d="M 25 12 L 37 32 L 50 12 L 63 32 L 75 12" ' +
            'stroke="#0E0E0F" stroke-width="7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<g class="wwh-mono-bot">' +
          '<circle cx="37" cy="92" r="4" stroke="#0E0E0F" stroke-width="3" fill="none"/>' +
          '<circle cx="63" cy="92" r="4" stroke="#0E0E0F" stroke-width="3" fill="none"/>' +
        '</g>' +
        // Horizon hairline along the cut line (subtle ink, switches to
        // spectrum on hover).
        '<line class="wwh-mono-horizon-cream" x1="14" y1="50" x2="86" y2="50" stroke="#0E0E0F" stroke-width="0.6" stroke-opacity=".0"/>' +
        '<line class="wwh-mono-horizon-rain"  x1="14" y1="50" x2="86" y2="50" stroke="url(#' + hr + ')" stroke-width="1.4"/>' +
        // White diagonal shine sweep on hover.
        '<rect class="wwh-mono-shine" x="-30" y="-10" width="40" height="120" fill="url(#' + sn + ')" transform="rotate(15 20 50)"/>' +
      '</g>' +
      '<path d="' + tile + '" fill="none" stroke="rgba(14,14,15,.10)" stroke-width=".5"/>';
    return svgFromTemplate('0 0 100 100', 'wwh-mono', 'WildWooHoo', html);
  }

  // -------- Splash hero hookup ---------------------------------------------
  // HTML ships with a static <img class="wwh-wordmark-fallback"> as a
  // guaranteed-render fallback. We only clear that AFTER buildWordmark()
  // returns successfully, so any thrown error leaves the static glow
  // wordmark visible.

  function upgradeSplashLogo(host) {
    if (host.dataset.wwhUpgraded === '1') return;

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

    host.addEventListener('click', burst);
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(); }
    });
  }

  // -------- Header brand hookup --------------------------------------------
  // The HTML now ships with a static <img class="wwh-mono-fallback"> inside
  // each .wwh-awal-brand so the glow monogram always renders, even if this
  // script never executes. When it does execute and the inline SVG builds
  // successfully, we remove the fallback so the rainbow-rim hover animation
  // can run. Any error during build leaves the static fallback in place.

  function upgradeHeaderBrand(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    try {
      var svg = buildMonogram();
      var fallback = host.querySelector('.wwh-mono-fallback');
      if (fallback && fallback.parentNode) fallback.parentNode.removeChild(fallback);
      host.setAttribute('aria-label', 'WildWooHoo - back to home');
      host.appendChild(svg);
      host.dataset.wwhUpgraded = '1';
    } catch (err) {
      if (window && window.console) console.error('[wwh] header monogram build failed:', err);
    }
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
