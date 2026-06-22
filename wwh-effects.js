/* wwh-effects.js - WildWooHoo AWAL-pattern interactions
   - splash popup toggle
   - reveal-on-scroll
   - back-to-top
   - simple roster slider drag affordance
   - highlight card rotation on interval (optional) */

(function () {
  'use strict';

  /* ---------- 0. Mobile hamburger menu ------------------------ */
  var burger = document.querySelector('.js-wwh-burger');
  var mobileMenu = document.getElementById('wwh-mobile-menu');
  if (burger && mobileMenu) {
    var closeMenu = function () {
      mobileMenu.classList.remove('is-open');
      burger.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('wwh-menu-open');
      /* 2026-06-12: return focus to the burger so keyboard users are not
         stranded behind the closed overlay. */
      try { burger.focus(); } catch (err) {}
    };
    var openMenu = function () {
      mobileMenu.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('wwh-menu-open');
      /* 2026-06-12: move focus into the overlay (first link). */
      var firstLink = mobileMenu.querySelector('a, button');
      if (firstLink) { try { firstLink.focus(); } catch (err) {} }
    };
    burger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });
    // Close when any link inside the overlay is tapped.
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Escape closes; Tab loops within the open overlay (simple focus trap
    // so Tab cannot wander through the aria-hidden page behind it).
    document.addEventListener('keydown', function (e) {
      if (!mobileMenu.classList.contains('is-open')) return;
      if (e.key === 'Escape') { closeMenu(); return; }
      if (e.key !== 'Tab') return;
      var focusables = mobileMenu.querySelectorAll(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && (document.activeElement === first || !mobileMenu.contains(document.activeElement))) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (document.activeElement === last || !mobileMenu.contains(document.activeElement))) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------- 1. Splash hero popup ---------------------------- */
  var splashBtn = document.querySelector('.js-wwh-splash-cta');
  var splashPopup = document.querySelector('.js-wwh-splash-popup');
  var splashClose = document.querySelector('.js-wwh-splash-close');
  if (splashBtn && splashPopup) {
    splashBtn.addEventListener('click', function () {
      splashPopup.classList.add('is-open');
      splashBtn.classList.add('is-open');
    });
  }
  if (splashClose && splashPopup) {
    splashClose.addEventListener('click', function () {
      splashPopup.classList.remove('is-open');
      if (splashBtn) splashBtn.classList.remove('is-open');
    });
  }
  if (splashPopup) {
    splashPopup.addEventListener('click', function (e) {
      if (e.target === splashPopup) {
        splashPopup.classList.remove('is-open');
        if (splashBtn) splashBtn.classList.remove('is-open');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && splashPopup.classList.contains('is-open')) {
        splashPopup.classList.remove('is-open');
        if (splashBtn) splashBtn.classList.remove('is-open');
      }
    });
  }

  /* ---------- 2. Reveal on scroll ----------------------------- */
  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if ('IntersectionObserver' in window && !prefersReduced) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });

    var auto = document.querySelectorAll(
      '.wwh-services-headline, .wwh-services-list li, .wwh-roster-slide, ' +
      '.wwh-departments h2, .wwh-departments-list li, .wwh-highlight-copy, ' +
      '.wwh-trend-item, .wwh-feature-video-head, .wwh-feature-video-frame, ' +
      /* WELI 2026-06-06: each chapter section gets the chip-glow boot-up
         effect when it enters viewport (chip pulses to 'lock on'). */
      '.wwh-chapter'
    );

    auto.forEach(function (el) {
      el.classList.add('wwh-reveal');
      io.observe(el);
    });
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 2b. About corner + header auto-hide --------------
     2026-06-12: these two used to be nested inside the
     IntersectionObserver + prefers-reduced-motion gate above, which
     meant reduced-motion users (and any browser without IO) could never
     open the [ABOUT] manifesto text. Neither has a motion dependency,
     so they now run unconditionally. */

  /* WELI 2026-06-06: floating [ABOUT] top-left toggles a brief 1-para
     manifesto body directly over the showreel. No panel, no green bg -
     just text with strong dark glow. Click outside or press Escape to
     close. */
  (function setupAboutCorner() {
    var trigger = document.querySelector('.wwh-about-trigger');
    var aside = document.querySelector('.wwh-about-corner');
    if (!trigger || !aside) return;
    function setOpen(isOpen) {
      trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      aside.setAttribute('data-open', isOpen ? 'true' : 'false');
    }
    setOpen(false);
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = trigger.getAttribute('aria-expanded') === 'true';
      setOpen(!isOpen);
    });
    document.addEventListener('click', function (e) {
      if (!aside.contains(e.target)) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  })();

  /* WELI 2026-06-06 (revised after da5804f rollback): the original
     implementation used MutationObserver on body.class and ALSO wrote to
     body.class inside the observer callback - this caused Chrome to
     flag the page as unresponsive (observer-write-observer pingpong on
     a hot path that also fired on every mousemove via mousemove's
     classList.remove calls). Replaced with a safer approach:
       - rAF-throttled mousemove (reads clientY at most once per frame)
       - polling at 1Hz to detect music-state changes (cheap, no observer)
       - state class moved from body to <html> so we never write to body
         (avoids any cross-talk with audio-reactive listeners on body) */
  (function setupHeaderAutoHide() {
    var HIDE_AFTER_MS = 3500;
    var TOP_ZONE_PX = 80;
    var hideTimer = null;
    var rafPending = false;
    var lastY = 9999;

    function isPlaying() {
      return document.body.classList.contains('is-music-playing');
    }
    function hide() {
      if (isPlaying()) document.documentElement.classList.add('is-header-hidden');
    }
    function reveal() {
      document.documentElement.classList.remove('is-header-hidden');
      if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
      if (isPlaying()) hideTimer = setTimeout(hide, HIDE_AFTER_MS);
    }
    /* Mousemove handler - rAF-throttled. Reads clientY at most once per
       frame regardless of how often the OS delivers the event. */
    document.addEventListener('mousemove', function (e) {
      lastY = e.clientY;
      if (rafPending) return;
      rafPending = true;
      requestAnimationFrame(function () {
        rafPending = false;
        if (!isPlaying()) return;
        if (lastY <= TOP_ZONE_PX) {
          document.documentElement.classList.remove('is-header-hidden');
          if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        } else if (document.documentElement.classList.contains('is-header-hidden')) {
          reveal();
        }
      });
    }, { passive: true });
    /* Music-state sync. Primary path: zero-latency window event the
       music button dispatches when it toggles state. Backup path: 1Hz
       polling check (catches any state change that slipped through).
       2026-06-12: the poll used to run forever on EVERY page, including
       portal/privacy/brand-kit which have no music button. It now starts
       on the first music-state event, so static pages never carry an
       idle interval. */
    var wasPlaying = false;
    var pollTimer = null;
    function syncMusicState() {
      var nowPlaying = isPlaying();
      if (nowPlaying && !wasPlaying) {
        if (!hideTimer) hideTimer = setTimeout(hide, HIDE_AFTER_MS);
      } else if (!nowPlaying && wasPlaying) {
        if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        document.documentElement.classList.remove('is-header-hidden');
      }
      wasPlaying = nowPlaying;
    }
    function ensurePoll() {
      if (!pollTimer) pollTimer = setInterval(syncMusicState, 1000);
    }
    window.addEventListener('wwh:music-state-changed', function () {
      ensurePoll();
      syncMusicState();
    });
    /* Cover the edge where music was already playing before this script
       evaluated (stale-cache load order). */
    if (isPlaying()) { ensurePoll(); syncMusicState(); }
  })();

  /* ---------- 3. Back to top --------------------------------- */
  var backTop = document.querySelector('.js-wwh-back-top');
  if (backTop) {
    backTop.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- 4. Highlight card rotation --------------------- */
  if (!prefersReduced) {
    var stack = document.querySelector('.wwh-highlight-cards');
    if (stack) {
      var cards = stack.querySelectorAll('.wwh-highlight-card');
      if (cards.length > 1) {
        var idx = Math.floor(cards.length / 2);
        cards[idx].classList.add('is-active');
        setInterval(function () {
          /* 2026-06-12: do not rotate in hidden tabs. */
          if (document.hidden) return;
          cards[idx].classList.remove('is-active');
          idx = (idx + 1) % cards.length;
          cards[idx].classList.add('is-active');
        }, 3500);
      }
    }
  }

  /* ---------- 5. Refined contextual cursor (fine pointer, motion-ok) ------
     A ring that grows + labels itself (View / Watch / Start) over media, with
     a gentle magnet toward the target's centre. Styles live in wwh-archive.css
     (.wwh-cur / .wwh-cur-dot / body.wwh-cursor-on). Falls back to the native
     cursor on touch + reduced-motion (class is never added there).
     2026-06-12: hardened. matchMedia is now guarded (an unguarded throw here
     used to abort the rest of the file), and the module verifies its
     stylesheet actually applied before taking over the cursor - on pages
     that do not load wwh-archive.css (brand-kit) the unstyled ring used to
     render as a literal 'View' text block chasing the mouse. */
  (function setupContextualCursor() {
    if (prefersReduced) return;
    if (!(window.matchMedia && window.matchMedia('(pointer:fine)').matches)) return;
    try {
      var ring = document.createElement('div');
      ring.className = 'wwh-cur';
      ring.setAttribute('aria-hidden', 'true');
      var lbl = document.createElement('span');
      lbl.className = 'wwh-cur-lbl';
      lbl.textContent = 'View';
      ring.appendChild(lbl);
      var cdot = document.createElement('div');
      cdot.className = 'wwh-cur-dot';
      cdot.setAttribute('aria-hidden', 'true');
      document.body.appendChild(ring);
      document.body.appendChild(cdot);

      /* Self-check: the .wwh-cur rules (wwh-archive.css) make the ring
         position:fixed. If that stylesheet is absent the ring would be an
         unstyled in-flow div - remove everything and keep the native
         cursor. */
      var applied = false;
      try {
        applied = window.getComputedStyle &&
          window.getComputedStyle(ring).position === 'fixed';
      } catch (err) { applied = false; }
      if (!applied) {
        document.body.removeChild(ring);
        document.body.removeChild(cdot);
        return;
      }
      document.body.classList.add('wwh-cursor-on');

      var rx = window.innerWidth / 2, ry = window.innerHeight / 2;  // eased ring
      var px = rx, py = ry;                                          // instant dot
      var shown = false, current = null;

      document.addEventListener('mousemove', function (e) {
        px = e.clientX; py = e.clientY;
        if (!shown) { shown = true; ring.classList.add('is-shown'); cdot.classList.add('is-shown'); }
      });
      document.addEventListener('mouseleave', function () {
        shown = false; ring.classList.remove('is-shown'); cdot.classList.remove('is-shown');
      });

      var bind = function (sel, label) {
        document.querySelectorAll(sel).forEach(function (el) {
          el.addEventListener('mouseenter', function () {
            current = el; ring.classList.add('is-active');
            lbl.textContent = el.getAttribute('data-cursor') || label;
          });
          el.addEventListener('mouseleave', function () {
            current = null; ring.classList.remove('is-active');
          });
        });
      };
      bind('.wwh-roster-slide', 'View');
      bind('.wwh-trend-item.is-video', 'Watch');
      bind('.wwh-trend-item:not(.is-video)', 'View');
      bind('.wwh-feature-video-frame, .wwh-feature-video-inner', 'Watch');
      bind('.wwh-project-media', 'View');
      bind('.wwh-services-cta h2 a, .wwh-highlight-cta, .wwh-form-submit', 'Start');
      bind('[data-cursor]', 'View');

      (function loop() {
        var tx = px, ty = py;
        if (current) {
          var r = current.getBoundingClientRect();
          var ccx = r.left + r.width / 2, ccy = r.top + r.height / 2;
          tx = px + (ccx - px) * 0.16;   // gentle magnet toward centre
          ty = py + (ccy - py) * 0.16;
        }
        rx += (tx - rx) * 0.18; ry += (ty - ry) * 0.18;
        ring.style.transform = 'translate(' + rx + 'px,' + ry + 'px)';
        cdot.style.transform = 'translate(' + px + 'px,' + py + 'px)';
        requestAnimationFrame(loop);
      })();
    } catch (err) {
      /* never leave the visitor without a cursor */
      document.body.classList.remove('wwh-cursor-on');
    }
  })();

})();

/* ---------- Floating back-to-top button (site-wide) - DISABLED 2026-06-05.
   M&E and R&E already ship a hardcoded .wwh-back-to-top-float anchor in HTML.
   Injecting a second JS button here gave users two stacked round buttons in
   the bottom-right corner. Disabled by guarding on body class so the JS only
   fires where the HTML anchor is absent. */
(function () {
  'use strict';
  if (document.querySelector('.wwh-back-to-top-float')) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.style.cssText = [
    'position:fixed', 'right:22px', 'bottom:22px', 'z-index:9995',
    'width:46px', 'height:46px', 'border-radius:999px',
    'border:1px solid rgba(197,223,195,.35)', 'background:rgba(25,25,29,.78)',
    'color:#C5DFC3', 'font-size:20px', 'line-height:1', 'cursor:pointer',
    'display:grid', 'place-items:center',
    'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)',
    'box-shadow:0 6px 24px rgba(0,0,0,.42)',
    'opacity:0', 'transform:translateY(12px) scale(.9)', 'pointer-events:none',
    'transition:opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease'
  ].join(';');
  document.body.appendChild(btn);
  btn.addEventListener('mouseenter', function () { btn.style.boxShadow = '0 8px 30px rgba(93,223,230,.45)'; btn.style.borderColor = 'rgba(93,223,230,.7)'; });
  btn.addEventListener('mouseleave', function () { btn.style.boxShadow = '0 6px 24px rgba(0,0,0,.42)'; btn.style.borderColor = 'rgba(197,223,195,.35)'; });
  btn.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }); });
  var shown = false;
  function onScroll() {
    var show = window.scrollY > 600;
    if (show === shown) return;
    shown = show;
    btn.style.opacity = show ? '1' : '0';
    btn.style.transform = show ? 'translateY(0) scale(1)' : 'translateY(12px) scale(.9)';
    btn.style.pointerEvents = show ? 'auto' : 'none';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* =============================================================================
   Cursor-tracking chromatic spotlight on cards - WELI 2026-06-05.
   Sets --mx --my CSS custom properties on each card as the cursor moves over
   it so the chromatic gleam (radial gradient in wwh-darkmode.css) follows
   the pointer instead of sweeping diagonally.
   ============================================================================= */
(function () {
  'use strict';
  var SEL = '.wwh-pillar, .wwh-highlight-card, .wwh-feature-video, .wwh-trend-item, .wwh-project-media, .wwh-meet-photo, .wwh-roster-slide';
  var supportsPointerFine = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  if (!supportsPointerFine) return;
  var cards = document.querySelectorAll(SEL);
  cards.forEach(function (card) {
    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width) * 100;
      var y = ((e.clientY - r.top) / r.height) * 100;
      card.style.setProperty('--mx', x.toFixed(2) + '%');
      card.style.setProperty('--my', y.toFixed(2) + '%');
    });
    card.addEventListener('mouseleave', function () {
      card.style.removeProperty('--mx');
      card.style.removeProperty('--my');
    });
  });
})();

/* ============================================================================
   WELI 2026-06-21: 3D warp starfield for the nav dropdown - stars travelling
   toward the camera, echoing the home hero galaxy. Self-contained; the canvas
   only animates while the menu is open (MutationObserver on .is-open). Honours
   prefers-reduced-motion (static field). Does not touch the home hero galaxy.
   ========================================================================== */
(function () {
  var menu = document.getElementById('wwh-mobile-menu');
  if (!menu || !window.requestAnimationFrame) return;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canvas = document.createElement('canvas');
  canvas.className = 'wwh-warp-stars';
  canvas.setAttribute('aria-hidden', 'true');
  menu.insertBefore(canvas, menu.firstChild);
  document.body.classList.add('wwh-warp-on');
  var ctx = canvas.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var w = 0, h = 0, cx = 0, cy = 0, stars = [], raf = null, running = false;
  var N = 240, SPEED = 0.003, COLOR = '188,236,228';
  function resize() {
    var r = menu.getBoundingClientRect();
    w = r.width || window.innerWidth; h = r.height || window.innerHeight;
    cx = w / 2; cy = h / 2;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  function spawn(s) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = Math.random() * 0.9 + 0.1; s.pz = s.z; return s; }
  function init() { stars = []; for (var i = 0; i < N; i++) stars.push(spawn({})); }
  function frame() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    var k = Math.max(w, h) * 0.72;
    for (var i = 0; i < N; i++) {
      var s = stars[i];
      s.pz = s.z; s.z -= SPEED;
      if (s.z <= 0.02) { spawn(s); continue; }
      var sx = cx + (s.x / s.z) * k, sy = cy + (s.y / s.z) * k;
      if (sx < -60 || sx > w + 60 || sy < -60 || sy > h + 60) { spawn(s); continue; }
      var px = cx + (s.x / s.pz) * k, py = cy + (s.y / s.pz) * k;
      var t = 1 - s.z;
      ctx.strokeStyle = 'rgba(' + COLOR + ',' + Math.min(0.85, t * 0.9 + 0.08) + ')';
      ctx.lineWidth = Math.max(0.5, t * 1.8);
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(sx, sy); ctx.stroke();
    }
    raf = requestAnimationFrame(frame);
  }
  function drawStatic() {
    var k = Math.max(w, h) * 0.72; ctx.clearRect(0, 0, w, h);
    for (var i = 0; i < N; i++) { var s = stars[i]; var sx = cx + (s.x / s.z) * k, sy = cy + (s.y / s.z) * k; if (sx < 0 || sx > w || sy < 0 || sy > h) continue; ctx.fillStyle = 'rgba(' + COLOR + ',' + Math.min(0.7, 1 - s.z) + ')'; var z = Math.max(1, (1 - s.z) * 2); ctx.fillRect(sx, sy, z, z); }
  }
  function start() { resize(); if (!stars.length) init(); if (reduce) { drawStatic(); return; } if (running) return; running = true; raf = requestAnimationFrame(frame); }
  function stop() { running = false; if (raf) { cancelAnimationFrame(raf); raf = null; } if (ctx) ctx.clearRect(0, 0, w, h); }
  window.addEventListener('resize', function () { if (menu.classList.contains('is-open')) { resize(); if (reduce) drawStatic(); } });
  new MutationObserver(function () { if (menu.classList.contains('is-open')) start(); else stop(); })
    .observe(menu, { attributes: true, attributeFilter: ['class'] });
  if (menu.classList.contains('is-open')) start();
})();
