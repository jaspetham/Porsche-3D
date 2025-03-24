<script setup lang="ts">
import type { detailsInfo } from "@/type";
import skeleton from "@/assets/detail/skeleton.jpg";
import engine from "@/assets/detail/engine.avif";
import aerobar from "@/assets/detail/aerobar.avif";
import brake from "@/assets/detail/brake.avif";
import { onMounted, onUnmounted, ref } from "vue";

const props = defineProps<{
  detail: detailsInfo;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeDetail = () => {
  emit("close");
};

const startAnimation = ref<boolean>(true);

const images: string[] = [engine, aerobar, brake];
const currentImageIndex = ref<number>(0);
const cycleImages = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % images.length;
};

let intervalId: number | null = null;
onMounted(() => {
  intervalId = setInterval(cycleImages, 250);
});
onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>
<template>
  <section :class="'detail-page ' + `${startAnimation ? 'start' : ''}`">
    <div class="detail-bg" :style="{ backgroundImage: `url(${skeleton})` }"></div>
    <div class="flex relative h-full">
      <div class="flex-1"></div>
      <div class="context flex-1 h-full">
        <div class="flex w-full justify-between items-start">
          <p class="font-bold fs-900 uppercase">{{ props.detail }}</p>
          <button @click="closeDetail" class="detail-close fs-100">Close</button>
        </div>
        <div class="context-detail flow mt-20 w-5/6 mx-auto">
          <div class="detail-img-slide mx-auto w-2/4">
            <div
              class="detail-img"
              :style="{ backgroundImage: `url(${images[currentImageIndex]})` }"
            ></div>
          </div>
          <p class="fs-250 ff-p-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae sunt eligendi
            sit culpa odit, laboriosam eius? Eius ipsam neque in aliquid quod eaque
            repellat voluptates! Saepe excepturi incidunt aperiam consequatur nemo,
            ratione temporibus consequuntur sequi quis consectetur. Error ab, excepturi
            eaque aliquid odit magni nam earum laboriosam temporibus voluptatem fugit!
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.detail-page {
  position: fixed;
  left: 0;
  top: 0;
  width: 100dvw;
  height: 100dvh;
  padding: 2rem;
  background-color: var(--dark-color);
}

.detail-bg {
  background-repeat: no-repeat;
  background-position: -10rem 40%;
  background-size: cover;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.25s ease;
}

.detail-close {
  background: var(--font-color);
  color: white;
  padding: 6px 1rem;
}

.context {
  background-color: white;
  padding: 1rem;
}
.detail-img {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  background-color: var(--secondary-color);
  height: 400px;
  width: 100%;
  margin: 0 auto;
}
</style>
