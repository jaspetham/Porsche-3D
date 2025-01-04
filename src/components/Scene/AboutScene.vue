<script lang="ts" setup>
import Canvas from './Canvas_second'
import { onMounted } from 'vue'
import { useCanvasStore } from '@/stores/CanvasInstance'

const canvasStore = useCanvasStore()

onMounted(() => {
  const secondaryCanvasInstance = new Canvas({
    dom: document.getElementById('about-scene'),
  })
  canvasStore.setSecondaryCanvasInstance(secondaryCanvasInstance)
})
</script>

<template>
  <div ref="aboutContainer" id="about-scene" class="flex-1 w-full"></div>
</template>

<style lang="scss" scoped></style>
