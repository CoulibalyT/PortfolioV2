<template>
  <span 
    class="hover-reveal-wrapper relative inline-block cursor-pointer"
    @mouseenter="onEnter"
    @mouseleave="onLeave"
    @mousemove="onMove"
  >
    <slot></slot>
    <Teleport to="body">
      <div 
        ref="revealImage"
        class="fixed top-0 left-0 pointer-events-none z-[9999] overflow-hidden rounded-lg shadow-2xl opacity-0 bg-gray-200 dark:bg-gray-800"
        :style="{ 
          width: '250px',
          height: '180px',
        }"
      >
        <img :src="image" class="w-full h-full object-cover" />
      </div>
    </Teleport>
  </span>
</template>

<script setup>
import { ref } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  image: {
    type: String,
    required: true
  }
});

const revealImage = ref(null);
const isHovered = ref(false);

const onEnter = () => {
  isHovered.value = true;
  gsap.to(revealImage.value, {
    opacity: 1,
    scale: 1,
    duration: 0.3,
    ease: 'power2.out'
  });
};

const onLeave = () => {
  isHovered.value = false;
  gsap.to(revealImage.value, {
    opacity: 0,
    scale: 0.8,
    duration: 0.3,
    ease: 'power2.in'
  });
};

const onMove = (e) => {
  if (!revealImage.value) return;
  
  // Move image with cursor, slightly offset
  gsap.to(revealImage.value, {
    x: e.clientX,
    y: e.clientY,
    xPercent: -50,
    yPercent: -50,
    rotation: (e.clientX - window.innerWidth / 2) * 0.02, // Subtle rotation based on screen position
    duration: 0.5,
    ease: 'power3.out'
  });
};
</script>
