<template>
  <div class="fixed inset-0 z-[-1] overflow-hidden bg-gray-50 dark:bg-gray-950 transition-colors duration-500" 
       :class="{ '!bg-[#852C2C]': isRedMode }"
       ref="container">
    <div class="absolute inset-0 blur-[80px] md:blur-[120px]" :class="{ 'opacity-0': isRedMode }">
      <!-- Ambient Blobs -->
      <div ref="blob1" class="absolute top-0 left-0 w-[50vw] h-[50vw] bg-purple-200 dark:bg-purple-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-float"></div>
      <div ref="blob2" class="absolute top-0 right-0 w-[50vw] h-[50vw] bg-blue-200 dark:bg-blue-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-float animation-delay-2000"></div>
      <div ref="blob3" class="absolute bottom-0 left-1/4 w-[50vw] h-[50vw] bg-pink-200 dark:bg-indigo-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 animate-float animation-delay-4000"></div>
      
      <!-- Interactive Blob (Follows Mouse) -->
      <div ref="interactiveBlob" class="absolute top-0 left-0 w-[40vw] h-[40vw] bg-cyan-200 dark:bg-cyan-900/30 rounded-full mix-blend-multiply dark:mix-blend-screen opacity-70 transition-opacity duration-500"></div>
    </div>

    <!-- Hidden Text Layer (Spotlight Effect) -->
    <div class="absolute inset-0 z-0 pointer-events-none flex flex-col justify-center items-center select-none overflow-hidden"
         :style="{ maskImage: `radial-gradient(circle 400px at var(--x, 50%) var(--y, 50%), black, transparent)`, webkitMaskImage: `radial-gradient(circle 400px at var(--x, 50%) var(--y, 50%), black, transparent)` }">
         <div class="text-[15vw] font-black text-gray-900/5 dark:text-white/5 leading-none tracking-tighter text-center"
              :class="{ 'text-white/10': isRedMode }">
            PORTFOLIO
         </div>
         <div class="text-[15vw] font-black text-gray-900/5 dark:text-white/5 leading-none tracking-tighter text-center"
              :class="{ 'text-white/10': isRedMode }">
            CREATIVE
         </div>
         <div class="text-[15vw] font-black text-gray-900/5 dark:text-white/5 leading-none tracking-tighter text-center"
              :class="{ 'text-white/10': isRedMode }">
            DEVELOPER
         </div>
    </div>
    
    <!-- Noise Texture -->
    <div class="absolute inset-0 opacity-[0.15] dark:opacity-[0.20] pointer-events-none mix-blend-overlay" 
         style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.8%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E');">
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { useTheme } from '@/composables/useTheme';

const { isRedMode } = useTheme();

const container = ref(null);
const interactiveBlob = ref(null);
const blob1 = ref(null);
const blob2 = ref(null);
const blob3 = ref(null);

let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

const onMouseMove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
};

const animate = () => {
  // Smooth follow logic
  currentX += (mouseX - currentX) * 0.05;
  currentY += (mouseY - currentY) * 0.05;

  if (interactiveBlob.value) {
    gsap.set(interactiveBlob.value, {
      x: currentX - interactiveBlob.value.offsetWidth / 2,
      y: currentY - interactiveBlob.value.offsetHeight / 2
    });
  }

  if (container.value) {
    container.value.style.setProperty('--x', `${currentX}px`);
    container.value.style.setProperty('--y', `${currentY}px`);
  }

  requestAnimationFrame(animate);
};

onMounted(() => {
  window.addEventListener('mousemove', onMouseMove);
  animate();

  // Ambient animations with GSAP for more randomness than CSS
  const blobs = [blob1.value, blob2.value, blob3.value];
  blobs.forEach((blob) => {
    gsap.to(blob, {
      x: "random(-100, 100)",
      y: "random(-100, 100)",
      scale: "random(0.8, 1.2)",
      duration: "random(10, 20)",
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut"
    });
  });
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style scoped>
.animate-float {
  animation: float 20s infinite;
}
.animation-delay-2000 {
  animation-delay: 2s;
}
.animation-delay-4000 {
  animation-delay: 4s;
}

@keyframes float {
  0% { transform: translate(0px, 0px) scale(1); }
  33% { transform: translate(30px, -50px) scale(1.1); }
  66% { transform: translate(-20px, 20px) scale(0.9); }
  100% { transform: translate(0px, 0px) scale(1); }
}
</style>