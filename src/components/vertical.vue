<template>
  <div class="carousel-container" :class="{ 'dark': isDarkMode }" ref="carousel">
    <div 
      v-for="(project, index) in arrayOfImage" 
      :key="index" 
      class="carousel-item"
    >
      <div class="flex justify-between items-center pb-3">
        <p class="project-name">{{ project.title }}</p>
        <div class="flex">
          <ChevronLeftIcon 
            class="w-5" 
            :class="{ 'text-gray-500': isAtStart }"
          />
          <ChevronRightIcon 
            class="w-5" 
            :class="{ 'text-gray-500': isAtEnd }"
          />
        </div>
      </div>
      <div class="thumbnails-container">
        <div class="thumbnails-track">
          <img 
            v-for="(thumbnail, i) in project.thumbnails" 
            :key="i" 
            :src="thumbnail" 
            loading="lazy"
            alt="Thumbnail"
            class="thumbnail-image"
            :class="{ 'light-border': !isDarkMode }"
          />
        </div>
      </div>
      <a v-if="project.link"  target="_blank"  class="float-right" :href="project.link">
        <ArrowUpRightIcon class="h-[60px] w-10" />
      </a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { ArrowUpRightIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'

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

const { arrayOfImage } = defineProps(['arrayOfImage'])
const isDarkMode = ref(localStorage.getItem('theme') === 'dark');

watch(isDarkMode, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light');
  document.documentElement.classList.toggle('dark', newValue);
});

onMounted(() => {
  isDarkMode.value = localStorage.getItem('theme') === 'dark';
  document.documentElement.classList.toggle('dark', isDarkMode.value);
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

.thumbnails-container {
  width: 100%;
  height: 220px;
  overflow-y: auto;
  scroll-snap-type: y mandatory;
}

.thumbnails-container::-webkit-scrollbar {
  width: 6px;
}

.thumbnails-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.thumbnails-container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 3px;
}

.thumbnails-track {
  display: flex;
  flex-direction: column;
}

.thumbnail-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  background-color: white;
  border: 2px solid transparent;
  scroll-snap-align: start;
  margin-bottom: 10px;
  flex-shrink: 0;
}

/* Bordure visible seulement en mode light */
.light-border {
  border-color: #eaeaea;
}
</style>