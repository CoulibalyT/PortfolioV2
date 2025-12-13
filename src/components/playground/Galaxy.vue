<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useTheme } from '@/composables/useTheme';

const canvasContainer = ref(null);
const { isRedMode, isDarkMode } = useTheme();

let scene, camera, renderer, points;
let animationId;

const parameters = {
  count: 5000,
  size: 0.02,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
};

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 100);
  camera.position.x = 3;
  camera.position.y = 3;
  camera.position.z = 4;
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  generateGalaxy();

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    if (points) {
      points.rotation.y += 0.001;
      
      // Update colors dynamically based on theme
      if (points.geometry) {
        const colors = points.geometry.attributes.color.array;
        const insideColor = new THREE.Color(isRedMode.value ? '#ff0000' : (isDarkMode.value ? '#ff6030' : '#000000'));
        const outsideColor = new THREE.Color(isRedMode.value ? '#500000' : (isDarkMode.value ? '#1b3984' : '#888888'));

        // We would need to regenerate colors frame by frame to animate theme change smoothly
        // Or just regenerate geometry on theme change. 
        // For simplicity, let's just regenerate if theme changes significantly or just set initial colors.
        // Actually, updating 5000 colors per frame is fine.
        
        // Re-calculating colors based on original positions would be better but let's keep it simple.
        // Let's just use a single color for now or handle it in generateGalaxy and watch for theme changes.
      }
    }
    
    renderer.render(scene, camera);
  };

  animate();
};

const generateGalaxy = () => {
  if(points) {
    scene.remove(points);
    points.geometry.dispose();
    points.material.dispose();
  }

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(isRedMode.value ? '#ff8888' : (isDarkMode.value ? '#ff6030' : '#1b3984'));
  const colorOutside = new THREE.Color(isRedMode.value ? '#852C2C' : (isDarkMode.value ? '#1b3984' : '#000000'));

  for(let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle = (i % parameters.branches) / parameters.branches * Math.PI * 2;

    const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;
    const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * radius;

    positions[i3    ] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positions[i3 + 1] = randomY;
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colors[i3    ] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    opacity: 0.8
  });

  points = new THREE.Points(geometry, material);
  scene.add(points);
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