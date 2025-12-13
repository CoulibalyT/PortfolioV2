<template>
    <div :class="{ 'dark': isDarkMode }" class="w-full h-full flex items-center justify-center">
      <div class="md:hidden w-full">
        <Vertical :arrayOfImage="projects"/>
      </div>
      <div class="hidden md:flex w-full h-full items-center justify-center">
        <Horizontal :arrayOfImage="projects"/>
      </div>
       </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import Vertical from './vertical.vue';
import { ArrowUpRightIcon } from '@heroicons/vue/24/solid';
import Horizontal from './horizontal.vue';
import { useTheme } from '../composables/useTheme';



const { isDarkMode } = useTheme();

const projects = ref([
  {
    title: 'Bento',
    tech: ['Vue.js', 'Tailwind', 'Vercel'],
    images: [
      '/images/projet1/home.png',
      '/images/projet1/challge.png',
      '/images/projet1/log.png',
      '/images/projet1/value.png',
      '/images/projet1/bnnto.png',
    ],
    link: 'https://bento-sable.vercel.app/',
  },
  {
    title: 'Simulateur de calculateur carbone',
    tech: ['Vue.js', 'Node.js', 'API Climeet'],
    images: [
      '/images/projet2/cxc.jpg',
      '/images/projet2/home.png',
      '/images/projet2/choose.png',
      '/images/projet2/form.png',
      '/images/projet2/details.png',
      '/images/projet2/finalize.png',
    ],
  },
  {
    title: 'Daily Quote App',
    tech: ['Flutter', 'Dart', 'Mobile'],
    images: [
      '/images/projet3/DailyQuote.png',
    ],
  },
])


</script>

<style scoped>

@reference "../../src/assets/base.css";


</style>
