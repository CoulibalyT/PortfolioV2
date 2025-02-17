<template>
  <div class="carousel-container" ref="carousel">
    <div 
      v-for="(project, index) in arrayOfImage" 
      :key="index" 
      class="carousel-item"
    >
      <!-- Nom du projet (fixe, ne scroll pas avec les images) -->
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
      <!-- Conteneur des miniatures -->
      <div class="thumbnails-container">
        <div class="thumbnails-track">
          <img 
            v-for="(thumbnail, i) in project.thumbnails" 
            :key="i" 
            :src="thumbnail" 
            alt="Thumbnail"
            class="thumbnail-image"
          />
        </div>
      </div>
      <a v-if="project.link" class="float-right" :href="project.link"><ArrowUpRightIcon class="h-[60px] w-10 text-white"/></a>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ArrowUpRightIcon, ChevronRightIcon, ChevronLeftIcon } from '@heroicons/vue/24/solid'

// Props
const { arrayOfImage } = defineProps(['arrayOfImage'])

// Références et état
const carousel = ref(null)
const isAtStart = ref(true)
const isAtEnd = ref(false)

// Détecter la position du scroll
const updateArrowState = () => {
  if (carousel.value) {
    const container = carousel.value
    isAtStart.value = container.scrollLeft === 0
    isAtEnd.value = container.scrollWidth === container.scrollLeft + container.clientWidth
  }
}

onMounted(() => {
  updateArrowState()
  // Ajouter un événement de scroll pour mettre à jour les chevrons
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
  /* padding: 20px; */
}

.carousel-item {
  flex: 0 0 100%;
  text-align: center;
  scroll-snap-align: center;
  position: relative;
}

/* Style pour le nom du projet */
.project-name {
  font-weight: bold;
  color: white;
  text-align: left;
}

.thumbnails-container {
  width: 100%;
  height: 220px;
  overflow-y: auto;
  /* padding: 10px; */
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
  border: 2px solid white;
  scroll-snap-align: start;
  margin-bottom: 10px;
  flex-shrink: 0;
}
</style>
