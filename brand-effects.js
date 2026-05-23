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

  // -------- Static asset loaders -------------------------------------------

  function buildWordmark() {
    var img = document.createElement('img');
    img.src = WORDMARK_SRC;
    img.className = 'wwh-wordmark';
    img.alt = 'WildWooHoo';
    img.setAttribute('role', 'img');
    img.setAttribute('draggable', 'false');
    return img;
  }

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

  // -------- Footer brand hookup --------------------------------------------
  // Replaces the "WildWooHoo" text in `.wwh-footer-brand` anchors with the
  // outlined SVG wordmark, so the brand appears as its proper drawn form
  // everywhere - not as a font fallback.

  function upgradeFooterBrand(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';
    host.setAttribute('aria-label', 'WildWooHoo');
    host.innerHTML = '';
    host.appendChild(buildWordmark());
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
