/* ==========================================================================
   WildWooHoo - Brand Effects (final)
   - Splash hero  : hover-glue. The two halves of the wordmark slide together,
                    the white sunbeam + rainbow appear in the middle. Worlds
                    unite through the work. Click triggers the same end-state
                    briefly (touch fallback).
   - Header brand : Mirror W globe. The reflected bottom W flips up and
                    merges with the top W on hover - parallel worlds become
                    one. White light + rainbow line at the reflection plane.
   - The injected SVG matches brand/wordmark.svg and brand/monogram.svg, so
     anything you can do in the static file you can do here.
   ========================================================================== */
(function () {
  'use strict';

  var ns = 'http://www.w3.org/2000/svg';
  var idSeq = 0;

  // -------- Wordmark (splash hero) -----------------------------------------

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
        '<filter id="wm-fl-' + n + '" x="-10%" y="-30%" width="120%" height="160%">' +
          '<feGaussianBlur stdDeviation="4" result="blur"/>' +
          '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
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
      // White sunbeam - wide, glowing, runs across the diagonal cut
      '<line class="wwh-wm-sunbeam" x1="-40" y1="120" x2="760" y2="58" ' +
        'stroke="#FFF7D8" stroke-width="18" stroke-linecap="round" opacity="0" ' +
        'filter="url(#wm-fl-' + n + ')"/>' +
      // Rainbow beam - the diffraction line
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

  // -------- Monogram (header W with globe + mirror reflection) -------------

  function buildMonogram() {
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
        '<linearGradient id="mn-wh-' + n + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>' +
          '<stop offset="45%" stop-color="#FFF7D8" stop-opacity="1"/>' +
          '<stop offset="55%" stop-color="#FFFFFF" stop-opacity="1"/>' +
          '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<radialGradient id="mn-gl-' + n + '" cx="38%" cy="28%" r="70%">' +
          '<stop offset="0%" stop-color="#FFFFFF" stop-opacity=".18"/>' +
          '<stop offset="42%" stop-color="#F5C545" stop-opacity=".08"/>' +
          '<stop offset="100%" stop-color="#6B4FB8" stop-opacity=".03"/>' +
        '</radialGradient>' +
        '<filter id="mn-fl-' + n + '" x="-30%" y="-30%" width="160%" height="160%">' +
          '<feGaussianBlur stdDeviation="2.4" result="blur"/>' +
          '<feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>' +
        '</filter>' +
      '</defs>' +
      // Globe: subtle 3D-feeling sphere behind both W's
      '<g class="wwh-mono-globe">' +
        '<circle cx="50" cy="50" r="35" fill="url(#mn-gl-' + n + ')" stroke="rgba(255,255,255,.34)" stroke-width="1.25"/>' +
        '<ellipse class="wwh-mono-globe-meridian" cx="50" cy="50" rx="18" ry="35" fill="none" stroke="rgba(245,197,69,.34)" stroke-width="1"/>' +
        '<ellipse class="wwh-mono-globe-equator"  cx="50" cy="50" rx="35" ry="10" fill="none" stroke="rgba(255,255,255,.26)" stroke-width="1"/>' +
      '</g>' +
      // Top W: the world above
      '<g class="wwh-mono-top">' +
        '<text x="50" y="47" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="54" letter-spacing="-1.5" ' +
          'fill="currentColor">W</text>' +
      '</g>' +
      // White sunlight line (reveals on hover)
      '<line class="wwh-mono-whitebeam" x1="18" y1="51" x2="82" y2="51" ' +
        'stroke="url(#mn-wh-' + n + ')" stroke-width="5.5" stroke-linecap="round" opacity="0" ' +
        'filter="url(#mn-fl-' + n + ')"/>' +
      // Rainbow diffraction line (reveals on hover)
      '<line class="wwh-mono-beam" x1="16" y1="51" x2="84" y2="51" ' +
        'stroke="url(#mn-sp-' + n + ')" stroke-width="3" stroke-linecap="round" opacity="0"/>' +
      // Bottom W: the reflection. At rest, CSS flips it via scaleY(-1) so it
      // appears mirrored below. On hover, CSS sets transform: none and the
      // bottom W lifts up to merge with the top W into a single world.
      '<g class="wwh-mono-bot">' +
        '<text x="50" y="47" text-anchor="middle" ' +
          'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
          'font-weight="400" font-size="54" letter-spacing="-1.5" ' +
          'fill="currentColor">W</text>' +
      '</g>';
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
