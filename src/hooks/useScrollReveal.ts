import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';

export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('motion-ready');

    const elements = Array.from(document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR));
    elements.forEach((element) => {
      const delay = Number.parseInt(element.dataset.delay ?? '0', 10);
      element.style.setProperty('--reveal-delay', `${Number.isFinite(delay) ? Math.max(0, Math.min(delay, 300)) : 0}ms`);
    });
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);
}
