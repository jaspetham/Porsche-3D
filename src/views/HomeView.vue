<script setup lang="ts">
import AboutSection from "@/components/AboutSection.vue";
import HeaderSection from "@/components/HeaderSection.vue";
import HeroSection from "@/components/HeroSection.vue";
import MissionSection from "@/components/MissionSection.vue";
import HeroScene from "@/components/Scene/HeroScene.vue";
import ScreenLoader from "@/components/ScreenLoader.vue";

import { watchEffect, onMounted, onUnmounted } from "vue";
import { useScrollStore } from "@/stores/ScrollPos";
import { storeToRefs } from "pinia";
import { SectionIdEnum } from "@/type";

const scrollStore = useScrollStore();
const { scrollTargetDebounced } = storeToRefs(useScrollStore());
onMounted(() => {
  scrollStore.init();
  watchEffect(() => {
    const heroElem = document.getElementById(SectionIdEnum.HERO);
    if (scrollTargetDebounced.value == SectionIdEnum.ABOUT) {
      heroElem?.classList.remove("show");
    } else if (scrollTargetDebounced.value == SectionIdEnum.HERO) {
      heroElem?.classList.add("show");
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
  <HeroScene />
  <main id="main-container" class="show">
    <!-- <main id="main-container"> -->
    <HeroSection />
    <section class="content-wrapper">
      <AboutSection />
      <MissionSection />
    </section>
  </main>
</template>
