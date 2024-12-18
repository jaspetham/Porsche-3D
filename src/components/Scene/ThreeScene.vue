<script lang="ts" setup>
  import Canvas from "./Canvas";
  import { onMounted } from 'vue';
  import { useCanvasStore } from "@/stores/CanvasInstance";
  const canvasStore = useCanvasStore();
  onMounted(() => {
    const canvasInstance = new Canvas({
      dom: document.getElementById("container"),
    });
    canvasStore.setCanvasInstance(canvasInstance);
  });
</script>

<template>
  <div ref="canvasContainer" id="container" class="canvas-container bg-gray-800 p-4"></div>
</template>

<style lang="scss" scoped>
.canvas-container {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}
#container {
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  outline: none;
  z-index: 0;
  height: 100vh;
  width: 100vw;
  margin: 0;
  padding: 0;
  background: #000;
  background: radial-gradient(circle at center center, #171717 0, #050505 58%);
}
</style>
