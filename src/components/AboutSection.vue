<script setup lang="ts">
import SectionWrapper from './common/SectionWrapper.vue'
</script>
<template>
  <section id="about" class="relative p-6 clr-primary">
    <SectionWrapper>
      <div class="about-wrapper w-full border rounded-lg flex gap-6 p-6">
        <div id="about-scene" class="flex-1 rounbd-lg"></div>
        <div class="w-full flex-1 flow">
          <p class="subtitle">A Legacy of Power, Precision, and Passion</p>
          <p class="fs-150">
            Since its inception, the Porsche GT3 RS has stood as a beacon of unrelenting
            performance. Born from the racetrack and perfected for the road, it combines motorsport
            DNA with unparalleled luxury
          </p>
        </div>
      </div>
    </SectionWrapper>
  </section>
</template>
<style lang="scss">
.about-wrapper {
  background: white;
}
#about-scene {
  height: 400px;
  width: 50%;
}
</style>
