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
    // 2026-06-05 (revised again): WELI wants the LOCKED-in version - palette
    // mosaic + magenta TV the dominant read, starfield subtle. Pulled star
    // count way down; mosaic + TV layers are now the headline (see styles).
    starCount:        320,        // subtler starfield (was 780)
    starSpeed:        50,         // base z-velocity (world units / sec)
    starWarpSpeed:    200,        // boost when audio is loud
    starMinZ:         1.0,
    starMaxZ:         620,
    fovScale:         480,
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
    if (document.body.dataset.wwhUniverseMounted === "1") return;
    document.body.dataset.wwhUniverseMounted = "1";
    injectStyles();

    // 2026-06-05 WELI: 'apply that smooth quality everywhere - lock it.'
    // The universe (starfield + TV filter + grain) used to mount inside
    // .wwh-splash-bg only. Now it mounts at body level as a fixed full-
    // viewport layer behind all content. Sections have semi-transparent
    // backgrounds (set in wwh-darkmode.css) so the universe peeks through.
    var mount = document.createElement("div");
    mount.className = "wwh-universe-body-mount";
    document.body.insertBefore(mount, document.body.firstChild);

    buildScene(mount);
    injectMusicButton();
  }

  function injectMusicButton() {
    if (document.querySelector(".wwh-universe-music-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wwh-universe-music-btn";
    btn.setAttribute("aria-label", "Play WildWooHoo Vignette");
    btn.innerHTML = '<span class="wwh-music-glyph">&#9836;</span>';
    document.body.appendChild(btn);

    var audioEl = null;
    var playing = false;

    btn.addEventListener("click", function () {
      if (!playing) {
        startMusic();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Pause WildWooHoo Vignette");
        btn.innerHTML = '<span class="wwh-music-glyph">&#9612;&#9612;</span>';
        playing = true;
      } else {
        stopMusic();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Play WildWooHoo Vignette");
        btn.innerHTML = '<span class="wwh-music-glyph">&#9836;</span>';
        playing = false;
      }
    });

    function startMusic() {
      // Reuse the audio-reactive pipeline if it exists (and surface amp to
      // window.wwhHeroAudio so the starfield warp speed reacts to bass).
      if (window.__wwhUniverseAudio) {
        try { window.__wwhUniverseAudio.audioEl.play(); } catch (e) {}
        return;
      }
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) { plainAudio(); return; }
      var ctx;
      try { ctx = new AudioCtx(); } catch (e) { plainAudio(); return; }
      audioEl = document.createElement("audio");
      audioEl.src = "/wwh-vignette.mp3?v=20260605";
      audioEl.crossOrigin = "anonymous";
      audioEl.loop = true;
      audioEl.preload = "auto";
      document.body.appendChild(audioEl);
      var source = ctx.createMediaElementSource(audioEl);
      var analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.78;
      var freqBuf = new Uint8Array(analyser.frequencyBinCount);
      var fadeGain = ctx.createGain(); fadeGain.gain.value = 0;
      var masterGain = ctx.createGain(); masterGain.gain.value = 0.40;
      source.connect(analyser);
      analyser.connect(fadeGain);
      fadeGain.connect(masterGain);
      masterGain.connect(ctx.destination);
      if (!window.wwhHeroAudio) window.wwhHeroAudio = { amp: 0, lo: 0, mid: 0, hi: 0 };
      var resumePromise = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
      resumePromise.then(function () {
        var p = audioEl.play();
        if (p && typeof p.catch === "function") p.catch(function () {});
        var now = ctx.currentTime;
        fadeGain.gain.setValueAtTime(0, now);
        fadeGain.gain.linearRampToValueAtTime(1, now + 0.6);
      });
      var beatHistory = [], beatCooldown = 0;
      function tick() {
        analyser.getByteFrequencyData(freqBuf);
        var n = freqBuf.length;
        var loEnd = Math.floor(n * 0.125), midEnd = Math.floor(n * 0.5);
        var loSum = 0, midSum = 0, hiSum = 0, i;
        for (i = 0; i < loEnd; i++) loSum += freqBuf[i];
        for (i = loEnd; i < midEnd; i++) midSum += freqBuf[i];
        for (i = midEnd; i < n; i++) hiSum += freqBuf[i];
        var total = (loSum + midSum + hiSum) / (n * 255);
        window.wwhHeroAudio.amp = window.wwhHeroAudio.amp * 0.4 + total * 0.6;
        window.wwhHeroAudio.lo  = window.wwhHeroAudio.lo  * 0.4 + (loSum / (loEnd * 255)) * 0.6;
        window.wwhHeroAudio.mid = window.wwhHeroAudio.mid * 0.4 + (midSum / ((midEnd - loEnd) * 255)) * 0.6;
        window.wwhHeroAudio.hi  = window.wwhHeroAudio.hi  * 0.4 + (hiSum / ((n - midEnd) * 255)) * 0.6;
        var nowMs = performance.now();
        var energy = (loSum + midSum) / (midEnd * 255);
        beatHistory.push(energy);
        if (beatHistory.length > 43) beatHistory.shift();
        if (beatHistory.length > 8 && nowMs > beatCooldown) {
          var avg = 0;
          for (i = 0; i < beatHistory.length; i++) avg += beatHistory[i];
          avg /= beatHistory.length;
          if (energy > avg * 1.45 && energy > 0.04) {
            document.documentElement.classList.add("is-audio-beat");
            beatCooldown = nowMs + 180;
            setTimeout(function () {
              document.documentElement.classList.remove("is-audio-beat");
            }, 80);
          }
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      window.__wwhUniverseAudio = { audioEl: audioEl, ctx: ctx };
    }

    function plainAudio() {
      audioEl = document.createElement("audio");
      audioEl.src = "/wwh-vignette.mp3?v=20260605";
      audioEl.loop = true;
      audioEl.preload = "auto";
      document.body.appendChild(audioEl);
      var p = audioEl.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
      window.__wwhUniverseAudio = { audioEl: audioEl, ctx: null };
    }

    function stopMusic() {
      if (window.__wwhUniverseAudio && window.__wwhUniverseAudio.audioEl) {
        try { window.__wwhUniverseAudio.audioEl.pause(); } catch (e) {}
      }
    }
  }

  function injectStyles() {
    if (document.getElementById("wwh-hero-universe-styles")) return;
    var css =
      ".wwh-universe-stars{position:absolute;inset:0;z-index:0;pointer-events:none;" +
        "background:#020204;}" +

      /* Palette mosaic — THE chromatic field (logo-tech 256-colour quantize).
         Now the dominant layer (was 24px/0.18; now 16px tile at 0.46, screen
         blend) to bring back the locked-in TV-shimmer feel WELI wants. The
         starfield is subtler and lives on top with mix-blend. */
      ".wwh-universe-mosaic{position:absolute;inset:0;z-index:0;pointer-events:none;" +
        "background-image:url('/palette-mosaic.png?v=20260605-tech');" +
        "background-size:16px 16px;background-repeat:repeat;" +
        "image-rendering:pixelated;image-rendering:crisp-edges;" +
        "opacity:0.46;mix-blend-mode:screen;" +
        "filter:saturate(1.10) brightness(0.92);}" +

      ".wwh-universe-tv{position:absolute;inset:0;z-index:1;pointer-events:none;" +
        "mix-blend-mode:screen;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.85 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");" +
        "opacity:0.26;}" +

      ".wwh-universe-scan{position:absolute;inset:0;z-index:2;pointer-events:none;" +
        "background:repeating-linear-gradient(0deg," +
          "transparent 0px,transparent 2px," +
          "rgba(0,0,0,0.32) 3px,transparent 4px);}" +

      ".wwh-universe-tv-magenta{position:absolute;inset:0;z-index:1;pointer-events:none;" +
        "mix-blend-mode:screen;opacity:0.22;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.86  0 0 0 0 0.23  0 0 0 0 0.68  0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");}" +

      ".wwh-universe-nosignal{position:absolute;top:18px;right:22px;z-index:5;" +
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
        ".wwh-universe-nosignal,.wwh-universe-ghost{animation:none;}}" +

      /* Body-level mount: fixed full-viewport, behind all content. */
      ".wwh-universe-body-mount{position:fixed;inset:0;z-index:0;" +
        "pointer-events:none;overflow:hidden;}" +
      "body.wwh-awal > main,body.wwh-awal > header,body.wwh-awal > footer," +
        "body.wwh-awal > .lang-switcher,body.wwh-awal > #wwh-mobile-menu," +
        "body.wwh-awal > .wwh-splash-popup,body.wwh-awal > .wwh-back-to-top-float," +
        "body.wwh-awal > script,body.wwh-awal > div:not(.wwh-universe-body-mount){" +
        "position:relative;z-index:1;}" +

      /* Floating music button — bottom-left, magenta accent. */
      ".wwh-universe-music-btn{position:fixed;bottom:22px;left:22px;z-index:9996;" +
        "width:46px;height:46px;border-radius:999px;" +
        "background:rgba(25,25,29,0.78);" +
        "border:1px solid rgba(220,60,173,0.45);color:#DC3CAD;" +
        "font-size:18px;line-height:1;cursor:pointer;" +
        "display:grid;place-items:center;" +
        "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);" +
        "box-shadow:0 6px 24px rgba(0,0,0,0.42);" +
        "transition:border-color 0.3s ease,box-shadow 0.3s ease,color 0.3s ease;}" +
      ".wwh-universe-music-btn:hover{border-color:#DC3CAD;" +
        "box-shadow:0 0 16px rgba(220,60,173,0.5);}" +
      ".wwh-universe-music-btn.is-playing{color:#5DDFE6;" +
        "border-color:rgba(93,223,230,0.5);" +
        "animation:wwh-music-pulse 1.4s ease-in-out infinite;}" +
      "@keyframes wwh-music-pulse{50%{box-shadow:0 0 20px rgba(93,223,230,0.5);}}" +
      ".wwh-music-glyph{font-size:18px;line-height:1;}" +
      "@media(max-width:760px){" +
        ".wwh-universe-music-btn{bottom:16px;left:16px;width:42px;height:42px;}}";

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

    // Layer 0.5: palette mosaic (chromatic field — WELI's locked-in green/magenta)
    var mosaic = document.createElement("div");
    mosaic.className = "wwh-universe-mosaic";
    mount.appendChild(mosaic);

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
      var r = mount.getBoundingClientRect();
      width = Math.max(1, Math.floor(r.width));
      height = Math.max(1, Math.floor(r.height));
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
