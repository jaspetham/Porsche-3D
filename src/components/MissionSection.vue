<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useScrollStore } from "@/stores/ScrollPos";
import { SectionIdEnum } from "@/type";
import { storeToRefs } from "pinia";
import gsap from "gsap";

const bgWidth = ref<number>(100);
const scrollStore = useScrollStore();
const { scrollTargetDebounced, scrollPos } = storeToRefs(scrollStore);
const bgWidthComputed = computed(() => {
  return bgWidth.value;
});

const handleMissionScroll = () => {
  const target = document.getElementById(SectionIdEnum.MISSION);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const scrollY = scrollPos.value;
  const sectionTop = scrollY + rect.top;
  const sectionHeight = target.clientHeight;
  const windowHeight = window.innerHeight;

  const sectionExitPoint = sectionTop + sectionHeight - windowHeight;
  let targetWidth = 100;

  if (scrollY < sectionTop) {
    // before entering section
    targetWidth = 100;
  } else if (scrollY >= sectionExitPoint) {
    // after section is scrolled past (bottom edge leaves viewport)
    targetWidth = 50;
  } else {
    // inside section → interpolate width
    const progressInSection = (scrollY - sectionTop) / (sectionExitPoint - sectionTop);
    targetWidth = 100 - progressInSection * 50;
  }

  gsap.to(bgWidth, {
    value: targetWidth,
    duration: 0.5,
    ease: "power2.out", // smooth natural feel
    overwrite: "auto", // cancel overlapping animations
  });
};

watch(
  () => scrollTargetDebounced.value,
  (newValue: typeof scrollTargetDebounced.value) => {
    if (newValue === SectionIdEnum.MISSION) {
      // Add logic for when the new value is MISSION
      document.addEventListener("scroll", handleMissionScroll);
    } else {
      // Add logic for other cases
      document.removeEventListener("scroll", handleMissionScroll);
    }
  }
);
</script>
<template>
  <section id="mission" class="w-screen relative">
    <div class="grid grid-cols-2 h-full">
      <div class="relative z-10">
        <div class="mission-bg-wrapper" :style="{ width: bgWidthComputed + 'dvw' }">
          <div class="mission-bg sticky top-0 h-[100dvh]">
            <img
              src="/assets/mission/founder.avif"
              alt="mission-bg"
              class="w-full h-full object-cover aspect-video"
            />
          </div>
        </div>
      </div>
      <div class="mission-desc h-[200dvh] bg-red-500"></div>
    </div>
  </section>
</template>
<style lang="scss">
.mission-bg-wrapper {
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
}
</style>
