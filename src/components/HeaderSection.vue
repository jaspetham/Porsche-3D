<script setup lang="ts"></script>
<template>
  <!-- <header id="header" class="header-wrapper show"> -->
  <header id="header" class="header-wrapper">
    <nav class="flex justify-center">
      <RouterLink class="header-link fs-200 font-semibold" to="/">Home</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">About</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">Performance</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">Design</RouterLink>
    </nav>
  </header>
</template>
<style lang="scss">
.header-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: var(--header-h);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 2s ease;
  opacity: 0;
  transform: translateY(-200px);
  transition-delay: 2s;
  &.show {
    opacity: 1;
    transform: translateY(0);
  }
}
nav {
  gap: 50%;
}
</style>
