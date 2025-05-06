<script lang="ts" setup>
import Canvas from "./About_Canvas.ts";
import { onMounted, onBeforeUnmount } from "vue";
import { useCanvasStore } from "@/stores/CanvasInstance";
import { storeToRefs } from "pinia";

const canvasStore = useCanvasStore();
const { secondaryCanvasInstance } = storeToRefs(canvasStore);

// Handle keyboard shortcuts for debug features
const handleKeyDown = (e: KeyboardEvent) => {
  // Only respond if we have a canvas instance
  if (!secondaryCanvasInstance.value) return;

  // Shift + A + D to toggle debug helpers (different from Hero to avoid conflicts)
  if (e.shiftKey && e.key === 'A') {
    secondaryCanvasInstance.value.addDebugHelpers();
    console.log('About Canvas: Debug helpers added');
  }

  // Alt + number keys to change shadow quality
  if (e.altKey) {
    switch(e.key) {
      case '0':
        secondaryCanvasInstance.value.setShadowQuality('off');
        console.log('About Canvas Shadows: OFF');
        break;
      case '1':
        secondaryCanvasInstance.value.setShadowQuality('low');
        console.log('About Canvas Shadows: LOW');
        break;
      case '2':
        secondaryCanvasInstance.value.setShadowQuality('medium');
        console.log('About Canvas Shadows: MEDIUM');
        break;
      case '3':
        secondaryCanvasInstance.value.setShadowQuality('high');
        console.log('About Canvas Shadows: HIGH');
        break;
    }
  }
};

onMounted(() => {
  const aboutSceneElement = document.getElementById("about-scene");
  if (!aboutSceneElement) {
    console.error("About scene element not found");
    return;
  }

  const aboutCanvas = new Canvas({
    dom: aboutSceneElement
  });
  canvasStore.setSecondaryCanvasInstance(aboutCanvas);

  // Add keyboard event listener for debug controls
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  // Clean up event listener
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <div ref="aboutContainer" id="about-scene" class="flex-1 w-full"></div>
</template>

<style lang="scss" scoped></style>
