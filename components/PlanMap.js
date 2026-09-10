'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

/**
 * The plan map: a participant at the hub with their supports around them.
 *
 * It is illustrative, not live data. That matters, so the panel around it is
 * captioned "What a coordinated plan looks like" rather than anything that
 * could read as a real person's file.
 *
 * Orbits and rings are both true circles. Labels are pushed apart vertically
 * per side so two supports drifting to the same angle never overprint, and a
 * label that would run past the panel edge flips to the node's inner side.
 */

const RINGS = [0.17, 0.265, 0.355];

const NODES = [
  { label: 'Occupational therapy', ring: 1, angle: 0.2, speed: 0.00042, filled: true },
  { label: 'Support workers', ring: 1, angle: 1.55, speed: 0.00036, filled: true },
  { label: 'Physiotherapy', ring: 1, angle: 2.9, speed: 0.0004, filled: true },
  { label: 'Plan manager', ring: 1, angle: 4.35, speed: 0.00034, filled: true },
  { label: 'GP', ring: 1, angle: 5.6, speed: 0.00038, filled: true },
  { label: 'Psychology', ring: 2, angle: 0.8, speed: -0.00026, filled: true },
  { label: 'Transport', ring: 2, angle: 1.95, speed: -0.00024, filled: true },
  { label: 'Day program', ring: 2, angle: 3.1, speed: -0.00028, filled: true },
  { label: 'Speech', ring: 2, angle: 4.2, speed: -0.00025, filled: true },
  { label: 'Dietetics', ring: 2, angle: 5.3, speed: -0.00027, filled: true },
  { label: 'Podiatry', ring: 2, angle: 6.05, speed: -0.00023, filled: true },
  { label: 'Assistive tech', ring: 3, angle: 1.2, speed: 0.00019, filled: false },
  { label: 'Housing', ring: 3, angle: 3.6, speed: 0.00021, filled: false },
  { label: 'Respite', ring: 3, angle: 5.1, speed: 0.00018, filled: true },
];

const COLOURS = {
  text: '#EDF3EC',
  dim: '#9AB09C',
  accent: '#F2A950',
  waiting: '#F2C877',
};

/** Push labels apart on one side so none of them overprint. */
function declutter(list, top, bottom, gap) {
  if (!list.length) return;
  list.sort((a, b) => a.labelY - b.labelY);
  for (let i = 1; i < list.length; i += 1) {
    if (list[i].labelY - list[i - 1].labelY < gap) {
      list[i].labelY = list[i - 1].labelY + gap;
    }
  }
  const over = list[list.length - 1].labelY - bottom;
  if (over > 0) list.forEach((p) => { p.labelY -= over; });
  const under = top - list[0].labelY;
  if (under > 0) list.forEach((p) => { p.labelY += under; });
}

export default function PlanMap() {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const g = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let frame = 0;

    /* The plan assembles itself once, on arrival: rings open, the supports
       travel out from the participant, then the labels arrive. It is the one
       showy moment on the site, and it earns its place because it is literally
       the thing the business does. Reduced motion skips straight to the end. */
    /* Same visibility rule as the rest of the motion layer: in a background
       tab the assembly would freeze half-drawn, so start it fully assembled
       and only animate for a reader who is present to watch it. */
    const canAnimate = !reduce && document.visibilityState === 'visible';
    const intro = { p: canAnimate ? 0 : 1 };
    let introTween = null;

    /* Play the assembly when the map is actually on screen, not when it
       mounts. The map used to live in the hero, where those were the same
       moment. It now sits most of a screen further down, and starting the
       tween on mount meant the one showy moment on the site had finished
       before anybody scrolled far enough to watch it. */
    const startIntro = () => {
      if (introTween || !canAnimate) return;
      introTween = gsap.to(intro, { p: 1, duration: 1.5, ease: 'power3.out', delay: 0.15 });
    };

    let seen = null;
    if (canAnimate && typeof IntersectionObserver === 'function') {
      seen = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          seen.disconnect();
          seen = null;
          startIntro();
        },
        { threshold: 0.25 }
      );
      seen.observe(canvas);
    } else {
      startIntro();
    }

    const fit = () => {
      canvas.width = (canvas.clientWidth || 1) * dpr;
      canvas.height = (canvas.clientHeight || 1) * dpr;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now) => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const cx = w / 2;
      const cy = h / 2;
      const base = Math.min(w, h);
      const fs = w < 420 ? 10 : 11.5;

      g.clearRect(0, 0, w, h);

      // a soft well beneath the plot, so it lifts off the moving mesh
      const vignette = g.createRadialGradient(cx, cy, base * 0.04, cx, cy, base * 0.46);
      vignette.addColorStop(0, 'rgba(0,0,0,0.30)');
      vignette.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = vignette;
      g.beginPath();
      g.arc(cx, cy, base * 0.46, 0, Math.PI * 2);
      g.fill();

      const p = intro.p;

      g.lineWidth = 1.15;
      RINGS.forEach((f, i) => {
        // each ring opens slightly after the one inside it
        const ringP = gsap.utils.clamp(0, 1, (p - i * 0.12) / 0.6);
        if (ringP <= 0) return;
        g.strokeStyle = COLOURS.dim;
        g.globalAlpha = (0.42 - i * 0.07) * ringP;
        g.beginPath();
        g.arc(cx, cy, base * f * ringP, 0, Math.PI * 2);
        g.stroke();
      });
      g.globalAlpha = 1;

      g.font = `500 ${fs}px var(--font-outfit), sans-serif`;

      const elapsed = reduce ? 0 : now - start;
      const points = NODES.map((n) => {
        const angle = n.angle + (reduce ? 0 : elapsed * n.speed);
        // supports travel outward from the participant as the plan comes together
        const travel = gsap.utils.clamp(0, 1, (p - 0.12 - (n.ring - 1) * 0.14) / 0.62);
        const r = base * RINGS[n.ring - 1] * travel;
        const x = cx + Math.cos(angle) * r;
        const y = cy + Math.sin(angle) * r;
        return { x, y, labelY: y, node: n, right: x >= cx, in: travel };
      });

      points.forEach((p) => {
        const tw = g.measureText(p.node.label).width;
        if (p.right && p.x + 11 + tw > w - 4) p.right = false;
        else if (!p.right && p.x - 11 - tw < 4) p.right = true;
      });

      declutter(points.filter((p) => p.right), fs + 4, h - 6, fs + 4);
      declutter(points.filter((p) => !p.right), fs + 4, h - 6, fs + 4);

      points.forEach((p) => {
        g.beginPath();
        g.moveTo(cx, cy);
        g.lineTo(p.x, p.y);
        if (p.node.filled) {
          g.strokeStyle = COLOURS.dim;
          g.globalAlpha = 0.46 * p.in;
          g.setLineDash([]);
          g.lineWidth = 1;
        } else {
          g.strokeStyle = COLOURS.waiting;
          g.globalAlpha = 0.95 * p.in;
          g.setLineDash([3, 4]);
          g.lineWidth = 1.3;
        }
        g.stroke();
        g.setLineDash([]);
        g.globalAlpha = 1;
      });

      g.fillStyle = COLOURS.accent;
      g.beginPath();
      g.arc(cx, cy, 8.5, 0, Math.PI * 2);
      g.fill();
      g.strokeStyle = COLOURS.accent;
      g.globalAlpha = 0.45;
      g.lineWidth = 1.2;
      g.beginPath();
      g.arc(cx, cy, 16, 0, Math.PI * 2);
      g.stroke();
      g.globalAlpha = 1;

      const labelP = gsap.utils.clamp(0, 1, (p - 0.62) / 0.38);

      g.lineJoin = 'round';
      points.forEach((p) => {
        const waiting = !p.node.filled;
        const colour = waiting ? COLOURS.waiting : COLOURS.accent;
        const lx = p.x + (p.right ? 11 : -11);

        if (Math.abs(p.labelY - p.y) > 2) {
          g.strokeStyle = COLOURS.dim;
          g.globalAlpha = 0.4;
          g.lineWidth = 1;
          g.beginPath();
          g.moveTo(p.x + (p.right ? 5 : -5), p.y);
          g.lineTo(lx - (p.right ? 3 : -3), p.labelY);
          g.stroke();
          g.globalAlpha = 1;
        }

        g.globalAlpha = p.in;
        // dark halo, so a node stays legible over any part of the mesh
        g.strokeStyle = 'rgba(0,0,0,0.45)';
        g.lineWidth = 2.4;
        g.beginPath();
        g.arc(p.x, p.y, waiting ? 5.4 : 4.4, 0, Math.PI * 2);
        g.stroke();
        g.fillStyle = colour;
        g.beginPath();
        g.arc(p.x, p.y, waiting ? 5.4 : 4.4, 0, Math.PI * 2);
        g.fill();
        if (waiting) {
          g.strokeStyle = COLOURS.waiting;
          g.globalAlpha = 0.38;
          g.lineWidth = 1.4;
          g.beginPath();
          g.arc(p.x, p.y, 11, 0, Math.PI * 2);
          g.stroke();
          g.globalAlpha = 1;
        }

        g.globalAlpha = labelP;
        g.textAlign = p.right ? 'left' : 'right';
        g.lineWidth = 3;
        g.strokeStyle = 'rgba(0,0,0,0.55)';
        g.strokeText(p.node.label, lx, p.labelY + fs * 0.35);
        g.fillStyle = waiting ? COLOURS.waiting : COLOURS.text;
        g.fillText(p.node.label, lx, p.labelY + fs * 0.35);
        g.textAlign = 'left';
        g.globalAlpha = 1;
      });

      if (!reduce) frame = requestAnimationFrame(draw);
    };

    fit();
    frame = requestAnimationFrame(draw);

    const observer = new ResizeObserver(() => {
      fit();
      if (reduce) draw(performance.now());
    });
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      if (seen) seen.disconnect();
      if (introTween) introTween.kill();
    };
  }, []);

  return (
    <canvas
      ref={ref}
      role="img"
      aria-label="An illustration of a coordinated plan: a participant at the centre, connected to supports including occupational therapy, support workers, a plan manager and transport, with assistive technology and housing shown as still to be arranged."
    />
  );
}
