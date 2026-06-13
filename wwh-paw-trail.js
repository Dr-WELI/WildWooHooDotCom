/* wwh-paw-trail.js - WildWooHoo Aesthetic v2 signature interaction
   ------------------------------------------------------------------
   A kangaroo paw print trail that follows the cursor on opt-in pages.
   Activates only when `body.aesthetic-v2` is present; silent no-op otherwise.

   References (per WELI directive 2026-06-04):
     - Robert Borghesi neon-pixel-hand piece: https://www.awwwards.com/sites/astrodither
     - @dghez_LAB cursor experiments (Three.js / WebGL grade visual quality,
       achieved here in pure Canvas 2D for GitHub Pages shippability)

   Constraints honoured:
     - Pointer-fine only (no-op on coarse pointers / touch)
     - Reduced-motion respected
     - rAF-driven, pauses on visibilitychange
     - DevicePixelRatio aware, resize-resilient
     - pointer-events:none on overlay (never blocks clicks)
     - Brand kit boundary: paws never overlap logo/wordmark/monogram regions
     - Pure vanilla JS, no third-party libraries

   Brand spectrum (sacred 8-stop, see brand-kit/README.md §7):
     red → peach → honey → savanna → amber → sage → lavender → violet
*/

(function () {
  'use strict';

  /* ---------- 0. Gates ---------------------------------------- */
  // Opt-in gate: only run on v2 pages
  if (!document.body || !document.body.classList.contains('aesthetic-v2')) {
    // Watch in case body class is added later (some setups inject classes
    // post-DOMContentLoaded). One-shot observer; auto-disconnects on match.
    // 2026-06-12: also auto-disconnects after 10s - it used to stay
    // attached for the life of the page, firing on every unrelated body
    // class flip (is-music-playing, menu open/close, is-page-hidden).
    if (typeof MutationObserver === 'function' && document.body) {
      var bodyObs = new MutationObserver(function () {
        if (document.body.classList.contains('aesthetic-v2')) {
          bodyObs.disconnect();
          start();
        }
      });
      bodyObs.observe(document.body, { attributes: true, attributeFilter: ['class'] });
      window.setTimeout(function () { bodyObs.disconnect(); }, 10000);
    }
    return;
  }
  start();

  function start() {
    // Reduced motion: silent no-op
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Coarse pointer (touch): silent no-op
    if (window.matchMedia && window.matchMedia('(pointer:coarse)').matches) return;
    // Defensive: confirm hover capable
    if (window.matchMedia && !window.matchMedia('(hover:hover)').matches) return;

    /* ---------- 1. Brand spectrum (sacred 8-stop) -------------- */
    var SPECTRUM = [
      '#C97A66', // red
      '#D89E78', // peach
      '#E5B96D', // honey
      '#27A05B', // savanna
      '#B07F30', // amber
      '#B59B6D', // sage
      '#9985A8', // lavender
      '#7D6E92'  // violet
    ];

    /* ---------- 2. Tunables ----------------------------------- */
    var SAMPLE_MS = 90;            // ~80-120ms sample window
    var SAMPLE_PX = 22;            // or every ~20px of movement, whichever first
    var LIFE_MS = 2000;            // 1.8-2.2s fade
    var BASE_SIZE = 30;            // base paw width in px (heel pad width)
    var MIN_SIZE_FACTOR = 0.75;    // velocity → scale (slow)
    var MAX_SIZE_FACTOR = 1.45;    // velocity → scale (fast)
    var ROT_JITTER_DEG = 15;       // ±15° per paw
    var CLICK_COOLDOWN_MS = 400;   // burst cooldown
    var TRAIL_DOT_OPACITY = 0.15;  // connecting dotted path opacity
    var BLOOM_BLUR = 18;           // shadowBlur base

    // Selectors of sacred regions we must NEVER paw on
    var SACRED_SELECTORS = [
      '.wwh-wordmark',
      '.wwh-mono',
      '.wwh-splash-logo'
    ].join(',');

    /* ---------- 3. Canvas overlay ----------------------------- */
    var canvas = document.createElement('canvas');
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = [
      'position:fixed',
      'left:0', 'top:0',
      'width:100vw', 'height:100vh',
      'pointer-events:none',
      'z-index:9992',                    // above content, below modals (9995+)
      'mix-blend-mode:screen'            // bright on dark, organic on cream
    ].join(';');
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    /* 2026-06-12: guard - getContext can return null (blocked canvas,
       exhausted contexts). Remove the overlay and no-op instead of
       throwing on the first draw call. */
    if (!ctx) {
      if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      return;
    }

    var dpr = Math.max(1, window.devicePixelRatio || 1);
    var W = 0, H = 0;
    function sizeCanvas() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      // Reset transform & scale to DPR so we can draw in CSS pixels.
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    sizeCanvas();
    window.addEventListener('resize', sizeCanvas, { passive: true });

    /* ---------- 4. State -------------------------------------- */
    var paws = [];           // active paws
    var colorIdx = 0;        // spectrum cycle pointer
    var sideIdx = 0;         // L/R alternation
    var lastSampleT = 0;
    var lastSampleX = -9999, lastSampleY = -9999;
    var lastMouseT = performance.now();
    var lastMouseX = 0, lastMouseY = 0;
    var curMouseX = 0, curMouseY = 0;
    var velocity = 0;        // smoothed px/ms
    var visible = !document.hidden;
    var lastClickT = 0;
    var hovering = false;    // any mouse seen yet

    /* ---------- 5. Sacred region detection -------------------- */
    // Cache sacred regions on resize / scroll for cheap hit-tests.
    var sacredRects = [];
    function refreshSacred() {
      sacredRects = [];
      try {
        document.querySelectorAll(SACRED_SELECTORS).forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.width > 0 && r.height > 0) {
            // Inflate a touch so paws don't kiss the logo edges
            sacredRects.push({
              x: r.left - 6, y: r.top - 6,
              x2: r.right + 6, y2: r.bottom + 6
            });
          }
        });
      } catch (e) { /* selector errors are fatal-silently OK */ }
    }
    refreshSacred();
    window.addEventListener('resize', refreshSacred, { passive: true });
    window.addEventListener('scroll', refreshSacred, { passive: true });
    // Re-check after fonts / late content mounts.
    setTimeout(refreshSacred, 800);
    setTimeout(refreshSacred, 2500);

    function inSacred(x, y) {
      for (var i = 0; i < sacredRects.length; i++) {
        var r = sacredRects[i];
        if (x >= r.x && x <= r.x2 && y >= r.y && y <= r.y2) return true;
      }
      return false;
    }

    /* ---------- 6. Audio-amp hook (bonus) --------------------- */
    function readAudioAmp() {
      try {
        var v = getComputedStyle(document.documentElement).getPropertyValue('--audio-amp');
        if (!v) return 1.0;
        var n = parseFloat(v);
        if (isNaN(n) || n <= 0) return 1.0;
        // Clamp so a runaway analyser can't blow up sizes.
        return Math.max(0.5, Math.min(2.5, n));
      } catch (e) { return 1.0; }
    }

    /* ---------- 7. Pointer tracking --------------------------- */
    document.addEventListener('mousemove', function (e) {
      var t = performance.now();
      var dt = Math.max(1, t - lastMouseT);
      var dx = e.clientX - lastMouseX;
      var dy = e.clientY - lastMouseY;
      var v = Math.sqrt(dx * dx + dy * dy) / dt; // px/ms
      // Smooth velocity (EMA)
      velocity = velocity * 0.7 + v * 0.3;
      lastMouseT = t; lastMouseX = e.clientX; lastMouseY = e.clientY;
      curMouseX = e.clientX; curMouseY = e.clientY;
      hovering = true;
      maybeSample(t);
    }, { passive: true });

    document.addEventListener('mouseleave', function () { hovering = false; });

    document.addEventListener('click', function (e) {
      var t = performance.now();
      if (t - lastClickT < CLICK_COOLDOWN_MS) return;
      if (inSacred(e.clientX, e.clientY)) return;
      lastClickT = t;
      spawnBurst(e.clientX, e.clientY, t);
    });

    document.addEventListener('visibilitychange', function () {
      visible = !document.hidden;
      // When tab returns, reset velocity timer so we don't spike.
      if (visible) {
        lastMouseT = performance.now();
        velocity = 0;
      }
    });

    /* ---------- 8. Sampling + paw spawn ----------------------- */
    function maybeSample(t) {
      var movedPx = Math.hypot(curMouseX - lastSampleX, curMouseY - lastSampleY);
      var dueByTime = (t - lastSampleT) >= SAMPLE_MS && movedPx > 4;
      var dueByPx = movedPx >= SAMPLE_PX;
      if (!dueByTime && !dueByPx) return;
      if (inSacred(curMouseX, curMouseY)) {
        // Update tracking so we don't spawn a giant catch-up when leaving the sacred zone
        lastSampleT = t;
        lastSampleX = curMouseX; lastSampleY = curMouseY;
        return;
      }
      spawnPaw(curMouseX, curMouseY, t, false);
      lastSampleT = t;
      lastSampleX = curMouseX; lastSampleY = curMouseY;
    }

    function spawnPaw(x, y, t, isBurst) {
      var amp = readAudioAmp();
      // Velocity → size factor (clamped). px/ms typical range ~0.05 (slow) to ~3 (very fast).
      var vNorm = Math.min(1, velocity / 1.8);
      var sizeFactor = MIN_SIZE_FACTOR + (MAX_SIZE_FACTOR - MIN_SIZE_FACTOR) * vNorm;
      var size = BASE_SIZE * sizeFactor * amp;
      var rot = (Math.random() - 0.5) * 2 * (ROT_JITTER_DEG * Math.PI / 180);
      // Tilt the paw a bit toward the direction of travel, so the trail reads as steps.
      if (!isBurst && velocity > 0.05) {
        var travelAngle = Math.atan2(curMouseY - lastSampleY, curMouseX - lastSampleX);
        // Paw "points" up by default in our path; orient so up = travel direction.
        rot += travelAngle - Math.PI / 2;
      }
      var color = SPECTRUM[colorIdx % SPECTRUM.length];
      colorIdx++;
      var side = (sideIdx++ % 2 === 0) ? 'L' : 'R';
      paws.push({
        x: x, y: y,
        size: size,
        rot: rot,
        color: color,
        side: side,
        born: t,
        life: LIFE_MS * (0.9 + Math.random() * 0.2), // 1.8-2.2s
        amp: amp
      });
    }

    function spawnBurst(x, y, t) {
      // Center paw (bigger), then 6 smaller paws fanning out.
      var centerSize = BASE_SIZE * 1.25 * readAudioAmp();
      paws.push({
        x: x, y: y,
        size: centerSize,
        rot: (Math.random() - 0.5) * 0.4,
        color: SPECTRUM[colorIdx++ % SPECTRUM.length],
        side: 'L',
        born: t,
        life: LIFE_MS * 1.1,
        amp: readAudioAmp(),
        burst: true
      });
      var FAN = 6;
      var spread = Math.PI * 2;
      var radius = 42;
      for (var i = 0; i < FAN; i++) {
        var a = (i / FAN) * spread + (Math.random() - 0.5) * 0.25;
        var dx = Math.cos(a) * radius;
        var dy = Math.sin(a) * radius;
        paws.push({
          x: x + dx, y: y + dy,
          size: BASE_SIZE * (0.55 + Math.random() * 0.2),
          rot: a + Math.PI / 2,
          color: SPECTRUM[(colorIdx + i) % SPECTRUM.length],
          side: (i % 2 === 0) ? 'L' : 'R',
          born: t,
          life: LIFE_MS * 0.85,
          amp: readAudioAmp(),
          burst: true,
          // Tiny outward drift for the burst paws
          vx: dx * 0.0008,
          vy: dy * 0.0008
        });
      }
      colorIdx += FAN;
    }

    /* ---------- 9. Paw silhouette path ------------------------ */
    // Draws into the current ctx, centred at (0,0), oriented "up".
    // The path: long heel oval below + 3 toe pads above (middle toe elongated forward).
    // `side` = 'L' or 'R' - outer toes tilt slightly to match left/right paws.
    // `size` is the heel pad width in CSS px; total height ~2.1x size.
    function drawPawPath(s, side) {
      var heelW = s * 0.5;
      var heelH = s * 0.9;
      var heelCY = s * 0.35;   // heel centred below origin

      // Heel pad - elongated oval
      ctx.beginPath();
      ctx.ellipse(0, heelCY, heelW, heelH, 0, 0, Math.PI * 2);
      ctx.fill();

      // Toe pads (3): middle large + elongated forward, two outer smaller and angled.
      var toeR = s * 0.22;
      var toeYMid = -s * 0.55;
      var toeYSide = -s * 0.30;
      var toeXSide = s * 0.42;
      var sideTilt = side === 'L' ? -0.35 : 0.35; // radians, outer-toes splay

      // Middle toe - taller oval pointing forward
      ctx.beginPath();
      ctx.ellipse(0, toeYMid, toeR * 0.85, toeR * 1.3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Left outer toe
      ctx.beginPath();
      ctx.ellipse(-toeXSide, toeYSide, toeR * 0.7, toeR * 1.05, -sideTilt, 0, Math.PI * 2);
      ctx.fill();

      // Right outer toe
      ctx.beginPath();
      ctx.ellipse(toeXSide, toeYSide, toeR * 0.7, toeR * 1.05, sideTilt, 0, Math.PI * 2);
      ctx.fill();

      // Tiny dewclaw nub on the heel-toe junction, side-dependent (kangaroo-ish)
      var dewX = side === 'L' ? -s * 0.18 : s * 0.18;
      ctx.beginPath();
      ctx.ellipse(dewX, -s * 0.05, toeR * 0.32, toeR * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    /* ---------- 10. Render loop ------------------------------- */
    var lastFrameT = performance.now();
    var FRAME_MIN_MS = 1000 / 62; // throttle ceiling ~60fps with slack

    function frame(now) {
      requestAnimationFrame(frame);
      if (!visible) return;
      if (now - lastFrameT < FRAME_MIN_MS) return;
      lastFrameT = now;

      // Clear (DPR-aware: ctx is already scaled, so clear by CSS pixels)
      ctx.clearRect(0, 0, W, H);

      // Update burst paws' tiny drift
      for (var i = 0; i < paws.length; i++) {
        var p = paws[i];
        if (p.vx) { p.x += p.vx * 16; p.y += p.vy * 16; }
      }

      // Trail decoration: connecting dotted path between recent paw centres.
      // Only paws still alive, drawn before paws so paws sit on top.
      if (paws.length > 1) {
        ctx.save();
        ctx.globalAlpha = TRAIL_DOT_OPACITY;
        ctx.strokeStyle = '#FBF7EE'; // brand cream
        ctx.lineWidth = 1;
        ctx.setLineDash([1.5, 6]);
        ctx.beginPath();
        var started = false;
        for (var j = 0; j < paws.length; j++) {
          var pp = paws[j];
          var ageJ = now - pp.born;
          var lifeJ = pp.life;
          if (ageJ >= lifeJ) continue;
          // Fade with age along the trail
          if (!started) {
            ctx.moveTo(pp.x, pp.y);
            started = true;
          } else {
            ctx.lineTo(pp.x, pp.y);
          }
        }
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.restore();
      }

      // Draw paws - newest last so they render on top
      var alive = [];
      for (var k = 0; k < paws.length; k++) {
        var paw = paws[k];
        var age = now - paw.born;
        var life = paw.life;
        if (age >= life) continue;
        var t01 = age / life;            // 0 → 1
        var alpha = (1 - t01) * 0.9;     // 0.9 → 0
        var scale = 1 - 0.15 * t01;      // 1.0 → 0.85

        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(paw.x, paw.y);
        ctx.rotate(paw.rot);
        ctx.scale(scale, scale);

        // Glow tinted by paw colour, amp-modulated
        ctx.shadowColor = paw.color;
        ctx.shadowBlur = BLOOM_BLUR * (0.7 + 0.3 * (1 - t01)) * paw.amp;
        ctx.fillStyle = paw.color;

        drawPawPath(paw.size, paw.side);
        ctx.restore();
        alive.push(paw);
      }
      paws = alive;
    }
    requestAnimationFrame(frame);
  }
})();
