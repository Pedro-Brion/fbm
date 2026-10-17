<script setup lang="ts">
import { CANVAS_HEIGHT, CANVAS_WIDTH } from '@/utils/constants';

function render() {
  console.log("RENDER")
}

</script>
<template>
  <main class="container">
    <canvas :width="CANVAS_WIDTH" :height="CANVAS_HEIGHT" ref="canvas" />
    <div class="info">
      <button @click="() => render()">Render</button>
    </div>
  </main>
</template>

<style scoped></style>
