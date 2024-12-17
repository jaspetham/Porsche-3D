<script lang="ts" setup>
import { useCanvasStore } from "@/stores/CanvasInstance";
const canvasStore = useCanvasStore();

const startAnimation = () => {
  if(canvasStore.canvasInstance){
    canvasStore.canvasInstance.startAudio();
  }
}
</script>
<template>
  <div id="loading-text-intro">
    <div id="loading-value">0%</div>
    <button id="start-button" @click="startAnimation" class="uppercase">Start</button>
  </div>
</template>
<style lang="scss" scoped>
#loading-text-intro{
  z-index: 3;
  position: absolute;
  width: 100vw;
  height: 100%;
  font-family: 'Josefin Sans', sans-serif;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 100;
	color:#f9f0ec;
	background: radial-gradient(circle at center center,#5d5d5d 0,#090909 58%);
  // display:none;
}

#start-button{
  display:none;
}
</style>
