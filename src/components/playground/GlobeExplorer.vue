<template>
  <div class="w-full h-full absolute inset-0" ref="canvasContainer"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';

const canvasContainer = ref(null);
let scene, camera, renderer, globeGroup, dotSphere, atmosphere, markerGroup;
let animationId;
let targetRotY = -0.15, targetRotX = 0.3;
let isDragging = false, prevMX = 0, prevMY = 0;

const LOCATIONS = [
  { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0xc8ff00 },
];

function latLonToVec3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Simplified continent boundaries as lat/lon point clouds
function generateContinentDots() {
  const dots = [];

  // Helper: fill a region with dots
  function region(latMin, latMax, lonMin, lonMax, density, coastOnly) {
    for (let i = 0; i < density; i++) {
      const lat = latMin + Math.random() * (latMax - latMin);
      const lon = lonMin + Math.random() * (lonMax - lonMin);
      if (coastOnly && Math.random() > 0.4) continue;
      dots.push({ lat, lon });
    }
  }

  // Helper: draw coast outline with denser dots
  function coast(points, density) {
    for (let i = 0; i < points.length - 1; i++) {
      for (let j = 0; j < density; j++) {
        const t = Math.random();
        const lat = points[i][0] + t * (points[i + 1][0] - points[i][0]) + (Math.random() - 0.5) * 1.5;
        const lon = points[i][1] + t * (points[i + 1][1] - points[i][1]) + (Math.random() - 0.5) * 1.5;
        dots.push({ lat, lon });
      }
    }
  }

  // Europe
  coast([[71,25],[70,30],[65,30],[60,25],[55,15],[50,5],[48,0],[43,-5],[36,-5],[36,0],[38,15],[40,25],[45,15],[50,20],[55,25],[60,30],[65,30],[71,25]], 25);
  region(45, 60, -5, 25, 200, false);
  region(36, 45, -5, 25, 150, false);
  region(55, 70, 10, 40, 150, false);

  // Africa
  coast([[36,10],[35,-5],[30,-10],[20,-15],[10,-15],[5,5],[0,10],[-5,12],[-10,15],[-15,15],[-20,15],[-25,20],[-30,25],[-35,20],[-35,25],[-30,30],[-20,35],[-10,40],[0,42],[5,45],[10,50],[15,45],[20,40],[25,35],[30,32],[35,15],[36,10]], 20);
  region(-30, 30, -15, 45, 500, false);

  // Asia
  region(10, 55, 40, 100, 400, false);
  region(25, 45, 100, 130, 200, false);
  region(45, 70, 60, 140, 300, false);
  coast([[55,140],[50,135],[45,130],[40,120],[35,115],[30,120],[25,115],[20,110],[10,105],[5,100],[10,95],[20,90],[25,80],[30,70],[35,60],[40,50],[45,40],[50,40],[55,50],[60,60],[65,70],[70,80],[70,100],[65,120],[60,140],[55,140]], 15);

  // India
  coast([[30,75],[25,70],[20,73],[15,75],[10,78],[8,77],[10,80],[15,80],[20,85],[25,88],[30,85],[30,75]], 20);
  region(10, 30, 70, 90, 150, false);

  // North America
  coast([[70,-140],[65,-160],[60,-150],[55,-130],[50,-125],[45,-125],[40,-120],[35,-118],[30,-115],[25,-110],[20,-100],[18,-95],[20,-90],[25,-80],[30,-82],[35,-75],[40,-72],[45,-68],[48,-65],[50,-60],[55,-60],[60,-65],[65,-70],[70,-80],[72,-100],[70,-140]], 15);
  region(25, 50, -125, -70, 500, false);
  region(50, 70, -140, -60, 300, false);

  // South America
  coast([[10,-75],[5,-77],[0,-80],[-5,-80],[-10,-77],[-15,-75],[-20,-70],[-25,-65],[-30,-60],[-35,-58],[-40,-65],[-45,-70],[-50,-75],[-55,-70],[-50,-65],[-45,-60],[-40,-55],[-35,-50],[-30,-48],[-25,-45],[-20,-40],[-15,-40],[-10,-37],[-5,-35],[0,-50],[5,-60],[10,-75]], 15);
  region(-50, 10, -80, -35, 400, false);

  // Australia
  coast([[-15,130],[-20,115],[-25,115],[-30,115],[-35,118],[-38,140],[-35,148],[-30,153],[-25,152],[-20,148],[-15,145],[-12,135],[-15,130]], 20);
  region(-38, -12, 115, 153, 200, false);

  // Japan / Korea
  region(30, 45, 128, 145, 80, false);

  // UK / Ireland
  region(50, 58, -8, 2, 60, false);

  // Indonesia
  region(-8, 5, 95, 140, 120, false);

  // Greenland
  region(60, 80, -55, -20, 80, false);

  return dots;
}

const initThree = () => {
  const w = canvasContainer.value.clientWidth;
  const h = canvasContainer.value.clientHeight;

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
  camera.position.z = 3.2;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  canvasContainer.value.appendChild(renderer.domElement);

  globeGroup = new THREE.Group();
  scene.add(globeGroup);

  // Dark sphere base
  const baseGeo = new THREE.SphereGeometry(0.98, 64, 64);
  const baseMat = new THREE.MeshBasicMaterial({ color: 0x0a0a12, transparent: true, opacity: 0.9 });
  globeGroup.add(new THREE.Mesh(baseGeo, baseMat));

  // Wireframe graticule (very subtle)
  const wireGeo = new THREE.SphereGeometry(1, 36, 18);
  const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.03 });
  globeGroup.add(new THREE.Mesh(wireGeo, wireMat));

  // Continent dots
  const continentDots = generateContinentDots();
  const dotPositions = [];
  const dotColors = [];

  continentDots.forEach(d => {
    const pos = latLonToVec3(d.lat, d.lon, 1.005);
    dotPositions.push(pos.x, pos.y, pos.z);
    // Slight color variation: white to light blue
    const r = 0.6 + Math.random() * 0.4;
    const g = 0.7 + Math.random() * 0.3;
    const b = 0.8 + Math.random() * 0.2;
    dotColors.push(r, g, b);
  });

  const dotGeo = new THREE.BufferGeometry();
  dotGeo.setAttribute('position', new THREE.Float32BufferAttribute(dotPositions, 3));
  dotGeo.setAttribute('color', new THREE.Float32BufferAttribute(dotColors, 3));
  const dotMat = new THREE.PointsMaterial({
    size: 0.012,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
  });
  dotSphere = new THREE.Points(dotGeo, dotMat);
  globeGroup.add(dotSphere);

  // Atmosphere glow
  const atmosGeo = new THREE.SphereGeometry(1.15, 64, 64);
  const atmosMat = new THREE.ShaderMaterial({
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
        float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
        gl_FragColor = vec4(0.25, 0.5, 1.0, intensity * 0.35);
      }
    `,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    transparent: true,
  });
  atmosphere = new THREE.Mesh(atmosGeo, atmosMat);
  scene.add(atmosphere);

  // Location markers
  markerGroup = new THREE.Group();
  LOCATIONS.forEach(loc => {
    const pos = latLonToVec3(loc.lat, loc.lon, 1.015);

    // Bright dot
    const mGeo = new THREE.SphereGeometry(0.02, 16, 16);
    const mMat = new THREE.MeshBasicMaterial({ color: loc.color });
    const dot = new THREE.Mesh(mGeo, mMat);
    dot.position.copy(pos);
    markerGroup.add(dot);

    // Outer glow
    const glowGeo = new THREE.SphereGeometry(0.04, 16, 16);
    const glowMat = new THREE.MeshBasicMaterial({ color: loc.color, transparent: true, opacity: 0.2 });
    const glow = new THREE.Mesh(glowGeo, glowMat);
    glow.position.copy(pos);
    markerGroup.add(glow);

    // Pulse ring
    const ringGeo = new THREE.RingGeometry(0.025, 0.045, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: loc.color, transparent: true, opacity: 0.5, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.copy(pos);
    ring.lookAt(0, 0, 0);
    ring.userData = { isPulse: true };
    markerGroup.add(ring);

    // Beam
    const dir = pos.clone().normalize();
    const beamGeo = new THREE.CylinderGeometry(0.003, 0.001, 0.2, 8);
    const beamMat = new THREE.MeshBasicMaterial({ color: loc.color, transparent: true, opacity: 0.4 });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.copy(pos.clone().add(dir.clone().multiplyScalar(0.1)));
    beam.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    markerGroup.add(beam);

    // Label
    const lc = document.createElement('canvas');
    lc.width = 256; lc.height = 48;
    const lctx = lc.getContext('2d');
    lctx.fillStyle = loc.color === 0xc8ff00 ? '#c8ff00' : '#00ffaa';
    lctx.font = 'bold 22px sans-serif';
    lctx.fillText(loc.name, 10, 32);
    const labelGeo = new THREE.PlaneGeometry(0.35, 0.065);
    const labelMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(lc), transparent: true, depthTest: false });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.copy(pos.clone().add(dir.clone().multiplyScalar(0.25)));
    label.userData = { isLabel: true };
    markerGroup.add(label);
  });
  globeGroup.add(markerGroup);

  // Background stars
  const starsGeo = new THREE.BufferGeometry();
  const starsArr = new Float32Array(4500);
  for (let i = 0; i < 4500; i++) starsArr[i] = (Math.random() - 0.5) * 60;
  starsGeo.setAttribute('position', new THREE.BufferAttribute(starsArr, 3));
  scene.add(new THREE.Points(starsGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.015, transparent: true, opacity: 0.5 })));
};

const animate = () => {
  animationId = requestAnimationFrame(animate);
  const time = Date.now() * 0.001;

  if (!isDragging) targetRotY += 0.001;

  globeGroup.rotation.y += (targetRotY - globeGroup.rotation.y) * 0.05;
  globeGroup.rotation.x += (targetRotX - globeGroup.rotation.x) * 0.05;

  // Pulse markers
  markerGroup.children.forEach(child => {
    if (child.userData.isPulse) {
      const s = 1 + Math.sin(time * 2.5) * 0.6;
      child.scale.set(s, s, s);
      child.material.opacity = 0.5 - Math.sin(time * 2.5) * 0.25;
    }
    if (child.userData.isLabel) {
      child.lookAt(camera.position);
    }
  });

  renderer.render(scene, camera);
};

const onPointerDown = (e) => { isDragging = true; prevMX = e.clientX; prevMY = e.clientY; };
const onPointerMove = (e) => {
  if (!isDragging) return;
  targetRotY += (e.clientX - prevMX) * 0.005;
  targetRotX += (e.clientY - prevMY) * 0.003;
  targetRotX = Math.max(-0.8, Math.min(0.8, targetRotX));
  prevMX = e.clientX; prevMY = e.clientY;
};
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
