<script setup lang="ts">
import AboutSection from "@/components/AboutSection.vue";
import HeaderSection from "@/components/HeaderSection.vue";
import HeroSection from "@/components/HeroSection.vue";
import MissionSection from "@/components/MissionSection.vue";
import ScreenLoader from "@/components/ScreenLoader.vue";

import { watchEffect, onMounted, onUnmounted, computed } from "vue";
import { useScrollStore } from "@/stores/ScrollPos";
import { storeToRefs } from "pinia";
import { SectionIdEnum } from "@/type";
import { useCanvasStore } from "@/stores/CanvasInstance";
import FloatingVolume from "@/components/common/FloatingVolume.vue";

const scrollStore = useScrollStore();
const { scrollTarget } = storeToRefs(useScrollStore());

const canvasStore = useCanvasStore();
const { canvasInstance } = storeToRefs(canvasStore);
const isCanvasLoaded = computed(() => {
  if (!canvasInstance.value) return false;
  return canvasInstance.value.isLoaded.value;
});

onMounted(() => {
  scrollStore.init();
  watchEffect(() => {
    const heroElem = document.getElementById(SectionIdEnum.HERO);
    const header = document.getElementById("header");
    if (isCanvasLoaded.value) {
      if (scrollTarget.value == SectionIdEnum.ABOUT) {
        heroElem?.classList.remove("show");
        header?.classList.remove("show");
      } else if (scrollTarget.value == SectionIdEnum.HERO) {
        heroElem?.classList.add("show");
        header?.classList.add("show");
      }
    }
  });
});

onUnmounted(() => {
  scrollStore.cleanup();
});
</script>
<template>
  <ScreenLoader />
  <HeaderSection />
  <FloatingVolume/>
  <main id="main-container">
    <HeroSection />
    <section class="content-wrapper">
      <AboutSection />
      <MissionSection />
    </section>
  </main>
</template>
