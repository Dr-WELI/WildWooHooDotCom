/* ===== WildWooHoo audio-reactive ambient mode =====
 * Brand evolution 2026-06-05. Self-contained IIFE, vanilla, no exports.
 *
 * Inspiration: Borghesi astrodither (https://www.awwwards.com/sites/astrodither)
 * — audio-reactive ambient layer that drives the visual chrome.
 *
 * What this does:
 *   1. Injects a small "Listen" pill button at bottom-LEFT (opposite the
 *      bottom-RIGHT wwh-back-to-top-float), only when <body class="aesthetic-v2">.
 *   2. On click: starts a procedurally-generated pink-noise ambient bed
 *      through a low-pass filter -> AnalyserNode -> destination at master
 *      gain 0.05 (very quiet). NEVER autoplays — user-initiated only.
 *   3. Exposes the analyser amplitude on:
 *        window.wwhHeroAudio.amp     (0..1, full spectrum)
 *        window.wwhHeroAudio.lo      (0..1, low band)
 *        window.wwhHeroAudio.mid     (0..1, mid band)
 *        window.wwhHeroAudio.hi      (0..1, high band)
 *        --audio-amp CSS var on :root (0..1)
 *      so the paw trail, hero canvas, bokeh, chrome shimmer can react.
 *   4. Simple onset detector -> toggles .is-audio-beat on <html> for 80ms
 *      so CSS animations can sync to perceived beats.
 *   5. Second click stops + resets everything.
 *
 * Hard constraints honoured:
 *   - No autoplay (button click required)
 *   - No third-party domains (procedural pink noise, no embedded audio file)
 *   - Master gain ceiling 0.1 (we use 0.05 — half the ceiling)
 *   - Brand palette only (--brand-cream background, --brand-amber glow)
 *   - z-index 9996 (same tier as back-to-top), bottom-LEFT to avoid collision
 *   - Reduced-motion: bar animation freezes, audio still works
 *   - <button> with aria-pressed + aria-label, keyboard accessible
 *   - Cleanup on pagehide: closes AudioContext
 *   - Graceful no-op if Web Audio API unavailable (button never mounts)
 * ============================================================ */

(function () {
  'use strict';

  // ---- Feature gate -----------------------------------------------------
  // Only mount on v2 surfaces. Avoid v1 entirely.
  if (!document.body || !document.body.classList.contains('aesthetic-v2')) {
    // Body may not be parsed yet if this script ran with `defer` but the
    // class is set later — re-check once DOM is ready.
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', boot, { once: true });
    } else {
      boot();
    }
    return;
  }
  boot();

  function boot() {
    if (!document.body.classList.contains('aesthetic-v2')) return;

    // ---- Web Audio availability check ----------------------------------
    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      // No Web Audio API. Don't mount the button at all — quietly no-op.
      return;
    }

    // Don't double-mount if reloaded with cache shenanigans.
    if (document.querySelector('.wwh-listen-toggle')) return;

    // Initialise shared state object on window so visual layer can read it
    // even before the user clicks (it just stays at 0).
    var state = {
      amp: 0,
      lo: 0,
      mid: 0,
      hi: 0,
      isPlaying: false
    };
    window.wwhHeroAudio = state;
    document.documentElement.style.setProperty('--audio-amp', '0');

    // ---- Inject the styles for the toggle ------------------------------
    injectStyles();

    // ---- Inject the button ---------------------------------------------
    var btn = buildButton();
    document.body.appendChild(btn);

    // ---- Audio graph state ---------------------------------------------
    var ctx = null;
    var source = null;          // noise buffer source
    var filter = null;          // low-pass filter (warm tone)
    var analyser = null;        // analyser node
    var masterGain = null;      // master volume gain
    var fadeGain = null;        // separate gain for smooth fade in/out
    var freqBuf = null;         // Uint8Array for getByteFrequencyData
    var rafId = null;

    // Beat-detector running state
    var beatEnergyHistory = [];
    var beatCooldownUntil = 0;

    // Reduced motion?
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

    // ---- Button click handler ------------------------------------------
    btn.addEventListener('click', function () {
      if (state.isPlaying) {
        stopAmbient();
      } else {
        startAmbient();
      }
    });

    // ---- Cleanup on page unload ----------------------------------------
    window.addEventListener('pagehide', cleanup);
    window.addEventListener('beforeunload', cleanup);

    // ====================================================================
    // FUNCTIONS
    // ====================================================================

    function buildButton() {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'wwh-listen-toggle';
      b.setAttribute('aria-label', 'Listen — ambient mode');
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('title', 'Listen — ambient mode');

      // Soundwave icon: 3 vertical bars. SVG so we can animate via CSS.
      // Bars start at "rest" heights; CSS animates them when .is-playing.
      b.innerHTML =
        '<span class="wwh-listen-icon" aria-hidden="true">' +
          '<span class="wwh-listen-bar"></span>' +
          '<span class="wwh-listen-bar"></span>' +
          '<span class="wwh-listen-bar"></span>' +
        '</span>' +
        '<span class="wwh-listen-label">Listen</span>';

      return b;
    }

    function injectStyles() {
      if (document.getElementById('wwh-listen-styles')) return;
      var css =
        '.wwh-listen-toggle{' +
          'position:fixed;' +
          'left:24px;' +
          'bottom:24px;' +
          'z-index:9996;' +
          'display:inline-flex;' +
          'align-items:center;' +
          'gap:10px;' +
          'min-height:44px;' +
          'padding:0 16px 0 12px;' +
          'border:1px solid rgba(14,14,15,0.10);' +
          'border-radius:999px;' +
          'background:var(--brand-cream, #FBF7EE);' +
          'color:var(--wwh-ink, #0E0E0F);' +
          'font-family:var(--wwh-sans, "Inter", system-ui, sans-serif);' +
          'font-size:13px;' +
          'font-weight:600;' +
          'letter-spacing:0.02em;' +
          'cursor:pointer;' +
          '-webkit-appearance:none;' +
          'appearance:none;' +
          'box-shadow:0 4px 16px rgba(14,14,15,0.12);' +
          'transition:box-shadow .25s ease, background .2s ease, transform .2s ease;' +
        '}' +
        '.wwh-listen-toggle:hover,' +
        '.wwh-listen-toggle:focus-visible{' +
          'box-shadow:0 4px 16px rgba(14,14,15,0.16),0 0 28px rgba(229,185,109,0.55);' +
          'background:var(--brand-cream, #FBF7EE);' +
        '}' +
        '.wwh-listen-toggle:focus-visible{' +
          'outline:2px solid var(--brand-amber, #E5B96D);' +
          'outline-offset:3px;' +
        '}' +
        '.wwh-listen-toggle:active{ transform: translateY(1px); }' +
        '.wwh-listen-toggle.is-playing{' +
          'box-shadow:0 4px 16px rgba(14,14,15,0.16),0 0 32px rgba(229,185,109,0.70);' +
        '}' +
        '.wwh-listen-icon{' +
          'display:inline-flex;' +
          'align-items:flex-end;' +
          'justify-content:center;' +
          'gap:3px;' +
          'width:22px;' +
          'height:18px;' +
        '}' +
        '.wwh-listen-bar{' +
          'display:block;' +
          'width:3px;' +
          'background:var(--wwh-ink, #0E0E0F);' +
          'border-radius:2px;' +
          'transform-origin:bottom center;' +
        '}' +
        '.wwh-listen-bar:nth-child(1){ height:8px; }' +
        '.wwh-listen-bar:nth-child(2){ height:14px; }' +
        '.wwh-listen-bar:nth-child(3){ height:6px; }' +
        '.wwh-listen-toggle.is-playing .wwh-listen-bar{' +
          'animation: wwh-listen-bounce 1.1s ease-in-out infinite;' +
        '}' +
        '.wwh-listen-toggle.is-playing .wwh-listen-bar:nth-child(1){ animation-delay: 0s; }' +
        '.wwh-listen-toggle.is-playing .wwh-listen-bar:nth-child(2){ animation-delay: -0.35s; }' +
        '.wwh-listen-toggle.is-playing .wwh-listen-bar:nth-child(3){ animation-delay: -0.7s; }' +
        '@keyframes wwh-listen-bounce{' +
          '0%, 100% { transform: scaleY(0.45); }' +
          '50% { transform: scaleY(1); }' +
        '}' +
        '@media (prefers-reduced-motion: reduce){' +
          '.wwh-listen-toggle.is-playing .wwh-listen-bar{ animation:none; }' +
          '.wwh-listen-toggle{ transition:none; }' +
        '}' +
        '@media (max-width:560px){' +
          '.wwh-listen-toggle{ left:16px; bottom:16px; font-size:12px; padding:0 14px 0 10px; }' +
        '}';
      var style = document.createElement('style');
      style.id = 'wwh-listen-styles';
      style.textContent = css;
      document.head.appendChild(style);
    }

    // ---- Procedural pink-noise generation ------------------------------
    // Voss-McCartney-ish pink-noise approximation, baked into a 2-second
    // buffer that loops seamlessly. Cheap, ~zero page weight, no audio file.
    function makePinkNoiseBuffer(audioCtx) {
      var duration = 2;
      var sampleRate = audioCtx.sampleRate;
      var length = sampleRate * duration;
      var buf = audioCtx.createBuffer(1, length, sampleRate);
      var data = buf.getChannelData(0);

      // Paul Kellet's pink-noise refined method. Cheap + sounds good.
      var b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (var i = 0; i < length; i++) {
        var white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        var pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        // Normalise to keep amplitude in a sane range
        data[i] = pink * 0.11;
      }
      return buf;
    }

    // ---- Start ambient mode --------------------------------------------
    function startAmbient() {
      try {
        ctx = new AudioCtx();
      } catch (e) {
        return; // really nothing we can do
      }

      // Build the graph: source -> filter -> analyser -> fadeGain -> master -> destination
      var buf = makePinkNoiseBuffer(ctx);

      source = ctx.createBufferSource();
      source.buffer = buf;
      source.loop = true;

      filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1800; // warm, removes hiss
      filter.Q.value = 0.7;

      analyser = ctx.createAnalyser();
      analyser.fftSize = 512; // 256 bins — plenty for band split
      analyser.smoothingTimeConstant = 0.78;
      freqBuf = new Uint8Array(analyser.frequencyBinCount);

      fadeGain = ctx.createGain();
      fadeGain.gain.value = 0;

      masterGain = ctx.createGain();
      masterGain.gain.value = 0.05; // very quiet ambient — half the 0.1 ceiling

      source.connect(filter);
      filter.connect(analyser);
      analyser.connect(fadeGain);
      fadeGain.connect(masterGain);
      masterGain.connect(ctx.destination);

      // Resume in case the context started suspended (Safari/iOS)
      var resumePromise = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
      resumePromise.then(function () {
        try { source.start(0); } catch (e) { /* already started */ }
        // Smooth fade-in over 600ms (avoid click on start)
        var now = ctx.currentTime;
        fadeGain.gain.setValueAtTime(0, now);
        fadeGain.gain.linearRampToValueAtTime(1, now + 0.6);
      });

      // Flip state + UI
      state.isPlaying = true;
      btn.classList.add('is-playing');
      btn.setAttribute('aria-pressed', 'true');
      var label = btn.querySelector('.wwh-listen-label');
      if (label) label.textContent = 'Listening';

      // Reset beat detector
      beatEnergyHistory = [];
      beatCooldownUntil = 0;

      // Start the rAF loop
      tick();
    }

    // ---- Stop ambient mode ---------------------------------------------
    function stopAmbient() {
      state.isPlaying = false;

      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }

      // Smooth fade-out, then tear down
      if (ctx && fadeGain) {
        var now = ctx.currentTime;
        fadeGain.gain.cancelScheduledValues(now);
        fadeGain.gain.setValueAtTime(fadeGain.gain.value, now);
        fadeGain.gain.linearRampToValueAtTime(0, now + 0.45);
        setTimeout(teardown, 500);
      } else {
        teardown();
      }

      // Reset state + UI immediately so the visual layer stops reacting
      state.amp = 0;
      state.lo = 0;
      state.mid = 0;
      state.hi = 0;
      document.documentElement.style.setProperty('--audio-amp', '0');
      document.documentElement.classList.remove('is-audio-beat');

      btn.classList.remove('is-playing');
      btn.setAttribute('aria-pressed', 'false');
      var label = btn.querySelector('.wwh-listen-label');
      if (label) label.textContent = 'Listen';
    }

    function teardown() {
      try { if (source) source.stop(0); } catch (e) {}
      try { if (source) source.disconnect(); } catch (e) {}
      try { if (filter) filter.disconnect(); } catch (e) {}
      try { if (analyser) analyser.disconnect(); } catch (e) {}
      try { if (fadeGain) fadeGain.disconnect(); } catch (e) {}
      try { if (masterGain) masterGain.disconnect(); } catch (e) {}
      try { if (ctx && ctx.state !== 'closed') ctx.close(); } catch (e) {}
      source = filter = analyser = fadeGain = masterGain = ctx = freqBuf = null;
    }

    function cleanup() {
      if (state.isPlaying) stopAmbient();
      else teardown();
    }

    // ---- rAF analysis loop --------------------------------------------
    // Reads frequency data, computes amp + band split + beat detection,
    // pushes to window.wwhHeroAudio + CSS var. Visual layer just reads.
    function tick() {
      if (!state.isPlaying || !analyser || !freqBuf) return;
      analyser.getByteFrequencyData(freqBuf);

      var n = freqBuf.length; // 256
      // Band splits: lo = 0..1/8, mid = 1/8..1/2, hi = 1/2..1
      var loEnd = Math.floor(n * 0.125);
      var midEnd = Math.floor(n * 0.5);

      var loSum = 0, midSum = 0, hiSum = 0, totalSum = 0;
      var i;
      for (i = 0; i < loEnd; i++) loSum += freqBuf[i];
      for (i = loEnd; i < midEnd; i++) midSum += freqBuf[i];
      for (i = midEnd; i < n; i++) hiSum += freqBuf[i];
      totalSum = loSum + midSum + hiSum;

      var loAmp = loSum / (loEnd * 255) || 0;
      var midAmp = midSum / ((midEnd - loEnd) * 255) || 0;
      var hiAmp = hiSum / ((n - midEnd) * 255) || 0;
      var amp = totalSum / (n * 255) || 0;

      // Light smoothing on top of analyser smoothing — feels less twitchy
      state.amp = state.amp * 0.4 + amp * 0.6;
      state.lo = state.lo * 0.4 + loAmp * 0.6;
      state.mid = state.mid * 0.4 + midAmp * 0.6;
      state.hi = state.hi * 0.4 + hiAmp * 0.6;

      // Expose to CSS. toFixed(3) keeps the attribute write cheap.
      document.documentElement.style.setProperty('--audio-amp', state.amp.toFixed(3));

      // ---- Simple onset detector --------------------------------------
      // Energy = lo+mid (bass-weighted). Compare to rolling average.
      // If current energy > 1.45x average + above floor + not in cooldown,
      // fire a beat: add .is-audio-beat for 80ms.
      var now = performance.now();
      var energy = (loSum + midSum) / ((midEnd) * 255);
      beatEnergyHistory.push(energy);
      if (beatEnergyHistory.length > 43) beatEnergyHistory.shift(); // ~700ms history at 60fps

      if (beatEnergyHistory.length > 8 && now > beatCooldownUntil) {
        var avg = 0;
        for (i = 0; i < beatEnergyHistory.length; i++) avg += beatEnergyHistory[i];
        avg /= beatEnergyHistory.length;
        if (energy > avg * 1.45 && energy > 0.04) {
          // Beat!
          document.documentElement.classList.add('is-audio-beat');
          beatCooldownUntil = now + 180; // min spacing
          setTimeout(function () {
            document.documentElement.classList.remove('is-audio-beat');
          }, 80);
        }
      }

      rafId = requestAnimationFrame(tick);
    }
  }
})();
