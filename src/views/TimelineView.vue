<template>
    <div class="w-full h-full max-w-4xl mx-auto px-4 overflow-y-auto snap-y snap-mandatory scroll-smooth scroll-container relative no-scrollbar">

      <!-- Title Slide with Filter -->
      <div class="timeline-section h-full flex flex-col justify-center items-center snap-center">
        <h2 class="text-3xl md:text-7xl font-bold mb-4 md:mb-6 dark:text-white">{{ $t('timeline_section.title') }}</h2>
        <p class="text-base md:text-2xl text-gray-600 dark:text-gray-400 mb-6 md:mb-10">{{ $t('timeline_section.subtitle') }}</p>

        <!-- Filter buttons -->
        <div class="flex gap-2 md:gap-3 flex-wrap justify-center">
          <button
            @click="setFilter('all')"
            :aria-pressed="activeFilter === 'all'"
            :class="[
              'px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border',
              activeFilter === 'all'
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            ]"
          >{{ $t('timeline_section.filter_all') }}</button>
          <button
            @click="setFilter('experience')"
            :aria-pressed="activeFilter === 'experience'"
            :class="[
              'px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border',
              activeFilter === 'experience'
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            ]"
          >{{ $t('timeline_section.experience_title') }}</button>
          <button
            @click="setFilter('education')"
            :aria-pressed="activeFilter === 'education'"
            :class="[
              'px-4 py-1.5 md:px-6 md:py-2.5 rounded-full text-xs md:text-sm font-medium transition-all duration-300 border',
              activeFilter === 'education'
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-transparent text-gray-600 dark:text-gray-400 border-gray-300 dark:border-gray-700 hover:border-black dark:hover:border-white hover:text-black dark:hover:text-white'
            ]"
          >{{ $t('timeline_section.education_title') }}</button>
        </div>

        <div class="mt-10 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

      <!-- Experience Section -->
      <template v-if="activeFilter === 'all' || activeFilter === 'experience'">
        <!-- Experience Section Header -->
        <div class="timeline-section h-full flex flex-col justify-center items-center snap-center">
          <h3 class="text-3xl md:text-5xl font-black text-black dark:text-white flex items-center gap-4">
            {{ $t('timeline_section.experience_title') }}
          </h3>
        </div>

        <!-- Experience Items -->
        <div
          v-for="(step, index) in experienceSteps"
          :key="'exp-'+index"
          class="timeline-section h-full flex flex-col justify-center items-center snap-center text-center py-10 relative"
        >
          <div class="relative z-10 flex flex-col items-center">
            <span class="text-xl md:text-2xl font-mono text-black dark:text-white font-light mb-4 block">
              {{ $t(`timeline_section.experience.${index}.year`) }}
            </span>

            <h4 class="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {{ $t(`timeline_section.experience.${index}.title`) }}
            </h4>

            <p class="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 mb-6">
              {{ $t(`timeline_section.experience.${index}.place`) }}
            </p>

            <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed">
              {{ $t(`timeline_section.experience.${index}.description`) }}
            </p>
          </div>
        </div>
      </template>

      <!-- Education Section -->
      <template v-if="activeFilter === 'all' || activeFilter === 'education'">
        <!-- Education Section Header -->
        <div class="timeline-section h-full flex flex-col justify-center items-center snap-center">
          <h3 class="text-4xl md:text-6xl font-black text-black dark:text-white flex items-center gap-4">
            {{ $t('timeline_section.education_title') }}
          </h3>
        </div>

        <!-- Education Items -->
        <div
          v-for="(step, index) in educationSteps"
          :key="'edu-'+index"
          class="timeline-section h-full flex flex-col justify-center items-center snap-center text-center py-10 relative"
        >
          <div class="relative z-10 flex flex-col items-center">
            <span class="text-xl md:text-2xl font-mono text-black dark:text-white font-light mb-4 block">
              {{ $t(`timeline_section.education.${index}.year`) }}
            </span>

            <h4 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              {{ $t(`timeline_section.education.${index}.title`) }}
            </h4>

            <p class="text-2xl md:text-3xl font-medium text-gray-700 dark:text-gray-300 mb-6">
              {{ $t(`timeline_section.education.${index}.place`) }}
            </p>

            <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-3xl leading-relaxed" v-if="$t(`timeline_section.education.${index}.description`)">
              {{ $t(`timeline_section.education.${index}.description`) }}
            </p>
          </div>
        </div>
      </template>

      <div class="h-20"></div> <!-- Spacer for bottom scroll -->

    </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from 'vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSeo } from '@/composables/useSeo'

useSeo('timeline', '/timeline')

gsap.registerPlugin(ScrollTrigger);

const experienceSteps = [0, 1, 2, 3];
const educationSteps = [0, 1, 2, 3, 4, 5];
const activeFilter = ref('all');

function setFilter(filter) {
  activeFilter.value = filter;

  // Scroll back to top when filter changes
  const container = document.querySelector('.scroll-container');
  if (container) container.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-init animations after DOM update
  nextTick(() => {
    ScrollTrigger.getAll().forEach(t => t.kill());
    initAnimations();
  });
}

function initAnimations() {
  const sections = document.querySelectorAll('.timeline-section');

  sections.forEach((section) => {
    const elements = section.querySelectorAll('h2, h3, h4, p, span, svg, button');

    gsap.fromTo(elements,
      {
        y: 50,
        opacity: 0,
        filter: 'blur(10px)'
      },
      {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: 0.8,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          scroller: '.scroll-container',
          start: 'top center',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  });
}

onMounted(async () => {
  await nextTick();
  initAnimations();
});
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
.no-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
