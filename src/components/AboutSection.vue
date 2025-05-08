<script setup lang="ts">
import { ref, watch } from "vue";
import type { AboutDataInterface } from "@/type";
import { DetailsInfoEnum } from "@/type";
import AboutScene from "./Scene/AboutScene.vue";
import DetailPage from "./common/DetailPage.vue";
import aboutData from "@/assets/data/aboutData.json";

const aboutDataState = ref<AboutDataInterface | null>(null);

const viewDetails = (data: AboutDataInterface) => {
  aboutDataState.value = data;
};

const handleClose = () => {
  aboutDataState.value = null;
};
watch(aboutDataState, (newValue) => {
  document.body.style.overflowY = newValue != null ? "hidden" : "auto";
});
</script>
<template>
  <section id="about" class="relative">
    <div class="about-overlay"></div>
    <AboutScene />
    <div class="details">
      <div class="p-3 sm:p-5 sm:px-10">
        <div class="cursor-pointer detail fs-600" @click="viewDetails(aboutData[DetailsInfoEnum.PORSCHE])"
          data-aos="fade-right">
          Porsche
        </div>
        <div class="cursor-pointer detail fs-600" @click="viewDetails(aboutData[DetailsInfoEnum.POWER])"
          data-aos="fade-right" data-aos-delay="50">
          Power
        </div>
        <!-- https://www.elferspot.com/en/magazin/porsche-active-aerodynamics-paa/ -->
        <div class="cursor-pointer detail fs-600" @click="viewDetails(aboutData[DetailsInfoEnum.PERCISION])"
          data-aos="fade-right" data-aos-delay="100">
          Precision
        </div>
        <!-- https://www.porsche.com/international/accessoriesandservice/exclusive-manufaktur/ -->
        <div class="cursor-pointer detail fs-600" @click="viewDetails(aboutData[DetailsInfoEnum.PASSIONS])"
          data-aos="fade-right" data-aos-delay="150">
          Passions
        </div>
      </div>
    </div>
    <Transition name="detail">
      <DetailPage v-if="aboutDataState != null" :data="aboutDataState" @close="handleClose" />
    </Transition>
  </section>
</template>

<style lang="scss">
.about-overlay {
  background-color: rgba(0, 0, 0, 0.3);
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-top-left-radius: 2rem;
  border-top-right-radius: 2rem;

  @media (min-width: 768px) {
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
  }
}

#about-scene {
  height: 100dvh;

  canvas {
    width: 100% !important;
    border-top-left-radius: 2rem;
    border-top-right-radius: 2rem;

    @media (min-width: 768px) {
      border-top-left-radius: 5rem;
      border-top-right-radius: 5rem;
    }
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
    font-weight: bold;
    text-transform: uppercase;
    color: var(--light-color);
    text-shadow: 4px 5px 5px rgba(54, 69, 79, 0.45);

    @media (min-width: 768px) {
      text-shadow: 8px 10px 10px rgba(54, 69, 79, 0.45);
    }

    .detail {
      position: relative;
      transition: all 0.3s ease;
      margin-bottom: 0.5rem;

      @media (min-width: 768px) {
        margin-bottom: 1rem;
      }

      &:hover {
        transform: scale(1.1);
        color: var(--font-color);
        text-shadow: 2px 2px 5px white;

        @media (min-width: 768px) {
          text-shadow: 4px 4px 10px white;
        }
      }
    }
  }
}

/* Transition for DetailPage */
.detail-enter-active {
  transition: opacity 0.5s ease;
  /* Fade-in duration */
}

.detail-leave-active {
  transition: opacity 0.5s ease 0.5s;
  /* Fade-out duration with 1s delay */
}

.detail-enter-from,
.detail-leave-to {
  opacity: 0;
}

.detail-enter-to,
.detail-leave-from {
  opacity: 1;
}

.detail-enter-active .detail-bg {
  transition: transform 0.25s ease 0.5s;
  /* Transform with 1s delay after fade-in */
}

.detail-leave-active .detail-bg {
  transition: transform 0.25s ease;
  /* Transform immediately on leave */
}

.detail-enter-from .detail-bg,
.detail-leave-to .detail-bg {
  transform: rotate(-10deg) scale(1.35);
}

.detail-enter-to .detail-bg,
.detail-leave-from .detail-bg {
  transform: rotate(0deg) scale(1);
}
</style>
