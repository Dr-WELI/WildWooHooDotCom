/* ==========================================================================
   WildWooHoo — Brand Effects v2
   - Splash hero  : full wordmark, click → prism burst (more secretive).
   - Header brand : W monogram only, hover → prism reveal (more responsive).
   - Spectrum lives only INSIDE the diagonal gap of the cut. Never overlay.
   - Falls back gracefully: if JS fails, the wordmark text still renders.
   ========================================================================== */
(function () {
  'use strict';

  var ns = 'http://www.w3.org/2000/svg';
  var idSeq = 0;

  // ---- Inline SVG builders ------------------------------------------------

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
        '<clipPath id="wm-g-' + n + '"><polygon points="0,105 720,55 720,71 0,121"/></clipPath>' +
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
      '<g class="wwh-wm-beam">' +
        '<text x="360" y="130" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="128" letter-spacing="-3" ' +
          'fill="url(#wm-sp-' + n + ')" clip-path="url(#wm-g-' + n + ')">WildWooHoo</text>' +
      '</g>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-wordmark');
    svg.setAttribute('viewBox', '0 0 720 160');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');
    svg.innerHTML = html;
    return svg;
  }

  function buildMonogram() {
    var n = ++idSeq;
    var html =
      '<defs>' +
        '<linearGradient id="mn-sp-' + n + '" x1="0" y1="1" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#E8493B"/>' +
          '<stop offset="18%" stop-color="#F08A30"/>' +
          '<stop offset="38%" stop-color="#F5C545"/>' +
          '<stop offset="58%" stop-color="#6AB04A"/>' +
          '<stop offset="78%" stop-color="#3D7EE0"/>' +
          '<stop offset="100%" stop-color="#6B4FB8"/>' +
        '</linearGradient>' +
        '<clipPath id="mn-a-' + n + '"><polygon points="0,0 100,0 100,40 0,58"/></clipPath>' +
        '<clipPath id="mn-b-' + n + '"><polygon points="0,66 100,48 100,100 0,100"/></clipPath>' +
        '<clipPath id="mn-g-' + n + '"><polygon points="0,58 100,40 100,48 0,66"/></clipPath>' +
      '</defs>' +
      '<g class="wwh-mono-top">' +
        '<text x="52" y="78" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="92" letter-spacing="-2" ' +
          'fill="currentColor" clip-path="url(#mn-a-' + n + ')">W</text>' +
      '</g>' +
      '<g class="wwh-mono-bot">' +
        '<text x="48" y="78" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="92" letter-spacing="-2" ' +
          'fill="currentColor" clip-path="url(#mn-b-' + n + ')">W</text>' +
      '</g>' +
      '<g class="wwh-mono-beam">' +
        '<text x="50" y="78" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="92" letter-spacing="-2" ' +
          'fill="url(#mn-sp-' + n + ')" clip-path="url(#mn-g-' + n + ')">W</text>' +
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

    // Sub-pages with a custom title (e.g. "Music & Video") keep their text.
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
    // Keep the text content in the DOM for accessibility but visually hidden
    // (CSS sets font-size: 0 on .wwh-awal-brand so screen readers still see it).
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
