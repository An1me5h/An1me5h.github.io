var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function esc(text) {
  return String(text).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

// Theme toggle: remembers the choice, otherwise follows the system setting
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  btn.addEventListener('click', function () {
    var current = root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
    var next = current === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// ---------- Intro <-> profile, with the name morphing into the page title ----------
(function () {
  var body = document.body;
  var profile = document.getElementById('profile');
  var enterTimer = 0;

  function playEntrance() {
    profile.classList.remove('is-entering');
    void profile.offsetWidth;
    profile.classList.add('is-entering');
    clearTimeout(enterTimer);
    enterTimer = setTimeout(function () { profile.classList.remove('is-entering'); }, 2000);
  }

  function show(view, animate) {
    if (body.getAttribute('data-view') === view) return;
    function swap() {
      body.setAttribute('data-view', view);
      window.scrollTo(0, 0);
      if (view === 'profile') playEntrance();
    }
    if (animate && document.startViewTransition && !reduceMotion) document.startViewTransition(swap);
    else swap();
  }

  document.getElementById('enter').addEventListener('click', function (e) {
    e.preventDefault();
    history.pushState({ view: 'profile' }, '', '#profile');
    show('profile', true);
  });

  document.getElementById('replay').addEventListener('click', function () {
    if (history.state && history.state.view === 'profile') {
      history.back();
    } else {
      history.replaceState(null, '', location.pathname + location.search);
      show('intro', true);
    }
  });

  window.addEventListener('popstate', function () {
    show(location.hash === '#profile' ? 'profile' : 'intro', true);
  });

  // A shared link to #profile skips the intro
  if (location.hash === '#profile') show('profile', false);
})();

// ---------- Tiles and their story sheets ----------
var Tiles = (function () {
  var sheet = document.getElementById('sheet');
  var sheetBody = document.getElementById('sheet-body');
  var tiles = window.TILES || [];
  var byId = {};
  tiles.forEach(function (t) { byId[t.id] = t; });

  var ICONS = {
    robot: '<path d="M12 3v3M8 21v-3M16 21v-3"/><rect x="5" y="6" width="14" height="12" rx="3"/><circle cx="9.5" cy="11" r="1.2"/><circle cx="14.5" cy="11" r="1.2"/><path d="M9.5 15h5M2 11v3M22 11v3"/>',
    gamepad: '<path d="M6 8h12a4 4 0 0 1 4 4v1.5a3.5 3.5 0 0 1-6.3 2.1L14.5 14h-5l-1.2 1.6A3.5 3.5 0 0 1 2 13.5V12a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3"/><circle cx="16" cy="11.5" r=".6"/><circle cx="18" cy="13.5" r=".6"/>',
    atom: '<circle cx="12" cy="12" r="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)"/>',
    code: '<path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5l-3 14"/>',
    camera: '<path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1z"/><circle cx="12" cy="13" r="3.5"/>',
    layers: '<path d="M12 3l9 5-9 5-9-5 9-5z"/><path d="M3 13l9 5 9-5"/><path d="M3 17.5l9 5 9-5" opacity=".5"/>',
    handshake: '<path d="M2 11l4-4 4 2 3-2 4 1 5 3"/><path d="M6 7v7l5 4c.8.6 1.8.6 2.5 0L19 14V9"/><path d="M10 14l2 1.5M12.5 12.5l2 1.5"/>',
    scale: '<path d="M12 4v16M7 20h10M5 8h14"/><path d="M5 8l-3 6a3 3 0 0 0 6 0L5 8zM19 8l-3 6a3 3 0 0 0 6 0l-3-6z"/>',
    chart: '<path d="M4 20V4M4 20h16"/><rect x="7" y="11" width="3" height="6" rx=".5"/><rect x="12" y="7" width="3" height="10" rx=".5"/><rect x="17" y="13" width="3" height="4" rx=".5"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="M20 20l-4.8-4.8M7.5 12l2-2.5 2 1.5 2-3"/>',
    factory: '<path d="M3 20V10l5 3V10l5 3V10l5 3V5h3v15H3z"/><path d="M7 17h2M11 17h2M15 17h2"/>',
    network: '<circle cx="5" cy="6" r="2.2"/><circle cx="19" cy="6" r="2.2"/><circle cx="12" cy="18" r="2.2"/><circle cx="12" cy="10" r="1.6"/><path d="M7 7l3.6 2.2M17 7l-3.6 2.2M12 11.6v4.2"/>'
  };

  function badgeHtml(t) {
    if (t.icon) return '<span class="tile__icon"><svg viewBox="0 0 24 24" aria-hidden="true">' + ICONS[t.icon] + '</svg></span>';
    var html = (t.logos || []).map(function (src) {
      return '<span class="tile__logo"><img src="' + esc(src) + '" alt="" loading="lazy"></span>';
    }).join('');
    if (t.mono) html += '<span class="tile__mono" aria-hidden="true">' + esc(t.mono) + '</span>';
    return '<span class="tile__logos">' + html + '</span>';
  }

  function tagsHtml(tags) {
    if (!tags || !tags.length) return '';
    return '<ul class="tags">' + tags.map(function (tag) { return '<li>' + esc(tag) + '</li>'; }).join('') + '</ul>';
  }

  function linksHtml(links) {
    return (links || []).map(function (link) {
      return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener">' + esc(link.label) + ' ↗</a>';
    }).join('');
  }

  // Build each section's tiles from data.js
  document.querySelectorAll('.bento[data-group]').forEach(function (bento) {
    var group = bento.getAttribute('data-group');
    bento.innerHTML = tiles.filter(function (t) { return t.group === group; }).map(function (t) {
      var cls = 'tile' + (t.span === 2 ? ' tile--span2' : '') + (t.tall ? ' tile--tall' : '');
      var list = t.list ? '<span class="tile__list">' + t.list.map(function (item) { return '<span>' + esc(item) + '</span>'; }).join('') + '</span>' : '';
      return '<button type="button" class="' + cls + '" data-open="' + t.id + '" data-color="' + t.color + '">' +
        badgeHtml(t) +
        '<span class="tile__kicker">' + esc(t.kicker) + '</span>' +
        '<h3>' + esc(t.title) + '</h3>' +
        '<span class="tile__teaser">' + esc(t.teaser) + '</span>' + list +
        '<span class="tile__more">' + esc(t.more || 'Open') + ' →</span>' +
      '</button>';
    }).join('');
  });

  // Stagger the entrance animation down the page (the timeline comes first)
  document.getElementById('life').style.setProperty('--i', 0);
  document.querySelectorAll('#profile .tile').forEach(function (el, i) {
    el.style.setProperty('--i', Math.min(i + 1, 16));
  });

  function open(id) {
    var t = byId[id];
    if (!t) return;
    sheet.setAttribute('data-color', t.color);

    var steps = t.story.map(function (step, i) {
      var links = linksHtml(step.links);
      if (step.open && byId[step.open]) {
        links += '<button type="button" class="steps__open" data-open="' + step.open + '">' + esc(byId[step.open].title) + ' →</button>';
      }
      return '<li style="--i:' + i + '">' +
        (step.when ? '<p class="steps__when">' + esc(step.when) + '</p>' : '') +
        '<h3>' + esc(step.title) + '</h3>' +
        (step.text ? '<p>' + esc(step.text) + '</p>' : '') +
        tagsHtml(step.tags) +
        (links ? '<div class="steps__links">' + links + '</div>' : '') +
      '</li>';
    }).join('');

    var facts = t.facts ? '<dl class="facts">' + t.facts.map(function (f) {
      return '<div><dt>' + esc(f.k) + '</dt><dd>' + esc(f.v) + '</dd></div>';
    }).join('') + '</dl>' : '';
    var footer = tagsHtml(t.tags) + (t.links ? '<div class="steps__links">' + linksHtml(t.links) + '</div>' : '');

    sheetBody.innerHTML =
      '<div class="sheet__head">' + badgeHtml(t) +
        '<div><p class="sheet__kicker">' + esc(t.kicker) + '</p><h2 id="sheet-title">' + esc(t.title) + '</h2></div>' +
      '</div>' + facts +
      '<ol class="steps">' + steps + '</ol>' +
      (footer ? '<div class="sheet__tags">' + footer + '</div>' : '');

    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
  }

  document.addEventListener('click', function (e) {
    var trigger = e.target.closest('[data-open]');
    if (trigger) open(trigger.getAttribute('data-open'));
  });
  document.getElementById('sheet-close').addEventListener('click', function () { sheet.close(); });
  // Click on the dimmed backdrop closes the sheet
  sheet.addEventListener('click', function (e) { if (e.target === sheet) sheet.close(); });

  return { open: open };
})();

// ---------- Life timeline: one line from 2000, coloured by era ----------
(function () {
  var data = window.TIMELINE;
  var life = document.getElementById('life');
  var view = document.getElementById('life-view');
  var hint = document.getElementById('life-hint');
  var backBtn = document.getElementById('life-back');
  if (!data || !view) return;

  var DRAW_SECONDS = 3.2;
  var BASE_HEIGHT = 112;
  var ROW = 26;
  // Years before university are squeezed so the last decade gets most of the room
  function yearWeight(y) { return y < 2018 ? 0.22 : 1; }

  var START_YEAR = Number(data.start.slice(0, 4));

  function parse(value) {
    if (value === 'now') {
      var d = new Date();
      return { y: d.getFullYear(), m: d.getMonth() + 1 };
    }
    return { y: Number(value.slice(0, 4)), m: Number(value.slice(5, 7)) };
  }

  // Distance from the start, in weighted years. `part` is how far into the month: 0 start, 0.5 middle, 1 end.
  function units(value, part) {
    var d = parse(value);
    var total = 0;
    for (var y = START_YEAR; y < d.y; y++) total += yearWeight(y);
    return total + yearWeight(d.y) * (d.m - 1 + part) / 12;
  }
  var TOTAL = units(data.end, 1);
  function pos(value, part) { return Math.max(0, Math.min(1, units(value, part || 0) / TOTAL)); }
  function pct(f) { return (f * 100).toFixed(3) + '%'; }

  var eras = data.eras;
  var lastEra = eras[eras.length - 1];
  var lineEnd = pos(lastEra.to, 1);
  var nowPos = pos('now', 0.5);
  var openEra = null;

  // ---- Build the overview ----
  var html = '<div class="life__track" id="life-track">';

  var years = [];
  for (var y = START_YEAR; y < 2018; y += 5) years.push(y);
  for (var yy = 2018; yy <= Number(data.end.slice(0, 4)); yy++) years.push(yy);
  years.forEach(function (year, i) {
    var cls = 'life__tick' + (year < 2018 ? ' is-minor' : '') + (i === 0 ? ' is-first' : '');
    html += '<span class="' + cls + '" style="left:' + pct(pos(year + '-01')) + '">' + year + '</span>';
  });

  // The line: one gradient, solid inside each era and blending across the gaps
  var stops = [];
  eras.forEach(function (era) {
    var color = 'var(--c-' + era.color + ')';
    stops.push(color + ' ' + pct(pos(era.from) / lineEnd));
    stops.push(color + ' ' + pct(pos(era.to, 1) / lineEnd));
  });
  html += '<div class="life__line" style="width:' + pct(lineEnd) + ';background:linear-gradient(90deg,' + stops.join(',') + ')"></div>';
  html += '<div class="life__future" style="left:' + pct(nowPos) + ';width:' + pct(lineEnd - nowPos) + '"></div>';
  html += '<span class="life__now" style="left:' + pct(nowPos) + '" title="Now"></span>';

  eras.forEach(function (era) {
    if (!era.parts) return;
    var a = pos(era.from);
    var b = pos(era.to, 1);
    var delay = ((a + b) / 2 / lineEnd * DRAW_SECONDS).toFixed(2) + 's';
    html += '<button type="button" class="life__era" data-era="' + era.id + '" data-color="' + era.color + '"' +
      ' style="left:' + pct(a) + ';width:' + pct(b - a) + '"' +
      ' aria-label="' + esc(era.title + ', ' + era.years + '. Show what happened') + '"></button>';
    html += '<span class="life__label" data-color="' + era.color + '" style="left:' + pct((a + b) / 2) + ';--delay:' + delay + '">' + esc(era.label) + '</span>';
  });

  data.milestones.forEach(function (m, i) {
    var at = pos(m.date, 0.5);
    var delay = (at / lineEnd * DRAW_SECONDS).toFixed(2) + 's';
    html += '<button type="button" class="life__mile" data-mile="' + i + '" style="left:' + pct(at) + ';--delay:' + delay + '" aria-label="' + esc(m.type + ': ' + m.title + '. ' + m.meta) + '"></button>';
  });

  html += '<div class="life__parts" id="life-parts"></div></div>';
  view.innerHTML = html;

  var track = document.getElementById('life-track');
  var partsBox = document.getElementById('life-parts');

  // ---- Milestone tooltip: lives outside the clipped view so it is never cut off ----
  var tip = document.createElement('div');
  tip.className = 'life__tip';
  tip.setAttribute('aria-hidden', 'true');
  life.appendChild(tip);

  function showTip(btn) {
    var m = data.milestones[Number(btn.getAttribute('data-mile'))];
    tip.innerHTML =
      '<span class="tip__type">' + esc(m.type) + '</span>' +
      '<span class="tip__title">' + esc(m.title) + '</span>' +
      '<span class="tip__meta">' + esc(m.meta) + '</span>';
    var lifeBox = life.getBoundingClientRect();
    var box = btn.getBoundingClientRect();
    var centre = box.left + box.width / 2 - lifeBox.left;
    var half = tip.offsetWidth / 2;
    tip.style.left = Math.max(half + 8, Math.min(lifeBox.width - half - 8, centre)) + 'px';
    tip.style.top = (box.top - lifeBox.top - 10) + 'px';
    tip.classList.add('is-shown');
  }
  function hideTip() { tip.classList.remove('is-shown'); }

  view.addEventListener('mouseover', function (e) {
    var btn = e.target.closest('.life__mile');
    if (btn) showTip(btn);
  });
  view.addEventListener('mouseout', function (e) {
    if (e.target.closest('.life__mile')) hideTip();
  });
  view.addEventListener('focusin', function (e) {
    var btn = e.target.closest('.life__mile');
    if (btn) showTip(btn);
  });
  view.addEventListener('focusout', hideTip);

  // ---- Zooming ----
  function setRange(from, to) {
    var zoom = 1 / (to - from);
    track.style.width = (zoom * 100) + '%';
    track.style.left = (-from * zoom * 100) + '%';
    return zoom;
  }

  var measureCtx = document.createElement('canvas').getContext('2d');
  function textWidth(text) {
    measureCtx.font = '500 12px Inter, system-ui, sans-serif';
    return Math.ceil(measureCtx.measureText(text).width) + 4;
  }

  // Lay the era's parts out in rows under the line, in pixels at the zoomed scale
  function renderParts(era, zoom) {
    var trackPx = view.clientWidth * zoom;
    var rowEnds = [];
    var items = era.parts.slice().sort(function (p, q) { return pos(p.start) - pos(q.start); });

    partsBox.innerHTML = items.map(function (p) {
      var name = p.short || p.title;
      var isPoint = !p.end;
      var x0 = (isPoint ? pos(p.start, 0.5) : pos(p.start)) * trackPx;
      var barW = isPoint ? 0 : Math.max((pos(p.end, 1) - pos(p.start)) * trackPx, 8);
      var nameW = textWidth(name);
      var inside = !isPoint && barW >= nameW + 16;
      var markLeft = isPoint ? x0 - 5.5 : x0;
      var markRight = isPoint ? x0 + 5.5 : x0 + barW;
      var flip = !inside && markRight + 6 + nameW > trackPx;

      var from = flip ? markLeft - 6 - nameW : markLeft;
      var to = inside || flip ? markRight : markRight + 6 + nameW;
      var row = 0;
      while (row < rowEnds.length && rowEnds[row] + 10 > from) row++;
      rowEnds[row] = to;

      var cls = 'life__part' + (isPoint ? ' is-point' : '') + (inside ? ' is-inside' : '') + (flip ? ' is-flip' : '');
      var left = flip ? markRight : markLeft;
      return '<button type="button" class="' + cls + '" data-kind="' + p.kind + '"' + (p.open ? ' data-open="' + p.open + '"' : '') +
        ' style="left:' + left + 'px;top:' + (row * ROW) + 'px;--w:' + barW + 'px" title="' + esc(p.title) + '">' +
        '<span class="mark" aria-hidden="true"></span><span class="txt">' + esc(name) + '</span></button>';
    }).join('');

    view.style.height = (BASE_HEIGHT + rowEnds.length * ROW + 10) + 'px';
  }

  function zoomTo(era) {
    openEra = era;
    var a = pos(era.from);
    var b = pos(era.to, 1);
    var pad = (b - a) * 0.06;
    var zoom = setRange(Math.max(0, a - pad), Math.min(1, b + pad));
    renderParts(era, zoom);
    partsBox.classList.add('is-shown');
    view.querySelectorAll('.life__era').forEach(function (btn) {
      btn.classList.toggle('is-open', btn.getAttribute('data-era') === era.id);
    });
    hint.textContent = era.title + ' · ' + era.years;
    backBtn.hidden = false;
  }

  function zoomOut() {
    if (!openEra) return;
    openEra = null;
    setRange(0, 1);
    partsBox.classList.remove('is-shown');
    view.style.height = BASE_HEIGHT + 'px';
    view.querySelectorAll('.life__era').forEach(function (btn) { btn.classList.remove('is-open'); });
    hint.textContent = '';
    backBtn.hidden = true;
    setTimeout(function () { if (!openEra) partsBox.innerHTML = ''; }, 450);
  }

  view.addEventListener('click', function (e) {
    var mile = e.target.closest('.life__mile');
    if (mile) { showTip(mile); return; }   // tap on touch screens
    var btn = e.target.closest('.life__era');
    if (!btn || btn.classList.contains('is-open')) return;
    var era = eras.filter(function (x) { return x.id === btn.getAttribute('data-era'); })[0];
    if (era) zoomTo(era);
  });
  backBtn.addEventListener('click', zoomOut);
  life.addEventListener('keydown', function (e) { if (e.key === 'Escape') zoomOut(); });

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () { if (openEra) zoomTo(openEra); }, 150);
  });

  // Draw the line from 2000 onwards the first time it comes into view
  if ('IntersectionObserver' in window && !reduceMotion) {
    var drawer = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        life.classList.add('is-drawn');
        drawer.disconnect();
      }
    }, { threshold: 0.4 });
    drawer.observe(life);
  } else {
    life.classList.add('is-drawn');
  }
})();

document.getElementById('year').textContent = new Date().getFullYear();
