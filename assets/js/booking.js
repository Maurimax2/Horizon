/* =========================================================================
   booking.js — tunnel de réservation en 5 étapes.
   Aucun backend : à l'envoi, un message WhatsApp pré-rempli est généré,
   avec un lien e-mail en secours. L'état vit en mémoire et survit à un
   rechargement via sessionStorage.
   ========================================================================= */
(function () {
  'use strict';
  var d = document;
  var form = d.getElementById('booking');
  if (!form) return;

  var $ = function (s, c) { return (c || d).querySelector(s); };
  var $$ = function (s, c) { return [].slice.call((c || d).querySelectorAll(s)); };

  var panes = $$('.pane', form);
  var marks = $$('.steps span', form);
  var bar = $('.bar i', form);
  var back = $('[data-back]', form);
  var next = $('[data-next]', form);
  var send = $('[data-send]', form);
  var step = 0;
  var LAST = panes.length - 1;      // dernier volet = confirmation

  var state = {};
  try { state = JSON.parse(sessionStorage.getItem('mh-booking') || '{}'); } catch (e) { state = {}; }

  function save() {
    try { sessionStorage.setItem('mh-booking', JSON.stringify(state)); } catch (e) { /* privé */ }
  }

  /* ------------------------------------------------------------ rendu */
  function paint() {
    panes.forEach(function (p, i) { p.classList.toggle('on', i === step); });
    marks.forEach(function (m, i) {
      m.classList.toggle('on', i === step);
      m.classList.toggle('done', i < step);
    });
    if (bar) bar.style.width = (step / (panes.length - 1) * 100).toFixed(1) + '%';
    if (back) back.style.visibility = step === 0 || step === LAST ? 'hidden' : 'visible';
    if (next) next.hidden = step >= LAST - 1;
    if (send) send.hidden = step !== LAST - 1;
    var h = $('.book-hd');
    if (h) h.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function go(n) {
    step = Math.max(0, Math.min(panes.length - 1, n));
    paint();
  }

  /* -------------------------------------------------------- validation */
  function fail(el, msg) {
    var f = el.closest('.field') || el.closest('.opts');
    if (f) {
      f.classList.add('err');
      var m = f.querySelector('.msg');
      if (m) m.textContent = msg;
    }
    return false;
  }
  function clear(scope) {
    $$('.err', scope).forEach(function (f) {
      f.classList.remove('err');
      var m = f.querySelector('.msg'); if (m) m.textContent = '';
    });
  }

  function validate(i) {
    var p = panes[i];
    clear(p);
    var ok = true;

    if (i === 0) {
      var j = $('[name=journey]:checked', p);
      if (!j) { var box = $('.opts', p); if (box) { box.classList.add('err'); }
        var mm = $('.msg', p); if (mm) mm.textContent = 'Choose a journey to continue';
        ok = false; }
    }

    if (i === 1) {
      var a = $('[name=arrival]', p), dep = $('[name=departure]', p);
      if (!a.value) ok = fail(a, 'Required');
      if (dep.value && a.value && dep.value < a.value) ok = fail(dep, 'Return is before arrival');
    }

    if (i === 2) {
      var ad = parseInt($('[name=adults]', p).value, 10) || 0;
      if (ad < 1) { var c = $('.count', p); if (c) c.closest('.field').classList.add('err'); ok = false; }
    }

    if (i === 3) {
      var n = $('[name=name]', p), e = $('[name=email]', p);
      if (!n.value.trim()) ok = fail(n, 'Required');
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.value)) ok = fail(e, 'Enter a valid email');
    }
    return ok;
  }

  /* ------------------------------------------------------------ état */
  function collect() {
    var f = new FormData(form);
    ['journey', 'arrival', 'departure', 'adults', 'children', 'name', 'email',
      'phone', 'country', 'message'].forEach(function (k) {
        var v = f.get(k);
        if (v !== null) state[k] = String(v).trim();
      });
    save();
  }

  form.addEventListener('input', function () { collect(); });
  form.addEventListener('change', function () { collect(); });

  /* restaure ce qui avait été saisi */
  Object.keys(state).forEach(function (k) {
    var el = form.elements[k];
    if (!el) return;
    if (el.length && el[0] && el[0].type === 'radio') {
      $$('[name=' + k + ']', form).forEach(function (r) { r.checked = r.value === state[k]; });
    } else if (el.value !== undefined) {
      el.value = state[k];
    }
  });

  /* --------------------------------------------------------- compteurs */
  $$('.count', form).forEach(function (c) {
    var out = $('output', c), inp = $('input[type=hidden]', c);
    var min = parseInt(c.dataset.min || '0', 10), max = parseInt(c.dataset.max || '16', 10);
    var set = function (v) {
      v = Math.max(min, Math.min(max, v));
      out.textContent = v; inp.value = v;
      collect();
    };
    set(parseInt(inp.value, 10) || min);
    $$('button', c).forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.preventDefault();
        set((parseInt(inp.value, 10) || 0) + (b.dataset.step === '-1' ? -1 : 1));
      });
    });
  });

  /* dates cohérentes */
  var ar = form.querySelector('[name=arrival]'), de = form.querySelector('[name=departure]');
  if (ar && de) {
    var today = new Date().toISOString().slice(0, 10);
    ar.min = today; de.min = today;
    ar.addEventListener('change', function () {
      de.min = ar.value || today;
      if (de.value && de.value < ar.value) de.value = ar.value;
      collect();
    });
  }

  /* ------------------------------------------------------ récapitulatif */
  function labelFor(slug) {
    var r = form.querySelector('[name=journey][value="' + slug + '"]');
    var s = r && r.closest('.opt') && r.closest('.opt').querySelector('strong');
    return s ? s.textContent.trim() : slug;
  }

  function fillRecap() {
    var box = $('[data-recap]');
    if (!box) return;
    var rows = [
      ['Journey', labelFor(state.journey || '')],
      ['Arrival', state.arrival || '—'],
      ['Departure', state.departure || 'To confirm'],
      ['Travellers', (state.adults || '0') + ' adult' + (state.adults === '1' ? '' : 's') +
        (parseInt(state.children || '0', 10) ? ', ' + state.children + ' child' +
          (state.children === '1' ? '' : 'ren') : '')],
      ['Name', state.name || '—'],
      ['Email', state.email || '—'],
      ['Phone', state.phone || '—'],
      ['Country', state.country || '—'],
    ];
    if (state.message) rows.push(['Notes', state.message]);
    box.innerHTML = rows.map(function (r) {
      return '<div><dt>' + r[0] + '</dt><dd>' + esc(r[1]) + '</dd></div>';
    }).join('');
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  /* ---------------------------------------------------------- message */
  function buildMessage() {
    var L = [];
    L.push('Hello Mauritania Horizons,');
    L.push('');
    L.push('I would like to book the following journey:');
    L.push('');
    L.push('Journey: ' + labelFor(state.journey || ''));
    L.push('Arrival: ' + (state.arrival || 'to confirm'));
    L.push('Departure: ' + (state.departure || 'to confirm'));
    L.push('Travellers: ' + (state.adults || '0') + ' adults' +
      (parseInt(state.children || '0', 10) ? ' + ' + state.children + ' children' : ''));
    L.push('');
    L.push('Name: ' + (state.name || ''));
    L.push('Email: ' + (state.email || ''));
    if (state.phone) L.push('Phone: ' + state.phone);
    if (state.country) L.push('Country: ' + state.country);
    if (state.message) { L.push(''); L.push('Notes: ' + state.message); }
    L.push('');
    L.push('Sent from mauritaniahorizons.com');
    return L.join('\n');
  }

  /* ---------------------------------------------------------- actions */
  if (next) next.addEventListener('click', function (e) {
    e.preventDefault();
    collect();
    if (!validate(step)) return;
    if (step + 1 === LAST - 1) fillRecap();
    go(step + 1);
  });

  if (back) back.addEventListener('click', function (e) { e.preventDefault(); go(step - 1); });

  $$('[data-goto]', form).forEach(function (b) {
    b.addEventListener('click', function (e) { e.preventDefault(); go(parseInt(b.dataset.goto, 10)); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    collect();
    for (var i = 0; i < LAST - 1; i++) {
      if (!validate(i)) { go(i); return; }
    }
    var msg = buildMessage();
    var wa = 'https://wa.me/22246656594?text=' + encodeURIComponent(msg);
    var mail = 'mailto:contact@mauritaniahorizons.com' +
      '?subject=' + encodeURIComponent('Booking request — ' + labelFor(state.journey || '')) +
      '&body=' + encodeURIComponent(msg);

    var w = $('[data-final-wa]'); if (w) w.href = wa;
    var m = $('[data-final-mail]'); if (m) m.href = mail;
    var c = $('[data-copy]');
    if (c) c.addEventListener('click', function () {
      navigator.clipboard && navigator.clipboard.writeText(msg).then(function () {
        c.textContent = 'Copied';
        setTimeout(function () { c.textContent = 'Copy the summary'; }, 2200);
      });
    });

    go(LAST);
    window.open(wa, '_blank', 'noopener');
    try { sessionStorage.removeItem('mh-booking'); } catch (er) { /* privé */ }
  });

  /* pré-sélection depuis ?journey=slug */
  var q = new URLSearchParams(location.search);
  var pre = q.get('journey');
  if (pre) {
    var r = form.querySelector('[name=journey][value="' + pre + '"]');
    if (r) { r.checked = true; state.journey = pre; save(); }
  }
  ['arrival', 'departure', 'adults'].forEach(function (k) {
    if (q.get(k) && form.elements[k]) { form.elements[k].value = q.get(k); state[k] = q.get(k); }
  });

  paint();
})();
