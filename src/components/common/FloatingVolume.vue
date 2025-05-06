<script setup lang="ts">
import { useCanvasStore } from '@/stores/CanvasInstance';
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';

const isMuted = ref<boolean>(false);

const canvasStore = useCanvasStore();
const { canvasInstance } = storeToRefs(canvasStore);

const toggleMute = () => {
  isMuted.value = !isMuted.value;
};

watch(isMuted, (newValue) => {
  if (canvasInstance.value) {
    canvasInstance.value.toggleAudio(newValue)
  }
}, { immediate: true })
</script>
<template>
  <div id="volume">
    <button @click="toggleMute">
      <div v-if="!isMuted">
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
          <path fill="currentColor"
            d="M3 9v6h4l5 5V4L7 9zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02M14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77" />
        </svg>
      </div>
      <div v-else>
        <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24">
          <path fill="currentColor" d="M7.83 11H5v2h2.83L10 15.17v-3.76l-1.29-1.29z" opacity="0.3" />
          <path fill="currentColor"
            d="M4.34 2.93L2.93 4.34L7.29 8.7L7 9H3v6h4l5 5v-6.59l4.18 4.18c-.65.49-1.38.88-2.18 1.11v2.06a8.94 8.94 0 0 0 3.61-1.75l2.05 2.05l1.41-1.41zM10 15.17L7.83 13H5v-2h2.83l.88-.88L10 11.41zM19 12c0 .82-.15 1.61-.41 2.34l1.53 1.53c.56-1.17.88-2.48.88-3.87c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71m-7-8l-1.88 1.88L12 7.76zm4.5 8A4.5 4.5 0 0 0 14 7.97v1.79l2.48 2.48c.01-.08.02-.16.02-.24" />
        </svg>
      </div>
    </button>
  </div>
</template>


<style scoped lang="scss">
#volume {
  position: fixed;
  bottom: 2%;
  right: 2%;
  z-index: 100;
  background-color: #000;
  padding: 5px;
  border-radius: 10px;
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: whitesmoke;
}
</style>