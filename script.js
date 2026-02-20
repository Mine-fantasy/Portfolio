// ========== THEME TOGGLE ==========

// Load saved theme from localStorage
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'space') {
        document.body.classList.add('space-mode');
    }
}

// Update theme toggle button display
function updateThemeToggleButton() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (document.body.classList.contains('space-mode')) {
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Basculer vers le mode jour';
        } else {
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Basculer vers le mode cosmic';
        }
    }
}

// Load theme on page load
loadSavedTheme();
updateThemeToggleButton();

// Theme toggle functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('space-mode');
            const isSpaceMode = document.body.classList.contains('space-mode');
            localStorage.setItem('theme', isSpaceMode ? 'space' : 'light');
            updateThemeToggleButton();
            // Reinitialize particles with new theme
            initParticles();
        });
    }
});

// ========== CANVAS ANIMATION ==========

// Canvas Background Animation
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Create particles
let particles = [];

class Particle {
    constructor() {
        const isSpaceMode = document.body.classList.contains('space-mode');
        
        if (isSpaceMode) {
            // Star particles for space mode
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2.5 + 0.5;
            this.opacity = Math.random() * 0.7 + 0.3;
            this.speedX = (Math.random() - 0.5) * 0.2;
            this.speedY = (Math.random() - 0.5) * 0.1;
            this.twinkleSpeed = Math.random() * 0.02 + 0.01;
            this.color = this.getStarColor();
            this.twinklePhase = Math.random() * Math.PI * 2;
        } else {
            // Original cyan particles
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.opacity = Math.random() * 0.5 + 0.2;
        }
    }

    getStarColor() {
        const colors = [
            'rgba(255, 255, 255, ',  // white
            'rgba(212, 165, 255, ',  // purple
            'rgba(30, 144, 255, ',   // dodger blue
            'rgba(100, 200, 255, ',  // light blue
            'rgba(230, 190, 255, '   // light purple
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
        const isSpaceMode = document.body.classList.contains('space-mode');
        
        if (isSpaceMode) {
            // Draw star with glow for space mode
            this.twinklePhase += this.twinkleSpeed;
            const twinkleOpacity = this.opacity * (0.5 + 0.5 * Math.sin(this.twinklePhase));
            
            // Outer glow
            const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 3);
            gradient.addColorStop(0, this.color + (twinkleOpacity * 0.6) + ')');
            gradient.addColorStop(1, this.color + '0)');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
            ctx.fill();
            
            // Star core
            ctx.fillStyle = this.color + twinkleOpacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Original particle drawing
            ctx.fillStyle = this.color + this.opacity + ')';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around screen
        if (this.x > canvas.width) this.x = 0;
        if (this.x < 0) this.x = canvas.width;
        if (this.y > canvas.height) this.y = 0;
        if (this.y < 0) this.y = canvas.height;
    }
}

// Initialize particles
function initParticles() {
    particles = [];
    const isSpaceMode = document.body.classList.contains('space-mode');
    const particleCount = isSpaceMode ? 150 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animate particles
function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isSpaceMode = document.body.classList.contains('space-mode');
    
    // Draw fog clouds for space mode
    if (isSpaceMode) {
        // Atmospheric fog effect
        const fogGradient = ctx.createRadialGradient(
            canvas.width * 0.3, canvas.height * 0.4, 0,
            canvas.width * 0.3, canvas.height * 0.4, canvas.width * 0.8
        );
        fogGradient.addColorStop(0, 'rgba(138, 43, 226, 0.08)');
        fogGradient.addColorStop(1, 'rgba(138, 43, 226, 0)');
        
        ctx.fillStyle = fogGradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Second fog layer
        const fogGradient2 = ctx.createRadialGradient(
            canvas.width * 0.7, canvas.height * 0.6, 0,
            canvas.width * 0.7, canvas.height * 0.6, canvas.width * 0.6
        );
        fogGradient2.addColorStop(0, 'rgba(30, 144, 255, 0.06)');
        fogGradient2.addColorStop(1, 'rgba(30, 144, 255, 0)');
        
        ctx.fillStyle = fogGradient2;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    
    // Draw and update particles
    for (let particle of particles) {
        particle.update();
        particle.draw();
    }

    requestAnimationFrame(animateParticles);
}

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Start animation
initParticles();
animateParticles();

// ========== SCROLL ANIMATIONS ==========

// Intersection Observer for smooth scroll animations
const observerOptions = {
    threshold: [0, 0.25],
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        // Ajouter l'animation quand l'élément devient visible
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            // Garder la classe pour que l'animation reste fluide (ne pas la retirer)
        }
    });
}, observerOptions);

// Observe all sections and cards
document.addEventListener('DOMContentLoaded', () => {
    // Petit délai pour s'assurer que le DOM est complètement chargé
    setTimeout(() => {
        const elementsToObserve = document.querySelectorAll(
            'section, .skill-card, .veille-card, .projet-card, .cv-container, .contact-container, .contact-item'
        );
        
        elementsToObserve.forEach(el => {
            observer.observe(el);
        });
    }, 100);
});

// Parallax scrolling effect on sections
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('section');
    
    parallaxElements.forEach(element => {
        const yPos = scrolled * 0.5;
        if (element.id === 'accueil') {
            element.style.backgroundPosition = `center ${yPos}px`;
        }
    });

    // Update navbar on scroll
    const nav = document.querySelector('nav');
    if (scrolled > 50) {
        nav.style.background = 'rgba(17, 24, 39, 0.95)';
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        nav.style.background = 'rgba(17, 24, 39, 0.8)';
        nav.style.boxShadow = 'none';
    }

    // Update active nav link based on scroll position
    updateActiveNavLink();
});

// Update active nav link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(currentSection)) {
            link.classList.add('active');
        }
    });
}

// Mobile Menu Toggle
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Close menu when a link is clicked
const navLinksItems = document.querySelectorAll('.nav-links a');
navLinksItems.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ========== SCROLL TO TOP BUTTON ==========

// Create scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.id = 'scrollTopBtn';
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.setAttribute('aria-label', 'Scroll to top');
document.body.appendChild(scrollTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
// ===== KONAMI CODE -> MATRIX HACKER MODE (no index.html changes) =====
(function () {
  const konami = [
    "ArrowUp","ArrowUp","ArrowDown","ArrowDown",
    "ArrowLeft","ArrowRight","ArrowLeft","ArrowRight",
    "b","a"
  ];
  let buffer = [];

    // --- UI refs / timers (Konami boot + terminal) ---
  let bootEl = null;
  let terminalEl = null;
  let fxEl = null;
  let bootTimer = null;
  let typeTimer = null;

  // 3 propositions de “scénarios” terminal : on alterne à chaque activation
  const terminalScripts = [
    {
      title: "root@chartres:~",
      lines: [
        "sudo -s",
        "whoami",
        "root",
        "ACCESS ADMIN GRANTED",
        "Welcome, operator."
      ],
    },
    {
      title: "sys@chartres:/var/log",
      lines: [
        "tail -n 3 auth.log",
        "AUTH: token validated :: scope=superuser",
        "AUTH: policy override injected",
        "PRIVILEGES ELEVATED",
        "SESSION: 0xDEADBEEF"
      ],
    },
    {
      title: "admin@chartres:/",
      lines: [
        "ssh admin@localhost",
        "Password: ********",
        "ACCESS DENIED",
        "retry --force",
        "ACCESS ADMIN GRANTED",
        "SYSTEM ONLINE"
      ],
    }
  ];

  function pickTerminalScript() {
    const key = "konami_terminal_variant";
    const current = parseInt(localStorage.getItem(key) || "0", 10);
    const next = (current + 1) % terminalScripts.length;
    localStorage.setItem(key, String(next));
    return terminalScripts[current % terminalScripts.length];
  }

  function toggleHackerMode() {
    const isOn = document.body.classList.toggle("hacker-mode");
    if (isOn) {
      startMatrix();
      ensureFxOverlay();
      startBootSequence();
    } else {
      stopMatrix();
      cleanupBootAndTerminal();
    }
  }

  function cleanupBootAndTerminal() {
    if (bootTimer) clearInterval(bootTimer);
    bootTimer = null;

    if (typeTimer) clearInterval(typeTimer);
    typeTimer = null;

    if (bootEl) bootEl.remove();
    bootEl = null;

    if (terminalEl) terminalEl.remove();
    terminalEl = null;

    if (fxEl) fxEl.remove();
    fxEl = null;
  }


function ensureFxOverlay() {
  if (fxEl) return;
  fxEl = document.createElement("div");
  fxEl.id = "hacker-fx";
  fxEl.setAttribute("aria-hidden", "true");
  document.body.appendChild(fxEl);
}

  function ensureBootUI() {
    if (bootEl) return;

    bootEl = document.createElement("div");
    bootEl.id = "hacker-boot";
    bootEl.innerHTML = `
      <div class="boot-panel" role="dialog" aria-label="Hacker boot">
        <div class="boot-header">
          <span class="dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </span>
          <span>INIT :: PRIV-ESC / KERNEL HANDSHAKE</span>
        </div>
        <div class="boot-body">
          <div class="boot-line" id="bootLine">Establishing secure channel...</div>
          <div class="progress-wrap" aria-hidden="true">
            <div class="progress-bar" id="bootBar"></div>
          </div>
          <div class="progress-meta">
            <span id="bootPct">0%</span>
            <span id="bootStatus">IDLE</span>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(bootEl);
  }

  function startBootSequence() {
    cleanupBootAndTerminal(); // évite les doublons si Konami relancé vite
    ensureBootUI();

    const bootLine = document.getElementById("bootLine");
    const bootBar = document.getElementById("bootBar");
    const bootPct = document.getElementById("bootPct");
    const bootStatus = document.getElementById("bootStatus");

    const lines = [
      "Establishing secure channel...",
      "Bypassing firewall ruleset...",
      "Injecting payload into auth service...",
      "Escalating privileges...",
      "Decrypting token vault...",
      "Syncing access control lists...",
      "Finalizing session..."
    ];

    const statuses = ["RUN", "EXEC", "OK", "WARN", "SYNC", "PATCH"];

    let p = 0;
    let i = 0;

    if (bootStatus) bootStatus.textContent = "RUN";
    if (bootLine) bootLine.textContent = lines[0];
    if (bootBar) bootBar.style.width = "0%";
    if (bootPct) bootPct.textContent = "0%";

    bootTimer = setInterval(() => {
      const step = Math.random() * 6 + 2; // 2..8
      p = Math.min(100, p + step);

      if (bootBar) bootBar.style.width = `${p}%`;
      if (bootPct) bootPct.textContent = `${Math.floor(p)}%`;

      if (Math.random() > 0.6) {
        i = Math.min(lines.length - 1, i + 1);
        if (bootLine) bootLine.textContent = lines[i];
      }
      if (Math.random() > 0.65) {
        if (bootStatus) bootStatus.textContent = statuses[Math.floor(Math.random() * statuses.length)];
      }

      if (p >= 100) {
        clearInterval(bootTimer);
        bootTimer = null;

        if (bootStatus) bootStatus.textContent = "OK";
        if (bootLine) bootLine.textContent = "Boot complete. Launching terminal...";

        setTimeout(() => {
          if (bootEl) bootEl.remove();
          bootEl = null;
          openTerminalInteractive();
        }, 550);
      }
    }, 120);
  }

  function openTerminal() {
    if (terminalEl) return;

    const scenario = pickTerminalScript();

    terminalEl = document.createElement("div");
    terminalEl.id = "hacker-terminal";
    terminalEl.innerHTML = `
      <div class="terminal-panel" role="dialog" aria-label="Terminal">
        <div class="terminal-header">
          <span>${escapeHtml(scenario.title)}</span>
          <button class="close-btn" id="termClose">Fermer</button>
        </div>
        <div class="terminal-body" id="termBody">
          <div><span class="prompt">root@chartres</span>:<span class="prompt">~</span>$ <span id="termText"></span><span class="cursor"></span></div>
        </div>
      </div>
    `;
    document.body.appendChild(terminalEl);

    const closeBtn = document.getElementById("termClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (terminalEl) terminalEl.remove();
        terminalEl = null;
      });
    }

    typeTerminalLines(scenario.lines);
  }

  function typeTerminalLines(lines) {
    const termText = document.getElementById("termText");
    const termBody = document.getElementById("termBody");
    if (!termText || !termBody) return;

    let lineIndex = 0;

    const printLine = (text, done) => {
      termText.textContent = "";
      let c = 0;

      if (typeTimer) clearInterval(typeTimer);
      typeTimer = setInterval(() => {
        c++;
        termText.textContent = text.slice(0, c);
        termBody.scrollTop = termBody.scrollHeight;

        if (c >= text.length) {
          clearInterval(typeTimer);
          typeTimer = null;
          done();
        }
      }, 22);
    };

    const next = () => {
      if (lineIndex >= lines.length) return;

      const current = lines[lineIndex++];
      printLine(current, () => {
        const div = document.createElement("div");
        const safe = escapeHtml(current);
        const isGranted = current.toUpperCase().includes("ACCESS ADMIN GRANTED");
        div.innerHTML = `<span class="prompt">root@chartres</span>:<span class="prompt">~</span>$ ` +
          (isGranted ? `<span class="glitch" data-text="${safe}">${safe}</span>` : safe);
        termBody.insertBefore(div, termBody.lastElementChild);

        termText.textContent = "";
        setTimeout(next, 180);
      });
    };

    next();
  }

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[m]));
  }

  // Listen Konami
  window.addEventListener("keydown", (e) => {
    const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    buffer.push(key);
    buffer = buffer.slice(-konami.length);

    if (buffer.join(",") === konami.join(",")) {
      buffer = [];
      toggleHackerMode();
    }
  });

  // ===== Matrix rain =====
  let canvas, ctx, animId, intervalId;
  let columns = 0;
  let drops = [];
  const chars = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  function createCanvas() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d", { alpha: true });
    resize();
    window.addEventListener("resize", resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const fontSize = 16;
    columns = Math.floor(canvas.width / fontSize);
    drops = Array.from({ length: columns }, () => Math.floor(Math.random() * canvas.height / fontSize));
    ctx.font = `${fontSize}px monospace`;
  }

  function draw() {
    if (!ctx || !canvas) return;

    // Fading background (trace effect)
    ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(16, 185, 129, 0.95)"; // vert "terminal"
    const fontSize = 16;

    for (let i = 0; i < drops.length; i++) {
      const text = chars[Math.floor(Math.random() * chars.length)];
      const x = i * fontSize;
      const y = drops[i] * fontSize;

      ctx.fillText(text, x, y);

      // Reset drop randomly
      if (y > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]+= 0.3; // vitesse de chute
    }

    animId = requestAnimationFrame(draw);
  }

  function startMatrix() {
    createCanvas();
    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(draw);
  }

  function stopMatrix() {
    if (animId) cancelAnimationFrame(animId);
    animId = null;

    // Option : enlever le canvas complètement
    if (canvas) {
      canvas.remove();
      canvas = null;
      ctx = null;
      window.removeEventListener("resize", resize);
    }
  }


  // ===== Interactive Terminal Version (sudo -i -> password -> admin -> virus) =====
  // Change this password to whatever you want:
  const ADMIN_PASSWORD = "root";

  let isAdmin = false;
  let awaitingPassword = false;
  let passwordAttempts = 0;
  const MAX_PASSWORD_ATTEMPTS = 3;

  function openTerminalInteractive() {
    if (terminalEl) return;

    terminalEl = document.createElement("div");
    terminalEl.id = "hacker-terminal";
    terminalEl.innerHTML = `
      <div class="terminal-panel" role="dialog" aria-label="Terminal">
        <div class="terminal-header">
          <span>${isAdmin ? "root@chartres:~" : "user@chartres:~"}</span>
          <button class="close-btn" id="termClose">Fermer</button>
        </div>
        <div class="terminal-body" id="termBody">
          ${renderPromptLine()}
        </div>
      </div>
    `;
    document.body.appendChild(terminalEl);

    const closeBtn = document.getElementById("termClose");
    if (closeBtn) {
      closeBtn.addEventListener("click", () => {
        if (terminalEl) terminalEl.remove();
        terminalEl = null;
      });
    }

    focusTerminalInput();
    printTerminalMessage("Tape 'help' pour voir les commandes.");
  }

  function renderPromptLine() {
    const who = isAdmin ? "root@chartres" : "user@chartres";
    const prompt = `<span class="prompt">${who}</span>:<span class="prompt">~</span>$ `;
    const inputType = awaitingPassword ? "password" : "text";
    const inputClass = awaitingPassword ? "terminal-input terminal-input-password" : "terminal-input";
    return `
      <div class="term-input-line">
        ${prompt}
        <input type="${inputType}" id="terminalInput" class="${inputClass}" autocomplete="off" autocapitalize="off" spellcheck="false" />
      </div>
    `;
  }

  function refreshTerminalHeader() {
    const headerSpan = terminalEl?.querySelector(".terminal-header span");
    if (headerSpan) headerSpan.textContent = isAdmin ? "root@chartres:~" : "user@chartres:~";
  }

  function focusTerminalInput() {
    const input = document.getElementById("terminalInput");
    if (!input) return;

    setTimeout(() => input.focus(), 0);

    input.onkeydown = (e) => {
      if (e.key === "Enter") {
        const value = input.value;
        input.value = "";

        if (awaitingPassword) {
          handlePassword(value);
        } else {
          handleCommand(value);
        }
      }
    };
  }

  function printCommandEcho(text) {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    const who = isAdmin ? "root@chartres" : "user@chartres";
    const div = document.createElement("div");
    div.innerHTML = `<span class="prompt">${who}</span>:<span class="prompt">~</span>$ ${escapeHtml(text)}`;
    termBody.insertBefore(div, termBody.lastElementChild);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function printTerminalMessage(text) {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    const div = document.createElement("div");
    div.textContent = text;
    termBody.insertBefore(div, termBody.lastElementChild);
    termBody.scrollTop = termBody.scrollHeight;
  }

  function rebuildPromptLine() {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    const last = termBody.lastElementChild;
    if (last) last.remove();

    const wrapper = document.createElement("div");
    wrapper.innerHTML = renderPromptLine().trim();
    termBody.appendChild(wrapper.firstElementChild);

    refreshTerminalHeader();
    focusTerminalInput();
  }

  function handlePassword(raw) {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    const div = document.createElement("div");
    div.textContent = "[sudo] password: ********";
    termBody.insertBefore(div, termBody.lastElementChild);

    const password = (raw ?? "").trim();
    if (password === ADMIN_PASSWORD) {
      awaitingPassword = false;
      passwordAttempts = 0;
      isAdmin = true;

      printTerminalMessage("ACCESS ADMIN GRANTED");
      rebuildPromptLine();
      return;
    }

    passwordAttempts += 1;
    printTerminalMessage("Sorry, try again.");

    if (passwordAttempts >= MAX_PASSWORD_ATTEMPTS) {
      awaitingPassword = false;
      passwordAttempts = 0;
      printTerminalMessage("sudo: 3 incorrect password attempts");
      rebuildPromptLine();
      return;
    }

    awaitingPassword = true;
    rebuildPromptLine();
  }

  function handleCommand(raw) {
    const input = (raw ?? "").trim();
    const command = input.toLowerCase();

    if (!input) return;

    printCommandEcho(input);

    if (command === "help") {
      if (isAdmin) {
        printTerminalMessage("Commandes : virus, clear, exit, help");
      } else {
        printTerminalMessage("Commandes : sudo -i, clear, help");
      }
      return;
    }

    if (command === "clear") {
      clearTerminal();
      return;
    }

    if (!isAdmin) {
      if (command === "sudo -i") {
        awaitingPassword = true;
        passwordAttempts = 0;
        printTerminalMessage("[sudo] password for user@chartres:");
        rebuildPromptLine();
        return;
      }

      if (command === "virus") {
        printTerminalMessage("Permission denied. Passe en admin : sudo -i");
        return;
      }

      printTerminalMessage("Commande inconnue. Tape 'help'.");
      return;
    }

    if (command === "exit") {
      isAdmin = false;
      awaitingPassword = false;
      passwordAttempts = 0;
      printTerminalMessage("Session admin fermée.");
      rebuildPromptLine();
      return;
    }

    if (command === "virus") {
      printTerminalMessage("ACCESSING SECURE DATABASE...");
      setTimeout(() => {
        window.location.href = "virus.html";
      }, 1200);
      return;
    }

    printTerminalMessage("Commande inconnue. Tape 'help'.");
  }

  function clearTerminal() {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    termBody.innerHTML = renderPromptLine();
    refreshTerminalHeader();
    focusTerminalInput();
  }

})();
term.classList.add("animate-in");
