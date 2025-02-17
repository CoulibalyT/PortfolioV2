<template>
      <div class="carousel-container" :class="{ 'dark': isDarkMode }">
        <div
          class="carousel-track"
          ref="carousel"
          @wheel.prevent="handleScroll"
          @touchstart="handleTouchStart"
          @touchend="handleTouchEnd"
        >
          <div v-for="(item, index) in arrayOfImage" :key="index" class="carousel-item border-white border-2 dark:border-black" > 
            <div class="main-image-wrapper">
              <img :src="item.mainImage" :alt="item.title" class="main-image" ref="imageRef" />
            </div>
            <div class="thumbnail-grid hidden md:flex" ref="gridRef">
              <template v-for="(src, i) in item.thumbnails" :key="i">
                <img
                  :src="src"
                  alt="Thumbnail"
                  class="thumbnail"
                  @click="changeMainImage(src, index)"
                />
              </template>
              <a v-if="item.link" class=" m-auto" :href="item.link"><ArrowUpRightIcon class="h-[60px] w-full text-black"/></a>
            </div>
          </div>
        </div>
      </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import gsap from 'gsap'
  import { ArrowUpRightIcon } from '@heroicons/vue/24/solid';

  const {arrayOfImage} = defineProps(['arrayOfImage'])

  
  const carousel = ref(null)
  const activeIndex = ref(0)
  const isAnimating = ref(false)
  const imageRef = ref(null)
  const gridRef = ref(null)
  
  
  const isDarkMode = ref(localStorage.getItem('theme') === 'dark')
  

  const changeProject = (direction) => {
    if (isAnimating.value) return
  
    const nextIndex = activeIndex.value + direction
    if (nextIndex >= 0 && nextIndex < arrayOfImage.length) {
      isAnimating.value = true
      activeIndex.value = nextIndex
  
      gsap.to(carousel.value, {
        x: `-${nextIndex * 100}%`,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => (isAnimating.value = false),
      })
    }
  }
  
  const handleScroll = (event) => {
    event.preventDefault()
    if (event.deltaY > 0 || event.deltaX > 0) {
      changeProject(1)
    } else {
      changeProject(-1)
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
  
  const changeMainImage = (thumbnailSrc, index) => {
    const project = arrayOfImage[index]
  
    if (project.mainImage !== thumbnailSrc) {
      // Remplacer l’image principale et la réintégrer dans les vignettes
      project.thumbnails = [
        project.mainImage, // L'ancienne image principale devient une vignette
        ...project.thumbnails.filter((img) => img !== thumbnailSrc), // On enlève la vignette sélectionnée
      ]
      project.mainImage = thumbnailSrc // Nouvelle image principale
    }
  }
  
  // import base from '../../src/assets/base.css'
  
  onMounted(() => {
  
    document.body.style.overflow = 'hidden'
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
  
  .carousel-track {
    display: flex;
    width: 100%; /* Nombre de projets * 100% */
    /* height: 100%;`` */
    /* gap: 4rem; Ajoute un espace de 4rem entre les projets */
    will-change: transform;
  }
  
  .carousel-item {
    /* @apply  ; */
    flex: 0 0 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    border-radius: 20px;
    /* border: 4px solid; Tailwind applique la couleur via @apply */
    gap: 2rem;
    padding: 1rem;
  }
  
  
  .main-image-wrapper {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .main-image {
    width: 100%;
    height: auto;
    object-fit: contain;
    /* border: 1px solid #ececec; Bordure légère */
    border-radius: 10px; /* Coins arrondis */
  }
  
  .thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
    gap: 0.5rem;
    width: 100%;
    justify-content: center;
  }
  
  .thumbnail {
    @apply w-full object-cover cursor-pointer h-full ;
  
    border-radius: 6px;
    border: 0.5px solid #ececec;
    transition: transform 0.2s ease;
  }
  
  .thumbnail:hover {
    transform: scale(1.05);
  }
  
  </style>
  