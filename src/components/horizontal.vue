<template>
  <div class="carousel-container" :class="{ 'dark': isDarkMode }">
    
    <div
      class="carousel-track"
      ref="carousel"
      @wheel.prevent="handleScroll"
      @touchstart="handleTouchStart"
      @touchend="handleTouchEnd"
    >
    <div v-for="(item, index) in arrayOfImage" :key="index" class="carousel-item">
      <div class="flex justify-between items-center w-full mb-2">
        <div class="flex flex-col items-start">
          <p class="project-name text-xl md:text-2xl text-black dark:text-white">{{ item.title }}</p>
          <div class="flex gap-2 mt-1">
            <span v-for="(tech, tIndex) in item.tech" :key="tIndex" class="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700">
              {{ tech }}
            </span>
          </div>
        </div>
        <div class="flex gap-4">
          <ChevronLeftIcon 
            class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
            :class="isAtStart ? 'text-gray-300 dark:text-gray-700' : 'text-black dark:text-white'"
            @click="changeProject(-1)"
          />
          <ChevronRightIcon 
            class="w-5 h-5 cursor-pointer hover:scale-110 transition-transform" 
            :class="isAtEnd ? 'text-gray-300 dark:text-gray-700' : 'text-black dark:text-white'"
            @click="changeProject(1)"
          />
        </div>
      </div>
        
        <div class="main-image-wrapper relative group">
          <!-- Image Navigation -->
          <div class="absolute inset-0 flex justify-between items-center px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
            <button 
              @click.stop="prevImage(index)" 
              class="bg-white/80 dark:bg-black/80 p-2 rounded-full hover:scale-110 transition-transform backdrop-blur-sm pointer-events-auto"
              :class="{ 'opacity-50 cursor-not-allowed': currentImageIndices[index] === 0 }"
              :disabled="currentImageIndices[index] === 0"
            >
              <ChevronLeftIcon class="w-5 h-5 text-black dark:text-white" />
            </button>
            <button 
              @click.stop="nextImage(index)" 
              class="bg-white/80 dark:bg-black/80 p-2 rounded-full hover:scale-110 transition-transform backdrop-blur-sm pointer-events-auto"
              :class="{ 'opacity-50 cursor-not-allowed': currentImageIndices[index] === item.images.length - 1 }"
              :disabled="currentImageIndices[index] === item.images.length - 1"
            >
              <ChevronRightIcon class="w-5 h-5 text-black dark:text-white" />
            </button>
          </div>

          <!-- Counter -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 dark:bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs text-white font-medium z-10">
            {{ currentImageIndices[index] + 1 }} / {{ item.images.length }}
          </div>

          <img 
            :src="item.images[currentImageIndices[index]]" 
            :alt="item.title" 
            class="main-image shadow-md dark:shadow-gray-900/30 transition-all duration-500 border border-gray-200 dark:border-gray-800 rounded-lg" 
            loading="lazy" 
            @click="triggerEasterEgg($event)"
          />
          
          <a v-if="item.link" :href="item.link" target="_blank" class="absolute top-3 right-3 bg-white/90 dark:bg-black/90 p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:scale-110 z-20">
            <ArrowUpRightIcon class="w-5 h-5 text-black dark:text-white"/>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
  import gsap from 'gsap'
  import { ArrowUpRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/24/solid'

  const props = defineProps(['arrayOfImage'])
  const { arrayOfImage } = props

  // Track current image index for each project
  const currentImageIndices = ref(arrayOfImage.map(() => 0))

  const nextImage = (projectIndex) => {
    if (currentImageIndices.value[projectIndex] < arrayOfImage[projectIndex].images.length - 1) {
      currentImageIndices.value[projectIndex]++
    }
  }

  const prevImage = (projectIndex) => {
    if (currentImageIndices.value[projectIndex] > 0) {
      currentImageIndices.value[projectIndex]--
    }
  }

  const triggerEasterEgg = async (event) => {
    // Simple click animation
    gsap.to(event.target, {
      scale: 0.95,
      duration: 0.1,
      yoyo: true,
      repeat: 1
    });

    // Dynamic import for better performance and to avoid build issues if not pre-bundled
    const confetti = (await import('canvas-confetti')).default;

    // Confetti explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  }
  
  const carousel = ref(null)
  const activeIndex = ref(0)
  const isAnimating = ref(false)

  const isAtStart = computed(() => activeIndex.value === 0)
  const isAtEnd = computed(() => activeIndex.value === arrayOfImage.length - 1)

  
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
  
  



  const changeProject = (direction) => {
    if (isAnimating.value) return
  
    const nextIndex = activeIndex.value + direction
    if (nextIndex >= 0 && nextIndex < arrayOfImage.length) {
      isAnimating.value = true
      activeIndex.value = nextIndex
  
      gsap.to(carousel.value, {
        x: `-${nextIndex * 100}%`,
        duration: 1,
        ease: 'power2.out',
        onComplete: () => (isAnimating.value = false),
      })
    }
  }
  
  const handleScroll = (event) => {
    // event.preventDefault() // Removed to allow normal page scroll if needed, but here we want to hijack for carousel?
    // If we want to hijack vertical scroll for horizontal carousel, we keep preventDefault.
    // But usually bad UX.
    // Let's keep it for now as it was requested before.
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
       event.preventDefault()
       if (event.deltaX > 0) changeProject(1)
       else changeProject(-1)
    }
  }
  
  let startX = 0
  const handleTouchStart = (event) => {
    startX = event.touches[0].clientX
  }
  
  const handleTouchEnd = (event) => {
    const endX = event.changedTouches[0].clientX
    if (Math.abs(startX - endX) > 50) {
      changeProject(startX > endX ? 1 : -1)
    }
  }
  
  watch(isDarkMode, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', newValue);
});
  
  onMounted(() => {
  
    document.body.style.overflow = 'hidden'
    isDarkMode.value = localStorage.getItem('theme') === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode.value);
  })
  
  onUnmounted(() => {
    document.body.style.overflow = ''
  })
  </script>
  
  <style scoped>
  
  @reference "../../src/assets/base.css";
  
  .carousel-container {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;
  }

  .project-name {
  font-weight: bold;
  text-align: left;
}

  
  .carousel-track {
    display: flex;
    width: 100%; 
    will-change: transform;
  }
  
  .carousel-item {
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    gap: 1rem;
    padding: 0 1rem;
  }
  
  
  .main-image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .main-image {
    width: 100%;
    max-height: 50vh;
    object-fit: cover;
    border-radius: 12px;
  }
  
  .thumbnail-grid {
    display: flex;
    gap: 0.75rem;
    width: 100%;
    justify-content: flex-start;
    overflow-x: auto;
    padding-bottom: 0.5rem;
  }
  
  .thumbnail-wrapper {
    flex-shrink: 0;
    width: 100px;
    height: 60px;
  }

  
  </style>
  