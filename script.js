/* WildWooHoo — splash hero showreel
   Absolute paths (so subpages work) + per-page deck via body[data-deck].
   Each deck is 4 images that get populated into the two showreel tracks. */

const SHOWREEL_DECKS = {
  // Home — WELI 2026-06-06: 'use only leaping photos. show one, dramatically
  // show the next, then the next.. it adds oddness and quirkiness, tells the
  // narrative from animal to humans, synced to the beat of the song playing.'
  // Strict alternation: animal -> human -> animal -> human. Every other beat
  // returns to the kangaroo source, reinforcing the studio's whole thesis
  // (we are the same animal) in pure visual rhythm. No drift, no track -
  // these are HARD CUTS on the beat. See injectLeapSequence() below.
  home: [
    "/assets/img/kangaroo-playfight.jpg",                     /* animal leap */
    "/assets/img/04-leaping-weli.jpg",                        /* WELI leap */
    "/assets/img/kangaroo -kocatooflight.jpg",                /* animal in flight */
    "/assets/img/20231015_KangarooTime-ballet02424.jpg",      /* ballet leap */
    "/assets/img/kangaroo-hogdeer-encounter.jpg",             /* animal motion */
    "/assets/img/20231015_KangarooTime-samba02219.jpg"        /* samba leap */
  ],
  // Music & Video — KT video photography
  music: [
    "/assets/img/20231015_KangarooTime-ballet02424.jpg",
    "/assets/img/20231015_KangarooTime-dragqueen02359.jpg",
    "/assets/img/20231015_KangarooTime-samba02219.jpg",
    "/assets/img/20231015_KangarooTime-groupallmodels02246-2.jpg"
  ],
  // Educational — kids events only. Kanga-Kangaroo animation stills are
  // intentionally kept OUT of the showreel and surfaced lower on the page
  // (Current directions + Kanga-Kangaroo section), per WELI 2026-05-28.
  educational: [
    "/assets/img/KT%20kids%20event1.jpg",
    "/assets/img/KT%20kids%20event1singer.jpg",
    "/assets/img/KT%20kids%20event2.jpg",
    "/assets/img/KT%20kids%20event1-aeral.jpg",
    "/assets/img/KT%20kids%20eventbackaeral.jpg"
  ],
  // Projects — across project visuals
  projects: [
    "/assets/img/20231015_KangarooTime-videocover02293.jpg",
    "/assets/img/Animation-Kanga-Kangaroo.jpg",
    "/assets/img/man-longhair-goldenhour.jpg",
    "/assets/img/04-leaping-weli.jpg"
  ],
  // Impact — animal-behaviour photography
  impact: [
    "/assets/img/kangaroo-playfight.jpg",
    "/assets/img/human-group-models-playingkangaroogroup.jpg",
    "/assets/img/kangaroo_silhuette-sunset.jpg",
    "/assets/img/kangaroo-hogdeer-encounter.jpg"
  ]
};

function getShowreelImages() {
  const deck = (document.body && document.body.dataset && document.body.dataset.deck) || "home";
  // 2026-06-05 alias map: new wing slugs -> legacy deck keys so showreel still
  // populates after the brand-evolution rename. Add explicit decks here as
  // each wing curates its own selection.
  const ALIAS = {
    "music-and-entertainment": "music",
    "research-and-educational": "educational",
    "studio":                   "projects",
    "collaborate":              "home"
  };
  const resolved = ALIAS[deck] || deck;
  return SHOWREEL_DECKS[resolved] || SHOWREEL_DECKS.home;
}

function makeCard(src, sizeClass = "") {
  const item = document.createElement("div");
  item.className = `showreel-item ${sizeClass}`.trim();

  const img = document.createElement("img");
  img.src = src;
  img.alt = "";
  img.loading = "eager";

  item.appendChild(img);
  return item;
}

function populateTrack(trackId, pattern = []) {
  const track = document.getElementById(trackId);
  if (!track) return;
  const images = getShowreelImages();

  for (let repeat = 0; repeat < 3; repeat++) {
    images.forEach((src, index) => {
      const sizeClass = pattern[index % pattern.length] || "";
      track.appendChild(makeCard(src, sizeClass));
    });
  }
}

/* =============================================================================
   LEAP SEQUENCE (home page) — WELI 2026-06-06.
   Replace the dual-drifting-track showreel with a hard-cut alternating
   leap sequence. Photos cut to the beat when music plays; default 2400ms
   cadence when silent. Animal -> human -> animal -> human, looping. The
   tracks A/B from the legacy showreel are hidden on the home page; other
   pages still use the drifting tracks via populateTrack() above.
   ========================================================================== */
function injectLeapSequence() {
  var splashBg = document.querySelector('.wwh-splash-bg');
  if (!splashBg) return;
  var trackA = document.getElementById('trackA');
  var trackB = document.getElementById('trackB');
  if (trackA) trackA.style.display = 'none';
  if (trackB) trackB.style.display = 'none';

  var seq = document.createElement('div');
  seq.className = 'wwh-leap-sequence';
  seq.setAttribute('aria-hidden', 'true');

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
  splashBg.appendChild(seq);

  var current = 0;
  var totalFrames = imgs.length;
  var lastAdvance = performance.now();
  var FALLBACK_MS = 2400;
  var MIN_GAP_MS = 280;

  function advance() {
    imgs[current].classList.remove('is-active', 'is-flash');
    current = (current + 1) % totalFrames;
    var next = imgs[current];
    next.classList.add('is-active', 'is-flash');
    /* brief brightness pulse on the new frame - the 'cut flash' moment */
    window.setTimeout(function () { next.classList.remove('is-flash'); }, 110);
    lastAdvance = performance.now();
  }

  /* Beat-synced advance: when window.wwhHeroAudio.lo (bass amplitude)
     exceeds threshold + cooldown, cut. Polls in RAF instead of relying
     on a mutation observer for tighter timing. */
  function tick() {
    var now = performance.now();
    var audio = window.wwhHeroAudio;
    if (audio && audio.lo > 0.42 && now - lastAdvance > MIN_GAP_MS) {
      advance();
    } else if (!audio && now - lastAdvance > FALLBACK_MS) {
      /* No music playing - default cadence so the sequence stays alive */
      advance();
    } else if (audio && now - lastAdvance > 4200) {
      /* Music playing but quiet stretch (intro/breakdown) - still cut
         occasionally so the page doesn't feel frozen */
      advance();
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

/* Decide which showreel to mount based on the page deck. */
(function () {
  var deck = (document.body && document.body.dataset && document.body.dataset.deck) || 'home';
  if (deck === 'home' || deck === '') {
    injectLeapSequence();
  } else {
    populateTrack('trackA', ['large', '', 'small', '', 'large']);
    populateTrack('trackB', ['', 'small', 'large', '', 'small']);
  }
})();
