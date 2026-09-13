/**
 * Archtech Architecture Firm - Master Script
 * Main interactions: Header sticky behavior, Mobile menu drawer,
 * Active link indicator, Scroll to top, FAQ Accordions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initActiveNavLink();
  initScrollToTop();
  initFaqAccordion();
});

/**
 * 1. Sticky Header with Scroll Detection
 */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/**
 * 2. Mobile Off-Canvas Menu Drawer
 */
function initMobileMenu() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const drawer = document.querySelector('.mobile-nav-drawer');
  if (!toggleBtn || !drawer) return;

  const toggleMenu = () => {
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
    toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  };

  toggleBtn.addEventListener('click', toggleMenu);

  // Close when clicking any nav link inside drawer
  const mobileLinks = drawer.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      drawer.classList.remove('open');
      toggleBtn.classList.remove('active');
      document.body.style.overflow = '';
      toggleBtn.setAttribute('aria-expanded', 'false');
    });
  });

  // Close with Esc key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      toggleMenu();
    }
  });
}

/**
 * 3. Active Link Indicator based on current page URL
 */
function initActiveNavLink() {
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * 4. Scroll to Top Floating Button
 */
function initScrollToTop() {
  const scrollBtn = document.querySelector('.scroll-to-top');
  if (!scrollBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }, { passive: true });

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 5. Architectural FAQ Accordion
 */
function initFaqAccordion() {
  const faqHeaders = document.querySelectorAll('.faq-header');
  if (!faqHeaders.length) return;

  faqHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const parentItem = header.closest('.faq-item');
      const body = parentItem.querySelector('.faq-body');
      const isActive = parentItem.classList.contains('active');

      // Close all other items in same group
      const allItems = header.closest('.faq-accordion-group').querySelectorAll('.faq-item');
      allItems.forEach(item => {
        item.classList.remove('active');
        const b = item.querySelector('.faq-body');
        if (b) b.style.maxHeight = null;
      });

      if (!isActive) {
        parentItem.classList.add('active');
        body.style.maxHeight = body.scrollHeight + 'px';
      }
    });
  });
}
