/* ============================================
   FitForge Elite — Premium JavaScript
   ============================================ */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     1. PRELOADER
     ───────────────────────────────────────────── */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      // Trigger hero animations after preloader hides
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 120);
      });
    }, 800);
  });

  /* ─────────────────────────────────────────────
     2. SCROLL PROGRESS BAR
     ───────────────────────────────────────────── */
  const scrollProgress = document.getElementById('scroll-progress');

  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';
  }

  /* ─────────────────────────────────────────────
     3. HEADER SCROLL EFFECT
     ───────────────────────────────────────────── */
  const header = document.getElementById('header');
  let lastScrollY = 0;

  function updateHeader() {
    const scrollY = window.scrollY;
    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    lastScrollY = scrollY;
  }

  /* ─────────────────────────────────────────────
     4. MOBILE NAVIGATION
     ───────────────────────────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    hamburger.setAttribute(
      'aria-expanded',
      hamburger.classList.contains('active')
    );
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ─────────────────────────────────────────────
     5. ACTIVE NAV LINK HIGHLIGHT
     ───────────────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = navLinks.querySelectorAll('a');

  function updateActiveNav() {
    const scrollY = window.scrollY + 200;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollY >= top && scrollY < top + height) {
        navAnchors.forEach((a) => a.classList.remove('active'));
        const active = navLinks.querySelector(`a[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }

  /* ─────────────────────────────────────────────
     6. DARK / LIGHT THEME TOGGLE
     ───────────────────────────────────────────── */
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;

  // Check saved preference
  const savedTheme = localStorage.getItem('fitforge-theme') || 'dark';
  html.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'dark' ? '🌙' : '☀️';

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    themeToggle.textContent = next === 'dark' ? '🌙' : '☀️';
    localStorage.setItem('fitforge-theme', next);
  });

  /* ─────────────────────────────────────────────
     7. SCROLL-TRIGGERED REVEAL ANIMATIONS
     ───────────────────────────────────────────── */
  const revealElements = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => {
    // Don't observe hero reveals, those are triggered after preloader
    if (!el.closest('.hero')) {
      revealObserver.observe(el);
    }
  });

  /* ─────────────────────────────────────────────
     8. ANIMATED COUNTERS
     ───────────────────────────────────────────── */
  const countUpElements = document.querySelectorAll('.count-up');
  const countedSet = new Set();

  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !countedSet.has(entry.target)) {
          countedSet.add(entry.target);
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  countUpElements.forEach((el) => counterObserver.observe(el));

  function animateCounter(element) {
    const target = parseFloat(element.dataset.target);
    const decimals = parseInt(element.dataset.decimals) || 0;
    const duration = 2000;
    const startTime = performance.now();

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutCubic(progress);
      const current = easedProgress * target;

      element.textContent = decimals > 0
        ? current.toFixed(decimals)
        : Math.floor(current);

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        element.textContent = decimals > 0
          ? target.toFixed(decimals)
          : target;
      }
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     9. TESTIMONIAL CAROUSEL
     ───────────────────────────────────────────── */
  const testimonialTrack = document.getElementById('testimonial-track');
  const carouselPrev = document.getElementById('carousel-prev');
  const carouselNext = document.getElementById('carousel-next');
  const carouselDotsContainer = document.getElementById('carousel-dots');
  const carouselDots = carouselDotsContainer.querySelectorAll('.carousel-dot');
  let currentSlide = 0;
  const totalSlides = testimonialTrack.children.length;
  let autoPlayInterval;

  function goToSlide(index) {
    currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
    testimonialTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    carouselDots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  carouselPrev.addEventListener('click', () => {
    goToSlide(currentSlide - 1);
    resetAutoPlay();
  });
  carouselNext.addEventListener('click', () => {
    goToSlide(currentSlide + 1);
    resetAutoPlay();
  });
  carouselDots.forEach((dot) => {
    dot.addEventListener('click', () => {
      goToSlide(parseInt(dot.dataset.index));
      resetAutoPlay();
    });
  });

  function startAutoPlay() {
    autoPlayInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
  }
  function resetAutoPlay() {
    clearInterval(autoPlayInterval);
    startAutoPlay();
  }
  startAutoPlay();

  /* ─────────────────────────────────────────────
     10. BMI CALCULATOR
     ───────────────────────────────────────────── */
  const bmiCalculateBtn = document.getElementById('bmi-calculate');
  const bmiHeightInput = document.getElementById('bmi-height');
  const bmiWeightInput = document.getElementById('bmi-weight');
  const bmiValueEl = document.getElementById('bmi-value');
  const bmiCategoryEl = document.getElementById('bmi-category');
  const bmiRecommendationEl = document.getElementById('bmi-recommendation');

  bmiCalculateBtn.addEventListener('click', () => {
    const height = parseFloat(bmiHeightInput.value);
    const weight = parseFloat(bmiWeightInput.value);

    if (!height || !weight || height < 100 || height > 250 || weight < 30 || weight > 300) {
      bmiValueEl.textContent = '—';
      bmiCategoryEl.textContent = 'Invalid input';
      bmiCategoryEl.style.color = '#ff6b6b';
      bmiRecommendationEl.textContent = 'Please enter a valid height (100-250 cm) and weight (30-300 kg).';
      return;
    }

    const heightM = height / 100;
    const bmi = weight / (heightM * heightM);
    const bmiRounded = bmi.toFixed(1);

    // Animate the BMI value
    animateBMIValue(parseFloat(bmiRounded));

    let category, color, recommendation;

    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'var(--neon-blue)';
      recommendation = 'You\'re below the healthy weight range. Focus on strength training and calorie-dense, nutritious meals. Our Muscle Building Program can help you gain healthy weight.';
    } else if (bmi < 24.9) {
      category = 'Normal Weight';
      color = 'var(--neon-green)';
      recommendation = 'Excellent! You\'re in the healthy range. Maintain your fitness with a balanced program. Our Pro membership gives you tools to stay on track.';
    } else if (bmi < 29.9) {
      category = 'Overweight';
      color = '#fbbf24';
      recommendation = 'You\'re above the ideal range. A combination of cardio and strength training can help. Our Fat Loss Program is designed specifically for your situation.';
    } else {
      category = 'Obese';
      color = '#ff6b6b';
      recommendation = 'We recommend starting with low-impact exercises and nutrition coaching. Our personalized programs can help you start safely and build up over time.';
    }

    bmiCategoryEl.textContent = category;
    bmiCategoryEl.style.color = color;
    bmiRecommendationEl.textContent = recommendation;
  });

  function animateBMIValue(target) {
    const duration = 1200;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      bmiValueEl.textContent = (eased * target).toFixed(1);
      if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  }

  /* ─────────────────────────────────────────────
     11. CONTACT FORM
     ───────────────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const submitBtn = document.getElementById('contact-submit');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
      submitBtn.textContent = '✓ Message Sent!';
      submitBtn.style.background = 'var(--neon-green)';
      submitBtn.style.color = 'var(--text-dark)';

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.style.background = '';
        submitBtn.style.color = '';
        submitBtn.disabled = false;
        contactForm.reset();
      }, 3000);
    }, 1500);
  });

  /* ─────────────────────────────────────────────
     12. FLOATING ACTION BUTTON (Scroll to Top)
     ───────────────────────────────────────────── */
  const fab = document.getElementById('fab-top');

  function updateFab() {
    if (window.scrollY > 600) {
      fab.classList.add('visible');
    } else {
      fab.classList.remove('visible');
    }
  }

  fab.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ─────────────────────────────────────────────
     13. PARALLAX ELEMENTS
     ───────────────────────────────────────────── */
  const parallaxElements = document.querySelectorAll('.parallax-element');

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.dataset.speed) || 0.05;
      const y = scrollY * speed;
      el.style.transform = `translate3d(0, ${y}px, 0)`;
    });
  }

  /* ─────────────────────────────────────────────
     14. SMOOTH SCROLL FOR ANCHOR LINKS
     ───────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ─────────────────────────────────────────────
     15. OPTIMIZED SCROLL HANDLER (rAF throttled)
     ───────────────────────────────────────────── */
  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateScrollProgress();
        updateHeader();
        updateActiveNav();
        updateFab();
        updateParallax();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Initial calls
  updateScrollProgress();
  updateHeader();
  updateFab();

  /* ─────────────────────────────────────────────
     16. INTERACTIVE HOVER EFFECTS (Tilt Cards)
     ───────────────────────────────────────────── */
  const tiltCards = document.querySelectorAll('.feature-card, .pricing-card');

  tiltCards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -4;
      const rotateY = ((x - centerX) / centerX) * 4;

      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────
     17. MAGNETIC BUTTONS
     ───────────────────────────────────────────── */
  const magneticBtns = document.querySelectorAll('.btn-primary');

  magneticBtns.forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-2px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  /* ─────────────────────────────────────────────
     18. KEYBOARD ACCESSIBILITY
     ───────────────────────────────────────────── */
  document.addEventListener('keydown', (e) => {
    // ESC closes mobile nav
    if (e.key === 'Escape') {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

})();
