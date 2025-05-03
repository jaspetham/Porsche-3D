<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
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

const texts = [
  "PORSCHE - PORSCHE",
  "PERFECTIONIST - PERFECTIONIST",
  "PHILOSOPHY - PHILOSOPHY",
  "PORSCHE - PORSCHE",
  "PERFECTIONIST - PERFECTIONIST",
  "PHILOSOPHY - PHILOSOPHY",
];

const textElements = ref<HTMLParagraphElement[]>([]);
const positions = ref<number[]>(texts.map((_, i) => -i * 5));

const handleMissionScroll = () => {
  const target = document.getElementById(SectionIdEnum.MISSION);
  if (!target) return;

  const rect = target.getBoundingClientRect();
  const scrollY = scrollPos.value;
  const sectionTop = scrollY + rect.top;
  const windowHeight = window.innerHeight;

  const sectionExitPoint = sectionTop + windowHeight;
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
    duration: 1,
    ease: "power3.out",
    overwrite: "auto",
  });

  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const mappedValue = gsap.utils.mapRange(0, maxScroll, -30, 30, scrollY);

  // update each position relative to mappedValue
  positions.value = positions.value.map((_, index) => {
    const direction = index % 2 === 0 ? 1 : -1;
    return mappedValue * direction;
  });
};

const currentImageIndex = ref<number>(0);
const founderImages = [
  "/assets/mission/founder-1.avif",
  "assets/mission/founder-2.avif",
  "assets/mission/founder-3.avif",
];
const cycleImages = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % founderImages.length;
};

let intervalId: ReturnType<typeof setInterval> | null = null;
onMounted(() => {
  intervalId = setInterval(cycleImages, 500);
});
onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
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
            <div class="w-full h-full">
              <img
                src="/assets/mission/founder.avif"
                alt="mission-bg"
                class="w-full h-full object-cover aspect-video"
              />
              <div class="overlay z-10"></div>
            </div>
            <div class="mission-nav-wrapper mix-blend-difference z-20">
              <ul class="mission-nav font-bold text-white">
                <li class="fs-200">Founder</li>
                <li class="fs-400 cursor-pointer">His Story</li>
                <li class="fs-400 cursor-pointer">His Passion</li>
                <li class="fs-400 cursor-pointer">His Legacy</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div class="mission-desc p-10 flex flex-col gap-20">
        <div class="h-[150vh]"></div>
        <div class="min-h-screen" id="story">
          <div
            class="content font-bold uppercase ff-primary clr-dark flex flex-col gap-3"
          >
            <h2 class="fs-900 ff-primary">Ferdinand Alexander Porsche</h2>
            <p class="fs-600 tracking-tighter mt-12">
              The founder of Porsche Design. The legacy of professor Ferdinand Alexander
              Porsche. Perfection since 1972. A philosophy that follows the zeitgeist.
            </p>
            <div
              class="moving-text-wrapper overflow-hidden relative w-full h-[75vh] mt-12 p-y-10"
            >
              <div class="moving-img">
                <img
                  :src="founderImages[currentImageIndex]"
                  alt="professor"
                  class="w-full h-full object-cover"
                />
              </div>
              <img
                src="/assets/mission/pixel-bg.jpg"
                alt="pixel-bg"
                class="absolute w-full h-full object-cover mix-blend-saturation z-[1]"
              />
              <p
                v-for="(text, index) in texts"
                :key="index"
                ref="textElements"
                class="text-[150px] whitespace-nowrap leading-none"
                :style="{ transform: `translate3d(${positions[index]}%, 0, 0)` }"
              >
                {{ text }}
              </p>
            </div>
            <div class="mt-12 flex flex-col gap-6">
              <p class="fs-300 font-normal">
                In 1963, Prof. Ferdinand Alexander Porsche created one of the most iconic
                design objects in contemporary history: the Porsche 911. Following his
                vision to extend the Porsche principles and legend beyond the automotive
                world, he founded the exclusive lifestyle brand Porsche Design in 1972.
                His philosophy and design language can still be seen in all Porsche Design
                products today.
              </p>
              <q class="fs-600">
                If you analyze the function of an object, its form often becomes obvious.
              </q>
            </div>
          </div>
        </div>
        <hr />
        <div class="min-h-screen" id="passion">
          <div
            class="content font-bold uppercase ff-primary clr-dark flex flex-col gap-3"
          >
            <h2 class="fs-900 ff-primary">Passion</h2>
            <p class="fs-600 tracking-tighter mt-12">
              A success story High quality and exceptional design
            </p>
            <img
              src="/assets/mission/passion.avif"
              alt="passion"
              class="w-10/12 aspect-auto h-full object-cover"
            />
            <div class="mt-12 flex flex-col gap-6">
              <p class="fs-300 font-normal">
                The unique characteristics of the brand can be traced back to the founder
                of the company, his personality and his story: the eldest of Dorothea and
                Ferry Porsche's four sons, he was born on December 11, 1935, and spent a
                lot of time as a child in his grandfather's design offices and development
                facilities in Stuttgart. In 1943 the family moved to Austria and Prof.
                Ferdinand Alexander Porsche attended school in Zell am See.
              </p>
            </div>
          </div>
        </div>
        <hr />
        <div class="min-h-screen" id="legacy">
          <div
            class="content font-bold uppercase ff-primary clr-dark flex flex-col gap-3"
          >
            <h2 class="fs-900 ff-primary">His Legacy</h2>
            <p class="fs-600 tracking-tighter mt-12">
              A visionary who redefined automotive design, blending innovation with iconic
              simplicity.
            </p>
            <img
              src="/assets/mission/legacy.avif"
              alt="legacy"
              class="w-11/12 aspect-auto h-[500px] object-cover"
            />
            <div class="mt-12 flex flex-col gap-6">
              <p class="fs-300 font-normal">
                Ferdinand Alexander Porsche revolutionized automotive design with the
                creation of the iconic Porsche 911, a car that became a symbol of timeless
                engineering and elegance. His philosophy of “designing beyond trends”
                established a legacy that influenced not only sports cars but industrial
                design worldwide. Every curve and contour of his work embodied a balance
                between aesthetics and performance, setting a benchmark that continues to
                inspire designers and engineers today.
              </p>
            </div>
          </div>
        </div>
      </div>
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
.mission-nav-wrapper {
  position: absolute;
  left: 0;
  top: 0;
  display: flex;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
}

.mission-nav li {
  &:not(:first-child):hover {
    color: var(--font-color);
  }
}

.mission-desc {
  background: white;
}
.moving-text-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  p {
    transform-style: preserve-3d;
  }
}

.moving-img {
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 10;
  height: 60%;
  width: 60%;
  transform: translate(-50%, -50%);
}
</style>
