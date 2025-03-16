<script setup lang="ts">
import AboutScene from './Scene/AboutScene.vue'
</script>
<template>
  <section id="about" class="relative">
    <div class="about-overlay"></div>
    <AboutScene />
    <div class="details w-full">
      <div class="p-5 px-10">
        <p>Porsche</p>
        <p>Power</p>
        <p>Precision</p>
        <p>Passion</p>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.about-overlay {
  background-color: rgba(54, 69, 79, 0.25);
  position: absolute;
  left: 0;
  top: 0;
  width: 101%;
  height: 100%;
  border-top-left-radius: 5rem;
  border-top-right-radius: 5rem;
}
#about-scene {
  height: 100dvh;
  canvas {
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
  }
}
#about {
  .details {
    position: absolute;
    font-family: var(--ff-special);
    top: 50%;
    left: 5%;
    transform: translateY(-50%);
    display: flex;
    font-size: 90px;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--light-color);
    text-shadow: 8px 10px 10px rgba(54, 69, 79, 0.45);
  }
}
</style>
