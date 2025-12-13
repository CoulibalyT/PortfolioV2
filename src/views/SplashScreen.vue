<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";
import { useTheme } from "@/composables/useTheme";

const router = useRouter();
const { isDarkMode } = useTheme();
const counter = ref(0);

onMounted(() => {
  const tl = gsap.timeline();

  // Counter animation
  const counterInterval = setInterval(() => {
    if (counter.value < 100) {
      counter.value += Math.floor(Math.random() * 5) + 1;
      if (counter.value > 100) counter.value = 100;
    } else {
      clearInterval(counterInterval);
    }
  }, 30);

  // Text Reveal Animation
  tl.from(".char", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: "power4.out",
    delay: 0.2
  })
  .from(".subtitle", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.5")
  .to([".counter", ".progress-bar"], {
    opacity: 0,
    duration: 0.5,
    delay: 1.5 // Wait for counter to finish roughly
  })
  .to([".title-wrapper", ".subtitle"], {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.in",
    stagger: 0.1
  })
  .to(".splash-screen", {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.8,
    ease: "power4.inOut",
    onComplete: () => {
      sessionStorage.setItem('hasShownSplash', 'true');
      const redirectPath = sessionStorage.getItem('redirectPath') || "/";
      sessionStorage.removeItem('redirectPath');
      router.push(redirectPath);
    }
  }, "-=0.2");
});

// Helper to split text for animation
const title = "Tene Coulibaly".split("");
</script>

<template>
  <div class="splash-screen bg-white dark:bg-black text-black dark:text-white">
    <div class="content-wrapper relative z-10 flex flex-col items-center justify-center h-full w-full">
      
      <div class="title-wrapper overflow-hidden flex">
        <span 
          v-for="(char, index) in title" 
          :key="index" 
          class="char text-4xl md:text-6xl font-thin inline-block"
          :class="{ 'mr-2': char === ' ' }"
        >
          {{ char }}
        </span>
      </div>

      <div class="overflow-hidden mt-2">
        <p class="subtitle text-sm md:text-base text-gray-500 dark:text-gray-400 tracking-[0.2em] uppercase">
          Portfolio &copy; 2026
        </p>
      </div>

      <!-- Progress Bar -->
      <div class="progress-bar absolute bottom-0 left-0 w-full h-1 bg-gray-100 dark:bg-gray-900">
        <div 
          class="h-full bg-black dark:bg-white transition-all duration-100 ease-out"
          :style="{ width: counter + '%' }"
        ></div>
      </div>

      <div class="absolute bottom-10 right-10 overflow-hidden">
        <p class="counter text-6xl md:text-8xl font-bold opacity-20 font-mono">
          {{ counter }}%
        </p>
      </div>

    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 9999;
}
</style>
