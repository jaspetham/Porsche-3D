<script setup lang="ts">
import type { AboutDataInterface } from "@/type";
import { onMounted, onUnmounted, ref, nextTick } from "vue";
import { gsap } from "gsap";
import CustomButton from "./CustomButton.vue";

const props = defineProps<{
  data: AboutDataInterface;
}>();

const emit = defineEmits<{
  (e: "close"): void;
}>();

const closeDetail = () => {
  closing.value = true;
  pageCloseAnimation(() => {
    emit("close"); // Emit the close event after the animation finishes
  });
};

const startAnimation = ref<boolean>(true);
const closing = ref<boolean>(false);
const titleRef = ref<HTMLElement | null>(null);
const detailBoxRef = ref<HTMLElement | null>(null);
const currentImageIndex = ref<number>(0);

const cycleImages = () => {
  currentImageIndex.value = (currentImageIndex.value + 1) % props.data.images.length;
};

const pageAnimation = () => {
  if (titleRef.value) {
    const characters = titleRef.value.querySelectorAll("span");
    gsap
      .timeline()
      .fromTo(
        characters,
        {
          opacity: 0, // Start with opacity 0
        },
        {
          opacity: 1, // Fade-in faster
          duration: 0.75, // Shorter duration for opacity
          stagger: 0.05, // Delay between each character
          ease: "power2.out",
        }
      )
      .fromTo(
        characters,
        {
          y: 50, // Start 50px above the original position
        },
        {
          y: 0, // Move to the original position
          duration: 0.75, // Longer duration for the upward movement
          stagger: 0.1, // Same stagger as opacity
          ease: "power2.out",
        },
        "<"
      );
  }
  if (detailBoxRef.value) {
    gsap
      .timeline()
      .fromTo(
        detailBoxRef.value,
        { height: "0" }, // Start with height 0%
        {
          height: "100%", // Animate to height 100%
          duration: 0.75, // Duration for the height animation
          ease: "power2.out", // Smooth easing
        }
      )
      .fromTo(
        document.querySelector(".context-detail"),
        {
          opacity: 0, // Start with opacity 0
        },
        {
          opacity: 1, // Fade-in faster
          duration: 0.25, // Shorter duration for opacity
          ease: "power2.out",
        },
        "-=0.25"
      );
  }
};

const pageCloseAnimation = (onComplete: () => void) => {
  const closeButton = document.querySelector(".detail-close");
  if (titleRef.value) {
    const characters = titleRef.value.querySelectorAll("span");
    gsap
      .timeline()
      .fromTo(
        characters,
        {
          opacity: 1, // Start with opacity 0
        },
        {
          opacity: 0, // Fade-in faster
          duration: 0.75, // Shorter duration for opacity
          ease: "power2.out",
        }
      )
      .fromTo(
        characters,
        {
          y: 0, // Start 50px above the original position
        },
        {
          y: 50, // Move to the original position
          duration: 0.75, // Longer duration for the upward movement
          stagger: 0.05,
          ease: "power2.out",
        },
        "<"
      );
  }
  if (detailBoxRef.value) {
    gsap
      .timeline()
      .fromTo(
        document.querySelector(".context-detail"),
        {
          opacity: 1, // Start with opacity 0
        },
        {
          opacity: 0, // Fade-in faster
          duration: 0.1, // Shorter duration for opacity
          ease: "power2.out",
        },
        "<"
      )
      .fromTo(
        detailBoxRef.value,
        { height: "100%" }, // Start with height 0%
        {
          height: "0", // Animate to height 100%
          duration: 0.75, // Duration for the height animation
          ease: "power2.out", // Smooth easing
        }
      )
      .call(onComplete, undefined, "-=0.4")
      .fromTo(
        closeButton,
        {},
        {
          width: 0, // Fade-in faster
          duration: 1.5, // Shorter duration for opacity
          ease: "power2.out",
        },
        "<"
      )
      .fromTo(
        closeButton,
        {
          opacity: 1, // Start with opacity 0
        },
        {
          opacity: 0,
          duration: 0.5, // Shorter duration for opacity
          ease: "power2.out",
        },
        "<"
      );
  }
};
let intervalId: NodeJS.Timeout | null = null;
onMounted(() => {
  intervalId = setInterval(cycleImages, 250);
  nextTick(() => {
    pageAnimation();
  });
});
onUnmounted(() => {
  if (intervalId !== null) {
    clearInterval(intervalId);
  }
});
</script>
<template>
  <section :class="'detail-page ' + `${startAnimation ? 'start' : ''}`">
    <div class="detail-bg" :style="{ backgroundImage: `url(${props.data.backgroundImage})` }"></div>
    <div class="flex flex-col md:flex-row relative h-full">
      <div class="hidden md:block md:flex-1"></div>
      <div ref="detailBoxRef" class="context flex-1 h-full">
        <div class="flex w-full justify-between items-start p-4 sm:p-7">
          <p ref="titleRef" class="font-bold text-4xl md:text-6xl uppercase animated-title">
            <span v-for="(char, index) in props.data.title.split('')" :key="index">
              {{ char }}
            </span>
          </p>
          <CustomButton class="detail-close text-xs sm:text-sm md:text-base" @click="closeDetail" text="Close"
            themeColor="var(--font-color)" />
        </div>
        <div class="context-detail flow mt-3 md:mt-15 w-11/12 sm:w-10/12 md:w-5/6 mx-auto">
          <div class="detail-img-slide mx-auto w-full sm:w-4/5 md:w-3/5 lg:w-2/4">
            <div class="detail-img" :style="{ backgroundImage: `url(${props.data.images[currentImageIndex]})` }"></div>
          </div>
          <p class="text-base md:text-2xl ff-p-medium">
            {{ props.data.description }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
<style lang="scss">
.detail-page {
  position: fixed;
  left: 0;
  top: 0;
  width: 100dvw;
  height: 100dvh;
  padding: 1rem;
  background-color: var(--dark-color);

  @media (min-width: 640px) {
    padding: 1.5rem;
  }

  @media (min-width: 768px) {
    padding: 2rem;
  }
}

.detail-bg {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: -1;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.25s ease;

  @media (min-width: 768px) {
    background-position: -10rem 40%;
  }
}

.context {
  background-color: white;
}

.detail-img {
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  aspect-ratio: 16/9;
  width: 100%;
  height: clamp(200px, 45dvh, 450px);

  @media (min-width: 768px) {
    aspect-ratio: 16/10;
    height: clamp(200px, 40dvh, 350px);
  }
}

.animated-title {
  display: flex;
  flex-wrap: wrap;
}
</style>
