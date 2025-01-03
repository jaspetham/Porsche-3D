<script setup lang="ts">
import SectionWrapper from './common/SectionWrapper.vue'
</script>
<template>
  <section id="about" class="relative p-6 clr-primary">
    <SectionWrapper>
      <div class="about-wrapper w-full border rounded-lg flex gap-6 p-6">
        <div id="about-scene" class="flex-1 rounbd-lg"></div>
        <div class="w-full flex-1 flex flex-col justify-center flow">
          <div>
            <p class="subtitle fs-250">A Legacy of Power, Precision, and Passion</p>
            <p class="fs-200 pt-3">
              Since its inception, the Porsche GT3 RS has stood as a beacon of unrelenting
              performance. Born from the racetrack and perfected for the road, it combines
              motorsport DNA with unparalleled luxury
            </p>
          </div>
          <div>
            <p class="subtitle fs-250">Philosophy</p>
            <p class="fs-200 pt-3">
              Every line, every curve, and every roar of the engine tells a story of dedication to
              excellence. From its lightweight design to its cutting-edge aerodynamics, the GT3 RS
              is crafted for those who demand the extraordinary.
            </p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  </section>
</template>
<style lang="scss">
.about-wrapper {
  background: #060f16;
  color: white;
}
#about-scene {
  height: 400px;
  width: 50%;
}
</style>
