/* ==========================================================================
   WildWooHoo — Brand Effects
   Upgrades every .wwh-splash-logo block into the inline SVG wordmark with
   the diagonal light-beam treatment, and wires the click-to-prism-burst.
   Falls back gracefully (the .name span stays visible if JS is disabled).
   ========================================================================== */
(function () {
  'use strict';

  // SVG ID counter so multiple wordmarks on a page get unique clipPath IDs
  var idSeq = 0;

  function buildWordmarkSVG() {
    var n = ++idSeq;
    var ns = 'http://www.w3.org/2000/svg';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-wordmark');
    svg.setAttribute('viewBox', '0 0 720 160');
    svg.setAttribute('role', 'img');
    svg.setAttribute('aria-label', 'WildWooHoo');

    var defs = document.createElementNS(ns, 'defs');
    defs.innerHTML =
      '<linearGradient id="wwh-sp-' + n + '" x1="0" y1="0" x2="1" y2="0">' +
        '<stop offset="0%" stop-color="#E8493B"/>' +
        '<stop offset="18%" stop-color="#F08A30"/>' +
        '<stop offset="38%" stop-color="#F5C545"/>' +
        '<stop offset="58%" stop-color="#6AB04A"/>' +
        '<stop offset="78%" stop-color="#3D7EE0"/>' +
        '<stop offset="100%" stop-color="#6B4FB8"/>' +
      '</linearGradient>' +
      '<clipPath id="wwh-cu-' + n + '"><polygon points="0,0 720,0 720,55 0,105"/></clipPath>' +
      '<clipPath id="wwh-cl-' + n + '"><polygon points="0,121 720,71 720,160 0,160"/></clipPath>';
    svg.appendChild(defs);

    // Upper half — shifted right
    var gTop = document.createElementNS(ns, 'g');
    gTop.setAttribute('class', 'wwh-wm-top');
    gTop.innerHTML =
      '<text x="364" y="130" text-anchor="middle" ' +
        'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
        'font-weight="400" font-size="128" letter-spacing="-3" ' +
        'fill="currentColor" clip-path="url(#wwh-cu-' + n + ')">WildWooHoo</text>';
    svg.appendChild(gTop);

    // Lower half — shifted left
    var gBot = document.createElementNS(ns, 'g');
    gBot.setAttribute('class', 'wwh-wm-bot');
    gBot.innerHTML =
      '<text x="356" y="130" text-anchor="middle" ' +
        'font-family="\'DM Serif Display\',\'Libre Baskerville\',Georgia,serif" ' +
        'font-weight="400" font-size="128" letter-spacing="-3" ' +
        'fill="currentColor" clip-path="url(#wwh-cl-' + n + ')">WildWooHoo</text>';
    svg.appendChild(gBot);

    // Beam — hidden at rest, animated on burst by the CSS keyframes
    var beam = document.createElementNS(ns, 'line');
    beam.setAttribute('class', 'wwh-wm-beam');
    beam.setAttribute('x1', '0');
    beam.setAttribute('y1', '113');
    beam.setAttribute('x2', '720');
    beam.setAttribute('y2', '63');
    beam.setAttribute('stroke', 'url(#wwh-sp-' + n + ')');
    beam.setAttribute('stroke-width', '6');
    svg.appendChild(beam);

    return svg;
  }

  function upgradeSplashLogo(host) {
    if (host.dataset.wwhUpgraded === '1') return;
    host.dataset.wwhUpgraded = '1';

    // Clear the old <span class="mark"></span><span class="name">WildWooHoo</span>
    var nameSpan = host.querySelector('.name');
    var altText = nameSpan ? nameSpan.textContent : 'WildWooHoo';
    host.setAttribute('role', 'button');
    host.setAttribute('tabindex', '0');
    host.setAttribute('aria-label', altText + ' — click for prism light effect');

    // Page-specific names that aren't "WildWooHoo" (e.g. "Music & Video") keep
    // the original text span so the page header stays meaningful.
    if (altText && altText.replace(/\s+/g, '').toLowerCase() !== 'wildwoohoo') return;

    // Replace contents with the inline wordmark
    host.innerHTML = '';
    host.appendChild(buildWordmarkSVG());

    function burst() {
      host.classList.remove('is-burst');
      // Force reflow so the animation re-triggers
      void host.offsetWidth;
      host.classList.add('is-burst');
      window.setTimeout(function () {
        host.classList.remove('is-burst');
      }, 950);
    }

    host.addEventListener('click', burst);
    host.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        burst();
      }
    });
  }

  function init() {
    var hosts = document.querySelectorAll('.wwh-splash-logo');
    Array.prototype.forEach.call(hosts, upgradeSplashLogo);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
