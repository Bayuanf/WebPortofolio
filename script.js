/**
 * Portfolio Interaction Scripts
 * Bayu Ahmad Nurfaizi — Dark Monochrome Chrome Edition
 */

(() => {
  'use strict';

  // DOM Elements
  const navbar = document.getElementById('navbar');
  const navMenu = document.getElementById('navMenu');
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('currentYear');
  const reveals = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Set Dynamic Current Year
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }

  // 2. Navbar Scrolled State
  const handleScroll = () => {
    if (window.scrollY > 24) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // initialize on load

  // 3. Mobile Menu Toggle
  if (menuToggle && navMenu) {
    const toggleMenu = (open) => {
      const isOpen = typeof open === 'boolean' ? open : !navMenu.classList.contains('open');
      navMenu.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
    };

    menuToggle.addEventListener('click', () => toggleMenu());

    // Close menu when clicking on any nav link
    navLinks.forEach((link) => {
      link.addEventListener('click', () => toggleMenu(false));
    });

    // Close menu with ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });
  }

  // 4. Scroll Reveal via IntersectionObserver
  if ('IntersectionObserver' in window && !reduceMotion) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: '0px 0px 40px 0px',
      }
    );

    reveals.forEach((el) => {
      // If already in initial viewport, reveal immediately
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('in-view');
      } else {
        revealObserver.observe(el);
      }
    });
  } else {
    // Fallback: make everything immediately visible
    reveals.forEach((el) => el.classList.add('in-view'));
  }

  // 5. Active Navigation Link Scroll Spy
  const sections = document.querySelectorAll('section[id]');
  if ('IntersectionObserver' in window) {
    const spyObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute('id');
            navLinks.forEach((link) => {
              if (link.getAttribute('href') === `#${currentId}`) {
                link.classList.add('active');
              } else {
                link.classList.remove('active');
              }
            });
          }
        });
      },
      {
        rootMargin: '-30% 0px -60% 0px',
      }
    );

    sections.forEach((section) => spyObserver.observe(section));
  }

  // 6. Image Lightbox Feature
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxImage = document.getElementById('lightboxImage');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxOverlay = document.getElementById('lightboxOverlay');
  const lightboxTriggers = document.querySelectorAll('.lightbox-trigger');

  if (lightboxModal && lightboxImage) {
    const openLightbox = (src, caption) => {
      lightboxImage.src = src;
      lightboxImage.alt = caption || 'Pratinjau Screenshot Proyek';
      if (lightboxCaption) {
        lightboxCaption.textContent = caption || '';
      }
      lightboxModal.classList.add('active');
      lightboxModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightboxModal.classList.remove('active');
      lightboxModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      setTimeout(() => {
        if (!lightboxModal.classList.contains('active')) {
          lightboxImage.src = '';
        }
      }, 300);
    };

    lightboxTriggers.forEach((trigger) => {
      trigger.addEventListener('click', (e) => {
        if (e.target.closest('a')) return;
        const src = trigger.getAttribute('data-lightbox');
        const caption = trigger.getAttribute('data-caption');
        if (src) {
          openLightbox(src, caption);
        }
      });
    });

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
    if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightboxModal.classList.contains('active')) {
        closeLightbox();
      }
    });
  }
})();
