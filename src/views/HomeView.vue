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

const scrollStore = useScrollStore();
const { scrollTargetDebounced } = storeToRefs(useScrollStore());
onMounted(() => {
  scrollStore.init();
});

onUnmounted(() => {
  scrollStore.cleanup();
});

watchEffect(() => {
  if (scrollTargetDebounced.value === "#about") {
    document.getElementById("hero")?.classList.remove("show");
  } else if (scrollTargetDebounced.value === "#hero") {
    document.getElementById("hero")?.classList.add("show");
  }
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
