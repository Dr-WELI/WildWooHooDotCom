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

/* =============================================================================
   SHOWREEL BEAT MAP - WELI 2026-06-18.
   Fixed map of musical accents in Kangaroo Time (Instrumental). Each entry's
   t is the position IN THE SONG in milliseconds (audio-clock time, NOT
   wall-clock elapsed), b is the accent that lands there (kick / snare / sax /
   violin) for reference. Every cut in the leap sequence is driven by this map
   against the live audio clock, so each photo swap lands on a real accent
   instead of a synthetic BPM grid. First kick is at 7755ms (~8s in). The
   outro starts at 134000ms; the last mapped beat sits just before it.
   ========================================================================== */
var WWH_SHOWREEL_BEATS = [{t:7755,b:"kick"},{t:9694,b:"sax"},{t:11633,b:"snare"},{t:13572,b:"snare"},{t:15511,b:"snare"},{t:17450,b:"snare"},{t:19389,b:"snare"},{t:21328,b:"sax"},{t:23267,b:"sax"},{t:23752,b:"sax"},{t:24236,b:"snare"},{t:25206,b:"violin"},{t:26175,b:"snare"},{t:27145,b:"snare"},{t:28114,b:"snare"},{t:29084,b:"sax"},{t:29568,b:"sax"},{t:30053,b:"snare"},{t:31023,b:"violin"},{t:31992,b:"snare"},{t:32477,b:"sax"},{t:32961,b:"snare"},{t:33931,b:"snare"},{t:34416,b:"sax"},{t:34900,b:"snare"},{t:35385,b:"sax"},{t:36355,b:"sax"},{t:40717,b:"snare"},{t:41202,b:"sax"},{t:41687,b:"snare"},{t:42656,b:"kick"},{t:43141,b:"sax"},{t:43626,b:"snare"},{t:44595,b:"kick"},{t:45080,b:"sax"},{t:45564,b:"snare"},{t:46049,b:"kick"},{t:47019,b:"kick"},{t:47503,b:"kick"},{t:48473,b:"kick"},{t:48958,b:"sax"},{t:49442,b:"snare"},{t:50412,b:"kick"},{t:50897,b:"kick"},{t:51381,b:"kick"},{t:52351,b:"kick"},{t:52835,b:"snare"},{t:53805,b:"kick"},{t:54290,b:"kick"},{t:55986,b:"snare"},{t:56713,b:"kick"},{t:57198,b:"kick"},{t:57683,b:"kick"},{t:58167,b:"kick"},{t:59137,b:"kick"},{t:59622,b:"kick"},{t:60106,b:"kick"},{t:61076,b:"kick"},{t:61561,b:"kick"},{t:62530,b:"kick"},{t:63015,b:"kick"},{t:63500,b:"kick"},{t:63984,b:"kick"},{t:64954,b:"kick"},{t:65438,b:"kick"},{t:65923,b:"kick"},{t:66893,b:"kick"},{t:67377,b:"kick"},{t:67862,b:"kick"},{t:68832,b:"kick"},{t:69316,b:"kick"},{t:70770,b:"violin"},{t:71498,b:"snare"},{t:79496,b:"violin"},{t:83373,b:"violin"},{t:85312,b:"violin"},{t:87251,b:"sax"},{t:88221,b:"violin"},{t:89190,b:"violin"},{t:90160,b:"violin"},{t:90644,b:"kick"},{t:91129,b:"violin"},{t:92099,b:"violin"},{t:92583,b:"violin"},{t:93553,b:"violin"},{t:94038,b:"violin"},{t:95007,b:"violin"},{t:95977,b:"violin"},{t:96946,b:"violin"},{t:97915,b:"violin"},{t:98400,b:"kick"},{t:98885,b:"violin"},{t:99854,b:"violin"},{t:100339,b:"kick"},{t:100824,b:"snare"},{t:102763,b:"violin"},{t:103490,b:"snare"},{t:104702,b:"violin"},{t:105429,b:"snare"},{t:106641,b:"violin"},{t:107368,b:"kick"},{t:107852,b:"sax"},{t:108580,b:"violin"},{t:109064,b:"violin"},{t:109549,b:"violin"},{t:110518,b:"violin"},{t:111246,b:"kick"},{t:112457,b:"violin"},{t:113184,b:"snare"},{t:114396,b:"violin"},{t:115123,b:"snare"},{t:115608,b:"snare"},{t:116335,b:"violin"},{t:116820,b:"violin"},{t:117305,b:"kick"},{t:118032,b:"snare"},{t:118516,b:"sax"},{t:119244,b:"violin"},{t:120213,b:"violin"},{t:120698,b:"violin"},{t:121183,b:"violin"},{t:121667,b:"violin"},{t:122637,b:"violin"},{t:123121,b:"violin"},{t:124091,b:"violin"},{t:124576,b:"violin"},{t:125060,b:"violin"},{t:125545,b:"violin"},{t:126515,b:"violin"},{t:127484,b:"violin"},{t:127969,b:"violin"},{t:128453,b:"violin"},{t:128938,b:"violin"},{t:129423,b:"violin"},{t:130392,b:"violin"},{t:130877,b:"violin"},{t:131362,b:"violin"},{t:132331,b:"violin"},{t:132816,b:"snare"}];

/* =============================================================================
   LEAP SEQUENCE (home page) - WELI 2026-06-06.
   Replace the dual-drifting-track showreel with a hard-cut alternating
   leap sequence. Photos cut to real musical accents via WWH_SHOWREEL_BEATS,
   driven by the live audio clock when music plays; the first frame holds
   when silent. Animal -> human -> animal -> human, looping. The tracks A/B
   from the legacy showreel are hidden on the home page; other pages still
   use the drifting tracks via populateTrack() above.
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
  /* WELI 2026-06-18: cuts are now driven by the fixed WWH_SHOWREEL_BEATS map
     against the live audio clock (see tick() below). beatIdx is the pointer
     into that map - the index of the next accent we are waiting to land. */
  /* WELI 2026-06-22: cut sparingly and only on the strongest, best-spaced
     accents - rhythm precision matters far more than frequency. Keep only kick
     and snare hits at least MIN_CUT_GAP apart, so the photo changes 'every now
     and then' and always lands on a confident beat (soft sax/violin onsets,
     which read off-beat, no longer trigger a cut). */
  var MIN_CUT_GAP = 7000;
  var beats = (function (all) {
    var out = [], lastT = -1e9, i, b;
    for (i = 0; i < all.length; i++) {
      b = all[i];
      if ((b.b === 'kick' || b.b === 'snare') && (b.t - lastT) >= MIN_CUT_GAP) {
        out.push(b);
        lastT = b.t;
      }
    }
    return out;
  })(WWH_SHOWREEL_BEATS);
  var beatIdx = 0;
  /* Outro is the last mapped accent or 134000ms (audio time), whichever the
     song reaches first - after it we hold the current photo. */
  var OUTRO_MS = 134000;

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
  }

  /* WELI 2026-06-18: read the live SONG position in milliseconds. The audio
     element is the source of truth - audioEl.currentTime (seconds) is exactly
     where in the track we are, so the cuts follow the song, not a wall clock.
     Fall back to the wwhTrackStart wall-clock anchor only when the element is
     not present (e.g. a browser path that never created __wwhUniverseAudio).
     Returns null when nothing is playing so the engine holds.

     wwhTrackStart is anchored at performance.now() - currentTime*1000 +
     kickOffsetMs (see hero-universe), so audio-time = elapsed-since-anchor
     plus that same kick offset. The beat-map t values are real audio times,
     hence the offset is added back in here. */
  function readSongMs() {
    var u = window.__wwhUniverseAudio;
    if (u && u.audioEl && !u.audioEl.paused && !isNaN(u.audioEl.currentTime)) {
      return u.audioEl.currentTime * 1000;
    }
    var trackStart = window.wwhTrackStart;
    if (trackStart) {
      var cfg = window.WWH_TRACK;
      var kickOffset = (cfg && typeof cfg.kickOffsetMs === "number")
        ? cfg.kickOffsetMs : 7950;
      return (performance.now() - trackStart) + kickOffset;
    }
    return null;
  }

  /* Snap beatIdx to the first accent at or after songMs. Used on the first
     frame after load and whenever the clock jumps backwards (loop / resume /
     seek) so we never replay a flurry of already-passed beats. */
  function syncBeatIdx(songMs) {
    var i = 0;
    while (i < beats.length && beats[i].t < songMs) i++;
    beatIdx = i;
  }

  /* WELI 2026-06-18: beat-map engine. Each rAF tick reads the live song
     position and fires advance() for every mapped accent the clock has just
     crossed. A while-loop means a frame that jumps forward never silently
     skips an accent, but we cap it to ONE animated cut per frame: if several
     beats are already behind us (first frame after load, or a forward seek),
     beatIdx is snapped forward without a burst of glitch animations.

     LOOP / RESUME: when songMs jumps backwards (currentTime resets near 0 on
     loop, or a resume lands earlier), beatIdx is recomputed from the new
     position so cuts re-lock to the song.

     OUTRO FREEZE: after the last mapped accent (or songMs >= 134000), no more
     cuts fire and the current photo holds. The rAF loop stays alive so the
     loop-back is caught and re-synced. */
  var lastSongMs = -1;
  function tick() {
    var songMs = readSongMs();

    if (songMs != null) {
      /* Backwards jump = loop / resume / seek: re-anchor the pointer. */
      if (songMs < lastSongMs - 50) {
        syncBeatIdx(songMs);
      }
      lastSongMs = songMs;

      /* Outro freeze: hold the current photo past the final accent. */
      if (songMs < OUTRO_MS) {
        /* How many mapped accents the clock has already crossed this frame. */
        var crossed = 0;
        while (beatIdx < beats.length && songMs >= beats[beatIdx].t) {
          crossed++;
          beatIdx++;
        }
        if (crossed > 0) {
          /* At most one visible cut per frame - a multi-beat jump (load /
             seek) snaps the pointer forward but only animates once. */
          advance();
        }
      }
    }
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
