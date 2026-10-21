<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import gsap from "gsap";
import { useTheme } from "@/composables/useTheme";

const emit = defineEmits(['complete']);
const { isDarkMode } = useTheme();
const counter = ref(0);

const logo = ref(null);
const logoWink = ref(null);

// Sparkles around the logo, positioned in % of the logo box (size = % of its width)
const sparkles = [
  { x: -16, y: 18, size: 20 },
  { x: 112, y: 8, size: 12 },
  { x: -6, y: 82, size: 9 },
  { x: 116, y: 68, size: 17 },
  { x: 18, y: -6, size: 7 },
];
let twinkles = [];

onMounted(async () => {
  // Wait for both frames so the pop-in and the wink never show an empty box
  await Promise.all([logo.value, logoWink.value].map((img) => img?.decode?.().catch(() => {})));
  const tl = gsap.timeline();

  const counterInterval = setInterval(() => {
    if (counter.value < 100) {
      counter.value += Math.floor(Math.random() * 5) + 1;
      if (counter.value > 100) counter.value = 100;
    } else {
      clearInterval(counterInterval);
    }
  }, 30);

  gsap.set([".splash-sparkle", ".splash-sparkle-wink"], { xPercent: -50, yPercent: -50 });
  gsap.set(".splash-sparkle-wink", { scale: 0 });

  // Idle twinkle on the inner shape, so it never fights the entrance tween on the wrapper
  twinkles = gsap.utils.toArray(".splash-sparkle .splash-sparkle-shape").map((el, i) =>
    gsap.to(el, {
      scale: 0.55,
      rotation: 45,
      duration: 0.9 + i * 0.17,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 1 + i * 0.23
    })
  );

  tl.from(".splash-logo", {
    scale: 0.6,
    opacity: 0,
    duration: 0.9,
    ease: "back.out(1.7)",
    delay: 0.2
  })
  // Sparkles pop in with the quarter turn of the animated star
  .from(".splash-sparkle", {
    scale: 0,
    rotation: 90,
    opacity: 0,
    duration: 0.6,
    stagger: 0.1,
    ease: "back.out(2)"
  }, "-=0.5")
  .from(".splash-char", {
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.05,
    ease: "power4.out"
  }, "-=0.5")
  .from(".splash-subtitle", {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.5")
  // Wink: swap to the drawn wink frame (it already tilts the head), with a small bounce
  .addLabel("wink", "-=0.2")
  .set(".splash-wink", { opacity: 1 }, "wink")
  .set(".splash-open", { opacity: 0 }, "wink")
  .fromTo(".splash-logo", { scale: 1 }, { scale: 1.06, duration: 0.15, yoyo: true, repeat: 1, ease: "power2.out" }, "wink")
  .fromTo(".splash-sparkle-wink", { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: 0.35, ease: "back.out(2.5)" }, "wink")
  .to(".splash-sparkle-wink", { scale: 0, rotation: 90, duration: 0.25, ease: "power2.in" }, "wink+=0.5")
  .set(".splash-open", { opacity: 1 }, "wink+=0.6")
  .set(".splash-wink", { opacity: 0 }, "wink+=0.6")
  .to([".splash-counter", ".splash-progress-bar"], {
    opacity: 0,
    duration: 0.5,
    delay: 0.4
  })
  .to([".splash-logo", ".splash-title-wrapper", ".splash-subtitle"], {
    y: -50,
    opacity: 0,
    duration: 0.8,
    ease: "power2.in",
    stagger: 0.1
  })
  .to(".splash-sparkle", { y: -50, opacity: 0, duration: 0.8, ease: "power2.in" }, "<")
  .to(".splash-overlay", {
    clipPath: "inset(0 0 100% 0)",
    duration: 0.8,
    ease: "power4.inOut",
    onComplete: () => {
      emit('complete');
    }
  }, "-=0.2");
});

onUnmounted(() => twinkles.forEach((t) => t.kill()));

const title = "Tene Coulibaly".split("");
</script>

<template>
  <div class="splash-overlay bg-white dark:bg-black text-black dark:text-white" aria-hidden="true">
    <div class="content-wrapper relative z-10 flex flex-col items-center justify-center h-full w-full">

      <div class="relative w-40 h-40 md:w-56 md:h-56 mb-4">
        <div class="splash-logo relative w-full h-full">
          <!-- Two hand-drawn frames from the animated logo: eyes open, then the wink -->
          <img ref="logo" src="/images/logo-tene-open.webp" alt="" width="224" height="224" class="splash-open w-full h-full" fetchpriority="high">
          <img ref="logoWink" src="/images/logo-tene-wink.webp" alt="" width="224" height="224" class="splash-wink absolute inset-0 w-full h-full opacity-0" fetchpriority="high">
        </div>

        <span
          v-for="(s, i) in sparkles"
          :key="i"
          class="splash-sparkle absolute"
          :style="{ left: s.x + '%', top: s.y + '%', width: s.size + '%' }"
        >
          <span class="splash-sparkle-shape block" />
        </span>
        <!-- Extra sparkle that flashes next to the winking eye -->
        <span class="splash-sparkle-wink absolute" style="left: 102%; top: 40%; width: 18%">
          <span class="splash-sparkle-shape block" />
        </span>
      </div>

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

/* The sparkle artwork is used as a stencil so it follows the text colour (black on light, white on dark) */
.splash-sparkle-shape {
  aspect-ratio: 1216 / 1639;
  background-color: currentColor;
  -webkit-mask: url("/images/sparkle.webp") center / contain no-repeat;
  mask: url("/images/sparkle.webp") center / contain no-repeat;
}
</style>
