// ============================================
// PRELOADER
// ============================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const preloader = document.getElementById('preloader');
    if (preloader) preloader.classList.add('hidden');
  }, 2200);
});

// ============================================
// SET CURRENT YEAR
// ============================================
const yr = new Date().getFullYear();
document.getElementById('currentYear') && (document.getElementById('currentYear').textContent = yr);
document.getElementById('footerYear') && (document.getElementById('footerYear').textContent = yr);

// ============================================
// NAVBAR SCROLL BEHAVIOR
// ============================================
const navbar = document.getElementById('navbar');
const heroBg = document.getElementById('home');
const navHireBtn = document.getElementById('navHireBtn');

let heroBottom = 0;

function getHeroBottom() {
  if (heroBg) {
    heroBottom = heroBg.offsetTop + heroBg.offsetHeight;
  }
}

getHeroBottom();
window.addEventListener('resize', getHeroBottom);

function updateNavState() {
  const scrollY = window.scrollY;
  const heroSection = document.getElementById('home');
  const heroH = heroSection ? heroSection.offsetHeight : window.innerHeight;

  navbar.classList.remove('nav-transparent', 'nav-red', 'nav-white');

  if (scrollY < 50) {
    // At top — transparent
    navbar.classList.add('nav-transparent');
  } else if (scrollY < heroH * 0.8) {
    // Scrolling through hero — RED
    navbar.classList.add('nav-red');
  } else {
    // Past hero — white/blur
    navbar.classList.add('nav-white');
  }
}

window.addEventListener('scroll', updateNavState);
updateNavState();

// ============================================
// HAMBURGER / MOBILE DRAWER
// ============================================
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');
const hamburgerPath = document.getElementById('hamburgerPath');

hamburger.addEventListener('click', () => {
  const isOpen = mobileDrawer.classList.toggle('open');
  if (isOpen) {
    hamburgerPath.setAttribute('d', 'M6 18L18 6M6 6l12 12');
  } else {
    hamburgerPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
  }
});

function closeDrawer() {
  mobileDrawer.classList.remove('open');
  hamburgerPath.setAttribute('d', 'M4 6h16M4 12h16M4 18h16');
}

// ============================================
// SMOOTH SCROLL
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ============================================
// AOS — Animate On Scroll (custom minimal)
// ============================================
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.getAttribute('data-aos-delay') || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  elements.forEach(el => observer.observe(el));
}

initAOS();

// ============================================
// CERTIFICATIONS SLIDER
// ============================================
const track = document.getElementById('certsTrack');
const prevBtn = document.getElementById('certPrev');
const nextBtn = document.getElementById('certNext');

if (track && prevBtn && nextBtn) {
  const SCROLL_AMOUNT = 300;

  nextBtn.addEventListener('click', () => {
    track.scrollBy({ left: SCROLL_AMOUNT, behavior: 'smooth' });
  });

  prevBtn.addEventListener('click', () => {
    track.scrollBy({ left: -SCROLL_AMOUNT, behavior: 'smooth' });
  });

  // Drag to scroll
  let isDown = false;
  let startX = 0;
  let scrollLeft = 0;

  track.addEventListener('mousedown', e => {
    isDown = true;
    track.style.cursor = 'grabbing';
    startX = e.pageX - track.offsetLeft;
    scrollLeft = track.scrollLeft;
  });

  track.addEventListener('mouseleave', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mouseup', () => {
    isDown = false;
    track.style.cursor = 'grab';
  });

  track.addEventListener('mousemove', e => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.5;
    track.scrollLeft = scrollLeft - walk;
  });
}

// ============================================
// HERO CONSTELLATION ANIMATION
// ============================================
(function initConstellation() {
  const canvas = document.getElementById('heroConstellation');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let particles = [];
  const PARTICLE_COUNT = 85;
  const CONNECTION_DIST = 110;
  const MOUSE_DIST = 160;

  let mouse = { x: null, y: null, active: false };

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Track mouse position over the Hero section
  const heroSection = document.getElementById('home');
  if (heroSection) {
    heroSection.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    });

    heroSection.addEventListener('mouseleave', () => {
      mouse.active = false;
    });
  }

  class Node {
    constructor() {
      this.reset(true);
    }
    reset(initial = false) {
      this.x = Math.random() * canvas.width;
      this.y = initial ? Math.random() * canvas.height : (Math.random() < 0.5 ? -10 : canvas.height + 10);
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.radius = Math.random() * 1.5 + 1;
      this.isRed = Math.random() < 0.2; // 20% red nodes, 80% white
      this.color = this.isRed ? '255, 42, 42' : '255, 255, 255';
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      // Wrap around bounds or reset
      if (this.x < -20 || this.x > canvas.width + 20 || this.y < -20 || this.y > canvas.height + 20) {
        this.reset();
      }

      // Mouse attraction force
      if (mouse.active) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const force = (MOUSE_DIST - dist) / MOUSE_DIST;
          this.x += (dx / dist) * force * 0.8;
          this.y += (dy / dist) * force * 0.8;
        }
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color}, 0.85)`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Node());
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw nodes
    particles.forEach(p => {
      p.update();
      p.draw();
    });

    // Draw connection lines between nodes
    for (let i = 0; i < particles.length; i++) {
      const p1 = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);

        if (dist < CONNECTION_DIST) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.18;
          const color = (p1.isRed || p2.isRed) ? '255, 42, 42' : '255, 255, 255';
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${color}, ${alpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      // Draw connection lines to mouse cursor
      if (mouse.active) {
        const dx = p1.x - mouse.x;
        const dy = p1.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MOUSE_DIST) {
          const alpha = (1 - dist / MOUSE_DIST) * 0.35;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(255, 42, 42, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
})();

// ============================================
// VOICE / TEXT-TO-SPEECH GREETING
// ============================================
const muteBtn = document.getElementById('muteBtn');
if (muteBtn) {
  let isSpeaking = false;
  
  const text = "Hi, I'm Bharathi A. Welcome to my portfolio. I am a Business Analyst specializing in SQL, Power BI, Advanced Excel, and Python to analyze data and deliver actionable business insights. Let's build something amazing together!";
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set preferred voice options
  function setupVoices() {
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => 
      v.name.includes('Google US English') || 
      v.name.includes('Natural') || 
      v.lang === 'en-US'
    );
    if (preferredVoice) utterance.voice = preferredVoice;
  }

  setupVoices();
  if (typeof window.speechSynthesis !== 'undefined' && window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = setupVoices;
  }

  utterance.onend = () => {
    isSpeaking = false;
    const span = muteBtn.querySelector('span');
    const svgContainer = muteBtn.querySelector('svg');
    if (span) span.textContent = 'Unmute Reel';
    if (svgContainer) {
      svgContainer.innerHTML = `
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
        <line x1="23" y1="9" x2="17" y2="15"/>
        <line x1="17" y1="9" x2="23" y2="15"/>
      `;
    }
  };

  muteBtn.addEventListener('click', () => {
    const span = muteBtn.querySelector('span');
    const svgContainer = muteBtn.querySelector('svg');

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      isSpeaking = false;
      if (span) span.textContent = 'Unmute Reel';
      if (svgContainer) {
        svgContainer.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <line x1="23" y1="9" x2="17" y2="15"/>
          <line x1="17" y1="9" x2="23" y2="15"/>
        `;
      }
    } else {
      window.speechSynthesis.cancel(); // stop any current speech
      window.speechSynthesis.speak(utterance);
      isSpeaking = true;
      if (span) span.textContent = 'Mute Sound';
      if (svgContainer) {
        svgContainer.innerHTML = `
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
        `;
      }
    }
  });
}

// ============================================
// CONTACT FORM
// ============================================
// ⚠️ Set your deployed Google Sheets Web App URL below:
const GOOGLE_SHEET_WEB_APP_URL = "https://script.google.com/macros/s/AKfycby_pGHxY2mHwFxclnzUjAKVG8e3IIZOhSkZ2cdoWqLYeXiDUsihADxIhh3t4yHcecC1/exec";

const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', handleSubmit);
}

function handleSubmit(e) {
  e.preventDefault();
  const btn = document.getElementById('submitBtn');
  const submitText = document.getElementById('submitText');
  if (!btn || !submitText) return;

  // Make the UI feel instant by showing success immediately!
  showSuccess(btn, submitText);

  if (GOOGLE_SHEET_WEB_APP_URL === "YOUR_GOOGLE_SHEET_WEB_APP_URL" || !GOOGLE_SHEET_WEB_APP_URL) {
    return;
  }

  // Send payload to Google Sheets in the background
  const formData = new FormData(contactForm);
  const searchParams = new URLSearchParams(formData);

  fetch(GOOGLE_SHEET_WEB_APP_URL, {
    method: 'POST',
    body: searchParams,
    mode: 'no-cors'
  })
  .catch(error => {
    console.error('Background submission error:', error);
  });
}

function showSuccess(btn, submitText) {
  submitText.textContent = '✓ Sent!';
  btn.classList.add('success');
  btn.disabled = true;

  setTimeout(() => {
    resetButton(btn, submitText);
    contactForm.reset();
  }, 3000);
}

function showError(btn, submitText) {
  submitText.textContent = '❌ Failed!';
  btn.classList.add('error');
  
  setTimeout(() => {
    resetButton(btn, submitText);
  }, 3000);
}

function resetButton(btn, submitText) {
  submitText.textContent = 'Send Message';
  btn.disabled = false;
  btn.style.opacity = '';
  btn.classList.remove('success', 'error');
}

// ============================================
// PARALLAX EFFECT ON CONTACT BIG TEXT
// ============================================
const contactBigText = document.querySelector('.contact-big-text');
if (contactBigText) {
  window.addEventListener('scroll', () => {
    const rect = contactBigText.parentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      const progress = -rect.top / window.innerHeight;
      contactBigText.style.transform = `translateX(-50%) translateY(${progress * 30}px)`;
    }
  });
}

// ============================================
// ACTIVE NAV LINK HIGHLIGHT
// ============================================
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.style.opacity = '';
    link.style.fontWeight = '';
    const sectionId = link.getAttribute('data-section');
    if (sectionId === current) {
      link.style.opacity = '1';
      link.style.fontWeight = '700';
    }
  });
});
