/* =============================================================================
   wwh-hero-canvas.js — WildWooHoo M&E showstopper hero canvas.

   What this is:
   A vanilla WebGL (zero deps) full-bleed canvas that paints a dark glossy
   liquid-mirror surface with brand-spectrum chromatic dispersion streaks
   drifting across, a soft selective bloom around the streaks, and a fine
   dither texture overlay. Built to sit behind the M&E splash hero content.

   Reference vibe: astrodither flow + Steven.com chromatic refraction crossed
   with the WildWooHoo brand spectrum (red, peach, honey, savanna, amber, sage,
   lavender, violet — NEVER off-palette pink). Dark canvas only. Brand kit v5
   sacred marks live in the HTML layer above this canvas and are never touched.

   Why vanilla WebGL and not Three.js:
   - Bundle size: ~14 KB minified, no CDN dependency, GitHub Pages friendly.
   - Boot time: single shader program, no scene graph, no loader.
   - Maintenance: one fragment shader is the whole effect — easy to tune.

   Mount: looks for `.wwh-hero-canvas-mount` and inserts <canvas> at z-index 2.
   Audio hook: window.wwhHeroAudio = { amp: 0..1 } drives bloom + streak speed.
   Cursor: streaks lean slightly away from the pointer on pointer-fine devices.
   Mobile (<760px): drops streak count, halves bloom samples, renders at 0.66x.
   Reduced motion: freezes on first frame (still a beautiful static painting).
   Tab hidden: pauses RAF, resumes on visible.

   File self-initialises on script load. Cleans up on `pagehide`.
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     Constants — brand spectrum and dark canvas surfaces.
     Keep these as vec3s in 0..1 so they drop straight into shader uniforms.
     -------------------------------------------------------------------------- */

  // Brand spectrum (USE ONLY THESE — see brand-kit/README.md §7).
  // Order: red, peach, honey, savanna, amber, sage, lavender, violet.
  var SPECTRUM = [
    [0.788, 0.478, 0.400], // #C97A66 red
    [0.847, 0.620, 0.471], // #D89E78 peach
    [0.898, 0.725, 0.427], // #E5B96D honey
    [0.153, 0.627, 0.357], // #27A05B savanna
    [0.690, 0.498, 0.188], // #B07F30 amber
    [0.710, 0.608, 0.427], // #B59B6D sage
    [0.600, 0.522, 0.659], // #9985A8 lavender
    [0.490, 0.431, 0.573]  // #7D6E92 violet
  ];

  // Dark canvas anchor (vertical gradient stops, near-black to night-savanna).
  var DARK_TOP    = [0.020, 0.020, 0.020]; // #050505
  var DARK_MID    = [0.039, 0.122, 0.078]; // ~#0A1F14 night-savanna
  var DARK_BOTTOM = [0.000, 0.000, 0.000]; // absolute black at the corners

  // Tuning knobs the user might want to dial later. Documented in one place.
  var CONFIG = {
    desktopStreaks: 5,
    mobileStreaks: 2,
    mobileBreakpoint: 760,
    desktopDPR: 2,
    mobileScale: 0.66,    // mobile renders at 2/3 res then CSS-scales up
    baseSpeed: 1.0,       // 1.0 = full speed; reduced motion forces 0
    audioGain: 1.0,       // how much window.wwhHeroAudio.amp can push bloom
    streakCycleSeconds: 75 // slow hypnotic drift, ~60-90s window per directive
  };

  /* --------------------------------------------------------------------------
     Global audio hook. External analyser writes .amp (0..1) to drive bloom.
     Expose immediately so consumers can hook before the canvas even boots.
     -------------------------------------------------------------------------- */
  if (!window.wwhHeroAudio) {
    window.wwhHeroAudio = { amp: 0 };
  }

  /* --------------------------------------------------------------------------
     Shader sources.
     Vertex: trivial fullscreen quad in clip space. No matrix math, no attribs
     beyond aPos.
     Fragment: the show. Builds up the composition in layers and composites.
     -------------------------------------------------------------------------- */

  var VS = "" +
    "attribute vec2 aPos;\n" +
    "varying vec2 vUv;\n" +
    "void main() {\n" +
    "  vUv = aPos * 0.5 + 0.5;\n" +
    "  gl_Position = vec4(aPos, 0.0, 1.0);\n" +
    "}\n";

  // The fragment shader. Concatenated string for portability.
  // Uniforms:
  //   uTime          (s, monotonic)
  //   uRes           (px, drawing buffer width/height)
  //   uMouse         (0..1 normalised pointer; -1,-1 if no pointer)
  //   uAmp           (0..1 audio amplitude — drives bloom + streak speed)
  //   uStreakCount   (int, 2..5)
  //   uBloomSamples  (int, 4 mobile / 8 desktop)
  //   uPalette[8]    (brand spectrum vec3s)
  //   uDarkTop, uDarkMid, uDarkBottom (vertical gradient stops)
  var FS = "" +
    "precision highp float;\n" +
    "varying vec2 vUv;\n" +
    "uniform float uTime;\n" +
    "uniform vec2  uRes;\n" +
    "uniform vec2  uMouse;\n" +
    "uniform float uAmp;\n" +
    "uniform int   uStreakCount;\n" +
    "uniform int   uBloomSamples;\n" +
    "uniform vec3  uPalette[8];\n" +
    "uniform vec3  uDarkTop;\n" +
    "uniform vec3  uDarkMid;\n" +
    "uniform vec3  uDarkBottom;\n" +
    "\n" +
    // -- Hash + noise utilities. Cheap, deterministic, plenty for this scale.
    "float hash21(vec2 p) {\n" +
    "  p = fract(p * vec2(123.34, 456.21));\n" +
    "  p += dot(p, p + 45.32);\n" +
    "  return fract(p.x * p.y);\n" +
    "}\n" +
    "float vnoise(vec2 p) {\n" +
    "  vec2 i = floor(p);\n" +
    "  vec2 f = fract(p);\n" +
    "  float a = hash21(i);\n" +
    "  float b = hash21(i + vec2(1.0, 0.0));\n" +
    "  float c = hash21(i + vec2(0.0, 1.0));\n" +
    "  float d = hash21(i + vec2(1.0, 1.0));\n" +
    "  vec2 u = f * f * (3.0 - 2.0 * f);\n" +
    "  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;\n" +
    "}\n" +
    "float fbm(vec2 p) {\n" +
    "  float v = 0.0;\n" +
    "  float a = 0.5;\n" +
    "  mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);\n" +
    "  for (int i = 0; i < 5; i++) {\n" +
    "    v += a * vnoise(p);\n" +
    "    p = rot * p * 2.02;\n" +
    "    a *= 0.5;\n" +
    "  }\n" +
    "  return v;\n" +
    "}\n" +
    "\n" +
    // -- Cheap ordered dither (Bayer-style 4x4 hash). Borghesi astrodither feel.
    "float dither(vec2 px) {\n" +
    "  return (hash21(floor(px)) - 0.5) * 0.06;\n" +
    "}\n" +
    "\n" +
    // -- One chromatic streak: a long thin diagonal band of brand-spectrum colour.
    // Returns rgb contribution. The width and brightness depend on distance from
    // the streak's central line. Per-channel offset gives the dispersion look.
    "vec3 streak(vec2 uv, float idx, float total, float t) {\n" +
    "  // Each streak gets its own angle, phase, and palette pair.\n" +
    "  float n = idx / max(total - 1.0, 1.0);\n" +
    "  float angle = mix(-0.55, 0.55, n) + sin(idx * 1.7) * 0.18;\n" +
    "  vec2 dir = vec2(cos(angle), sin(angle));\n" +
    "  vec2 perp = vec2(-dir.y, dir.x);\n" +
    "  // Slow drift across the perpendicular axis. Cycle defined by uTime.\n" +
    "  float drift = t * 0.07 * mix(0.6, 1.4, fract(idx * 0.371)) + idx * 0.42;\n" +
    "  float bandPos = dot(uv - 0.5, perp) - sin(drift) * 0.45;\n" +
    "  // Streak width — thin. Mix of base width and a soft breathing pulse.\n" +
    "  float baseWidth = 0.014 + 0.006 * sin(drift * 1.3 + idx);\n" +
    "  // Audio reactive: amp expands the streak slightly.\n" +
    "  baseWidth *= (1.0 + uAmp * 0.4);\n" +
    "  // Falloff: gaussian-ish so the edges glow rather than cut hard.\n" +
    "  float core = exp(-bandPos * bandPos / (baseWidth * baseWidth));\n" +
    "  // Glow halo around the streak — wider, dimmer envelope.\n" +
    "  float halo = exp(-bandPos * bandPos / (baseWidth * baseWidth * 18.0)) * 0.45;\n" +
    "  // Pick two adjacent palette colours; gradient along the streak length.\n" +
    "  int cA = int(mod(idx * 2.0, 8.0));\n" +
    "  int cB = int(mod(idx * 2.0 + 1.0, 8.0));\n" +
    "  vec3 colA = uPalette[0]; vec3 colB = uPalette[0];\n" +
    "  for (int k = 0; k < 8; k++) {\n" +
    "    if (k == cA) colA = uPalette[k];\n" +
    "    if (k == cB) colB = uPalette[k];\n" +
    "  }\n" +
    "  float along = dot(uv - 0.5, dir);\n" +
    "  float gradT = 0.5 + 0.5 * sin(along * 3.2 + drift * 1.6);\n" +
    "  vec3 streakColor = mix(colA, colB, gradT);\n" +
    "  // Compose core + halo. Core is bright, halo is the bloom seed.\n" +
    "  return streakColor * (core * 1.4 + halo * 0.7);\n" +
    "}\n" +
    "\n" +
    "void main() {\n" +
    "  vec2 uv = vUv;\n" +
    "  vec2 px = vUv * uRes;\n" +
    "  // Cursor parallax: streaks lean slightly away from the pointer.\n" +
    "  // uMouse is (-1,-1) when no pointer — branch protects mobile.\n" +
    "  vec2 mouseOffset = vec2(0.0);\n" +
    "  if (uMouse.x >= 0.0) {\n" +
    "    mouseOffset = (uv - uMouse) * 0.04;\n" +
    "  }\n" +
    "  vec2 muv = uv + mouseOffset;\n" +
    "\n" +
    "  // ---- Base dark canvas: vertical gradient + corner vignette to black.\n" +
    "  float yBlend = smoothstep(0.0, 1.0, uv.y);\n" +
    "  vec3 base = mix(uDarkTop, uDarkMid, yBlend);\n" +
    "  // Vignette: darken the corners — vec2(0.5,0.5) is centre.\n" +
    "  float vig = smoothstep(0.95, 0.2, distance(uv, vec2(0.5, 0.5)));\n" +
    "  base = mix(uDarkBottom, base, vig);\n" +
    "\n" +
    "  // ---- Liquid metallic plane: slow flowing fbm noise, low-amplitude.\n" +
    "  // Reads as a rippling oil mirror — no colour of its own, modulates brightness.\n" +
    "  float t = uTime;\n" +
    "  vec2 flowUv = muv * 2.4 + vec2(0.0, t * 0.012);\n" +
    "  float flow = fbm(flowUv + fbm(flowUv * 0.6 + vec2(t * 0.018, -t * 0.009)));\n" +
    "  // Bring it into a tight band so it whispers rather than shouts.\n" +
    "  float metallic = smoothstep(0.35, 0.85, flow) * 0.08;\n" +
    "  // A second layer with a tiny green tint — keeps the night-savanna feel.\n" +
    "  base += vec3(0.4, 1.0, 0.6) * metallic * 0.5;\n" +
    "  base += vec3(metallic);\n" +
    "\n" +
    "  // ---- Chromatic dispersion streaks.\n" +
    "  vec3 streakSum = vec3(0.0);\n" +
    "  for (int i = 0; i < 5; i++) {\n" +
    "    if (i >= uStreakCount) break;\n" +
    "    // Per-channel UV offset — this IS the chromatic dispersion.\n" +
    "    float idx = float(i);\n" +
    "    vec3 c;\n" +
    "    c.r = streak(muv + vec2( 0.006, 0.0), idx, float(uStreakCount), t).r;\n" +
    "    c.g = streak(muv + vec2( 0.0,    0.0), idx, float(uStreakCount), t).g;\n" +
    "    c.b = streak(muv + vec2(-0.006, 0.0), idx, float(uStreakCount), t).b;\n" +
    "    streakSum += c;\n" +
    "  }\n" +
    "\n" +
    "  // ---- Selective bloom — cheap radial sample around each fragment, only the\n" +
    "  // bright streak signal. The bloom amount lifts with uAmp so audio drives it.\n" +
    "  vec3 bloom = vec3(0.0);\n" +
    "  float bloomGain = 0.18 + uAmp * 0.45;\n" +
    "  for (int b = 0; b < 8; b++) {\n" +
    "    if (b >= uBloomSamples) break;\n" +
    "    float ang = 6.2831 * float(b) / float(uBloomSamples);\n" +
    "    vec2 off = vec2(cos(ang), sin(ang)) * 0.022;\n" +
    "    vec3 sm = vec3(0.0);\n" +
    "    for (int i = 0; i < 5; i++) {\n" +
    "      if (i >= uStreakCount) break;\n" +
    "      sm += streak(muv + off, float(i), float(uStreakCount), t);\n" +
    "    }\n" +
    "    bloom += sm;\n" +
    "  }\n" +
    "  bloom /= float(uBloomSamples);\n" +
    "  // Only the strong streak signal blooms (threshold).\n" +
    "  bloom = max(bloom - 0.12, vec3(0.0)) * bloomGain;\n" +
    "\n" +
    "  // ---- Composite.\n" +
    "  vec3 col = base + streakSum + bloom;\n" +
    "\n" +
    "  // ---- Dither (Borghesi astrodither texture). Tiny perturbation.\n" +
    "  col += vec3(dither(px));\n" +
    "\n" +
    "  // Subtle scan-band darkening near the bottom so HTML CTA text stays legible.\n" +
    "  col *= mix(0.78, 1.0, smoothstep(0.0, 0.45, uv.y));\n" +
    "\n" +
    "  // Final clamp — never push past brand-appropriate brightness.\n" +
    "  col = clamp(col, vec3(0.0), vec3(1.0));\n" +
    "\n" +
    "  gl_FragColor = vec4(col, 1.0);\n" +
    "}\n";

  /* --------------------------------------------------------------------------
     WebGL plumbing helpers.
     -------------------------------------------------------------------------- */

  function compileShader(gl, type, source) {
    var sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      // eslint-disable-next-line no-console
      console.error("[wwh-hero-canvas] shader compile failed:\n" + gl.getShaderInfoLog(sh));
      gl.deleteShader(sh);
      return null;
    }
    return sh;
  }

  function buildProgram(gl) {
    var vs = compileShader(gl, gl.VERTEX_SHADER, VS);
    var fs = compileShader(gl, gl.FRAGMENT_SHADER, FS);
    if (!vs || !fs) return null;
    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      // eslint-disable-next-line no-console
      console.error("[wwh-hero-canvas] program link failed:\n" + gl.getProgramInfoLog(prog));
      return null;
    }
    return prog;
  }

  /* --------------------------------------------------------------------------
     Mount + lifecycle.
     -------------------------------------------------------------------------- */

  function init() {
    var mounts = document.querySelectorAll(".wwh-hero-canvas-mount");
    if (!mounts.length) return;

    // The mount is intentionally a plain <div>. We style it absolute via inline
    // styles so the host page doesn't need extra CSS to make this work.
    mounts.forEach(function (mount) {
      // Avoid double-mount on hot-reload or duplicated tags.
      if (mount.dataset.wwhHeroMounted === "1") return;
      mount.dataset.wwhHeroMounted = "1";

      // Make sure the mount is layered correctly inside its parent splash.
      // The splash uses isolation:isolate already, so z-index here is local.
      // z-index 2 sits ABOVE the showreel + base bloom overlay (z 0/1) and
      // BELOW the splash-content (z 4). Brand logo stays sacred.
      var mountStyle = mount.style;
      mountStyle.position = "absolute";
      mountStyle.inset = "0";
      mountStyle.zIndex = "2";
      mountStyle.pointerEvents = "none";
      mountStyle.overflow = "hidden";
      mount.setAttribute("aria-hidden", "true");

      var canvas = document.createElement("canvas");
      canvas.style.display = "block";
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      canvas.setAttribute("aria-hidden", "true");
      mount.appendChild(canvas);

      var gl = canvas.getContext("webgl", {
        antialias: false,
        alpha: true,
        premultipliedAlpha: false,
        preserveDrawingBuffer: false,
        powerPreference: "high-performance"
      });

      if (!gl) {
        // Graceful fallback: paint a static linear gradient via inline CSS so
        // the hero still reads as a dark canvas if WebGL is unavailable.
        mountStyle.background = "linear-gradient(180deg, #050505 0%, #0A1F14 60%, #000000 100%)";
        return;
      }

      var program = buildProgram(gl);
      if (!program) {
        mountStyle.background = "linear-gradient(180deg, #050505 0%, #0A1F14 60%, #000000 100%)";
        return;
      }
      gl.useProgram(program);

      // Single fullscreen quad — two triangles, four vertices via TRIANGLE_STRIP.
      var quad = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
      var buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, quad, gl.STATIC_DRAW);
      var aPos = gl.getAttribLocation(program, "aPos");
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

      // Uniform locations — cached once, used per frame.
      var u = {
        time:         gl.getUniformLocation(program, "uTime"),
        res:          gl.getUniformLocation(program, "uRes"),
        mouse:        gl.getUniformLocation(program, "uMouse"),
        amp:          gl.getUniformLocation(program, "uAmp"),
        streakCount:  gl.getUniformLocation(program, "uStreakCount"),
        bloomSamples: gl.getUniformLocation(program, "uBloomSamples"),
        palette:      gl.getUniformLocation(program, "uPalette[0]"),
        darkTop:      gl.getUniformLocation(program, "uDarkTop"),
        darkMid:      gl.getUniformLocation(program, "uDarkMid"),
        darkBottom:   gl.getUniformLocation(program, "uDarkBottom")
      };

      // Upload the brand palette — flat array of 8*3 floats.
      var paletteFlat = new Float32Array(24);
      for (var i = 0; i < 8; i++) {
        paletteFlat[i * 3 + 0] = SPECTRUM[i][0];
        paletteFlat[i * 3 + 1] = SPECTRUM[i][1];
        paletteFlat[i * 3 + 2] = SPECTRUM[i][2];
      }
      gl.uniform3fv(u.palette, paletteFlat);
      gl.uniform3fv(u.darkTop,    new Float32Array(DARK_TOP));
      gl.uniform3fv(u.darkMid,    new Float32Array(DARK_MID));
      gl.uniform3fv(u.darkBottom, new Float32Array(DARK_BOTTOM));

      // State.
      var state = {
        startTs: performance.now(),
        running: true,
        rafId: 0,
        mouseUv: [-1, -1],
        prefersReducedMotion: window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        pointerFine: window.matchMedia && window.matchMedia("(pointer: fine)").matches,
        renderedOnce: false,
        currentStreaks: 5,
        currentBloomSamples: 8,
        renderScale: 1
      };

      function resize() {
        var isMobile = window.innerWidth < CONFIG.mobileBreakpoint;
        state.currentStreaks = isMobile ? CONFIG.mobileStreaks : CONFIG.desktopStreaks;
        state.currentBloomSamples = isMobile ? 4 : 8;
        state.renderScale = isMobile ? CONFIG.mobileScale : 1.0;

        var dpr = Math.min(window.devicePixelRatio || 1, CONFIG.desktopDPR);
        var w = mount.clientWidth || window.innerWidth;
        var h = mount.clientHeight || window.innerHeight;
        var bw = Math.max(1, Math.floor(w * dpr * state.renderScale));
        var bh = Math.max(1, Math.floor(h * dpr * state.renderScale));
        if (canvas.width !== bw || canvas.height !== bh) {
          canvas.width = bw;
          canvas.height = bh;
        }
        gl.viewport(0, 0, bw, bh);
      }

      function render() {
        if (!state.running) return;
        // Time: when reduced-motion is on, freeze at t=8s — a pleasant phase
        // of the composition where streaks are mid-cross. We still draw ONCE
        // so the first paint shows the static frame, then we stop.
        var elapsedMs = performance.now() - state.startTs;
        var t = state.prefersReducedMotion ? 8.0 : (elapsedMs * 0.001) * CONFIG.baseSpeed;

        // Audio reactive amp — clamped 0..1.
        var amp = 0;
        if (window.wwhHeroAudio && typeof window.wwhHeroAudio.amp === "number") {
          amp = Math.max(0, Math.min(1, window.wwhHeroAudio.amp * CONFIG.audioGain));
        }

        gl.uniform1f(u.time, t);
        gl.uniform2f(u.res, canvas.width, canvas.height);
        gl.uniform2f(u.mouse, state.mouseUv[0], state.mouseUv[1]);
        gl.uniform1f(u.amp, amp);
        gl.uniform1i(u.streakCount, state.currentStreaks);
        gl.uniform1i(u.bloomSamples, state.currentBloomSamples);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        if (state.prefersReducedMotion) {
          // Paint exactly one frame and stop.
          if (state.renderedOnce) {
            state.running = false;
            return;
          }
          state.renderedOnce = true;
          state.rafId = requestAnimationFrame(render);
          return;
        }
        state.rafId = requestAnimationFrame(render);
      }

      function onPointerMove(e) {
        if (!state.pointerFine) return;
        var rect = canvas.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width;
        var y = 1.0 - (e.clientY - rect.top) / rect.height;
        // Clamp into 0..1 so off-canvas movement doesn't push streaks outside.
        state.mouseUv[0] = Math.max(0, Math.min(1, x));
        state.mouseUv[1] = Math.max(0, Math.min(1, y));
      }

      function onVisibility() {
        if (document.hidden) {
          state.running = false;
          if (state.rafId) cancelAnimationFrame(state.rafId);
        } else if (!state.prefersReducedMotion || !state.renderedOnce) {
          if (!state.running) {
            state.running = true;
            state.rafId = requestAnimationFrame(render);
          }
        }
      }

      function destroy() {
        state.running = false;
        if (state.rafId) cancelAnimationFrame(state.rafId);
        window.removeEventListener("resize", resize);
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("visibilitychange", onVisibility);
        window.removeEventListener("pagehide", destroy);
        // Free GL resources.
        try {
          gl.deleteBuffer(buf);
          gl.deleteProgram(program);
          var ext = gl.getExtension("WEBGL_lose_context");
          if (ext) ext.loseContext();
        } catch (err) { /* swallow — page is going away */ }
        if (canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }

      // Wire it all up.
      resize();
      window.addEventListener("resize", resize, { passive: true });
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("visibilitychange", onVisibility);
      window.addEventListener("pagehide", destroy);

      // Boot.
      state.rafId = requestAnimationFrame(render);
    });
  }

  // Self-init on DOM ready (or immediately if the script was loaded after).
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
