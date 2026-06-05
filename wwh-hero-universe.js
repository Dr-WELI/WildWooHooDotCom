/* =============================================================================
   wwh-hero-universe.js — Starfield warp + analog-TV shimmer behind the splash
   showreel. Universe vibe.

   Mounts into .wwh-splash-bg (the existing splash-hero background container).
   Draws a starfield in CANVAS (one-directional warp toward camera — no back-
   and-forth oscillation, per WELI's "car-in-driveway" brief) and lays a CSS
   TV-shimmer overlay (scan-lines + film grain + magenta NO SIGNAL pulse) on
   top of the starfield + below the existing showreel image cards.

   z-index layers inside the splash:
     wwh-splash-bg            (existing)        — the splash background container
       wwh-universe-stars     (new, z 0)        — canvas starfield (deepest)
       wwh-universe-tv        (new, z 1)        — CSS scan-lines + grain
       hero-showreel          (existing, z 2)   — image cards drift across
     wwh-splash-content       (existing, z 3)   — title + tagline button

   Self-init on script load (defer). Cleans up on pagehide.
   ========================================================================== */

(function () {
  "use strict";

  if (typeof window === "undefined" || !window.document) return;

  var CONFIG = {
    starCount:        450,        // deep field; fewer on mobile via halve
    starSpeed:        60,         // base z-velocity (world units / sec)
    starWarpSpeed:    220,        // boost when audio is loud
    starMinZ:         1.0,        // near-clip
    starMaxZ:         600,        // far-clip (stars start here, warp toward us)
    fovScale:         460,        // 2D projection scale factor
    palette: {
      // weighted by frequency in logo-tech quantize
      savanna:   0x437055,
      forest:    0x2F4F3A,
      forestMid: 0x355B42,
      moss:      0x609D77,
      sageBright:0x82BC97,
      sageLight: 0xC5DFC3,
      cyan:      0x5DDFE6,
      yellow:    0xF0E572,
      magenta:   0xDC3CAD
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    var mounts = document.querySelectorAll(".wwh-splash-bg");
    if (!mounts.length) return;
    injectStyles();
    mounts.forEach(function (mount) {
      if (mount.dataset.wwhUniverseMounted === "1") return;
      mount.dataset.wwhUniverseMounted = "1";
      buildScene(mount);
    });
  }

  function injectStyles() {
    if (document.getElementById("wwh-hero-universe-styles")) return;
    var css =
      // WELI 2026-06-05: 'make the galaxy big again covering the whole top
      // part of the page'. Canvas was position:absolute (relative to the
      // splash-bg container) so it only filled the splash. position:fixed
      // mounts it to the viewport, so it covers the FULL top of the page
      // straight under the sticky header (header z-index:100 keeps it on top).
      ".wwh-universe-stars{position:fixed;inset:0;z-index:0;pointer-events:none;" +
        "background:#020204;}" +

      ".wwh-universe-tv{position:fixed;inset:0;z-index:1;pointer-events:none;" +
        "mix-blend-mode:screen;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");" +
        "opacity:0.16;}" +

      ".wwh-universe-scan{position:fixed;inset:0;z-index:2;pointer-events:none;" +
        "background:repeating-linear-gradient(0deg," +
          "transparent 0px,transparent 2px," +
          "rgba(0,0,0,0.32) 3px,transparent 4px);}" +

      ".wwh-universe-tv-magenta{position:fixed;inset:0;z-index:1;pointer-events:none;" +
        "mix-blend-mode:screen;opacity:0.10;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.86  0 0 0 0 0.23  0 0 0 0 0.68  0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");}" +

      ".wwh-universe-nosignal{position:absolute;top:84px;right:22px;z-index:5;" +
        "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;" +
        "letter-spacing:0.22em;color:#DC3CAD;opacity:0.65;text-transform:uppercase;" +
        "text-shadow:0 0 6px rgba(220,60,173,0.35);" +
        "animation:wwh-universe-blink 2.4s steps(2) infinite;pointer-events:none;}" +
      "@keyframes wwh-universe-blink{50%{opacity:0.25;}}" +

      ".wwh-universe-ghost{position:absolute;left:0;right:0;height:54px;top:-54px;" +
        "z-index:3;pointer-events:none;mix-blend-mode:overlay;" +
        "background:linear-gradient(180deg," +
          "rgba(197,223,195,0) 0%,rgba(197,223,195,0.16) 50%,rgba(197,223,195,0) 100%);" +
        "animation:wwh-universe-ghost 9s linear infinite;}" +
      "@keyframes wwh-universe-ghost{" +
        "0%{transform:translateY(0);}100%{transform:translateY(120vh);}}" +

      "@media(prefers-reduced-motion:reduce){" +
        ".wwh-universe-nosignal,.wwh-universe-ghost{animation:none;}}";

    var s = document.createElement("style");
    s.id = "wwh-hero-universe-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildScene(mount) {
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var isMobile = window.innerWidth < 760;
    var starCount = isMobile ? Math.floor(CONFIG.starCount * 0.5) : CONFIG.starCount;

    // Make sure mount is a positioning context (it almost certainly is —
    // CSS already gives .wwh-splash-bg position:absolute).
    var cs = window.getComputedStyle(mount);
    if (cs.position === "static") mount.style.position = "relative";
    mount.style.overflow = "hidden";

    // Layer 0: starfield canvas
    var canvas = document.createElement("canvas");
    canvas.className = "wwh-universe-stars";
    canvas.setAttribute("aria-hidden", "true");
    mount.appendChild(canvas);

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Layer 1: TV shimmer (white noise)
    var tv = document.createElement("div");
    tv.className = "wwh-universe-tv";
    mount.appendChild(tv);

    // Layer 1b: TV shimmer (magenta-tinted)
    var tvMag = document.createElement("div");
    tvMag.className = "wwh-universe-tv-magenta";
    mount.appendChild(tvMag);

    // Layer 2: scan-lines
    var scan = document.createElement("div");
    scan.className = "wwh-universe-scan";
    mount.appendChild(scan);

    // Layer 3: vertical ghost band drifting
    var ghost = document.createElement("div");
    ghost.className = "wwh-universe-ghost";
    mount.appendChild(ghost);

    // Layer 5: NO SIGNAL chip in corner
    var noSig = document.createElement("div");
    noSig.className = "wwh-universe-nosignal";
    noSig.textContent = "[ TRANSMITTING ]";
    mount.appendChild(noSig);

    /* --------------------------------------------------------------------
       Starfield state. Each star is (x, y, z, colorIndex). x, y in [-1, 1].
       z in [starMinZ, starMaxZ]. We integrate z -= speed * dt each frame
       (one-directional: stars only move TOWARD camera, then reset to max-z
       on near-clip). No back-and-forth.
       -------------------------------------------------------------------- */
    var paletteHex = [
      CONFIG.palette.savanna, CONFIG.palette.savanna, CONFIG.palette.savanna,
      CONFIG.palette.forest, CONFIG.palette.forestMid,
      CONFIG.palette.moss, CONFIG.palette.sageBright, CONFIG.palette.sageLight,
      CONFIG.palette.cyan,
      CONFIG.palette.yellow,
      CONFIG.palette.magenta
    ];
    function hexToRGB(h) {
      return [(h >> 16) & 0xFF, (h >> 8) & 0xFF, h & 0xFF];
    }
    var paletteRGB = paletteHex.map(hexToRGB);

    var stars = new Float32Array(starCount * 4); // x, y, z, colorIdx
    for (var i = 0; i < starCount; i++) {
      stars[i*4 + 0] = (Math.random() - 0.5) * 2;
      stars[i*4 + 1] = (Math.random() - 0.5) * 2;
      stars[i*4 + 2] = Math.random() * CONFIG.starMaxZ + CONFIG.starMinZ;
      stars[i*4 + 3] = Math.floor(Math.random() * paletteRGB.length);
    }

    var width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    function resize() {
      /* WELI 2026-06-05: 'the galaxy needs to start from the very top (not
         margin top, top top, of the page).' The canvas is position:fixed
         inset:0 but this resize used mount.getBoundingClientRect() (= the
         splash-bg's box, which starts below the header). That confined the
         canvas to the splash height, leaving the header strip + any space
         above as a black band. Use viewport dims so the canvas fills the
         whole window, fixed-positioned. */
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    var lastT = performance.now();
    var running = !reduced;
    var rafId = 0;

    function readAmp() {
      if (window.wwhHeroAudio && typeof window.wwhHeroAudio.amp === "number") {
        return Math.max(0, Math.min(1, window.wwhHeroAudio.amp));
      }
      return 0;
    }

    function frame(now) {
      if (!running) return;
      var dt = Math.min(0.06, (now - lastT) / 1000);
      lastT = now;

      var amp = readAmp();
      var speed = CONFIG.starSpeed + (CONFIG.starWarpSpeed - CONFIG.starSpeed) * amp;

      // Clear with mild trail (compositing onto the previous frame at alpha)
      // for a tiny motion blur — gives stars a streak read.
      ctx.fillStyle = "rgba(2,2,4,0.36)";
      ctx.fillRect(0, 0, width, height);

      var cx = width * 0.5;
      var cy = height * 0.5;

      for (var i = 0; i < starCount; i++) {
        var idx = i * 4;
        // One-directional: z decreases (warp toward camera)
        stars[idx + 2] -= speed * dt;
        if (stars[idx + 2] <= CONFIG.starMinZ) {
          stars[idx + 0] = (Math.random() - 0.5) * 2;
          stars[idx + 1] = (Math.random() - 0.5) * 2;
          stars[idx + 2] = CONFIG.starMaxZ;
          stars[idx + 3] = Math.floor(Math.random() * paletteRGB.length);
        }

        var z = stars[idx + 2];
        var k = CONFIG.fovScale / z;
        var px = cx + stars[idx + 0] * k * cx * 0.5;
        var py = cy + stars[idx + 1] * k * cy * 0.5;

        // Star fades in from far, brightest near
        var depthFade = Math.min(1, (CONFIG.starMaxZ - z) / (CONFIG.starMaxZ * 0.6));
        var size = Math.max(0.4, 2.2 * (1 - z / CONFIG.starMaxZ));
        var rgb = paletteRGB[stars[idx + 3]];
        ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (0.55 * depthFade).toFixed(2) + ")";
        ctx.fillRect(px - size * 0.5, py - size * 0.5, size, size);

        // Brightest near-stars get a tiny streak behind them for warp read.
        if (z < CONFIG.starMaxZ * 0.25) {
          var tail = size * 4 * (1 - z / (CONFIG.starMaxZ * 0.25));
          ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + "," + (0.18 * depthFade).toFixed(2) + ")";
          // Streak points back toward origin (radial-out)
          var dx = px - cx, dy = py - cy;
          var d = Math.sqrt(dx*dx + dy*dy) || 1;
          var sx = px - (dx / d) * tail;
          var sy = py - (dy / d) * tail;
          ctx.beginPath();
          ctx.moveTo(px, py);
          ctx.lineTo(sx, sy);
          ctx.lineWidth = size * 0.7;
          ctx.strokeStyle = ctx.fillStyle;
          ctx.stroke();
        }
      }

      rafId = requestAnimationFrame(frame);
    }

    if (reduced) {
      // Paint one static frame and stop — stars frozen.
      ctx.fillStyle = "#020204";
      ctx.fillRect(0, 0, width, height);
      for (var k = 0; k < starCount; k++) {
        var z = stars[k*4 + 2];
        var sk = CONFIG.fovScale / z;
        var px = width*0.5 + stars[k*4 + 0] * sk * width*0.25;
        var py = height*0.5 + stars[k*4 + 1] * sk * height*0.25;
        var size = Math.max(0.5, 2 * (1 - z / CONFIG.starMaxZ));
        var rgb = paletteRGB[stars[k*4 + 3]];
        ctx.fillStyle = "rgba(" + rgb[0] + "," + rgb[1] + "," + rgb[2] + ",0.5)";
        ctx.fillRect(px - size/2, py - size/2, size, size);
      }
    } else {
      rafId = requestAnimationFrame(frame);
    }

    // Tab visibility: pause/resume
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
      } else if (!reduced) {
        running = true;
        lastT = performance.now();
        rafId = requestAnimationFrame(frame);
      }
    });

    // Cleanup on pagehide
    window.addEventListener("pagehide", function () {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    });
  }
})();
