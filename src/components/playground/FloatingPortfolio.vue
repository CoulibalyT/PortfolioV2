<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { projects } from '@/data/projects';

const canvasContainer = ref(null);
let scene, camera, renderer, animationId;
let cardMeshes = [];
let cameraAngle = 0, isDragging = false, prevMX = 0;

const initThree = () => {
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
  camera.position.set(0, 2, 8);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Lights
  scene.add(new THREE.AmbientLight(0x334455, 0.6));
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(5, 10, 5);
  scene.add(light);

  // Load textures and create cards
  const loader = new THREE.TextureLoader();
  const count = projects.length;
  const radius = 4;

  projects.forEach((project, i) => {
    const angle = (i / count) * Math.PI * 2;
    const img = project.images[0];
    const imgPath = `/images/projects/${project.folder}/${img.file}`;

    // Card geometry
    const cardGeo = new THREE.BoxGeometry(2, 1.3, 0.05);

    // Load texture
    const texture = loader.load(imgPath);
    texture.colorSpace = THREE.SRGBColorSpace;

    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x222222 }), // right
      new THREE.MeshPhongMaterial({ color: 0x222222 }), // left
      new THREE.MeshPhongMaterial({ color: 0x222222 }), // top
      new THREE.MeshPhongMaterial({ color: 0x222222 }), // bottom
      new THREE.MeshPhongMaterial({ map: texture }), // front
      new THREE.MeshPhongMaterial({ color: 0x111111 }), // back
    ];

    const card = new THREE.Mesh(cardGeo, materials);
    card.position.x = Math.cos(angle) * radius;
    card.position.z = Math.sin(angle) * radius;
    card.position.y = Math.sin(i * 1.5) * 0.8;
    card.lookAt(0, card.position.y, 0);

    // Edge glow
    const edgeGeo = new THREE.BoxGeometry(2.06, 1.36, 0.01);
    const edgeMat = new THREE.MeshBasicMaterial({
      color: 0xc8ff00,
      transparent: true,
      opacity: 0.15,
    });
    const edge = new THREE.Mesh(edgeGeo, edgeMat);
    edge.position.z = -0.03;
    card.add(edge);

    // Label
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#c8ff00';
    ctx.font = 'bold 32px sans-serif';
    ctx.fillText(project.name, 20, 42);
    const labelTex = new THREE.CanvasTexture(canvas);

    const labelGeo = new THREE.PlaneGeometry(2, 0.25);
    const labelMat = new THREE.MeshBasicMaterial({ map: labelTex, transparent: true });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.y = -0.9;
    label.position.z = 0.03;
    card.add(label);

    card.userData = { baseAngle: angle, baseY: card.position.y, index: i };
    scene.add(card);
    cardMeshes.push(card);
  });

  // Particles background
  const particlesGeo = new THREE.BufferGeometry();
  const particlesPos = new Float32Array(3000);
  for (let i = 0; i < 3000; i++) {
    particlesPos[i] = (Math.random() - 0.5) * 40;
  }
  particlesGeo.setAttribute('position', new THREE.BufferAttribute(particlesPos, 3));
  const particlesMat = new THREE.PointsMaterial({ color: 0xc8ff00, size: 0.02, transparent: true, opacity: 0.3 });
  scene.add(new THREE.Points(particlesGeo, particlesMat));
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.001;

  if (!isDragging) cameraAngle += 0.003;

  // Orbit cards
  cardMeshes.forEach(card => {
    const d = card.userData;
    const angle = d.baseAngle + cameraAngle;
    card.position.x = Math.cos(angle) * 4;
    card.position.z = Math.sin(angle) * 4;
    card.position.y = d.baseY + Math.sin(time + d.index) * 0.3;
    card.lookAt(0, card.position.y, 0);
  });

  camera.position.y = 2 + Math.sin(time * 0.3) * 0.5;
  camera.lookAt(0, 0.5, 0);

  renderer.render(scene, camera);
};

const onPointerDown = (e) => { isDragging = true; prevMX = e.clientX; };
const onPointerMove = (e) => { if (isDragging) { cameraAngle += (e.clientX - prevMX) * 0.005; prevMX = e.clientX; } };
const onPointerUp = () => { isDragging = false; };

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
  window.addEventListener('pointerdown', onPointerDown);
  window.addEventListener('pointermove', onPointerMove);
  window.addEventListener('pointerup', onPointerUp);
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('pointerdown', onPointerDown);
  window.removeEventListener('pointermove', onPointerMove);
  window.removeEventListener('pointerup', onPointerUp);
  if (renderer) { renderer.dispose(); canvasContainer.value?.removeChild(renderer.domElement); }
});
</script>
