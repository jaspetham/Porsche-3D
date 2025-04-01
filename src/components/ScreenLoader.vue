<script lang="ts" setup>
import { useCanvasStore } from "@/stores/CanvasInstance";
import { ref, onMounted } from "vue";
import { gsap } from "gsap";

const isLoaded = ref(false);
const canvasStore = useCanvasStore();

const startAnimation = () => {
  if (canvasStore.canvasInstance) {
    canvasStore.canvasInstance.startAudio();
  }
};

const applyTextEffect = () => {
  const headlines = document.querySelectorAll(".headline span");

  headlines.forEach((char, index) => {
    // Initial state: hidden
    gsap.set(char, { opacity: 0, y: 20 }); // Start slightly below with opacity 0

    // Create a timeline for each character
    const tl = gsap.timeline({ delay: index * 0.1 }); // Stagger the animations by 0.1s

    // Typewriter effect: fade in with a slight bounce
    tl.to(char, {
      opacity: 1, // Fade in
      y: 0, // Move to original position
      duration: 0.3, // Duration of the fade-in and bounce
      ease: "back.out(1.7)", // Back easing for a slight overshoot (bounce effect)
    });
  });
};

onMounted(() => {
  const loadingDetails = document.getElementById("loading-wrapper");
  if (loadingDetails) {
    // Create a MutationObserver to watch for class changes
    const observer = new MutationObserver(() => {
      if (loadingDetails.classList.contains("loaded")) {
        setTimeout(() => {
          isLoaded.value = true; // Update the state
          // applyTextEffect(); // Trigger the text effect
          observer.disconnect(); // Stop observing once the class is detected
        }, 1000);
      }
    });

    // Start observing the `class` attribute
    observer.observe(loadingDetails, { attributes: true, attributeFilter: ["class"] });
  }
});
</script>
<template>
  <div id="loading-text-intro">
    <video autoplay muted loop playsinline id="background-video">
      <source src="/assets/intro/intro.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    <div id="loading-wrapper" class="loading-details">
      <div id="overlay"></div>
      <div id="loading-value">0%</div>
      <div class="headlines">
        <p class="headline">
          <span
            class="inline-block relative"
            v-for="(char, index) in 'Performance'.split('')"
            :key="index"
            >{{ char }}</span
          >
        </p>
        <p class="headline">
          <span
            class="inline-block relative"
            v-for="(char, index) in 'Innovation'.split('')"
            :key="index"
            >{{ char }}</span
          >
        </p>
        <p class="headline">
          <span
            class="inline-block relative"
            v-for="(char, index) in 'Luxury'.split('')"
            :key="index"
            >{{ char }}</span
          >
        </p>
        <p class="headline">
          <span
            class="inline-block relative"
            v-for="(char, index) in 'Heritage'.split('')"
            :key="index"
            >{{ char }}</span
          >
        </p>
      </div>
      <div id="start">
        <button @click="startAnimation" class="uppercase">
          <span>Enter</span>
          <div class="icon">
            <svg
              width="40"
              height="40"
              viewBox="0 0 25 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              transform="rotate(180 0 0)"
            >
              <path
                d="M14.1085 9.28033C14.4013 8.98744 14.4013 8.51256 14.1085 8.21967C13.8156 7.92678 13.3407 7.92678 13.0478 8.21967L9.79779 11.4697C9.5049 11.7626 9.5049 12.2374 9.79779 12.5303L13.0478 15.7803C13.3407 16.0732 13.8156 16.0732 14.1085 15.7803C14.4013 15.4874 14.4013 15.0126 14.1085 14.7197L11.3888 12L14.1085 9.28033Z"
                fill="#262424"
              />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M12.3281 2C6.80528 2 2.32812 6.47715 2.32812 12C2.32812 17.5228 6.80528 22 12.3281 22C17.851 22 22.3281 17.5228 22.3281 12C22.3281 6.47715 17.851 2 12.3281 2ZM3.82812 12C3.82812 7.30558 7.6337 3.5 12.3281 3.5C17.0225 3.5 20.8281 7.30558 20.8281 12C20.8281 16.6944 17.0225 20.5 12.3281 20.5C7.6337 20.5 3.82812 16.6944 3.82812 12Z"
                fill="#262424"
              />
            </svg>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
#loading-text-intro {
  z-index: 3;
  position: absolute;
  width: 100dvw;
  height: 100dvh;
  font-family: "Josefin Sans", sans-serif;
  display: flex;
  align-content: center;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 100;
  color: #f9f0ec;
  // display: none;
}

#background-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
}

#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.35);
  z-index: -1;
}

.loading-details {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  font-family: var(--ff-special);

  &.loaded {
    #loading-value {
      opacity: 0;
      visibility: hidden;
    }
    #start {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }
    .headlines {
      .headline {
        &:nth-child(even) {
          transform: translateX(0);
        }
        &:nth-child(odd) {
          transform: translateX(0);
        }
      }
    }
  }
  #start {
    position: absolute;
    bottom: 5%;
    right: 5%;
    transition: opacity 0.75s ease, transform 0.9s ease-out;
    opacity: 0;
    visibility: hidden;
    transform: translateY(300px);
    button {
      display: flex;
      background: var(--font-color);
      color: var(--dark-color);
      font-weight: bold;
      font-size: var(--fs-350);
      padding: 0.75rem 1rem;
      gap: 2rem;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      justify-content: space-between;
      align-items: center;
    }
    .icon {
      position: relative;
      right: 0;
      transition: right 0.3s ease;
    }
    &:hover .icon {
      right: -0.75rem;
    }
  }
  #loading-value {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: 70dvh;
    font-weight: bold;
    opacity: 1;
    transition: opacity 0.5s ease, visibility 0.5s ease-out;
  }
  .headlines {
    position: absolute;
    top: 2.5%;
    left: 2.5%;
    z-index: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    text-transform: uppercase;
    .headline {
      position: relative;
      font-size: clamp(40px, 15dvw + 70px, 190px);
      font-weight: bold;
      transition: all 0.8s ease-out;
      &:nth-child(even) {
        text-align: right;
        transform: translateX(100dvw);
      }
      &:nth-child(odd) {
        text-align: left;
        transform: translateX(-100dvw);
      }
    }
  }
}
</style>
