<script setup>
import { onMounted, ref } from "vue";
import gsap from "gsap";
import { useTheme } from "@/composables/useTheme";

const emit = defineEmits(['complete']);
const { isDarkMode } = useTheme();
const counter = ref(0);

onMounted(() => {
  const tl = gsap.timeline();

  const counterInterval = setInterval(() => {
    if (counter.value < 100) {
      counter.value += Math.floor(Math.random() * 5) + 1;
      if (counter.value > 100) counter.value = 100;
    } else {
      clearInterval(counterInterval);
    }
  }, 30);

  tl.from(".splash-char", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: "power4.out",
    delay: 0.2
  })
  .from(".splash-subtitle", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.5")
  .to([".splash-counter", ".splash-progress-bar"], {
    opacity: 0,
    duration: 0.5,
    delay: 1.5
  })
  .to([".splash-title-wrapper", ".splash-subtitle"], {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.in",
    stagger: 0.1
  })
  .to(".splash-overlay", {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.8,
    ease: "power4.inOut",
    onComplete: () => {
      emit('complete');
    }
  }, "-=0.2");
});

const title = "Tene Coulibaly".split("");
</script>

<template>
  <div class="splash-overlay bg-white dark:bg-black text-black dark:text-white" aria-hidden="true">
    <div class="content-wrapper relative z-10 flex flex-col items-center justify-center h-full w-full">

      <div class="splash-title-wrapper overflow-hidden flex">
        <span
          v-for="(char, index) in title"
          :key="index"
          class="splash-char text-4xl md:text-6xl font-thin inline-block"
          :class="{ 'mr-2': char === ' ' }"
        >
          {{ char }}
        </span>
      </div>

      <div class="overflow-hidden mt-2">
        <p class="splash-subtitle text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase">
          Portfolio &copy; 2026
        </p>
      </div>

      <div class="splash-progress-bar absolute bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-900">
        <div
          class="h-full bg-black dark:bg-white transition-all duration-100 ease-out"
          :style="{ width: counter + '%' }"
        ></div>
      </div>

      <div class="absolute bottom-10 right-10 overflow-hidden">
        <p class="splash-counter text-6xl md:text-8xl font-bold opacity-20 font-mono">
          {{ counter }}%
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.splash-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
  pointer-events: none;
}
</style>
