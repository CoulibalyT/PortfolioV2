<template>
  <Wrapper>
    <div class="w-full h-full max-w-4xl mx-auto px-4 overflow-y-auto snap-y snap-mandatory scroll-smooth scroll-container relative no-scrollbar">
      
      <!-- Title Slide -->
      <div class="timeline-section h-full flex flex-col justify-center items-center snap-center">
        <h2 class="text-5xl md:text-7xl font-bold mb-6 dark:text-white">{{ $t('timeline_section.title') }}</h2>
        <p class="text-xl md:text-2xl text-gray-600 dark:text-gray-400">{{ $t('timeline_section.subtitle') }}</p>
        <div class="mt-12 animate-bounce">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8 text-gray-400">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>

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
        <!-- Decorative Background Number -->
        <!-- <span class="absolute text-[15rem] opacity-[0.03] dark:opacity-[0.05] font-bold select-none pointer-events-none z-0 transform -translate-y-1/2 top-1/2">
          {{ index + 1 }}
        </span> -->

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
        <!-- Decorative Background Number -->
        <!-- <span class="absolute text-[15rem] opacity-[0.03] dark:opacity-[0.05] font-bold select-none pointer-events-none z-0 transform -translate-y-1/2 top-1/2">
          {{ index + 1 }}
        </span> -->

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
      
      <div class="h-20"></div> <!-- Spacer for bottom scroll -->

    </div>
  </Wrapper>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Wrapper from '../components/WrapperComponent.vue';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const experienceSteps = [0, 1, 2, 3]; 
const educationSteps = [0, 1, 2, 3, 4, 5]; 

onMounted(async () => {
  await nextTick();
  
  const sections = document.querySelectorAll('.timeline-section');
  
  sections.forEach((section) => {
    // Select content elements to animate
    const elements = section.querySelectorAll('h2, h3, h4, p, span, svg');
    
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
        duration: 2.5,
        stagger: 0.3,
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
