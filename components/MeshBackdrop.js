'use client';

import { useEffect, useRef } from 'react';

/**
 * The slow forest-green field behind the hero.
 *
 * Drawn as a metaball field on a 140x90 buffer and scaled up, which keeps it
 * cheap enough to animate on a phone. It drifts very slowly on purpose: the
 * brief asks for low cognitive load, so this should read as a still image that
 * happens to breathe, not as something demanding attention.
 *
 * Under prefers-reduced-motion it paints one frame and stops.
 */

const LOW = [10, 28, 20]; // --band
const HIGH = [74, 138, 74]; // the lit peaks

export default function MeshBackdrop() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const buffer = document.createElement('canvas');
    const bctx = buffer.getContext('2d');
    const BW = 140;
    const BH = 90;
    buffer.width = BW;
    buffer.height = BH;
    const image = bctx.createImageData(BW, BH);

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const blobs = [
      { x: 0.26, y: 0.36, r: 0.3, vx: 0.00016, vy: 0.00011 },
      { x: 0.72, y: 0.3, r: 0.26, vx: -0.00013, vy: 0.00015 },
      { x: 0.56, y: 0.74, r: 0.32, vx: 0.00011, vy: -0.00014 },
      { x: 0.88, y: 0.62, r: 0.22, vx: -0.00017, vy: -0.00009 },
    ];

    let frame = 0;

    const size = () => {
      canvas.width = canvas.clientWidth || 1;
      canvas.height = canvas.clientHeight || 1;
      ctx.imageSmoothingEnabled = true;
    };

    const paint = () => {
      const data = image.data;
      for (let y = 0; y < BH; y += 1) {
        for (let x = 0; x < BW; x += 1) {
          const nx = x / BW;
          const ny = y / BH;
          let f = 0;
          for (let i = 0; i < blobs.length; i += 1) {
            const b = blobs[i];
            const dx = nx - b.x;
            const dy = (ny - b.y) * 0.72;
            f += (b.r * b.r) / (dx * dx + dy * dy + 0.004);
          }
          f = Math.min(1, f * 0.16);
          const k = (y * BW + x) * 4;
          data[k] = LOW[0] + (HIGH[0] - LOW[0]) * f;
          data[k + 1] = LOW[1] + (HIGH[1] - LOW[1]) * f;
          data[k + 2] = LOW[2] + (HIGH[2] - LOW[2]) * f;
          data[k + 3] = 255;
        }
      }
      bctx.putImageData(image, 0, 0);
      ctx.drawImage(buffer, 0, 0, BW, BH, 0, 0, canvas.width, canvas.height);

      if (!reduce) {
        for (let i = 0; i < blobs.length; i += 1) {
          const b = blobs[i];
          b.x += b.vx;
          b.y += b.vy;
          if (b.x < 0.1 || b.x > 0.94) b.vx *= -1;
          if (b.y < 0.12 || b.y > 0.9) b.vy *= -1;
        }
        frame = requestAnimationFrame(paint);
      }
    };

    size();
    paint();

    // Resizing clears the canvas. When motion is reduced there is no loop to
    // redraw it, so repaint here.
    const observer = new ResizeObserver(() => {
      size();
      if (reduce) paint();
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={ref} className="hero__mesh" aria-hidden="true" />;
}
