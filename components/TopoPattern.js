'use client';

import { useEffect } from 'react';

/**
 * Generates the topographic contour tile used behind the bento hover panels.
 *
 * Real contour lines, not decorative rings: a two-octave value-noise height
 * field is sampled once, then every pixel is shaded by its distance to the
 * nearest iso-line, divided by the local gradient. Dividing by the gradient is
 * what keeps the strokes an even width whether the terrain is steep or flat,
 * which is the difference between this reading as a contour map and reading as
 * a stack of blobs.
 *
 * The noise lattice is periodic, so the tile repeats seamlessly in both axes.
 *
 * Runs once, after paint, and hands the result to CSS as `--topo`. Nothing
 * depends on it: the panels declare `var(--topo, none)` and look fine without.
 */

const SIZE = 512; // tile edge, px
const LEVELS = 12; // contour intervals across the height range
const LINE = 0.7; // half-width of a stroke, px
const STROKE = [168, 226, 190]; // soft mint, so the lines read on the deep green
const OPACITY = 105; // peak alpha of an ordinary contour
const INDEX_BOOST = 1.6; // every third line, the way an index contour reads

/** Value noise on a wrapping lattice, so the tile has no seams. */
function periodicNoise(period, seed) {
  const grid = new Float32Array(period * period);
  let s = seed >>> 0;
  for (let i = 0; i < grid.length; i += 1) {
    s = (s * 1664525 + 1013904223) >>> 0;
    grid[i] = s / 4294967296;
  }
  return (x, y) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const i0 = ((xi % period) + period) % period;
    const j0 = ((yi % period) + period) % period;
    const i1 = (i0 + 1) % period;
    const j1 = (j0 + 1) % period;
    const a = grid[j0 * period + i0];
    const b = grid[j0 * period + i1];
    const c = grid[j1 * period + i0];
    const d = grid[j1 * period + i1];
    return (a * (1 - u) + b * u) * (1 - v) + (c * (1 - u) + d * u) * v;
  };
}

export default function TopoPattern() {
  useEffect(() => {
    if (document.documentElement.style.getPropertyValue('--topo')) return;

    const build = () => {
      const n1 = periodicNoise(4, 20260907);
      const n2 = periodicNoise(8, 815501);

      // height field
      const field = new Float32Array(SIZE * SIZE);
      for (let y = 0; y < SIZE; y += 1) {
        for (let x = 0; x < SIZE; x += 1) {
          const fx = (x / SIZE) * 4;
          const fy = (y / SIZE) * 4;
          field[y * SIZE + x] =
            n1(fx, fy) * 0.66 + n2((x / SIZE) * 8, (y / SIZE) * 8) * 0.34;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = SIZE;
      canvas.height = SIZE;
      const g = canvas.getContext('2d');
      const img = g.createImageData(SIZE, SIZE);
      const data = img.data;

      const at = (x, y) =>
        field[(((y % SIZE) + SIZE) % SIZE) * SIZE + (((x % SIZE) + SIZE) % SIZE)];

      for (let y = 0; y < SIZE; y += 1) {
        for (let x = 0; x < SIZE; x += 1) {
          const v = at(x, y) * LEVELS;
          // central differences give the local slope, in contour units per px
          const gx = (at(x + 1, y) - at(x - 1, y)) * 0.5 * LEVELS;
          const gy = (at(x, y + 1) - at(x, y - 1)) * 0.5 * LEVELS;
          const slope = Math.hypot(gx, gy) + 1e-5;

          // distance in pixels to the nearest contour line
          const dist = Math.abs(v - Math.round(v)) / slope;
          let a = 1 - dist / LINE;
          if (a < 0) a = 0;

          const index = Math.round(v) % 3 === 0 ? INDEX_BOOST : 1;

          const k = (y * SIZE + x) * 4;
          data[k] = STROKE[0];
          data[k + 1] = STROKE[1];
          data[k + 2] = STROKE[2];
          data[k + 3] = Math.min(255, a * OPACITY * index);
        }
      }

      g.putImageData(img, 0, 0);
      document.documentElement.style.setProperty(
        '--topo',
        `url(${canvas.toDataURL('image/png')})`
      );
    };

    // after paint, and never on the critical path
    const idle =
      window.requestIdleCallback || ((fn) => window.setTimeout(fn, 200));
    const cancel = window.cancelIdleCallback || window.clearTimeout;
    const handle = idle(build);

    return () => cancel(handle);
  }, []);

  return null;
}
