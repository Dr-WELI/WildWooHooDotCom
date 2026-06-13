/* =============================================================================
   wwh-hero-tv.js - WildWooHoo splash hero: analog-TV shimmer over palette mosaic.

   WELI direction (2026-06-05):
   - Recreate the EXACT 256-colour logo-tech palette at the smallest possible
     pixels as the BACKGROUND (chromatic noise field, green-dominant with
     cyan / yellow / magenta accents).
   - On top: a "sparkly movement" overlay - the shimmer of an old analog TV
     when the antenna isn't working (animated noise, scan-lines, slow
     vertical roll).
   - Music plays on gate-click (vignette track, audio-reactive).
   - All colours strictly from logo-tech palette (15 anchors).

   Architecture (lean, mostly CSS-driven for portability):
   - Layer 0 (z 0): palette-mosaic.png tiled at 16px-16px with pixelated
     rendering. Repeats across the viewport - the chromatic noise field.
   - Layer 1 (z 1): SVG turbulence noise as background-image, animated via
     transform translate(random) at 8fps. Mix-blend screen for sparkle.
   - Layer 2 (z 2): horizontal scan-lines via repeating-linear-gradient
     (CSS). 2px dark, 2px transparent. Static.
   - Layer 3 (z 3): slow vertical "ghost band" - 60px tall, semi-transparent,
     translates down the viewport every 8s (analog TV vertical-hold drift).
   - Layer 4 (z 4): "no signal" badge top-right (small, sparingly).
   - Layer 5 (z 5): click-to-enter gate (centred until clicked).
   - Layer 6 (z 6): minimal HUD brand chip top-left.

   Audio: reuses the same .wwh-vignette.mp3 + AudioContext + AnalyserNode
   pipeline from wwh-hero-monogram.js (factored into tryStartAudio +
   voxelAudioBoot). On gate click the track fades in, the brand chip
   pulses on beat, the noise opacity gains a tiny audio boost.

   Body-class hooks (reuses the same names so M&E CSS works unchanged):
     body.is-hero-voxel-mounted  - scene up, gate not clicked yet
     body.is-hero-voxel-opened   - gate clicked, audio playing
   ========================================================================== */

(function () {
  "use strict";

  if (typeof window === "undefined" || !window.document) return;

  var CONFIG = {
    mosaicSrc:        "/palette-mosaic.png?v=20260605-tech",
    mosaicTileSize:   16,         // logical px per tile (1:1 with image)
    noiseStepMs:      120,        // shimmer frame interval (~8fps)
    scanLineEvery:    4,          // px between scan-lines
    ghostBandHeight:  60,         // px of the horizontal "ghost band"
    ghostBandCycleMs: 8000,       // ms for one full top-to-bottom drift
    rollChromaPx:     1,          // chromatic-aberration on noise
    audioSrc:         "/wwh-vignette.mp3?v=20260605",
    masterGain:       0.4
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }

  function init() {
    var mounts = document.querySelectorAll(".wwh-hero-voxel-mount, .wwh-hero-tv-mount");
    if (!mounts.length) return;

    injectStyles();

    var built = false;
    mounts.forEach(function (mount) {
      if (mount.dataset.wwhTvMounted === "1") return;
      /* 2026-06-12: mount-claim guard so this experiment cannot fight the
         monogram/voxel experiments over the same mount element. */
      if (mount.dataset.wwhHeroClaimed) return;
      mount.dataset.wwhHeroClaimed = "tv";
      mount.dataset.wwhTvMounted = "1";
      try { buildScene(mount); built = true; } catch (e) {}
    });

    /* Mark body so M&E CSS hides wing title + manifesto pill until gate.
       2026-06-12: moved AFTER buildScene (still the same synchronous tick,
       so no title flash) and gated on a scene actually building - the
       class used to be added the moment a mount EXISTED, hiding the wing
       title even when the gate UI failed to come up. */
    if (built) {
      try { document.body.classList.add("is-hero-voxel-mounted"); } catch (e) {}
    }
  }

  function injectStyles() {
    if (document.getElementById("wwh-hero-tv-styles")) return;
    var css =
      ".wwh-hero-tv{position:absolute;inset:0;overflow:hidden;background:#020204;}" +

      /* Layer 0: palette mosaic tiled tiny (the chromatic noise field). */
      ".wwh-hero-tv-mosaic{position:absolute;inset:0;" +
        "background-image:url('" + CONFIG.mosaicSrc + "');" +
        "background-size:" + CONFIG.mosaicTileSize + "px " + CONFIG.mosaicTileSize + "px;" +
        "background-repeat:repeat;" +
        "image-rendering:pixelated;image-rendering:crisp-edges;" +
        "filter:saturate(1.05) brightness(0.92);" +
        "transition:filter 1200ms ease-out;}" +
      ".is-hero-voxel-opened .wwh-hero-tv-mosaic{filter:saturate(1.20) brightness(1.0);}" +

      /* Layer 1: SVG turbulence noise, translated each frame for shimmer. */
      ".wwh-hero-tv-noise{position:absolute;inset:-12px;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='0.92' numOctaves='2' seed='4' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.85'/></svg>\");" +
        "mix-blend-mode:screen;opacity:0.18;pointer-events:none;" +
        "transition:opacity 1200ms ease-out;}" +
      ".is-hero-voxel-opened .wwh-hero-tv-noise{opacity:0.30;}" +

      /* Layer 1b: a second copy offset for chromatic-aberration sparkle. */
      ".wwh-hero-tv-noise-2{position:absolute;inset:-12px;" +
        "background-image:url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='320' height='320'><filter id='n' x='0' y='0'><feTurbulence type='fractalNoise' baseFrequency='1.4' numOctaves='1' seed='9' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.92  0 0 0 0 0.23  0 0 0 0 0.68  0 0 0 0.9 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\");" +
        "mix-blend-mode:screen;opacity:0.10;pointer-events:none;" +
        "transition:opacity 1200ms ease-out;}" +
      ".is-hero-voxel-opened .wwh-hero-tv-noise-2{opacity:0.22;}" +

      /* Layer 2: scan-lines. Static. */
      ".wwh-hero-tv-scan{position:absolute;inset:0;pointer-events:none;" +
        "background:repeating-linear-gradient(0deg," +
          "rgba(0,0,0,0) 0px,rgba(0,0,0,0) 2px," +
          "rgba(0,0,0,0.32) 3px,rgba(0,0,0,0) 4px);}" +

      /* Layer 3: vertical ghost band (slow drift). */
      ".wwh-hero-tv-ghost{position:absolute;left:0;right:0;height:" + CONFIG.ghostBandHeight + "px;" +
        "top:-" + CONFIG.ghostBandHeight + "px;" +
        "background:linear-gradient(180deg," +
          "rgba(255,255,255,0) 0%,rgba(197,223,195,0.18) 50%,rgba(255,255,255,0) 100%);" +
        "mix-blend-mode:overlay;pointer-events:none;" +
        "animation:wwh-tv-ghost " + CONFIG.ghostBandCycleMs + "ms linear infinite;}" +
      "@keyframes wwh-tv-ghost{" +
        "0%{transform:translateY(0);}100%{transform:translateY(120vh);}}" +

      /* Layer 4: no-signal badge top-right. */
      ".wwh-hero-tv-nosignal{position:absolute;top:18px;right:22px;z-index:4;" +
        "font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;" +
        "font-size:10px;letter-spacing:0.20em;color:#DC3CAD;" +
        "opacity:0.65;animation:wwh-tv-blink 1.8s steps(2) infinite;" +
        "text-transform:uppercase;text-shadow:0 0 6px rgba(220,60,173,0.4);}" +
      "@keyframes wwh-tv-blink{50%{opacity:0.25;}}" +

      /* Layer 5: brand chip top-left. */
      ".wwh-hero-tv-brand{position:absolute;top:18px;left:22px;z-index:4;" +
        "font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;" +
        "font-size:11px;letter-spacing:0.14em;color:#C5DFC3;opacity:0.7;" +
        "text-transform:uppercase;pointer-events:none;}" +

      /* Layer 6: click-to-enter gate. */
      ".wwh-hero-tv-gate{position:absolute;inset:0;z-index:5;display:flex;" +
        "align-items:center;justify-content:center;pointer-events:auto;" +
        "transition:opacity 600ms ease-out,visibility 600ms ease-out;}" +
      ".wwh-hero-tv-gate.is-fading{opacity:0;visibility:hidden;pointer-events:none;}" +
      ".wwh-hero-tv-gate-button{appearance:none;-webkit-appearance:none;" +
        "background:rgba(2,2,4,0.55);" +
        "border:1px solid rgba(197,223,195,0.45);color:#C5DFC3;cursor:pointer;" +
        "padding:18px 36px;border-radius:6px;" +
        "font-family:'JetBrains Mono',ui-monospace,Menlo,monospace;" +
        "font-size:clamp(15px,1.4vw,20px);letter-spacing:0.10em;opacity:0.95;" +
        "transition:background 200ms ease,border-color 200ms ease,transform 200ms ease;" +
        "backdrop-filter:blur(3px);-webkit-backdrop-filter:blur(3px);" +
        "animation:wwh-tv-gate-pulse 2.4s ease-in-out infinite;" +
        "text-shadow:0 0 8px rgba(220,60,173,0.3);}" +
      ".wwh-hero-tv-gate-button:hover,.wwh-hero-tv-gate-button:focus-visible{" +
        "background:rgba(220,60,173,0.12);border-color:#DC3CAD;outline:none;}" +
      ".wwh-hero-tv-gate-button:active{transform:translateY(1px);}" +
      ".wwh-hero-tv-gate-hint{display:block;margin-top:14px;font-family:'Inter',system-ui,sans-serif;" +
        "font-size:11px;letter-spacing:0.04em;color:#C5DFC3;opacity:0.55;text-transform:none;}" +
      "@keyframes wwh-tv-gate-pulse{" +
        "0%,100%{box-shadow:0 0 0 0 rgba(220,60,173,0.18);}" +
        "50%{box-shadow:0 0 0 10px rgba(220,60,173,0);}}" +

      "@media(prefers-reduced-motion:reduce){" +
        ".wwh-hero-tv-ghost,.wwh-hero-tv-nosignal,.wwh-hero-tv-gate-button{animation:none;}}" +

      "@media(max-width:760px){" +
        ".wwh-hero-tv-brand,.wwh-hero-tv-nosignal{font-size:9px;top:12px;}" +
        ".wwh-hero-tv-brand{left:14px;}.wwh-hero-tv-nosignal{right:14px;}}";

    var s = document.createElement("style");
    s.id = "wwh-hero-tv-styles";
    s.textContent = css;
    document.head.appendChild(s);
  }

  function buildScene(mount) {
    var ms = mount.style;
    ms.position = "absolute";
    ms.inset = "0";
    ms.zIndex = "3";
    ms.pointerEvents = "none";
    ms.overflow = "hidden";
    mount.setAttribute("aria-hidden", "true");

    var root = document.createElement("div");
    root.className = "wwh-hero-tv";
    mount.appendChild(root);

    // Layer 0: palette mosaic
    var mosaic = document.createElement("div");
    mosaic.className = "wwh-hero-tv-mosaic";
    root.appendChild(mosaic);

    // Layer 1: shimmer noise (animated via JS translate so it can read audio amp)
    var noise = document.createElement("div");
    noise.className = "wwh-hero-tv-noise";
    root.appendChild(noise);

    var noise2 = document.createElement("div");
    noise2.className = "wwh-hero-tv-noise-2";
    root.appendChild(noise2);

    // Layer 2: scan lines
    var scan = document.createElement("div");
    scan.className = "wwh-hero-tv-scan";
    root.appendChild(scan);

    // Layer 3: vertical ghost band
    var ghost = document.createElement("div");
    ghost.className = "wwh-hero-tv-ghost";
    root.appendChild(ghost);

    // Layer 4: no-signal badge (top-right)
    var noSig = document.createElement("div");
    noSig.className = "wwh-hero-tv-nosignal";
    noSig.textContent = "NO SIGNAL";
    root.appendChild(noSig);

    // Layer 5: brand chip (top-left)
    var brand = document.createElement("div");
    brand.className = "wwh-hero-tv-brand";
    brand.textContent = "@WildWooHoo  |  What we evolved for";
    root.appendChild(brand);

    // Layer 6: gate
    var gate = buildGate(root);

    // ---- Shimmer animation: translate noise by random offset every CONFIG.noiseStepMs.
    var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var shimmerId = null;

    function shimmerTick() {
      var amp = readAmp();
      var range = 14 + amp * 18;
      var dx1 = (Math.random() - 0.5) * range;
      var dy1 = (Math.random() - 0.5) * range;
      var dx2 = (Math.random() - 0.5) * (range + 6);
      var dy2 = (Math.random() - 0.5) * (range + 6);
      noise.style.transform = "translate(" + dx1.toFixed(1) + "px," + dy1.toFixed(1) + "px)";
      noise2.style.transform = "translate(" + dx2.toFixed(1) + "px," + dy2.toFixed(1) + "px)";
      if (document.documentElement.classList.contains("is-audio-beat")) {
        noise.style.opacity = "0.42";
        noise2.style.opacity = "0.34";
        setTimeout(function () {
          noise.style.opacity = "";
          noise2.style.opacity = "";
        }, 120);
      }
    }
    function startShimmer() {
      if (reduced || shimmerId) return;
      shimmerId = setInterval(shimmerTick, CONFIG.noiseStepMs);
    }
    function stopShimmer() {
      if (shimmerId) { clearInterval(shimmerId); shimmerId = null; }
    }
    startShimmer();

    // ---- Gate click handler
    gate.button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (gate.opened) return;
      gate.opened = true;
      gate.fadeOut();
      try { document.body.classList.add("is-hero-voxel-opened"); } catch (err) {}
      tryStartAudio();
    });

    // ---- Tab visibility: pause shimmer when hidden, resume when visible
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopShimmer();
      else startShimmer();
    });

    // ---- Cleanup on pagehide
    window.addEventListener("pagehide", stopShimmer);
  }

  function readAmp() {
    if (window.wwhHeroAudio && typeof window.wwhHeroAudio.amp === "number") {
      return Math.max(0, Math.min(1, window.wwhHeroAudio.amp));
    }
    return 0;
  }

  function buildGate(root) {
    var gate = document.createElement("div");
    gate.className = "wwh-hero-tv-gate";

    var stack = document.createElement("div");
    stack.style.textAlign = "center";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "wwh-hero-tv-gate-button";
    var isMobile = window.innerWidth < 760;
    button.textContent = isMobile ? "[ TAP TO TUNE IN ]" : "[ CLICK TO TUNE IN ]";
    button.setAttribute("aria-label",
      "Tune in to the WildWooHoo splash. Audio reactive, sound recommended.");

    var hint = document.createElement("span");
    hint.className = "wwh-hero-tv-gate-hint";
    hint.textContent = "Audio reactive. Sound recommended.";

    stack.appendChild(button);
    stack.appendChild(hint);
    gate.appendChild(stack);
    root.appendChild(gate);

    return {
      el: gate,
      button: button,
      opened: false,
      fadeOut: function () { gate.classList.add("is-fading"); }
    };
  }

  /* --------------------------------------------------------------------------
     Audio - same vignette pipeline as the voxel script. If the wwh-audio-
     reactive Listen button exists (aesthetic-v2 body), click it; otherwise
     mount our own AudioContext + AnalyserNode for amp / beat events.
     -------------------------------------------------------------------------- */

  function tryStartAudio() {
    var listenBtn = document.querySelector(".wwh-listen-toggle");
    if (listenBtn) {
      try { listenBtn.click(); return; } catch (e) {}
    }
    voxelAudioBoot();
  }

  function voxelAudioBoot() {
    if (window.__wwhVoxelAudioStarted) return;
    window.__wwhVoxelAudioStarted = true;

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { plainAudioElement(); return; }

    var ctx;
    try { ctx = new AudioCtx(); } catch (e) { plainAudioElement(); return; }

    var audioEl = document.createElement("audio");
    audioEl.id = "wwh-tv-audio";
    audioEl.src = CONFIG.audioSrc;
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
    var masterGain = ctx.createGain(); masterGain.gain.value = CONFIG.masterGain;

    source.connect(analyser);
    analyser.connect(fadeGain);
    fadeGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    if (!window.wwhHeroAudio) window.wwhHeroAudio = { amp: 0, lo: 0, mid: 0, hi: 0 };
    document.documentElement.style.setProperty("--audio-amp", "0");

    var resumePromise = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
    resumePromise.then(function () {
      var p = audioEl.play();
      if (p && typeof p.catch === "function") p.catch(function () {});
      var now = ctx.currentTime;
      fadeGain.gain.setValueAtTime(0, now);
      fadeGain.gain.linearRampToValueAtTime(1, now + 0.6);
    });

    var beatHistory = [];
    var beatCooldown = 0;

    function tick() {
      analyser.getByteFrequencyData(freqBuf);
      var n = freqBuf.length;
      var loEnd = Math.floor(n * 0.125);
      var midEnd = Math.floor(n * 0.5);
      var loSum = 0, midSum = 0, hiSum = 0, i;
      for (i = 0; i < loEnd; i++) loSum += freqBuf[i];
      for (i = loEnd; i < midEnd; i++) midSum += freqBuf[i];
      for (i = midEnd; i < n; i++) hiSum += freqBuf[i];
      var total = (loSum + midSum + hiSum) / (n * 255);
      window.wwhHeroAudio.amp = window.wwhHeroAudio.amp * 0.4 + total * 0.6;
      window.wwhHeroAudio.lo  = window.wwhHeroAudio.lo  * 0.4 + (loSum / (loEnd * 255)) * 0.6;
      window.wwhHeroAudio.mid = window.wwhHeroAudio.mid * 0.4 + (midSum / ((midEnd - loEnd) * 255)) * 0.6;
      window.wwhHeroAudio.hi  = window.wwhHeroAudio.hi  * 0.4 + (hiSum / ((n - midEnd) * 255)) * 0.6;
      document.documentElement.style.setProperty("--audio-amp",
        window.wwhHeroAudio.amp.toFixed(3));

      var now = performance.now();
      var energy = (loSum + midSum) / (midEnd * 255);
      beatHistory.push(energy);
      if (beatHistory.length > 43) beatHistory.shift();
      if (beatHistory.length > 8 && now > beatCooldown) {
        var avg = 0;
        for (i = 0; i < beatHistory.length; i++) avg += beatHistory[i];
        avg /= beatHistory.length;
        if (energy > avg * 1.45 && energy > 0.04) {
          document.documentElement.classList.add("is-audio-beat");
          beatCooldown = now + 180;
          setTimeout(function () {
            document.documentElement.classList.remove("is-audio-beat");
          }, 80);
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    window.addEventListener("pagehide", function () {
      try { audioEl.pause(); audioEl.src = ""; audioEl.load(); } catch (e) {}
      try { source.disconnect(); analyser.disconnect();
            fadeGain.disconnect(); masterGain.disconnect(); } catch (e) {}
      try { if (ctx.state !== "closed") ctx.close(); } catch (e) {}
    });
  }

  function plainAudioElement() {
    if (document.getElementById("wwh-tv-audio-plain")) return;
    var a = document.createElement("audio");
    a.id = "wwh-tv-audio-plain";
    a.src = CONFIG.audioSrc;
    a.loop = true;
    a.preload = "auto";
    document.body.appendChild(a);
    var p = a.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
  }
})();
