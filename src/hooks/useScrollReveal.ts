import { useEffect } from 'react';

const REVEAL_SELECTOR = '[data-reveal]';
const EXPERIENCE_CHANGE_EVENT = 'veast:experiencechange';

function applyRevealDelay(element: HTMLElement) {
  const delay = Number.parseInt(element.dataset.delay ?? '0', 10);
  element.style.setProperty(
    '--reveal-delay',
    `${Number.isFinite(delay) ? Math.max(0, Math.min(delay, 300)) : 0}ms`,
  );
}

function isInsideRevealViewport(element: HTMLElement) {
  const rect = element.getBoundingClientRect();
  const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
  if (rect.height <= 0 || viewportHeight <= 0) return false;

  const revealBottom = viewportHeight * 0.9;
  const visibleHeight = Math.max(0, Math.min(rect.bottom, revealBottom) - Math.max(rect.top, 0));
  return visibleHeight / rect.height >= 0.08;
}

export function useScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    root.classList.add('motion-ready');

    let observer: IntersectionObserver | null = null;

    const reveal = (element: HTMLElement) => {
      element.dataset.revealed = 'true';
      element.classList.add('is-visible');
      observer?.unobserve(element);
    };

    const prepare = (element: HTMLElement) => {
      applyRevealDelay(element);

      if (reducedMotionQuery.matches || !observer) {
        reveal(element);
        return;
      }

      if (element.dataset.revealed === 'true' || isInsideRevealViewport(element)) {
        reveal(element);
        return;
      }

      observer.observe(element);
    };

    if ('IntersectionObserver' in window && !reducedMotionQuery.matches) {
      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting || entry.intersectionRatio < 0.08) continue;
            reveal(entry.target as HTMLElement);
          }
        },
        { rootMargin: '0px 0px -10% 0px', threshold: [0.08] },
      );
    }

    const scan = (scope: ParentNode | HTMLElement = document) => {
      if (scope instanceof HTMLElement && scope.matches(REVEAL_SELECTOR)) prepare(scope);
      scope.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach(prepare);
    };

    scan();

    const mutationObserver = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type !== 'childList') continue;
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) scan(node);
        });
      }
    });

    if (document.body) mutationObserver.observe(document.body, { childList: true, subtree: true });

    let refreshFrame = 0;
    const refresh = () => {
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => scan());
    };

    window.addEventListener(EXPERIENCE_CHANGE_EVENT, refresh);
    reducedMotionQuery.addEventListener('change', refresh);

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener(EXPERIENCE_CHANGE_EVENT, refresh);
      reducedMotionQuery.removeEventListener('change', refresh);
    };
  }, []);
}
