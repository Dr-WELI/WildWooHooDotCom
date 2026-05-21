/* ==========================================================================
   WildWooHoo - Brand Effects (locked v4 — monochrome direction)
   - Mark         : black horizon-pinched tile, cream W on top + reflected M
                    below, cream horizon hairline through the seam. On hover,
                    both Ws fade and converge to the centre — a single unified
                    W emerges on the horizon, slightly larger; a spectrum
                    bloom flashes outward; a rainbow rim glow appears at the
                    perimeter; the horizon hairline turns rainbow.
   - Wordmark     : custom geometric capitals (W, H) drawn to match the W
                    monogram + handwritten lowercase set in Caveat. A horizon
                    hairline runs through the seam of every letter. On hover
                    the spectrum intensifies and diffraction bands rise above
                    and fall below the seam.
   - Both injected SVGs mirror brand/monogram.svg and brand/wordmark.svg.
   ========================================================================== */
(function () {
  'use strict';

  var ns = 'http://www.w3.org/2000/svg';
  var idSeq = 0;

  // -------- Wordmark (splash hero) -----------------------------------------

  function buildWordmark() {
    var n = ++idSeq;
    var sh = 'wm-sh-' + n;
    var html =
      '<defs>' +
        '<linearGradient id="' + sh + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%"   stop-color="#C97A66" stop-opacity="0"/>' +
          '<stop offset="14%"  stop-color="#C97A66" stop-opacity=".42"/>' +
          '<stop offset="28%"  stop-color="#D89E78" stop-opacity=".48"/>' +
          '<stop offset="42%"  stop-color="#E5B96D" stop-opacity=".50"/>' +
          '<stop offset="50%"  stop-color="#FFFFFF" stop-opacity=".72"/>' +
          '<stop offset="58%"  stop-color="#27A05B" stop-opacity=".50"/>' +
          '<stop offset="72%"  stop-color="#B07F30" stop-opacity=".48"/>' +
          '<stop offset="86%"  stop-color="#9985A8" stop-opacity=".42"/>' +
          '<stop offset="100%" stop-color="#7D6E92" stop-opacity="0"/>' +
        '</linearGradient>' +
      '</defs>' +
      // All letters drawn as custom monoline outlines
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
        '<path d="M 18 55 L 55.5 120 L 98 65 L 140.5 120 L 178 55" stroke-width="22"/>' +
        '<line x1="202" y1="70" x2="202" y2="120" stroke-width="14"/>' +
        '<line x1="220" y1="55" x2="220" y2="120" stroke-width="14"/>' +
        '<circle cx="256" cy="95" r="18" stroke-width="14"/>' +
        '<line x1="281" y1="55" x2="281" y2="120" stroke-width="14"/>' +
        '<path d="M 305.5 55 L 343 120 L 385.5 65 L 428 120 L 470.5 55" stroke-width="22"/>' +
        '<circle cx="508" cy="95" r="18" stroke-width="14"/>' +
        '<circle cx="562" cy="95" r="18" stroke-width="14"/>' +
        '<line x1="610" y1="55" x2="610" y2="120" stroke-width="22"/>' +
        '<line x1="660" y1="55" x2="660" y2="120" stroke-width="22"/>' +
        '<line x1="610" y1="87" x2="660" y2="87" stroke-width="22"/>' +
        '<circle cx="708" cy="95" r="18" stroke-width="14"/>' +
        '<circle cx="762" cy="95" r="18" stroke-width="14"/>' +
      '</g>' +
      // The dot on the i (only filled element in the whole wordmark)
      '<circle cx="202" cy="58" r="5" fill="currentColor"/>' +
      // Rainbow shine - sweeps across on hover
      '<g class="wwh-wm-shine">' +
        '<rect x="-80" y="-10" width="100" height="180" fill="url(#' + sh + ')" transform="rotate(12 -30 80)"/>' +
      '</g>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-wordmark');
    svg.setAttribute('viewBox', '0 0 800 160');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');
    svg.innerHTML = html;
    return svg;
  }

  // -------- Monogram (header W with mirror reflection) ---------------------

  function buildMonogram() {
    var n = ++idSeq;
    var sp = 'mn-spec-' + n;
    var sh = 'mn-shadow-' + n;
    var bl = 'mn-bloom-' + n;
    var rm = 'mn-rim-' + n;
    var hr = 'mn-horizon-' + n;
    var sn = 'mn-shine-' + n;
    var cl = 'mn-tile-' + n;
    var tile = 'M 24 4 H 76 C 92 4, 96 8, 96 24 V 46 C 96 48, 94.5 49.2, 92 50 C 94.5 50.8, 96 52, 96 54 V 76 C 96 92, 92 96, 76 96 H 24 C 8 96, 4 92, 4 76 V 54 C 4 52, 5.5 50.8, 8 50 C 5.5 49.2, 4 48, 4 46 V 24 C 4 8, 8 4, 24 4 Z';
    var html =
      '<defs>' +
        '<radialGradient id="' + sp + '" cx="32%" cy="22%" r="58%">' +
          '<stop offset="0%"  stop-color="#FFFFFF" stop-opacity=".42"/>' +
          '<stop offset="50%" stop-color="#FFFFFF" stop-opacity=".08"/>' +
          '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + sh + '" cx="78%" cy="82%" r="55%">' +
          '<stop offset="0%"  stop-color="#000000" stop-opacity=".18"/>' +
          '<stop offset="60%" stop-color="#000000" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + bl + '" cx="50%" cy="50%" r="50%">' +
          '<stop offset="0%"   stop-color="#27A05B"/>' +
          '<stop offset="30%"  stop-color="#1A4A28"/>' +
          '<stop offset="55%"  stop-color="#D2B07A"/>' +
          '<stop offset="80%"  stop-color="#C97A66"/>' +
          '<stop offset="100%" stop-color="#7D6E92"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + rm + '" cx="50%" cy="50%" r="62%">' +
          '<stop offset="0%"   stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="58%"  stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="74%"  stop-color="#C97A66" stop-opacity=".48"/>' +
          '<stop offset="88%"  stop-color="#9985A8" stop-opacity=".62"/>' +
          '<stop offset="100%" stop-color="#7D6E92" stop-opacity=".6"/>' +
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
          '<stop offset="0%"  stop-color="#000000" stop-opacity="0"/>' +
          '<stop offset="45%" stop-color="#000000" stop-opacity=".22"/>' +
          '<stop offset="55%" stop-color="#000000" stop-opacity=".22"/>' +
          '<stop offset="100%" stop-color="#000000" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<clipPath id="' + cl + '"><path d="' + tile + '"/></clipPath>' +
      '</defs>' +
      '<g clip-path="url(#' + cl + ')">' +
        '<rect width="100" height="100" fill="#FBF7EE"/>' +
        '<circle class="wwh-mono-bloom" cx="50" cy="50" r="56" fill="url(#' + bl + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sp + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sh + ')"/>' +
        '<rect x="0" y="0" width="100" height="2" fill="#FFFFFF" opacity=".4"/>' +
        '<rect x="0" y="98" width="100" height="2" fill="#000000" opacity=".15"/>' +
        '<rect class="wwh-mono-rim" width="100" height="100" fill="url(#' + rm + ')"/>' +
        '<g class="wwh-mono-top">' +
          '<path d="M 18 24 L 33 50 L 50 28 L 67 50 L 82 24" ' +
            'stroke="#0E0E0F" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<g class="wwh-mono-bot">' +
          '<path d="M 18 76 L 33 50 L 50 72 L 67 50 L 82 76" ' +
            'stroke="#0E0E0F" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<g class="wwh-mono-final">' +
          '<path d="M 18 37 L 33 63 L 50 41 L 67 63 L 82 37" ' +
            'stroke="#0E0E0F" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<line class="wwh-mono-horizon-cream" x1="14" y1="50" x2="86" y2="50" stroke="#0E0E0F" stroke-width="1.1"/>' +
        '<line class="wwh-mono-horizon-rain"  x1="14" y1="50" x2="86" y2="50" stroke="url(#' + hr + ')" stroke-width="1.6"/>' +
        '<circle cx="50" cy="50" r="1.8" fill="#0E0E0F" opacity=".9"/>' +
        '<rect class="wwh-mono-shine" x="-30" y="-10" width="40" height="120" fill="url(#' + sn + ')" transform="rotate(15 20 50)"/>' +
      '</g>' +
      '<path d="' + tile + '" fill="none" stroke="rgba(0,0,0,.12)" stroke-width=".5"/>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-mono');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');
    svg.innerHTML = html;
    return svg;
  }

  // -------- Splash hero hookup ---------------------------------------------

  function upgradeSplashLogo(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';

    var nameSpan = host.querySelector('.name');
    var altText = nameSpan ? nameSpan.textContent.trim() : 'WildWooHoo';
    if (altText.replace(/\s+/g, '').toLowerCase() !== 'wildwoohoo') return;

    host.setAttribute('role', 'button');
    host.setAttribute('tabindex', '0');
    host.setAttribute('aria-label', 'WildWooHoo - hover or click for prism light effect');
    host.innerHTML = '';
    host.appendChild(buildWordmark());

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

  function upgradeHeaderBrand(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';
    host.setAttribute('aria-label', 'WildWooHoo - back to home');
    host.appendChild(buildMonogram());
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
