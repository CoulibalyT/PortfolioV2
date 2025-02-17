<template>
    <div class="carousel-container" ref="carousel">
      <div 
        v-for="(project, index) in arrayOfImage" 
        :key="index" 
        class="carousel-item"
      >
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
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
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
  }
  
  .carousel-item {
    flex: 0 0 100%;
    text-align: center;
    scroll-snap-align: center;
  }
  
  .thumbnails-container {
    width: 100%;
    height: 200px; /* Hauteur exacte d'une vignette */
    overflow-y: auto;
    scroll-snap-type: y mandatory;
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
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
    gap: 15px;
  }
  
  .thumbnail-image {
    width: 100%;
    height: 100%; /* Même hauteur que le conteneur */
    object-fit: cover;
    border-radius: 10px;
    scroll-snap-align: start;
    flex-shrink: 0; /* Empêche l'image de se rétrécir */
  }
  </style>