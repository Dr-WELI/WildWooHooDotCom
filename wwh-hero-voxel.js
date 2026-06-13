/* =============================================================================
   wwh-hero-voxel.js - WildWooHoo M&E signature hero: voxelised kangaroo.

   What this is:
   The hero piece for the Music & Entertainment splash. Reference:
   Robert Borghesi's astrodither hand (https://www.awwwards.com/sites/astrodither).
   Same compositional language - black void, voxelised 3D form, floating
   chromatic-dispersion debris, click-to-enter gate, audio-reactive motion -
   but the hand becomes a kangaroo silhouette in side profile (WildWooHoo IS
   the kangaroo studio; the kangaroo is the mark).

   The kangaroo bitmap is hand-drawn in this file as a 40x60 grid of strings.
   It is extruded forward in Z by 7 cells with subtle taper so the form reads
   as a solid sculpture from any angle, then voxelised through a single
   THREE.InstancedMesh of BoxGeometry instances for performance.

   Reference vibe: Borghesi's hot pink hand becomes a pink/lavender/violet
   kangaroo (WildWooHoo brand spectrum: spectrum-red, spectrum-lavender,
   spectrum-violet) at the centre of a black void with ~100 small debris
   objects drifting outward, each smearing RGB-split trails behind them.

   Why Three.js (not vanilla WebGL):
   - InstancedMesh trivially scales to ~5000 voxels at 60fps
   - 3D math (camera dolly, scene rotation, light) is one-liners
   - Single CDN script tag is GitHub-Pages-clean
   - The previous hero-canvas remains as the ambient background under it

   Mount: looks for `.wwh-hero-voxel-mount` and inserts a <canvas> at z-index 3,
   an HTML HUD layer at z-index 4 (timer, brand chip), and a click-to-enter
   gate <button> at z-index 5.

   Audio hook: reads window.wwhHeroAudio.amp (0..1) and html.is-audio-beat
   each frame, driving per-voxel bob, debris radial velocity, RGB-split
   offsets, HUD opacity pulses, and brief saturation flashes on beats.

   Click gate: on first click, gate fades out, the wwh-audio-reactive.js
   listen button is virtually clicked to start the vignette track, the
   tagline "What we evolved for" types itself out character by character,
   and the scene desaturation lifts to 100%.

   Mobile (<760px): voxel count drops to ~1500, debris drops to 40, RGB-split
   is disabled (single-pass debris), button label becomes "Tap to enter".

   Reduced motion: scene freezes at t=8s in a beautiful static frame, debris
   stops, breath stops; audio + tagline still fire (motion is what's reduced,
   not content).

   Tab hidden: pause RAF. Pagehide: dispose geometries, materials, renderer,
   lose WebGL context.

   File self-initialises on script load (waits for THREE if necessary).
   Cleans up on `pagehide`.
   ========================================================================== */

(function () {
  "use strict";

  /* --------------------------------------------------------------------------
     Constants - brand spectrum (USE ONLY THESE).
     The voxel kangaroo body cycles through red/lavender/violet so the mottled
     pink-purple read matches Borghesi's hand. Other spectrum shades are
     reserved for debris accents.
     -------------------------------------------------------------------------- */

  var BRAND = {
    cream:    "#FBF7EE",
    red:      0xC97A66, // spectrum-red - warm pink-coral
    peach:    0xD89E78,
    honey:    0xE5B96D,
    savanna:  0x27A05B,
    amber:    0xB07F30,
    sage:     0xB59B6D,
    lavender: 0x9985A8,
    violet:   0x7D6E92
  };

  // The kangaroo body cycles through these three for the mottled-pink look.
  var BODY_PALETTE = [BRAND.red, BRAND.lavender, BRAND.violet];

  // Debris pulls from the whole spectrum so the scattered cubes feel like
  // the brand exploding outward from the central form.
  var DEBRIS_PALETTE = [
    BRAND.red, BRAND.peach, BRAND.honey, BRAND.sage,
    BRAND.lavender, BRAND.violet
  ];

  /* --------------------------------------------------------------------------
     CONFIG - tuning knobs. Defaults are desktop; mobile gets clamped variants.
     -------------------------------------------------------------------------- */

  var CONFIG = {
    mobileBreakpoint: 760,
    desktopDPR: 2,

    // Voxel cube size (world units). Smaller = more granular but expensive.
    voxelSize: 0.18,
    voxelGap: 0.02, // visible cube-grid gap between voxels

    // Z-extrusion depth in cells (kangaroo bitmap is 2D, we push it into 3D).
    // Tapered: front and back slices are smaller than the middle.
    extrudeDepth: 7,

    // Debris counts.
    desktopDebris: 110,
    mobileDebris: 40,
    debrisVolume: 12,         // half-cube extent for debris field

    // Per-voxel breath amplitude (world units, base - audio amp boosts +30%).
    breathAmplitude: 0.04,
    breathSpeed: 0.9,

    // Scene rotation cycle (seconds per full Y rotation).
    rotationCycleSeconds: 30,

    // Camera dolly cycle (seconds).
    dollyCycleSeconds: 25,
    dollyAmplitude: 1.6,      // world units (zoom in/out range)
    cameraDistance: 9.0,      // base camera Z

    // RGB-split offset for debris (world units, base - audio amp doubles it).
    rgbSplitX: 0.04,

    // Hold-for-speed multiplier (mouse-down or space pressed).
    speedMultiplier: 3.0,

    // Tagline reveal.
    taglineText: "What we evolved for",
    taglineCharMs: 50,        // ms per character typed
    taglineHoldMs: 4000,      // ms tagline stays after typing
    taglineFadeMs: 1000,

    // Gate fade out.
    gateFadeMs: 600,

    // Scene saturation lift on click (CSS filter target).
    initialSaturation: 0.7,
    finalSaturation: 1.0,
    saturationLiftMs: 1200
  };

  /* --------------------------------------------------------------------------
     KANGAROO BITMAP - hand-drawn side profile, 40 wide x 60 tall.

     '#' = solid voxel, '.' = empty.

     This is the silhouette as you read it left-to-right: tail on the LEFT
     curling down and back; powerful back leg under body; forearm + hand
     reaching FORWARD on the right; head + ears at top-right. The kangaroo
     is BOUNDING - sitting on its haunches with tail balancing behind.

     The bitmap is rendered with row 0 at the TOP, so y in 3D space is
     (rows - row - 1) * voxelSize to flip into world coordinates.

     If this silhouette ends up reading as something other than a kangaroo
     (dog, rat, hare, kangaroo-rat) the file says so honestly in the
     summary. The form below tries to nail:
       - Two upright ears on top (rows 0-3)
       - A long muzzle pointing right (rows 3-7)
       - A neck dropping into a thick body (rows 7-22)
       - Tiny forearms folded against the chest (rows 14-20)
       - A massive haunch + thigh dropping down (rows 22-45)
       - A long foot stretching FORWARD along the ground (rows 45-52)
       - A long thick tail curling DOWN and BACK (rows 30-58 on the left)
     -------------------------------------------------------------------------- */

  // Iconic side-profile kangaroo facing RIGHT, sitting upright on its
  // haunches (the resting "alert" pose kangaroos do - tail tripod-style
  // on the ground, body vertical, head looking ahead, small arms tucked).
  // This is the unambiguous kangaroo pose used on the Qantas tail and the
  // Australian coat of arms.
  //
  // Layout (top to bottom):
  //   rows 2-6   : two pointed ears
  //   rows 7-12  : head + muzzle pointing right
  //   rows 13-18 : neck dropping into chest
  //   rows 14-19 : small forearms folded in front
  //   rows 19-32 : upright torso narrowing toward the waist
  //   rows 33-44 : massive haunch curving back-down
  //   rows 41-56 : back leg dropping down + long foot stretching right on ground
  //   rows 34-58 : thick tail curving from torso DOWN-LEFT to long base on ground (left)
  //
  // The tail is fully connected to the torso at row 32-35 (no floating).
  // The whole figure rests on a "ground line" at rows 55-58 that joins the
  // tail tip (left), the back of the foot (centre), and the long toe tip
  // (right) - so the kangaroo reads as standing/sitting on a continuous base.

  var KANGAROO = [
    //         1111111111222222222233333333334
    //0123456789012345678901234567890123456789
    "........................................", // 0
    "........................................", // 1
    "..............................##........", // 2  ear-tip 1
    ".............................###.##.....", // 3  ear-tip 2
    ".............................######.....", // 4  ears
    "............................#######.....", // 5  ears merging into skull
    "...........................########.....", // 6  skull crown
    "..........................#########.....", // 7  forehead
    ".........................##########.....", // 8  brow + muzzle starts
    "........................############....", // 9  muzzle reaching right
    "........................#############...", // 10 full muzzle
    "........................#############...", // 11 mouth line
    ".........................###########....", // 12 jaw underline
    "..........................########......", // 13 neck top
    "..........................#######.......", // 14 narrow neck
    "..........................########......", // 15 shoulder
    ".........................##########.....", // 16 shoulder spread
    "........................############....", // 17 chest top
    ".......................#############....", // 18 chest
    "......................##############....", // 19 chest mid + tiny arms appearing
    ".....................##############.....", // 20
    ".....................##############.....", // 21 forearms tucked
    "......................############......", // 22 narrow under-arm
    "......................###########.......", // 23 belly top
    ".......................##########.......", // 24 belly
    "........................#########.......", // 25
    ".........................########.......", // 26 narrow waist
    "..........................######........", // 27 waist
    "..........................######........", // 28
    "..........................#######.......", // 29 waist starts widening into hips
    ".........................########.......", // 30
    "........................##########......", // 31 hip
    ".......................###########......", // 32 hip + tail join begins
    "......................############......", // 33 thigh top
    "................###########..########...", // 34 tail emerges left; thigh continues
    ".............################...######..", // 35 tail thickens; thigh peak
    "...........#################....######..", // 36 tail base; haunch peak
    "..........#################.....#####...", // 37 tail thick
    ".........###############........####....", // 38 tail curves
    "........##############..........####....", // 39 tail
    ".......##############...........####....", // 40 tail bending toward ground
    "......##############............####....", // 41 tail
    ".....##############.............#####...", // 42 tail
    "....##############..............######..", // 43 tail mid
    "....#############...............######..", // 44 tail; back leg curving forward now
    "....############................######..", // 45
    ".....##########................########.", // 46 tail nearly on ground; leg comes forward
    "......########................##########", // 47 leg lower; toes extend right
    ".......######................###########", // 48 leg meets foot
    "........####................############", // 49 ankle joins long foot
    "........####...............#############", // 50 foot stretches right
    "........####..............##############", // 51 toes spread
    ".........###.............###############", // 52
    "..........##............################", // 53 foot toe-tips
    "..........##...........#################", // 54
    "..........##..........##################", // 55 tail tip + long foot
    "..........#...........#################.", // 56 tail tapering; foot tapering
    "......................################..", // 57 foot only, sole tapers
    ".......................##############...", // 58 sole rear
    ".........................##########.....", // 59 heel
  ];

  // ROWS / COLS derived from the bitmap above.
  var KANGAROO_ROWS = KANGAROO.length; // 60
  var KANGAROO_COLS = KANGAROO[0].length; // 40

  /* --------------------------------------------------------------------------
     BOOT - wait for THREE.js to be available on window, then init.
     Three.js loads via CDN with `defer`, same as this script; we may race.
     -------------------------------------------------------------------------- */

  if (typeof window === "undefined" || !window.document) return;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitForThree, { once: true });
  } else {
    waitForThree();
  }

  function waitForThree() {
    if (window.THREE && window.THREE.WebGLRenderer) {
      init();
      return;
    }
    var attempts = 0;
    var poll = setInterval(function () {
      if (window.THREE && window.THREE.WebGLRenderer) {
        clearInterval(poll);
        init();
      } else if (++attempts > 80) {
        // 80 * 50ms = 4s. If THREE never loaded, give up silently and the
        // existing wwh-hero-canvas.js stays as the hero. No broken UI.
        clearInterval(poll);
      }
    }, 50);
  }

  /* --------------------------------------------------------------------------
     INIT - the whole scene lives in this closure. One mount per page.
     -------------------------------------------------------------------------- */

  function init() {
    var mounts = document.querySelectorAll(".wwh-hero-voxel-mount");
    if (!mounts.length) return;

    mounts.forEach(function (mount) {
      if (mount.dataset.wwhVoxelMounted === "1") return;
      /* 2026-06-12: mount-claim guard. wwh-hero-monogram.js targets the
         same .wwh-hero-voxel-mount and defines the same style IDs and
         __wwhVoxelAudioStarted global - the two cannot coexist. First
         script to claim a mount wins; the other skips it. */
      if (mount.dataset.wwhHeroClaimed) return;
      mount.dataset.wwhHeroClaimed = "voxel";
      mount.dataset.wwhVoxelMounted = "1";
      buildScene(mount);
    });
  }

  function buildScene(mount) {
    var THREE = window.THREE;

    // ---- Determine device profile ----------------------------------------
    var isMobile = window.innerWidth < CONFIG.mobileBreakpoint;
    var debrisCount = isMobile ? CONFIG.mobileDebris : CONFIG.desktopDebris;
    var rgbSplitEnabled = !isMobile;
    var reduced = window.matchMedia &&
                  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---- Style the mount itself ------------------------------------------
    // Absolute, fills the parent splash, sits ABOVE the existing showreel
    // and the previous hero-canvas (z-index 2 in their world) so the voxel
    // scene is unambiguously the hero. The sacred .wwh-splash-content lives
    // at z-index 4+ above this so the brand mark and tagline button are
    // never painted over.
    var ms = mount.style;
    ms.position = "absolute";
    ms.inset = "0";
    ms.zIndex = "3";
    // The mount itself never intercepts clicks. The gate button is the
    // ONE clickable child (pointer-events:auto on the button). After gate
    // dismiss, nothing in this stack blocks clicks - the manifesto button
    // and other splash-content elements above (z-index higher) stay
    // interactive throughout.
    ms.pointerEvents = "none";
    ms.overflow = "hidden";
    ms.background = "#000000";
    mount.setAttribute("aria-hidden", "true");

    // ---- Canvas ----------------------------------------------------------
    var canvas = document.createElement("canvas");
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.filter = "saturate(" + CONFIG.initialSaturation + ")";
    canvas.style.transition = "filter " + CONFIG.saturationLiftMs + "ms ease-out";
    canvas.setAttribute("aria-hidden", "true");
    mount.appendChild(canvas);

    // ---- Renderer --------------------------------------------------------
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: !isMobile,
        alpha: false,
        powerPreference: "high-performance"
      });
    } catch (e) {
      // Fall back to a static gradient so the splash still reads as dark.
      mount.style.background = "linear-gradient(180deg,#050505,#000)";
      return;
    }
    var dpr = Math.min(window.devicePixelRatio || 1, CONFIG.desktopDPR);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 1);
    renderer.setSize(mount.clientWidth || window.innerWidth,
                     mount.clientHeight || window.innerHeight, false);

    // ---- Scene + camera --------------------------------------------------
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    var camera = new THREE.PerspectiveCamera(
      42,
      (mount.clientWidth || window.innerWidth) /
      (mount.clientHeight || window.innerHeight),
      0.1,
      100
    );
    camera.position.set(0, 0, CONFIG.cameraDistance);
    camera.lookAt(0, 0, 0);

    // ---- Lighting --------------------------------------------------------
    // Minimal: a soft fill so faces read, plus a key from upper-front so the
    // voxel grid has visible shadow gradient. We rely on the per-instance
    // colour for the chromatic pop - lights only sculpt the form.
    var ambient = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambient);

    var key = new THREE.DirectionalLight(0xffffff, 0.85);
    key.position.set(2, 3, 4);
    scene.add(key);

    var rim = new THREE.DirectionalLight(0xC97A66, 0.35); // brand-red rim
    rim.position.set(-3, -1, -2);
    scene.add(rim);

    // ---- The kangaroo: voxelised --------------------------------------
    var kangarooGroup = buildKangaroo(THREE, isMobile);
    scene.add(kangarooGroup.group);

    // ---- The debris field ----------------------------------------------
    var debris = buildDebris(THREE, debrisCount, rgbSplitEnabled);
    scene.add(debris.group);

    // ---- HUD layer (HTML over the canvas) ------------------------------
    var hud = buildHUD(mount, isMobile);

    // ---- Click-to-enter gate -------------------------------------------
    var gate = buildGate(mount, isMobile);

    // ---- Tagline reveal element ----------------------------------------
    var tagline = buildTagline(mount);

    // ---- State ---------------------------------------------------------
    var state = {
      startTs:        performance.now(),
      running:        true,
      rafId:          0,
      reducedMotion:  reduced,
      isMobile:       isMobile,
      rgbSplit:       rgbSplitEnabled,
      gateOpen:       false,         // has user clicked yet?
      speedHeld:      false,         // mouse-down or space pressed?
      lastTime:       performance.now() / 1000,
      sceneSpeed:     1.0,
      currentSpeed:   1.0,
      lastBeatMs:     0,
      reducedFrozen:  false
    };

    // ---- Animate ------------------------------------------------------
    var clock = new THREE.Clock();

    function render() {
      if (!state.running) return;
      var dt = clock.getDelta();
      var elapsed = clock.elapsedTime;

      // ---- Audio amp + beat state ----
      var amp = 0;
      if (window.wwhHeroAudio && typeof window.wwhHeroAudio.amp === "number") {
        amp = Math.max(0, Math.min(1, window.wwhHeroAudio.amp));
      }
      var beating = document.documentElement.classList.contains("is-audio-beat");

      // ---- Speed (hold-for-speed) ----
      var targetSpeed = state.speedHeld ? CONFIG.speedMultiplier : 1.0;
      state.currentSpeed += (targetSpeed - state.currentSpeed) * 0.15;
      hud.setSpeed(state.currentSpeed);
      // Apply speed by stretching elapsed time only for motion code below.
      // Camera dolly, rotation, breath all read effectiveT.
      var effectiveT = elapsed * 1.0;
      // We accumulate a separate phase so changes in speed don't snap.
      state.speedPhase = (state.speedPhase || 0) + dt * state.currentSpeed;
      var phase = state.speedPhase;

      // ---- Reduced motion: paint t=8s static and stop after one frame ----
      if (state.reducedMotion) {
        if (!state.reducedFrozen) {
          // One paint at t=8s pose.
          updateKangaroo(kangarooGroup, 8.0, 0, false);
          updateDebris(debris, 8.0, 0, false, state.rgbSplit);
          kangarooGroup.group.rotation.y = (8.0 / CONFIG.rotationCycleSeconds) * Math.PI * 2;
          camera.position.z = CONFIG.cameraDistance + Math.sin(8.0 * (Math.PI * 2 / CONFIG.dollyCycleSeconds)) * CONFIG.dollyAmplitude;
          camera.lookAt(0, 0, 0);
          renderer.render(scene, camera);
          state.reducedFrozen = true;
        }
        // Tagline + gate logic still run as normal listeners - just no rAF.
        return;
      }

      // ---- Kangaroo: per-voxel breath + saturation pulse on beat ----
      updateKangaroo(kangarooGroup, phase, amp, beating);

      // ---- Kangaroo rotation + subtle wobble ----
      var rotPerSec = (Math.PI * 2) / CONFIG.rotationCycleSeconds;
      kangarooGroup.group.rotation.y += rotPerSec * dt * state.currentSpeed;
      kangarooGroup.group.rotation.x = Math.sin(phase * 0.12) * 0.04;
      kangarooGroup.group.rotation.z = Math.sin(phase * 0.09) * 0.025;

      // ---- Camera dolly in/out ----
      var dollyPhase = phase * (Math.PI * 2 / CONFIG.dollyCycleSeconds);
      camera.position.z = CONFIG.cameraDistance + Math.sin(dollyPhase) * CONFIG.dollyAmplitude
                        - amp * 0.25; // gentle pull-in on loud passages
      // Subtle audio-driven camera shake - clamped tiny so it's felt, not seen.
      camera.position.x = Math.sin(phase * 1.3) * 0.05 + (amp > 0.4 ? (Math.random() - 0.5) * 0.05 * amp : 0);
      camera.position.y = Math.cos(phase * 1.1) * 0.04 + (amp > 0.4 ? (Math.random() - 0.5) * 0.05 * amp : 0);
      camera.lookAt(0, 0, 0);

      // ---- Debris drift + RGB-split offset ----
      updateDebris(debris, phase, amp, beating, state.rgbSplit);

      // ---- HUD beat-pulse (opacity bump on beat) ----
      hud.pulse(beating);

      renderer.render(scene, camera);
      state.rafId = requestAnimationFrame(render);
    }

    // ---- Resize -------------------------------------------------------
    function onResize() {
      var w = mount.clientWidth || window.innerWidth;
      var h = mount.clientHeight || window.innerHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onResize, { passive: true });

    // ---- Tab visibility ------------------------------------------------
    function onVisibility() {
      if (document.hidden) {
        if (state.rafId) cancelAnimationFrame(state.rafId);
        state.running = false;
      } else if (!state.reducedMotion) {
        if (!state.running) {
          state.running = true;
          clock.start(); // reset delta so we don't jump on resume
          state.rafId = requestAnimationFrame(render);
        }
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    // ---- Speed: hold-for-speed (mouse-down + space) -------------------
    // Listen on window so it works after gate dismiss (when the mount is
    // pointer-events:none). The keydown/keyup branch ignores typing in
    // form fields by checking the target tag - the splash has no inputs
    // but the manifesto popup might in future.
    function onPointerDown(e) {
      // Don't activate speed when clicking the manifesto button etc.
      // Only count clicks that landed inside the splash hero area.
      if (!state.gateOpen) return; // ignore until gate dismissed
      var rect = mount.getBoundingClientRect();
      if (e.clientX < rect.left || e.clientX > rect.right ||
          e.clientY < rect.top  || e.clientY > rect.bottom) return;
      state.speedHeld = true;
    }
    function onPointerUp() { state.speedHeld = false; }
    function onKeyDown(e) {
      if (e.code !== "Space") return;
      var tag = (e.target && e.target.tagName) || "";
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      // Only activate after gate dismissed.
      if (!state.gateOpen) return;
      state.speedHeld = true;
    }
    function onKeyUp(e) { if (e.code === "Space") { state.speedHeld = false; } }
    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    // ---- Gate click handler -------------------------------------------
    gate.button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (state.gateOpen) return;
      state.gateOpen = true;

      // 1. Fade gate out.
      gate.fadeOut();

      // 2. Lift scene saturation.
      canvas.style.filter = "saturate(" + CONFIG.finalSaturation + ")";

      // 3. Start audio: click the wwh-audio-reactive Listen button if it
      //    exists. That script handles the AudioContext + AnalyserNode +
      //    /wwh-vignette.mp3 source, so we just trigger it.
      tryStartAudio();

      // 4. Type the tagline.
      tagline.reveal();
      // The mount is already pointer-events:none (set at boot). Only the
      // gate's <button> captures clicks via its own pointer-events:auto;
      // gate.fadeOut() sets its CSS to pointer-events:none too. Once
      // dismissed, the entire voxel stack is click-through and the
      // existing .wwh-splash-content stays interactive.
    });

    // ---- Cleanup on pagehide -------------------------------------------
    function destroy() {
      state.running = false;
      if (state.rafId) cancelAnimationFrame(state.rafId);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("pagehide", destroy);

      try { hud.stopTimer(); } catch (e) {}
      try {
        kangarooGroup.dispose();
        debris.dispose();
        renderer.dispose();
        var loseCtx = renderer.getContext().getExtension("WEBGL_lose_context");
        if (loseCtx) loseCtx.loseContext();
      } catch (err) { /* page going away */ }
    }
    window.addEventListener("pagehide", destroy);

    // ---- Boot the timer + speed display + rAF loop ---------------------
    hud.startTimer();
    onResize();
    state.rafId = requestAnimationFrame(render);
  }

  /* --------------------------------------------------------------------------
     buildKangaroo - voxelise the bitmap, build a single InstancedMesh, and
     pre-compute per-voxel offsets/phases for breath animation.

     Returns:
       group       - THREE.Group to add to scene
       instanced   - the InstancedMesh
       count       - how many voxels
       basePositions - Float32Array(count*3) of resting positions (for breath)
       phases       - Float32Array(count) per-voxel time offset
       dispose()    - frees geometry + material
     -------------------------------------------------------------------------- */

  function buildKangaroo(THREE, isMobile) {
    // Voxel cell-to-world transform: bitmap is 40x60, we want the kangaroo
    // to fit roughly within a 7-unit-tall scene volume. So voxelSize is
    // derived but we use the configured constant; the result is the
    // sculpture is naturally ~10.8 world units tall, which is too big - we
    // scale the whole group down to fit.
    var size = CONFIG.voxelSize;
    var step = size + CONFIG.voxelGap;

    // First pass: count visible voxels (including extrusion).
    var depth = CONFIG.extrudeDepth;
    // Taper: front/back slices smaller than middle. We use a 1D weight: the
    // middle slices include all '#' cells; the outer slices skip the
    // outermost rim cells (cells with a '.' neighbour).
    // Simpler implementation: tag each cell as core (deep) or rim (shallow).
    var isRim = []; // [row][col] = true if a rim cell (has a '.' neighbour)
    for (var r = 0; r < KANGAROO_ROWS; r++) {
      var rowArr = [];
      for (var c = 0; c < KANGAROO_COLS; c++) {
        if (KANGAROO[r][c] !== "#") { rowArr.push(false); continue; }
        // A cell is rim if any 4-neighbour is empty or off-grid.
        var rim = false;
        var neighbours = [[r-1,c],[r+1,c],[r,c-1],[r,c+1]];
        for (var n = 0; n < 4; n++) {
          var nr = neighbours[n][0], nc = neighbours[n][1];
          if (nr < 0 || nr >= KANGAROO_ROWS || nc < 0 || nc >= KANGAROO_COLS) {
            rim = true; break;
          }
          if (KANGAROO[nr][nc] !== "#") { rim = true; break; }
        }
        rowArr.push(rim);
      }
      isRim.push(rowArr);
    }

    // For each Z slice, decide whether each cell appears.
    // Middle slices (z in [2 .. depth-3]) include all '#' cells.
    // Outer slices include only NON-rim cells (creates the taper).
    var voxelList = []; // {cx, cy, cz}
    for (var z = 0; z < depth; z++) {
      var outer = (z < 2 || z > depth - 3);
      for (var rr = 0; rr < KANGAROO_ROWS; rr++) {
        for (var cc = 0; cc < KANGAROO_COLS; cc++) {
          if (KANGAROO[rr][cc] !== "#") continue;
          if (outer && isRim[rr][cc]) continue;
          voxelList.push({ cx: cc, cy: rr, cz: z });
        }
      }
    }

    var count = voxelList.length;

    // ---- On mobile, decimate to ~1500 voxels to stay within budget ----
    var MOBILE_CAP = 1500;
    if (isMobile && count > MOBILE_CAP) {
      // Random thin: keep every nth voxel. Stable seed not needed - same
      // bitmap every load.
      var keepRatio = MOBILE_CAP / count;
      var thinned = [];
      for (var i = 0; i < count; i++) {
        // Skew toward keeping core (non-rim middle) voxels.
        var v = voxelList[i];
        var coreBoost = (v.cz > 1 && v.cz < depth - 2 && !isRim[v.cy][v.cx]) ? 1.0 : 0.6;
        if (Math.random() < keepRatio * coreBoost + 0.05) thinned.push(v);
      }
      voxelList = thinned;
      count = voxelList.length;
    }

    // ---- Build the InstancedMesh ----
    var geom = new THREE.BoxGeometry(size, size, size);
    var mat = new THREE.MeshLambertMaterial({ vertexColors: false });
    var mesh = new THREE.InstancedMesh(geom, mat, count);
    mesh.frustumCulled = false;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

    // Per-instance colour (vertex colour-like, set via setColorAt API).
    var colorAttr = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3);
    mesh.instanceColor = colorAttr;
    // Three's docs say InstancedMesh has a setColorAt method that uses this
    // attribute - but only when the .instanceColor property is set first.

    // Bounds: bitmap is 40 wide, 60 tall. We centre at origin and scale to fit.
    var totalW = KANGAROO_COLS * step;
    var totalH = KANGAROO_ROWS * step;
    var totalD = depth * step;
    var cx0 = -totalW / 2 + step / 2;
    var cy0 = totalH / 2 - step / 2; // y flipped: row 0 at top
    var cz0 = -totalD / 2 + step / 2;

    // Per-voxel storage for breath animation.
    var basePos = new Float32Array(count * 3);
    var phases = new Float32Array(count);

    var dummy = new THREE.Object3D();
    var col = new THREE.Color();

    for (var k = 0; k < count; k++) {
      var v = voxelList[k];
      var wx = cx0 + v.cx * step;
      var wy = cy0 - v.cy * step;
      var wz = cz0 + v.cz * step;

      basePos[k * 3 + 0] = wx;
      basePos[k * 3 + 1] = wy;
      basePos[k * 3 + 2] = wz;

      // Per-voxel breath phase (deterministic from position so the pattern
      // is wave-like rather than noise-twitchy).
      phases[k] = (v.cx * 0.31 + v.cy * 0.27 + v.cz * 0.41);

      dummy.position.set(wx, wy, wz);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(1);
      dummy.updateMatrix();
      mesh.setMatrixAt(k, dummy.matrix);

      // Per-voxel colour: cycle through BODY_PALETTE with deterministic
      // jitter so adjacent voxels read differently (mottled pink look).
      var hueIdx = (v.cx * 7 + v.cy * 11 + v.cz * 3) % BODY_PALETTE.length;
      col.setHex(BODY_PALETTE[hueIdx]);
      // Tiny brightness jitter per voxel for noise.
      var jitter = 0.85 + ((v.cx * 13 + v.cy * 17 + v.cz * 19) % 30) / 100;
      col.multiplyScalar(jitter);
      mesh.setColorAt(k, col);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;

    // Wrap in a group so we can rotate/translate the whole sculpture.
    var group = new THREE.Group();
    // Scale the kangaroo down so it sits comfortably in the camera view.
    var targetHeight = 5.0; // world units tall
    var rawHeight = totalH;
    var scale = targetHeight / rawHeight;
    group.scale.setScalar(scale);
    // Drop the foot to ~ground (y = -2.0).
    group.position.y = 0;
    group.add(mesh);

    function updatePositions(phase, amp, beating) {
      // Per-voxel breath: y += sin(phase * breathSpeed + voxelPhase) * amp.
      // The amplitude is the configured breath amp, scaled by audio amp.
      var aBoost = 1.0 + amp * 0.3;
      var breath = CONFIG.breathAmplitude * aBoost;
      var speed = CONFIG.breathSpeed * (1.0 + amp * 0.6);
      // On beat, briefly puff up uniformly by 6% - caught by saturation
      // pulse below via colour scale.
      var beatScale = beating ? 1.06 : 1.0;
      for (var i = 0; i < count; i++) {
        var bx = basePos[i * 3 + 0];
        var by = basePos[i * 3 + 1];
        var bz = basePos[i * 3 + 2];
        var bob = Math.sin(phase * speed + phases[i]) * breath;
        dummy.position.set(bx, by + bob, bz);
        dummy.rotation.set(0, 0, 0);
        dummy.scale.setScalar(beatScale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }

    function dispose() {
      try { geom.dispose(); } catch (e) {}
      try { mat.dispose(); } catch (e) {}
    }

    return {
      group: group,
      instanced: mesh,
      count: count,
      basePositions: basePos,
      phases: phases,
      updatePositions: updatePositions,
      dispose: dispose
    };
  }

  /* --------------------------------------------------------------------------
     updateKangaroo - frame-by-frame call into kangarooGroup.updatePositions.
     We separate this so the calling code in init() reads linearly.
     -------------------------------------------------------------------------- */

  function updateKangaroo(kg, phase, amp, beating) {
    kg.updatePositions(phase, amp, beating);
  }

  /* --------------------------------------------------------------------------
     buildDebris - many small "asteroid" groups (each 3-6 mini cubes) drifting
     outward from the centre. If RGB-split is enabled, each debris piece is
     drawn three times (offset by ±rgbSplitX on X) tinted toward red / mid /
     blue-violet for the chromatic dispersion smear.

     Implementation: one InstancedMesh PER colour channel. Each instance
     index i across all three meshes describes the same "piece" - so
     animating channel A's transform also animates channels R and B by
     pulling the same per-instance basePos + velocity + size and adding the
     ±rgbSplitX offset.

     If RGB-split is disabled (mobile), just one InstancedMesh.
     -------------------------------------------------------------------------- */

  function buildDebris(THREE, count, rgbSplit) {
    // Each debris piece is itself a stack of 3-6 mini cubes; we don't model
    // that as separate geometry per piece - instead, each "piece" is a
    // single instanced cube and the visual richness comes from the
    // chromatic-split triple draw + colour variety. This stays cheap.
    var size = 0.09;
    var geom = new THREE.BoxGeometry(size, size, size);

    // Per-piece state arrays.
    var basePos = new Float32Array(count * 3);  // current world position
    var velocity = new Float32Array(count * 3); // unit-vector velocity * speed
    var scale = new Float32Array(count);         // size multiplier per piece

    var V = CONFIG.debrisVolume;

    for (var i = 0; i < count; i++) {
      // Random spawn within volume, biased outward from origin.
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 1.5 + Math.random() * (V * 0.4);
      basePos[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      basePos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      basePos[i * 3 + 2] = r * Math.cos(phi);

      // Outward unit velocity * piece-specific speed.
      var nx = basePos[i * 3 + 0];
      var ny = basePos[i * 3 + 1];
      var nz = basePos[i * 3 + 2];
      var len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
      var speed = 0.02 + Math.random() * 0.03; // world units per second
      velocity[i * 3 + 0] = (nx / len) * speed;
      velocity[i * 3 + 1] = (ny / len) * speed;
      velocity[i * 3 + 2] = (nz / len) * speed;

      scale[i] = 0.7 + Math.random() * 1.6; // varies cube size piece-to-piece
    }

    var meshes = []; // { mesh, offsetX, colour }
    var group = new THREE.Group();

    function makeChannel(offsetX, hex) {
      var m = new THREE.MeshBasicMaterial({
        color: hex,
        transparent: true,
        opacity: 0.85,
        blending: rgbSplit ? THREE.AdditiveBlending : THREE.NormalBlending,
        depthWrite: false
      });
      var inst = new THREE.InstancedMesh(geom, m, count);
      inst.frustumCulled = false;
      inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
      group.add(inst);
      meshes.push({ mesh: inst, offsetX: offsetX, material: m });
    }

    if (rgbSplit) {
      // Three channels - additive blend produces the smear.
      makeChannel(+CONFIG.rgbSplitX, 0xff6677);  // warm red-pink
      makeChannel(0,                 0xFBF7EE);  // cream centre
      makeChannel(-CONFIG.rgbSplitX, 0x7D6E92);  // brand violet
    } else {
      // Single channel - pick a cream-ish brand colour per piece. We use a
      // single material with vertex colours not needed; just a base colour
      // and the per-piece variety isn't visible at debris size on mobile.
      makeChannel(0, 0xFBF7EE);
    }

    var dummy = new THREE.Object3D();

    function update(phase, amp, beating, splitOn) {
      // Per-piece drift: position += velocity * dt. We approximate dt by
      // taking the phase derivative - since phase advances at ~1.0 per
      // simulated second (with speed multiplier in caller's currentSpeed),
      // we use a fixed step here.
      // To keep this stable across frames, we update basePos in-place every
      // call. amp accelerates drift +50%.
      var dt = 1 / 60;
      var ampBoost = 1.0 + amp * 0.5;
      var offsetScale = (1.0 + amp * 1.0); // amp doubles RGB split when high

      for (var i = 0; i < count; i++) {
        basePos[i * 3 + 0] += velocity[i * 3 + 0] * ampBoost * dt;
        basePos[i * 3 + 1] += velocity[i * 3 + 1] * ampBoost * dt;
        basePos[i * 3 + 2] += velocity[i * 3 + 2] * ampBoost * dt;

        // Wrap: if outside the volume, respawn near centre.
        var x = basePos[i * 3 + 0];
        var y = basePos[i * 3 + 1];
        var z = basePos[i * 3 + 2];
        var dist = Math.sqrt(x * x + y * y + z * z);
        if (dist > CONFIG.debrisVolume) {
          // Respawn near the kangaroo with a fresh outward velocity.
          var theta = Math.random() * Math.PI * 2;
          var phi = Math.acos(2 * Math.random() - 1);
          var r = 0.5 + Math.random() * 1.5;
          x = r * Math.sin(phi) * Math.cos(theta);
          y = r * Math.sin(phi) * Math.sin(theta);
          z = r * Math.cos(phi);
          basePos[i * 3 + 0] = x;
          basePos[i * 3 + 1] = y;
          basePos[i * 3 + 2] = z;
          var nl = Math.sqrt(x * x + y * y + z * z) || 1;
          var speed = 0.02 + Math.random() * 0.03;
          velocity[i * 3 + 0] = (x / nl) * speed;
          velocity[i * 3 + 1] = (y / nl) * speed;
          velocity[i * 3 + 2] = (z / nl) * speed;
        }

        // Tiny per-piece spin (no orientation tracking, just a wobble).
        var spin = Math.sin(phase * 0.6 + i * 0.37) * 0.6;
        var spinY = Math.sin(phase * 0.5 + i * 0.41) * 0.4;
        var spinZ = Math.sin(phase * 0.45 + i * 0.49) * 0.3;

        // Push the transforms into each channel mesh, applying ±rgbSplitX
        // offset on X for the R / B channels.
        var s = scale[i] * (beating ? 1.15 : 1.0);
        for (var c = 0; c < meshes.length; c++) {
          var ch = meshes[c];
          dummy.position.set(
            x + ch.offsetX * offsetScale,
            y,
            z
          );
          dummy.rotation.set(spin, spinY, spinZ);
          dummy.scale.setScalar(s);
          dummy.updateMatrix();
          ch.mesh.setMatrixAt(i, dummy.matrix);
        }
      }
      for (var m = 0; m < meshes.length; m++) {
        meshes[m].mesh.instanceMatrix.needsUpdate = true;
      }
    }

    function dispose() {
      try { geom.dispose(); } catch (e) {}
      for (var i = 0; i < meshes.length; i++) {
        try { meshes[i].material.dispose(); } catch (e) {}
      }
    }

    return {
      group: group,
      update: update,
      dispose: dispose
    };
  }

  function updateDebris(d, phase, amp, beating, rgbSplit) {
    d.update(phase, amp, beating, rgbSplit);
  }

  /* --------------------------------------------------------------------------
     buildHUD - the minimal Borghesi-style HUD overlay (HTML, not canvas).
     Top-left brand chip, top-right scene name, bottom-left running timer,
     bottom-right hold-for-speed indicator.

     Mounted INSIDE the mount so it inherits the mount's z-index stack.
     -------------------------------------------------------------------------- */

  function buildHUD(mount, isMobile) {
    var hud = document.createElement("div");
    hud.className = "wwh-voxel-hud";
    hud.setAttribute("aria-hidden", "true");

    var styleId = "wwh-voxel-hud-styles";
    if (!document.getElementById(styleId)) {
      var css =
        ".wwh-voxel-hud{position:absolute;inset:0;pointer-events:none;z-index:4;" +
          "font-family:'JetBrains Mono',ui-monospace,Menlo,Monaco,Consolas,monospace;" +
          "color:#FBF7EE;}" +
        ".wwh-voxel-hud > div{position:absolute;font-size:11px;letter-spacing:0.14em;" +
          "text-transform:uppercase;opacity:0.7;transition:opacity 120ms ease-out;}" +
        ".wwh-voxel-hud .hud-tl{top:18px;left:22px;}" +
        ".wwh-voxel-hud .hud-tr{top:18px;right:22px;}" +
        ".wwh-voxel-hud .hud-bl{bottom:18px;left:22px;font-variant-numeric:tabular-nums;}" +
        ".wwh-voxel-hud .hud-br{bottom:18px;right:22px;font-variant-numeric:tabular-nums;}" +
        ".wwh-voxel-hud.is-beat > div{opacity:0.9;}" +
        "@media(max-width:760px){" +
          ".wwh-voxel-hud > div{font-size:10px;}" +
          ".wwh-voxel-hud .hud-tl,.wwh-voxel-hud .hud-tr{top:12px;}" +
          ".wwh-voxel-hud .hud-tl,.wwh-voxel-hud .hud-bl{left:14px;}" +
          ".wwh-voxel-hud .hud-tr,.wwh-voxel-hud .hud-br{right:14px;}" +
          ".wwh-voxel-hud .hud-bl,.wwh-voxel-hud .hud-br{bottom:12px;}" +
        "}";
      var s = document.createElement("style");
      s.id = styleId;
      s.textContent = css;
      document.head.appendChild(s);
    }

    var tl = document.createElement("div");
    tl.className = "hud-tl";
    tl.textContent = "@WildWooHoo  |  What we evolved for";
    hud.appendChild(tl);

    var tr = document.createElement("div");
    tr.className = "hud-tr";
    tr.textContent = "M&E";
    hud.appendChild(tr);

    var bl = document.createElement("div");
    bl.className = "hud-bl";
    bl.textContent = "00:00:000";
    hud.appendChild(bl);

    var br = document.createElement("div");
    br.className = "hud-br";
    br.textContent = "HOLD FOR SPEED  |  1.00x";
    hud.appendChild(br);

    mount.appendChild(hud);

    // Timer.
    var startedAt = performance.now();
    var timerId = null;

    function fmt(ms) {
      var totalMs = Math.floor(ms);
      var minutes = Math.floor(totalMs / 60000);
      var seconds = Math.floor((totalMs % 60000) / 1000);
      var millis = totalMs % 1000;
      return pad2(minutes) + ":" + pad2(seconds) + ":" + pad3(millis);
    }
    function pad2(n) { return (n < 10 ? "0" : "") + n; }
    function pad3(n) { return (n < 10 ? "00" : (n < 100 ? "0" : "")) + n; }

    return {
      el: hud,
      startTimer: function () {
        if (timerId) return;
        // Use rAF-tick-rate update via setInterval at ~33ms (30Hz) - enough
        // for the eye, doesn't hammer the main thread.
        timerId = setInterval(function () {
          bl.textContent = fmt(performance.now() - startedAt);
        }, 33);
      },
      stopTimer: function () {
        if (timerId) { clearInterval(timerId); timerId = null; }
      },
      setSpeed: function (mul) {
        br.textContent = "HOLD FOR SPEED  |  " + mul.toFixed(2) + "x";
      },
      pulse: function (beating) {
        if (beating) hud.classList.add("is-beat");
        else hud.classList.remove("is-beat");
      }
    };
  }

  /* --------------------------------------------------------------------------
     buildGate - the click-to-enter overlay. A real <button> for a11y.
     -------------------------------------------------------------------------- */

  function buildGate(mount, isMobile) {
    var gate = document.createElement("div");
    gate.className = "wwh-voxel-gate";
    gate.setAttribute("aria-hidden", "false");

    var styleId = "wwh-voxel-gate-styles";
    if (!document.getElementById(styleId)) {
      var css =
        ".wwh-voxel-gate{position:absolute;inset:0;z-index:5;display:flex;" +
          "align-items:center;justify-content:center;background:rgba(0,0,0,0.0);" +
          // The whole gate captures clicks while visible so the button is
          // always hittable, even though the mount is pointer-events:none.
          "pointer-events:auto;" +
          "transition:opacity 600ms ease-out,visibility 600ms ease-out;}" +
        ".wwh-voxel-gate.is-fading{opacity:0;visibility:hidden;pointer-events:none;}" +
        ".wwh-voxel-gate-button{appearance:none;-webkit-appearance:none;background:transparent;" +
          "border:1px solid rgba(251,247,238,0.3);color:#FBF7EE;cursor:pointer;" +
          "padding:18px 36px;border-radius:6px;" +
          "font-family:'JetBrains Mono',ui-monospace,Menlo,Monaco,Consolas,monospace;" +
          "font-size:clamp(16px,1.5vw,22px);letter-spacing:0.10em;opacity:0.92;" +
          "transition:background 200ms ease,border-color 200ms ease,transform 200ms ease;" +
          "backdrop-filter:blur(2px);-webkit-backdrop-filter:blur(2px);" +
          "animation:wwh-voxel-gate-pulse 2.6s ease-in-out infinite;}" +
        ".wwh-voxel-gate-button:hover,.wwh-voxel-gate-button:focus-visible{" +
          "background:rgba(251,247,238,0.06);border-color:rgba(251,247,238,0.55);" +
          "outline:none;}" +
        ".wwh-voxel-gate-button:active{transform:translateY(1px);}" +
        ".wwh-voxel-gate-hint{display:block;margin-top:14px;font-family:'Inter',system-ui,sans-serif;" +
          "font-size:11px;letter-spacing:0.04em;color:#FBF7EE;opacity:0.5;text-transform:none;}" +
        "@keyframes wwh-voxel-gate-pulse{" +
          "0%,100%{box-shadow:0 0 0 0 rgba(251,247,238,0.10);}" +
          "50%{box-shadow:0 0 0 8px rgba(251,247,238,0.0);}}" +
        "@media(prefers-reduced-motion:reduce){" +
          ".wwh-voxel-gate-button{animation:none;}}";
      var s = document.createElement("style");
      s.id = styleId;
      s.textContent = css;
      document.head.appendChild(s);
    }

    var stack = document.createElement("div");
    stack.style.textAlign = "center";

    var button = document.createElement("button");
    button.type = "button";
    button.className = "wwh-voxel-gate-button";
    button.textContent = isMobile ? "[:: TAP TO ENTER + LISTEN ::]"
                                  : "[:: CLICK TO ENTER + LISTEN ::]";
    button.setAttribute("aria-label",
      "Enter the audio-reactive WildWooHoo scene. Sound recommended.");

    var hint = document.createElement("span");
    hint.className = "wwh-voxel-gate-hint";
    hint.textContent = "Audio reactive scene. Sound recommended.";

    stack.appendChild(button);
    stack.appendChild(hint);
    gate.appendChild(stack);
    mount.appendChild(gate);

    return {
      el: gate,
      button: button,
      fadeOut: function () {
        gate.classList.add("is-fading");
        gate.setAttribute("aria-hidden", "true");
      }
    };
  }

  /* --------------------------------------------------------------------------
     buildTagline - full-screen typed reveal of "What we evolved for".
     Sits ABOVE the gate (z-index 6) but is invisible until .reveal() is called.
     aria-live polite ensures screen readers announce once.
     -------------------------------------------------------------------------- */

  function buildTagline(mount) {
    var wrap = document.createElement("div");
    wrap.className = "wwh-voxel-tagline";
    wrap.setAttribute("aria-hidden", "true");

    var live = document.createElement("p");
    live.className = "wwh-voxel-tagline-text";
    live.setAttribute("aria-live", "polite");

    var caret = document.createElement("span");
    caret.className = "wwh-voxel-tagline-caret";
    caret.setAttribute("aria-hidden", "true");

    var styleId = "wwh-voxel-tagline-styles";
    if (!document.getElementById(styleId)) {
      var css =
        // Tagline lives at <body> level so it sits above the existing
        // .wwh-splash-content (z-index 4). It captures the screen briefly
        // (4s + 1s fade) for the typed reveal and gets out of the way after.
        // position:fixed + 100vh so the reveal centres in the viewport even
        // if the user has scrolled slightly during the gate fade.
        ".wwh-voxel-tagline{position:fixed;inset:0;z-index:9998;display:flex;" +
          "align-items:center;justify-content:center;pointer-events:none;" +
          "opacity:0;transition:opacity 1000ms ease-out;}" +
        ".wwh-voxel-tagline.is-on{opacity:1;}" +
        ".wwh-voxel-tagline-text{font-family:'Comfortaa',ui-rounded,system-ui,sans-serif;" +
          "font-weight:700;font-size:clamp(48px,7vw,96px);" +
          "letter-spacing:-0.02em;line-height:1.05;color:#FBF7EE;text-align:center;" +
          "margin:0;padding:0 24px;text-shadow:0 2px 28px rgba(0,0,0,0.6);}" +
        ".wwh-voxel-tagline-caret{display:inline-block;width:0.55em;height:1em;" +
          "vertical-align:-0.1em;margin-left:6px;background:#FBF7EE;" +
          "animation:wwh-voxel-caret-blink 1s steps(2,start) infinite;}" +
        "@keyframes wwh-voxel-caret-blink{50%{opacity:0;}}";
      var s = document.createElement("style");
      s.id = styleId;
      s.textContent = css;
      document.head.appendChild(s);
    }

    wrap.appendChild(live);
    wrap.appendChild(caret);
    // Attach to <body> so the reveal sits above everything (splash content
    // included). The `mount` parameter is kept for symmetry with the other
    // builders but isn't used as the parent here.
    document.body.appendChild(wrap);

    var typed = false;

    function reveal() {
      if (typed) return;
      typed = true;
      wrap.classList.add("is-on");
      wrap.setAttribute("aria-hidden", "false");
      var txt = CONFIG.taglineText;
      var i = 0;
      function step() {
        if (i < txt.length) {
          live.textContent = txt.slice(0, i + 1);
          i++;
          setTimeout(step, CONFIG.taglineCharMs);
        } else {
          // Done typing - drop the caret (stop the blink), hold, then fade.
          caret.style.display = "none";
          setTimeout(function () {
            wrap.style.transition = "opacity " + CONFIG.taglineFadeMs + "ms ease-out";
            wrap.classList.remove("is-on");
            // After fade fully completes, mark the wrap aria-hidden again so
            // assistive tech doesn't re-announce on focus changes.
            setTimeout(function () {
              wrap.setAttribute("aria-hidden", "true");
            }, CONFIG.taglineFadeMs + 50);
          }, CONFIG.taglineHoldMs);
        }
      }
      // Tiny lead-in so the gate fade is partly through.
      setTimeout(step, 220);
    }

    return { el: wrap, reveal: reveal };
  }

  /* --------------------------------------------------------------------------
     tryStartAudio - start the existing wwh-audio-reactive Listen pipeline.
     The other script injects a button with class .wwh-listen-toggle and
     handles the AudioContext + AnalyserNode + /wwh-vignette.mp3 loading.
     We just simulate the user-click event so the audio policy is satisfied
     (the gate click IS the user gesture; passing it through here keeps the
     policy unbroken).

     If for some reason that button is absent (audio script failed to mount),
     we fall back to a plain <audio> element with the same src. The
     AnalyserNode integration is lost in that case - window.wwhHeroAudio.amp
     stays 0 - but the audio still plays and the tagline still reveals.
     -------------------------------------------------------------------------- */

  function tryStartAudio() {
    // PRIMARY PATH: if the wwh-audio-reactive Listen button is already in
    // the DOM (body has class `aesthetic-v2`), we just click it. It owns
    // the AudioContext, AnalyserNode, beat detector, and window.wwhHeroAudio.
    var listenBtn = document.querySelector(".wwh-listen-toggle");
    if (listenBtn) {
      try { listenBtn.click(); return; } catch (e) { /* fall through */ }
    }

    // FALLBACK PATH: build our own minimal audio graph so the voxel scene
    // still gets amp data. The M&E page body has class "wwh-awal" rather
    // than "aesthetic-v2", so the audio reactive script bails on boot and
    // never mounts. Rather than mutate the page's class list (which the
    // brand layer reads for theming), we just re-implement the small
    // amp/beat pipeline here. Same /wwh-vignette.mp3 source, same -18 LUFS
    // master gain of 0.4, same 512-bin FFT.
    voxelAudioBoot();
  }

  function voxelAudioBoot() {
    if (window.__wwhVoxelAudioStarted) return;
    window.__wwhVoxelAudioStarted = true;

    var AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) {
      // No Web Audio. Fall further back to a plain <audio> with no analyser.
      plainAudioElement();
      return;
    }

    var ctx;
    try { ctx = new AudioCtx(); } catch (e) { plainAudioElement(); return; }

    var audioEl = document.createElement("audio");
    audioEl.id = "wwh-voxel-audio";
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
    var masterGain = ctx.createGain(); masterGain.gain.value = 0.4;

    source.connect(analyser);
    analyser.connect(fadeGain);
    fadeGain.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Expose the same shape the visual layer expects.
    if (!window.wwhHeroAudio) window.wwhHeroAudio = { amp: 0, lo: 0, mid: 0, hi: 0 };
    document.documentElement.style.setProperty("--audio-amp", "0");

    var resumePromise = ctx.state === "suspended" ? ctx.resume() : Promise.resolve();
    resumePromise.then(function () {
      var p = audioEl.play();
      if (p && typeof p.catch === "function") {
        p.catch(function () { /* policy/404 - give up */ });
      }
      var now = ctx.currentTime;
      fadeGain.gain.setValueAtTime(0, now);
      fadeGain.gain.linearRampToValueAtTime(1, now + 0.6);
    });

    // Tiny beat detector - same heuristic as wwh-audio-reactive.js.
    var beatHistory = [];
    var beatCooldown = 0;

    function tick() {
      analyser.getByteFrequencyData(freqBuf);
      var n = freqBuf.length;
      var loEnd = Math.floor(n * 0.125);
      var midEnd = Math.floor(n * 0.5);
      var loSum = 0, midSum = 0, hiSum = 0;
      for (var i = 0; i < loEnd; i++) loSum += freqBuf[i];
      for (i = loEnd; i < midEnd; i++) midSum += freqBuf[i];
      for (i = midEnd; i < n; i++) hiSum += freqBuf[i];
      var total = (loSum + midSum + hiSum) / (n * 255);
      var lo = loSum / (loEnd * 255);
      var mid = midSum / ((midEnd - loEnd) * 255);
      var hi = hiSum / ((n - midEnd) * 255);
      window.wwhHeroAudio.amp = window.wwhHeroAudio.amp * 0.4 + total * 0.6;
      window.wwhHeroAudio.lo  = window.wwhHeroAudio.lo  * 0.4 + lo  * 0.6;
      window.wwhHeroAudio.mid = window.wwhHeroAudio.mid * 0.4 + mid * 0.6;
      window.wwhHeroAudio.hi  = window.wwhHeroAudio.hi  * 0.4 + hi  * 0.6;
      document.documentElement.style.setProperty("--audio-amp",
        window.wwhHeroAudio.amp.toFixed(3));

      // Beat detection on bass-weighted energy.
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

    // Cleanup on pagehide.
    window.addEventListener("pagehide", function () {
      try { audioEl.pause(); audioEl.src = ""; audioEl.load(); } catch (e) {}
      try { source.disconnect(); analyser.disconnect();
            fadeGain.disconnect(); masterGain.disconnect(); } catch (e) {}
      try { if (ctx.state !== "closed") ctx.close(); } catch (e) {}
    });
  }

  function plainAudioElement() {
    if (document.getElementById("wwh-voxel-audio-plain")) return;
    var a = document.createElement("audio");
    a.id = "wwh-voxel-audio-plain";
    a.src = "/wwh-vignette.mp3?v=20260605";
    a.loop = true;
    a.preload = "auto";
    document.body.appendChild(a);
    var p = a.play();
    if (p && typeof p.catch === "function") {
      p.catch(function () { /* silent */ });
    }
  }
})();
