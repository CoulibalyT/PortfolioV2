<template>
  <div class="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
    
    <!-- Dynamic Component Loader -->
    <component :is="currentExperiment.component" />
    
    <div class="z-10 text-center pointer-events-none mix-blend-difference absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <h1 class="text-6xl md:text-9xl font-black text-white tracking-tighter mb-4 uppercase">
        {{ currentExperiment.name }}
      </h1>
      <p class="text-xl text-white/80 max-w-md mx-auto">
        {{ $t('playground.subtitle') }}
      </p>
    </div>

    <!-- Navigation Arrows -->
    <button 
      @click="prevExperiment"
      class="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
    >
      <ChevronLeftIcon class="w-8 h-8" />
    </button>

    <button 
      @click="nextExperiment"
      class="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-sm transition-all hover:scale-110"
    >
      <ChevronRightIcon class="w-8 h-8" />
    </button>

    <!-- Experiment Switcher (Dots) -->
    <div class="absolute bottom-10 left-0 right-0 flex justify-center gap-4 z-20">
      <button 
        v-for="(exp, index) in experiments" 
        :key="index"
        @click="currentIndex = index"
        class="w-3 h-3 rounded-full transition-all duration-300"
        :class="currentIndex === index ? 'bg-white scale-125' : 'bg-white/30 hover:bg-white/60'"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid';
import ParticleCloud from '@/components/playground/ParticleCloud.vue';
import TorusKnot from '@/components/playground/TorusKnot.vue';
import WavyGrid from '@/components/playground/WavyGrid.vue';
import DNAHelix from '@/components/playground/DNAHelix.vue';
import Galaxy from '@/components/playground/Galaxy.vue';
import MagneticField from '@/components/playground/MagneticField.vue';

const experiments = [
  { name: 'Particles', component: ParticleCloud },
  { name: 'Torus Knot', component: TorusKnot },
  { name: 'Wavy Grid', component: WavyGrid },
  { name: 'DNA Helix', component: DNAHelix },
  { name: 'Galaxy', component: Galaxy },
  { name: 'Magnetic Field', component: MagneticField }
];

const currentIndex = ref(0);
const currentExperiment = computed(() => experiments[currentIndex.value]);

const nextExperiment = () => {
  currentIndex.value = (currentIndex.value + 1) % experiments.length;
};

const prevExperiment = () => {
  currentIndex.value = (currentIndex.value - 1 + experiments.length) % experiments.length;
};

const handleKeydown = (e) => {
  if (e.key === 'ArrowRight') nextExperiment();
  if (e.key === 'ArrowLeft') prevExperiment();
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>
