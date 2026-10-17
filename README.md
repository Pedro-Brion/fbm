# fbm

An experimentation repo for noise functions, WebGPU (WGSL), and ways to use noise. It's a sandbox, not a library: each experiment is a self-contained Vue component.

## What's here

### `src/experiments/CPUFBM.vue`: CPU value-noise fBm

Fractal Brownian motion built from value noise, computed on the CPU in TypeScript and drawn to an 800×450 `<canvas>` with `putImageData`.

- **Noise:** for each octave, a lattice of `Math.random()` values is generated and sampled with smoothstep interpolation between the four surrounding lattice points.
- **fBm:** octaves are summed with `frequency = BASE_FREQUENCY * lacunarity^i` and `amplitude = persistence^i`, then normalized by the total amplitude to stay in `[0, 1]`.
- **Usage, terrain coloring:** the result is mapped through threshold color bands (deep water → shallow water → shore → sand → grass → forest → rock → snow) to render a top-down map.
- **Controls:**
  - Octaves (0–10)
  - Lacunarity (0–10)
  - Persistence (0.1–0.95)
  - A **Render** button

Changing lacunarity or persistence re-renders right away. Changing octaves takes effect when you press **Render**.

The lattice is re-randomized on every render, so each render gives a new map (there's no seed yet).

### Not yet here

- WebGPU / WGSL implementations (planned)

## Structure

```
src/
  main.ts              app entry
  App.vue              mounts the current experiment
  experiments/         one component per experiment
  css/main.css         global styles
```

To switch experiments, change the component imported in `App.vue`.

## Running

Requires Node `^22.18.0 || >=24.12.0` and pnpm.

```sh
pnpm install
pnpm dev        # dev server with hot reload
pnpm build      # type-check + production build
pnpm lint       # oxlint + eslint
pnpm format     # prettier on src/
```

Built with Vue 3, Vite, and TypeScript.
