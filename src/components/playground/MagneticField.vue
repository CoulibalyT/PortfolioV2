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
let mouse = new THREE.Vector2(9999, 9999); // Start far away
let raycaster = new THREE.Raycaster();
let plane; // Invisible plane for raycasting

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Invisible plane for mouse interaction
  const planeGeometry = new THREE.PlaneGeometry(200, 200);
  const planeMaterial = new THREE.MeshBasicMaterial({ visible: false });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  scene.add(plane);

  // Particles Grid
  const geometry = new THREE.BufferGeometry();
  const count = 4000; // 63x63 approx
  const positions = new Float32Array(count * 3);
  const originalPositions = new Float32Array(count * 3);
  
  const gridSize = 60;
  const gap = 1.5;
  const offset = (gridSize * gap) / 2; // Center the grid

  let i = 0;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      if (i >= count) break;
      
      const px = (x * gap) - 45;
      const py = (y * gap) - 45;
      const pz = 0;

      positions[i * 3] = px;
      positions[i * 3 + 1] = py;
      positions[i * 3 + 2] = pz;

      originalPositions[i * 3] = px;
      originalPositions[i * 3 + 1] = py;
      originalPositions[i * 3 + 2] = pz;

      i++;
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('originalPosition', new THREE.BufferAttribute(originalPositions, 3));

  const material = new THREE.PointsMaterial({
    size: 0.4,
    color: isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000),
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  const animate = () => {
    animationId = requestAnimationFrame(animate);

    // Update color based on theme
    if (particles.material) {
      particles.material.color.setHex(isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000));
    }

    // Interaction Logic
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObject(plane);

    if (intersects.length > 0) {
      const point = intersects[0].point;
      const positions = particles.geometry.attributes.position.array;
      const originals = particles.geometry.attributes.originalPosition.array;

      for (let i = 0; i < count; i++) {
        const px = positions[i * 3];
        const py = positions[i * 3 + 1];
        const pz = positions[i * 3 + 2];

        const ox = originals[i * 3];
        const oy = originals[i * 3 + 1];
        const oz = originals[i * 3 + 2];

        // Calculate distance from mouse point to original position
        const dx = point.x - ox;
        const dy = point.y - oy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        // Repulsion force
        const maxDist = 15;
        const force = Math.max(0, maxDist - dist) / maxDist;
        const power = 15; // Strength of repulsion

        if (dist < maxDist) {
          const angle = Math.atan2(dy, dx);
          // Move away from mouse
          // Target position
          const tx = ox - Math.cos(angle) * force * power;
          const ty = oy - Math.sin(angle) * force * power;
          const tz = oz - force * 10; // Also push back in Z

          // Lerp current to target
          positions[i * 3] += (tx - px) * 0.1;
          positions[i * 3 + 1] += (ty - py) * 0.1;
          positions[i * 3 + 2] += (tz - pz) * 0.1;
        } else {
          // Return to original
          positions[i * 3] += (ox - px) * 0.1;
          positions[i * 3 + 1] += (oy - py) * 0.1;
          positions[i * 3 + 2] += (oz - pz) * 0.1;
        }
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    renderer.render(scene, camera);
  };

  animate();
};

const onMouseMove = (event) => {
  // Calculate mouse position in normalized device coordinates (-1 to +1)
  const rect = canvasContainer.value.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
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