/* ==========================================================================
   WildWooHoo — Brand Effects v3
   - Splash hero  : full wordmark, click → prism burst (more secretive).
   - Header brand : W monogram only, hover → prism reveal (more responsive).
   - The beam is a clean rainbow LINE through the diagonal gap (not letter-
     shaped). Invisible at rest; opacity + stroke-width animate on burst.
   - Falls back gracefully: if JS fails, the wordmark text still renders.
   ========================================================================== */
(function () {
  'use strict';

  var ns = 'http://www.w3.org/2000/svg';
  var idSeq = 0;

  function buildWordmark() {
    var n = ++idSeq;
    var html =
      '<defs>' +
        '<linearGradient id="wm-sp-' + n + '" x1="0" y1="1" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#E8493B"/>' +
          '<stop offset="18%" stop-color="#F08A30"/>' +
          '<stop offset="38%" stop-color="#F5C545"/>' +
          '<stop offset="58%" stop-color="#6AB04A"/>' +
          '<stop offset="78%" stop-color="#3D7EE0"/>' +
          '<stop offset="100%" stop-color="#6B4FB8"/>' +
        '</linearGradient>' +
        '<clipPath id="wm-a-' + n + '"><polygon points="0,0 720,0 720,55 0,105"/></clipPath>' +
        '<clipPath id="wm-b-' + n + '"><polygon points="0,121 720,71 720,160 0,160"/></clipPath>' +
      '</defs>' +
      '<g class="wwh-wm-top">' +
        '<text x="364" y="130" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="128" letter-spacing="-3" ' +
          'fill="currentColor" clip-path="url(#wm-a-' + n + ')">WildWooHoo</text>' +
      '</g>' +
      '<g class="wwh-wm-bot">' +
        '<text x="356" y="130" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="128" letter-spacing="-3" ' +
          'fill="currentColor" clip-path="url(#wm-b-' + n + ')">WildWooHoo</text>' +
      '</g>' +
      // Beam: clean rainbow line across the diagonal gap, hidden at rest
      '<line class="wwh-wm-beam" x1="0" y1="113" x2="720" y2="63" ' +
        'stroke="url(#wm-sp-' + n + ')" stroke-width="8" stroke-linecap="round" opacity="0"/>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-wordmark');
    svg.setAttribute('viewBox', '0 0 720 160');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');
    svg.innerHTML = html;
    return svg;
  }

  function buildMonogram() {
    // Mirror W (parallel worlds): an upright W and its mirrored reflection,
    // joined by a rainbow beam at the reflection plane. Hover reveals the beam
    // and slightly separates the two W's.
    var n = ++idSeq;
    var html =
      '<defs>' +
        '<linearGradient id="mn-sp-' + n + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#E8493B"/>' +
          '<stop offset="18%" stop-color="#F08A30"/>' +
          '<stop offset="38%" stop-color="#F5C545"/>' +
          '<stop offset="58%" stop-color="#6AB04A"/>' +
          '<stop offset="78%" stop-color="#3D7EE0"/>' +
          '<stop offset="100%" stop-color="#6B4FB8"/>' +
        '</linearGradient>' +
      '</defs>' +
      // Top W
      '<g class="wwh-mono-top">' +
        '<text x="50" y="44" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="56" letter-spacing="-1.5" ' +
          'fill="currentColor">W</text>' +
      '</g>' +
      // Rainbow beam at the reflection plane (hidden until hover)
      '<line class="wwh-mono-beam" x1="14" y1="50" x2="86" y2="50" ' +
        'stroke="url(#mn-sp-' + n + ')" stroke-width="3" stroke-linecap="round" opacity="0"/>' +
      // Mirror W: flipped vertically, slightly dimmed as a reflection
      '<g class="wwh-mono-bot" transform="translate(0 100) scale(1 -1)">' +
        '<text x="50" y="44" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="56" letter-spacing="-1.5" ' +
          'fill="currentColor" opacity="0.55">W</text>' +
      '</g>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-mono');
    svg.setAttribute('viewBox', '0 0 100 100');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');
    svg.innerHTML = html;
    return svg;
  }

  // ---- Splash hero: wordmark with click-burst -----------------------------

  function upgradeSplashLogo(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';

    var nameSpan = host.querySelector('.name');
    var altText = nameSpan ? nameSpan.textContent.trim() : 'WildWooHoo';

    // Sub-pages with a custom title keep their text.
    if (altText.replace(/\s+/g, '').toLowerCase() !== 'wildwoohoo') return;

    host.setAttribute('role', 'button');
    host.setAttribute('tabindex', '0');
    host.setAttribute('aria-label', 'WildWooHoo — click for prism light effect');
    host.innerHTML = '';
    host.appendChild(buildWordmark());

    function burst() {
      host.classList.remove('is-burst');
      void host.offsetWidth;
      host.classList.add('is-burst');
      window.setTimeout(function () { host.classList.remove('is-burst'); }, 950);
    }

    host.addEventListener('click', burst);
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); burst(); }
    });
  }

  // ---- Header brand: W monogram with hover-reveal -------------------------

  function upgradeHeaderBrand(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';

    host.setAttribute('aria-label', 'WildWooHoo — back to home');
    host.appendChild(buildMonogram());
  }

  // ---- Init ---------------------------------------------------------------

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
