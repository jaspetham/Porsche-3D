<script setup lang="ts">
import { ref } from 'vue';

const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};
</script>
<template>
  <!-- <header id="header" class="header-wrapper show"> -->
  <header id="header" class="header-wrapper">
    <!-- Desktop Navigation -->
    <nav class="hidden md:flex justify-center">
      <RouterLink class="header-link fs-200 font-semibold" to="/">Home</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">About</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">Performance</RouterLink>
      <RouterLink class="header-link fs-200 font-semibold" to="/">Design</RouterLink>
    </nav>

    <!-- Mobile Menu Button -->
    <div class="md:hidden absolute top-4 right-4 z-50">
      <button @click="toggleMobileMenu" class="p-2 text-white focus:outline-none" aria-label="Toggle menu">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16" />
          <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMobileMenuOpen" class="fixed inset-0 bg-black bg-opacity-80 z-40 md:hidden">
      <nav class="flex flex-col items-center justify-center h-full space-y-8">
        <RouterLink class="header-link text-2xl font-semibold text-white" @click="isMobileMenuOpen = false" to="/">
          Home
        </RouterLink>
        <RouterLink class="header-link text-2xl font-semibold text-white" @click="isMobileMenuOpen = false" to="/">
          About
        </RouterLink>
        <RouterLink class="header-link text-2xl font-semibold text-white" @click="isMobileMenuOpen = false" to="/">
          Performance
        </RouterLink>
        <RouterLink class="header-link text-2xl font-semibold text-white" @click="isMobileMenuOpen = false" to="/">
          Design
        </RouterLink>
      </nav>
    </div>
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
  align-items: center;
  justify-content: center;
  transition: all 2s ease;
  opacity: 0;
  transform: translateY(-200px);
  transition-delay: 2s;
  display: none;

  &.show {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (min-width: 768px) {
  nav {
    gap: 2rem;
  }

  @media (min-width: 1024px) {
    nav {
      gap: 50%;
    }

    .header-wrapper {
      display: flex;
    }
  }
}
</style>
