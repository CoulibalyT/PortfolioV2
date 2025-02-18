<template>
  <div class="h-[100dvh] flex flex-col md:p-28 p-6 gap-5  bg-white dark:bg-gray-900" :class="{ 'dark': isDarkMode }">
    <!-- Header -->
    <div class="flex justify-between items-start ">
      <div class="flex items-center">
        <div>
          <p class="md:text-[40px] text-2xl font-thin text-gray-900 dark:text-gray-100">Tene Coulibaly</p>
          <p class="text-sm text-gray-500 dark:text-gray-400 pl-0.5">{{ $t("role") }}</p>
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
    <div class="flex-1 flex lg:flex-row flex-col ">
      <nav class="w-1/4 flex flex-col justify-center gap-1.5">
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/"
        >{{ $t("menu.me") }}</router-link>
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/projects"
        >{{ $t("menu.projects") }}</router-link>
        <!-- <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/skills"
        >{{ $t("menu.skills") }}</router-link> -->
        <router-link 
          active-class="font-bold" 
          class="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100" 
          to="/contact"
        >{{ $t("menu.contact") }}</router-link>
      </nav>

      <div class="flex-1 text-center flex items-center justify-center text-gray-900 dark:text-gray-100">
        <slot></slot>
      </div>
      <div class="w-1/4"></div>
    </div>

    <!-- Footer -->
    <div class="flex justify-between items-end">
      <div class="flex items-center gap-1.5">
        <div class="w-3 h-3 rounded-full bg-green-500 dark:bg-green-400 dot"></div>
        <p class="text-gray-700 dark:text-gray-300">{{ $t("status.available") }}</p>
      </div>

      <!-- Toggle Mode Clair/Sombre -->
      <div class="space-x-2 text-gray-700 dark:text-gray-300">
        <span 
          @click="toggleDarkMode(false)" 
          :class="{ 'font-bold': !isDarkMode }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >{{$t("light")}}</span>
        -
        <span 
          @click="toggleDarkMode(true)" 
          :class="{ 'font-bold': isDarkMode }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >{{$t("dark")}}</span>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, watch , watchEffect} from "vue";
import { useRouter, useRoute } from "vue-router";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";


const currentLanguage = ref(localStorage.getItem("language") || "fr");


gsap.registerPlugin(ScrollToPlugin);

const router = useRouter();
const route = useRoute();
const isDarkMode = ref(localStorage.getItem("theme") === "dark");
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

watchEffect(() => {
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
});

const toggleDarkMode = (mode) => {
  isDarkMode.value = mode;
};


const setLanguage = (lang) => {
  currentLanguage.value = lang;
  setI18nLanguage(lang);
  localStorage.setItem("language", lang);
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
