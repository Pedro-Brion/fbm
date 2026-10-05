<!-- Consts -->
<script lang="ts">
const PIXEL_SIZE = 0.5;
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 450;
const wPixels = Math.ceil(CANVAS_WIDTH / PIXEL_SIZE);
const hPixels = Math.ceil(CANVAS_HEIGHT / PIXEL_SIZE);

const BASE_FREQUENCY = 1 / 128;

function coordToIndex(x: number, y: number, stride: number): number {
  return y * stride + x;
}

function smoothStep(min: number, max: number, x: number): number {
  return min + (max - min) * (x ** 2 * (3 - 2 * x));
}
</script>
<script setup lang="ts">
import { onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement>();

const pixels: number[] = Array.from({ length: wPixels * hPixels }
);
pixels.fill(0)

const imageBuffer: Uint8ClampedArray<ArrayBuffer> = new Uint8ClampedArray(
  CANVAS_HEIGHT * CANVAS_WIDTH * 4,
);
imageBuffer.fill(0);

const octaves = ref<number>(6);

const lacunarity = ref<number>(2.0);
const persistence = ref<number>(0.5);

function buildValueNoise(octaves: number) {
  pixels.fill(0);
  let maxValue = 0;
  for (let i = 0; i < octaves; i++) {
    const frequency = BASE_FREQUENCY * (lacunarity.value ** i);
    const amplitude = persistence.value ** (i)
    maxValue += amplitude;

    const wLattice = Math.ceil(wPixels * frequency) + 1;
    const hLattice = Math.ceil(hPixels * frequency) + 1;

    const lattice: number[] = Array.from(
      { length: (wLattice) * (hLattice) },
      () => Math.random(),
    );

    for (let x = 0; x < wPixels; x++) {
      for (let y = 0; y < hPixels; y++) {
        const latticeX = x * frequency;
        const latticeY = y * frequency;

        const flooredX = Math.floor(latticeX);
        const flooredY = Math.floor(latticeY);
        const ceilX = flooredX + 1;
        const ceilY = flooredY + 1;

        const topLeft =
          lattice[coordToIndex(flooredX, flooredY, wLattice)] || 0;
        const topRight =
          lattice[coordToIndex(ceilX, flooredY, wLattice)] || 0;
        const botLeft =
          lattice[coordToIndex(flooredX, ceilY, wLattice)] || 0;
        const botRight = lattice[coordToIndex(ceilX, ceilY, wLattice)] || 0;

        const topLerp = smoothStep(topLeft, topRight, latticeX - flooredX);
        const botLerp = smoothStep(botLeft, botRight, latticeX - flooredX);
        const valueNoise = smoothStep(
          topLerp,
          botLerp,
          latticeY - flooredY,
        );

        const noiseValue = valueNoise;
        const randomNoise = lattice[coordToIndex(Math.round(latticeX), Math.round(latticeY), wLattice)];

        pixels[coordToIndex(x, y, wPixels)]! += noiseValue * amplitude;
      }
    }
  }

  for (let x = 0; x < wPixels; x++) {
    for (let y = 0; y < hPixels; y++) {
      pixels[coordToIndex(x, y, wPixels)] = ((pixels[coordToIndex(x, y, wPixels)] ?? 0) / (maxValue || 1));
    }
  }
}

type ColorBand = [threshold: number, color: number]

const colorBands: ColorBand[] = [
  [0.25, 0x42b8ac],
  [0.35, 0x62D0C5],
  [0.50, 0x81F0E5],
  [0.51, 0xC8E9E6],
  [0.55, 0xFFE45E,],
  [0.65, 0x12664F,],
  [0.75, 0x0E362B,],
  [0.82, 0x38302e,],
  [1.0, 0xEFF7FF]
]

function render() {
  const ctx = canvas.value?.getContext("2d");
  if (!ctx) return;
  buildValueNoise(octaves.value);

  for (let x = 0; x < CANVAS_WIDTH; x++) {
    for (let y = 0; y < CANVAS_HEIGHT; y++) {
      const index = coordToIndex(x, y, CANVAS_WIDTH) * 4;

      const pixelX = Math.floor(x / PIXEL_SIZE);
      const pixelY = Math.floor(y / PIXEL_SIZE);

      const noiseValue = (pixels[coordToIndex(pixelX, pixelY, wPixels)] || 0);
      let color: number = 0;
      for (let i = 0; i < colorBands.length; i++) {
        const value = colorBands[i]?.[0] ?? 0;
        if (noiseValue > value) continue;
        color = colorBands[i]?.[1] ?? 0x00;
        break;
      }

      imageBuffer[index] = (color & 0xff0000) >> 16;
      imageBuffer[index + 1] = (color & 0x00ff00) >> 8;
      imageBuffer[index + 2] = color & 0x0000ff;
      imageBuffer[index + 3] = 255;
    }
  }

  const imageData = new ImageData(imageBuffer, CANVAS_WIDTH, CANVAS_HEIGHT);

  ctx.putImageData(imageData, 0, 0);
}

onMounted(() => {
  render();
});
</script>
<template>
  <main class="container">
    <canvas :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" ref="canvas" />
    <div class="info">
      <button @click="() => render()">Render</button>
      <div>
        <span>
          Octaves
        </span>
        <input type="range" min="0" max="10" step="1" v-model="octaves" />
        {{ octaves }}
      </div>
      <div>
        <span>
          Lacunarity
        </span>
        <input type="range" min="0" max="10" step="0.5" v-model="lacunarity" @change="render()" />
        {{ lacunarity }}
      </div>
      <div>
        <span>
          Persistence
        </span>
        <input type="range" min="0.1" max="0.95" step="0.05" v-model="persistence" @change="render()" />
        {{ persistence }}
      </div>
      <div>
        <span>Octaves: </span>
        <p>{{ octaves }}</p>
      </div>
      <div>
        <span>wPixels x hPixels </span>
        <p>{{ wPixels }} x {{ hPixels }}</p>
      </div>
    </div>
  </main>
</template>

<style scoped>
.container {
  width: 100dvw;
  height: 100dvh;
  background-color: rgb(57, 96, 126);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Courier New', Courier, monospace;
}

.info {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #00000033;
  padding: 1rem;
  margin: 1rem;
  border-radius: 0.25rem;
  gap: 1rem;
  div {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  span {
    font-weight: bold;
  }
}
</style>
