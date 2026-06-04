/* ═══════════════════════════════════════════════
   VEER PRATAP SINGH — PORTFOLIO
   script.js
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // 1. LOADER
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('done');
    }, 500);
  });
  // Fallback if load event already fired
  if (document.readyState === 'complete') {
    setTimeout(() => {
      loader.classList.add('done');
    }, 500);
  }

  // 2. CUSTOM CURSOR
  const cursor = document.getElementById('cursor');
  const cursorRing = document.getElementById('cursor-ring');

  document.addEventListener('mousemove', (e) => {
    if (cursor) cursor.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;

    // Smooth ring follow
    requestAnimationFrame(() => {
      if (cursorRing) cursorRing.style.transform = `translate(${e.clientX - 19}px, ${e.clientY - 19}px)`;
    });
  });

  // Cursor hover state
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, .premium-card, .creative-card, .hero-card');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  // 3. NAVBAR SCROLL
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      if (navbar) navbar.classList.add('scrolled');
    } else {
      if (navbar) navbar.classList.remove('scrolled');
    }
  });

  // 4. MOBILE NAV
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileNav.classList.toggle('open');
    });
  }

  window.closeMobileNav = () => {
    if (hamburger) hamburger.classList.remove('active');
    if (mobileNav) mobileNav.classList.remove('open');
  };

  // 5. TYPED EFFECT
  const typedSpan = document.getElementById('typed');
  if (typedSpan) {
    const textArray = ["Web Developer", "UI/UX Designer", "AI Enthusiast", "Creative Thinker"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000;
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
      if (charIndex < textArray[textArrayIndex].length) {
        typedSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, typingDelay);
      } else {
        setTimeout(erase, newTextDelay);
      }
    }

    function erase() {
      if (charIndex > 0) {
        typedSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, erasingDelay);
      } else {
        textArrayIndex++;
        if (textArrayIndex >= textArray.length) textArrayIndex = 0;
        setTimeout(type, typingDelay + 1100);
      }
    }

    if (textArray.length) setTimeout(type, newTextDelay + 250);
  }

  // 6. REVEAL ON SCROLL
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  });

  revealElements.forEach(el => revealObserver.observe(el));

  // 7. STAT COUNTERS
  const statNumbers = document.querySelectorAll('.stat-num');
  const statObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target'));
        const duration = 2000;
        const step = Math.max(1, target / (duration / 16));
        let current = 0;

        const updateCounter = () => {
          current += step;
          if (current < target) {
            entry.target.textContent = Math.ceil(current);
            requestAnimationFrame(updateCounter);
          } else {
            entry.target.textContent = target;
          }
        };

        updateCounter();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNumbers.forEach(stat => statObserver.observe(stat));

  // 8. CONTACT FORM HANDLER
  window.handleContact = () => {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    const feedback = document.getElementById('form-feedback');

    if (!name || !email || !message) {
      feedback.textContent = "Please fill in all required fields (Name, Email, Message).";
      feedback.style.color = "var(--coral)";
      return;
    }

    const btn = document.querySelector('.contact-form-card button');
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: 'cd8ae258-1763-4524-a1ed-7663bafed92e',
        name: name,
        email: email,
        subject: subject || 'New Inquiry from Portfolio',
        message: message
      })
    })
      .then(async (response) => {
        let json = await response.json();
        if (response.status == 200) {
          document.getElementById('name').value = '';
          document.getElementById('email').value = '';
          document.getElementById('subject').value = '';
          document.getElementById('message').value = '';

          feedback.textContent = "Message sent successfully! I'll get back to you soon.";
          feedback.style.color = "var(--lime)";
        } else {
          feedback.textContent = json.message || "Something went wrong!";
          feedback.style.color = "var(--coral)";
        }
      })
      .catch(error => {
        feedback.textContent = "Network error. Please try again later.";
        feedback.style.color = "var(--coral)";
      })
      .finally(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        setTimeout(() => {
          if (feedback.textContent.includes("successfully")) {
            feedback.textContent = "";
          }
        }, 5000);
      });
  };

  // 9. CREATIVE FILTERS
  const filterBtns = document.querySelectorAll('.c-filter');
  const creativeCards = document.querySelectorAll('.creative-card');

  if (filterBtns.length > 0 && creativeCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        // Add active to clicked
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        creativeCards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // 10. CERTIFICATES CAROUSEL
  const certsGrid = document.getElementById('certsGrid');
  const certPrev = document.getElementById('certPrev');
  const certNext = document.getElementById('certNext');

  if (certsGrid && certPrev && certNext) {
    const scrollAmount = 300;
    certPrev.addEventListener('click', () => {
      certsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
    certNext.addEventListener('click', () => {
      certsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    });
  }

  // 11. MINI GAME (Dodge & Catch)
  const canvas = document.getElementById('gameCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    let gameLoop;
    let gameActive = false;
    let score = 0;
    let bestScore = localStorage.getItem('vps_game_best') || 0;
    let level = 1;
    let lives = 3;

    document.getElementById('bestDisplay').textContent = bestScore;

    // Game Objects
    const player = {
      x: 300, y: 320, width: 40, height: 40,
      color: '#22d3ee', speed: 6, vx: 0,
      shield: false
    };

    let stars = [];
    let bugs = [];

    // Inputs
    const keys = { ArrowLeft: false, ArrowRight: false, a: false, d: false };

    window.addEventListener('keydown', (e) => {
      if (keys.hasOwnProperty(e.key)) {
        if (['ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault(); // prevent scroll
        keys[e.key] = true;
      }
    });
    window.addEventListener('keyup', (e) => {
      if (keys.hasOwnProperty(e.key)) keys[e.key] = false;
    });

    function updateGameInfo() {
      document.getElementById('scoreDisplay').textContent = score;
      document.getElementById('levelDisplay').textContent = level;
      document.getElementById('livesDisplay').textContent = '❤'.repeat(lives) + '♡'.repeat(3 - lives);
    }

    function createEntity(type) {
      const x = Math.random() * (canvas.width - 30);
      if (type === 'star') {
        stars.push({ x, y: -30, size: 20, speed: 2 + Math.random() * 2 + (level * 0.5) });
      } else if (type === 'bug') {
        bugs.push({ x, y: -30, size: 25, speed: 3 + Math.random() * 3 + (level * 0.8) });
      }
    }

    function drawPlayer() {
      ctx.fillStyle = player.color;
      ctx.beginPath();
      ctx.roundRect(player.x, player.y, player.width, player.height, 8);
      ctx.fill();

      if (player.shield) {
        ctx.strokeStyle = '#a3e635';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(player.x + 20, player.y + 20, 28, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    function drawStar(star) {
      ctx.fillStyle = '#fbbf24';
      ctx.font = '20px "Font Awesome 6 Free", "FontAwesome"';
      ctx.fontWeight = '900';
      ctx.fillText('★', star.x, star.y + 20);
    }

    function drawBug(bug) {
      ctx.fillStyle = '#fb7185';
      ctx.font = '24px "Font Awesome 6 Free", "FontAwesome"';
      ctx.fontWeight = '900';
      ctx.fillText('🪲', bug.x, bug.y + 20); // Bug Emoji fallback to text
    }

    function checkCollision(rect1, rect2) {
      return (
        rect1.x < rect2.x + rect2.size &&
        rect1.x + player.width > rect2.x &&
        rect1.y < rect2.y + rect2.size &&
        rect1.y + player.height > rect2.y
      );
    }

    function gameOver() {
      gameActive = false;
      cancelAnimationFrame(gameLoop);

      if (score > bestScore) {
        bestScore = score;
        localStorage.setItem('vps_game_best', bestScore);
        document.getElementById('bestDisplay').textContent = bestScore;
      }

      ctx.fillStyle = 'rgba(7, 8, 15, 0.8)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#f1f0f8';
      ctx.font = 'bold 36px Syne, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 20);

      ctx.font = '20px Syne, sans-serif';
      ctx.fillStyle = '#8b5cf6';
      ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 20);

      document.getElementById('game-start-btn').innerHTML = '<i class="fa-solid fa-rotate-right"></i> Play Again';
      document.getElementById('game-start-btn').style.display = 'inline-flex';
    }

    function update() {
      if (!gameActive) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Player Movement
      if (keys.ArrowLeft || keys.a) player.vx = -player.speed;
      else if (keys.ArrowRight || keys.d) player.vx = player.speed;
      else player.vx = 0;

      player.x += player.vx;

      // Boundaries
      if (player.x < 0) player.x = 0;
      if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

      drawPlayer();

      // Spawn entities
      if (Math.random() < 0.03) createEntity('star');
      if (Math.random() < 0.04 + (level * 0.01)) createEntity('bug');

      // Update Stars
      for (let i = stars.length - 1; i >= 0; i--) {
        stars[i].y += stars[i].speed;
        drawStar(stars[i]);

        if (checkCollision(player, stars[i])) {
          score += 10;
          stars.splice(i, 1);

          // Level up
          if (score > 0 && score % 100 === 0) {
            level++;
            player.shield = true;
            setTimeout(() => player.shield = false, 3000);
          }
          updateGameInfo();
        } else if (stars[i].y > canvas.height) {
          stars.splice(i, 1);
        }
      }

      // Update Bugs
      for (let i = bugs.length - 1; i >= 0; i--) {
        bugs[i].y += bugs[i].speed;
        drawBug(bugs[i]);

        if (checkCollision(player, bugs[i])) {
          bugs.splice(i, 1);
          if (player.shield) {
            player.shield = false;
          } else {
            lives--;
            updateGameInfo();

            // Flash effect
            ctx.fillStyle = 'rgba(251, 113, 133, 0.3)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (lives <= 0) {
              gameOver();
              return;
            }
          }
        } else if (bugs[i].y > canvas.height) {
          bugs.splice(i, 1);
        }
      }

      gameLoop = requestAnimationFrame(update);
    }

    window.startGame = () => {
      document.getElementById('game-start-btn').style.display = 'none';
      score = 0;
      level = 1;
      lives = 3;
      player.x = 300;
      stars = [];
      bugs = [];
      gameActive = true;
      updateGameInfo();
      ctx.textAlign = 'left';
      update();
    };

    // Initial canvas setup
    ctx.fillStyle = 'rgba(7, 8, 15, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#9490b4';
    ctx.font = '16px JetBrains Mono, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('Press Start to Play', canvas.width / 2, canvas.height / 2);
  }
});