<template>
  <div class="h-screen w-full flex flex-col items-center justify-center bg-white dark:bg-black text-black dark:text-white overflow-hidden relative">
    <div class="absolute inset-0 opacity-10 pointer-events-none">
      <div class="noise-bg"></div>
    </div>

    <h1 class="text-[150px] md:text-[250px] font-bold leading-none select-none opacity-10">404</h1>
    
    <div class="absolute z-10 text-center space-y-6">
      <p class="text-2xl md:text-4xl font-light tracking-widest uppercase">Lost in the void</p>
      <p class="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto px-4">
        {{ $t('not_found.description') || "The page you are looking for doesn't exist or has been moved into another dimension." }}
      </p>
      
      <router-link 
        to="/" 
        class="inline-block px-8 py-3 border border-black dark:border-white rounded-full hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300 uppercase tracking-widest text-sm"
      >
        {{ $t('not_found.back') || "Return Home" }}
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import gsap from 'gsap';

onMounted(() => {
  gsap.from("h1", {
    scale: 1.5,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out"
  });

  gsap.from(".absolute.z-10 > *", {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    delay: 0.5,
    ease: "power2.out"
  });
});
</script>

<style scoped>
.noise-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
  opacity: 0.4;
}
</style>
