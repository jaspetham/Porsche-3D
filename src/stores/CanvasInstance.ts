import { defineStore } from 'pinia'
import { shallowRef } from 'vue'
import Canvas from '@/components/Scene/Canvas'

// Define the store
export const useCanvasStore = defineStore('canvas', () => {
  const canvasInstance = shallowRef<Canvas | null>(null)

  const setCanvasInstance = (instance: Canvas) => {
    canvasInstance.value = instance
  }
  const secondaryCanvasInstance = shallowRef<Canvas | null>(null)

  const setSecondaryCanvasInstance = (instance: Canvas) => {
    secondaryCanvasInstance.value = instance
  }

  return {
    canvasInstance,
    setCanvasInstance,
    secondaryCanvasInstance,
    setSecondaryCanvasInstance,
  }
})
