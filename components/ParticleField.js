'use client';

import { useEffect, useRef } from 'react';

/**
 * The constellation field behind the light body of every page.
 *
 * NOTE the class name. This was `.field` and collided with the form-field class
 * of the same name, which handed every input group `position: fixed`, `inset: 0`
 * and `pointer-events: none`. Both forms on the site were unusable. Keep this
 * name distinct.
 *
 * Slow-drifting points that link to their neighbours, plus lines drawn from the
 * cursor to the points near it. Fixed to the viewport and sitting at z-index 0,
 * so every opaque band on the site paints over it: it never appears behind a
 * hero, the closing band, the header or the footer, which already carry the
 * animated mesh and would fight with it.
 *
 * Tuned down from the usual version of this effect, because the brief asks for
 * low cognitive load: low density, slow drift, thin lines, and dots in the
 * muted ink rather than the accent. Only the cursor links use the accent, so
 * the one thing that moves quickly is the thing the reader is causing.
 */

const INK = '77, 87, 71'; // --text-dim
const ACCENT = '168, 72, 12'; // --accent

const LINK_DIST = 132; // particle to particle
const GRAB_DIST = 190; // cursor to particle
const DENSITY = 26000; // one point per this many square px

export default function ParticleField() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const g = canvas.getContext('2d');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let points = [];
    let frame = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999, active: false };

    const build = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);

      const target = Math.min(90, Math.max(24, Math.round((w * h) / DENSITY)));
      points = Array.from({ length: target }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 1.3 + Math.random() * 1.5,
      }));
    };

    const draw = () => {
      g.clearRect(0, 0, w, h);

      for (let i = 0; i < points.length; i += 1) {
        const p = points[i];

        if (!reduce) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < -20) p.x = w + 20;
          if (p.x > w + 20) p.x = -20;
          if (p.y < -20) p.y = h + 20;
          if (p.y > h + 20) p.y = -20;
        }

        // neighbour links
        for (let j = i + 1; j < points.length; j += 1) {
          const q = points[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d = Math.hypot(dx, dy);
          if (d < LINK_DIST) {
            g.strokeStyle = `rgba(${INK}, ${(1 - d / LINK_DIST) * 0.22})`;
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(q.x, q.y);
            g.stroke();
          }
        }

        // the cursor reaches for whatever is near it
        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d = Math.hypot(dx, dy);
          if (d < GRAB_DIST) {
            const strength = 1 - d / GRAB_DIST;
            g.strokeStyle = `rgba(${ACCENT}, ${strength * 0.5})`;
            g.lineWidth = 1.1;
            g.beginPath();
            g.moveTo(p.x, p.y);
            g.lineTo(pointer.x, pointer.y);
            g.stroke();
          }
        }

        g.fillStyle = `rgba(${INK}, 0.42)`;
        g.beginPath();
        g.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        g.fill();
      }

      if (!reduce && !document.hidden) frame = requestAnimationFrame(draw);
    };

    const start = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(draw);
    };

    const onMove = (e) => {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      pointer.active = true;
    };
    const onLeave = () => {
      pointer.active = false;
    };
    const onResize = () => {
      build();
      draw();
    };
    // rAF is suspended in a background tab, so restart the loop on return
    const onVisibility = () => {
      if (!document.hidden && !reduce) start();
    };

    build();
    draw();
    if (!reduce && !document.hidden) start();

    window.addEventListener('resize', onResize);
    document.addEventListener('visibilitychange', onVisibility);
    if (fine) {
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerleave', onLeave);
    }

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} className="constellation" aria-hidden="true" />;
}
