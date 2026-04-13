<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
let scene, camera, renderer, animationId;
let planets = [];
let starField;

const PLANETS = [
  { name: 'Mercury', radius: 0.08, distance: 1.5, speed: 4.15, color: 0xaaaaaa, ring: false },
  { name: 'Venus', radius: 0.12, distance: 2.2, speed: 1.62, color: 0xffcc66, ring: false },
  { name: 'Earth', radius: 0.13, distance: 3.0, speed: 1.0, color: 0x4488ff, ring: false },
  { name: 'Mars', radius: 0.1, distance: 3.8, speed: 0.53, color: 0xff6644, ring: false },
  { name: 'Jupiter', radius: 0.35, distance: 5.5, speed: 0.084, color: 0xffaa44, ring: false },
  { name: 'Saturn', radius: 0.3, distance: 7.2, speed: 0.034, color: 0xffdd88, ring: true },
  { name: 'Uranus', radius: 0.2, distance: 9.0, speed: 0.012, color: 0x88ddff, ring: true },
  { name: 'Neptune', radius: 0.19, distance: 10.5, speed: 0.006, color: 0x4466ff, ring: false },
];

let cameraAngle = 0;
let cameraHeight = 4;
let cameraDistance = 14;
let isDragging = false, prevMX = 0, prevMY = 0;

const initThree = () => {
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 200);
  camera.position.set(0, cameraHeight, cameraDistance);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Sun
  const sunGeo = new THREE.SphereGeometry(0.5, 32, 32);
  const sunMat = new THREE.MeshBasicMaterial({ color: 0xffcc00 });
  const sun = new THREE.Mesh(sunGeo, sunMat);
  scene.add(sun);

  // Sun glow
  const glowGeo = new THREE.SphereGeometry(0.7, 32, 32);
  const glowMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
        float intensity = pow(0.6 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
        gl_FragColor = vec4(1.0, 0.8, 0.2, intensity * 0.5);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  scene.add(new THREE.Mesh(glowGeo, glowMat));

  // Sun light
  const light = new THREE.PointLight(0xffcc00, 2, 50);
  scene.add(light);
  scene.add(new THREE.AmbientLight(0x222233, 0.3));

  // Planets
  PLANETS.forEach(p => {
    const group = new THREE.Group();

    // Orbit line
    const orbitGeo = new THREE.BufferGeometry();
    const orbitPts = [];
    for (let i = 0; i <= 128; i++) {
      const a = (i / 128) * Math.PI * 2;
      orbitPts.push(Math.cos(a) * p.distance, 0, Math.sin(a) * p.distance);
    }
    orbitGeo.setAttribute('position', new THREE.Float32BufferAttribute(orbitPts, 3));
    const orbitMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.06 });
    scene.add(new THREE.Line(orbitGeo, orbitMat));

    // Planet
    const planetGeo = new THREE.SphereGeometry(p.radius, 24, 24);
    const planetMat = new THREE.MeshPhongMaterial({ color: p.color, shininess: 30 });
    const mesh = new THREE.Mesh(planetGeo, planetMat);
    group.add(mesh);

    // Ring
    if (p.ring) {
      const ringGeo = new THREE.RingGeometry(p.radius * 1.4, p.radius * 2, 64);
      const ringMat = new THREE.MeshBasicMaterial({ color: p.color, transparent: true, opacity: 0.3, side: THREE.DoubleSide });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2.5;
      group.add(ring);
    }

    scene.add(group);
    planets.push({ group, data: p, angle: Math.random() * Math.PI * 2 });
  });

  // Stars
  const starsGeo = new THREE.BufferGeometry();
  const starsPos = new Float32Array(6000);
  for (let i = 0; i < 6000; i++) {
    starsPos[i] = (Math.random() - 0.5) * 100;
  }
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starsPos, 3));
  const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05, transparent: true, opacity: 0.7 });
  starField = new THREE.Points(starsGeo, starsMat);
  scene.add(starField);
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.0005;

  planets.forEach(p => {
    p.angle += p.data.speed * 0.005;
    p.group.position.x = Math.cos(p.angle) * p.data.distance;
    p.group.position.z = Math.sin(p.angle) * p.data.distance;
  });

  // Camera orbit
  if (!isDragging) {
    cameraAngle += 0.001;
  }
  camera.position.x = Math.sin(cameraAngle) * cameraDistance;
  camera.position.z = Math.cos(cameraAngle) * cameraDistance;
  camera.position.y = cameraHeight;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
};

const onPointerDown = (e) => { isDragging = true; prevMX = e.clientX; prevMY = e.clientY; };
const onPointerMove = (e) => {
  if (!isDragging) return;
  cameraAngle += (e.clientX - prevMX) * 0.003;
  cameraHeight += (e.clientY - prevMY) * 0.02;
  cameraHeight = Math.max(-5, Math.min(12, cameraHeight));
  prevMX = e.clientX;
  prevMY = e.clientY;
};
const onPointerUp = () => { isDragging = false; };
const onWheel = (e) => {
  cameraDistance += e.deltaY * 0.01;
  cameraDistance = Math.max(4, Math.min(25, cameraDistance));
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
  canvasContainer.value.addEventListener('pointerdown', onPointerDown);
  canvasContainer.value.addEventListener('pointermove', onPointerMove);
  canvasContainer.value.addEventListener('pointerup', onPointerUp);
  canvasContainer.value.addEventListener('wheel', onWheel, { passive: true });
});

onUnmounted(() => {
  cancelAnimationFrame(animationId);
  window.removeEventListener('resize', onResize);
  if (renderer) { renderer.dispose(); canvasContainer.value?.removeChild(renderer.domElement); }
});
</script>
