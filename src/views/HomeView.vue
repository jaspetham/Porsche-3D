<script setup lang="ts">
  import HeroSection from '@/components/HeroSection.vue';
  import ThreeScene from '@/components/Scene/ThreeScene.vue'
  import ScreenLoader from '@/components/ScreenLoader.vue'
</script>

<template>
  <ScreenLoader/>
  <ThreeScene/>
  <main id="main-container">
    <HeroSection/>
  </main>
</template>
