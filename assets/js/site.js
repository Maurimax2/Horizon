/* Mauritania Horizons — comportements communs. Vanilla, sans dépendance. */
(function () {
  'use strict';
  var d = document, root = d.documentElement;
  var RED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  /* menu */
  var burger = $('.burger'), ovl = $('.ovl');
  if (burger && ovl) {
    var sp = $$('.ovl__n a > span');
    var tog = function (f) {
      var o = f !== undefined ? f : !root.classList.contains('menu-open');
      sp.forEach(function (s, i) { s.style.transitionDelay = o ? (0.12 + i * 0.05).toFixed(2) + 's' : '0s'; });
      root.classList.toggle('menu-open', o);
      d.body.classList.toggle('lock', o);
      burger.setAttribute('aria-expanded', String(o));
      ovl.setAttribute('aria-hidden', String(!o));
    };
    burger.addEventListener('click', function () { tog(); });
    $$('.ovl a').forEach(function (a) { a.addEventListener('click', function () { tog(false); }); });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape') tog(false); });
  }

  /* révélations */
  var items = $$('.rv');
  if (!('IntersectionObserver' in window) || RED) {
    items.forEach(function (e) { e.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.1, rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (e) { io.observe(e); });
  }

  /* ciel étoilé */
  $$('.stars').forEach(function (svg) {
    var s = '', n = 170;
    for (var i = 0; i < n; i++) {
      s += '<circle cx="' + (Math.random() * 100).toFixed(2) + '%" cy="' + (Math.random() * 100).toFixed(2) +
        '%" r="' + (Math.random() * 1.5 + 0.3).toFixed(2) + '" fill="#fff" opacity="' +
        (Math.random() * 0.75 + 0.2).toFixed(2) + '"/>';
    }
    svg.innerHTML = s;
  });

  /* horloge de la journée */
  var marks = $$('.clock span');
  if (marks.length && 'IntersectionObserver' in window) {
    var secs = $$('[data-hour]');
    var io2 = new IntersectionObserver(function (en) {
      en.forEach(function (e) {
        if (e.isIntersecting) {
          var i = secs.indexOf(e.target);
          marks.forEach(function (m, k) { m.classList.toggle('on', k === i); });
        }
      });
    }, { threshold: 0.4 });
    secs.forEach(function (s) { io2.observe(s); });
  }

  /* bandeau avis */
  var tk = $('[data-tick]');
  if (tk) {
    tk.innerHTML += tk.innerHTML;
    if (!RED) {
      var x = 0, half = 0, last = null;
      var meas = function () { half = tk.scrollWidth / 2; };
      meas(); addEventListener('resize', meas);
      requestAnimationFrame(function loop(ts) {
        if (last === null) last = ts;
        var dt = Math.min(ts - last, 50); last = ts;
        x -= dt * 0.04; if (half && -x >= half) x += half;
        tk.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)';
        requestAnimationFrame(loop);
      });
    }
  }

  /* barres collantes */
  var st = $('.sticky'), ex = $('.expert');
  if (st || ex) {
    var hero = $('.hour');
    var chk = function () {
      var p = hero ? scrollY > hero.offsetHeight * 0.7 : scrollY > 380;
      if (st) st.classList.toggle('on', p);
      if (ex) ex.classList.toggle('on', p);
    };
    chk(); addEventListener('scroll', chk, { passive: true });
  }

  /* WhatsApp */
  $$('[data-wa]').forEach(function (a) {
    var m = a.getAttribute('data-wa');
    a.href = 'https://wa.me/22246656594' + (m ? '?text=' + encodeURIComponent(m) : '');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* pré-remplissage du formulaire depuis un lien « réserver ce circuit » */
  var q = new URLSearchParams(location.search);
  if (q.get('journey')) {
    var pre = $('[data-prefill]');
    if (pre) pre.value = q.get('journey');
  }
})();
