<template>
  <span class="inline-block min-w-[1ch]">{{ displayedText }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 1.5 }, // seconds
  delay: { type: Number, default: 0 }, // ms
  scrambleSpeed: { type: Number, default: 50 } // ms per frame
});

const displayedText = ref('');
// Characters to use for scrambling (Matrix/Tech feel)
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';

let intervalId = null;
let timeoutId = null;

const startScramble = () => {
  if (!props.text) return;
  
  // Initial state: random characters
  const length = props.text.length;
  let frame = 0;
  const totalFrames = (props.duration * 1000) / props.scrambleSpeed;
  
  // Clear any existing intervals
  if (intervalId) clearInterval(intervalId);
  
  intervalId = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    
    let result = '';
    for (let i = 0; i < length; i++) {
      // If we've progressed past this character's index relative to total length, reveal it
      // Adding some randomness to the reveal threshold so it's not perfectly linear
      if (progress * length > i) {
        result += props.text[i];
      } else {
        // Otherwise show a random character
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    displayedText.value = result;
    
    if (progress >= 1) {
      displayedText.value = props.text;
      clearInterval(intervalId);
    }
  }, props.scrambleSpeed);
};

onMounted(() => {
  // Initialize with empty or random string of correct length to reserve space?
  // For now, start empty or wait for delay.
  displayedText.value = ''; 
  
  timeoutId = setTimeout(() => {
    startScramble();
  }, props.delay);
});

watch(() => props.text, () => {
  if (timeoutId) clearTimeout(timeoutId);
  if (intervalId) clearInterval(intervalId);
  
  timeoutId = setTimeout(() => {
    startScramble();
  }, props.delay);
});
</script>