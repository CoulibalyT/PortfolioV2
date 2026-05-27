<template>
  <div>
    <SplashOverlay v-if="showSplash" @complete="showSplash = false" />
    <NoiseOverlay />
    <InteractiveBackground />
    <KonamiHint />
    <CustomCursor />

    <!-- Skip nav link for accessibility -->
    <a href="#main-content" class="skip-link">Aller au contenu</a>

    <div ref="overlay" :class="['transition-overlay', { 'dark-overlay': isDarkMode }]" >
      <p class="overlay-text">{{ transitionText }}</p>
    </div>

    <WrapperComponent v-if="!['project', 'project-detail'].includes(route.name)">
      <router-view v-slot="{ Component, route }">
        <component :is="Component" :key="route.path" class="page" id="main-content" />
      </router-view>
    </WrapperComponent>
    <router-view v-else />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import gsap from "gsap";
import { useI18n } from "vue-i18n";
import CustomCursor from "@/components/CustomCursor.vue";
import InteractiveBackground from "@/components/InteractiveBackground.vue";
import NoiseOverlay from "@/components/NoiseOverlay.vue";
import KonamiHint from "@/components/KonamiHint.vue";
import SplashOverlay from "@/components/SplashOverlay.vue";
import WrapperComponent from "@/components/WrapperComponent.vue";
import { useKonamiCode } from "@/composables/useKonamiCode";
import { useTheme } from "@/composables/useTheme";

const overlay = ref(null);
const router = useRouter();
const route = useRoute();
const { t } = useI18n();
const isTransitioning = ref(false);
const { isDarkMode } = useTheme();
const transitionText = ref("");
const showSplash = ref(false);

// Respect prefers-reduced-motion
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Show splash only on first visit per tab, skip for external referrers and reduced-motion users
onMounted(() => {
  if (prefersReducedMotion) return;
  if (sessionStorage.getItem('hasShownSplash')) return;
  const referrer = document.referrer;
  const isExternal = referrer && !referrer.includes(location.hostname);
  if (isExternal) return;
  showSplash.value = true;
  sessionStorage.setItem('hasShownSplash', 'true');
});

useKonamiCode(async () => {
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
});

router.beforeEach(async (to, from, next) => {
  if (isTransitioning.value) return;
  isTransitioning.value = true;

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

  if (!prefersReducedMotion) {
    await gsap.to(overlay.value, {
      y: "0%",
      duration: 0.6,
      ease: "power2.inOut",
    });
  }

  next();

  if (!prefersReducedMotion) {
    await gsap.to(overlay.value, {
      y: "-100%",
      duration: 0.6,
      ease: "power2.inOut",
      delay: 0.2,
    });
  }

  isTransitioning.value = false;
});
</script>

<style scoped>
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px 16px;
  z-index: 10000;
  font-size: 14px;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 0;
}

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
