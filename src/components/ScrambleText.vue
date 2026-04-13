<template>
  <span class="scramble-text" :aria-label="text" role="text">{{ displayedText }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 0.8 }, // seconds
  scrambleSpeed: { type: Number, default: 30 }, // ms per frame
  delay: { type: Number, default: 0 } // ms delay before start
});

const displayedText = ref(''); // Start empty
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';

let intervalId = null;
let timeoutId = null;

const startScramble = (newText) => {
  // Clear any existing timers
  if (intervalId) clearInterval(intervalId);
  if (timeoutId) clearTimeout(timeoutId);

  // Wait for delay
  timeoutId = setTimeout(() => {
    const start = Date.now();
    const length = newText.length;
    
    intervalId = setInterval(() => {
      const now = Date.now();
      const progress = (now - start) / (props.duration * 1000);
      
      if (progress >= 1) {
        displayedText.value = newText;
        clearInterval(intervalId);
        return;
      }
      
      let result = '';
      for (let i = 0; i < length; i++) {
        // Reveal character if progress covers it
        if (i < length * progress) {
          result += newText[i];
        } else {
          // Show random char
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      
      displayedText.value = result;
      
    }, props.scrambleSpeed);
  }, props.delay);
};

onMounted(() => {
  startScramble(props.text);
});

watch(() => props.text, (newVal) => {
  startScramble(newVal);
});
</script>

<style scoped>
.scramble-text {
  display: inline-block;
  white-space: pre;
  min-width: 1ch;
}
</style>