/*
  Shree Shankar Maharaj Seva Mandal, Chinchwad
  Site behaviour. Plain JavaScript, no dependencies.
  Content (events, testimonials, gallery) comes from data.js.
*/
(function () {
  'use strict';

  var D = window.SSMSM || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function $(sel, root) { return (root || document).querySelector(sel); }
  function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function icon(name, cls) { return '<svg class="' + (cls || 'i') + '" aria-hidden="true"><use href="#i-' + name + '"></use></svg>'; }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Dates ---------- */
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  function pad(n) { return String(n).padStart(2, '0'); }
  function keyOf(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()); }
  function parseKey(k) { var p = k.split('-').map(Number); return new Date(p[0], p[1] - 1, p[2]); }
  function addDays(d, n) { return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n); }
  function fmtLong(d) { return d.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function fmtShort(d) { return d.getDate() + ' ' + MONTHS[d.getMonth()].slice(0, 3); }
  function fmtTime(t) {
    var p = t.split(':').map(Number), h = p[0], ap = h >= 12 ? 'PM' : 'AM';
    return (h % 12 || 12) + ':' + pad(p[1]) + ' ' + ap;
  }
  function today() { var t = new Date(); return new Date(t.getFullYear(), t.getMonth(), t.getDate()); }

  /* ---------- Header and mobile menu ---------- */
  function initHeader() {
    var header = $('.site-header');
    if (!header) return;
    var onScroll = function () { header.classList.toggle('is-scrolled', window.scrollY > 8); };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = $('.nav-toggle', header), nav = $('#site-nav');
    if (!toggle || !nav) return;
    function setOpen(open) {
      header.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      $('use', toggle).setAttribute('href', open ? '#i-x' : '#i-menu');
    }
    toggle.addEventListener('click', function () { setOpen(toggle.getAttribute('aria-expanded') !== 'true'); });
    nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && header.classList.contains('nav-open')) { setOpen(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1101px)').addEventListener('change', function (e) { if (e.matches) setOpen(false); });
  }

  /* ---------- Hero slider ---------- */
  function initHero() {
    var hero = $('[data-hero]');
    if (!hero) return;
    var slides = $$('.hero-slide', hero);
    var dotsWrap = $('.hero-dots', hero), toggle = $('[data-hero-toggle]', hero);
    var DURATION = 6500, i = 0, timer = null, hovering = false, stopped = reduceMotion;
    hero.style.setProperty('--hero-duration', DURATION + 'ms');

    dotsWrap.innerHTML = slides.map(function (s, n) {
      return '<button class="hero-dot" type="button" aria-label="Show slide ' + (n + 1) + ' of ' + slides.length + '"><span></span></button>';
    }).join('');
    var dots = $$('.hero-dot', dotsWrap);

    function schedule() {
      clearTimeout(timer);
      hero.classList.remove('is-playing');
      if (stopped || hovering) return;
      void hero.offsetWidth; // restart the progress animation
      hero.classList.add('is-playing');
      timer = setTimeout(function () { show(i + 1); }, DURATION);
    }
    function show(n) {
      i = (n + slides.length) % slides.length;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle('is-active', on);
        s.setAttribute('aria-hidden', String(!on));
        s.inert = !on;
      });
      dots.forEach(function (d, k) {
        d.classList.toggle('is-active', k === i);
        d.setAttribute('aria-current', k === i ? 'true' : 'false');
      });
      schedule();
    }
    function setStopped(v) {
      stopped = v;
      toggle.setAttribute('aria-label', v ? 'Play slideshow' : 'Pause slideshow');
      $('use', toggle).setAttribute('href', v ? '#i-play' : '#i-pause');
      schedule();
    }

    dots.forEach(function (d, k) { d.addEventListener('click', function () { show(k); }); });
    $('[data-hero-prev]', hero).addEventListener('click', function () { show(i - 1); });
    $('[data-hero-next]', hero).addEventListener('click', function () { show(i + 1); });
    toggle.addEventListener('click', function () { setStopped(!stopped); });
    hero.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    hero.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    hero.addEventListener('focusin', function () { hovering = true; schedule(); });
    hero.addEventListener('focusout', function (e) { if (!hero.contains(e.relatedTarget)) { hovering = false; schedule(); } });
    swipe(hero, function () { show(i + 1); }, function () { show(i - 1); });
    document.addEventListener('visibilitychange', function () { if (document.hidden) clearTimeout(timer); else schedule(); });

    if (reduceMotion) setStopped(true);
    show(0);
  }

  function swipe(el, onLeft, onRight) {
    var x0 = null, y0 = null;
    el.addEventListener('pointerdown', function (e) { if (e.pointerType !== 'mouse') { x0 = e.clientX; y0 = e.clientY; } });
    el.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0, dy = e.clientY - y0;
      x0 = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onLeft : onRight)();
    });
    el.addEventListener('pointercancel', function () { x0 = null; });
  }

  /* ---------- Counters ---------- */
  function initCounters() {
    var els = $$('[data-count]');
    if (!els.length || reduceMotion || !('IntersectionObserver' in window)) return;
    function fmt(n) { return n.toLocaleString('en-IN'); }
    function run(el) {
      var target = +el.dataset.count, suffix = el.dataset.suffix || '', start = performance.now(), dur = 1600;
      function tick(t) {
        var p = Math.min(1, (t - start) / dur), eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * eased)) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.6 });
    els.forEach(function (el) { el.textContent = '0' + (el.dataset.suffix || ''); io.observe(el); });
  }

  /* ---------- Reveal on scroll ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(function (e) { e.classList.add('is-visible'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Testimonials carousel ---------- */
  function initTestimonials(root) {
    var items = D.testimonials || [];
    if (!items.length) return;
    root.setAttribute('aria-roledescription', 'carousel');
    root.innerHTML =
      '<div class="t-viewport"><div class="t-track">' +
      items.map(function (t, n) {
        return '<figure class="t-card" role="group" aria-roledescription="slide" aria-label="' + (n + 1) + ' of ' + items.length + '">' +
          '<span class="t-mark">' + icon('quote') + '</span>' +
          '<blockquote class="t-text"><p>' + esc(t.quote) + '</p></blockquote>' +
          '<figcaption class="t-person"><span class="t-avatar">' + icon(t.icon || 'heart') + '</span>' +
          '<span><cite class="t-name">' + esc(t.name) + '</cite><span class="t-role">' + esc(t.role) + '</span></span></figcaption>' +
          '</figure>';
      }).join('') +
      '</div></div>' +
      '<div class="t-controls"><div class="dots" role="group" aria-label="Choose testimonials"></div>' +
      '<div class="t-arrows">' +
      '<button type="button" class="icon-btn" data-t-toggle aria-label="Pause testimonials">' + icon('pause') + '</button>' +
      '<button type="button" class="icon-btn" data-t-prev aria-label="Previous testimonial">' + icon('chevron-left') + '</button>' +
      '<button type="button" class="icon-btn" data-t-next aria-label="Next testimonial">' + icon('chevron-right') + '</button>' +
      '</div></div>';

    var track = $('.t-track', root), cards = $$('.t-card', root), dotsWrap = $('.dots', root), toggle = $('[data-t-toggle]', root);
    var index = 0, per = 1, timer = null, hovering = false, stopped = reduceMotion, DURATION = 7000;

    function maxIndex() { return Math.max(0, items.length - per); }
    function buildDots() {
      var count = maxIndex() + 1;
      dotsWrap.innerHTML = Array.from({ length: count }, function (_, n) {
        return '<button type="button" class="dot" aria-label="Show testimonials from ' + (n + 1) + '"></button>';
      }).join('');
      $$('.dot', dotsWrap).forEach(function (d, n) { d.addEventListener('click', function () { go(n); }); });
    }
    function measure() {
      var p = parseInt(getComputedStyle(track).getPropertyValue('--per'), 10) || 1;
      if (p !== per || !dotsWrap.children.length) { per = p; buildDots(); }
    }
    function go(n) {
      var max = maxIndex();
      index = n > max ? 0 : n < 0 ? max : n;
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      var x = index * (cards[0].getBoundingClientRect().width + gap);
      track.style.transform = 'translateX(' + (-x) + 'px)';
      cards.forEach(function (c, k) {
        var visible = k >= index && k < index + per;
        c.setAttribute('aria-hidden', String(!visible));
        c.inert = !visible;
      });
      $$('.dot', dotsWrap).forEach(function (d, k) { d.setAttribute('aria-current', k === index ? 'true' : 'false'); });
      schedule();
    }
    function schedule() {
      clearTimeout(timer);
      if (stopped || hovering) return;
      timer = setTimeout(function () { go(index + 1); }, DURATION);
    }
    function setStopped(v) {
      stopped = v;
      toggle.setAttribute('aria-label', v ? 'Play testimonials' : 'Pause testimonials');
      $('use', toggle).setAttribute('href', v ? '#i-play' : '#i-pause');
      schedule();
    }

    $('[data-t-prev]', root).addEventListener('click', function () { go(index - 1); });
    $('[data-t-next]', root).addEventListener('click', function () { go(index + 1); });
    toggle.addEventListener('click', function () { setStopped(!stopped); });
    root.addEventListener('mouseenter', function () { hovering = true; schedule(); });
    root.addEventListener('mouseleave', function () { hovering = false; schedule(); });
    root.addEventListener('focusin', function () { hovering = true; schedule(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { hovering = false; schedule(); } });
    swipe($('.t-viewport', root), function () { go(index + 1); }, function () { go(index - 1); });

    var resizeT;
    window.addEventListener('resize', function () {
      clearTimeout(resizeT);
      resizeT = setTimeout(function () { measure(); go(Math.min(index, maxIndex())); }, 120);
    });

    if (reduceMotion) setStopped(true);
    measure();
    go(0);
  }

  /* ---------- Calendar exports ---------- */
  function utcStamp(dateKey, time) {
    // IST is UTC+05:30 all year (no daylight saving).
    var d = parseKey(dateKey), t = time.split(':').map(Number);
    var ms = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate(), t[0], t[1]) - 330 * 60000;
    return new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  }
  function eventRange(e) {
    var endKey = e.end || e.date;
    if (e.time) {
      return { start: utcStamp(e.date, e.time), end: utcStamp(endKey, e.endTime || e.time), allDay: false };
    }
    return { start: e.date.replace(/-/g, ''), end: keyOf(addDays(parseKey(endKey), 1)).replace(/-/g, ''), allDay: true };
  }
  function gcalLink(e) {
    var r = eventRange(e);
    var params = new URLSearchParams({
      action: 'TEMPLATE',
      text: e.title,
      dates: r.start + '/' + r.end,
      details: (e.desc || '') + '\n\nShree Shankar Maharaj Seva Mandal, Chinchwad. Call ' + (D.phone || ''),
      location: e.place || ''
    });
    return 'https://calendar.google.com/calendar/render?' + params.toString();
  }
  function icsText(s) { return String(s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n'); }
  function downloadIcs(e) {
    var r = eventRange(e);
    var now = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    var lines = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//SSMSM Chinchwad//Events//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      'UID:' + e.id + '@ssmsmchinchwad.ngo',
      'DTSTAMP:' + now,
      r.allDay ? 'DTSTART;VALUE=DATE:' + r.start : 'DTSTART:' + r.start,
      r.allDay ? 'DTEND;VALUE=DATE:' + r.end : 'DTEND:' + r.end,
      'SUMMARY:' + icsText(e.title),
      'LOCATION:' + icsText(e.place),
      'DESCRIPTION:' + icsText(e.desc),
      'END:VEVENT', 'END:VCALENDAR'
    ];
    var blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    var a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = e.id + '.ics';
    document.body.appendChild(a);
    a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 0);
  }

  /* ---------- Event calendar ---------- */
  function initCalendar(root) {
    var cats = D.categories || {};
    var all = (D.events || []).map(function (e) {
      return Object.assign({}, e, { start: parseKey(e.date), endD: parseKey(e.end || e.date) });
    }).sort(function (a, b) { return a.start - b.start || (a.time || '').localeCompare(b.time || ''); });
    var byId = {};
    all.forEach(function (e) { byId[e.id] = e; });

    var t0 = today(), todayKey = keyOf(t0);
    var view = new Date(t0.getFullYear(), t0.getMonth(), 1);
    var selected = null, focusKey = todayKey;
    var active = new Set(Object.keys(cats));

    root.innerHTML =
      '<div class="cal">' +
        '<div class="cal-main">' +
          '<div class="cal-head">' +
            '<h3 class="cal-title" aria-live="polite"></h3>' +
            '<div class="cal-nav">' +
              '<button type="button" class="btn btn-ghost btn-sm" data-today>Today</button>' +
              '<button type="button" class="icon-btn sm" data-prev aria-label="Previous month">' + icon('chevron-left') + '</button>' +
              '<button type="button" class="icon-btn sm" data-next aria-label="Next month">' + icon('chevron-right') + '</button>' +
            '</div>' +
          '</div>' +
          '<div class="filters" role="group" aria-label="Show event types">' +
            Object.keys(cats).map(function (k) {
              return '<button type="button" class="filter" aria-pressed="true" data-cat="' + k + '" style="--c:' + cats[k].color + '"><span class="sw"></span>' + esc(cats[k].label) + '</button>';
            }).join('') +
          '</div>' +
          '<div class="cal-grid"></div>' +
          '<p class="cal-legend">Pick a date to see its events. Use the arrow keys to move between days.</p>' +
        '</div>' +
        '<div class="cal-side">' +
          '<div class="cal-side-head"><h3><span class="cal-side-title"></span> <span class="count"></span></h3>' +
          '<button type="button" class="btn btn-ghost btn-sm" data-clear hidden>Whole month</button></div>' +
          '<ul class="ev-list" aria-live="polite"></ul>' +
        '</div>' +
      '</div>';

    var title = $('.cal-title', root), grid = $('.cal-grid', root), list = $('.ev-list', root);
    var sideTitle = $('.cal-side-title', root), sideCount = $('.count', root), clearBtn = $('[data-clear]', root);

    function visible() { return all.filter(function (e) { return active.has(e.category); }); }
    function eventsOn(k, evs) { var d = parseKey(k); return evs.filter(function (e) { return d >= e.start && d <= e.endD; }); }

    function renderGrid() {
      var y = view.getFullYear(), m = view.getMonth();
      title.textContent = MONTHS[m] + ' ' + y;
      var evs = visible();
      var offset = new Date(y, m, 1).getDay();
      var days = new Date(y, m + 1, 0).getDate();
      var cells = Math.ceil((offset + days) / 7) * 7;
      var gridStart = new Date(y, m, 1 - offset);
      var inView = function (k) { var d = parseKey(k); return d.getMonth() === m && d.getFullYear() === y; };
      if (!inView(focusKey)) focusKey = selected && inView(selected) ? selected : (inView(todayKey) ? todayKey : keyOf(new Date(y, m, 1)));

      var html = DOW.map(function (d) { return '<div class="cal-dow" aria-hidden="true">' + d + '</div>'; }).join('');
      for (var n = 0; n < cells; n++) {
        var d = addDays(gridStart, n), k = keyOf(d), dayEvs = eventsOn(k, evs);
        var cls = ['cal-day'];
        if (d.getMonth() !== m) cls.push('is-other');
        if (k === todayKey) cls.push('is-today');
        if (d < t0) cls.push('is-past');
        if (dayEvs.length) cls.push('has-events');
        var label = fmtLong(d) + (k === todayKey ? ', today' : '') + (dayEvs.length ? ', ' + dayEvs.length + (dayEvs.length > 1 ? ' events' : ' event') : '');
        html += '<button type="button" class="' + cls.join(' ') + '" data-key="' + k + '" aria-label="' + esc(label) + '" aria-pressed="' + (selected === k) + '" tabindex="' + (k === focusKey ? 0 : -1) + '">' +
          '<span class="n">' + d.getDate() + '</span><span class="ev-dots">' +
          dayEvs.slice(0, 3).map(function (e) { return '<i style="--c:' + cats[e.category].color + '"></i>'; }).join('') +
          '</span></button>';
      }
      grid.innerHTML = html;
    }

    function eventCard(e) {
      var c = cats[e.category] || {}, past = e.endD < t0;
      var when = e.time ? fmtTime(e.time) + (e.endTime ? ' \u2013 ' + fmtTime(e.endTime) : '') : 'All day';
      return '<li class="ev' + (past ? ' is-past' : '') + '" style="--c:' + c.color + '">' +
        '<div class="ev-date" aria-hidden="true"><span class="d">' + e.start.getDate() + '</span><span class="m">' + MONTHS[e.start.getMonth()].slice(0, 3) + '</span></div>' +
        '<div>' +
          '<span class="ev-cat">' + icon(c.icon) + esc(c.label) + (past ? '<span class="ev-tag">Past</span>' : '') + '</span>' +
          '<h4>' + esc(e.title) + '</h4>' +
          '<div class="ev-meta">' +
            '<span class="visually-hidden">' + fmtLong(e.start) + '.</span>' +
            '<span>' + icon('clock') + when + '</span>' +
            (e.place ? '<span>' + icon('map-pin') + esc(e.place) + '</span>' : '') +
          '</div>' +
          (e.desc ? '<p class="ev-desc">' + esc(e.desc) + '</p>' : '') +
          (past ? '' :
            '<div class="ev-actions">' +
              '<a class="btn btn-ghost btn-sm" href="' + esc(gcalLink(e)) + '" target="_blank" rel="noopener">' + icon('plus') + 'Google Calendar</a>' +
              '<button type="button" class="btn btn-ghost btn-sm" data-ics="' + esc(e.id) + '">' + icon('download') + 'Download .ics</button>' +
            '</div>') +
        '</div></li>';
    }

    function renderList() {
      var evs = visible(), items, heading;
      if (selected) {
        items = eventsOn(selected, evs);
        heading = parseKey(selected).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
      } else {
        var y = view.getFullYear(), m = view.getMonth(), ms = new Date(y, m, 1), me = new Date(y, m + 1, 0);
        items = evs.filter(function (e) { return e.endD >= ms && e.start <= me; });
        // Upcoming first (soonest at the top), then past events (most recent first).
        items = items.filter(function (e) { return e.endD >= t0; })
          .concat(items.filter(function (e) { return e.endD < t0; }).reverse());
        heading = MONTHS[m] + ' ' + y;
      }
      clearBtn.hidden = !selected;
      sideTitle.textContent = heading;
      sideCount.textContent = items.length ? '(' + items.length + ')' : '';

      if (items.length) { list.innerHTML = items.map(eventCard).join(''); return; }
      var next = evs.filter(function (e) { return e.endD >= t0; })[0];
      list.innerHTML = '<li class="ev-empty">' + icon('calendar') +
        '<p>No events ' + (selected ? 'on this day' : 'this month') + (active.size < Object.keys(cats).length ? ' for the selected types' : '') + '.</p>' +
        (next ? '<button type="button" class="btn btn-ghost btn-sm" data-jump="' + keyOf(next.start) + '">Next: ' + esc(next.title) + ', ' + fmtShort(next.start) + '</button>' : '') +
        '</li>';
    }

    function render() { renderGrid(); renderList(); }
    function setView(d) { view = new Date(d.getFullYear(), d.getMonth(), 1); }

    grid.addEventListener('click', function (e) {
      var b = e.target.closest('.cal-day');
      if (!b) return;
      var k = b.dataset.key, d = parseKey(k);
      selected = selected === k ? null : k;
      focusKey = k;
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) setView(d);
      render();
      var nb = $('[data-key="' + k + '"]', grid);
      if (nb) nb.focus();
    });

    grid.addEventListener('keydown', function (e) {
      var b = e.target.closest('.cal-day');
      if (!b) return;
      var d = parseKey(b.dataset.key);
      switch (e.key) {
        case 'ArrowLeft': d = addDays(d, -1); break;
        case 'ArrowRight': d = addDays(d, 1); break;
        case 'ArrowUp': d = addDays(d, -7); break;
        case 'ArrowDown': d = addDays(d, 7); break;
        case 'Home': d = addDays(d, -d.getDay()); break;
        case 'End': d = addDays(d, 6 - d.getDay()); break;
        case 'PageUp': d = new Date(d.getFullYear(), d.getMonth() - 1, Math.min(d.getDate(), 28)); break;
        case 'PageDown': d = new Date(d.getFullYear(), d.getMonth() + 1, Math.min(d.getDate(), 28)); break;
        default: return;
      }
      e.preventDefault();
      focusKey = keyOf(d);
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) { setView(d); render(); }
      else {
        $$('.cal-day', grid).forEach(function (x) { x.tabIndex = x.dataset.key === focusKey ? 0 : -1; });
      }
      var nb = $('[data-key="' + focusKey + '"]', grid);
      if (nb) nb.focus();
    });

    $('[data-prev]', root).addEventListener('click', function () { setView(new Date(view.getFullYear(), view.getMonth() - 1, 1)); selected = null; render(); });
    $('[data-next]', root).addEventListener('click', function () { setView(new Date(view.getFullYear(), view.getMonth() + 1, 1)); selected = null; render(); });
    $('[data-today]', root).addEventListener('click', function () { setView(t0); selected = todayKey; focusKey = todayKey; render(); });
    clearBtn.addEventListener('click', function () { selected = null; renderGrid(); renderList(); });

    $$('.filter', root).forEach(function (f) {
      f.addEventListener('click', function () {
        var k = f.dataset.cat, on = f.getAttribute('aria-pressed') === 'true';
        if (on) active.delete(k); else active.add(k);
        f.setAttribute('aria-pressed', String(!on));
        render();
      });
    });

    root.addEventListener('click', function (e) {
      var ics = e.target.closest('[data-ics]');
      if (ics) { downloadIcs(byId[ics.dataset.ics]); return; }
      var jump = e.target.closest('[data-jump]');
      if (jump) {
        var d = parseKey(jump.dataset.jump);
        setView(d); selected = jump.dataset.jump; focusKey = selected;
        render();
      }
    });

    render();
  }

  /* ---------- Gallery and lightbox ---------- */
  function photo(file, size) { return 'assets/img/photos/' + file + '-' + size + '.jpg'; }
  function smallSize(it) { var r = 800 / Math.max(it.w, it.h); return { w: Math.round(it.w * r), h: Math.round(it.h * r) }; }

  var lb = null;
  function lightbox() {
    if (lb) return lb;
    var dlg = document.createElement('dialog');
    dlg.className = 'lightbox';
    dlg.setAttribute('aria-label', 'Photo viewer');
    dlg.innerHTML =
      '<figure class="lb-figure"><img class="lb-img" alt=""><figcaption class="lb-caption"></figcaption></figure>' +
      '<p class="lb-count" aria-live="polite"></p>' +
      '<button type="button" class="icon-btn lb-btn lb-close" aria-label="Close photo viewer">' + icon('x') + '</button>' +
      '<button type="button" class="icon-btn lb-btn lb-prev" aria-label="Previous photo">' + icon('chevron-left') + '</button>' +
      '<button type="button" class="icon-btn lb-btn lb-next" aria-label="Next photo">' + icon('chevron-right') + '</button>';
    document.body.appendChild(dlg);
    var img = $('.lb-img', dlg), cap = $('.lb-caption', dlg), count = $('.lb-count', dlg), items = [], i = 0;
    function show(n) {
      i = (n + items.length) % items.length;
      var it = items[i];
      img.src = photo(it.file, 1920);
      img.alt = it.alt;
      cap.textContent = it.caption;
      count.textContent = (i + 1) + ' / ' + items.length;
    }
    $('.lb-close', dlg).addEventListener('click', function () { dlg.close(); });
    $('.lb-prev', dlg).addEventListener('click', function () { show(i - 1); });
    $('.lb-next', dlg).addEventListener('click', function () { show(i + 1); });
    dlg.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(i - 1);
      if (e.key === 'ArrowRight') show(i + 1);
    });
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.classList.contains('lb-figure')) dlg.close(); });
    swipe(dlg, function () { show(i + 1); }, function () { show(i - 1); });
    lb = { open: function (list, n) { items = list; show(n); dlg.showModal(); } };
    return lb;
  }

  function initGallery(root) {
    var all = D.gallery || [], cats = D.galleryCategories || {};
    var limit = +root.dataset.limit || all.length, withFilters = root.hasAttribute('data-filters');
    var current = 'all';
    root.innerHTML =
      (withFilters ? '<div class="filters" role="group" aria-label="Filter photos">' +
        Object.keys(cats).map(function (k) {
          return '<button type="button" class="filter solo" data-g="' + k + '" aria-pressed="' + (k === 'all') + '">' + esc(cats[k]) + '</button>';
        }).join('') + '</div>' : '') +
      '<div class="masonry"></div>';
    var wall = $('.masonry', root);

    function shown() { return all.filter(function (it) { return current === 'all' || it.category === current; }).slice(0, limit); }
    function render() {
      wall.innerHTML = shown().map(function (it, n) {
        var s = smallSize(it);
        var when = parseKey(it.date);
        return '<figure class="g-item"><button type="button" class="g-btn" data-index="' + n + '" aria-label="Open photo: ' + esc(it.caption) + '">' +
          '<img src="' + photo(it.file, 800) + '" srcset="' + photo(it.file, 800) + ' ' + s.w + 'w, ' + photo(it.file, 1920) + ' ' + it.w + 'w" ' +
          'sizes="(max-width: 640px) 100vw, (max-width: 1000px) 50vw, 380px" width="' + s.w + '" height="' + s.h + '" loading="lazy" decoding="async" alt="' + esc(it.alt) + '">' +
          '</button><figcaption>' + esc(it.caption) + '<span>' + MONTHS[when.getMonth()] + ' ' + when.getFullYear() + '</span></figcaption></figure>';
      }).join('');
    }
    wall.addEventListener('click', function (e) {
      var b = e.target.closest('.g-btn');
      if (b) lightbox().open(shown(), +b.dataset.index);
    });
    $$('.filter', root).forEach(function (f) {
      f.addEventListener('click', function () {
        current = f.dataset.g;
        $$('.filter', root).forEach(function (x) { x.setAttribute('aria-pressed', String(x === f)); });
        render();
      });
    });
    render();
  }

  /* ---------- Contact form (opens WhatsApp with the message filled in) ---------- */
  function initContactForm() {
    var form = $('[data-wa-form]');
    if (!form) return;
    var status = $('.form-status', form);
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var f = new FormData(form);
      var text = 'Namaskar, my name is ' + f.get('name') + '.\n' +
        'I am writing about: ' + f.get('topic') + '\n' +
        (f.get('phone') ? 'My phone: ' + f.get('phone') + '\n' : '') +
        '\n' + f.get('message');
      window.open('https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
      status.hidden = false;
      status.textContent = 'WhatsApp opened in a new tab with your message. Press send there to reach us.';
    });
  }

  /* ---------- Boot ---------- */
  function boot() {
    initHeader();
    initHero();
    initCounters();
    $$('[data-testimonials]').forEach(initTestimonials);
    $$('[data-calendar]').forEach(initCalendar);
    $$('[data-gallery]').forEach(initGallery);
    initContactForm();
    $$('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
    initReveal();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
