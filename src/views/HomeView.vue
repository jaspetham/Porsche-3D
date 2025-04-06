<script setup lang="ts">
import AboutSection from "@/components/AboutSection.vue";
import HeaderSection from "@/components/HeaderSection.vue";
import HeroSection from "@/components/HeroSection.vue";
import MissionSection from "@/components/MissionSection.vue";
import HeroScene from "@/components/Scene/HeroScene.vue";
import ScreenLoader from "@/components/ScreenLoader.vue";
</script>

<template>
  <ScreenLoader />
  <HeaderSection />
  <HeroScene />
  <!-- <main id="main-container" class="show"> -->
  <main id="main-container">
    <HeroSection />
    <section class="content-wrapper">
      <AboutSection />
      <MissionSection />
    </section>
  </main>
</template>
