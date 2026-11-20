/* =============================================================================
   wildwoohoo.com system script. Small, deferred, progressive: every page
   works without it.
   1. Mobile nav
   2. Masthead starfield (WELI 2026-08-18: "add that galaxy effect for some
      movement in all the headers, similar to the home page"). Moved here
      unchanged from wwh-hero-universe.js so migrated pages load about 3 KB
      instead of 42 KB.
   3. Video facades: a poster and a link until clicked, so YouTube loads
      nothing (and sets no cookie) until the visitor asks for the video.
   4. Forms: post in place, show an inline error if sending fails, keep
      the visitor's text. Without JS the native POST and redirect still work.
   5. Footer year
   ========================================================================== */
(function () {
  "use strict";
  var doc = document;

  /* 1. Mobile nav */
  var head = doc.querySelector(".site-head");
  var burger = head && head.querySelector(".burger");
  if (burger) {
    var nav = doc.getElementById(burger.getAttribute("aria-controls"));
    var setOpen = function (open) {
      head.classList.toggle("is-open", open);
      burger.setAttribute("aria-expanded", open ? "true" : "false");
      burger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    };
    burger.addEventListener("click", function () {
      setOpen(!head.classList.contains("is-open"));
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && head.classList.contains("is-open")) {
        setOpen(false);
        burger.focus();
      }
    });
    if (nav) {
      nav.addEventListener("click", function (e) {
        if (e.target.closest("a")) setOpen(false);
      });
    }
    var wide = window.matchMedia("(min-width: 1001px)");
    if (wide.addEventListener) {
      wide.addEventListener("change", function (e) { if (e.matches) setOpen(false); });
    }
  }

  /* 2. Masthead starfield */
  function initStars(hero) {
    if (hero.querySelector(".masthead-stars")) return;
    var reduced = window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var canvas = doc.createElement("canvas");
    canvas.className = "masthead-stars";
    canvas.setAttribute("aria-hidden", "true");
    hero.insertBefore(canvas, hero.firstChild);
    var ctx = canvas.getContext("2d");
    var w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2), stars = [];

    function build() {
      var count = Math.round((w * h) / 9000);
      if (count > 160) count = 160; else if (count < 24) count = 24;
      stars = [];
      for (var i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w, y: Math.random() * h,
          r: Math.random() * 1.1 + 0.3,
          a: Math.random() * 0.5 + 0.25,
          tw: Math.random() * Math.PI * 2,
          tws: Math.random() * 0.6 + 0.2,
          vx: (Math.random() - 0.5) * 3
        });
      }
    }
    function resize() {
      var r = hero.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      if (reduced) paint(0);
    }
    function paint(dt) {
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#FBF7EE";
      for (var i = 0; i < stars.length; i++) {
        var s = stars[i];
        if (!reduced) {
          s.x += s.vx * dt;
          if (s.x < -2) s.x = w + 2; else if (s.x > w + 2) s.x = -2;
          s.tw += s.tws * dt;
        }
        var op = reduced ? s.a : s.a * (0.6 + 0.4 * Math.sin(s.tw));
        ctx.globalAlpha = op < 0 ? 0 : op;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }
    var last = 0, raf = 0, running = true;
    function frame(t) {
      if (!running) return;
      var dt = last ? (t - last) / 1000 : 0;
      last = t;
      if (dt > 0.1) dt = 0.1;
      paint(dt);
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", resize, { passive: true });
    resize();
    if (!reduced) raf = requestAnimationFrame(frame);
    doc.addEventListener("visibilitychange", function () {
      if (doc.hidden) { running = false; if (raf) cancelAnimationFrame(raf); }
      else if (!reduced) { running = true; last = 0; raf = requestAnimationFrame(frame); }
    });
    window.addEventListener("pagehide", function () {
      running = false; if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    });
  }
  var heroes = doc.querySelectorAll(".masthead");
  for (var i = 0; i < heroes.length; i++) initStars(heroes[i]);

  /* 3. Video facades */
  doc.querySelectorAll("[data-yt]").forEach(function (box) {
    var link = box.querySelector(".video-link");
    if (!link) return;
    link.addEventListener("click", function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
      e.preventDefault();
      var frame = doc.createElement("iframe");
      frame.src = "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(box.getAttribute("data-yt")) + "?autoplay=1&rel=0";
      frame.title = box.getAttribute("data-title") || "Video";
      frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      frame.setAttribute("allowfullscreen", "");
      box.replaceChildren(frame);
      frame.focus();
    });
  });

  /* 4. Forms */
  if (window.fetch && window.FormData) {
    doc.querySelectorAll("form[data-next]").forEach(function (form) {
      var err = form.querySelector(".form-error");
      var btn = form.querySelector('[type="submit"]');
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (err) err.hidden = true;
        var label = btn ? btn.textContent : "";
        if (btn) { btn.disabled = true; btn.textContent = "Sending..."; }
        fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" }
        }).then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status);
          window.location.href = form.getAttribute("data-next");
        }).catch(function () {
          if (btn) { btn.disabled = false; btn.textContent = label; }
          if (err) { err.hidden = false; err.scrollIntoView({ block: "nearest" }); }
        });
      });
    });
  }

  /* 5. Footer year */
  var year = String(new Date().getFullYear());
  doc.querySelectorAll(".js-year").forEach(function (el) { el.textContent = year; });
})();
