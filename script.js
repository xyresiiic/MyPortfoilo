/* ══════════
   PORTFOLIO
   script.js
   ═════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ════════════════════════════
     1. LOADER
  ════════════════════════════ */
  const loader = document.getElementById('loader');

  function hideLoader() {
    if (loader) loader.classList.add('done');
  }

  if (document.readyState === 'complete') {
    setTimeout(hideLoader, 500);
  } else {
    window.addEventListener('load', () => setTimeout(hideLoader, 500));
    setTimeout(hideLoader, 2000);
  }


  /* ════════════════════════════
     2. CUSTOM CURSOR
  ════════════════════════════ */
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  let rafId;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursor) cursor.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
  });

  // Smooth ring follow with lerp
  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (cursorRing) cursorRing.style.transform = `translate(${ringX}px, ${ringY}px)`;
    rafId = requestAnimationFrame(animateRing);
  }
  animateRing();

  // Cursor hover state — add to all interactive elements
  function bindCursorHover() {
    const targets = document.querySelectorAll('a, button, input, textarea, select, [role="button"], .cf-btn, .cert-nav-btn, .proj-link-btn');
    targets.forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }
  bindCursorHover();

  // Cursor leaves window
  document.addEventListener('mouseleave', () => {
    if (cursor) cursor.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursor) cursor.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });


  /* ════════════════════════════
     3. NAVBAR — Scroll & Active
  ════════════════════════════ */
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    // Scrolled state
    if (window.scrollY > 60) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }

    // Active nav link highlighting
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) {
        current = sec.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });


  /* ════════════════════════════
     4. MOBILE NAV
  ════════════════════════════ */
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavBackdrop = document.getElementById('mobileNavBackdrop');

  function openMobileNav() {
    hamburger?.classList.add('active');
    mobileNav?.classList.add('open');
    mobileNav?.setAttribute('aria-hidden', 'false');
    if (mobileNavBackdrop) mobileNavBackdrop.style.display = 'block';
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  window.closeMobileNav = function () {
    hamburger?.classList.remove('active');
    mobileNav?.classList.remove('open');
    mobileNav?.setAttribute('aria-hidden', 'true');
    if (mobileNavBackdrop) mobileNavBackdrop.style.display = 'none';
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  };

  hamburger?.addEventListener('click', () => {
    if (mobileNav?.classList.contains('open')) {
      window.closeMobileNav();
    } else {
      openMobileNav();
    }
  });

  mobileNavClose?.addEventListener('click', window.closeMobileNav);
  mobileNavBackdrop?.addEventListener('click', window.closeMobileNav);

  // Close on ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
      window.closeMobileNav();
    }
  });


  /* ════════════════════════════
     5. SCROLL REVEAL
  ════════════════════════════ */
  const revealEls = document.querySelectorAll('.reveal');

  if (typeof IntersectionObserver !== 'undefined') {
    const revealObs = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealEls.forEach(el => revealObs.observe(el));
  } else {
    // Fallback for older browsers
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ════════════════════════════
     6. CONTACT FORM
  ════════════════════════════ */
  window.handleContact = function () {
    const name = document.getElementById('name')?.value?.trim();
    const email = document.getElementById('email')?.value?.trim();
    const subject = document.getElementById('subject')?.value?.trim();
    const message = document.getElementById('message')?.value?.trim();
    const feedback = document.getElementById('form-feedback');

    if (!feedback) return;

    if (!name || !email || !message) {
      feedback.textContent = 'Please fill in Name, Email, and Message.';
      feedback.style.color = 'var(--coral)';
      return;
    }

    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      feedback.textContent = 'Please enter a valid email address.';
      feedback.style.color = 'var(--coral)';
      return;
    }

    const submitBtn = document.querySelector('.contact-form button[type="submit"]');
    if (!submitBtn) return;

    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: 'cd8ae258-1763-4524-a1ed-7663bafed92e',
        name,
        email,
        subject: subject || 'New Portfolio Inquiry',
        message
      })
    })
      .then(async (res) => {
        const json = await res.json();
        if (res.ok) {
          ['name', 'email', 'subject', 'message'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
          });
          feedback.textContent = "Message sent! I'll get back to you soon.";
          feedback.style.color = 'var(--lime)';
        } else {
          feedback.textContent = json.message || 'Something went wrong.';
          feedback.style.color = 'var(--coral)';
        }
      })
      .catch(() => {
        feedback.textContent = 'Network error. Please try again.';
        feedback.style.color = 'var(--coral)';
      })
      .finally(() => {
        submitBtn.innerHTML = originalHtml;
        submitBtn.disabled = false;
        setTimeout(() => {
          if (feedback.textContent.includes("sent")) feedback.textContent = '';
        }, 6000);
      });
  };


  /* ════════════════════════════
     7. CREATIVE WORK FILTERS
  ════════════════════════════ */
  const filterBtns = document.querySelectorAll('.cf-btn');
  const creativeCards = document.querySelectorAll('.creative-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      creativeCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        const show = filter === 'all' || cat === filter;

        if (show) {
          card.style.display = 'flex';
          card.style.flexDirection = 'column';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.transition = 'opacity 0.35s, transform 0.35s';
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 30);
          });
        } else {
          card.style.transition = 'opacity 0.25s, transform 0.25s';
          card.style.opacity = '0';
          card.style.transform = 'scale(0.96)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 280);
        }
      });
    });
  });


  /* ════════════════════════════
     8. CERTS CAROUSEL
  ════════════════════════════ */
  const certsGrid = document.getElementById('certsGrid');
  const certPrev = document.getElementById('certPrev');
  const certNext = document.getElementById('certNext');

  const SCROLL_AMT = 260;

  certPrev?.addEventListener('click', () => {
    certsGrid?.scrollBy({ left: -SCROLL_AMT, behavior: 'smooth' });
  });
  certNext?.addEventListener('click', () => {
    certsGrid?.scrollBy({ left: SCROLL_AMT, behavior: 'smooth' });
  });

  // Drag-to-scroll for certs
  if (certsGrid) {
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    certsGrid.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX = e.pageX - certsGrid.offsetLeft;
      scrollLeft = certsGrid.scrollLeft;
      certsGrid.style.cursor = 'grabbing';
    });
    certsGrid.addEventListener('mouseleave', () => {
      isDragging = false;
      certsGrid.style.cursor = '';
    });
    certsGrid.addEventListener('mouseup', () => {
      isDragging = false;
      certsGrid.style.cursor = '';
    });
    certsGrid.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - certsGrid.offsetLeft;
      const walk = (x - startX) * 1.5;
      certsGrid.scrollLeft = scrollLeft - walk;
    });
  }


  /* ════════════════════════════
     9. SMOOTH SCROLL 
  ════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      try {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } catch (err) {
        // Ignore invalid selectors
      }
    });
  });


  /* ════════════════════════════
     10. MINI GAME — Dodge & Catch
  ════════════════════════════ */
  const canvas = document.getElementById('gameCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  let gameLoopId;
  let gameActive = false;
  let score = 0;
  let bestScore = parseInt(localStorage.getItem('vps_best') || '0', 10);
  let level = 1;
  let lives = 3;
  let frameCount = 0;
  let stars = [];
  let bugs = [];
  let particles = [];
  let shieldTimer = 0;

  // Responsive canvas
  function resizeCanvas() {
    const wrapper = canvas.parentElement;
    if (!wrapper) return;
    const w = Math.min(wrapper.clientWidth - 32, 640);
    canvas.style.width = w + 'px';
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  document.getElementById('bestDisplay').textContent = bestScore;

  const player = {
    x: 300, y: 330,
    w: 44, h: 44,
    speed: 6,
    vx: 0,
    shield: false
  };

  const keys = { arrowleft: false, arrowright: false, a: false, d: false };

  const gameKeydown = (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) {
      keys[key] = true;
      if (['arrowleft', 'arrowright'].includes(key) && gameActive) e.preventDefault();
    }
  };
  const gameKeyup = (e) => {
    const key = e.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
  };

  window.addEventListener('keydown', gameKeydown);
  window.addEventListener('keyup', gameKeyup);

  // Touch controls for mobile
  function handleTouch(e) {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    let newX = (e.touches[0].clientX - rect.left) * scaleX - player.w / 2;
    player.x = Math.max(0, Math.min(canvas.width - player.w, newX));
    if (e.cancelable) e.preventDefault();
  }
  canvas.addEventListener('touchstart', handleTouch, { passive: false });
  canvas.addEventListener('touchmove', handleTouch, { passive: false });
  canvas.addEventListener('touchend', (e) => {
    if (e.cancelable && gameActive) e.preventDefault();
  });

  function updateHUD() {
    const sd = document.getElementById('scoreDisplay');
    const ld = document.getElementById('levelDisplay');
    const bd = document.getElementById('bestDisplay');
    const liv = document.getElementById('livesDisplay');
    if (sd) sd.textContent = score;
    if (ld) ld.textContent = level;
    if (bd) bd.textContent = bestScore;
    if (liv) liv.textContent = '❤'.repeat(lives) + '♡'.repeat(3 - lives);
  }

  function spawnStar() {
    const x = Math.random() * (canvas.width - 30) + 10;
    stars.push({ x, y: -30, size: 18, speed: 1.8 + Math.random() * 1.5 + level * 0.4 });
  }

  function spawnBug() {
    const x = Math.random() * (canvas.width - 30) + 10;
    bugs.push({ x, y: -30, size: 22, speed: 2.5 + Math.random() * 2 + level * 0.65 });
  }

  function spawnParticle(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 / 8) * i;
      particles.push({
        x, y,
        vx: Math.cos(angle) * (1.5 + Math.random() * 2),
        vy: Math.sin(angle) * (1.5 + Math.random() * 2),
        life: 1,
        color,
        size: 3 + Math.random() * 3
      });
    }
  }

  function rectsOverlap(a, b) {
    return a.x < b.x + b.size && a.x + a.w > b.x &&
      a.y < b.y + b.size && a.y + a.h > b.y;
  }

  function drawPlayer(ctx) {
    const cx = player.x + player.w / 2;
    const cy = player.y + player.h / 2;

    if (player.shield || shieldTimer > 0) {
      ctx.save();
      ctx.strokeStyle = shieldTimer > 0 ? '#a3e635' : 'rgba(163,230,53,0.5)';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#a3e635';
      ctx.shadowBlur = 12;
      ctx.beginPath();
      ctx.arc(cx, cy, 28, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }

    // Player body — glowing square
    ctx.save();
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 16;
    ctx.fillStyle = 'rgba(34, 211, 238, 0.15)';
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.w, player.h, 10);
    ctx.fill();

    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(player.x, player.y, player.w, player.h, 10);
    ctx.stroke();
    ctx.restore();

    // Icon (code symbol <>)
    ctx.save();
    ctx.fillStyle = '#67e8f9';
    ctx.font = 'bold 18px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('<>', cx, cy);
    ctx.restore();
  }

  function drawStar(star) {
    ctx.save();
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = '#fbbf24';
    ctx.shadowBlur = 14;
    ctx.font = `${star.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★', star.x + star.size / 2, star.y + star.size / 2);
    ctx.restore();
  }

  function drawBug(bug) {
    ctx.save();
    ctx.font = `${bug.size}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🪲', bug.x + bug.size / 2, bug.y + bug.size / 2);
    ctx.restore();
  }

  function drawParticles() {
    particles.forEach(p => {
      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dark bg
    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Subtle grid
    ctx.strokeStyle = 'rgba(139,92,246,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    // Bottom glow
    const grad = ctx.createLinearGradient(0, canvas.height - 60, 0, canvas.height);
    grad.addColorStop(0, 'rgba(34,211,238,0.06)');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, canvas.height - 60, canvas.width, 60);
  }

  let flashAlpha = 0;

  function gameOver() {
    gameActive = false;
    cancelAnimationFrame(gameLoopId);

    if (score > bestScore) {
      bestScore = score;
      localStorage.setItem('vps_best', bestScore);
    }
    updateHUD();

    // Game over screen
    ctx.fillStyle = 'rgba(7, 8, 15, 0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Card
    const cx = canvas.width / 2;
    ctx.save();
    ctx.fillStyle = 'rgba(15, 17, 28, 0.9)';
    ctx.strokeStyle = 'rgba(139,92,246,0.5)';
    ctx.lineWidth = 1.5;
    ctx.shadowColor = '#8b5cf6';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.roundRect(cx - 140, canvas.height / 2 - 70, 280, 140, 16);
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#f1f0f8';
    ctx.font = 'bold 28px Syne, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', cx, canvas.height / 2 - 20);

    ctx.font = '16px Syne, sans-serif';
    ctx.fillStyle = '#a78bfa';
    ctx.fillText(`Score: ${score}`, cx, canvas.height / 2 + 10);

    ctx.font = '13px JetBrains Mono, monospace';
    ctx.fillStyle = '#67e8f9';
    ctx.fillText(`Best: ${bestScore}`, cx, canvas.height / 2 + 35);

    const btn = document.getElementById('game-start-btn');
    if (btn) {
      btn.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Play Again';
      btn.style.display = 'inline-flex';
    }
  }

  let lastTime = 0;

  function update(time) {
    if (!gameActive) return;

    // Request next frame
    gameLoopId = requestAnimationFrame(update);

    // Throttle to roughly 60fps to prevent insane speeds on high refresh rate monitors
    if (time - lastTime < 16) return;
    lastTime = time;

    frameCount++;

    drawBackground();

    // Move player (keyboard)
    if (keys.arrowleft || keys.a) player.vx = -player.speed;
    else if (keys.arrowright || keys.d) player.vx = player.speed;
    else player.vx = 0;

    player.x = Math.max(0, Math.min(canvas.width - player.w, player.x + player.vx));

    // Spawn
    if (frameCount % 70 === 0) spawnStar();
    if (frameCount % Math.max(30, 55 - level * 3) === 0) spawnBug();

    // Stars
    for (let i = stars.length - 1; i >= 0; i--) {
      stars[i].y += stars[i].speed;
      drawStar(stars[i]);

      if (rectsOverlap(player, stars[i])) {
        spawnParticle(stars[i].x + stars[i].size / 2, stars[i].y + stars[i].size / 2, '#fbbf24');
        stars.splice(i, 1);
        score += 10;

        // Level up every 100pts
        if (score % 100 === 0) {
          level++;
          player.shield = true;
          shieldTimer = 120;
        }
        updateHUD();
        continue;
      }
      if (stars[i]?.y > canvas.height) stars.splice(i, 1);
    }

    // Bugs
    for (let i = bugs.length - 1; i >= 0; i--) {
      bugs[i].y += bugs[i].speed;
      drawBug(bugs[i]);

      if (rectsOverlap(player, bugs[i])) {
        spawnParticle(bugs[i].x + bugs[i].size / 2, bugs[i].y + bugs[i].size / 2, '#fb7185');
        bugs.splice(i, 1);

        if (player.shield || shieldTimer > 0) {
          player.shield = false;
          shieldTimer = 0;
        } else {
          lives--;
          flashAlpha = 0.4;
          updateHUD();
          if (lives <= 0) { gameOver(); return; }
        }
        continue;
      }
      if (bugs[i]?.y > canvas.height) bugs.splice(i, 1);
    }

    // Particles
    particles = particles.filter(p => p.life > 0);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.04;
    });
    drawParticles();

    // Shield timer
    if (shieldTimer > 0) shieldTimer--;
    else player.shield = false;

    // Flash effect
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(251, 113, 133, ${flashAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      flashAlpha = Math.max(0, flashAlpha - 0.04);
    }

    drawPlayer(ctx);

    // Level indicator
    if (level > 1 && frameCount % 300 < 60) {
      ctx.save();
      ctx.fillStyle = 'rgba(139,92,246,0.9)';
      ctx.font = `bold 14px Syne, sans-serif`;
      ctx.textAlign = 'right';
      ctx.fillText(`LVL ${level}`, canvas.width - 12, 24);
      ctx.restore();
    }

    gameLoopId = requestAnimationFrame(update);
  }

  window.startGame = function () {
    const btn = document.getElementById('game-start-btn');
    if (btn) btn.style.display = 'none';

    score = 0;
    level = 1;
    lives = 3;
    frameCount = 0;
    flashAlpha = 0;
    shieldTimer = 0;
    lastTime = performance.now();
    player.x = canvas.width / 2 - player.w / 2;
    player.shield = false;
    stars = [];
    bugs = [];
    particles = [];
    gameActive = true;

    updateHUD();
    cancelAnimationFrame(gameLoopId);
    ctx.textAlign = 'left';
    gameLoopId = requestAnimationFrame(update);
  };

  // Initial canvas idle state
  (function initCanvas() {
    ctx.fillStyle = '#07080f';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Grid
    ctx.strokeStyle = 'rgba(139,92,246,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 40) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    ctx.fillStyle = 'rgba(148, 144, 180, 0.4)';
    ctx.font = '14px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);

    ctx.fillStyle = 'rgba(139,92,246,0.25)';
    ctx.font = '12px JetBrains Mono, monospace';
    ctx.fillText('Use ← → arrow keys or A/D to move', canvas.width / 2, canvas.height / 2 + 28);
  })();

});
