/**
 * TPU Animations
 * Trailer Parts Unlimited custom animations and interactions
 */

/**
 * Scroll Progress Bar
 * Updates the progress bar width based on scroll position
 */
export function initScrollProgress() {
    const progressBar = document.querySelector('[data-tpu-scroll-progress]');
    if (!progressBar) return;

    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? scrollTop / docHeight : 0;
        progressBar.style.transform = `scaleX(${progress})`;
    }

    window.addEventListener('scroll', updateProgress, { passive: true });
    updateProgress();
}

/**
 * Sticky Header with Glass Effect
 * Adds scrolled class when page is scrolled
 */
export function initStickyHeader() {
    const header = document.querySelector('[data-tpu-header]');
    if (!header) return;

    const scrollThreshold = 50;

    function updateHeader() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('tpu-header--scrolled');
        } else {
            header.classList.remove('tpu-header--scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();
}

/**
 * Mobile Menu Toggle
 */
export function initMobileMenu() {
    const toggle = document.querySelector('[data-tpu-menu-toggle]');
    const mobileNav = document.querySelector('[data-tpu-mobile-nav]');
    const hamburger = document.querySelector('[data-tpu-hamburger]');

    if (!toggle || !mobileNav) return;

    toggle.addEventListener('click', () => {
        const isOpen = mobileNav.classList.toggle('tpu-mobile-nav--open');
        toggle.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        
        if (hamburger) {
            hamburger.classList.toggle('tpu-hamburger--open', isOpen);
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
}

/**
 * Search Overlay Toggle
 */
export function initSearchOverlay() {
    const toggles = document.querySelectorAll('[data-tpu-search-toggle]');
    const overlay = document.querySelector('[data-tpu-search-overlay]');
    const closeBtn = document.querySelector('[data-tpu-search-close]');
    const searchInput = document.querySelector('[data-tpu-search-input]');

    if (!overlay) return;

    function openSearch() {
        overlay.classList.add('tpu-search-overlay--open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        
        // Focus input after animation
        setTimeout(() => {
            if (searchInput) searchInput.focus();
        }, 300);
    }

    function closeSearch() {
        overlay.classList.remove('tpu-search-overlay--open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    toggles.forEach(toggle => {
        toggle.addEventListener('click', openSearch);
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', closeSearch);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('tpu-search-overlay--open')) {
            closeSearch();
        }
    });

    // Close on overlay background click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeSearch();
        }
    });
}

/**
 * Number Counter Animation
 * Animates numbers counting up when they enter viewport
 */
export function initNumberCounters() {
    const counters = document.querySelectorAll('[data-tpu-counter]');
    if (counters.length === 0) return;

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px',
    };

    const animateCounter = (element) => {
        const target = parseInt(element.dataset.target, 10);
        const ticker = element.querySelector('.tpu-number-ticker');
        if (!ticker || isNaN(target)) return;

        const duration = 2000;
        const steps = 60;
        const stepDuration = duration / steps;
        let current = 0;
        const increment = target / steps;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            ticker.textContent = Math.floor(current).toLocaleString();
        }, stepDuration);
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

/**
 * Bento Card Spotlight Effect
 * Creates a mouse-following gradient on bento cards
 */
export function initBentoSpotlight() {
    const cards = document.querySelectorAll('.tpu-bento__card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            card.style.setProperty('--mouse-x', `${x}%`);
            card.style.setProperty('--mouse-y', `${y}%`);
        });
    });
}

/**
 * Fade In on Scroll Animation
 * Adds fade-in animation to elements as they enter viewport
 */
export function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('[data-tpu-animate]');
    if (animatedElements.length === 0) return;

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const animationType = entry.target.dataset.tpuAnimate || 'fade-in-up';
                entry.target.classList.add(`tpu-animate-${animationType}`);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });
}

/**
 * Pause Marquee on Hover
 * Already handled via CSS, but this adds keyboard accessibility
 */
export function initMarqueeAccessibility() {
    const marquees = document.querySelectorAll('.tpu-marquee__track');

    marquees.forEach(marquee => {
        // Pause on focus within
        marquee.addEventListener('focusin', () => {
            marquee.style.animationPlayState = 'paused';
        });

        marquee.addEventListener('focusout', () => {
            marquee.style.animationPlayState = 'running';
        });
    });
}

/**
 * Initialize All TPU Animations
 */
export function initTPUAnimations() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
}

function init() {
    initScrollProgress();
    initStickyHeader();
    initMobileMenu();
    initSearchOverlay();
    initNumberCounters();
    initBentoSpotlight();
    initScrollAnimations();
    initMarqueeAccessibility();
}

export default {
    initTPUAnimations,
    initScrollProgress,
    initStickyHeader,
    initMobileMenu,
    initSearchOverlay,
    initNumberCounters,
    initBentoSpotlight,
    initScrollAnimations,
    initMarqueeAccessibility,
};

