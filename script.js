// ========== THEME TOGGLE ==========

// Load saved theme from localStorage
// Default = dark, light-mode class active = thème clair
function loadSavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
    }
}

// Update theme toggle button display
function updateThemeToggleButton() {
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        if (document.body.classList.contains('light-mode')) {
            themeToggle.textContent = '🌙';
            themeToggle.title = 'Basculer vers le mode sombre';
        } else {
            themeToggle.textContent = '☀️';
            themeToggle.title = 'Basculer vers le mode clair';
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
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateThemeToggleButton();
            // Reinitialize particles with new theme
            initParticles();
        });
    }
});

// ========== CANVAS ANIMATION ==========

const canvas = document.getElementById('bg-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

function isLightMode() {
    return document.body.classList.contains('light-mode');
}

function isDarkMode() {
    return !isLightMode();
}

function getCanvasWidth() {
    return window.innerWidth;
}

function getCanvasHeight() {
    return window.innerHeight;
}

function initCanvas() {
    if (!canvas || !ctx) return;
    canvas.width = getCanvasWidth();
    canvas.height = getCanvasHeight();
}

initCanvas();

// Create particles
let particles = [];

class Particle {
    constructor() {
        const isSpaceMode = isDarkMode();
        
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
        const isSpaceMode = isDarkMode();
        
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
    if (!canvas || !ctx) return;
    particles = [];
    const isSpaceMode = isDarkMode();
    const particleCount = isSpaceMode ? 150 : 50;
    
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

// Animate particles
function animateParticles() {
    if (!ctx || !canvas) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const isSpaceMode = isDarkMode();
    
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
    if (!navLinks.length) return;
    
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
const navLinksContainer = document.getElementById('navLinks');

if (menuToggle && navLinksContainer) {
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
    });
}

// Close menu when a link is clicked
const navLinksItems = document.querySelectorAll('.nav-links a');
if (navLinksItems.length && navLinksContainer) {
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            navLinksContainer.classList.remove('active');
        });
    });
}

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
// ===== PRIVILEGE ELEVATION LOGIN =====
(function () {
  // --- UI refs / timers ---
  let terminalEl = null;
  let bootEl = null;
  let bootTimer = null;
  let fxEl = null;
  let canvas = null;
  let ctx = null;
  let matrixAnimation = null;

  function ensureFxOverlay() {
    if (fxEl) return;
    fxEl = document.createElement("div");
    fxEl.id = "hacker-fx";
    fxEl.setAttribute("aria-hidden", "true");
    document.body.appendChild(fxEl);
  }

  function startMatrix() {
    if (canvas) return;
    canvas = document.createElement("canvas");
    canvas.id = "matrix-canvas";
    document.body.appendChild(canvas);
    ctx = canvas.getContext("2d");
    const characters = "01ABCDEF<>[]{}#$%";
    let columns = 0;
    let drops = [];

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / 16);
      drops = Array.from({ length: columns }, () => Math.random() * canvas.height / 16);
      ctx.font = "16px monospace";
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.09)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "rgba(16, 185, 129, 0.9)";
      drops.forEach((drop, index) => {
        ctx.fillText(characters[Math.floor(Math.random() * characters.length)], index * 16, drop * 16);
        drops[index] = drop * 16 > canvas.height && Math.random() > 0.975 ? 0 : drop + 0.35;
      });
      matrixAnimation = requestAnimationFrame(draw);
    }

    window.addEventListener("resize", resize);
    resize();
    draw();
  }

  function stopEffects() {
    if (bootTimer) clearInterval(bootTimer);
    bootTimer = null;
    if (matrixAnimation) cancelAnimationFrame(matrixAnimation);
    matrixAnimation = null;
    if (canvas) canvas.remove();
    if (fxEl) fxEl.remove();
    canvas = null;
    ctx = null;
    fxEl = null;
    document.body.classList.remove("hacker-mode");
  }

  function startLoginSequence() {
    if (terminalEl || bootEl) return;
    isAdmin = false;
    awaitingPassword = false;
    passwordAttempts = 0;
    document.body.classList.add("hacker-mode");
    ensureFxOverlay();
    startMatrix();

    bootEl = document.createElement("div");
    bootEl.id = "hacker-boot";
    bootEl.innerHTML = `
      <div class="boot-panel" role="dialog" aria-label="Initialisation de l'élévation des privilèges">
        <div class="boot-header"><span class="dots"><span class="dot red"></span><span class="dot yellow"></span><span class="dot green"></span></span><span>INIT :: PRIV-ESC / KERNEL HANDSHAKE</span></div>
        <div class="boot-body">
          <div class="boot-line" id="bootLine">Establishing secure channel...</div>
          <div class="progress-wrap" aria-hidden="true"><div class="progress-bar" id="bootBar"></div></div>
          <div class="progress-meta"><span id="bootPct">0%</span><span id="bootStatus">RUN</span></div>
        </div>
      </div>`;
    document.body.appendChild(bootEl);

    const lines = [
      "Establishing secure channel...",
      "Checking access control list...",
      "Verifying local session...",
      "Preparing privilege elevation...",
      "Syncing authentication policy...",
      "Finalizing secure session..."
    ];
    let progress = 0;
    let line = 0;
    bootTimer = setInterval(() => {
      progress = Math.min(100, progress + Math.random() * 12 + 7);
      line = Math.min(lines.length - 1, Math.floor(progress / 18));
      bootEl.querySelector("#bootBar").style.width = `${progress}%`;
      bootEl.querySelector("#bootPct").textContent = `${Math.floor(progress)}%`;
      bootEl.querySelector("#bootLine").textContent = lines[line];
      if (progress >= 100) {
        clearInterval(bootTimer);
        bootTimer = null;
        bootEl.querySelector("#bootStatus").textContent = "OK";
        setTimeout(() => {
          if (bootEl) bootEl.remove();
          bootEl = null;
          openTerminalInteractive();
        }, 350);
      }
    }, 120);
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
          <span>${isAdmin ? "root@IAC:~" : "user@IAC:~"}</span>
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
        stopEffects();
      });
    }

    focusTerminalInput();
    printTerminalMessage("Access restricted...");
printHint();
  }

  function renderPromptLine() {
    const who = isAdmin ? "root@IAC" : "user@IAC";
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
    if (headerSpan) headerSpan.textContent = isAdmin ? "root@IAC:~" : "user@IAC:~";
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

    const who = isAdmin ? "root@IAC" : "user@IAC";
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
  function printHint() {
  if (!isAdmin && !awaitingPassword) {
    printTerminalMessage("hint: try elevating privileges...");
  }

  else if (awaitingPassword) {
    printTerminalMessage("hint: who are you really?");
  }

  else if (isAdmin) {
    printTerminalMessage("hint: execute the final payload...");
  }
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

  // ===== USER MODE =====
  if (!isAdmin) {
    if (command === "sudo -i") {
      awaitingPassword = true;
      passwordAttempts = 0;
      printTerminalMessage("[sudo] password for user@IAC:");
      printHint(); // 👈 AJOUT
      rebuildPromptLine();
      return;
    }

    if (command === "virus") {
      printTerminalMessage("Permission denied.");
      printHint(); // 👈 AJOUT
      return;
    }

    printTerminalMessage("Commande inconnue.");
    printHint(); // 👈 AJOUT
    return;
  }

  // ===== ADMIN MODE =====
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

  printTerminalMessage("Commande inconnue.");
  printHint(); // 👈 AJOUT
}

  function clearTerminal() {
    const termBody = document.getElementById("termBody");
    if (!termBody) return;

    termBody.innerHTML = renderPromptLine();
    refreshTerminalHeader();
    focusTerminalInput();
  }

  function openLoginRoute() {
    if (!terminalEl && !bootEl) startLoginSequence();
  }

  function isLoginRoute() {
    return window.location.pathname.endsWith("/login") ||
      window.location.hash.toLowerCase() === "#/login" ||
      new URLSearchParams(window.location.search).has("login");
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (isLoginRoute()) openLoginRoute();
  });

  let loginBuffer = "";
  window.addEventListener("keydown", (event) => {
    if (event.target.matches("input, textarea, select")) return;

    loginBuffer = (loginBuffer + event.key).slice(-6).toLowerCase();
    if (loginBuffer === "/login") {
      loginBuffer = "";
      openLoginRoute();
    }
  });

})();


// Détection ouverture console (approximation)
let devtoolsOpen = false;

setInterval(() => {
  const widthThreshold = window.outerWidth - window.innerWidth > 160;
  const heightThreshold = window.outerHeight - window.innerHeight > 160;

  if (widthThreshold || heightThreshold) {
    if (!devtoolsOpen) {
      devtoolsOpen = true;

      console.log("%c👀 Tu cherches des secrets ?", "color: #00ffcc; font-size: 16px;");
      console.log("%cTape /login pour ouvrir l'interface d'élévation des privilèges.", "color: #ffaa00; font-size: 14px;");
    }
  } else {
    devtoolsOpen = false;
  }
}, 500);
console.log("%cDecrypting input sequence...", "color: lime;");
setTimeout(() => {
  console.log("%c↑ ↑ ↓ ↓ ← → ← → B A", "color: red; font-size: 20px;");
}, 1000);

function openModal(imgSrc) {
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');

    modal.style.display = "flex"; // "flex" est souvent mieux pour centrer le contenu
    modalImg.src = imgSrc;
}

function closeModal() {
    document.getElementById('modal').style.display = "none";
}

// Utilise ceci pour fermer en cliquant à côté
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        closeModal();
    }
});

