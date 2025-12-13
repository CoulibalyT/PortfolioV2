<template>
  <div class="carousel-container" :class="{ 'dark': isDarkMode }" ref="carousel">
    <div 
      v-for="(project, index) in arrayOfImage" 
      :key="index" 
      class="carousel-item"
    >
      <div class="flex justify-between items-center pb-3 px-2">
        <div class="flex flex-col items-start">
          <p class="project-name text-xl font-bold text-black dark:text-white" :class="{ 'text-white': isRedMode }">{{ project.title }}</p>
          <div class="flex gap-1.5 mt-1 flex-wrap">
            <span v-for="(tech, tIndex) in project.tech" :key="tIndex" 
                  class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700"
                  :class="{ '!bg-white/10 !border-white/20 !text-white': isRedMode }">
              {{ tech }}
            </span>
          </div>
        </div>
        <a v-if="project.link" :href="project.link" target="_blank" 
           class="bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full"
           :class="{ '!bg-white/10': isRedMode }">
          <ArrowUpRightIcon class="w-4 h-4 text-black dark:text-white" :class="{ '!text-white': isRedMode }" />
        </a>
      </div>
      
      <div class="main-image-container mb-3 rounded-lg overflow-hidden shadow-sm relative group">
        <!-- Image Navigation -->
        <div class="absolute inset-0 flex justify-between items-center px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
          <button 
            @click.stop="prevImage(index)" 
            class="bg-white/80 dark:bg-black/80 p-1.5 rounded-full backdrop-blur-sm pointer-events-auto"
            :class="{ 'opacity-50': currentImageIndices[index] === 0 }"
            :disabled="currentImageIndices[index] === 0"
          >
            <ChevronLeftIcon class="w-4 h-4 text-black dark:text-white" />
          </button>
          <button 
            @click.stop="nextImage(index)" 
            class="bg-white/80 dark:bg-black/80 p-1.5 rounded-full backdrop-blur-sm pointer-events-auto"
            :class="{ 'opacity-50': currentImageIndices[index] === project.images.length - 1 }"
            :disabled="currentImageIndices[index] === project.images.length - 1"
          >
            <ChevronRightIcon class="w-4 h-4 text-black dark:text-white" />
          </button>
        </div>

        <!-- Counter -->
        <div class="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 dark:bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] text-white font-medium z-10">
          {{ currentImageIndices[index] + 1 }} / {{ project.images.length }}
        </div>

        <img 
          :src="project.images[currentImageIndices[index]]" 
          class="w-full h-48 object-cover transition-all duration-300 border border-gray-200 dark:border-gray-800" 
          @click="triggerEasterEgg($event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, toRefs } from 'vue'
import { ArrowUpRightIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'
import gsap from 'gsap'
import { useTheme } from '../composables/useTheme'
import { useProjectGallery } from '../composables/useProjectGallery'

const props = defineProps(['arrayOfImage'])
const { arrayOfImage } = toRefs(props)

const { isDarkMode, isRedMode } = useTheme()
const { currentImageIndices, nextImage, prevImage, triggerEasterEgg } = useProjectGallery(arrayOfImage)

const carousel = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

const updateArrowState = () => {
  if (carousel.value) {
    const container = carousel.value
    isAtStart.value = container.scrollLeft === 0
    isAtEnd.value = container.scrollWidth === container.scrollLeft + container.clientWidth
  }
}

onMounted(() => {
  updateArrowState()
  carousel.value.addEventListener('scroll', updateArrowState)
})
</script>

<style scoped>
.carousel-container {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.carousel-item {
  flex: 0 0 100%;
  text-align: center;
  scroll-snap-align: center;
  position: relative;
}

.project-name {
  font-weight: bold;
  text-align: left;
}

</style>