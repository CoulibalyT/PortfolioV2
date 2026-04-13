<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
let scene, camera, renderer, particles, animationId;
let currentShape = 0;
let morphProgress = 1;
let targetPositions = [];
const PARTICLE_COUNT = 15000;

// Shape generators
function generateSphere(count, radius = 2) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = radius * Math.cbrt(Math.random());
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = r * Math.cos(phi);
  }
  return positions;
}

function generateCube(count, size = 2) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    // Distribute on surface of cube
    const face = Math.floor(Math.random() * 6);
    const u = (Math.random() - 0.5) * size;
    const v = (Math.random() - 0.5) * size;
    const h = size / 2;
    if (face === 0) { positions[i * 3] = h; positions[i * 3 + 1] = u; positions[i * 3 + 2] = v; }
    else if (face === 1) { positions[i * 3] = -h; positions[i * 3 + 1] = u; positions[i * 3 + 2] = v; }
    else if (face === 2) { positions[i * 3] = u; positions[i * 3 + 1] = h; positions[i * 3 + 2] = v; }
    else if (face === 3) { positions[i * 3] = u; positions[i * 3 + 1] = -h; positions[i * 3 + 2] = v; }
    else if (face === 4) { positions[i * 3] = u; positions[i * 3 + 1] = v; positions[i * 3 + 2] = h; }
    else { positions[i * 3] = u; positions[i * 3 + 1] = v; positions[i * 3 + 2] = -h; }
  }
  return positions;
}

function generateTorus(count, R = 1.8, r = 0.6) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI * 2;
    const rr = r * Math.sqrt(Math.random());
    positions[i * 3] = (R + rr * Math.cos(phi)) * Math.cos(theta);
    positions[i * 3 + 1] = rr * Math.sin(phi);
    positions[i * 3 + 2] = (R + rr * Math.cos(phi)) * Math.sin(theta);
  }
  return positions;
}

function generateDNA(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = (i / count) * 20 - 10;
    const strand = Math.random() > 0.5 ? 1 : -1;
    const angle = t * 0.8;
    const r = 0.8 + (Math.random() - 0.5) * 0.2;
    positions[i * 3] = Math.cos(angle + strand * 1.5) * r;
    positions[i * 3 + 1] = t * 0.3;
    positions[i * 3 + 2] = Math.sin(angle + strand * 1.5) * r;
  }
  return positions;
}

function generateHeart(count) {
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const t = Math.random() * Math.PI * 2;
    const s = Math.random() * Math.PI;
    const scale = 1.5;
    const x = scale * (16 * Math.pow(Math.sin(t), 3)) / 16;
    const y = scale * (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) / 16;
    const z = (Math.random() - 0.5) * 0.5;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
  }
  return positions;
}

const shapes = [generateSphere, generateCube, generateTorus, generateDNA, generateHeart];
const SHAPE_NAMES = ['Sphere', 'Cube', 'Torus', 'DNA', 'Heart'];

const initThree = () => {
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.z = 6;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Initialize particles with first shape
  const initialPositions = shapes[0](PARTICLE_COUNT);
  targetPositions = [...initialPositions];

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(initialPositions, 3));

  // Colors
  const colors = new Float32Array(PARTICLE_COUNT * 3);
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const t = i / PARTICLE_COUNT;
    colors[i * 3] = 0.78 + t * 0.22;     // R: lime to white
    colors[i * 3 + 1] = 1.0;              // G
    colors[i * 3 + 2] = t * 0.3;          // B
  }
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.02,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
  });

  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  // Auto-morph every 3 seconds
  setInterval(() => {
    currentShape = (currentShape + 1) % shapes.length;
    targetPositions = shapes[currentShape](PARTICLE_COUNT);
    morphProgress = 0;
  }, 3000);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.001;

  if (particles) {
    const pos = particles.geometry.attributes.position.array;

    // Morph towards target
    if (morphProgress < 1) {
      morphProgress = Math.min(1, morphProgress + 0.015);
      const ease = morphProgress * morphProgress * (3 - 2 * morphProgress); // smoothstep

      for (let i = 0; i < pos.length; i++) {
        pos[i] += (targetPositions[i] - pos[i]) * ease * 0.08;
      }
      particles.geometry.attributes.position.needsUpdate = true;
    }

    // Gentle rotation
    particles.rotation.y = time * 0.1;
    particles.rotation.x = Math.sin(time * 0.15) * 0.2;
  }

  renderer.render(scene, camera);
};

const onResize = () => {
  if (!canvasContainer.value) return;
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
};

onMounted(() => {
  initThree();
  animate();
  window.addEventListener('resize', onResize);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  if (renderer) { renderer.dispose(); canvasContainer.value?.removeChild(renderer.domElement); }
});
</script>
