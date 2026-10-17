<!-- Consts -->
<script setup lang="ts">
import { type Component, defineAsyncComponent, shallowRef } from 'vue';
import { asyncWithLoader } from './utils/asyncWithLoader';

type Experience = {
  component: Component,
  label: string,
}

const experiences: readonly Experience[] = [
  {
    component: defineAsyncComponent(
      asyncWithLoader(() => import("@/experiments/CPUFBM.vue"))
    ),
    label: "CPU Fbm",
  },
  {
    component: defineAsyncComponent(
      asyncWithLoader(() => import("@/experiments/GPUFBM.vue"))
    ),
    label: "GPU Fbm",
  },
] as const

const selectedExp = shallowRef<Experience>()

</script>
<template>
  <div class="container">
    <div class="select-exp">
      <button v-for="exp in experiences" :key="exp.label" @click="selectedExp = exp">
        {{ exp.label }}
      </button>
    </div>
    <main class="experience">
      <component v-if="selectedExp" :is="selectedExp.component"></component>

      <div v-else>
        Select an experience
      </div>
    </main>
    <!-- <CPUFBM></CPUFBM> -->
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100dvh;
  box-sizing: border-box;
  background-color: rgb(57, 96, 126);
  font-family: 'Courier New', Courier, monospace;
}

.select-exp {
  display: flex;
  background-color: #00333322;
  padding: 1rem;
  gap: 1rem;
}

.experience {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>
