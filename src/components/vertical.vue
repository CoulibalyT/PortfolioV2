<template>
  <div class="carousel-container" ref="carousel">
    <div 
      v-for="(project, index) in arrayOfImage" 
      :key="index" 
      class="carousel-item"
    >
      <!-- Nom du projet (fixe, ne scroll pas avec les images) -->
      <p class="project-name">{{ project.title }}</p>

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
      <a v-if="project.link" class=" float-right" :href="project.link"><ArrowUpRightIcon class="h-[60px] w-10 text-white"/></a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
  import { ArrowUpRightIcon } from '@heroicons/vue/24/solid';


// Props
const { arrayOfImage } = defineProps(['arrayOfImage'])
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
  margin-bottom: 10px;
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
