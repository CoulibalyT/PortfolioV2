<template>
  <canvas ref="canvas" class="neon-canvas" :class="{ 'neon-white': isRedMode }" aria-hidden="true"></canvas>
</template>

<script setup>
// The logo as a neon sign hidden in the background (Moi & Contact).
// It is invisible until the pointer is over it: the area around the pointer lights up
// little by little, and everything goes dark as soon as the pointer leaves the logo.
import { ref, onMounted, onUnmounted } from 'vue';
import { useTheme } from '@/composables/useTheme';

const { isRedMode } = useTheme();
const canvas = ref(null);

const IMG_W = 1164;          // logo-neon-glow.webp, logo plus glow padding
const IMG_H = 1203;
const PAD = 70;              // glow padding baked into the image
const SCALE = 0.5;           // trail resolution, plenty for a soft brush
const BRUSH = 170;           // reveal radius in CSS px
const BUILD = 0.06;          // added each frame under the pointer: lights up over ~0.5 s
const FADE_ON = 0.02;        // decay while the pointer is on the logo (soft trail)
const FADE_OFF = 0.3;        // decay once it leaves the logo: dark almost at once
const OFF_FRAMES = 12;       // then wipe (small fades never reach 0 on an 8-bit canvas)

let ctx, trail, tctx, img, rafId;
let w = 0, h = 0, dpr = 1;
let px = -9999, py = -9999;
let offFrames = OFF_FRAMES + 1; // frames spent off the logo; past OFF_FRAMES the loop idles

function resize() {
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.value.width = w * dpr;
  canvas.value.height = h * dpr;
  trail.width = Math.ceil(w * SCALE);
  trail.height = Math.ceil(h * SCALE);
}

// Same box as the old spotlight text: centred, 92vh tall (logo only, glow overflows)
function signRect() {
  const logoH = Math.min(h * 0.92, w * 1.1);
  const k = logoH / (IMG_H - 2 * PAD);
  const iw = IMG_W * k, ih = IMG_H * k;
  return { x: (w - iw) / 2, y: (h - ih) / 2, w: iw, h: ih };
}

// Is the pointer over the drawing itself (not the glow padding around it)?
function onLogo() {
  const s = signRect();
  const k = s.w / IMG_W;
  return px > s.x + PAD * k && px < s.x + s.w - PAD * k && py > s.y + PAD * k && py < s.y + s.h - PAD * k;
}

function onMove(e) {
  px = e.clientX;
  py = e.clientY;
  if (onLogo()) offFrames = 0;
}
function onLeave() {
  px = py = -9999;
}

function frame() {
  rafId = requestAnimationFrame(frame);
  const on = onLogo();
  if (!on && offFrames > OFF_FRAMES) return;
  if (!on && ++offFrames > OFF_FRAMES) {
    tctx.clearRect(0, 0, trail.width, trail.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.value.width, canvas.value.height);
    return;
  }

  // 1. Trail: fade (slowly on the logo, fast off it), then paint under the pointer
  tctx.globalCompositeOperation = 'destination-out';
  tctx.fillStyle = `rgba(0,0,0,${on ? FADE_ON : FADE_OFF})`;
  tctx.fillRect(0, 0, trail.width, trail.height);
  tctx.globalCompositeOperation = 'source-over';
  if (!on) return composite();
  const r = BRUSH * SCALE;
  const g = tctx.createRadialGradient(px * SCALE, py * SCALE, 0, px * SCALE, py * SCALE, r);
  g.addColorStop(0, `rgba(0,0,0,${BUILD})`);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  tctx.fillStyle = g;
  tctx.fillRect(px * SCALE - r, py * SCALE - r, r * 2, r * 2);
  composite();
}

// 2. Neon, kept only where the trail is
function composite() {
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.globalCompositeOperation = 'source-over';
  ctx.clearRect(0, 0, w, h);
  const s = signRect();
  ctx.drawImage(img, s.x, s.y, s.w, s.h);
  ctx.globalCompositeOperation = 'destination-in';
  ctx.drawImage(trail, 0, 0, w, h);
}

onMounted(() => {
  ctx = canvas.value.getContext('2d');
  trail = document.createElement('canvas');
  tctx = trail.getContext('2d');
  resize();
  img = new Image();
  img.src = '/images/logo-neon-glow.webp';
  img.decode().catch(() => {}).finally(() => { rafId = requestAnimationFrame(frame); });
  window.addEventListener('pointermove', onMove, { passive: true });
  document.documentElement.addEventListener('pointerleave', onLeave);
  window.addEventListener('resize', resize);
});

onUnmounted(() => {
  cancelAnimationFrame(rafId);
  window.removeEventListener('pointermove', onMove);
  document.documentElement.removeEventListener('pointerleave', onLeave);
  window.removeEventListener('resize', resize);
});
</script>

<style scoped>
.neon-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  animation: neon-flicker 7s infinite;
}
/* Red theme: white neon */
.neon-white { filter: grayscale(1) brightness(1.6); }

@keyframes neon-flicker {
  0%, 18%, 21%, 23%, 60%, 100% { opacity: 1; }
  19%, 22% { opacity: 0.4; }
  61% { opacity: 0.8; }
}
@media (prefers-reduced-motion: reduce) {
  .neon-canvas { animation: none; }
}
</style>
