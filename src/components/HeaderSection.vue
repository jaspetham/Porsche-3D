<script setup lang="ts"></script>
<template>
  <header id="header" class="header-wrapper">
    <nav class="flex justify-center gap-8">
      <RouterLink class="header-link fs-300" to="/">Home</RouterLink>
      <RouterLink class="header-link fs-300" to="/">About</RouterLink>
      <RouterLink class="header-link fs-300" to="/">Performance</RouterLink>
      <RouterLink class="header-link fs-300" to="/">Design</RouterLink>
    </nav>
  </header>
</template>
<style lang="scss">
  .header-wrapper{
    position: fixed;
    top:0;
    left:0;
    z-index: 9999;
    width:100%;
    height:var(--header-h);
    display:flex;
    align-items: center;
    justify-content: center;
    transition: all 2s ease;
    opacity: 0;
    transition-delay: 4s;
    &.show{
      opacity:1
    }
  }
</style>
