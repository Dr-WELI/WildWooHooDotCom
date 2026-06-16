/* =============================================================================
   wwh-hero-universe.js - Starfield warp + analog-TV shimmer behind the splash
   showreel. Universe vibe.

   Mounts into .wwh-splash-bg (the existing splash-hero background container).
   Draws a starfield in CANVAS (one-directional warp toward camera - no back-
   and-forth oscillation, per WELI's "car-in-driveway" brief) and lays a CSS
   TV-shimmer overlay (scan-lines + film grain + magenta NO SIGNAL pulse) on
   top of the starfield + below the existing showreel image cards.

   z-index layers inside the splash:
     wwh-splash-bg            (existing)        - the splash background container
       wwh-universe-stars     (new, z 0)        - canvas starfield (deepest)
       wwh-universe-tv        (new, z 1)        - CSS scan-lines + grain
       hero-showreel          (existing, z 2)   - image cards drift across
     wwh-splash-content       (existing, z 3)   - title + tagline button

   Self-init on script load (defer). Cleans up on pagehide.
   ========================================================================== */

(function () {
  "use strict";

  if (typeof window === "undefined" || !window.document) return;

  /* Canonical track-coupling constants. script.js reads window.WWH_TRACK
     (with mirrored fallbacks) so swapping the track or master means
     editing ONE object, not magic numbers across files.
       bpm          - Kangaroo Time (Instrumental) tempo
       kickOffsetMs - main kick lands ~8s in; 7950 = 50ms early so the
                      visible cut lands ON the kick (see startMusic notes)
       outroMs      - outro starts at audio time 2:14 = 134000ms */
  var TRACK = { bpm: 123.78, kickOffsetMs: 7950, outroMs: 134000 };
  window.WWH_TRACK = TRACK;

  var CONFIG = {
    starCount:        450,        // deep field; fewer on mobile via halve
    starSpeed:        60,         // base z-velocity (world units / sec)
    starWarpSpeed:    220,        // boost when audio is loud
    starMinZ:         1.0,        // near-clip
    starMaxZ:         600,        // far-clip (stars start here, warp toward us)
    fovScale:         460,        // 2D projection scale factor
    palette: {
      // weighted by frequency in logo-tech quantize
      savanna:   0x34D6DE,
      forest:    0x6FE0C8,
      forestMid: 0xFFC857,
      moss:      0x9FB4A6,
      sageBright:0x6FE0C8,
      sageLight: 0xE9F1EA,
      cyan:      0x34D6DE,
      yellow:    0xFFC857,
      magenta:   0x34D6DE
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
       ancestor between canvas and viewport. Fire if a splash-bg exists
       (home page) OR if body has data-deck (wing pages M&E / R&E /
       Collaborate, which use the galaxy as a top-of-page accent only and
       do not need the music button). */
    var hasSplash = !!document.querySelector(".wwh-splash-bg");
    var isWingPage = !!document.body.dataset.deck;
    /* 2026-06-14: plain interior pages opt into the galaxy backdrop alone
       (no music button, no splash) with body data-wwh-galaxy="on" - adds
       depth to otherwise flat-black pages (portal, privacy, brand-kit). */
    var wantsGalaxy = document.body.dataset.wwhGalaxy === "on";
    if (!hasSplash && !isWingPage && !wantsGalaxy) return;
    if (document.body.dataset.wwhUniverseMounted === "1") return;
    document.body.dataset.wwhUniverseMounted = "1";
    injectStyles();
    buildScene(document.body);
    if (hasSplash) injectMusicButton();
  }

  /* ========================================================================
     MUSIC BUTTON - WELI 2026-06-05: 'there was a music button in that version
     that we want to bring back for sure too! use this track though:
     Kangaroo Time (Instrumental).' Floating play/pause button bottom-left,
     magenta at rest, cyan + pulse when playing. Audio analyser feeds bass
     amplitude into window.wwhHeroAudio + adds is-audio-beat class to <html>
     on beat detection so the starfield warp speed can react.
     ======================================================================== */
  /* 2026-06-12: was the raw 40MB 24-bit WAV master - every play streamed
     ~40MB (mobile stall + GitHub Pages bandwidth burn). Now the 3.7MB AAC
     transcode. The WAV master stays on disk for download links only. */
  var AUDIO_SRC = "/assets/audio/kangaroo-time-instrumental.m4a";

  function injectMusicButton() {
    if (document.querySelector(".wwh-universe-music-btn")) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "wwh-universe-music-btn";
    btn.setAttribute("aria-label", "Play Kangaroo Time");
    btn.setAttribute("aria-pressed", "false");
    btn.innerHTML = '<span class="wwh-music-glyph">&#9836;</span>';
    document.body.appendChild(btn);

    /* WELI 2026-06-06: welcome prompt + track metadata HUD around the
       music button. Prompt insists the user press play (the glitch
       transitions only really sing when the track is playing). Track
       metadata shows BPM + KEY as a sci-fi readout once playing. */
    /* WELI 2026-06-06: 'put your headphones on, press play, and sit back.'
       Centred welcome dominates first-load view as the main page action. */
    /* WELI 2026-06-13: the prompt now has a real close control and a real
       Press play button (was a single click-anywhere div). A visitor can
       leave it without playing. Once they close it OR press play, the
       choice is remembered so return visitors are not shown it again
       (the music button stays available to play on demand). */
    var PROMPT_SEEN_KEY = "wwh-music-prompt-dismissed";
    var promptSeen = false;
    try { promptSeen = window.localStorage.getItem(PROMPT_SEEN_KEY) === "1"; } catch (e) {}

    var prompt = null;
    function rememberPromptSeen() {
      try { window.localStorage.setItem(PROMPT_SEEN_KEY, "1"); } catch (e) {}
    }
    function dismissPrompt(remember) {
      if (remember) rememberPromptSeen();
      if (!prompt) return;
      var node = prompt;
      node.classList.add("is-dismissed");
      window.setTimeout(function () {
        if (node && node.parentNode) node.parentNode.removeChild(node);
      }, 600);
    }

    if (!promptSeen) {
      prompt = document.createElement("div");
      prompt.className = "wwh-music-prompt";
      prompt.setAttribute("role", "group");
      prompt.setAttribute("aria-label", "Listen to Kangaroo Time");
      prompt.innerHTML =
        '<button type="button" class="wwh-prompt-close" aria-label="Close. Browse without sound">&#215;</button>' +
        '<p class="wwh-prompt-pre">Put your headphones on</p>' +
        '<button type="button" class="wwh-prompt-cta">' +
          '<span class="wwh-prompt-icon" aria-hidden="true">&#9658;</span>' +
          '<span>Press play</span>' +
        '</button>' +
        '<p class="wwh-prompt-post">... and sit back</p>';
      document.body.appendChild(prompt);

      /* WELI 2026-06-06: track metadata HUD ('BPM 123.78 · KEY E MIN ·
         KANGAROO TIME (INSTR)') removed - 'you can remove the text for
         the song metadata.' BPM info still drives the showreel cuts in
         the background, just not surfaced as UI. */

      /* The Press play button (and a click anywhere on the panel body)
         starts the track; the close button and Escape leave without it. */
      prompt.querySelector(".wwh-prompt-cta").addEventListener("click", function (e) {
        e.stopPropagation();
        btn.click();
      });
      prompt.querySelector(".wwh-prompt-close").addEventListener("click", function (e) {
        e.stopPropagation();
        dismissPrompt(true);
      });
      prompt.addEventListener("click", function () {
        btn.click();
      });
      prompt.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
          e.preventDefault();
          dismissPrompt(true);
        }
      });
      /* Auto-dismiss after 35s if ignored, but do NOT remember a non-choice:
         a visitor who never interacted may still want it next visit. */
      window.setTimeout(function () {
        if (prompt && !prompt.classList.contains("is-dismissed") &&
            !document.body.classList.contains("is-music-playing")) {
          dismissPrompt(false);
        }
      }, 35000);
    }

    var playing = false;

    btn.addEventListener("click", function () {
      if (!playing) {
        startMusic();
        btn.classList.add("is-playing");
        btn.setAttribute("aria-label", "Pause Kangaroo Time");
        btn.setAttribute("aria-pressed", "true");
        btn.innerHTML = '<span class="wwh-music-glyph">&#9612;&#9612;</span>';
        document.body.classList.add("is-music-playing");
        dismissPrompt(true);
        startWordmarkBlink();
        playing = true;
      } else {
        stopMusic();
        btn.classList.remove("is-playing");
        btn.setAttribute("aria-label", "Play Kangaroo Time");
        btn.setAttribute("aria-pressed", "false");
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
  var BEAT_MS_AT_BPM = 60000 / TRACK.bpm;       /* ~484.7ms */
  var STATE_DURATIONS = [
    Math.round(BEAT_MS_AT_BPM * 16),            /* wildwoohoo:        ~7760ms */
    Math.round(BEAT_MS_AT_BPM * 6)              /* what we evolved...: ~2908ms */
  ];
  var STATE_TEXT = ['wildwoohoo', 'what we evolved for'];
  var wordmarkTimer = null;
  var wordmarkState = 0;

  function startWordmarkBlink() {
    /* 2026-06-12: respect prefers-reduced-motion in JS too - CSS already
       suppresses the glitch animation, but the text swap + class churn
       every few seconds is still motion. Skip the cycle entirely. */
    if (window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
    /* Shared audio mutex: this script is the canonical writer of
       window.wwhHeroAudio / --audio-amp / is-audio-beat where it runs.
       Claiming 'universe' tells wwh-audio-reactive.js (if it is ever
       activated) not to start a second analyser pipeline on top. */
    if (!window.wwhAudioOwner) window.wwhAudioOwner = "universe";

    if (window.__wwhUniverseAudio) {
      /* Resume path. 2026-06-12: stopMusic() nulls wwhTrackStart and this
         branch used to leave it null forever - one pause permanently froze
         the home leap cuts. Recompute the beat anchor from the element's
         current position so cuts stay BPM-locked mid-track. */
      var held = window.__wwhUniverseAudio;
      try {
        if (held.ctx && held.ctx.state === "suspended") held.ctx.resume();
      } catch (e) {}
      try {
        var rp = held.audioEl.play();
        if (rp && typeof rp.catch === "function") rp.catch(function () {});
      } catch (e) {}
      window.wwhTrackStart =
        performance.now() - (held.audioEl.currentTime * 1000) + TRACK.kickOffsetMs;
      window.wwhTrackBPM = TRACK.bpm;
      if (held.startTick) held.startTick();
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
         drum lands ~8s into the track. WELI 2026-06-08: 'the swap to
         the second photo should be a tiny bit before.. think of a frame
         or so.' Shifted offset from 8000 to 7950 (50ms = ~3 frames at
         60fps earlier) so the trigger compensates for browser repaint +
         visual perception latency and the visible cut lands ON the kick
         instead of trailing it. BPM grid keeps the same cadence from
         that anchor onward. */
      window.wwhTrackStart = performance.now() + TRACK.kickOffsetMs;
      window.wwhTrackBPM = TRACK.bpm;
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
    /* 2026-06-12: the analyser loop is now cancellable - it used to keep
       sampling at 60fps forever after the music was paused (stopMusic only
       paused the element) and across pagehide. stopMusic() calls stopTick();
       the resume branch of startMusic() calls startTick(). */
    var tickActive = false;
    var tickRaf = 0;
    function tick() {
      if (!tickActive) return;
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
      tickRaf = requestAnimationFrame(tick);
    }
    function startTick() {
      if (tickActive) return;
      tickActive = true;
      tickRaf = requestAnimationFrame(tick);
    }
    function stopTick() {
      tickActive = false;
      if (tickRaf) { cancelAnimationFrame(tickRaf); tickRaf = 0; }
    }
    startTick();
    window.addEventListener("pagehide", stopTick);
    window.__wwhUniverseAudio = {
      audioEl: audioEl,
      ctx: ctx,
      startTick: startTick,
      stopTick: stopTick
    };
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
    /* 2026-06-12: use the same kick anchor as the Web Audio path - this
       fallback used to anchor at 0ms, putting the leap cuts off-beat from
       the first bar on browsers without the AudioContext API. */
    window.wwhTrackStart = performance.now() + TRACK.kickOffsetMs;
    window.wwhTrackBPM = TRACK.bpm;
  }

  function stopMusic() {
    if (window.__wwhUniverseAudio) {
      if (window.__wwhUniverseAudio.audioEl) {
        try { window.__wwhUniverseAudio.audioEl.pause(); } catch (e) {}
      }
      /* 2026-06-12: park the analyser rAF loop while paused. */
      if (window.__wwhUniverseAudio.stopTick) window.__wwhUniverseAudio.stopTick();
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
      // 2026-06-12: z-index 0 -> -1. At z:0 the opaque starfield painted
      // ABOVE any static (z:auto) content and relied entirely on
      // wwh-darkmode.css lifting main/footer to z:2 - any page or element
      // missing that lift was silently buried. At -1 the canvas is
      // self-securing: unpositioned content always paints over it, and the
      // body background (no html background is set anywhere, so it
      // propagates to the document canvas) still sits behind it.
      ".wwh-universe-stars{position:fixed;inset:0;z-index:-1;pointer-events:none;" +
        "background:#0B0E14;}" +

      /* 2026-06-14 HIGH-TECH PASS (WELI: the TV filter read old-tech, not
         high-tech). The TV static is replaced by a clean cyan bloom over the
         sharp starfield - depth without the retro snow. A low warm bloom rises
         from the base (coral -> gold) so the screen feels lit, not cold. */
      ".wwh-universe-tv{position:fixed;inset:0;z-index:1;pointer-events:none;" +
        "mix-blend-mode:screen;" +
        "background:radial-gradient(120% 70% at 50% 96%,rgba(255,122,77,0.10) 0%,rgba(255,200,87,0.06) 34%,transparent 64%),radial-gradient(125% 85% at 50% -12%,rgba(52,214,222,0.11) 0%,rgba(52,214,222,0.045) 30%,transparent 62%);" +
        "opacity:1;}" +

      /* 2026-06-14: CRT scanlines removed - the single biggest old-tech tell. */
      ".wwh-universe-scan{display:none !important;}" +

      /* WELI 2026-06-06: .wwh-universe-tv-magenta NEUTRALISED. Safari
         WebKit renders feTurbulence+feColorMatrix data-URI as a solid
         magenta flood across the entire viewport. */
      ".wwh-universe-tv-magenta{position:fixed;inset:0;z-index:1;pointer-events:none;opacity:0;background:none;}" +

      /* WELI 2026-06-06: TRANSMITTING chip switched from absolute (relative
         to its position:fixed parent canvas) to position:fixed directly,
         so it stays glued to viewport top-right exactly like [ABOUT] and
         the music button. Same z-index (5) keeps it below the header. */
      /* 2026-06-14: corner status chip recoloured magenta -> cyan and the hard
         no-signal flicker softened to a gentle pulse (sleek HUD, not CRT). */
      ".wwh-universe-nosignal{position:fixed;top:84px;right:22px;z-index:5;" +
        "font-family:'JetBrains Mono',ui-monospace,monospace;font-size:9px;" +
        "letter-spacing:0.22em;color:#34D6DE;opacity:0.6;text-transform:uppercase;" +
        "text-shadow:0 0 8px rgba(52,214,222,0.45);" +
        "animation:wwh-universe-blink 3.6s ease-in-out infinite;pointer-events:none;}" +
      "@keyframes wwh-universe-blink{50%{opacity:0.3;}}" +

      /* 2026-06-14: rolling CRT ghost band removed (old-tech tell). */
      ".wwh-universe-ghost{display:none !important;}" +
      ".wwh-universe-ghost-OFF{position:absolute;left:0;right:0;height:54px;top:-54px;" +
        "z-index:3;pointer-events:none;mix-blend-mode:overlay;" +
        "background:linear-gradient(180deg," +
          "rgba(233,241,234,0) 0%,rgba(233,241,234,0.16) 50%,rgba(233,241,234,0) 100%);" +
        "animation:wwh-universe-ghost 9s linear infinite;}" +
      "@keyframes wwh-universe-ghost{" +
        "0%{transform:translateY(0);}100%{transform:translateY(120vh);}}" +

      "@media(prefers-reduced-motion:reduce){" +
        ".wwh-universe-nosignal,.wwh-universe-ghost{animation:none;}}" +

      /* Music button - floating bottom-left, magenta at rest, cyan + pulse when playing. */
      ".wwh-universe-music-btn{position:fixed;bottom:22px;left:22px;z-index:9996;" +
        "width:46px;height:46px;border-radius:999px;" +
        "background:rgba(22,26,34,0.78);" +
        "border:1px solid rgba(52,214,222,0.45);color:#34D6DE;" +
        "font-size:18px;line-height:1;cursor:pointer;" +
        "display:grid;place-items:center;" +
        "backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);" +
        "box-shadow:0 6px 24px rgba(0,0,0,0.42);" +
        "transition:border-color 0.3s ease,box-shadow 0.3s ease,color 0.3s ease;}" +
      ".wwh-universe-music-btn:hover{border-color:#34D6DE;" +
        "box-shadow:0 0 16px rgba(52,214,222,0.5);}" +
      /* 2026-06-12: keyboard parity with :hover. */
      ".wwh-universe-music-btn:focus-visible{outline:2px solid #34D6DE;" +
        "outline-offset:3px;}" +
      ".wwh-universe-music-btn.is-playing{color:#34D6DE;" +
        "border-color:rgba(52,214,222,0.5);" +
        "animation:wwh-music-pulse 1.4s ease-in-out infinite;}" +
      "@keyframes wwh-music-pulse{50%{box-shadow:0 0 20px rgba(52,214,222,0.5);}}" +
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

    // 2026-06-12: this function used to write inline position:relative +
    // overflow:hidden onto the mount - which is document.body. Every layer
    // injected below is position:fixed (viewport-positioned), so body needs
    // neither: the overflow write made scrolling depend on wwh-archive.css
    // happening to set html{overflow-x:hidden}, and the position write
    // silently changed the containing block for absolutely positioned
    // descendants. Both writes removed; body is left untouched.

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

    /* WELI 2026-06-15: light-galaxy mode. When the page carries the
       wwh-galaxy-light class, invert to dark motes (teal / green / charcoal)
       so the galaxy can sit on a genuinely light-gray page. */
    var lightMode = document.body.classList.contains("wwh-galaxy-light");
    if (lightMode) {
      /* WELI 2026-06-15: re-tinted off forest. Dark-enough accents to read on
         the cream field (#FBF7EE): deep teal + deep mint, a deep coral, a deep
         gold, and a charcoal ink. No green. */
      paletteRGB = [
        [28,138,144],[28,138,144],[46,158,134],[26,36,32],[46,158,134],
        [200,90,51],[28,138,144],[26,36,32],[28,138,144],[184,134,47],[46,158,134]
      ];
    }

    var stars = new Float32Array(starCount * 4); // x, y, z, colorIdx
    for (var i = 0; i < starCount; i++) {
      stars[i*4 + 0] = (Math.random() - 0.5) * 2;
      stars[i*4 + 1] = (Math.random() - 0.5) * 2;
      stars[i*4 + 2] = Math.random() * CONFIG.starMaxZ + CONFIG.starMinZ;
      stars[i*4 + 3] = Math.floor(Math.random() * paletteRGB.length);
    }

    var width = 0, height = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

    /* Static paint for prefers-reduced-motion: one frozen starfield frame.
       2026-06-12: extracted into a function so resize() can re-run it -
       setting canvas.width clears the bitmap, which used to leave
       reduced-motion users a blank dark band after any resize/rotation. */
    function paintStatic() {
      ctx.fillStyle = lightMode ? "#FBF7EE" : "#0B0E14";
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
    }

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
      /* Reduced motion: no rAF loop will repaint, do it here. */
      if (reduced) paintStatic();
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
      // for a tiny motion blur - gives stars a streak read.
      ctx.fillStyle = lightMode ? "rgba(251,247,238,0.42)" : "rgba(11,14,20,0.36)";
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
      // Paint one static frame and stop - stars frozen. (resize() already
      // painted once; this keeps the explicit boot-time paint.)
      paintStatic();
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
