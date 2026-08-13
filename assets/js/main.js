/* =========================================================================
   Mauritania Horizons — comportements du site.
   Vanilla, sans dépendance. Tout se dégrade proprement.
   ========================================================================= */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  /* ------------------------------------------------- navigation + menu */
  var nav = $('.nav');
  if (nav && !nav.classList.contains('nav--static')) {
    var onScroll = function () { nav.classList.toggle('solid', scrollY > 40); };
    onScroll(); addEventListener('scroll', onScroll, { passive: true });
  }
  var burger = $('.burger'), ovl = $('.ovl');
  if (burger && ovl) {
    var spans = $$('.ovl__l a > span');
    var toggle = function (force) {
      var open = force !== undefined ? force : !root.classList.contains('menu-open');
      spans.forEach(function (s, i) { s.style.transitionDelay = open ? (0.14 + i * 0.055).toFixed(2) + 's' : '0s'; });
      root.classList.toggle('menu-open', open);
      d.body.classList.toggle('lock', open);
      burger.setAttribute('aria-expanded', String(open));
      ovl.setAttribute('aria-hidden', String(!open));
    };
    burger.addEventListener('click', function () { toggle(); });
    $$('.ovl a').forEach(function (a) { a.addEventListener('click', function () { toggle(false); }); });
    d.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) toggle(false);
    });
  }

  /* ------------------------------------------------- révélations au scroll */
  var items = $$('.rv, .mask');
  if (!('IntersectionObserver' in window) || REDUCED) {
    items.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  }

  /* -------------------------------------------------------- bandeau avis */
  var tick = $('[data-tick]');
  if (tick) {
    tick.innerHTML += tick.innerHTML;
    if (!REDUCED) {
      var x = 0, half = 0, last = null;
      var meas = function () { half = tick.scrollWidth / 2; };
      meas(); addEventListener('resize', meas);
      requestAnimationFrame(function loop(ts) {
        if (last === null) last = ts;
        var dt = Math.min(ts - last, 50); last = ts;
        x -= dt * 0.042;
        if (half && -x >= half) x += half;
        tick.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        requestAnimationFrame(loop);
      });
    }
  }

  /* ------------------------------------------------ barre collante mobile */
  var sticky = $('.sticky'), expert = $('.expert');
  if (sticky || expert) {
    var hero = $('.hero');
    var check = function () {
      var past = hero ? scrollY > hero.offsetHeight * 0.75 : scrollY > 400;
      if (sticky) sticky.classList.toggle('on', past);
      if (expert) expert.classList.toggle('on', past);
    };
    check(); addEventListener('scroll', check, { passive: true });
  }

  /* ---------------------------------------------------------- parallaxe */
  if (!REDUCED) {
    var pl = $$('[data-par]');
    if (pl.length) {
      var tickP = false;
      var run = function () {
        pl.forEach(function (el) {
          var r = el.getBoundingClientRect();
          if (r.bottom < 0 || r.top > innerHeight) return;
          var p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight;
          el.style.transform = 'translate3d(0,' + (p * (parseFloat(el.dataset.par) || 22)).toFixed(1) + 'px,0)';
        });
        tickP = false;
      };
      addEventListener('scroll', function () {
        if (!tickP) { tickP = true; requestAnimationFrame(run); }
      }, { passive: true });
      run();
    }
  }

  /* ------------------------------------------------------ planificateur */
  var planner = $('[data-planner]');
  if (planner) {
    var a = planner.querySelector('[name=arrival]'), dep = planner.querySelector('[name=departure]');
    if (a && dep) {
      var today = new Date().toISOString().slice(0, 10);
      a.min = today; dep.min = today;
      a.addEventListener('change', function () {
        dep.min = a.value || today;
        if (dep.value && dep.value < a.value) dep.value = a.value;
      });
    }
    planner.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = new FormData(planner), q = new URLSearchParams();
      ['journey', 'arrival', 'departure', 'travellers'].forEach(function (k) {
        if (f.get(k)) q.set(k, f.get(k));
      });
      location.href = (root.getAttribute('data-base') || './') + 'plan/index.html?' + q;
    });
  }

  /* ------------------------------------------------------------ WhatsApp */
  $$('[data-wa]').forEach(function (el) {
    var m = el.getAttribute('data-wa');
    el.href = 'https://wa.me/22246656594' + (m ? '?text=' + encodeURIComponent(m) : '');
    el.target = '_blank'; el.rel = 'noopener';
  });
})();
