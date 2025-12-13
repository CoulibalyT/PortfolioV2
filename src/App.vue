<template>
  <div>
    <NoiseOverlay />
    <InteractiveBackground />
    <KonamiHint />
    <CustomCursor />
    <div ref="overlay" :class="['transition-overlay', { 'dark-overlay': isDarkMode }]" >
      <p class="overlay-text">{{ transitionText }}</p>
    </div>
    
    <WrapperComponent v-if="route.name !== 'SplashScreen'">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" class="page" />
      </router-view>
    </WrapperComponent>
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";
import { useI18n } from "vue-i18n";
import CustomCursor from "@/components/CustomCursor.vue";
import InteractiveBackground from "@/components/InteractiveBackground.vue";
import NoiseOverlay from "@/components/NoiseOverlay.vue";
import KonamiHint from "@/components/KonamiHint.vue";
import WrapperComponent from "@/components/WrapperComponent.vue";
import { useKonamiCode } from "@/composables/useKonamiCode";

const overlay = ref(null);
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isTransitioning = ref(false);
const isDarkMode = ref(localStorage.getItem("theme") === "dark");
const transitionText = ref("");

// Sound Design
const playClickSound = () => {
  const audio = new Audio('/sounds/click.mp3');
  audio.volume = 0.2; // Subtle volume
  audio.play().catch(() => {
    // Ignore auto-play errors
  });
};

onMounted(() => {
  // Add global click listener for sound
  window.addEventListener('click', playClickSound);
  
  // Add hover sound for interactive elements (optional, requires a separate sound file)
  // For now, we stick to the click sound as requested
});

useKonamiCode(async () => {
  // Easter Egg Trigger
  const confetti = (await import('canvas-confetti')).default;
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 5,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: isDarkMode.value ? ['#ffffff', '#aaaaaa'] : ['#000000', '#333333']
    });
    confetti({
      particleCount: 5,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: isDarkMode.value ? ['#ffffff', '#aaaaaa'] : ['#000000', '#333333']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
  
  // Optional: Invert colors temporarily
  document.documentElement.style.filter = 'invert(1)';
  setTimeout(() => {
    document.documentElement.style.filter = '';
  }, 500);
});

router.beforeEach(async (to, from, next) => {
  // Splash Screen Redirection Logic
  const hasShownSplash = sessionStorage.getItem('hasShownSplash');
  if (!hasShownSplash && to.path !== "/splash") {
    sessionStorage.setItem('redirectPath', to.fullPath);
    next("/splash");
    return;
  }

  if (isTransitioning.value) return; 
  isTransitioning.value = true;

  // Set text based on route name
  if (to.name) {
    const keyMap = {
      'me': 'menu.me',
      'project': 'menu.projects',
      'skills': 'menu.skills',
      'timeline': 'menu.timeline',
      'contact': 'menu.contact',
      'playground': 'menu.playground'
    };
    const key = keyMap[to.name];
    transitionText.value = key ? t(key) : '';
  }

  await gsap.to(overlay.value, {
    y: "0%",
    duration: 0.6,
    ease: "power2.inOut",
  });

  next();

  await gsap.to(overlay.value, {
    y: "-100%",
    duration: 0.6,
    ease: "power2.inOut",
    delay: 0.2, 
  });

  isTransitioning.value = false;
});

watchEffect(() => {
  isDarkMode.value = localStorage.getItem("theme") === "dark";
});
</script>

<style scoped>
.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1000;
  transform: translateY(-100%);
  transition: background 0.3s ease-in-out;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

.dark-overlay {
  background: white;
  color: black;
}

.overlay-text {
  font-size: 4rem;
  font-weight: 100;
  text-transform: uppercase;
  letter-spacing: 0.1em;
}

.page {
  position: relative;
  z-index: 1;
}
</style>
