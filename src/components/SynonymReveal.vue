<template>
  <span 
    class="cursor-help inline-block"
    @mouseenter="swapText"
    @mouseleave="resetText"
  >
    <ScrambleText :text="currentText" :scrambleSpeed="25" />
  </span>
</template>

<script setup>
import { ref, watch } from 'vue';
import ScrambleText from './ScrambleText.vue';

const props = defineProps({
  baseText: { type: String, required: true },
  synonyms: { type: Array, required: true }
});

const currentText = ref(props.baseText);

watch(() => props.baseText, (newVal) => {
  currentText.value = newVal;
});

const swapText = () => {
  if (props.synonyms && props.synonyms.length > 0) {
    // Pick a random synonym different from current if possible
    let random;
    do {
      random = props.synonyms[Math.floor(Math.random() * props.synonyms.length)];
    } while (random === currentText.value && props.synonyms.length > 1);
    
    currentText.value = random;
  }
};

const resetText = () => {
  currentText.value = props.baseText;
};
</script>
