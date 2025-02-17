<template>
  <div class="h-[100dvh] flex flex-col md:p-28 p-6 gap-5 overflow-y-auto bg-white dark:bg-gray-900" :class="{ 'dark': isDarkMode }">
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
        >light</span>
        -
        <span 
          @click="toggleDarkMode(true)" 
          :class="{ 'font-bold': isDarkMode }"
          class="cursor-pointer hover:text-gray-900 dark:hover:text-gray-100"
        >dark</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect, watch } from "vue";
import { setI18nLanguage } from "../../config/i18n";

import { useRoute } from "vue-router";
const route = useRoute();

import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollToPlugin);

console.log("ScrollToPlugin enregistré ?", gsap.plugins.ScrollToPlugin ? "Oui" : "Non");





const isDarkMode = ref(localStorage.getItem("theme") === "dark");

watch(() => route.path, (newPath, oldPath) => {
  if (newPath !== oldPath) {
    gsap.to(window, {
      duration: 0.5,
      scrollTo: { y: 0, autoKill: false },
      ease: "power2.inOut",
    });
  }
});

watchEffect(() => {
  document.documentElement.classList.toggle("dark", isDarkMode.value);
  localStorage.setItem("theme", isDarkMode.value ? "dark" : "light");
});

const toggleDarkMode = (mode) => {
  isDarkMode.value = mode;
};

const currentLanguage = ref(localStorage.getItem("language") || "fr");

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
