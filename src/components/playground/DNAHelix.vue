<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useTheme } from '@/composables/useTheme';

const canvasContainer = ref(null);
const { isRedMode, isDarkMode } = useTheme();

let scene, camera, renderer, particles;
let animationId;

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 8;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Create DNA Helix particles
  const geometry = new THREE.BufferGeometry();
  const count = 100; // Particles per strand
  const positions = new Float32Array(count * 3 * 2); // 2 strands

  for (let i = 0; i < count; i++) {
    const t = i * 0.3; // spacing
    
    // Strand 1
    positions[i * 3] = Math.cos(t) * 1.5; // x radius 1.5
    positions[i * 3 + 1] = (i * 0.1) - 5; // y (spread vertically)
    positions[i * 3 + 2] = Math.sin(t) * 1.5; // z radius 1.5

    // Strand 2 (offset by PI)
    const j = i + count;
    positions[j * 3] = Math.cos(t + Math.PI) * 1.5;
    positions[j * 3 + 1] = (i * 0.1) - 5;
    positions[j * 3 + 2] = Math.sin(t + Math.PI) * 1.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.1,
    color: isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000),
    transparent: true,
    opacity: 0.8
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    if (particles) {
      particles.rotation.y += 0.02;
      particles.rotation.z += 0.01;
      
      if (particles.material) {
         particles.material.color.setHex(isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000));
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