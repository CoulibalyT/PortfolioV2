<template>
  <div class="h-[100dvh] flex flex-col md:p-28 p-6 gap-5 bg-transparent" :class="{ 'dark': isDarkMode, 'red-theme': isRedMode }">
    <!-- Header -->
    <div class="flex justify-between items-start ">
      <div class="flex items-center">
        <div>
          <p class="md:text-[40px] text-2xl font-thin text-gray-900 dark:text-gray-100">Tene Coulibaly</p>
          <div ref="roleText" class="text-sm text-gray-500 dark:text-gray-400 pl-0.5 flex gap-1">
            <SynonymReveal 
              :baseText="$t('role').split(' & ')[0] || 'Developer'" 
              :synonyms="$tm('synonyms.dev')" 
            />
            <span>&</span>
            <SynonymReveal 
              :baseText="$t('role').split(' & ')[1] || 'Designer'" 
              :synonyms="$tm('synonyms.design')" 
            />
          </div>
        </div>
        <div>
          <p class="text-gray-700 dark:text-gray-300">/ˈte.ne/</p>
        </div>
      </div>

      <div class="space-x-2 text-gray-700 dark:text-gray-300">
        <span 
          @click="setLanguage('fr')" 
          :class="{ 'font-bold': currentLanguage === 'fr' }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >fr</span>
        -
        <span 
          @click="setLanguage('en')"   
          :class="{'font-bold': currentLanguage === 'en' }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >en</span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 flex lg:flex-row flex-col min-h-0 overflow-hidden">
      <nav ref="navMenu" class="lg:w-1/4 w-full flex flex-col justify-center gap-1.5 mb-6 lg:mb-0 shrink-0">
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/"
          @click="playClick"
        ><ScrambleText :text="$t('menu.me')" /></router-link>
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/projects"
          @click="playClick"
        ><ScrambleText :text="$t('menu.projects')" /></router-link>
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/skills"
          @click="playClick"
        ><ScrambleText :text="$t('menu.skills')" /></router-link>
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/timeline"
          @click="playClick"
        ><ScrambleText :text="$t('menu.timeline')" /></router-link>
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/contact"
          @click="playClick"
        ><ScrambleText :text="$t('menu.contact')" /></router-link>
      </nav>

      <div 
        ref="contentWrapper"
        class="flex-1 text-center relative text-gray-900 dark:text-gray-100 h-full"
        :class="route.name === 'timeline' ? 'overflow-hidden' : 'overflow-y-auto scroll-container scroll-smooth'"
      >
        <div  
          class="w-full"
          :class="route.name === 'timeline' ? 'h-full' : 'min-h-full flex flex-col justify-center items-center py-8'"
        >
          <slot></slot>
        </div>
      </div>
      <div class="w-1/4">
        <DailyQuote />
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-end">
      <div class="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
        <div class="flex items-center gap-1.5">
          <div class="w-3 h-3 rounded-full bg-custom-red dot"></div>
          <p class="text-gray-700 dark:text-gray-300">
            <span class="md:hidden"><ScrambleText :text="$t('status.available_short')" /></span>
            <span class="hidden md:inline"><ScrambleText :text="$t('status.available')" /></span>
          </p>
        </div>
        
        <div class="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>
        
        <LocalTime />
        <WeatherWidget />
      </div>

      <!-- Toggle Mode Clair/Sombre -->
      <div class="space-x-2 text-gray-700 dark:text-gray-300">
        <span 
          @click="toggleDarkMode(false)" 
          :class="{ 'font-bold': !isDarkMode && !isRedMode }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >{{$t("light")}}</span>
        -
        <span 
          @click="toggleDarkMode(true)" 
          :class="{ 'font-bold': isDarkMode && !isRedMode }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >{{$t("dark")}}</span>
        -
        <span 
          @click="toggleRedMode()" 
          :class="{ 'font-bold': isRedMode, 'text-custom-red': !isRedMode }"
          class="cursor-pointer hover:text-custom-red"
        >red</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch , watchEffect, nextTick} from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useTheme } from "../composables/useTheme";
import { useSound } from "../composables/useSound";
import ScrambleText from "./ScrambleText.vue";
import LocalTime from "./LocalTime.vue";
import WeatherWidget from "./WeatherWidget.vue";
import SynonymReveal from "./SynonymReveal.vue";
import DailyQuote from "./DailyQuote.vue";


const currentLanguage = ref(localStorage.getItem("language") || "fr");
const roleText = ref(null);
const navMenu = ref(null);
const contentWrapper = ref(null);


gsap.registerPlugin(ScrollToPlugin);

const router = useRouter();
const route = useRoute();
const { isDarkMode, isRedMode, toggleDarkMode, toggleRedMode } = useTheme();
const { playClick } = useSound();
import { setI18nLanguage } from "../../config/i18n";


const routes = ["/", "/projects", "/contact"]; // Liste des routes
let isScrolling = false;

// Vérifie si on scrolle à l'intérieur d'un élément avec du scroll actif
const isScrollingInsideSlot = (event) => {
  let target = event.target;
  while (target !== document.body) {
    if (target.scrollHeight > target.clientHeight || target.scrollWidth > target.clientWidth) {
      return true; // Un élément scrollable capture l'événement
    }
    target = target.parentElement;
  }
  return false; // L'utilisateur scrolle sur la page principale
};

// Gérer le scroll de la souris sur PC
const handleScroll = (event) => {
  if (isScrolling || isScrollingInsideSlot(event)) return; // Bloque le changement de route si on est dans un élément scrollable
  isScrolling = true;

  let index = routes.indexOf(route.path);
  if (event.deltaY > 0 && index < routes.length - 1) {
    index++; // Scroll bas → Page suivante
  } else if (event.deltaY < 0 && index > 0) {
    index--; // Scroll haut → Page précédente
  }

  if (routes[index] !== route.path) {
    gsap.to(window, {
      duration: 0.7,
      scrollTo: { y: 0, autoKill: false },
      ease: "power2.inOut",
      onComplete: () => {
        router.push(routes[index]);
        isScrolling = false;
      },
    });
  } else {
    isScrolling = false;
  }
};

// Gérer le scroll tactile sur mobile
let startY = 0;

const handleTouchStart = (event) => {
  startY = event.touches[0].clientY;
};

const handleTouchMove = (event) => {
  let deltaY = event.touches[0].clientY - startY;
  if (isScrolling || isScrollingInsideSlot(event)) return;

  isScrolling = true;
  let index = routes.indexOf(route.path);

  if (deltaY < -50 && index < routes.length - 1) {
    index++;
  } else if (deltaY > 50 && index > 0) {
    index--;
  }

  if (routes[index] !== route.path) {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0, autoKill: false },
      ease: "power2.inOut",
      onComplete: () => {
        router.push(routes[index]);
        isScrolling = false;
      },
    });
  } else {
    isScrolling = false;
  }
};

// Ajouter/Supprimer l'écouteur de scroll
onMounted(() => {
  // Vérifie si l'écran est mobile
  const isMobile = window.innerWidth <= 768;

  if (isMobile) {
    window.addEventListener("wheel", handleScroll, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
  }
});

onUnmounted(() => {
  const isMobile = window.innerWidth <= 768;
  
  if (isMobile) {
    window.removeEventListener("wheel", handleScroll);
    window.removeEventListener("touchstart", handleTouchStart);
    window.removeEventListener("touchmove", handleTouchMove);
  }
});

watch(() => route.path, () => {
  gsap.to(window, { scrollTo: { y: 0, autoKill: false }, duration: 0.5, ease: "power2.inOut" });
});

const setLanguage = (lang) => {
  if (currentLanguage.value === lang) return;

  const tl = gsap.timeline();

  // Blur out content only (Text Scramble handles the rest)
  tl.to(contentWrapper.value, {
    opacity: 0,
    filter: "blur(10px)",
    duration: 0.3,
    ease: "power2.in"
  });

  tl.call(() => {
    currentLanguage.value = lang;
    setI18nLanguage(lang);
    localStorage.setItem("language", lang);
  });

  // Blur in content
  tl.to(contentWrapper.value, {
    opacity: 1,
    filter: "blur(0px)",
    duration: 0.5,
    ease: "power2.out",
    delay: 0.1 
  });
};

// Appliquer la langue au chargement
watchEffect(() => {
  setI18nLanguage(currentLanguage.value);
});
</script>


<style scoped>
@keyframes blink {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.dot {
  animation: blink 1.5s infinite;
}

.font-bold {
  font-weight: bold;
}

.hscreen{
  height: calc(100vh - calc(100vh - 100%))

}
</style>
