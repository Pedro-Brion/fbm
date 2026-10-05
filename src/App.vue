<!-- Consts -->
<script setup lang="ts">
import CPUFBM from './experiments/CPUFBM.vue';


</script>
<template>
  <div>
    <CPUFBM></CPUFBM>
  </div>
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
