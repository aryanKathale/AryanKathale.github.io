/* ═══════════════════════════════════════════════════
   PARTICLE ANIMATION
   Canvas is inside #hero — sized to hero dimensions
   Adapts colors to light/dark theme in real-time
   ═══════════════════════════════════════════════════ */
(function () {
  var canvas = document.getElementById('particle-canvas');
  var ctx = canvas.getContext('2d');
  var hero = document.getElementById('hero');
  var particles = [];
  var W, H;
  var PARTICLE_COUNT = 90;
  var CONNECT_DIST = 120;
  var mouse = { x: null, y: null, radius: 150 };

  function resize() {
    var rect = hero.getBoundingClientRect();
    W = canvas.width = rect.width;
    H = canvas.height = rect.height;
  }
  window.addEventListener('resize', resize);
  resize();

  // Read CSS variables for theme-aware colors
  function getThemeVars() {
    var s = getComputedStyle(document.documentElement);
    return {
      color: s.getPropertyValue('--particle-color').trim(),
      opacity: parseFloat(s.getPropertyValue('--particle-opacity')) || 0.5,
      lineOpacity: parseFloat(s.getPropertyValue('--particle-line-opacity')) || 0.12
    };
  }

  function Particle() {
    this.x = Math.random() * W;
    this.y = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
    this.r = Math.random() * 2 + 0.8;
  }

  function initParticles() {
    particles = [];
    for (var i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }
  initParticles();

  // Mouse interactivity (relative to hero)
  hero.addEventListener('mousemove', function (e) {
    var rect = hero.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  hero.addEventListener('mouseleave', function () {
    mouse.x = null;
    mouse.y = null;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var theme = getThemeVars();
    var i, j, p, q, dx, dy, d, force;

    for (i = 0; i < particles.length; i++) {
      p = particles[i];

      // Move
      p.x += p.vx;
      p.y += p.vy;

      // Wrap edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Mouse repulsion
      if (mouse.x !== null) {
        dx = p.x - mouse.x;
        dy = p.y - mouse.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < mouse.radius) {
          force = (mouse.radius - d) / mouse.radius;
          p.x += dx * force * 0.025;
          p.y += dy * force * 0.025;
        }
      }

      // Draw particle dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + theme.color + ', ' + theme.opacity + ')';
      ctx.fill();

      // Draw connecting lines
      for (j = i + 1; j < particles.length; j++) {
        q = particles[j];
        dx = p.x - q.x;
        dy = p.y - q.y;
        d = Math.sqrt(dx * dx + dy * dy);
        if (d < CONNECT_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(' + theme.color + ', ' + (theme.lineOpacity * (1 - d / CONNECT_DIST)) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();


/* ═══════════════════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════════════════ */
(function () {
  var toggle = document.getElementById('theme-toggle');
  var html = document.documentElement;

  // Load saved preference
  var saved = null;
  try { saved = localStorage.getItem('theme'); } catch(e) {}
  if (saved) {
    html.setAttribute('data-theme', saved);
  }

  toggle.addEventListener('click', function () {
    var current = html.getAttribute('data-theme');
    var next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch(e) {}
  });
})();


/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════ */
(function () {
  var elements = document.querySelectorAll('.pillar, .project-row, .about-intro, .exp-card, .interest-item');
  for (var i = 0; i < elements.length; i++) {
    elements[i].classList.add('reveal');
  }

  var observer = new IntersectionObserver(function (entries) {
    for (var i = 0; i < entries.length; i++) {
      if (entries[i].isIntersecting) {
        entries[i].target.classList.add('visible');
      }
    }
  }, { threshold: 0.12 });

  var reveals = document.querySelectorAll('.reveal');
  for (var i = 0; i < reveals.length; i++) {
    observer.observe(reveals[i]);
  }
})();
