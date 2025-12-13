<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { useTheme } from '@/composables/useTheme';

const canvasContainer = ref(null);
const { isRedMode, isDarkMode } = useTheme();

let scene, camera, renderer, planeMesh;
let animationId;
let count = 0;

const initThree = () => {
  const width = canvasContainer.value.clientWidth;
  const height = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  // Tilted camera for better view of the grid
  camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
  camera.position.set(0, 2, 3);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Plane Geometry
  const geometry = new THREE.PlaneGeometry(6, 6, 30, 30);
  
  // Material
  const material = new THREE.MeshBasicMaterial({ 
    color: isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000),
    wireframe: true,
    side: THREE.DoubleSide
  });

  planeMesh = new THREE.Mesh(geometry, material);
  planeMesh.rotation.x = -Math.PI / 2.5; // Lay flat but tilted
  scene.add(planeMesh);

  const animate = () => {
    animationId = requestAnimationFrame(animate);
    
    count += 0.05;

    if (planeMesh) {
      const positionAttribute = planeMesh.geometry.attributes.position;
      
      // Animate vertices
      for (let i = 0; i < positionAttribute.count; i++) {
        const x = positionAttribute.getX(i);
        const y = positionAttribute.getY(i); 
        
        // Create wave effect based on x and y coordinates
        // We use the original geometry coordinates to calculate the wave
        // Note: Since we rotate the mesh, local Z is world Up relative to the mesh plane
        
        // To make it wave, we modify the Z attribute of the plane geometry
        // We need to calculate Z based on X and Y
        
        // Simple sine wave
        const z = Math.sin(x * 1.5 + count) * 0.3 + Math.cos(y * 1.5 + count) * 0.3;
        
        positionAttribute.setZ(i, z);
      }
      
      positionAttribute.needsUpdate = true;
      
      // Update color
      if (planeMesh.material) {
         planeMesh.material.color.setHex(isRedMode.value ? 0xffffff : (isDarkMode.value ? 0xffffff : 0x000000));
      }
      
      // Slowly rotate the whole grid
      planeMesh.rotation.z += 0.002;
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