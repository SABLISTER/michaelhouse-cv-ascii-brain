# michaelhouse.cv — ASCII Brain Redesign

A monochrome redesign of [michaelhouse.cv](https://www.michaelhouse.cv), built with React + TypeScript + Vite + Tailwind CSS.

The hero replaces the old terminal motif with a live **ASCII brain**: a side-profile cortex rendered in text characters, wired into a simulated network of ~30 neurons. Signals pulse along synaptic edges, nodes fire and propagate activity to their neighbors, and periodic bursts sweep the network — dynamic connectivity patterns moving throughout the brain. The surrounding field streams like background neural noise and bends around the silhouette. Move your cursor across it to excite nearby neurons.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 3.4 (shadcn/ui theming)
- GSAP + ScrollTrigger for section reveals
- All site content lives in `src/config.ts`
- The brain renderer is `src/components/AsciiCanvas.tsx` (pure canvas, no dependencies)

## Run it

```bash
npm install
npm run dev      # local dev
npm run build    # production build -> dist/
```

## Deployment notes

- Facility detail pages are client-side routes (`/facility/:slug`). On static hosting, add an SPA fallback to `index.html` (the previous site already ships a `404.html` fallback on GitHub Pages).
- Binary assets (images in `public/images/`, videos in `public/videos/`) are **not tracked in this repo** — they are AI-generated monochrome assets that currently live on the build machine. Re-add them before deploying:
  - `public/images/`: `facility-cmi.jpg`, `facility-pni.jpg`, `facility-msu.jpg`, `facility-imaf.jpg`, `archive-ei.jpg`, `archive-rnn.jpg`, `archive-martial.jpg`, `archive-bangladesh.jpg`
  - `public/videos/`: `manifesto.mp4`, `observation.mp4`
- The scaffold this was built from ships 55 pre-installed shadcn/ui components; the app itself imports none of them, so they are omitted here. Regenerate any of them with `npx shadcn@latest add <component>` if needed.

## Content map

| Section | Source |
| --- | --- |
| Hero | Name, role, lead + three credential notes |
| Manifesto | Personal statement (quote from CV) |
| Affiliations & Experience | Child Mind Institute · Simons Foundation/PNI · MSU Autism & Neurodevelopment Lab · IMAF & H Consulting |
| Signal Acquisition | Live-styled 64-ch EEG feed (looping video) |
| Selected Publications | Four posters/chapters from the CV |
| Footer | Contact + domain |

The old site at `SABLISTER/pleasesendgrants` is untouched.
