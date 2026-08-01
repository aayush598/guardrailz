'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      autoRaf: true,
    });

    (window as unknown as { lenis?: Lenis }).lenis = lenis;

    // Intercept in-page anchor clicks so they smooth-scroll through Lenis
    // instead of letting the browser do an instant jump.
    const onClick = (event: MouseEvent) => {
      const link = (event.target as HTMLElement)?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!link) return;

      const targetUrl = new URL(link.href);
      const currentUrl = new URL(window.location.href);

      if (
        targetUrl.host === currentUrl.host &&
        targetUrl.pathname === currentUrl.pathname &&
        targetUrl.hash &&
        document.getElementById(decodeURIComponent(targetUrl.hash.slice(1)))
      ) {
        event.preventDefault();
        lenis.scrollTo(targetUrl.hash);
      }
    };
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('click', onClick);
      lenis.destroy();
      delete (window as unknown as { lenis?: Lenis }).lenis;
    };
  }, []);

  return null;
}
