// Theme toggle: remembers the choice, otherwise follows the system setting
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme-toggle');
  var systemDark = window.matchMedia('(prefers-color-scheme: dark)');

  function current() {
    return root.getAttribute('data-theme') || (systemDark.matches ? 'dark' : 'light');
  }

  btn.addEventListener('click', function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
})();

// Mobile menu
(function () {
  var btn = document.getElementById('menu-toggle');
  var links = document.getElementById('nav-links');

  function setOpen(open) {
    links.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  btn.addEventListener('click', function () {
    setOpen(!links.classList.contains('open'));
  });
  links.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') setOpen(false);
  });
})();

// ---------- Shared helpers for the timeline and project cards ----------
var Site = (function () {
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var laneById = {};
  (window.LANES || []).forEach(function (lane) { laneById[lane.id] = lane; });

  function esc(text) {
    return String(text).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  // "2026-04" -> { y: 2026, m: 4 }; "now" -> this month
  function parse(value) {
    if (value === 'now') {
      var d = new Date();
      return { y: d.getFullYear(), m: d.getMonth() + 1 };
    }
    var parts = value.split('-');
    return { y: Number(parts[0]), m: Number(parts[1]) };
  }

  function dateText(entry) {
    if (entry.label) return entry.label;
    var s = parse(entry.start);
    var startText = MONTHS[s.m - 1] + ' ' + s.y;
    if (!entry.end) return startText;
    if (entry.end === 'now') return startText + ' – present';
    var e = parse(entry.end);
    if (e.y === s.y && e.m === s.m) return startText;
    if (e.y === s.y) return MONTHS[s.m - 1] + ' – ' + MONTHS[e.m - 1] + ' ' + s.y;
    return startText + ' – ' + MONTHS[e.m - 1] + ' ' + e.y;
  }

  function sortValue(value) {
    var d = parse(value);
    return d.y * 12 + d.m;
  }

  function linksHtml(entry) {
    return (entry.links || []).map(function (link) {
      return '<a href="' + esc(link.url) + '" target="_blank" rel="noopener">' + esc(link.label) + ' ↗</a>';
    }).join('');
  }

  function tagsHtml(entry) {
    if (!entry.tags || !entry.tags.length) return '';
    return '<ul class="tags">' + entry.tags.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('') + '</ul>';
  }

  return {
    lane: function (entry) { return laneById[entry.lane]; },
    group: function (entry) { return laneById[entry.lane].group; },
    hasCard: function (entry) { return laneById[entry.lane].group === 'project' && entry.card !== false; },
    esc: esc, parse: parse, dateText: dateText, sortValue: sortValue,
    linksHtml: linksHtml, tagsHtml: tagsHtml
  };
})();

// ---------- Journey timeline ----------
var Timeline = (function () {
  var root = document.getElementById('timeline');
  var detail = document.getElementById('tl-detail');
  var playBtn = document.getElementById('tl-play');
  if (!root || !window.ENTRIES) return null;

  var FIRST_YEAR = 2018;
  var LAST_YEAR = 2027;
  var ROW = 30;
  // Busy years get more room so their projects don't pile up on each other
  var YEAR_WEIGHT = { 2018: 0.7, 2019: 0.8, 2020: 0.8, 2021: 1, 2022: 1.1, 2023: 0.9, 2024: 1.1, 2025: 1.4, 2026: 3.6, 2027: 0.7 };

  var entries = window.ENTRIES.slice().sort(function (a, b) {
    return Site.sortValue(a.start) - Site.sortValue(b.start);
  });
  var filter = 'all';
  var activeId = null;
  var playTimer = null;
  var lastWidth = 0;

  var totalWeight = 0;
  for (var y = FIRST_YEAR; y <= LAST_YEAR; y++) totalWeight += YEAR_WEIGHT[y] || 1;

  // Position along the timeline from 0 to 1. monthPart runs from 0 (1 Jan) to 1 (31 Dec).
  function position(year, monthPart) {
    year = Math.max(FIRST_YEAR, Math.min(LAST_YEAR, year));
    var before = 0;
    for (var yy = FIRST_YEAR; yy < year; yy++) before += YEAR_WEIGHT[yy] || 1;
    return (before + (YEAR_WEIGHT[year] || 1) * monthPart) / totalWeight;
  }
  function startPos(value) { var d = Site.parse(value); return position(d.y, (d.m - 1) / 12); }
  function endPos(value) { var d = Site.parse(value); return position(d.y, d.m / 12); }

  var measureCtx = document.createElement('canvas').getContext('2d');
  function textWidth(text) {
    measureCtx.font = '500 12px Inter, system-ui, sans-serif';
    return Math.ceil(measureCtx.measureText(text).width) + 4;
  }

  function visible() {
    return entries.filter(function (e) { return filter === 'all' || Site.group(e) === filter; });
  }

  function render() {
    var labelWidth = parseInt(getComputedStyle(root).getPropertyValue('--tl-label'), 10) || 124;
    var trackWidth = Math.max(root.clientWidth - labelWidth, 900);
    lastWidth = root.clientWidth;

    var html = '<div class="tl__inner" style="width:' + (labelWidth + trackWidth) + 'px">';

    // Year ruler
    var now = Site.parse('now');
    html += '<div class="tl__axis" style="margin-left:' + labelWidth + 'px">';
    for (var y = FIRST_YEAR; y <= LAST_YEAR; y++) {
      var left = position(y, 0) * trackWidth;
      var width = (YEAR_WEIGHT[y] || 1) / totalWeight * trackWidth;
      html += '<span class="tl__year' + (y === now.y ? ' is-now' : '') + '" style="left:' + left + 'px;width:' + width + 'px">' + y + '</span>';
    }
    html += '</div>';

    // Year lines and the "today" line behind the lanes
    var nowX = position(now.y, (now.m - 0.5) / 12) * trackWidth;
    html += '<div class="tl__grid" style="left:' + labelWidth + 'px;width:' + trackWidth + 'px">';
    for (var g = FIRST_YEAR + 1; g <= LAST_YEAR; g++) {
      html += '<span class="tl__gl" style="left:' + (position(g, 0) * trackWidth) + 'px"></span>';
    }
    html += '<span class="tl__now" style="left:' + nowX + 'px"><span>Today</span></span></div>';

    window.LANES.forEach(function (lane) {
      var laneEntries = entries.filter(function (e) { return e.lane === lane.id; });
      var rowEnds = [];
      var items = '';

      laneEntries.forEach(function (e) {
        var name = e.short || e.title;
        var isPoint = !e.end;
        var x0 = startPos(e.start) * trackWidth;
        if (isPoint) x0 = position(Site.parse(e.start).y, (Site.parse(e.start).m - 0.5) / 12) * trackWidth;
        var barWidth = isPoint ? 0 : Math.max(endPos(e.end) - startPos(e.start), 0) * trackWidth;
        barWidth = Math.max(barWidth, 8);
        var nameWidth = textWidth(name);
        var inside = !isPoint && barWidth >= nameWidth + 16;

        var markLeft = isPoint ? x0 - 6 : x0;
        var markRight = isPoint ? x0 + 6 : x0 + barWidth;
        // Near the right edge the label goes before the bar instead of after it
        var flip = !inside && markRight + 6 + nameWidth > trackWidth;

        // Pack into the first row where this item (and its label) fits
        var from = flip ? markLeft - 6 - nameWidth : markLeft;
        var to = inside || flip ? markRight : markRight + 6 + nameWidth;
        var row = 0;
        while (row < rowEnds.length && rowEnds[row] + 8 > from) row++;
        rowEnds[row] = to;

        var cls = 'tl__item ' + (isPoint ? 'tl__item--point' : 'tl__item--bar') +
          (inside ? ' tl__item--inside' : '') + (flip ? ' tl__item--flip' : '');
        if (e.id === activeId) cls += ' is-active';
        var place = flip ? 'left:' + markRight + 'px' : 'left:' + markLeft + 'px';
        items += '<button type="button" class="' + cls + '" data-id="' + e.id + '" data-group="' + lane.group + '"' +
          ' data-lane="' + lane.id + '"' +
          ' style="' + place + ';top:' + (row * ROW) + 'px;--w:' + barWidth + 'px"' +
          ' title="' + Site.esc(e.title + ' · ' + Site.dateText(e)) + '">' +
          '<span class="tl__mark" aria-hidden="true"></span><span class="tl__label">' + Site.esc(name) + '</span></button>';
      });

      var rows = Math.max(rowEnds.length, 1);
      html += '<div class="tl__lane" data-group="' + lane.group + '">' +
        '<div class="tl__lane-label" data-lane="' + lane.id + '">' + Site.esc(lane.label) + '</div>' +
        '<div class="tl__track" style="width:' + trackWidth + 'px;height:' + (rows * ROW) + 'px">' + items + '</div></div>';
    });

    html += '</div>';
    root.innerHTML = html;
  }

  function renderDetail(entry) {
    var lane = Site.lane(entry);
    var seq = visible();
    var index = seq.indexOf(entry);
    var images = entry.images || [];

    var more = '';
    if (Site.hasCard(entry)) more = '<a class="tl-detail__jump" href="#p-' + entry.id + '">See project card ↓</a>';
    else if (entry.anchor) more = '<a class="tl-detail__jump" href="' + entry.anchor + '">Read more ↓</a>';

    var media = '';
    if (images.length) {
      media = '<div class="tl-detail__media">' + images.map(function (src, i) {
        return '<img src="' + Site.esc(src) + '" alt="' + Site.esc(entry.title + (images.length > 1 ? ' (' + (i + 1) + ')' : '')) + '" loading="lazy">';
      }).join('') + '</div>';
    }

    detail.innerHTML =
      '<article class="tl-detail__card' + (media ? ' has-media' : '') + '" data-group="' + lane.group + '" data-lane="' + lane.id + '">' +
        '<div class="tl-detail__text">' +
          '<div class="tl-detail__meta"><span class="badge">' + Site.esc(lane.label) + '</span>' +
          '<span class="tl-detail__date">' + Site.esc(Site.dateText(entry)) + '</span>' +
          (index >= 0 ? '<span class="tl-detail__count">' + (index + 1) + ' / ' + seq.length + '</span>' : '') + '</div>' +
          '<h3>' + Site.esc(entry.title) + '</h3>' +
          (entry.sub ? '<p class="tl-detail__sub">' + Site.esc(entry.sub) + '</p>' : '') +
          '<p>' + Site.esc(entry.text) + '</p>' +
          Site.tagsHtml(entry) +
          '<p class="tl-detail__links">' + Site.linksHtml(entry) + more + '</p>' +
        '</div>' + media +
      '</article>';
  }

  function select(id, smooth, keepDetail) {
    var entry = entries.filter(function (e) { return e.id === id; })[0];
    if (!entry) return;
    activeId = id;

    root.querySelectorAll('.tl__item').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-id') === id);
    });
    if (!keepDetail) renderDetail(entry);

    // Keep the selected item in view inside the timeline (does not scroll the page)
    var item = root.querySelector('.tl__item[data-id="' + id + '"]');
    if (item) {
      var labelWidth = parseInt(getComputedStyle(root).getPropertyValue('--tl-label'), 10) || 124;
      var target = item.offsetLeft + labelWidth - root.clientWidth / 2;
      root.scrollTo({ left: Math.max(target, 0), behavior: smooth ? 'smooth' : 'auto' });
    }
  }

  function step(direction) {
    var seq = visible();
    if (!seq.length) return;
    var index = seq.map(function (e) { return e.id; }).indexOf(activeId);
    var next = index === -1 ? 0 : index + direction;
    if (next < 0) next = seq.length - 1;
    if (next >= seq.length) { stop(); return; }
    select(seq[next].id, true);
  }

  function play() {
    var seq = visible();
    var index = seq.map(function (e) { return e.id; }).indexOf(activeId);
    if (index === -1 || index === seq.length - 1) select(seq[0].id, true);
    playTimer = setInterval(function () { step(1); }, 2800);
    playBtn.setAttribute('aria-pressed', 'true');
    playBtn.querySelector('span').textContent = 'Pause';
    root.classList.add('is-playing');
  }

  function stop() {
    clearInterval(playTimer);
    playTimer = null;
    playBtn.setAttribute('aria-pressed', 'false');
    playBtn.querySelector('span').textContent = 'Play';
    root.classList.remove('is-playing');
  }

  function setFilter(value) {
    filter = value;
    root.setAttribute('data-filter', value);
    document.querySelectorAll('#tl-filters .chip').forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-filter') === value));
    });
    var seq = visible();
    var stillVisible = seq.some(function (e) { return e.id === activeId; });
    if (seq.length) select(stillVisible ? activeId : seq[0].id, true);
  }

  // ---- Events ----
  root.addEventListener('click', function (e) {
    var item = e.target.closest('.tl__item');
    if (!item) return;
    stop();
    var group = item.getAttribute('data-group');
    if (filter !== 'all' && group !== filter) setFilter('all');
    select(item.getAttribute('data-id'), true);
  });

  root.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      stop();
      step(e.key === 'ArrowRight' ? 1 : -1);
    }
  });

  document.getElementById('tl-prev').addEventListener('click', function () { stop(); step(-1); });
  document.getElementById('tl-next').addEventListener('click', function () { stop(); step(1); });
  playBtn.addEventListener('click', function () { if (playTimer) stop(); else play(); });

  document.getElementById('tl-filters').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) { stop(); setFilter(chip.getAttribute('data-filter')); }
  });

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (root.clientWidth !== lastWidth) { render(); select(activeId, false, true); }
    }, 150);
  });

  // ---- Start: show the thesis, the thing I'm working on now ----
  root.setAttribute('data-filter', 'all');
  render();
  select('thesis', false);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(function () { render(); select(activeId, false, true); });
  }

  return {
    show: function (id) {
      stop();
      if (filter !== 'all') setFilter('all');
      select(id, true);
      document.getElementById('journey').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
})();

// ---------- Project cards ----------
(function () {
  var grid = document.getElementById('project-grid');
  if (!grid || !window.ENTRIES) return;

  // Newest (or still running) first
  var projects = window.ENTRIES.filter(Site.hasCard).sort(function (a, b) {
    return Site.sortValue(b.end || b.start) - Site.sortValue(a.end || a.start);
  });

  grid.innerHTML = projects.map(function (p) {
    var lane = Site.lane(p);
    var cover = p.images && p.images.length
      ? '<div class="card__img"><img src="' + Site.esc(p.images[0]) + '" alt="' + Site.esc(p.title) + '" loading="lazy"></div>'
      : '';
    return '<article class="card reveal" id="p-' + p.id + '" data-lane="' + p.lane + '">' + cover +
      '<p class="kicker">' + Site.esc(lane.label) + ' · ' + Site.esc(Site.dateText(p)) + '</p>' +
      '<h3>' + Site.esc(p.title) + '</h3>' +
      (p.sub ? '<p class="card__sub">' + Site.esc(p.sub) + '</p>' : '') +
      '<p>' + Site.esc(p.text) + '</p>' +
      Site.tagsHtml(p) +
      '<p class="card__links">' + Site.linksHtml(p) +
      '<button type="button" class="card__tl" data-id="' + p.id + '">On the timeline ↑</button></p>' +
    '</article>';
  }).join('');

  grid.addEventListener('click', function (e) {
    var btn = e.target.closest('.card__tl');
    if (btn && Timeline) Timeline.show(btn.getAttribute('data-id'));
  });

  var chips = document.querySelectorAll('#project-filters .chip');
  function setFilter(value) {
    chips.forEach(function (chip) {
      chip.setAttribute('aria-pressed', String(chip.getAttribute('data-filter') === value));
    });
    grid.querySelectorAll('.card').forEach(function (card) {
      card.hidden = value !== 'all' && card.getAttribute('data-lane') !== value;
    });
  }
  document.getElementById('project-filters').addEventListener('click', function (e) {
    var chip = e.target.closest('.chip');
    if (chip) setFilter(chip.getAttribute('data-filter'));
  });

  // "See project card" from the timeline: make sure the card is showing, then flash it
  document.addEventListener('click', function (e) {
    var link = e.target.closest('a[href^="#p-"]');
    if (!link) return;
    var card = document.getElementById(link.getAttribute('href').slice(1));
    if (!card) return;
    if (card.hidden) setFilter('all');
    card.classList.add('in');
    card.classList.remove('is-flash');
    void card.offsetWidth;
    card.classList.add('is-flash');
  });
})();

// Fade sections in as they scroll into view, and highlight the active nav link
(function () {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    return;
  }

  var revealer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });

  var navLinks = document.querySelectorAll('.nav__links a');
  var spy = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      navLinks.forEach(function (a) {
        a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  document.querySelectorAll('main section[id]').forEach(function (s) { spy.observe(s); });
})();

document.getElementById('year').textContent = new Date().getFullYear();
