<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useTheme } from '@/composables/useTheme';

const canvasContainer = ref(null);
const { isRedMode, isDarkMode } = useTheme();

let scene, camera, renderer, particlesMesh;
let animationId;
let mouseX = 0;
let mouseY = 0;

const onMouseMove = (event) => {
  mouseX = event.clientX;
  mouseY = event.clientY;
};

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 2;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 2000;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 5; 
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Create a circular texture
  const canvas = document.createElement('canvas');
  canvas.width = 32;
  canvas.height = 32;
  const context = canvas.getContext('2d');
  context.beginPath();
  context.arc(16, 16, 16, 0, 2 * Math.PI);
  context.fillStyle = 'white';
  context.fill();
  const circleTexture = new THREE.CanvasTexture(canvas);

  const material = new THREE.PointsMaterial({
    size: 0.02,
    map: circleTexture,
    color: isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000),
    transparent: true,
    opacity: 0.8,
    alphaTest: 0.5
  });

  particlesMesh = new THREE.Points(particlesGeometry, material);
  scene.add(particlesMesh);

  const clock = new THREE.Clock();

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    if (particlesMesh) {
      particlesMesh.rotation.y = elapsedTime * 0.05;
      particlesMesh.rotation.x = mouseY * 0.0005;
      particlesMesh.rotation.y += mouseX * 0.0005;
      
      if (particlesMesh.material) {
         particlesMesh.material.color.setHex(isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000));
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
  window.addEventListener('mousemove', onMouseMove);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
  window.removeEventListener('mousemove', onMouseMove);
  if (animationId) cancelAnimationFrame(animationId);
  if (renderer) {
    renderer.dispose();
    if (canvasContainer.value && canvasContainer.value.contains(renderer.domElement)) {
      canvasContainer.value.removeChild(renderer.domElement);
    }
  }
});
</script>