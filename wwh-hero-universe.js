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
    /* WELI 2026-06-05: the universe canvas was mounting into .wwh-splash-bg
       which sits inside .wwh-splash > main > body. Any ancestor with
       transform/filter/backdrop-filter/contain creates a containing block
       for position:fixed children, trapping the canvas to that ancestor's
       box. After multiple rounds of removing stacking-context creators
       upstream, switching to body-level mount kills the entire class of
       bugs - canvas is now a direct child of <body>, no transformed/filtered
       ancestor between canvas and viewport. Only fire if a splash-bg exists
       on the page (so other pages without a hero don't get a canvas). */
    if (!document.querySelector(".wwh-splash-bg")) return;
    if (document.body.dataset.wwhUniverseMounted === "1") return;
    document.body.dataset.wwhUniverseMounted = "1";
    injectStyles();
    buildScene(document.body);
    injectMusicButton();
  }

  /* ========================================================================
     MUSIC BUTTON - WELI 2026-06-05: 'there was a music button in that version
     that we want to bring back for sure too! use this track though:
     Kangaroo Time (Instrumental).' Floating play/pause button bottom-left,
     magenta at rest, cyan + pulse when playing. Audio analyser feeds bass
     amplitude into window.wwhHeroAudio + adds is-audio-beat class to <html>
     on beat detection so the starfield warp speed can react.
     ======================================================================== */
  var AUDIO_SRC = "/Kangaroo%20Time%20(Instrumental)_24%20Bit%2044.1%20Master.wav";

  function injectMusicButton() {
    if (document.querySelector(".wwh-universe-music-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wwh-universe-music-btn";
    btn.setAttribute("aria-label", "Play Kangaroo Time");
    btn.innerHTML = '<span class="wwh-music-glyph">&#9836;</span>';
    document.body.appendChild(btn);

    /* WELI 2026-06-06: welcome prompt + track metadata HUD around the
       music button. Prompt insists the user press play (the glitch
       transitions only really sing when the track is playing). Track
       metadata shows BPM + KEY as a sci-fi readout once playing. */
    /* WELI 2026-06-06: 'put your headphones on, press play, and sit back.'
       Centred welcome dominates first-load view as the main page action. */
    var prompt = document.createElement("div");
    prompt.className = "wwh-music-prompt";
    prompt.setAttribute("role", "button");
    prompt.setAttribute("tabindex", "0");
    prompt.setAttribute("aria-label", "Put your headphones on, press play, and sit back");
    prompt.innerHTML =
      '<p class="wwh-prompt-pre">Put your headphones on</p>' +
      '<div class="wwh-prompt-cta">' +
        '<span class="wwh-prompt-icon">&#9658;</span>' +
        '<span>Press play</span>' +
      '</div>' +
      '<p class="wwh-prompt-post">... and sit back</p>';
    document.body.appendChild(prompt);

    /* WELI 2026-06-06: track metadata HUD ('BPM 123.78 · KEY E MIN ·
       KANGAROO TIME (INSTR)') removed - 'you can remove the text for
       the song metadata.' BPM info still drives the showreel cuts in
       the background, just not surfaced as UI. */

    function dismissPrompt() {
      prompt.classList.add("is-dismissed");
      window.setTimeout(function () {
        if (prompt && prompt.parentNode) prompt.parentNode.removeChild(prompt);
      }, 600);
    }
    /* WELI 2026-06-06: prompt stays visible AFTER play (with darker
       shadow + dim opacity via .is-music-playing CSS state). Clicking the
       prompt toggles the music button - on the first click music starts
       and the prompt morphs to its ambient style; subsequent clicks
       toggle pause/resume. Auto-dismiss only kicks in if the user never
       presses play within 35s (so it never nags forever). */
    prompt.addEventListener("click", function () {
      btn.click();
    });
    prompt.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        btn.click();
      }
    });
    window.setTimeout(function () {
      if (prompt && !prompt.classList.contains("is-dismissed") &&
          !document.body.classList.contains("is-music-playing")) {
        dismissPrompt();
      }
    }, 35000);

    var playing = false;

    btn.addEventListener("click", function () {
      if (!playing) {
        startMusic();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Pause Kangaroo Time");
        btn.innerHTML = '<span class="wwh-music-glyph">&#9612;&#9612;</span>';
        document.body.classList.add("is-music-playing");
        dismissPrompt();
        startWordmarkBlink();
        playing = true;
      } else {
        stopMusic();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Play Kangaroo Time");
        btn.innerHTML = '<span class="wwh-music-glyph">&#9836;</span>';
        document.body.classList.remove("is-music-playing");
        stopWordmarkBlink();
        playing = false;
      }
      /* Zero-latency signal to wwh-effects.js header auto-hide handler */
      window.dispatchEvent(new CustomEvent("wwh:music-state-changed", { detail: { playing: playing } }));
    });
  }

  /* =======================================================================
     WORDMARK BLINK CYCLE - WELI 2026-06-06.
     When music plays, the lowercase Caveat wordmark cycles between two
     states on a BPM-locked schedule:
       - 'wildwoohoo'           (held for 16 beats = 7.76s)
       - 'what we evolved for'  (held for 6 beats = 2.91s)
     Each swap triggers the glitch animation (.is-blinking class). After
     the music stops, returns to 'wildwoohoo' permanently.
     ======================================================================= */
  var BEAT_MS_AT_BPM = 60000 / 123.78;          /* ~484.7ms */
  var STATE_DURATIONS = [
    Math.round(BEAT_MS_AT_BPM * 16),            /* wildwoohoo:        ~7760ms */
    Math.round(BEAT_MS_AT_BPM * 6)              /* what we evolved...: ~2908ms */
  ];
  var STATE_TEXT = ['wildwoohoo', 'what we evolved for'];
  var wordmarkTimer = null;
  var wordmarkState = 0;

  function startWordmarkBlink() {
    var host = document.querySelector('.wwh-splash-logo[data-wordmark-mode="text"]');
    if (!host) return;
    var nameEl = host.querySelector('.name');
    if (!nameEl) return;
    stopWordmarkBlink(); /* clear any existing schedule */

    function tick() {
      wordmarkState = (wordmarkState + 1) % 2;
      nameEl.textContent = STATE_TEXT[wordmarkState];
      host.classList.toggle('is-question', wordmarkState === 1);
      host.classList.add('is-blinking');
      window.setTimeout(function () {
        host.classList.remove('is-blinking');
      }, 380);
      wordmarkTimer = window.setTimeout(tick, STATE_DURATIONS[wordmarkState]);
    }
    /* Start the cycle after the current state's duration */
    wordmarkTimer = window.setTimeout(tick, STATE_DURATIONS[wordmarkState]);
  }

  function stopWordmarkBlink() {
    if (wordmarkTimer) {
      window.clearTimeout(wordmarkTimer);
      wordmarkTimer = null;
    }
    /* Return to default 'wildwoohoo' state */
    var host = document.querySelector('.wwh-splash-logo[data-wordmark-mode="text"]');
    if (host) {
      var nameEl = host.querySelector('.name');
      if (nameEl) nameEl.textContent = STATE_TEXT[0];
      host.classList.remove('is-question', 'is-blinking');
      wordmarkState = 0;
    }
  }

  function startMusic() {
    if (window.__wwhUniverseAudio) {
      try { window.__wwhUniverseAudio.audioEl.play(); } catch (e) {}
      return;
    }
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) { plainAudio(); return; }
    var ctx;
    try { ctx = new AudioCtx(); } catch (e) { plainAudio(); return; }
    var audioEl = document.createElement("audio");
    audioEl.src = AUDIO_SRC;
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
      /* WELI 2026-06-06: 'showreel starts to move in the strong beat
         instrumental right before 8 sec in.' Kangaroo Time's main kick
         drum lands ~8s into the track - waiting 8000ms means the first
         photo cut lands EXACTLY on that downbeat, then continues on the
         BPM grid from there. Photos hold the first frame through the
         full intro. */
      window.wwhTrackStart = performance.now() + 8000;
      window.wwhTrackBPM = 123.78;
    });
    /* WELI 2026-06-06: 'map the rhythm of the sax (main thing) and of the
       violin also and hit those beats.. keep the drum beat where they are,
       but sometimes the rhythm is given by those high pitched instruments.'
       Three parallel adaptive peak detectors:
         - LO band (kick drum)     -> document.documentElement.is-audio-beat
         - MID band (saxophone)    -> window.wwhMidPeak  (timestamp)
         - HI  band (violin/highs) -> window.wwhHiPeak   (timestamp)
       Each has its own rolling history (~1s window), threshold multiplier,
       and cooldown so the bands fire independently. Leap engine reads
       wwhMidPeak / wwhHiPeak and cuts when either fires. */
    var beatHistory = [], beatCooldown = 0;
    var midHistory  = [], midCooldown  = 0;
    var hiHistory   = [], hiCooldown   = 0;
    window.wwhMidPeak = 0;
    window.wwhHiPeak  = 0;
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
      /* LO band (kick) - existing detection */
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
      /* MID band (sax) - adaptive peak detection. Looks for transients
         that rise sharply above the recent mid-band running average. */
      var midE = window.wwhHeroAudio.mid;
      midHistory.push(midE);
      if (midHistory.length > 43) midHistory.shift();
      if (midHistory.length > 8 && nowMs > midCooldown) {
        var midAvg = 0;
        for (i = 0; i < midHistory.length; i++) midAvg += midHistory[i];
        midAvg /= midHistory.length;
        if (midE > midAvg * 1.55 && midE > 0.06) {
          window.wwhMidPeak = nowMs;
          midCooldown = nowMs + 240;
        }
      }
      /* HI band (violin / cymbals) - adaptive peak detection too. */
      var hiE = window.wwhHeroAudio.hi;
      hiHistory.push(hiE);
      if (hiHistory.length > 43) hiHistory.shift();
      if (hiHistory.length > 8 && nowMs > hiCooldown) {
        var hiAvg = 0;
        for (i = 0; i < hiHistory.length; i++) hiAvg += hiHistory[i];
        hiAvg /= hiHistory.length;
        if (hiE > hiAvg * 1.65 && hiE > 0.05) {
          window.wwhHiPeak = nowMs;
          hiCooldown = nowMs + 220;
        }
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    window.__wwhUniverseAudio = { audioEl: audioEl, ctx: ctx };
  }

  function plainAudio() {
    var audioEl = document.createElement("audio");
    audioEl.src = AUDIO_SRC;
    audioEl.loop = true;
    audioEl.preload = "auto";
    document.body.appendChild(audioEl);
    var p = audioEl.play();
    if (p && typeof p.catch === "function") p.catch(function () {});
    window.__wwhUniverseAudio = { audioEl: audioEl, ctx: null };
    window.wwhTrackStart = performance.now();
    window.wwhTrackBPM = 123.78;
  }

  function stopMusic() {
    if (window.__wwhUniverseAudio && window.__wwhUniverseAudio.audioEl) {
      try { window.__wwhUniverseAudio.audioEl.pause(); } catch (e) {}
    }
    /* WELI 2026-06-06: showreel freezes when music pauses. Clearing the
       track start time tells the leap engine 'no music = no cuts'. */
    window.wwhTrackStart = null;
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

      /* WELI 2026-06-06: .wwh-universe-tv-magenta NEUTRALISED. Safari
         WebKit renders feTurbulence+feColorMatrix data-URI as a solid
         magenta flood across the entire viewport. */
      ".wwh-universe-tv-magenta{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0;background:none;}" +

      /* WELI 2026-06-06: TRANSMITTING chip switched from absolute (relative
         to its position:fixed parent canvas) to position:fixed directly,
         so it stays glued to viewport top-right exactly like [ABOUT] and
         the music button. Same z-index (5) keeps it below the header. */
      ".wwh-universe-nosignal{position:fixed;top:84px;right:22px;z-index:5;" +
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

      /* Music button — floating bottom-left, magenta at rest, cyan + pulse when playing. */
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
