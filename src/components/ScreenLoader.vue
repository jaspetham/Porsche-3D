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
  const headlines = document.querySelectorAll(".headline");

  headlines.forEach((headline, headlineIndex) => {
    const chars = headline.querySelectorAll("span");

    // Initial state for the headline (container)
    gsap.set(headline, { opacity: 0 }); // Just fade in, no width animation

    // Initial state for each character
    chars.forEach((char) => {
      gsap.set(char, { x: -100, opacity: 0 }); // Start off-screen to the left
    });

    // Create a timeline for the headline
    const tl = gsap.timeline({ delay: headlineIndex * 0.2 }); // Stagger headlines by 0.2s

    // Fade in the headline (container)
    tl.to(headline, {
      opacity: 1, // Fade in
      duration: 0.7, // Duration of the fade-in
      ease: "power2.out",
    });

    // Animate each character
    chars.forEach((char, charIndex) => {
      const charTl = gsap.timeline({ delay: charIndex * 0.2 }); // Stagger characters by 0.05s
      charTl.to(char, {
        x: 0, // Slide to original position
        opacity: 1, // Fade in
        duration: 1.2, // Duration of the slide
        ease: "power3.out",
      });
    });
  });
};

const headlinesColor = (isHover: boolean) => {
  const headlines = document.querySelectorAll(".headline");
  headlines.forEach((headline) => {
    const chars = headline.querySelectorAll("span");
    chars.forEach((char, index) => {
      gsap.to(char, {
        color: isHover ? "var(--font-color)" : "white",
        duration: 0.5,
        delay: index * 0.05,
      });
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
          applyTextEffect(); // Trigger the text effect
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
    <div
      class="intro-img"
      :style="{ opacity: isLoaded ? 0 : 1, transition: 'opacity 1.5s ease-out' }"
      v-if="!isLoaded || isLoaded"
    ></div>
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
        <button
          @mouseover="headlinesColor(true)"
          @mouseleave="headlinesColor(false)"
          @click="startAnimation"
          class="uppercase"
        >
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

.intro-img {
  background-image: url("/assets/intro/intro.webp");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100%;
  position: absolute;
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
      padding: 0.75rem 2rem;
      gap: 2rem;
      border-top-right-radius: 20px;
      border-bottom-left-radius: 20px;
      border-bottom-right-radius: 20px;
      justify-content: space-between;
      align-items: center;
      &:hover {
        background: white;
        color: var(--font-color);
      }
    }
    .icon {
      position: relative;
      right: 0;
      transition: right 0.3s ease;
    }
    &:hover .icon {
      right: -0.75rem;
      border-radius: 50%;
      path {
        fill: var(--font-color);
      }
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
    font-family: var(--ff-primary);
    text-shadow: 1px 17px 1px var(--font-color);
  }
  .headlines {
    position: absolute;
    top: 2.5%;
    left: 2.5%;
    width: fit-content;
    z-index: 1;
    display: flex;
    flex-direction: column;
    line-height: 1.1;
    text-transform: uppercase;
    .headline {
      position: relative;
      font-size: clamp(40px, 8dvw + 40px, 160px);
      font-weight: bold;
      transition: all 0.8s ease-out;
      opacity: 0;
      &:nth-child(even) {
        text-align: right;
      }
      &:nth-child(odd) {
        text-align: left;
      }
    }
  }
}
</style>
