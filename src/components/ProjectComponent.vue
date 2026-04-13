<template>
  <div ref="canvasRoot" class="canvas-root">
    <!-- Floating header with nav -->
    <header class="floating-header" @mousedown.stop @touchstart.stop>
      <router-link to="/" class="header-name-link">Tene Coulibaly</router-link>
      <nav class="floating-nav">
        <router-link to="/">{{ locale === 'fr' ? 'Moi' : 'Me' }}</router-link>
        <router-link to="/skills">{{ locale === 'fr' ? 'Compétences' : 'Skills' }}</router-link>
        <router-link to="/timeline">{{ locale === 'fr' ? 'Parcours' : 'Timeline' }}</router-link>
        <router-link to="/contact">Contact</router-link>
        <router-link to="/playground">{{ locale === 'fr' ? 'Labo' : 'Lab' }}</router-link>
      </nav>
    </header>

    <!-- Dot grid background -->
    <div ref="dotGrid" class="dot-grid"></div>

    <!-- Cards container (DOM pool) -->
    <div ref="cardsContainer" class="cards-container"></div>

    <!-- Lightbox -->
    <Teleport to="body">
      <Transition name="lightbox-fade">
        <div v-if="lightboxData" class="lightbox-overlay" @click="closeLightbox">
          <div class="lightbox-content" @click.stop>
            <img :src="lightboxData.img" :alt="lightboxData.label" />
            <div class="lightbox-info">
              <span class="lightbox-label">{{ lightboxData.label }}</span>
              <span class="lightbox-project">{{ lightboxData.project }}</span>
              <a
                v-if="lightboxData.url"
                :href="lightboxData.url"
                target="_blank"
                rel="noopener noreferrer"
                class="lightbox-link"
                @click.stop
              >
                {{ lightboxData.urlLabel || 'Voir le site' }} →
              </a>
            </div>
            <button class="lightbox-close" @click="closeLightbox">&times;</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- Filter bar -->
    <div class="filter-bar" @mousedown.stop @touchstart.stop @click.stop>
      <button
        :class="['filter-btn', { active: activeFilter === null }]"
        @click="setFilter(null)"
      >{{ locale === 'fr' ? 'Tous' : 'All' }}</button>
      <button
        v-for="name in projectNames"
        :key="name"
        :class="['filter-btn', { active: activeFilter === name }]"
        @click="setFilter(name)"
      >{{ name }}</button>
    </div>

    <!-- Project Info Panel -->
    <Transition name="info-slide">
      <div v-if="activeProject" class="project-info-panel">
        <div class="info-panel-header">
          <h3 class="info-panel-name">{{ activeProject.name }}</h3>
          <a v-if="activeProject.url" :href="activeProject.url" target="_blank" rel="noopener noreferrer" class="info-panel-link">
            {{ activeProject.urlLabel || 'Voir' }} ↗
          </a>
        </div>
        <p class="info-panel-desc">{{ activeProject.description?.[locale] || activeProject.description?.fr }}</p>
        <div class="info-panel-tech">
          <span v-for="t in activeProject.tech" :key="t" class="info-tech-tag">{{ t }}</span>
        </div>
      </div>
    </Transition>

    <!-- Hint -->
    <Transition name="hint-fade">
      <div v-if="showHint" class="canvas-hint">
        {{ hintText }}
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()

import { projects, projectCards, TILE_W, TILE_H } from '@/data/projects'
const cards = projectCards
const projectNames = projects.map(p => p.name)
const FRICTION = 0.93
const DRAG_THRESHOLD = 3

const POOL_SIZE = cards.length * 9

// Refs
const canvasRoot = ref(null)
const dotGrid = ref(null)
const cardsContainer = ref(null)
const lightboxData = ref(null)
const showHint = ref(true)
const activeFilter = ref(null)

function setFilter(name) {
  activeFilter.value = activeFilter.value === name ? null : name
  render()
}

const hintText = computed(() =>
  locale.value === 'fr' ? 'Glisser pour explorer' : 'Drag to explore'
)

const activeProject = computed(() => {
  if (!activeFilter.value) return null
  return projects.find(p => p.name === activeFilter.value) || null
})

// Pan state
let px = 0
let py = 0
let vx = 0
let vy = 0
let isDragging = false
let pointerStartX = 0
let pointerStartY = 0
let lastPointerX = 0
let lastPointerY = 0
let dragDistance = 0
let lastTime = 0
let animId = null
let pool = []

function createCardElement() {
  const card = document.createElement('div')
  card.className = 'canvas-card'
  card.innerHTML = `
    <img loading="lazy" draggable="false" />
    <div class="card-badge">↗ Live</div>
    <div class="card-overlay">
      <span class="card-label"></span>
      <span class="card-project"></span>
    </div>
  `
  card.style.display = 'none'
  return card
}

function initPool() {
  const container = cardsContainer.value
  pool = []
  for (let i = 0; i < POOL_SIZE; i++) {
    const el = createCardElement()
    container.appendChild(el)
    pool.push(el)
  }
}

function render() {
  const root = canvasRoot.value
  if (!root) return

  const vw = root.clientWidth
  const vh = root.clientHeight
  const margin = 80

  // Update dot grid position
  if (dotGrid.value) {
    dotGrid.value.style.backgroundPosition = `${px % 24}px ${py % 24}px`
  }

  // Calculate visible tiles
  const startTileX = Math.floor(-px / TILE_W) - 1
  const endTileX = Math.floor((-px + vw) / TILE_W) + 1
  const startTileY = Math.floor(-py / TILE_H) - 1
  const endTileY = Math.floor((-py + vh) / TILE_H) + 1

  let poolIdx = 0

  for (let ty = startTileY; ty <= endTileY; ty++) {
    for (let tx = startTileX; tx <= endTileX; tx++) {
      for (let ci = 0; ci < cards.length; ci++) {
        const c = cards[ci]
        const screenX = c.tx + tx * TILE_W + px
        const screenY = c.ty + ty * TILE_H + py

        // Frustum culling
        if (
          screenX + c.w < -margin ||
          screenX > vw + margin ||
          screenY + c.h < -margin ||
          screenY > vh + margin
        ) {
          continue
        }

        if (poolIdx >= pool.length) break

        const el = pool[poolIdx]
        el.style.display = 'block'
        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) rotate(${c.rot}deg)`
        el.style.width = c.w + 'px'
        el.style.height = c.h + 'px'

        const img = el.querySelector('img')
        if (img.dataset.src !== c.img) {
          img.src = c.img
          img.dataset.src = c.img
        }

        const label = el.querySelector('.card-label')
        const project = el.querySelector('.card-project')
        if (label.textContent !== c.label) label.textContent = c.label
        if (project.textContent !== c.project) project.textContent = c.project

        const badge = el.querySelector('.card-badge')
        if (badge) badge.style.display = c.url ? 'block' : 'none'

        // Apply filter
        const filter = activeFilter.value
        if (filter && c.project !== filter) {
          el.style.opacity = '0.15'
          el.style.filter = 'grayscale(0.8)'
        } else if (filter && c.project === filter) {
          el.style.opacity = '1'
          el.style.filter = 'none'
          el.style.borderColor = 'rgba(200, 255, 0, 0.2)'
        } else {
          el.style.opacity = '1'
          el.style.filter = 'none'
          el.style.borderColor = ''
        }

        el._cardData = c
        poolIdx++
      }
    }
  }

  // Hide unused pool elements
  for (let i = poolIdx; i < pool.length; i++) {
    pool[i].style.display = 'none'
  }
}

// ---- Pointer handling ----

function getPointerPos(e) {
  if (e.touches && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }
  return { x: e.clientX, y: e.clientY }
}

function onPointerDown(e) {
  if (e.button && e.button !== 0) return
  const pos = getPointerPos(e)
  isDragging = true
  dragDistance = 0
  pointerStartX = pos.x
  pointerStartY = pos.y
  lastPointerX = pos.x
  lastPointerY = pos.y
  vx = 0
  vy = 0
  lastTime = performance.now()

  if (animId) {
    cancelAnimationFrame(animId)
    animId = null
  }

  if (showHint.value) {
    showHint.value = false
  }
}

function onPointerMove(e) {
  if (!isDragging) return

  const pos = getPointerPos(e)
  const dx = pos.x - lastPointerX
  const dy = pos.y - lastPointerY
  const now = performance.now()
  const dt = now - lastTime

  dragDistance += Math.abs(dx) + Math.abs(dy)
  px += dx
  py += dy

  if (dt > 0) {
    const factor = 0.4
    vx = vx * (1 - factor) + (dx / dt) * 16 * factor
    vy = vy * (1 - factor) + (dy / dt) * 16 * factor
  }

  lastPointerX = pos.x
  lastPointerY = pos.y
  lastTime = now

  render()
}

function onPointerUp() {
  if (!isDragging) return
  isDragging = false

  if (dragDistance < DRAG_THRESHOLD) {
    const pos = { x: pointerStartX, y: pointerStartY }
    handleTap(pos)
    return
  }

  startMomentum()
}

function handleTap(pos) {
  for (let i = pool.length - 1; i >= 0; i--) {
    const el = pool[i]
    if (el.style.display === 'none' || !el._cardData) continue

    const elRect = el.getBoundingClientRect()
    if (
      pos.x >= elRect.left && pos.x <= elRect.right &&
      pos.y >= elRect.top && pos.y <= elRect.bottom
    ) {
      lightboxData.value = { ...el._cardData }
      return
    }
  }
}

function closeLightbox() {
  lightboxData.value = null
}

function startMomentum() {
  const step = () => {
    vx *= FRICTION
    vy *= FRICTION

    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
      animId = null
      return
    }

    px += vx
    py += vy
    render()

    animId = requestAnimationFrame(step)
  }
  animId = requestAnimationFrame(step)
}

// ---- Touch handling (1 finger = drag OR tap, distinguished by distance) ----

function onTouchStart(e) {
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  onPointerDown({ clientX: t.clientX, clientY: t.clientY })
}

function onTouchMove(e) {
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  onPointerMove({ clientX: t.clientX, clientY: t.clientY })
}

function onTouchEnd(e) {
  e.preventDefault()
  e.stopPropagation()
  onPointerUp()
}

// ---- Mouse handling (bound in template) ----

function onMouseDown(e) {
  onPointerDown(e)
}

function onMouseMove(e) {
  onPointerMove(e)
}

function onMouseUp() {
  onPointerUp()
}

// ---- Keyboard ----
function onKeyDown(e) {
  if (e.key === 'Escape' && lightboxData.value) {
    closeLightbox()
  }
}

onMounted(() => {
  // Scope overflow: hidden to this page
  document.body.classList.add('canvas-page-active')

  initPool()
  render()

  // Auto-hide hint after 3s
  setTimeout(() => { showHint.value = false }, 3000)

  const root = canvasRoot.value
  if (root) {
    root.addEventListener('mousedown', onMouseDown)
    root.addEventListener('mousemove', onMouseMove)
    root.addEventListener('mouseup', onMouseUp)
    root.addEventListener('mouseleave', onMouseUp)
    root.addEventListener('touchstart', onTouchStart, { passive: false })
    root.addEventListener('touchmove', onTouchMove, { passive: false })
    root.addEventListener('touchend', onTouchEnd, { passive: false })
  }

  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  // Remove scoped body class
  document.body.classList.remove('canvas-page-active')

  if (animId) cancelAnimationFrame(animId)

  const root = canvasRoot.value
  if (root) {
    root.removeEventListener('mousedown', onMouseDown)
    root.removeEventListener('mousemove', onMouseMove)
    root.removeEventListener('mouseup', onMouseUp)
    root.removeEventListener('mouseleave', onMouseUp)
    root.removeEventListener('touchstart', onTouchStart)
    root.removeEventListener('touchmove', onTouchMove)
    root.removeEventListener('touchend', onTouchEnd)
  }

  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style>
/* Scoped body styles — only active when this page is mounted */
body.canvas-page-active {
  overflow: hidden !important;
  overscroll-behavior: none;
  -webkit-touch-callout: none;
}

/* ---- Full-page canvas ---- */
.canvas-root {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  background: transparent;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  touch-action: none;
  -webkit-touch-callout: none;
  z-index: 1;
}

.canvas-root:active {
  cursor: grabbing;
}

/* ---- Floating header ---- */
.floating-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 16px 28px;
  pointer-events: none;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:is(.dark .floating-header) {
  background: linear-gradient(to bottom, rgba(8, 8, 10, 0.6), transparent);
}

:not(.dark) .floating-header {
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), transparent);
}

.header-name-link {
  pointer-events: auto;
  font-size: 18px;
  font-weight: 300;
  letter-spacing: 0.01em;
  text-decoration: none;
  color: #f0ece4;
  transition: color 0.2s ease;
  white-space: nowrap;
}

:not(.dark) .header-name-link {
  color: #1a1a1a;
  font-weight: 500;
}

.header-name-link:hover {
  color: #c8ff00;
}

:not(.dark) .header-name-link:hover {
  color: #852C2C;
}

.floating-nav {
  display: flex;
  gap: 20px;
  pointer-events: auto;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
}

.floating-nav a {
  font-size: 13px;
  font-weight: 300;
  color: rgba(240, 236, 228, 0.45);
  text-decoration: none;
  letter-spacing: 0.04em;
  transition: color 0.3s;
}

:not(.dark) .floating-nav a {
  color: rgba(0, 0, 0, 0.55);
  font-weight: 600;
}

.floating-nav a:hover {
  color: #f0ece4;
}

:not(.dark) .floating-nav a:hover {
  color: #000;
}

@media (max-width: 640px) {
  .floating-nav {
    gap: 14px;
  }
  .floating-nav a {
    font-size: 11px;
  }
}

/* ---- Dot grid ---- */
.dot-grid {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 24px 24px;
  pointer-events: none;
  z-index: 0;
}

/* ---- Cards container ---- */
.cards-container {
  position: absolute;
  inset: 0;
  z-index: 1;
  pointer-events: none;
}

/* ---- Card ---- */
.canvas-card {
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 14px;
  overflow: hidden;
  background: #111113;
  border: 2px solid rgba(255, 255, 255, 0.85);
  pointer-events: auto;
  will-change: transform;
  transition: box-shadow 0.3s ease, border-color 0.3s ease;
}

.canvas-card:hover {
  box-shadow: 0 0 24px rgba(200, 255, 0, 0.15), 0 0 0 1px rgba(200, 255, 0, 0.3);
  border-color: rgba(200, 255, 0, 0.4);
  z-index: 10;
}

.canvas-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease, filter 0.3s ease;
  pointer-events: none;
}

.canvas-card:hover img {
  transform: scale(1.05);
  filter: brightness(1.1) saturate(1.15);
}

/* ---- Card badge ---- */
.card-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(200, 255, 0, 0.9);
  color: #08080a;
  font-size: 11px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 100px;
  letter-spacing: 0.03em;
  z-index: 5;
  opacity: 0;
  transform: translateY(-4px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.canvas-card:hover .card-badge {
  opacity: 1;
  transform: translateY(0);
}

/* ---- Card overlay ---- */
.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px 16px;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.75));
  display: flex;
  flex-direction: column;
  gap: 2px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
}

.canvas-card:hover .card-overlay {
  transform: translateY(0);
}

.card-label {
  font-size: 14px;
  font-weight: 600;
  color: #f0ece4;
}

.card-project {
  font-size: 12px;
  color: #c8ff00;
}

/* ---- Lightbox ---- */
.lightbox-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.93);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.lightbox-content {
  position: relative;
  max-width: 90vw;
  max-height: 84vh;
  cursor: default;
}

.lightbox-content img {
  max-width: 90vw;
  max-height: 80vh;
  object-fit: contain;
  border-radius: 12px;
  display: block;
}

.lightbox-info {
  text-align: center;
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.lightbox-label {
  font-size: 18px;
  font-weight: 600;
  color: #f0ece4;
}

.lightbox-project {
  font-size: 14px;
  color: #c8ff00;
}

.lightbox-link {
  display: inline-block;
  margin-top: 12px;
  color: #c8ff00;
  font-size: 14px;
  font-weight: 400;
  text-decoration: none;
  letter-spacing: 0.02em;
  transition: opacity 0.2s ease;
}

.lightbox-link:hover {
  text-decoration: underline;
  opacity: 0.85;
}

.lightbox-close {
  position: absolute;
  top: -40px;
  right: 0;
  background: none;
  border: none;
  color: #f0ece4;
  font-size: 32px;
  cursor: pointer;
  line-height: 1;
  padding: 4px 8px;
}

.lightbox-close:hover {
  color: #c8ff00;
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s ease;
}
.lightbox-fade-enter-from,
.lightbox-fade-leave-to {
  opacity: 0;
}

/* ---- Filter bar ---- */
.filter-bar {
  position: fixed;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  display: flex;
  gap: 4px;
  align-items: center;
  background: rgba(17, 17, 19, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 100px;
  padding: 6px 8px;
  pointer-events: auto;
  max-width: 90vw;
  overflow-x: auto;
  white-space: nowrap;
  -webkit-overflow-scrolling: touch;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.filter-bar::-webkit-scrollbar {
  display: none;
}

.filter-btn {
  padding: 6px 16px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 400;
  letter-spacing: 0.03em;
  border: none;
  cursor: pointer;
  transition: all 0.3s;
  background: transparent;
  color: rgba(255, 255, 255, 0.5);
  white-space: nowrap;
  flex-shrink: 0;
}

.filter-btn:hover {
  color: rgba(255, 255, 255, 0.8);
}

.filter-btn.active {
  background: #c8ff00;
  color: #08080a;
  font-weight: 500;
}

/* ---- Hint ---- */
.canvas-hint {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: rgba(17, 17, 19, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #f0ece4;
  padding: 10px 24px;
  border-radius: 100px;
  font-size: 13px;
  letter-spacing: 0.02em;
  pointer-events: none;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
}

/* ---- Project Info Panel ---- */
.project-info-panel {
  position: fixed;
  bottom: 90px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: rgba(17, 17, 19, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px 24px;
  max-width: 480px;
  width: 90vw;
  pointer-events: auto;
}

.info-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.info-panel-name {
  font-size: 18px;
  font-weight: 600;
  color: #f0ece4;
  letter-spacing: -0.01em;
}

.info-panel-link {
  font-size: 12px;
  color: #c8ff00;
  text-decoration: none;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: opacity 0.2s;
  white-space: nowrap;
}

.info-panel-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.info-panel-desc {
  font-size: 13px;
  color: rgba(240, 236, 228, 0.65);
  line-height: 1.5;
  margin-bottom: 14px;
}

.info-panel-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.info-tech-tag {
  font-size: 11px;
  font-weight: 500;
  padding: 3px 10px;
  border-radius: 100px;
  background: rgba(200, 255, 0, 0.12);
  color: #c8ff00;
  letter-spacing: 0.02em;
  border: 1px solid rgba(200, 255, 0, 0.2);
}

.info-slide-enter-active,
.info-slide-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.info-slide-enter-from,
.info-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(10px);
}

.hint-fade-enter-active,
.hint-fade-leave-active {
  transition: opacity 0.5s ease;
}
.hint-fade-enter-from,
.hint-fade-leave-to {
  opacity: 0;
}
</style>
