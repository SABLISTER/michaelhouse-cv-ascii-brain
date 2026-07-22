import { useEffect, useRef } from 'react';

const RAMP_CHARS =
  " `.-':_,^=;><+!rc*/z?sLTv)J7(|Fi{C}fI31tlu[neoZ5Yxjya]2ESwqkP6h9d4VpOGbUAKXHm8RD#$Bg0MNWQ%&@";
const FIELD_CHARS = '  ..::--==++**##@@'.split('');

// Side-profile brain silhouette: union of ellipses in normalized space (u, v in [-1, 1])
const BRAIN_SHAPES = [
  { cx: -0.1, cy: -0.16, rx: 0.8, ry: 0.62 }, // cerebrum
  { cx: -0.44, cy: 0.26, rx: 0.34, ry: 0.24 }, // frontal / inferior
  { cx: 0.04, cy: 0.34, rx: 0.44, ry: 0.22 }, // temporal lobe
  { cx: 0.54, cy: 0.4, rx: 0.3, ry: 0.22 }, // cerebellum
  { cx: 0.26, cy: 0.56, rx: 0.13, ry: 0.2 }, // brainstem
];
const CEREBELLUM = BRAIN_SHAPES[4 - 1];
const BRAINSTEM = BRAIN_SHAPES[5 - 1];

const NODE_COUNT = 30;
const MAX_PULSES = 32;

const hash = (x: number, y: number) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453123;
  return s - Math.floor(s);
};

const smooth = (t: number) => t * t * (3 - 2 * t);

const noise2D = (x: number, y: number) => {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;

  const a = hash(ix, iy);
  const b = hash(ix + 1, iy);
  const c = hash(ix, iy + 1);
  const d = hash(ix + 1, iy + 1);

  const ux = smooth(fx);
  const uy = smooth(fy);

  return (
    a * (1 - ux) * (1 - uy) +
    b * ux * (1 - uy) +
    c * (1 - ux) * uy +
    d * ux * uy
  );
};

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

// How deeply (u, v) sits inside the brain silhouette. > 0 means inside.
const brainDepth = (u: number, v: number) => {
  let best = -Infinity;
  for (const s of BRAIN_SHAPES) {
    const du = (u - s.cx) / s.rx;
    const dv = (v - s.cy) / s.ry;
    const m = 1 - du * du - dv * dv;
    if (m > best) best = m;
  }
  return best;
};

const shapeDepth = (u: number, v: number, s: (typeof BRAIN_SHAPES)[number]) => {
  const du = (u - s.cx) / s.rx;
  const dv = (v - s.cy) / s.ry;
  return 1 - du * du - dv * dv;
};

// Static cortical-fold texture + silhouette shading for one point inside the brain.
const brainTexture = (u: number, v: number, depth: number) => {
  const f1 = noise2D(u * 2.6 + 7.3, v * 2.6 - 2.1);
  const f2 = noise2D(u * 6.2 - 1.2, v * 6.2 + 5.6);
  const f3 = noise2D(u * 11.0 + 3.7, v * 11.0 - 8.4);
  const f = f1 * 0.52 + f2 * 0.36 + f3 * 0.12;

  // Ridged noise -> thin dark sulci snaking through brighter gyri
  const ridge = 1 - Math.abs(2 * f - 1);
  const sulci = Math.pow(ridge, 5);

  // A second, longer-wavelength ridge field for meandering cortical folds
  const g = noise2D(u * 4.2 + 11.0, v * 4.2 - 7.0);
  const longSulci = Math.pow(1 - Math.abs(2 * g - 1), 9);

  let intensity = 0.44 + 0.52 * f - 0.3 * sulci - 0.26 * longSulci;
  intensity += 0.1 * noise2D(u * 1.3 + 40.0, v * 1.3 - 17.0);

  // Global shading: lit from the upper left, falling off toward the brainstem
  intensity *= clamp(0.92 - 0.3 * (u * 0.5 + v * 0.7), 0.52, 1.05);

  // Lateral sulcus (Sylvian fissure): one strong dark diagonal seam
  if (u > -0.62 && u < 0.38) {
    const vf = 0.06 + 0.3 * (u + 0.2);
    intensity -= Math.exp(-Math.pow((v - vf) * 18, 2)) * 0.36;
  }

  // Cerebellum: fine horizontal folia stripes
  const cb = shapeDepth(u, v, CEREBELLUM);
  if (cb > 0) {
    intensity -= 0.16 * (0.5 + 0.5 * Math.sin(v * 52 + u * 9)) * clamp(cb * 2.2, 0, 1);
  }

  // Brainstem: slightly dimmer
  if (shapeDepth(u, v, BRAINSTEM) > 0) intensity *= 0.82;

  // Inner shadow near the silhouette edge
  intensity *= 0.5 + 0.5 * smooth(clamp(depth * 3.2, 0, 1));

  // Levels stretch for a brighter, higher-contrast cortex
  return clamp((intensity - 0.14) * 1.5, 0.02, 1);
};

interface Node {
  u: number;
  v: number;
  px: number;
  py: number;
  cell: number;
  flash: number;
}

interface Edge {
  a: number;
  b: number;
  cells: Int32Array; // flattened [row, col, row, col, ...]
  length: number; // number of cells
}

interface Pulse {
  edge: number;
  t: number;
  speed: number; // 1/seconds across the edge
  dir: 1 | -1;
  alive: boolean;
}

export default function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let time = 0;
    let lastTs = 0;
    let rafId = 0;
    const mouse = { x: -1000, y: -1000 };

    // Brain geometry
    let brainX = 0;
    let brainY = 0;
    let brainR = 0; // half-size of the normalized square, in px

    // Precomputed per-cell data
    let mask = new Uint8Array(0);
    let baseTex = new Float32Array(0);
    let activation = new Float32Array(0);
    let nodeAtCell = new Int16Array(0);

    // Network state
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let adjacency: number[][] = [];
    const pulses: Pulse[] = [];
    let spawnTimer = 0.4;
    let burstTimer = 2.5;

    const cellW = () => width / cols;
    const cellH = () => cellW() * 1.18;

    const uvToPixel = (u: number, v: number) => ({
      x: brainX + u * brainR,
      y: brainY + v * brainR,
    });

    const pixelToCell = (x: number, y: number) => {
      const c = clamp(Math.floor(x / cellW()), 0, cols - 1);
      const r = clamp(Math.floor(y / cellH()), 0, rows - 1);
      return r * cols + c;
    };

    const rasterizeEdge = (a: Node, b: Node): Int32Array => {
      const ac = a.cell;
      const bc = b.cell;
      let x0 = ac % cols;
      let y0 = Math.floor(ac / cols);
      const x1 = bc % cols;
      const y1 = Math.floor(bc / cols);

      const cells: number[] = [];
      const dx = Math.abs(x1 - x0);
      const dy = Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx - dy;

      // Bresenham walk from node a to node b
      for (let guard = 0; guard < cols + rows; guard++) {
        cells.push(y0, x0);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 > -dy) {
          err -= dy;
          x0 += sx;
        }
        if (e2 < dx) {
          err += dx;
          y0 += sy;
        }
      }
      return Int32Array.from(cells);
    };

    const buildNetwork = () => {
      // Blue-noise-ish node sampling inside the silhouette
      const sampled: { u: number; v: number }[] = [];
      let attempts = 0;
      while (sampled.length < NODE_COUNT && attempts < 6000) {
        attempts++;
        const u = Math.random() * 2 - 1;
        const v = Math.random() * 2 - 1;
        if (brainDepth(u, v) < 0.08) continue;
        let ok = true;
        for (const n of sampled) {
          if (Math.hypot(n.u - u, n.v - v) < 0.21) {
            ok = false;
            break;
          }
        }
        if (ok) sampled.push({ u, v });
      }

      nodes = sampled.map(({ u, v }) => {
        const { x, y } = uvToPixel(u, v);
        return { u, v, px: x, py: y, cell: pixelToCell(x, y), flash: 0 };
      });

      // Edges: 2 nearest neighbors per node + a few long-range cross-links
      const seen = new Set<string>();
      const pairs: [number, number][] = [];
      const key = (i: number, j: number) => (i < j ? `${i}-${j}` : `${j}-${i}`);
      const dist = (i: number, j: number) =>
        Math.hypot(nodes[i].u - nodes[j].u, nodes[i].v - nodes[j].v);

      for (let i = 0; i < nodes.length; i++) {
        const byDist = nodes
          .map((_, j) => j)
          .filter((j) => j !== i)
          .sort((a, b) => dist(i, a) - dist(i, b));
        for (const j of byDist.slice(0, 2)) {
          if (dist(i, j) < 0.62 && !seen.has(key(i, j))) {
            seen.add(key(i, j));
            pairs.push([i, j]);
          }
        }
      }
      let longRange = 0;
      for (let tries = 0; tries < 300 && longRange < 5; tries++) {
        const i = Math.floor(Math.random() * nodes.length);
        const j = Math.floor(Math.random() * nodes.length);
        if (i !== j && dist(i, j) > 0.62 && !seen.has(key(i, j))) {
          seen.add(key(i, j));
          pairs.push([i, j]);
          longRange++;
        }
      }

      edges = pairs.map(([a, b]) => {
        const cells = rasterizeEdge(nodes[a], nodes[b]);
        return { a, b, cells, length: cells.length / 2 };
      });

      adjacency = nodes.map(() => []);
      edges.forEach((e, idx) => {
        adjacency[e.a].push(idx);
        adjacency[e.b].push(idx);
      });

      nodeAtCell.fill(-1);
      nodes.forEach((n, i) => {
        nodeAtCell[n.cell] = i;
      });
    };

    const rebuildGrid = () => {
      mask = new Uint8Array(cols * rows);
      baseTex = new Float32Array(cols * rows);
      activation = new Float32Array(cols * rows);
      nodeAtCell = new Int16Array(cols * rows);

      const cw = cellW();
      const ch = cellH();
      for (let r = 0; r < rows; r++) {
        const y = r * ch + ch / 2;
        const v = (y - brainY) / brainR;
        for (let c = 0; c < cols; c++) {
          const x = c * cw + cw / 2;
          const u = (x - brainX) / brainR;
          const idx = r * cols + c;
          if (Math.abs(u) > 1 || Math.abs(v) > 1) continue;
          const depth = brainDepth(u, v);
          if (depth <= 0) continue;
          mask[idx] = 1;
          baseTex[idx] = brainTexture(u, v, depth);
        }
      }
    };

    const resize = () => {
      width = canvas.parentElement!.offsetWidth;
      height = canvas.parentElement!.offsetHeight;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      cols = width < 768 ? 90 : 128;
      rows = Math.ceil(height / cellH());

      brainX = width * 0.5;
      brainY = height * 0.48;
      brainR = Math.min(width, height) * 0.42;

      rebuildGrid();
      buildNetwork();
    };

    const spawnPulse = (edgeIdx: number, fromNode: number) => {
      if (pulses.length >= MAX_PULSES) return;
      const e = edges[edgeIdx];
      const dir: 1 | -1 = e.a === fromNode ? 1 : -1;
      pulses.push({
        edge: edgeIdx,
        t: dir === 1 ? 0 : 1,
        speed: 1 / (0.7 + Math.random() * 0.9),
        dir,
        alive: true,
      });
    };

    const stepNetwork = (dt: number) => {
      activation.fill(0);

      // Faint synaptic web baseline
      for (const e of edges) {
        for (let k = 0; k < e.cells.length; k += 2) {
          activation[e.cells[k] * cols + e.cells[k + 1]] += 0.055;
        }
      }

      // Ambient + cursor-driven firing
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const md = Math.hypot(n.px - mouse.x, n.py - mouse.y);
        let p = 0.0022;
        if (md < 130) p += 0.05 * (1 - md / 130);
        if (Math.random() < p) n.flash = Math.max(n.flash, 0.65 + Math.random() * 0.35);
        n.flash *= Math.pow(0.12, dt); // smooth exponential decay
        if (n.flash > 0.02) {
          activation[n.cell] += n.flash * 0.85;
          // faint glow spilling onto the four neighboring cells
          const nc = n.cell % cols;
          const nr = Math.floor(n.cell / cols);
          const glow = n.flash * 0.22;
          if (nc > 0) activation[n.cell - 1] += glow;
          if (nc < cols - 1) activation[n.cell + 1] += glow;
          if (nr > 0) activation[n.cell - cols] += glow;
          if (nr < rows - 1) activation[n.cell + cols] += glow;
        }
      }

      // Periodic burst: a wave of activity sweeping out of one region
      burstTimer -= dt;
      if (burstTimer <= 0) {
        burstTimer = 3.5 + Math.random() * 3.0;
        const seed = Math.floor(Math.random() * nodes.length);
        nodes[seed].flash = 1;
        for (const ei of adjacency[seed]) spawnPulse(ei, seed);
      }

      // Random background traffic
      spawnTimer -= dt;
      if (spawnTimer <= 0) {
        spawnTimer = 0.08 + Math.random() * 0.18;
        const ei = Math.floor(Math.random() * edges.length);
        spawnPulse(ei, Math.random() < 0.5 ? edges[ei].a : edges[ei].b);
      }

      // Advance pulses; on arrival, flash the target node and maybe propagate
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        const e = edges[p.edge];
        p.t += p.dir * p.speed * dt;

        const done = p.dir === 1 ? p.t >= 1 : p.t <= 0;
        if (done) {
          const arrival = p.dir === 1 ? e.b : e.a;
          nodes[arrival].flash = 1;
          if (Math.random() < 0.52) {
            const options = adjacency[arrival].filter((ei) => ei !== p.edge);
            if (options.length > 0) {
              spawnPulse(options[Math.floor(Math.random() * options.length)], arrival);
            }
          }
          pulses.splice(i, 1);
          continue;
        }

        // Head + short tail along the rasterized edge
        const tc = clamp(p.t, 0, 1);
        const head = clamp(Math.floor(tc * (e.length - 1)), 0, e.length - 1);
        for (let tail = 0; tail < 3; tail++) {
          const ci = clamp(head - tail * p.dir, 0, e.length - 1);
          const cellIdx = e.cells[ci * 2] * cols + e.cells[ci * 2 + 1];
          activation[cellIdx] += tail === 0 ? 1.0 : tail === 1 ? 0.42 : 0.18;
        }
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const draw = (ts: number) => {
      const dt = clamp((ts - lastTs) / 1000 || 0.016, 0.001, 0.05);
      lastTs = ts;

      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, width, height);

      time += dt;

      const cw = cellW();
      const ch = cellH();

      ctx.font = `${ch * 0.84}px "Fragment Mono", monospace`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      stepNetwork(dt);

      for (let r = 0; r < rows; r++) {
        const y = r * ch + ch / 2;
        const laneNorm = y / height;

        for (let c = 0; c < cols; c++) {
          const idx = r * cols + c;
          const x = c * cw + cw / 2;

          const dxBrain = x - brainX;
          const dyBrain = y - brainY;
          const normBrain = Math.hypot(dxBrain, dyBrain) / brainR;
          const angleBrain = Math.atan2(dyBrain, dxBrain);

          const mouseDistance = Math.hypot(x - mouse.x, y - mouse.y);
          const mouseField = Math.exp(-mouseDistance * 0.0038);

          let char = '';
          let opacity = 0;
          let drawX = x;
          let drawY = y;

          if (mask[idx]) {
            // ---- Inside the brain: folds + live connectivity ----
            const act = activation[idx];
            const shimmer =
              0.03 * Math.sin(time * 1.6 + r * 0.21 + c * 0.13) + 0.02 * Math.sin(time * 3.1 + c * 0.31);
            const intensity = clamp(baseTex[idx] * 0.56 + act + shimmer, 0, 1);

            const rampIdx = clamp(
              Math.floor(intensity * (RAMP_CHARS.length - 1)),
              0,
              RAMP_CHARS.length - 1
            );
            char = RAMP_CHARS[rampIdx];
            opacity = clamp(0.2 + intensity * 0.82, 0.14, 1);

            // Node glyphs override texture
            const ni = nodeAtCell[idx];
            if (ni >= 0) {
              const f = nodes[ni].flash;
              char = f > 0.66 ? '@' : f > 0.3 ? 'O' : 'o';
              opacity = clamp(0.48 + f * 0.52, 0, 1);
            } else if (act > 0.72) {
              char = '@';
              opacity = 1;
            } else if (act > 0.34) {
              char = '*';
            } else if (act > 0.16) {
              char = '+';
            }

            // Tiny cursor-driven wobble, gentler than the field outside
            drawX += Math.sin(time * 3.6 + r * 0.32 + c * 0.11) * mouseField * 5;
            drawY += Math.cos(time * 2.8 + c * 0.24) * mouseField * 2;
          } else {
            // ---- Outside: streaming signal field bending around the brain ----
            const sampleX =
              c * 0.085 -
              time * 5.4 +
              Math.sin(time * 4.2 + r * 0.28 + c * 0.08) * mouseField * 1.8;
            const sampleY =
              r * 0.11 +
              Math.sin(c * 0.025 + time * 1.2) * 0.6 +
              Math.cos(time * 3.4 + c * 0.2) * mouseField * 1.1;

            const flowA = noise2D(sampleX, sampleY);
            const flowB = noise2D(sampleX * 1.7 + 20, sampleY * 0.8 - 14);
            const wave =
              Math.sin(sampleX * 1.9 + laneNorm * 14) * 0.5 +
              Math.cos(sampleY * 2.4 - time * 2.1) * 0.5;

            let density = flowA * 0.42 + flowB * 0.28 + (wave * 0.5 + 0.5) * 0.3;

            // Faint halo clinging to the silhouette
            const halo = Math.exp(-Math.pow((normBrain - 1.06) * 6.5, 2));
            density += halo * 0.14;

            if (density > 0.4) {
              const fieldIdx = clamp(
                Math.floor(density * (FIELD_CHARS.length - 1)),
                0,
                FIELD_CHARS.length - 1
              );
              char = FIELD_CHARS[fieldIdx];
              opacity = 0.035 + density * 0.24;

              drawX += (2.8 * 8 + flowB * 16) % (cw * 3);
              drawY += Math.sin(sampleX * 2.2 + time + laneNorm * 8) * 1.8;

              // Bend the flow around the brain
              const swirl = halo * 9;
              drawX += -Math.sin(angleBrain) * swirl;
              drawY += Math.cos(angleBrain) * swirl * 0.6;

              drawX += Math.sin(time * 4.8 + r * 0.35 + c * 0.1) * mouseField * 18;
              drawY += Math.cos(time * 3.2 + c * 0.25) * mouseField * 6;
            }
          }

          if (!char || opacity <= 0.02) continue;

          ctx.fillStyle = `rgba(232, 230, 224, ${opacity})`;
          ctx.fillText(char, drawX, drawY);
        }
      }

      rafId = requestAnimationFrame(draw);
    };

    document.fonts.ready.then(() => {
      resize();
      rafId = requestAnimationFrame(draw);
    });

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
