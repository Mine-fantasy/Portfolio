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

