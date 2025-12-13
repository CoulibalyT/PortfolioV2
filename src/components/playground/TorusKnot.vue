<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useTheme } from '@/composables/useTheme';

const canvasContainer = ref(null);
const { isRedMode, isDarkMode } = useTheme();

let scene, camera, renderer, torusKnot;
let animationId;

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 3;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
  const material = new THREE.MeshBasicMaterial({ 
    color: isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000),
    wireframe: true 
  });
  
  torusKnot = new THREE.Mesh(geometry, material);
  scene.add(torusKnot);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (torusKnot) {
      torusKnot.rotation.x += 0.01;
      torusKnot.rotation.y += 0.01;
      
      if (torusKnot.material) {
         torusKnot.material.color.setHex(isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000));
      }
    }
    renderer.render(scene, camera);
  };

  animate();
};

const handleResize = () => {
  if (camera && renderer && canvasContainer.value) {
    const width = canvasContainer.value.clientWidth;
    const height = canvasContainer.value.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }
};

onMounted(() => {
  initThree();
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    if (canvasContainer.value && canvasContainer.value.contains(renderer.domElement)) {
      canvasContainer.value.removeChild(renderer.domElement);
    }
  }
});
</script>