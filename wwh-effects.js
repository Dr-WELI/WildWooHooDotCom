/* wwh-effects.js — WildWooHoo AWAL-pattern interactions
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
    };
    var openMenu = function () {
      mobileMenu.classList.add('is-open');
      burger.classList.add('is-open');
      burger.setAttribute('aria-expanded', 'true');
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.classList.add('wwh-menu-open');
    };
    burger.addEventListener('click', function () {
      if (mobileMenu.classList.contains('is-open')) { closeMenu(); } else { openMenu(); }
    });
    // Close when any link inside the overlay is tapped.
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', closeMenu);
    });
    // Escape closes too.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) closeMenu();
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
      '.wwh-trend-item, .wwh-feature-video-head, .wwh-feature-video-frame'
    );
    auto.forEach(function (el) {
      el.classList.add('wwh-reveal');
      io.observe(el);
    });
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

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
     cursor on touch + reduced-motion (class is never added there). */
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
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
  }

})();

/* ---------- Floating back-to-top button (site-wide) ---------- */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '↑';
  btn.style.cssText = [
    'position:fixed', 'right:22px', 'bottom:22px', 'z-index:9995',
    'width:46px', 'height:46px', 'border-radius:999px',
    'border:1px solid rgba(255,255,255,.25)', 'background:rgba(20,16,24,.66)',
    'color:#FBF7EE', 'font-size:20px', 'line-height:1', 'cursor:pointer',
    'display:grid', 'place-items:center',
    'backdrop-filter:blur(8px)', '-webkit-backdrop-filter:blur(8px)',
    'box-shadow:0 6px 24px rgba(0,0,0,.28)',
    'opacity:0', 'transform:translateY(12px) scale(.9)', 'pointer-events:none',
    'transition:opacity .3s ease, transform .3s cubic-bezier(.22,1,.36,1), box-shadow .3s ease, border-color .3s ease'
  ].join(';');
  document.body.appendChild(btn);
  btn.addEventListener('mouseenter', function () { btn.style.boxShadow = '0 8px 30px rgba(201,122,64,.45)'; btn.style.borderColor = 'rgba(229,185,109,.7)'; });
  btn.addEventListener('mouseleave', function () { btn.style.boxShadow = '0 6px 24px rgba(0,0,0,.28)'; btn.style.borderColor = 'rgba(255,255,255,.25)'; });
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
