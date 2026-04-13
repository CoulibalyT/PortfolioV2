<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
let scene, camera, renderer, terrain, water, animationId;
let cameraAngle = 0, isDragging = false, prevMX = 0;

// Simple noise function
function noise2D(x, y) {
  const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
  return n - Math.floor(n);
}

function fbm(x, y, octaves = 6) {
  let value = 0, amplitude = 0.5, frequency = 1;
  for (let i = 0; i < octaves; i++) {
    const nx = x * frequency, ny = y * frequency;
    const ix = Math.floor(nx), iy = Math.floor(ny);
    const fx = nx - ix, fy = ny - iy;
    const a = noise2D(ix, iy), b = noise2D(ix + 1, iy);
    const c = noise2D(ix, iy + 1), d = noise2D(ix + 1, iy + 1);
    const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
    value += ((a * (1 - ux) + b * ux) * (1 - uy) + (c * (1 - ux) + d * ux) * uy) * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }
  return value;
}

const initThree = () => {
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x88aacc, 0.015);

  camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 200);
  camera.position.set(0, 8, 20);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  // Lights
  const sun = new THREE.DirectionalLight(0xffffee, 1.5);
  sun.position.set(10, 15, 10);
  scene.add(sun);
  scene.add(new THREE.AmbientLight(0x667788, 0.5));
  scene.add(new THREE.HemisphereLight(0x88bbff, 0x445522, 0.4));

  // Terrain
  const size = 60;
  const segments = 200;
  const terrainGeo = new THREE.PlaneGeometry(size, size, segments, segments);
  terrainGeo.rotateX(-Math.PI / 2);

  const pos = terrainGeo.attributes.position;
  const colors = new Float32Array(pos.count * 3);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const height = fbm(x * 0.04, z * 0.04) * 8 - 1.5;
    pos.setY(i, height);

    // Color by height
    const h = height;
    if (h < -0.2) { colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.55; colors[i * 3 + 2] = 0.4; } // sand
    else if (h < 2) { colors[i * 3] = 0.2; colors[i * 3 + 1] = 0.5 + h * 0.1; colors[i * 3 + 2] = 0.15; } // grass
    else if (h < 4) { colors[i * 3] = 0.4; colors[i * 3 + 1] = 0.35; colors[i * 3 + 2] = 0.25; } // rock
    else { colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.92; colors[i * 3 + 2] = 0.95; } // snow
  }

  terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshPhongMaterial({
    vertexColors: true,
    shininess: 5,
    flatShading: true,
  });
  terrain = new THREE.Mesh(terrainGeo, terrainMat);
  scene.add(terrain);

  // Water
  const waterGeo = new THREE.PlaneGeometry(size, size, 1, 1);
  waterGeo.rotateX(-Math.PI / 2);
  const waterMat = new THREE.MeshPhongMaterial({
    color: 0x2266aa,
    transparent: true,
    opacity: 0.6,
    shininess: 100,
    specular: 0x88ccff,
  });
  water = new THREE.Mesh(waterGeo, waterMat);
  water.position.y = -0.2;
  scene.add(water);

  // Sky dome
  const skyGeo = new THREE.SphereGeometry(80, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const skyMat = new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vWorldPos;
      void main() {
        vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vWorldPos;
      void main() {
        float h = normalize(vWorldPos).y;
        vec3 bottom = vec3(0.7, 0.8, 0.95);
        vec3 top = vec3(0.2, 0.4, 0.8);
        gl_FragColor = vec4(mix(bottom, top, max(h, 0.0)), 1.0);
      }
    `,
    side: THREE.BackSide,
  });
  scene.add(new THREE.Mesh(skyGeo, skyMat));
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.001;

  // Animate water
  if (water) {
    water.position.y = -0.2 + Math.sin(time * 0.5) * 0.1;
  }

  // Camera orbit
  if (!isDragging) cameraAngle += 0.002;
  camera.position.x = Math.sin(cameraAngle) * 20;
  camera.position.z = Math.cos(cameraAngle) * 20;
  camera.position.y = 8 + Math.sin(time * 0.2) * 1;
  camera.lookAt(0, 1, 0);

  renderer.render(scene, camera);
};

const onPointerDown = (e) => { isDragging = true; prevMX = e.clientX; };
const onPointerMove = (e) => { if (isDragging) { cameraAngle += (e.clientX - prevMX) * 0.003; prevMX = e.clientX; } };
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
