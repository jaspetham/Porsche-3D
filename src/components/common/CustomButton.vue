<script setup lang="ts">
import { defineProps, ref, watch } from "vue";
const props = defineProps({
  text: {
    type: String,
    default: "Button Text",
  },
  themeColor: {
    type: String,
    default: "var(--dark-color)",
  },
});
const emit = defineEmits<{
  (e: "clickEvent"): void;
}>();
const handleClick = () => {
  emit("clickEvent");
};
const buttonState = ref<boolean>(false);
const buttonRef = ref<HTMLElement | null>(null);

watch(
  buttonState,
  (newValue) => {
    if (buttonRef.value) {
      buttonRef.value?.classList[newValue ? "add" : "remove"]("hovered");
    }
  },
  { immediate: true }
);
</script>

<template>
  <a
    @click="handleClick"
    @mouseenter="() => (buttonState = true)"
    @mouseleave="() => (buttonState = false)"
    ref="buttonRef"
    target="_blank"
    class="primary-btn"
  >
    <div class="div-hide btn-text-wrapper">
      <div class="btn-text">{{ text }}</div>
      <div class="btn-text ab">{{ text }}</div>
    </div>
    <div class="icon-wrapper">
      <div class="arrow-small">
        <svg
          width="20"
          height="20"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(90 0 0)"
        >
          <path
            d="M19.1085 14.9053C18.8156 15.1982 18.3407 15.1982 18.0478 14.9053L12.3281 9.18566L6.60845 14.9053C6.31556 15.1982 5.84069 15.1982 5.5478 14.9053C5.2549 14.6124 5.2549 14.1376 5.5478 13.8447L11.7978 7.59467C12.0907 7.30178 12.5656 7.30178 12.8585 7.59467L19.1085 13.8447C19.4013 14.1376 19.4013 14.6124 19.1085 14.9053Z"
            :fill="themeColor"
          />
        </svg>
      </div>
      <div class="arrow-small ab">
        <svg
          width="20"
          height="20"
          viewBox="0 0 25 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          transform="rotate(90 0 0)"
        >
          <path
            d="M19.1085 14.9053C18.8156 15.1982 18.3407 15.1982 18.0478 14.9053L12.3281 9.18566L6.60845 14.9053C6.31556 15.1982 5.84069 15.1982 5.5478 14.9053C5.2549 14.6124 5.2549 14.1376 5.5478 13.8447L11.7978 7.59467C12.0907 7.30178 12.5656 7.30178 12.8585 7.59467L19.1085 13.8447C19.4013 14.1376 19.4013 14.6124 19.1085 14.9053Z"
            fill="var(--light-color)"
          />
        </svg>
      </div>
    </div>
  </a>
</template>
<style scoped lang="scss">
@mixin slide-out {
  transform: translate3d(-100%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)
    rotateZ(0deg) skew(0deg, 0deg);
}
@mixin slide-in {
  transform: translate3d(0%, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg)
    rotateZ(0deg) skew(0deg, 0deg);
}
@mixin transform-style {
  transform-style: preserve-3d;
}
@mixin transition($property, $duration, $easing) {
  transition: $property $duration $easing;
}

@mixin button-base {
  align-items: center;
  border: 1px solid var(--dark-color);
  border-bottom-right-radius: 15px;
  color: var(--dark-color);
  cursor: pointer;
  display: flex;
  font-weight: bold;
  font-size: var(--fs-200);
  gap: 0.25rem;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  text-transform: uppercase;
  text-decoration: none;
  transition: background-color 0.4s;
}

.primary-btn {
  @include button-base;
  border: 1px solid v-bind("themeColor");
  color: v-bind("themeColor");
  .btn-text-wrapper {
    .btn-text {
      letter-spacing: -0.5px;
      text-transform: uppercase;
      font-family: var(--ff-primary);
      font-weight: 800;
      @include slide-in;
      @include transform-style;
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      &.ab {
        @include slide-out;
        color: var(--light-color);
      }
    }
  }
  .icon-wrapper {
    position: relative;
    overflow: hidden;
    .arrow-small {
      @include slide-in;
      @include transform-style;
      transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
      &.ab {
        @include slide-out;
      }
    }
  }
  &.hovered {
    background: v-bind("themeColor");
    border-color: var(--light-color);
    .btn-text-wrapper .btn-text,
    .icon-wrapper .arrow-small {
      @include slide-out;

      &.ab {
        @include slide-in;
      }
    }
  }
}
.ab {
  position: absolute;
  inset: 0% auto auto 0%;
}
</style>
