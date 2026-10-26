// Intro screen: every second a line flies in from a random edge toward the cursor,
// keeps that direction until it hits the far wall, then rings like a plucked string at 432 Hz.
(function () {
  var section = document.getElementById('intro');
  var canvas = section && section.querySelector('canvas');
  if (!canvas || !canvas.getContext) return;
  var ctx = canvas.getContext('2d');
  var soundBtn = document.getElementById('intro-sound');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var FREQ = 432;          // Hz: pitch of the sound and frequency of the string's vibration
  var FIRE_EVERY = 1000;   // ms between lines
  var SPEED = 1300;        // px per second while a line is flying
  var DECAY = 0.9;         // s: how quickly the vibration dies away
  var HOLD = 12;           // s a line stays on screen after it lands
  var FADE = 5;            // s it takes to fade out
  var MAX_LINES = 30;

  var width = 0;
  var height = 0;
  var lines = [];
  var flashes = [];
  var target = null;       // last cursor/touch position; the centre until the visitor moves
  var color = '#4fd1c5';
  var running = false;
  var onScreen = true;
  var timer = 0;
  var frame = 0;

  function now() { return performance.now() / 1000; }

  function readColor() {
    color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || color;
  }

  function resize() {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = section.clientWidth;
    height = section.clientHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    lines = [];
    flashes = [];
  }

  function pointOnEdge(edge) {
    if (edge === 0) return { x: Math.random() * width, y: 0 };
    if (edge === 1) return { x: width, y: Math.random() * height };
    if (edge === 2) return { x: Math.random() * width, y: height };
    return { x: 0, y: Math.random() * height };
  }

  function fire(at) {
    readColor();
    var goal = at || target || { x: width / 2, y: height / 2 };

    // Pick a random edge point that isn't right next to the cursor
    var start, dx, dy, dist;
    var tries = 0;
    do {
      start = pointOnEdge(Math.floor(Math.random() * 4));
      dx = goal.x - start.x;
      dy = goal.y - start.y;
      dist = Math.hypot(dx, dy);
      tries++;
    } while (dist < 80 && tries < 10);
    if (dist < 1) return;
    dx /= dist;
    dy /= dist;

    // Distance along this direction until the line meets the opposite wall
    var toX = dx > 0 ? (width - start.x) / dx : dx < 0 ? -start.x / dx : Infinity;
    var toY = dy > 0 ? (height - start.y) / dy : dy < 0 ? -start.y / dy : Infinity;
    var reach = Math.min(toX, toY);
    if (!(reach > 1) || !isFinite(reach)) return;

    lines.push({ x0: start.x, y0: start.y, dx: dx, dy: dy, reach: reach, born: now(), landed: null });
    if (lines.length > MAX_LINES) lines.shift();
  }

  function land(line) {
    flashes.push({ x: line.x0 + line.dx * line.reach, y: line.y0 + line.dy * line.reach, born: now() });
    pluck(line);
  }

  // ---------- Drawing ----------
  function drawFlying(line, flown) {
    var hx = line.x0 + line.dx * flown;
    var hy = line.y0 + line.dy * flown;
    ctx.globalAlpha = 0.4;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(line.x0, line.y0);
    ctx.lineTo(hx, hy);
    ctx.stroke();

    // Glowing head
    ctx.globalAlpha = 1;
    ctx.shadowColor = color;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(hx, hy, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  function drawString(line, alpha, amp, age) {
    var nx = -line.dy;   // unit normal to the line
    var ny = line.dx;
    var SEG = 40;
    var s, f, off;

    function pointAt(fraction, offset) {
      return {
        x: line.x0 + line.dx * line.reach * fraction + nx * offset,
        y: line.y0 + line.dy * line.reach * fraction + ny * offset
      };
    }

    // A 432 Hz string is too fast for the eye (and a 60 Hz screen), so it shows as a
    // blurred band. Draw that band, then the string where it really is this frame.
    if (amp > 0.3) {
      ctx.globalAlpha = alpha * 0.12;
      ctx.beginPath();
      for (s = 0; s <= SEG; s++) {
        f = s / SEG;
        var top = pointAt(f, amp * 1.15 * Math.sin(Math.PI * f));
        if (s === 0) ctx.moveTo(top.x, top.y); else ctx.lineTo(top.x, top.y);
      }
      for (s = SEG; s >= 0; s--) {
        f = s / SEG;
        var bottom = pointAt(f, -amp * 1.15 * Math.sin(Math.PI * f));
        ctx.lineTo(bottom.x, bottom.y);
      }
      ctx.closePath();
      ctx.fill();
    }

    // Fundamental (432 Hz) plus a little of the second harmonic (864 Hz), like a real string
    var first = Math.cos(2 * Math.PI * FREQ * age);
    var second = Math.cos(2 * Math.PI * 2 * FREQ * age);
    ctx.globalAlpha = alpha * 0.9;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    for (s = 0; s <= SEG; s++) {
      f = s / SEG;
      off = amp * (Math.sin(Math.PI * f) * first + 0.3 * Math.sin(2 * Math.PI * f) * second);
      var p = pointAt(f, off);
      if (s === 0) ctx.moveTo(p.x, p.y); else ctx.lineTo(p.x, p.y);
    }
    ctx.stroke();
  }

  function draw() {
    var t = now();
    ctx.clearRect(0, 0, width, height);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineCap = 'round';

    for (var i = lines.length - 1; i >= 0; i--) {
      var line = lines[i];
      var flown = reduceMotion ? line.reach : Math.min((t - line.born) * SPEED, line.reach);

      if (!line.landed && flown >= line.reach) {
        line.landed = t;
        land(line);
      }
      if (!line.landed) {
        drawFlying(line, flown);
        continue;
      }

      var age = t - line.landed;
      if (age > HOLD + FADE) {
        lines.splice(i, 1);
        continue;
      }
      var alpha = age < HOLD ? 1 : 1 - (age - HOLD) / FADE;
      var amp = reduceMotion ? 0 : Math.min(16, line.reach * 0.015) * Math.exp(-age / DECAY);
      drawString(line, alpha, amp, age);
    }

    // Small ring where a line hits the wall
    for (var j = flashes.length - 1; j >= 0; j--) {
      var flash = flashes[j];
      var k = (t - flash.born) / 0.5;
      if (k >= 1) {
        flashes.splice(j, 1);
        continue;
      }
      ctx.globalAlpha = 1 - k;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(flash.x, flash.y, 4 + 26 * k, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function loop() {
    draw();
    frame = requestAnimationFrame(loop);
  }

  // ---------- Sound: a plucked 432 Hz string ----------
  var audio = null;
  var master = null;
  var soundOn = false;
  var soundChosen = false;   // once the visitor uses the button, clicks no longer change it

  function setSound(on) {
    if (on && !audio) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      audio = new AudioCtx();
      master = audio.createGain();
      master.gain.value = 0.22;
      master.connect(audio.destination);
    }
    soundOn = on;
    if (audio && on && audio.state === 'suspended') audio.resume();
    soundBtn.setAttribute('aria-pressed', String(on));
    soundBtn.setAttribute('aria-label', on ? 'Turn sound off' : 'Turn sound on');
  }

  function pluck(line) {
    if (!soundOn || !audio) return;
    var t = audio.currentTime;
    var length = DECAY * 2.6;

    var env = audio.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.5, t + 0.004);
    env.gain.exponentialRampToValueAtTime(0.0001, t + length);

    // Pan toward the side of the screen the string is on
    if (audio.createStereoPanner) {
      var pan = audio.createStereoPanner();
      pan.pan.value = ((line.x0 + line.dx * line.reach * 0.5) / width) * 1.6 - 0.8;
      env.connect(pan);
      pan.connect(master);
    } else {
      env.connect(master);
    }

    [[1, 1], [2, 0.35], [3, 0.15]].forEach(function (harmonic) {
      var osc = audio.createOscillator();
      var gain = audio.createGain();
      osc.frequency.value = FREQ * harmonic[0];
      gain.gain.value = harmonic[1];
      osc.connect(gain);
      gain.connect(env);
      osc.start(t);
      osc.stop(t + length + 0.05);
    });
  }

  // ---------- Events ----------
  function localPoint(e) {
    var r = section.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  section.addEventListener('pointermove', function (e) { target = localPoint(e); });

  section.addEventListener('pointerdown', function (e) {
    if (e.target.closest('a, button')) return;
    target = localPoint(e);
    if (!soundChosen && !soundOn) setSound(true);
    fire(target);
  });

  soundBtn.addEventListener('click', function () {
    soundChosen = true;
    setSound(!soundOn);
  });

  function start() {
    if (running || !onScreen || document.hidden) return;
    // The window may have been resized while the intro was hidden
    if (section.clientWidth !== width || section.clientHeight !== height) resize();
    running = true;
    fire();
    timer = setInterval(function () { fire(); }, FIRE_EVERY);
    loop();
  }

  function stop() {
    if (!running) return;
    running = false;
    clearInterval(timer);
    cancelAnimationFrame(frame);
  }

  // Only animate while the intro is on screen and the tab is open
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      onScreen = entries[0].isIntersecting;
      if (onScreen) start(); else stop();
    }).observe(section);
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop(); else start();
  });

  var resizeTimer = 0;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 150);
  });

  resize();
  start();
})();
