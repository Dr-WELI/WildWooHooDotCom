/* ===== WildWooHoo splash-lock (first-screen gate) =====
 * Brand evolution 2026-06-05. Self-contained IIFE, vanilla, no exports.
 *
 * Reference: noomo storytelling (https://storytelling.noomoagency.com).
 * WELI verbatim direction: "that could be the first one page lock and we
 * click to unlock the rest of the information... maybe the GREEN is our
 * main colour, then we bring technology in colour and effects."
 *
 * What this does:
 *   1. Mounts a full-viewport overlay (z-index 9998) ABOVE the voxel hero
 *      scene + page content. Locks body scroll.
 *   2. Renders a green-leaning pastel iridescent backdrop, a large
 *      semi-translucent kangaroo silhouette on the left, centred serif
 *      italic narrative copy ("In a world that's constantly / evolving,"
 *      with hand-drawn underline draw-in), a tiny pixel-art kangaroo
 *      mascot, a top-left script wordmark, and a bottom-right pulse pill
 *      CTA ("Press to begin").
 *   3. On click anywhere (or Enter/Space on pill, or Escape):
 *        - pixel kangaroo bursts (scale + rotate + fade)
 *        - backdrop dissolves to opacity 0 + blur(30px) over 900ms
 *        - centred copy fades + lifts 8px
 *        - body loses .is-splash-locked (scroll restored)
 *        - custom event 'wwh-splash-unlock' fires on document
 *        - fallback: clicks .wwh-listen-toggle if present
 *        - after 1.1s the lock element removes itself + cleans up
 *
 * Hard constraints honoured:
 *   - Pure CSS + JS + SVG, no build, GitHub Pages compatible
 *   - Vanilla, no React/Vue/Three.js for the lock layer
 *   - GPU-accelerated backdrop (gradients + transforms + opacity)
 *   - Mobile: kangaroo scales down, copy caps at 36px, pill stays bottom-right
 *   - prefers-reduced-motion: no hue-rotate, no drift, no underline draw,
 *     no pulse — backdrop is static, click still works
 *   - visibilitychange:hidden — animations pause
 *   - No autoplay — silent until clicked
 *   - role="dialog" aria-modal="true", real <button>, focus on mount,
 *     Escape unlocks, focus moves to #wwh-hero-content (or main) after
 *   - Cleanup: removes listeners, element, body class on unmount
 *
 * Visual fidelity disclosure (be honest):
 *   - The large kangaroo silhouette is a SIDE-PROFILE single-path SVG. It
 *     reads as a kangaroo from posture cues: heavy back legs + thick base
 *     of tail + small forearms + upright head + ears. It is NOT photoreal;
 *     it is a soft ghost-silhouette. Could plausibly read as "small deer"
 *     to viewers unfamiliar with kangaroos. I've biased the silhouette
 *     toward kangaroo by exaggerating the tail thickness + back-leg bulk.
 *   - The pixel mascot is a 12-row grid drawn via inline SVG <rect>s. It
 *     reads as a tiny kangaroo because of the upright posture + tail
 *     trailing behind + small forelimbs. At 24px it's pixel-art icon
 *     scale — recognisable but stylised.
 * ============================================================ */

(function () {
  'use strict';

  // -- Boot gate --------------------------------------------------------
  // Defer until body exists (defer attribute + DOMContentLoaded back-stop).
  if (!document.body) {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }

  function boot() {
    // Single-mount guard
    if (document.querySelector('.wwh-splash-lock')) return;

    // Honour reduced motion
    var prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    injectStyles();
    var lock = buildLock(prefersReduced);
    document.body.appendChild(lock);

    // Lock body scroll
    document.body.classList.add('is-splash-locked');

    // Focus management
    var lastFocus = document.activeElement;
    var pillBtn = lock.querySelector('.wwh-splash-lock-cta');
    if (pillBtn) {
      // Small delay so screen readers announce the dialog first
      setTimeout(function () {
        try { pillBtn.focus({ preventScroll: true }); } catch (e) { pillBtn.focus(); }
      }, 50);
    }

    // Tab trap: only one focusable in the dialog (the CTA), so we keep
    // focus on it whenever Tab is pressed.
    function onKeydown(e) {
      if (e.key === 'Tab') {
        e.preventDefault();
        if (pillBtn) pillBtn.focus();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        unlock();
      } else if ((e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') && e.target === pillBtn) {
        // Native button handles this, but cover Space explicitly to avoid
        // page scroll on browsers that haven't suppressed it.
        e.preventDefault();
        unlock();
      }
    }

    // Click anywhere on the lock counts as unlock
    function onClick(e) {
      // Allow clicks on the CTA to also unlock (button click does this)
      // — but if click started on something else, still unlock.
      unlock();
      e.preventDefault();
    }

    // Pause animations when tab hidden
    function onVisibility() {
      if (document.hidden) {
        lock.classList.add('is-paused');
      } else {
        lock.classList.remove('is-paused');
      }
    }

    lock.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeydown);
    document.addEventListener('visibilitychange', onVisibility);

    // -- Unlock sequence -----------------------------------------------
    var unlocked = false;
    function unlock() {
      if (unlocked) return;
      unlocked = true;

      // Phase 1 (0ms): start exit animations
      lock.classList.add('is-unlocking');

      // Phase 2 (~150ms): fire custom event so voxel hero + audio start
      // BEFORE the visual gate is gone. This is the dramatic moment —
      // the world wakes up just as the curtain lifts.
      setTimeout(function () {
        try {
          document.dispatchEvent(new CustomEvent('wwh-splash-unlock', {
            bubbles: true,
            cancelable: false
          }));
        } catch (e) { /* old browsers */ }

        // Fallback: trigger the listen toggle if present.
        var toggle = document.querySelector('.wwh-listen-toggle');
        if (toggle && !toggle.classList.contains('is-playing')) {
          try { toggle.click(); } catch (e) {}
        }
      }, 150);

      // Phase 3 (~900ms): backdrop has fully dissolved; restore scroll
      setTimeout(function () {
        document.body.classList.remove('is-splash-locked');
      }, 900);

      // Phase 4 (~1100ms): tear down
      setTimeout(function () {
        // Move focus to main content if available
        var target = document.getElementById('wwh-hero-content') ||
                     document.querySelector('main') ||
                     document.querySelector('#main') ||
                     document.querySelector('header');
        if (target && typeof target.focus === 'function') {
          if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
          try { target.focus({ preventScroll: true }); } catch (e) { target.focus(); }
        } else if (lastFocus && typeof lastFocus.focus === 'function') {
          try { lastFocus.focus({ preventScroll: true }); } catch (e) {}
        }
        teardown();
      }, 1100);
    }

    function teardown() {
      lock.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeydown);
      document.removeEventListener('visibilitychange', onVisibility);
      if (lock.parentNode) lock.parentNode.removeChild(lock);
      // Keep injected styles in the document — they're tiny and a second
      // mount (unlikely) would be no-op.
    }

    // Safety: if for any reason the page is hidden/unloaded mid-lock,
    // restore scroll so the user isn't stuck on reload.
    window.addEventListener('pagehide', function () {
      document.body.classList.remove('is-splash-locked');
    }, { once: true });
  }

  // ====================================================================
  // BUILDERS
  // ====================================================================

  function buildLock(prefersReduced) {
    var lock = document.createElement('div');
    lock.className = 'wwh-splash-lock';
    if (prefersReduced) lock.classList.add('is-reduced');
    lock.setAttribute('role', 'dialog');
    lock.setAttribute('aria-modal', 'true');
    lock.setAttribute('aria-labelledby', 'wwh-splash-lock-title');
    lock.setAttribute('aria-describedby', 'wwh-splash-lock-desc');

    lock.innerHTML =
      // -- Backdrop stack (4 layers + dither) --
      '<div class="wwh-splash-lock-bg" aria-hidden="true">' +
        '<div class="wwh-splash-lock-bg-base"></div>' +
        '<div class="wwh-splash-lock-bg-honey"></div>' +
        '<div class="wwh-splash-lock-bg-savanna"></div>' +
        '<div class="wwh-splash-lock-bg-dither"></div>' +
      '</div>' +
      // -- Large semi-translucent kangaroo silhouette --
      '<div class="wwh-splash-lock-roo" aria-hidden="true">' + kangarooSilhouetteSVG() + '</div>' +
      // -- Top-left script wordmark --
      '<div class="wwh-splash-lock-mark" aria-hidden="true">WildWooHoo</div>' +
      // -- Centred narrative copy --
      '<div class="wwh-splash-lock-stage">' +
        '<div class="wwh-splash-lock-mascot" aria-hidden="true">' + pixelKangarooSVG(24) + '</div>' +
        '<h1 id="wwh-splash-lock-title" class="wwh-splash-lock-copy">' +
          '<span class="wwh-splash-lock-line">In a world that&#39;s constantly</span>' +
          '<span class="wwh-splash-lock-line wwh-splash-lock-line-2">' +
            '<span class="wwh-splash-lock-underlined">' +
              'evolving,' +
              '<svg class="wwh-splash-lock-underline" viewBox="0 0 220 14" aria-hidden="true">' +
                '<path d="M3 8 C 40 2, 80 12, 120 6 S 200 4, 217 9" ' +
                  'fill="none" stroke="#27A05B" stroke-width="1.5" ' +
                  'stroke-linecap="round" pathLength="100"></path>' +
              '</svg>' +
            '</span>' +
          '</span>' +
        '</h1>' +
        '<p id="wwh-splash-lock-desc" class="wwh-splash-lock-byline">What we evolved for</p>' +
      '</div>' +
      // -- Bottom-right CTA pill --
      '<button type="button" class="wwh-splash-lock-cta" aria-label="Press to begin — unlock the page">' +
        '<span class="wwh-splash-lock-cta-roo" aria-hidden="true">' + pixelKangarooSVG(16) + '</span>' +
        '<span class="wwh-splash-lock-cta-label">Press to begin</span>' +
      '</button>';

    return lock;
  }

  // -- Large kangaroo silhouette (single SVG path, side-profile) ---------
  // Coordinates hand-tuned to read as kangaroo: small upright head, two
  // pointed ears, slender neck, oval body, heavy back legs (kangaroo
  // signature), thick tapered tail trailing low, small forearms tucked
  // in. Filled with a lavender→savanna linearGradient. Slight blur for
  // crystalline iridescence. Drifts on the y-axis slowly.
  function kangarooSilhouetteSVG() {
    // viewBox is 600 wide × 900 tall — tall portrait, mirrors the
    // "kangaroo standing" proportions. Path is one continuous outline.
    return '' +
      '<svg viewBox="0 0 600 900" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">' +
        '<defs>' +
          '<linearGradient id="wwhRooGrad" x1="0%" y1="0%" x2="100%" y2="100%">' +
            '<stop offset="0%" stop-color="rgba(151,133,168,0.55)"/>' +
            '<stop offset="55%" stop-color="rgba(125,110,146,0.45)"/>' +
            '<stop offset="100%" stop-color="rgba(39,160,91,0.45)"/>' +
          '</linearGradient>' +
          '<filter id="wwhRooBlur" x="-5%" y="-5%" width="110%" height="110%">' +
            '<feGaussianBlur stdDeviation="0.5"/>' +
          '</filter>' +
        '</defs>' +
        // Side-profile kangaroo. Single continuous path.
        // Start at top of forward ear, go around clockwise.
        '<path filter="url(#wwhRooBlur)" fill="url(#wwhRooGrad)" d="' +
          // Forward ear (longer, pointed)
          'M 230 70 ' +
          'C 232 50, 240 38, 248 35 ' +
          'C 256 40, 260 55, 262 80 ' +
          // Back ear (slightly behind, peeking)
          'L 268 80 ' +
          'C 270 55, 278 42, 286 38 ' +
          'C 294 42, 298 56, 300 82 ' +
          // Top of head, slope down to muzzle
          'C 300 95, 308 100, 318 115 ' +
          // Muzzle (slight downward point)
          'C 326 128, 332 142, 330 152 ' +
          'C 326 158, 318 160, 308 158 ' +
          // Chin curve back up
          'C 298 156, 290 152, 282 148 ' +
          // Throat / front of neck
          'C 276 158, 268 175, 262 198 ' +
          // Chest down to forearm area
          'C 258 218, 256 240, 254 262 ' +
          // Forearm tucked up (small kangaroo arms)
          'C 252 268, 246 272, 240 272 ' +
          'C 234 274, 228 278, 224 286 ' +
          'C 218 296, 214 304, 210 312 ' +
          // Continue arm/hand pulled close to chest
          'C 208 318, 212 322, 218 322 ' +
          'C 224 320, 230 318, 236 316 ' +
          // Underbelly forward curve
          'C 252 320, 268 326, 280 340 ' +
          // Down through pouch area to thigh top
          'C 286 360, 288 384, 286 410 ' +
          // Front of thigh bulge
          'C 284 440, 282 470, 280 500 ' +
          // Down into shin / ankle (kangaroo lower leg bends)
          'C 282 530, 286 560, 296 585 ' +
          // Front of foot (long kangaroo foot)
          'C 308 605, 326 622, 348 632 ' +
          // Tip of toe forward
          'C 360 638, 374 640, 386 638 ' +
          // Underfoot, back along the sole (long flat foot)
          'C 398 638, 412 640, 426 644 ' +
          // Bottom-back of foot (heel)
          'C 432 648, 432 654, 428 658 ' +
          'C 418 662, 402 662, 388 660 ' +
          // Curve up the back of the heel onto the lower leg
          'C 376 656, 366 650, 358 642 ' +
          // Back of shin
          'C 352 650, 352 666, 356 686 ' +
          // Continue down the back of the leg toward tail base
          'C 360 706, 366 724, 374 740 ' +
          // Inside of tail base (where tail meets body)
          'C 384 750, 396 758, 410 762 ' +
          // Tail extending back (thick, kangaroo-signature)
          'C 442 770, 478 782, 510 798 ' +
          // Tail tip (tapered)
          'C 528 808, 542 818, 552 826 ' +
          'C 556 832, 552 838, 544 838 ' +
          'C 528 836, 510 830, 490 822 ' +
          // Back along underside of tail
          'C 460 812, 430 800, 404 790 ' +
          // Hips / lower back curve up
          'C 388 786, 374 780, 362 770 ' +
          // Up the back, broad shoulders
          'C 348 750, 338 720, 332 686 ' +
          'C 326 650, 322 612, 320 572 ' +
          // Top of back / spine
          'C 318 530, 318 488, 320 446 ' +
          'C 320 410, 318 374, 314 340 ' +
          // Neck/back to behind ear (close the path)
          'C 308 300, 296 260, 284 220 ' +
          'C 274 188, 264 152, 252 118 ' +
          'C 246 98, 240 82, 230 70 ' +
          'Z' +
        '"/>' +
      '</svg>';
  }

  // -- Pixel-art kangaroo mascot ----------------------------------------
  // 12x12 grid of <rect>s. Each row encoded as a bitmask. Reads as
  // upright kangaroo: head + ear top-left, body + small forelimbs middle,
  // bent back leg + tail bottom-right. Size param scales the cell size.
  // Bit columns 0..11 (col 0 = left).
  function pixelKangarooSVG(sizePx) {
    var size = sizePx || 24;
    var cell = size / 12;
    // 12 rows, each is a 12-char string of '1' (filled) or '0' (empty).
    // Crafted by hand to read as a side-profile hopping kangaroo.
    var rows = [
      '000010000000', // row 0  — top of ear
      '000011000000', // row 1  — ear
      '000011000000', // row 2  — ear base
      '000011100000', // row 3  — head top
      '000011110000', // row 4  — head + muzzle
      '000011110000', // row 5  — head/neck
      '000111100000', // row 6  — neck/shoulders
      '001111110000', // row 7  — chest + body + tiny arms
      '011111111000', // row 8  — body + tail base
      '011110111100', // row 9  — belly + back leg start + tail mid
      '011100011110', // row 10 — back leg bent + tail tip
      '111100011110'  // row 11 — foot + tail tip
    ];
    var rects = '';
    for (var r = 0; r < 12; r++) {
      for (var c = 0; c < 12; c++) {
        if (rows[r].charAt(c) === '1') {
          rects += '<rect x="' + (c * cell).toFixed(3) + '" y="' + (r * cell).toFixed(3) +
                   '" width="' + cell.toFixed(3) + '" height="' + cell.toFixed(3) + '"/>';
        }
      }
    }
    return '<svg viewBox="0 0 ' + size + ' ' + size + '" width="' + size + '" height="' + size +
           '" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges">' +
           '<g fill="currentColor">' + rects + '</g></svg>';
  }

  // ====================================================================
  // STYLES
  // ====================================================================

  function injectStyles() {
    if (document.getElementById('wwh-splash-lock-styles')) return;
    var css = [
      // -- Body lock --
      'body.is-splash-locked{overflow:hidden!important;}',
      'body.is-splash-locked .wwh-listen-toggle{display:none!important;}',
      // -- Root overlay --
      '.wwh-splash-lock{',
        'position:fixed;inset:0;z-index:9998;',
        'display:block;overflow:hidden;',
        'isolation:isolate;',
        'font-family:"Instrument Serif",Georgia,serif;',
        'color:#0A1F14;',
        '-webkit-font-smoothing:antialiased;',
        'cursor:pointer;',
        'animation:wwh-splash-lock-in 600ms ease-out both;',
      '}',
      '@keyframes wwh-splash-lock-in{',
        'from{opacity:0;}to{opacity:1;}',
      '}',
      // -- Backdrop stack --
      '.wwh-splash-lock-bg{position:absolute;inset:0;overflow:hidden;will-change:opacity,filter;transition:opacity 900ms ease, filter 900ms ease;}',
      '.wwh-splash-lock-bg-base{',
        'position:absolute;inset:-10%;',
        // Green-leaning pastel gradient (savanna -> lavender accent)
        'background:linear-gradient(135deg,',
          '#D4ECDB 0%,',          // pale savanna mint top-left
          '#E4EED9 22%,',         // green-cream
          '#F2EDDD 48%,',         // cream centre
          '#EFE3E9 72%,',         // pale lavender-pink
          '#DDD5E4 100%);',       // lavender bottom-right
        'animation:wwh-splash-lock-hue 24s ease-in-out infinite;',
        'transform-origin:center;',
      '}',
      // Slow hue rotate ±6deg
      '@keyframes wwh-splash-lock-hue{',
        '0%,100%{filter:hue-rotate(-6deg) saturate(1.02);}',
        '50%{filter:hue-rotate(6deg) saturate(1.06);}',
      '}',
      // Honey-peach radial top-right (golden hour shimmer)
      '.wwh-splash-lock-bg-honey{',
        'position:absolute;inset:-10%;',
        'background:radial-gradient(ellipse 70% 60% at 78% 18%,',
          'rgba(229,185,109,0.28) 0%,',
          'rgba(229,185,109,0.16) 28%,',
          'rgba(229,185,109,0) 62%);',
        'mix-blend-mode:soft-light;',
        'animation:wwh-splash-lock-drift-honey 28s ease-in-out infinite;',
      '}',
      '@keyframes wwh-splash-lock-drift-honey{',
        '0%,100%{transform:translate(0,0) scale(1);}',
        '50%{transform:translate(-2%,2%) scale(1.04);}',
      '}',
      // Savanna-green radial centre-left (kangaroo aura)
      '.wwh-splash-lock-bg-savanna{',
        'position:absolute;inset:-10%;',
        'background:radial-gradient(ellipse 60% 70% at 30% 55%,',
          'rgba(39,160,91,0.36) 0%,',
          'rgba(39,160,91,0.20) 32%,',
          'rgba(39,160,91,0) 68%);',
        'mix-blend-mode:soft-light;',
        'animation:wwh-splash-lock-drift-savanna 22s ease-in-out infinite;',
      '}',
      '@keyframes wwh-splash-lock-drift-savanna{',
        '0%,100%{transform:translate(0,0) scale(1);}',
        '50%{transform:translate(2%,-2%) scale(1.05);}',
      '}',
      // Dither texture overlay (SVG feTurbulence as data URI)
      '.wwh-splash-lock-bg-dither{',
        'position:absolute;inset:0;',
        'opacity:0.06;',
        'mix-blend-mode:overlay;',
        'pointer-events:none;',
        'background-image:url("data:image/svg+xml;utf8,' +
          '<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'220\' height=\'220\'>' +
          '<filter id=\'n\'><feTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'2\' seed=\'5\'/></filter>' +
          '<rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\' opacity=\'0.9\'/></svg>");',
        'background-size:220px 220px;',
      '}',
      // -- Large kangaroo silhouette --
      '.wwh-splash-lock-roo{',
        'position:absolute;',
        'left:-4%;top:50%;',
        'width:46vw;max-width:620px;height:auto;',
        'transform:translateY(-50%);',
        'opacity:0.95;',
        'pointer-events:none;',
        'will-change:transform;',
        'animation:wwh-splash-lock-roo-drift 12s ease-in-out infinite;',
        'filter:drop-shadow(0 18px 40px rgba(39,160,91,0.18));',
      '}',
      '.wwh-splash-lock-roo svg{display:block;width:100%;height:auto;}',
      '@keyframes wwh-splash-lock-roo-drift{',
        '0%,100%{transform:translate(0,calc(-50% - 8px));}',
        '50%{transform:translate(0,calc(-50% + 8px));}',
      '}',
      // -- Top-left script wordmark --
      '.wwh-splash-lock-mark{',
        'position:absolute;top:24px;left:24px;',
        'font-family:"Caveat","Instrument Serif",cursive;',
        'font-style:italic;',
        'font-size:18px;',
        'font-weight:600;',
        'color:#0A1F14;',
        'opacity:0.85;',
        'letter-spacing:0.01em;',
        'pointer-events:none;',
        'user-select:none;',
      '}',
      // -- Centred stage --
      '.wwh-splash-lock-stage{',
        'position:absolute;inset:0;',
        'display:flex;flex-direction:column;',
        'align-items:center;justify-content:center;',
        'text-align:center;',
        'padding:24px;',
        'pointer-events:none;',
        'transition:opacity 500ms ease, transform 500ms ease;',
      '}',
      // Pixel mascot floats above the copy
      '.wwh-splash-lock-mascot{',
        'color:#0A1F14;',
        'opacity:0.85;',
        'margin-bottom:24px;',
        'transform:translateX(60px);', // offset right of centre
        'animation:wwh-splash-lock-mascot-drift 3s ease-in-out infinite;',
        'pointer-events:auto;',
        'cursor:pointer;',
        'transition:transform 250ms ease;',
      '}',
      '@keyframes wwh-splash-lock-mascot-drift{',
        '0%,100%{transform:translate(60px,-4px);}',
        '50%{transform:translate(60px,4px);}',
      '}',
      '@media (pointer:fine){',
        '.wwh-splash-lock-mascot:hover{animation:wwh-splash-lock-mascot-bounce 250ms ease;}',
      '}',
      '@keyframes wwh-splash-lock-mascot-bounce{',
        '0%{transform:translate(60px,0) scale(1);}',
        '50%{transform:translate(60px,-6px) scale(1.15);}',
        '100%{transform:translate(60px,0) scale(1);}',
      '}',
      // -- Copy --
      '.wwh-splash-lock-copy{',
        'margin:0;',
        'font-family:"Instrument Serif",Georgia,serif;',
        'font-style:italic;',
        'font-weight:400;',
        'font-size:clamp(36px,4vw,60px);',
        'line-height:1.15;',
        'letter-spacing:-0.01em;',
        'color:#0A1F14;',
        'max-width:920px;',
      '}',
      '.wwh-splash-lock-line{display:block;}',
      '.wwh-splash-lock-line-2{margin-top:0.1em;}',
      '.wwh-splash-lock-underlined{position:relative;display:inline-block;padding-bottom:0.18em;}',
      '.wwh-splash-lock-underline{',
        'position:absolute;left:0;right:0;bottom:0;',
        'width:100%;height:0.4em;',
        'overflow:visible;',
        'pointer-events:none;',
      '}',
      '.wwh-splash-lock-underline path{',
        'stroke-dasharray:100;',
        'stroke-dashoffset:100;',
        'animation:wwh-splash-lock-underline-draw 1.2s ease-out 600ms forwards;',
      '}',
      '@keyframes wwh-splash-lock-underline-draw{',
        'to{stroke-dashoffset:0;}',
      '}',
      // Byline
      '.wwh-splash-lock-byline{',
        'margin:80px 0 0 0;',
        'font-family:"Instrument Serif",Georgia,serif;',
        'font-style:italic;',
        'font-weight:400;',
        'font-size:clamp(20px,1.5vw,28px);',
        'color:#0A1F14;',
        'opacity:0.7;',
        'letter-spacing:0.005em;',
      '}',
      // -- CTA pill --
      '.wwh-splash-lock-cta{',
        'position:absolute;right:24px;bottom:24px;',
        'display:inline-flex;align-items:center;gap:10px;',
        'padding:14px 24px 14px 20px;',
        'border:0;border-radius:999px;',
        'background:rgba(10,31,20,0.85);',
        'color:#FBF7EE;',
        'font-family:"Inter",system-ui,sans-serif;',
        'font-weight:600;font-size:14px;',
        'letter-spacing:0.04em;',
        'cursor:pointer;',
        '-webkit-appearance:none;appearance:none;',
        'backdrop-filter:blur(8px);',
        '-webkit-backdrop-filter:blur(8px);',
        'box-shadow:0 4px 18px rgba(10,31,20,0.18);',
        'animation:wwh-splash-lock-cta-pulse 2s ease-in-out infinite;',
        'transition:background 200ms ease, color 200ms ease, transform 150ms ease, box-shadow 200ms ease;',
        'pointer-events:auto;',
      '}',
      '@keyframes wwh-splash-lock-cta-pulse{',
        '0%,100%{box-shadow:0 4px 18px rgba(10,31,20,0.18),0 0 0 0 rgba(39,160,91,0.35);}',
        '50%{box-shadow:0 4px 22px rgba(10,31,20,0.22),0 0 0 14px rgba(39,160,91,0);}',
      '}',
      '.wwh-splash-lock-cta-roo{display:inline-flex;color:#FBF7EE;}',
      '.wwh-splash-lock-cta-roo svg{display:block;}',
      '.wwh-splash-lock-cta-label{display:inline-block;}',
      '@media (pointer:fine){',
        '.wwh-splash-lock-cta:hover{',
          'background:#27A05B;',
          'color:#FBF7EE;',
          'box-shadow:0 6px 24px rgba(39,160,91,0.55);',
        '}',
        '.wwh-splash-lock-cta:hover .wwh-splash-lock-cta-roo{color:#FBF7EE;}',
      '}',
      '.wwh-splash-lock-cta:focus-visible{',
        'outline:2px solid #27A05B;',
        'outline-offset:3px;',
      '}',
      '.wwh-splash-lock-cta:active{transform:translateY(1px);}',
      // -- Unlock animation states --
      '.wwh-splash-lock.is-unlocking{cursor:default;}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-bg{opacity:0;filter:blur(30px);}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-roo{opacity:0;transform:translate(0,-50%) scale(1.04);transition:opacity 700ms ease, transform 900ms ease;}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-stage{opacity:0;transform:translateY(-8px);}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-mark{opacity:0;transition:opacity 400ms ease;}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-cta{opacity:0;transform:translateY(8px);transition:opacity 400ms ease, transform 400ms ease;animation:none;}',
      '.wwh-splash-lock.is-unlocking .wwh-splash-lock-mascot{',
        'animation:wwh-splash-lock-mascot-burst 250ms ease-out forwards;',
      '}',
      '@keyframes wwh-splash-lock-mascot-burst{',
        '0%{transform:translate(60px,0) scale(1) rotate(0);opacity:0.85;}',
        '100%{transform:translate(60px,-12px) scale(1.5) rotate(20deg);opacity:0;}',
      '}',
      // -- Tab hidden: pause animations --
      '.wwh-splash-lock.is-paused *{animation-play-state:paused!important;}',
      // -- Mobile --
      '@media (max-width:760px){',
        '.wwh-splash-lock-roo{width:52vw;left:-12%;opacity:0.85;}',
        '.wwh-splash-lock-copy{font-size:clamp(28px,8vw,36px);}',
        '.wwh-splash-lock-byline{margin-top:48px;font-size:clamp(16px,3.5vw,20px);}',
        '.wwh-splash-lock-mark{font-size:15px;top:18px;left:18px;}',
        '.wwh-splash-lock-cta{right:16px;bottom:16px;padding:12px 18px 12px 14px;font-size:13px;}',
        '.wwh-splash-lock-mascot{transform:translateX(32px);margin-bottom:16px;}',
        '@keyframes wwh-splash-lock-mascot-drift{',
          '0%,100%{transform:translate(32px,-4px);}',
          '50%{transform:translate(32px,4px);}',
        '}',
      '}',
      // -- Very small screens --
      '@media (max-width:420px){',
        '.wwh-splash-lock-cta-label{display:none;}',
        '.wwh-splash-lock-cta{padding:12px;}',
      '}',
      // -- Reduced motion --
      '@media (prefers-reduced-motion: reduce){',
        '.wwh-splash-lock,',
        '.wwh-splash-lock-bg-base,',
        '.wwh-splash-lock-bg-honey,',
        '.wwh-splash-lock-bg-savanna,',
        '.wwh-splash-lock-roo,',
        '.wwh-splash-lock-mascot,',
        '.wwh-splash-lock-cta{animation:none!important;}',
        '.wwh-splash-lock-underline path{stroke-dashoffset:0!important;animation:none!important;}',
        '.wwh-splash-lock-bg{transition:opacity 400ms ease!important;}',
        '.wwh-splash-lock.is-unlocking .wwh-splash-lock-bg{filter:none;}',
        '.wwh-splash-lock.is-unlocking .wwh-splash-lock-mascot{animation:none!important;opacity:0;transition:opacity 250ms ease;}',
      '}',
      // Class-based reduced (set on lock if matchMedia matched at boot)
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-bg-base,',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-bg-honey,',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-bg-savanna,',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-roo,',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-mascot,',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-cta{animation:none!important;}',
      '.wwh-splash-lock.is-reduced .wwh-splash-lock-underline path{stroke-dashoffset:0!important;animation:none!important;}'
    ].join('');

    var style = document.createElement('style');
    style.id = 'wwh-splash-lock-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }
})();
