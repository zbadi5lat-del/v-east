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
    let observer: IntersectionObserver | null = null;
    let refreshFrame = 0;

    const reveal = (element: HTMLElement) => {
      element.dataset.revealed = 'true';
      element.classList.remove('reveal-pending');
      element.classList.add('is-visible');
      observer?.unobserve(element);
    };

    const prepare = (element: HTMLElement) => {
      applyRevealDelay(element);

      if (
        reducedMotionQuery.matches ||
        !observer ||
        root.dataset.experienceSwitching === 'true' ||
        element.dataset.revealed === 'true' ||
        isInsideRevealViewport(element)
      ) {
        reveal(element);
        return;
      }

      element.classList.add('reveal-pending');
      element.classList.remove('is-visible');
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

    // Prepare unseen offscreen content first, then enable motion CSS.
    // This means content is visible by default and can never disappear merely
    // because React replaced a node during an AR/EN or Dark/Light switch.
    scan();
    root.classList.add('motion-ready');

    const refresh = () => {
      window.cancelAnimationFrame(refreshFrame);
      refreshFrame = window.requestAnimationFrame(() => scan());
    };

    const mutationObserver = new MutationObserver((mutations) => {
      if (!mutations.some((mutation) => mutation.type === 'childList' && mutation.addedNodes.length > 0)) return;
      refresh();
    });

    if (document.body) mutationObserver.observe(document.body, { childList: true, subtree: true });

    window.addEventListener(EXPERIENCE_CHANGE_EVENT, refresh);
    reducedMotionQuery.addEventListener('change', refresh);

    return () => {
      observer?.disconnect();
      mutationObserver.disconnect();
      window.cancelAnimationFrame(refreshFrame);
      window.removeEventListener(EXPERIENCE_CHANGE_EVENT, refresh);
      reducedMotionQuery.removeEventListener('change', refresh);
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((element) => {
        element.classList.remove('reveal-pending');
      });
    };
  }, []);
}
