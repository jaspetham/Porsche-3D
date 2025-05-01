<script setup lang="ts">
import porscheLogo from "@/assets/porsche_logo.svg";
import porscheVector from "@/assets/porsche-vector-1.png";
import SectionWrapper from "./common/SectionWrapper.vue";
</script>
<template>
  <section id="hero" class="first relative">
    <SectionWrapper>
      <div class="first-title movement">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4500 300">
          <path
            d="M502 221c48.1 0 74-25.9 74-74V74c0-48.1-25.9-74-74-74H0v300h68v-79h434zm6-143v65c0 7.8-4.2 12-12 12H68V66h428c7.8 0 12 4.2 12 12zm228 222c-48.1 0-74-25.9-74-74V74c0-48.1 25.9-74 74-74h417c48.1 0 74 25.9 74 74v152c0 48.1-25.9 74-74 74H736zm411-66c7.8 0 12-4.2 12-12V78c0-7.8-4.2-12-12-12H742c-7.8 0-12 4.2-12 12v144c0 7.8 4.2 12 12 12h405zm675-36c39.844 16.757 67.853 56.1 68 102h-68c0-54-25-79-79-79h-361v79h-68V0h502c48.1 0 74 25.9 74 74v50.14c0 46.06-23.75 71.76-68 73.86zm-12-43c7.8 0 12-4.2 12-12V78c0-7.8-4.2-12-12-12h-428v89h428zm162-81c0-48.1 25.9-74 74-74h492v56h-486c-7.8 0-12 4.2-12 12v42c0 7.8 4.2 12 12 12h422c48.1 0 74 25.9 74 74v30c0 48.1-25.9 74-74 74h-492v-56h486c7.8 0 12-4.2 12-12v-42c0-7.8-4.2-12-12-12h-422c-48.1 0-74-25.9-74-74V74zm661 0c0-48.1 25.9-74 74-74h480v66h-474c-7.8 0-12 4.2-12 12v144c0 7.8 4.2 12 12 12h474v66h-480c-48.1 0-74-25.9-74-74V74zM3817 0v300h-68V183h-407v117h-68V0h68v117h407V0h68zm156 56v66h527v56h-527v66h527v56h-595V0h595v56h-527z"
          ></path>
        </svg>
      </div>
      <div class="hero-detail flex items-center justify-between w-full mt-6 ff-secondary">
        <div class="porsche-hero movement flex items-center gap-3">
          <img class="porsche-logo" :src="porscheLogo" alt="porsche logo" />
          <p class="max-w-[20ch] font-medium fs-250">
            The Porsche GT3 RS: A New Era of Performance
          </p>
        </div>
        <div>
          <img
            :src="porscheVector"
            class="porsche-vector movement"
            alt="porsche vector"
          />
        </div>
      </div>
    </SectionWrapper>
  </section>
</template>
<style lang="scss" scoped>
.first {
  height: 100dvh;
  width: 100%;
  .section-wrapper {
    padding: 2rem 0;
    padding-top: calc(var(--header-h) + 20px);
    position: fixed;
    width: 100%;
    height: 100%;
    top: 0;
    left: 50%;
    opacity: 0;
    transform: translateX(-50%);
    transition: transform 2.5s ease-in, opacity 0.5s ease-in;
  }
}
.first-title {
  width: 100%;
  height: fit-content;
  position: relative;
  transform: translateY(-40dvh);
  opacity: 0;
  path {
    fill: var(--font-color);
  }
}

.porsche-hero,
.porsche-vector {
  position: relative;
  opacity: 0;
  transform: translateX(-100dvh);
}
.porsche-hero {
  transform: translateX(-100dvh);
}
.porsche-vector {
  transform: translateX(100dvh);
}

#hero.show {
  .section-wrapper,
  .first-title,
  .porsche-hero,
  .porsche-vector {
    opacity: 1;
  }
  .first-title {
    transform: translateY(0);
  }
  .porsche-hero,
  .porsche-vector {
    transform: translateX(0);
  }
}

.porsche-logo {
  height: 80px;
}
.porsche-vector {
  height: 60px;
}
</style>
