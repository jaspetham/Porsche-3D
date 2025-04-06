<script lang="ts" setup>
import Canvas from "./Hero_Canvas.ts";
import { onMounted, watch } from "vue";
import { useCanvasStore } from "@/stores/CanvasInstance";
import { useScrollEvent } from "@/composables/useScrollEvent";

const canvasStore = useCanvasStore();
const { scrollAmount } = useScrollEvent();

onMounted(() => {
  const canvasInstance = new Canvas({
    dom: document.getElementById("container"),
  });
  canvasStore.setCanvasInstance(canvasInstance);
  watch(scrollAmount, (newScrollValue) => {
    const maxScroll = 5000;
    if (canvasStore.canvasInstance && newScrollValue < maxScroll) {
      canvasStore.canvasInstance.onScrollEvents(newScrollValue, maxScroll);
    }
  });
});
</script>

<template>
  <div ref="canvasContainer" id="container" class="canvas-container bg-gray-800 p-4">
    <div class="overlay"></div>
  </div>
</template>

<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 0;
  pointer-events: none;
  position: fixed;
  top: 0;
  left: 0;
  outline: none;
  .overlay {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.4) 5%, rgba(255, 255, 255, 0) 100%);
  }
}
</style>
