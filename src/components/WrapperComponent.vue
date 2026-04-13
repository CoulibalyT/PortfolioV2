<template>
  <div class="h-[100dvh] flex flex-col md:p-28 p-4 md:gap-5 gap-3 bg-transparent" :class="{ 'dark': isDarkMode, 'red-theme': isRedMode }">
    <!-- Header -->
    <div class="flex justify-between items-start ">
      <div class="flex items-center">
        <div>
          <p class="md:text-[40px] text-xl font-thin text-black dark:text-gray-100">Tene Coulibaly</p>
          <div ref="roleText" class="text-sm text-gray-500 dark:text-gray-400 pl-0.5">
            <SynonymReveal
              :baseText="$t('role')"
              :synonyms="$tm('synonyms.dev')"
            />
          </div>
        </div>
        <div>
          <p class="text-gray-950 dark:text-gray-300">/ˈte.ne/</p>
        </div>
      </div>

      <div class="space-x-2 text-gray-950 dark:text-gray-300">
        <span 
          @click="setLanguage('fr')" 
          :class="{ 'font-bold': currentLanguage === 'fr' }"
          class="cursor-pointer hover:text-black dark:hover:text-gray-100"
        >fr</span>
        -
        <span 
          @click="setLanguage('en')"   
          :class="{'font-bold': currentLanguage === 'en' }"
          class="cursor-pointer hover:text-black dark:hover:text-gray-100"
        >en</span>
      </div>
    </div>

    <!-- Navigation -->
    <div class="flex-1 flex lg:flex-row flex-col min-h-0 overflow-hidden">
      <nav ref="navMenu" class="lg:w-1/4 w-full flex lg:flex-col flex-row lg:justify-center lg:gap-1.5 gap-4 lg:mb-0 mb-2 shrink-0 lg:overflow-visible overflow-x-auto whitespace-nowrap scrollbar-hide lg:pr-0 pr-5">
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/"
          @click="playClick"
        ><ScrambleText :text="$t('menu.me')" /></router-link>
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/projects"
          @click="playClick"
        ><ScrambleText :text="$t('menu.projects')" /></router-link>
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/skills"
          @click="playClick"
        ><ScrambleText :text="$t('menu.skills')" /></router-link>
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/timeline"
          @click="playClick"
        ><ScrambleText :text="$t('menu.timeline')" /></router-link>
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/contact"
          @click="playClick"
        ><ScrambleText :text="$t('menu.contact')" /></router-link>
        <router-link 
          active-class="font-bold active-link"
          class="nav-link text-gray-950 dark:text-gray-300 hover:text-black dark:hover:text-gray-100" 
          to="/playground"
          @click="playClick"
        ><ScrambleText :text="$t('menu.playground')" /></router-link>
      </nav>

      <div 
        ref="contentWrapper"
        class="flex-1 text-center relative text-gray-900 dark:text-gray-100 h-full"
        :class="['timeline', 'playground', 'project'].includes(route.name) ? 'overflow-hidden' : 'overflow-y-auto scroll-container scroll-smooth'"
      >
        <div  
          class="w-full"
          :class="['timeline', 'playground', 'project'].includes(route.name) ? 'h-full' : 'min-h-full flex flex-col justify-center items-center py-4 md:py-8'"
        >
          <slot></slot>
        </div>
      </div>
      <div class="w-1/4 hidden lg:block">
        <DailyQuote />
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-center text-xs md:text-sm">
      <div class="flex items-center gap-2 md:gap-4">
        <p class="text-gray-950 dark:text-gray-300">
          <span class="md:hidden"><ScrambleText :text="$t('status.available_short')" /></span>
          <span class="hidden md:inline"><ScrambleText :text="$t('status.available')" /></span>
        </p>

        <div class="hidden md:block w-px h-4 bg-gray-300 dark:bg-gray-700"></div>

        <span class="hidden md:inline"><LocalTime /></span>
        <span class="hidden md:inline"><WeatherWidget /></span>
      </div>

      <!-- Toggle Mode Clair/Sombre -->
      <div class="space-x-2 text-gray-950 dark:text-gray-300">
        <span 
          @click="toggleDarkMode(false)" 
          :class="{ 'font-bold': !isDarkMode && !isRedMode }"
          class="cursor-pointer hover:text-black dark:hover:text-gray-100"
        >{{$t("light")}}</span>
        -
        <span 
          @click="toggleDarkMode(true)" 
          :class="{ 'font-bold': isDarkMode && !isRedMode }"
          class="cursor-pointer hover:text-black dark:hover:text-gray-100"
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


const routes = ["/", "/projects", "/skills", "/timeline", "/contact", "/playground"]; // Liste des routes
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
  if (route.name === 'project') return;
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
  if (route.name === 'project') return;
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
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    // Desktop : scroll wheel change de page
    window.addEventListener("wheel", handleScroll, { passive: true });
  } else {
    // Mobile : touch change de page
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
  }
});

onUnmounted(() => {
  const isMobile = window.innerWidth <= 768;

  if (!isMobile) {
    window.removeEventListener("wheel", handleScroll);
  } else {
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

.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
}

.nav-link::before {
  content: '';
  display: inline-block;
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  opacity: 0;
  transition: opacity 0.3s ease;
  flex-shrink: 0;
}

.nav-link.active-link::before {
  opacity: 1;
}

.hscreen{
  height: calc(100vh - calc(100vh - 100%))
}

.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
</style>
