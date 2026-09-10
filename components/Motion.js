'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * The site's motion layer.
 *
 * Three rules shape everything here.
 *
 * 1. The element's resting state in the HTML is already its finished state, and
 *    nothing is hidden in CSS. If JavaScript never runs, or fails, the page
 *    renders complete and readable.
 *
 *    `fromTo` rather than `from`, with explicit end values: `from` reads its end
 *    value off the element when the tween is created, so a re-run (React
 *    StrictMode mounts effects twice in development) can read a half-faded value
 *    and latch it, leaving things permanently semi-transparent.
 *
 * 2. Nothing animates in a hidden tab. requestAnimationFrame is suspended in
 *    background tabs, so a tween started there freezes at opacity 0 and the
 *    reader switches over to a blank hero. We wait for visibility instead.
 *
 * 3. Everything sits inside `gsap.matchMedia()` keyed to
 *    prefers-reduced-motion: no-preference, so a reader who asks for reduced
 *    motion gets a still page, and it reverts cleanly if they change the setting
 *    mid-visit.
 *
 * Deliberately absent: parallax, pinning, scroll-jacking, counters, and anything
 * that moves on its own. The brief asks for low cognitive load, and the
 * direction document bans all of the above by name.
 */
export default function Motion() {
  const pathname = usePathname();

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let stopWaiting = null;

      const play = () => {
        // ---- hero: one orchestrated entrance, on arrival ----
        const heroItems = gsap.utils.toArray('[data-anim="hero"]');
        if (heroItems.length) {
          gsap.fromTo(
            heroItems,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.75,
              ease: 'power2.out',
              stagger: 0.09,
              clearProps: 'transform,opacity',
            }
          );
        }

        // ---- sections: a small rise as each one arrives, once ----
        gsap.utils.toArray('[data-anim="reveal"]').forEach((el) => {
          gsap.fromTo(
            el,
            { y: 16, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: 'power2.out',
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            }
          );
        });

        /* ---- the three doors fold down like calendar pages ----
           Hinged on the top edge, where the binding holes are, so the motion
           and the card's construction are telling the same story. A little
           overshoot at the end reads as weight, not as bounce. */
        gsap.utils.toArray('[data-anim="fold"]').forEach((group) => {
          gsap.fromTo(
            group.children,
            { rotateX: -88, opacity: 0, transformOrigin: 'top center' },
            {
              rotateX: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'back.out(1.15)',
              stagger: 0.13,
              transformPerspective: 900,
              clearProps: 'all',
              scrollTrigger: { trigger: group, start: 'top 88%', once: true },
            }
          );
        });

        // ---- grouped items: stagger, so the eye is led along the row ----
        gsap.utils.toArray('[data-anim="stagger"]').forEach((group) => {
          gsap.fromTo(
            group.children,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.55,
              ease: 'power2.out',
              stagger: 0.07,
              clearProps: 'transform,opacity',
              scrollTrigger: { trigger: group, start: 'top 88%', once: true },
            }
          );
        });
      };

      if (document.visibilityState === 'visible') {
        play();
      } else {
        const onVisible = () => {
          if (document.visibilityState !== 'visible') return;
          document.removeEventListener('visibilitychange', onVisible);
          stopWaiting = null;
          play();
        };
        document.addEventListener('visibilitychange', onVisible);
        stopWaiting = () => document.removeEventListener('visibilitychange', onVisible);
      }

      return () => {
        if (stopWaiting) stopWaiting();
        ScrollTrigger.getAll().forEach((t) => t.kill());
      };
    });

    // Fonts and the hero canvas settle after first paint; recalculate then.
    const settle = window.setTimeout(() => ScrollTrigger.refresh(), 400);

    return () => {
      window.clearTimeout(settle);
      mm.revert();
    };
  }, [pathname]);

  return null;
}
