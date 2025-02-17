<template>
  <WrapperComponent>
    <div :class="{ 'dark': isDarkMode }">
      <div class="md:hidden">
        <Vertical :arrayOfImage="projects"/>
      </div>
      <div class="hidden md:flex">
        <Horizontal :arrayOfImage="projects"/>
      </div>
       </div>
  </WrapperComponent>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import WrapperComponent from './WrapperComponent.vue'
import Vertical from './vertical.vue';
import { ArrowUpRightIcon } from '@heroicons/vue/24/solid';
import Horizontal from './horizontal.vue';



const isDarkMode = ref(localStorage.getItem('theme') === 'dark')

const projects = ref([
  {
    title: 'Bento',
    mainImage: '/images/projet1/home.png',
    thumbnails: [
      '/images/projet1/challge.png',
      '/images/projet1/log.png',
      // '/images/projet1/stng.png',
      '/images/projet1/value.png',
      '/images/projet1/bnnto.png',
      // '/images/arrow.png',
    ],
    link: 'https://bento-sable.vercel.app/',
  },
  {
    title: 'Simulateur de calculateur carbone',
    mainImage: '/images/projet2/cxc.jpg',
    thumbnails: [
      '/images/projet2/home.png',
      '/images/projet2/choose.png',
      '/images/projet2/form.png',
      '/images/projet2/details.png',
      '/images/projet2/finalize.png',
      // "/images/arrow.png",
    ],
  },
])


</script>

<style scoped>

@reference "../../src/assets/base.css";


</style>
