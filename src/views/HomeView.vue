<script setup lang="ts">
import AboutSection from '@/components/AboutSection.vue'
import HeaderSection from '@/components/HeaderSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import ThreeScene from '@/components/Scene/ThreeScene.vue'
import ScreenLoader from '@/components/ScreenLoader.vue'
</script>

<template>
  <ScreenLoader />
  <HeaderSection />
  <ThreeScene />
  <!-- <main id="main-container" class="show"> -->
  <main id="main-container">
    <HeroSection />
    <section class="content-wrapper">
      <AboutSection />
    </section>
  </main>
</template>
