<script setup lang="ts">
import { ref, watch } from "vue";
import type { aboutDataInterface } from "@/type";
import { detailsInfoEnum } from "@/type";
import AboutScene from "./Scene/AboutScene.vue";
import DetailPage from "./common/DetailPage.vue";
import aboutData from "@/assets/data/aboutData.json";

const aboutDataState = ref<aboutDataInterface | null>(null);

const viewDetails = (data: aboutDataInterface) => {
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
    <div class="details w-full">
      <div class="p-5 px-10">
        <div
          class="cursor-pointer detail"
          @click="viewDetails(aboutData[detailsInfoEnum.porsche])"
          data-aos="fade-right"
        >
          Porsche
        </div>
        <div
          class="cursor-pointer detail"
          @click="viewDetails(aboutData[detailsInfoEnum.power])"
          data-aos="fade-right"
          data-aos-delay="50"
        >
          Power
        </div>
        <!-- https://www.elferspot.com/en/magazin/porsche-active-aerodynamics-paa/ -->
        <div
          class="cursor-pointer detail"
          @click="viewDetails(aboutData[detailsInfoEnum.percision])"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          Precision
        </div>
        <!-- https://www.porsche.com/international/accessoriesandservice/exclusive-manufaktur/ -->
        <div
          class="cursor-pointer detail"
          @click="viewDetails(aboutData[detailsInfoEnum.passions])"
          data-aos="fade-right"
          data-aos-delay="150"
        >
          Passions
        </div>
      </div>
    </div>
    <Transition name="detail">
      <DetailPage
        v-if="aboutDataState != null"
        :data="aboutDataState"
        @close="handleClose"
      />
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
  border-top-left-radius: 5rem;
  border-top-right-radius: 5rem;
}
#about-scene {
  height: 100dvh;
  canvas {
    border-top-left-radius: 5rem;
    border-top-right-radius: 5rem;
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
    font-size: 70px;
    font-weight: bold;
    text-transform: uppercase;
    color: var(--light-color);
    text-shadow: 8px 10px 10px rgba(54, 69, 79, 0.45);
    .detail {
      position: relative;
      transition: all 0.3s ease;
      &:hover {
        transform: scale(1.1);
        color: var(--font-color);
        text-shadow: 4px 4px 10px white;
      }
    }
  }
}

/* Transition for DetailPage */
.detail-enter-active {
  transition: opacity 0.5s ease; /* Fade-in duration */
}

.detail-leave-active {
  transition: opacity 0.5s ease 0.5s; /* Fade-out duration with 1s delay */
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
  transition: transform 0.25s ease 0.5s; /* Transform with 1s delay after fade-in */
}

.detail-leave-active .detail-bg {
  transition: transform 0.25s ease; /* Transform immediately on leave */
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
