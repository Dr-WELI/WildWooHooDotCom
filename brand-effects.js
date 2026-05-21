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
    var sp = 'wm-sp-' + n;
    var bt = 'wm-bt-' + n;
    var bb = 'wm-bb-' + n;
    var mk = 'wm-mk-' + n;
    var html =
      '<defs>' +
        '<linearGradient id="' + sp + '" x1="0" y1="0" x2="1" y2="0">' +
          '<stop offset="0%"  stop-color="#C97A66"/>' +
          '<stop offset="14%" stop-color="#D89E78"/>' +
          '<stop offset="28%" stop-color="#B59B6D"/>' +
          '<stop offset="42%" stop-color="#B07F30"/>' +
          '<stop offset="50%" stop-color="#27A05B"/>' +
          '<stop offset="58%" stop-color="#B07F30"/>' +
          '<stop offset="72%" stop-color="#B59B6D"/>' +
          '<stop offset="86%" stop-color="#9985A8"/>' +
          '<stop offset="100%" stop-color="#7D6E92"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + bt + '" x1="0" y1="1" x2="0" y2="0">' +
          '<stop offset="0%" stop-color="#27A05B" stop-opacity=".5"/>' +
          '<stop offset="60%" stop-color="#D2B07A" stop-opacity=".18"/>' +
          '<stop offset="100%" stop-color="#D2B07A" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<linearGradient id="' + bb + '" x1="0" y1="0" x2="0" y2="1">' +
          '<stop offset="0%" stop-color="#27A05B" stop-opacity=".5"/>' +
          '<stop offset="60%" stop-color="#9985A8" stop-opacity=".18"/>' +
          '<stop offset="100%" stop-color="#9985A8" stop-opacity="0"/>' +
        '</linearGradient>' +
        '<mask id="' + mk + '">' +
          '<rect width="800" height="200" fill="#FFFFFF"/>' +
          '<rect x="60" y="125" width="680" height="2" fill="#000000"/>' +
        '</mask>' +
      '</defs>' +
      // Diffraction (above + below the seam, revealed on hover)
      '<g class="wwh-wm-diffraction">' +
        '<ellipse class="wwh-wm-bloom-top" cx="400" cy="126" rx="320" ry="34" fill="url(#' + bt + ')"/>' +
        '<ellipse class="wwh-wm-bloom-bot" cx="400" cy="126" rx="320" ry="34" fill="url(#' + bb + ')"/>' +
        '<line class="wwh-wm-df" x1="220" y1="125" x2="220" y2="92"  stroke="#C97A66" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="290" y1="125" x2="290" y2="96"  stroke="#D89E78" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="370" y1="125" x2="370" y2="88"  stroke="#B59B6D" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="440" y1="125" x2="440" y2="88"  stroke="#27A05B" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="520" y1="125" x2="520" y2="96"  stroke="#B07F30" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="600" y1="125" x2="600" y2="92"  stroke="#9985A8" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="240" y1="127" x2="240" y2="160" stroke="#C97A66" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="320" y1="127" x2="320" y2="156" stroke="#D89E78" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="400" y1="127" x2="400" y2="164" stroke="#B59B6D" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="480" y1="127" x2="480" y2="164" stroke="#27A05B" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="560" y1="127" x2="560" y2="156" stroke="#B07F30" stroke-width="1"/>' +
        '<line class="wwh-wm-df" x1="640" y1="127" x2="640" y2="160" stroke="#9985A8" stroke-width="1"/>' +
      '</g>' +
      // Letterforms (caps as custom paths, lowercase in Caveat) - masked by horizon seam
      '<g mask="url(#' + mk + ')" fill="currentColor">' +
        '<path d="M 100 60 L 126 156 L 156 78 L 186 156 L 212 60" ' +
          'stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text x="226" y="156" font-family="\'Caveat\',cursive" font-weight="700" font-size="118" letter-spacing="-2" fill="currentColor">ild</text>' +
        '<path d="M 346 60 L 372 156 L 402 78 L 432 156 L 458 60" ' +
          'stroke="currentColor" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '<text x="470" y="156" font-family="\'Caveat\',cursive" font-weight="700" font-size="118" letter-spacing="-2" fill="currentColor">oo</text>' +
        '<rect x="580" y="60"  width="14" height="96" rx="1.5"/>' +
        '<rect x="624" y="60"  width="14" height="96" rx="1.5"/>' +
        '<rect x="594" y="119" width="30" height="14" rx="1.5"/>' +
        '<text x="652" y="156" font-family="\'Caveat\',cursive" font-weight="700" font-size="118" letter-spacing="-2" fill="currentColor">oo</text>' +
      '</g>' +
      // Horizon hairline (the brand seam)
      '<line class="wwh-wm-horizon" x1="60" y1="126" x2="740" y2="126" ' +
        'stroke="url(#' + sp + ')" stroke-width="1.4"/>';
    var svg = document.createElementNS(ns, 'svg');
    svg.setAttribute('class', 'wwh-wordmark');
    svg.setAttribute('viewBox', '0 0 800 200');
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
          '<stop offset="0%"  stop-color="#FFFFFF" stop-opacity=".26"/>' +
          '<stop offset="50%" stop-color="#FFFFFF" stop-opacity=".05"/>' +
          '<stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>' +
        '</radialGradient>' +
        '<radialGradient id="' + sh + '" cx="78%" cy="82%" r="55%">' +
          '<stop offset="0%"  stop-color="#000000" stop-opacity=".22"/>' +
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
          '<stop offset="74%"  stop-color="#C97A66" stop-opacity=".4"/>' +
          '<stop offset="88%"  stop-color="#9985A8" stop-opacity=".55"/>' +
          '<stop offset="100%" stop-color="#7D6E92" stop-opacity=".55"/>' +
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
        '<rect width="100" height="100" fill="#0E0E0F"/>' +
        '<circle class="wwh-mono-bloom" cx="50" cy="50" r="56" fill="url(#' + bl + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sp + ')"/>' +
        '<rect width="100" height="100" fill="url(#' + sh + ')"/>' +
        '<rect x="0" y="0" width="100" height="2" fill="#FFFFFF" opacity=".14"/>' +
        '<rect x="0" y="98" width="100" height="2" fill="#000000" opacity=".22"/>' +
        '<rect class="wwh-mono-rim" width="100" height="100" fill="url(#' + rm + ')"/>' +
        '<g class="wwh-mono-top">' +
          '<path d="M 18 24 L 33 50 L 50 28 L 67 50 L 82 24" ' +
            'stroke="#FBF7EE" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<g class="wwh-mono-bot">' +
          '<path d="M 18 76 L 33 50 L 50 72 L 67 50 L 82 76" ' +
            'stroke="#FBF7EE" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<g class="wwh-mono-final">' +
          '<path d="M 18 37 L 33 63 L 50 41 L 67 63 L 82 37" ' +
            'stroke="#FBF7EE" stroke-width="9" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</g>' +
        '<line class="wwh-mono-horizon-cream" x1="14" y1="50" x2="86" y2="50" stroke="#FBF7EE" stroke-width="1.1"/>' +
        '<line class="wwh-mono-horizon-rain"  x1="14" y1="50" x2="86" y2="50" stroke="url(#' + hr + ')" stroke-width="1.6"/>' +
        '<circle cx="50" cy="50" r="1.8" fill="#FBF7EE" opacity=".9"/>' +
        '<rect class="wwh-mono-shine" x="-30" y="-10" width="40" height="120" fill="url(#' + sn + ')" transform="rotate(15 20 50)"/>' +
      '</g>' +
      '<path d="' + tile + '" fill="none" stroke="rgba(0,0,0,.08)" stroke-width=".5"/>';
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
