<template>
  <span class="scramble-text">{{ displayedText }}</span>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';

const props = defineProps({
  text: { type: String, required: true },
  duration: { type: Number, default: 0.8 }, // seconds
  scrambleSpeed: { type: Number, default: 30 } // ms per frame
});

const displayedText = ref(props.text);
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?/~';

let intervalId = null;

const startScramble = (newText) => {
  const start = Date.now();
  const length = Math.max(displayedText.value.length, newText.length);
  
  if (intervalId) clearInterval(intervalId);
  
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
      if (i < newText.length * progress) {
        result += newText[i];
      } else {
        // Show random char
        result += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    
    // Adjust length smoothly
    const currentLength = Math.floor(length * (1 - progress) + newText.length * progress);
    displayedText.value = result.slice(0, currentLength);
    
  }, props.scrambleSpeed);
};

watch(() => props.text, (newVal) => {
  startScramble(newVal);
});

onMounted(() => {
  displayedText.value = props.text;
});
</script>

<style scoped>
.scramble-text {
  display: inline-block;
  white-space: pre;
  min-width: 1ch;
}
</style>