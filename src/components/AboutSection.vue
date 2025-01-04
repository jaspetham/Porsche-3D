<script setup lang="ts">
import AboutScene from './Scene/AboutScene.vue'
</script>
<template>
  <section id="about" class="relative clr-primary">
    <AboutScene />
    <!-- <div class="w-full flex-1 flex flex-col justify-center flow">
        <div>
          <p class="subtitle fs-250">A Legacy of Power, Precision, and Passion</p>
          <p class="fs-200 pt-3">
            Since its inception, the Porsche GT3 RS has stood as a beacon of unrelenting
            performance. Born from the racetrack and perfected for the road, it combines motorsport
            DNA with unparalleled luxury
          </p>
        </div>
        <div>
          <p class="subtitle fs-250">Philosophy</p>
          <p class="fs-200 pt-3">
            Every line, every curve, and every roar of the engine tells a story of dedication to
            excellence. From its lightweight design to its cutting-edge aerodynamics, the GT3 RS is
            crafted for those who demand the extraordinary.
          </p>
        </div>
      </div> -->
  </section>
</template>
<style lang="scss">
.about-wrapper {
  background: #060f16;
  color: white;
}
#about-scene {
  height: 80dvh;
  canvas {
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
  }
}
</style>
