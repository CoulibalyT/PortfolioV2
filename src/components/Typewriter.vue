<template>
  <span class="typewriter-container">
    <span ref="textElement" class="typewriter-text"></span><span class="cursor" :class="{ 'hidden': !showCursor }">|</span>
  </span>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  speed: {
    type: Number,
    default: 50 // ms per char
  },
  delay: {
    type: Number,
    default: 0
  }
});

const textElement = ref(null);
const showCursor = ref(false);
let tl = null;

const animateText = (newText) => {
  // Kill existing timeline if any
  if (tl) tl.kill();

  tl = gsap.timeline({
    onStart: () => { showCursor.value = true; },
    onComplete: () => { showCursor.value = false; }
  });

  // If there is existing text, backspace it
  const currentText = textElement.value.textContent;
  if (currentText && currentText.length > 0) {
    const backspaceDuration = (currentText.length * 0.02); // Faster backspace
    tl.to(textElement.value, {
      duration: backspaceDuration,
      text: {
        value: "",
        delimiter: ""
      },
      ease: "none"
    });
  }

  // Type new text
  if (newText) {
    const typeDuration = (newText.length * props.speed) / 1000;
    tl.to(textElement.value, {
      duration: typeDuration,
      text: {
        value: newText,
        delimiter: ""
      },
      ease: "none",
      delay: currentText ? 0.2 : (props.delay / 1000) // Add small pause after backspace, or initial delay
    });
  }
};

watch(() => props.text, (newVal) => {
  animateText(newVal);
});

onMounted(() => {
  animateText(props.text);
});

onUnmounted(() => {
  if (tl) tl.kill();
});
</script>

<style scoped>
.cursor {
  display: inline-block;
  margin-left: 2px;
  animation: blink 1s step-end infinite;
  font-weight: 100;
  opacity: 0.7;
}

.cursor.hidden {
  display: none;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
