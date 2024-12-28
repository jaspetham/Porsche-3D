<script setup lang="ts">
import HeaderSection from '@/components/HeaderSection.vue'
import HeroSection from '@/components/HeroSection.vue'
import ThreeScene from '@/components/Scene/ThreeScene.vue'
import ScreenLoader from '@/components/ScreenLoader.vue'
</script>

<template>
  <ScreenLoader />
  <ThreeScene />
  <!-- <main id="main-container" class="show"> -->
  <main id="main-container">
    <HeaderSection />
    <HeroSection />
  </main>
</template>
