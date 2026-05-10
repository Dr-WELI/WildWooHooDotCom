/* wwh-effects.js — site-wide motion + clock for WildWooHoo */
(function () {
  'use strict';

  /* ---------- 1. Live local clock for ribbon ---------------- */
  var clockEl = document.getElementById('wwhClock') || document.getElementById('siteClock');
  if (clockEl) {
    var tzLabel = 'LOCAL';
    try {
      var tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      var parts = tz.split('/');
      tzLabel = (parts[parts.length - 1] || tz).replace(/_/g, ' ').toUpperCase();
    } catch (e) { /* fallback */ }

    function pad(n) { return String(n).padStart(2, '0'); }
    function tickClock() {
      var d = new Date();
      clockEl.textContent =
        pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds()) + '  ' + tzLabel;
    }
    tickClock();
    setInterval(tickClock, 1000);
  }

  var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 2. Reveal-on-scroll --------------------------- */
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
      '.wwh-card, .wwh-card-grid > *, .wwh-section-head, .wwh-work-tile, ' +
      '.wwh-press-item, .wwh-outcomes-grid'
    );
    auto.forEach(function (el) {
      el.classList.add('wwh-reveal');
      io.observe(el);
    });
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll('.wwh-reveal').forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- 3. Title slide-up ----------------------------- */
  if (!prefersReduced) {
    document.querySelectorAll('.wwh-title-reveal').forEach(function (el) {
      var txt = el.textContent.trim();
      var words = txt.split(/\s+/);
      el.innerHTML = words.map(function (w, i) {
        return '<span style="display:inline-block;transform:translateY(110%);animation:wwhTitleUp 1100ms cubic-bezier(.7,.05,.2,1) forwards ' + (200 + i * 90) + 'ms;">' + w + '</span>';
      }).join(' ');
      el.style.overflow = 'hidden';
      el.style.display = 'inline-block';
    });
  }

  /* ---------- 4. Cursor follower (real <a> only) ------------ */
  if (!prefersReduced && window.matchMedia('(pointer:fine)').matches) {
    var cursor = document.createElement('div');
    cursor.style.cssText = [
      'position:fixed', 'top:0', 'left:0',
      'pointer-events:none', 'z-index:9999',
      'font-family:ui-monospace,Menlo,monospace',
      'font-size:10px', 'letter-spacing:.2em', 'text-transform:uppercase',
      'color:#d4742a', 'opacity:0',
      'transition:opacity 200ms ease',
      'white-space:nowrap', 'transform:translate(14px,14px)',
      'font-weight:700'
    ].join(';');
    cursor.textContent = '→ open';
    document.body.appendChild(cursor);

    document.querySelectorAll(
      'a.wwh-work-tile, a.wwh-chip, a.wwh-cta-button, .wwh-card a, .wwh-press-item a'
    ).forEach(function (el) {
      el.addEventListener('mouseenter', function () { cursor.style.opacity = 1; });
      el.addEventListener('mouseleave', function () { cursor.style.opacity = 0; });
    });
    document.addEventListener('mousemove', function (e) {
      cursor.style.left = e.clientX + 'px';
      cursor.style.top  = e.clientY + 'px';
    });
  }

})();
