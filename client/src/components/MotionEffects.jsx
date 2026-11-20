import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function revealAll() {
  document.querySelectorAll('[data-reveal]:not(.is-revealed)').forEach((el) => {
    el.classList.add('is-revealed');
  });
}

export default function MotionEffects() {
  const location = useLocation();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('page-enter');
    void root.offsetWidth;
    root.classList.add('page-enter');

    if (prefersReducedMotion()) {
      window.scrollTo(0, 0);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.style.scrollPaddingTop = '4.5rem';

    if (prefersReducedMotion()) {
      revealAll();
      return undefined;
    }

    const observed = new WeakSet();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-revealed');
          io.unobserve(entry.target);
        });
      },
      { threshold: 0.02, rootMargin: '0px 0px -2% 0px' }
    );

    const scan = () => {
      document.querySelectorAll('[data-reveal]').forEach((node, index) => {
        if (!(node instanceof Element) || observed.has(node) || node.classList.contains('is-revealed')) {
          return;
        }
        observed.add(node);
        node.style.setProperty('--reveal-delay', `${Math.min(index % 6, 5) * 30}ms`);
        io.observe(node);
      });
    };

    scan();

    // Keep watching for async-mounted cards (home "More movies", filters, etc.)
    const mo = new MutationObserver(() => scan());
    mo.observe(document.body, { childList: true, subtree: true });

    // Hard failsafe so content never stays invisible
    const failsafe = window.setTimeout(revealAll, 2500);

    return () => {
      io.disconnect();
      mo.disconnect();
      window.clearTimeout(failsafe);
    };
  }, [location.pathname, location.search]);

  return null;
}
