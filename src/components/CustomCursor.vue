<template>
  <div class="cursor-wrapper hidden md:block pointer-events-none fixed inset-0 z-[9999] mix-blend-difference">
    <div ref="cursorDot" class="cursor-dot bg-white w-3 h-3 rounded-full absolute top-0 left-0"></div>
    <div ref="cursorRing" class="cursor-ring border border-white w-10 h-10 rounded-full absolute top-0 left-0 transition-transform duration-100 ease-out"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import gsap from 'gsap';

const cursorDot = ref(null);
const cursorRing = ref(null);

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;

const onMouseMove = (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  
  // Immediate update for dot
  gsap.to(cursorDot.value, {
    x: mouseX,
    y: mouseY,
    duration: 0,
    overwrite: true
  });
};

const lerp = (start, end, factor) => {
  return start + (end - start) * factor;
};

const animate = () => {
  // Smooth follow for ring
  ringX = lerp(ringX, mouseX, 0.15);
  ringY = lerp(ringY, mouseY, 0.15);
  
  gsap.set(cursorRing.value, {
    x: ringX,
    y: ringY
  });
  
  requestAnimationFrame(animate);
};

const onHoverStart = () => {
  gsap.to(cursorRing.value, {
    scale: 1.5,
    duration: 0.3,
    ease: "power2.out"
  });
  gsap.to(cursorDot.value, {
    scale: 0.5,
    duration: 0.3
  });
};

const onHoverEnd = () => {
  gsap.to(cursorRing.value, {
    scale: 1,
    duration: 0.3,
    ease: "power2.out"
  });
  gsap.to(cursorDot.value, {
    scale: 1,
    duration: 0.3
  });
};

onMounted(() => {
  // Center the cursor elements initially
  gsap.set([cursorDot.value, cursorRing.value], { xPercent: -50, yPercent: -50 });

  window.addEventListener('mousemove', onMouseMove);
  
  // Add listeners for interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, textarea, select, .cursor-pointer');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', onHoverStart);
    el.addEventListener('mouseleave', onHoverEnd);
  });

  // Observer for dynamic elements
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.addedNodes.length) {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === 1) { // Element node
            const elements = node.querySelectorAll ? node.querySelectorAll('a, button, input, textarea, select, .cursor-pointer') : [];
            if (node.matches && node.matches('a, button, input, textarea, select, .cursor-pointer')) {
              node.addEventListener('mouseenter', onHoverStart);
              node.addEventListener('mouseleave', onHoverEnd);
            }
            elements.forEach(el => {
              el.addEventListener('mouseenter', onHoverStart);
              el.addEventListener('mouseleave', onHoverEnd);
            });
          }
        });
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true
  });

  animate();
});

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove);
});
</script>

<style>
/* Hide default cursor on non-touch devices */
@media (hover: hover) and (pointer: fine) {
  body {
    cursor: none;
  }
  
  a, button, input, textarea, select {
    cursor: none;
  }
}
</style>