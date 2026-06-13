/* WildWooHoo - splash hero showreel
   Absolute paths (so subpages work) + per-page deck via body[data-deck].
   Each deck is 4 images that get populated into the two showreel tracks.
   2026-06-12: wrapped in an IIFE so nothing leaks onto window (the file
   used to declare five top-level globals). */

(function () {
  'use strict';

var SHOWREEL_DECKS = {
  // Home - WELI 2026-06-06 (revised): 'use only these two.. they are the
  // recreation of one another. easier to tell the message.'
  // The studio's entire thesis - 'we are the same animal' - collapsed into
  // two leaping frames that mirror each other's pose. Every beat = the
  // parallel. Every cut = the recreation. No third image needed; the
  // alternation IS the argument.
  home: [
    "/assets/img/03-kangaroo-weli.jpg",   /* the kangaroo (source) */
    "/assets/img/04-leaping-weli.jpg"     /* WELI recreating the leap */
  ],
  // Music & Video - KT video photography
  music: [
    "/assets/img/20231015_KangarooTime-ballet02424.jpg",
    "/assets/img/20231015_KangarooTime-dragqueen02359.jpg",
    "/assets/img/20231015_KangarooTime-samba02219.jpg",
    "/assets/img/20231015_KangarooTime-groupallmodels02246-2.jpg"
  ],
  // Educational - kids events only. Kanga-Kangaroo animation stills are
  // intentionally kept OUT of the showreel and surfaced lower on the page
  // (Current directions + Kanga-Kangaroo section), per WELI 2026-05-28.
  educational: [
    "/assets/img/KT%20kids%20event1.jpg",
    "/assets/img/KT%20kids%20event1singer.jpg",
    "/assets/img/KT%20kids%20event2.jpg",
    "/assets/img/KT%20kids%20event1-aeral.jpg",
    "/assets/img/KT%20kids%20eventbackaeral.jpg"
  ],
  // Projects - across project visuals
  projects: [
    "/assets/img/20231015_KangarooTime-videocover02293.jpg",
    "/assets/img/Animation-Kanga-Kangaroo.jpg",
    "/assets/img/man-longhair-goldenhour.jpg",
    "/assets/img/04-leaping-weli.jpg"
  ],
  // Impact - animal-behaviour photography
  impact: [
    "/assets/img/kangaroo-playfight.jpg",
    "/assets/img/human-group-models-playingkangaroogroup.jpg",
    "/assets/img/kangaroo_silhuette-sunset.jpg",
    "/assets/img/kangaroo-hogdeer-encounter.jpg"
  ]
};

function getShowreelImages() {
  var deck = (document.body && document.body.dataset && document.body.dataset.deck) || "home";
  // 2026-06-05 alias map: new wing slugs -> legacy deck keys so showreel still
  // populates after the brand-evolution rename. Add explicit decks here as
  // each wing curates its own selection.
  var ALIAS = {
    "music-and-entertainment": "music",
    "research-and-educational": "educational",
    "studio":                   "projects",
    "collaborate":              "home"
  };
  var resolved = ALIAS[deck] || deck;
  return SHOWREEL_DECKS[resolved] || SHOWREEL_DECKS.home;
}

function makeCard(src, sizeClass, loadingMode) {
  var item = document.createElement("div");
  item.className = ("showreel-item " + (sizeClass || "")).trim();

  var img = document.createElement("img");
  img.src = src;
  img.alt = "";
  /* 2026-06-12: was loading='eager' on every card - 12 repeats of
     0.5-1.7MB masters would all fetch up front. First card paints
     immediately, the rest lazy-load as they approach the viewport. */
  img.loading = loadingMode || "lazy";

  item.appendChild(img);
  return item;
}

function populateTrack(trackId, pattern) {
  var track = document.getElementById(trackId);
  if (!track) return;
  var images = getShowreelImages();
  pattern = pattern || [];

  for (var repeat = 0; repeat < 3; repeat++) {
    images.forEach(function (src, index) {
      var sizeClass = pattern[index % pattern.length] || "";
      var loadingMode = (repeat === 0 && index === 0) ? "eager" : "lazy";
      track.appendChild(makeCard(src, sizeClass, loadingMode));
    });
  }
}

/* Track-coupling config. Canonical values live in window.WWH_TRACK (defined
   by wwh-hero-universe.js); the fallbacks here mirror them so the leap
   engine still freezes the outro correctly if that script never loads.
   Read lazily because hero-universe loads with defer, after this file. */
function getOutroFreezeMs() {
  var cfg = window.WWH_TRACK;
  if (cfg && typeof cfg.outroMs === "number" && typeof cfg.kickOffsetMs === "number") {
    return cfg.outroMs - cfg.kickOffsetMs;
  }
  return 126050; /* 134000ms outro - 7950ms kick offset */
}

/* =============================================================================
   LEAP SEQUENCE (home page) - WELI 2026-06-06.
   Replace the dual-drifting-track showreel with a hard-cut alternating
   leap sequence. Photos cut to the beat when music plays; default 2400ms
   cadence when silent. Animal -> human -> animal -> human, looping. The
   tracks A/B from the legacy showreel are hidden on the home page; other
   pages still use the drifting tracks via populateTrack() above.
   ========================================================================== */
function injectLeapSequence() {
  var splash = document.querySelector('.wwh-splash');
  var splashBg = document.querySelector('.wwh-splash-bg');
  if (!splash || !splashBg) return;
  var reduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var trackA = document.getElementById('trackA');
  var trackB = document.getElementById('trackB');
  if (trackA) trackA.style.display = 'none';
  if (trackB) trackB.style.display = 'none';

  /* 2026-06-12: index.html ships a static fallback frame
     (<img class="wwh-splash-static"> inside .wwh-splash-bg) so the hero
     still shows photography when JS never runs. Once the JS-built
     sequence is mounted below, the static frame is hidden; if injection
     fails before that point, the static image stays visible. */
  var staticFallback = splashBg.querySelector('.wwh-splash-static');

  var seq = document.createElement('div');
  seq.className = 'wwh-leap-sequence';
  seq.setAttribute('aria-hidden', 'true');

  /* Subject metadata - mono tech labels swap with the active frame so the
     monitor reads as a real HUD readout (SUBJECT A: KANGAROO -> SUBJECT B:
     WELI -> ...). The brand thesis 'we are the same animal' becomes a
     scientific comparison study, frame by frame. */
  var SUBJECT_META = [
    '[ SUBJECT A · KANGAROO · MACROPUS GIGANTEUS ]',
    '[ SUBJECT B · WELI · HOMO SAPIENS ]'
  ];

  var photos = SHOWREEL_DECKS.home;
  var imgs = [];
  photos.forEach(function (src, i) {
    var img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.loading = i === 0 ? 'eager' : 'lazy';
    img.className = 'wwh-leap-frame' + (i === 0 ? ' is-active' : '');
    seq.appendChild(img);
    imgs.push(img);
  });
  /* Mount the monitor onto the splash (NOT splash-bg) so it positions
     relative to the full splash viewport, not the splash-bg's z context.
     Splash-bg keeps the galaxy backdrop alone. */
  splash.appendChild(seq);

  /* JS track is mounted - retire the static no-JS frame. */
  if (staticFallback) staticFallback.style.display = 'none';

  /* Mono metadata label below the monitor - updates per cut */
  var label = document.createElement('div');
  label.className = 'wwh-leap-label';
  label.setAttribute('aria-hidden', 'true');
  label.textContent = SUBJECT_META[0];
  splash.appendChild(label);

  /* 2026-06-12: honour prefers-reduced-motion. The hard cuts + glitch
     flashes are pure motion decoration; reduced-motion users keep the
     first frame and its label, music still plays via the universe
     script, and no rAF loop ever starts. */
  if (reduced) return;

  var current = 0;
  var totalFrames = imgs.length;
  var lastAdvance = performance.now();
  var MIN_GAP_MS = 280;
  /* WELI 2026-06-06: 'use the info of the bpm to make the transition on
     beat.' Lock cuts to BPM beats when music plays. Default: cut every
     2 beats (half-bar) at 123.78 BPM = ~969ms. wwhTrackStart and
     wwhTrackBPM are set globally when the music button starts playback. */
  var BEATS_PER_CUT = 2;
  var lastBeatTriggered = -1;

  function advance() {
    imgs[current].classList.remove('is-active', 'is-flash');
    current = (current + 1) % totalFrames;
    var next = imgs[current];
    next.classList.add('is-active', 'is-flash');
    /* High-tech cut: glitch animation runs 320ms on the new frame.
       Scanline overlay runs in parallel via .is-cutting on the parent.
       Both classes auto-strip after the animation completes so the
       hold state takes over cleanly. */
    seq.classList.add('is-cutting');
    /* Update the mono metadata label - subject A / subject B */
    label.textContent = SUBJECT_META[current];
    label.classList.add('is-cutting');
    window.setTimeout(function () {
      next.classList.remove('is-flash');
      seq.classList.remove('is-cutting');
      label.classList.remove('is-cutting');
    }, 340);
    lastAdvance = performance.now();
  }

  /* WELI 2026-06-08: 'the flow makes more sense with the music - it is
     a bit too unsincronised yet.' Sax (mid-band) and violin (hi-band)
     peak triggers REMOVED so every cut locks to the BPM kick. The
     earlier 2026-06-06 attempt to map sax + violin peaks added cuts
     between BPM beats that read as off-rhythm. BPM-only now.

     WELI 2026-06-08: 'at 2.14 sec the outro starts. From there can you
     stop in just one of the photos? Currently the photo changing with
     the previous drum beat but there is not drums there.' Outro at
     audio time 2:14 = 134000ms. wwhTrackStart sits at audio + 7950ms
     (see hero-universe), so elapsed-since-trackStart at the outro is
     134000 - 7950 = 126050ms. After that, freeze on the current photo
     for the remainder of the track. */
  function tick() {
    var now = performance.now();
    var trackStart = window.wwhTrackStart;
    var bpm = window.wwhTrackBPM;

    if (trackStart && bpm) {
      var beatMs = 60000 / bpm;
      var elapsed = now - trackStart;

      /* Outro freeze: skip all cut triggers after the violin takes over. */
      if (elapsed >= getOutroFreezeMs()) {
        requestAnimationFrame(tick);
        return;
      }

      if (elapsed >= 0 && (now - lastAdvance) > MIN_GAP_MS) {
        /* BPM clock half-bar only (every 2 beats = ~970ms at 123.78 BPM). */
        var currentBeat = Math.floor(elapsed / beatMs);
        if (currentBeat >= 0 &&
            currentBeat !== lastBeatTriggered &&
            currentBeat % BEATS_PER_CUT === 0) {
          lastBeatTriggered = currentBeat;
          advance();
        }
      }
    }
    /* Silent fallback removed - first frame holds until music starts. */
    requestAnimationFrame(tick);
  }

  /* 2026-06-12: the rAF loop used to spin from page load doing nothing
     until music started. Start it on the first music-state event from
     the music button instead (zero work before the first play). Once
     started it keeps running, matching the previous post-play behaviour
     across pause/resume. */
  var loopStarted = false;
  function startLoop() {
    if (loopStarted) return;
    loopStarted = true;
    requestAnimationFrame(tick);
  }
  window.addEventListener('wwh:music-state-changed', startLoop);
  if (window.wwhTrackStart) startLoop();
}

/* Decide which showreel to mount based on the page deck. */
var deck = (document.body && document.body.dataset && document.body.dataset.deck) || 'home';
if (deck === 'home' || deck === '') {
  injectLeapSequence();
} else {
  populateTrack('trackA', ['large', '', 'small', '', 'large']);
  populateTrack('trackB', ['', 'small', 'large', '', 'small']);
}

})();
