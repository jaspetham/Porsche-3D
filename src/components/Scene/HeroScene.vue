<script lang="ts" setup>
import Canvas from "./Hero_Canvas.ts";
import { onMounted, watch, onBeforeUnmount } from "vue";
import { useCanvasStore } from "@/stores/CanvasInstance";
import { useScrollStore } from "@/stores/ScrollPos";
import { storeToRefs } from "pinia";

const scrollStore = useScrollStore();
const { scrollPos } = storeToRefs(scrollStore);

const canvasStore = useCanvasStore();
const { canvasInstance } = storeToRefs(canvasStore);

// Handle keyboard shortcuts for debug features
const handleKeyDown = (e: KeyboardEvent) => {
  // Only respond if we have a canvas instance
  if (!canvasInstance.value) return;

  // Shift + D to toggle debug helpers
  if (e.shiftKey && e.key === 'D') {
    canvasInstance.value.addDebugHelpers();
    console.log('Debug helpers added');
  }

  // Number keys to change shadow quality
  if (e.shiftKey) {
    switch(e.key) {
      case '0':
        canvasInstance.value.setShadowQuality('off');
        console.log('Shadows: OFF');
        break;
      case '1':
        canvasInstance.value.setShadowQuality('low');
        console.log('Shadows: LOW');
        break;
      case '2':
        canvasInstance.value.setShadowQuality('medium');
        console.log('Shadows: MEDIUM');
        break;
      case '3':
        canvasInstance.value.setShadowQuality('high');
        console.log('Shadows: HIGH');
        break;
    }
  }
};

onMounted(() => {
  const canvas = new Canvas({
    dom: document.getElementById("container") as HTMLCanvasElement,
  });
  canvasStore.setCanvasInstance(canvas);

  // Add keyboard event listener for debug controls
  window.addEventListener('keydown', handleKeyDown);

  watch(scrollPos, (newScrollValue) => {
    const maxScroll = 5000;
    if (canvasInstance.value && newScrollValue < maxScroll) {
      canvasInstance.value.onScrollEvents(newScrollValue, maxScroll);
    }
  });
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener('keydown', handleKeyDown);
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
