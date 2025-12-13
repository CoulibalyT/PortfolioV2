<template>
  <span ref="textContainer" class="inline-block leading-relaxed">
    <span 
      v-for="(word, index) in words" 
      :key="index" 
      class="word inline-block opacity-0 translate-y-4 blur-sm will-change-transform"
      style="margin-right: 0.25em"
    >
      {{ word }}
    </span>
  </span>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import gsap from 'gsap';

const props = defineProps({
  text: {
    type: String,
    required: true
  },
  delay: {
    type: Number,
    default: 0
  },
  duration: {
    type: Number,
    default: 0.8
  }
});

const textContainer = ref(null);
const words = computed(() => props.text.split(' '));

const animate = async () => {
    await nextTick(); // Wait for DOM update
    if (!textContainer.value) return;
    
    const wordElements = textContainer.value.querySelectorAll('.word');
    
    // Reset state
    gsap.set(wordElements, { 
        y: 15, 
        opacity: 0,
        filter: 'blur(4px)'
    });

    gsap.to(wordElements, {
        y: 0,
        opacity: 1,
        filter: 'blur(0px)',
        duration: props.duration,
        stagger: 0.03, // Fast stagger for smooth flow
        ease: "power3.out",
        delay: props.delay
    });
};

onMounted(() => {
    animate();
});

watch(() => props.text, () => {
    animate();
});
</script>