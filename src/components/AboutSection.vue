<script setup lang="ts">
import { ref, watch } from "vue";
import { detailsInfo } from "@/type";
import AboutScene from "./Scene/AboutScene.vue";
import DetailPage from "./common/DetailPage.vue";

const detailPageState = ref<detailsInfo | null>(null);

const viewDetails = (details: detailsInfo) => {
  detailPageState.value = details;
};

const handleClose = () => {
  detailPageState.value = null;
};

watch(detailPageState, (newValue) => {
  document.body.style.overflow = newValue ? "hidden" : "";
});
</script>
<template>
  <section id="about" class="relative">
    <div class="about-overlay"></div>
    <AboutScene />
    <div class="details w-full">
      <div class="p-5 px-10">
        <div
          class="cursor-pointer"
          @click="viewDetails(detailsInfo.porsche)"
          data-aos="fade-right"
        >
          Porsche
        </div>
        <div
          class="cursor-pointer"
          @click="viewDetails(detailsInfo.power)"
          data-aos="fade-right"
          data-aos-delay="50"
        >
          Power
        </div>
        <div
          class="cursor-pointer"
          @click="viewDetails(detailsInfo.percision)"
          data-aos="fade-right"
          data-aos-delay="100"
        >
          Precision
        </div>
        <div
          class="cursor-pointer"
          @click="viewDetails(detailsInfo.passions)"
          data-aos="fade-right"
          data-aos-delay="150"
        >
          Passions
        </div>
      </div>
    </div>
    <Transition name="detail">
      <DetailPage
        v-if="detailPageState != null"
        :detail="detailPageState"
        @close="handleClose"
      />
    </Transition>
  </section>
</template>

<style lang="scss">
.about-overlay {
  background-color: rgba(54, 69, 79, 0.25);
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
