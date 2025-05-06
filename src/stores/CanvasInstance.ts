import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import HeroCanvas from '@/components/Scene/Hero_Canvas.ts'
import AboutCanvas from '@/components/Scene/About_Canvas.ts'

// Define the store
export const useCanvasStore = defineStore('canvas', () => {
  // Use specific types for the specific canvases
  const canvasInstance = shallowRef<HeroCanvas | null>(null)

  const setCanvasInstance = (instance: HeroCanvas | null) => {
    canvasInstance.value = instance
  }

  const secondaryCanvasInstance = shallowRef<AboutCanvas | null>(null)

  const setSecondaryCanvasInstance = (instance: AboutCanvas | null) => {
    secondaryCanvasInstance.value = instance
  }

  return {
    canvasInstance,
    setCanvasInstance,
    secondaryCanvasInstance,
    setSecondaryCanvasInstance,
  }
})
