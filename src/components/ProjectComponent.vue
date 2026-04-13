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

    <!-- Hint -->
    <Transition name="hint-fade">
      <div v-if="showHint" class="canvas-hint">
        {{ hintText }}
      </div>
    </Transition>
  </div>

  <!-- Teleported outside canvas-root so events don't conflict -->
  <Teleport to="body">
    <!-- Filter bar -->
    <div class="filter-bar">
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

    <!-- Project Info Panel (collapsible) -->
    <Transition name="info-slide">
      <div v-if="activeProject" class="project-info-panel">
        <div class="info-panel-header" @click="infoPanelOpen = !infoPanelOpen">
          <div class="info-panel-left">
            <h3 class="info-panel-name">{{ activeProject.name }}</h3>
            <a v-if="activeProject.url" :href="activeProject.url" target="_blank" rel="noopener noreferrer" class="info-panel-link" @click.stop>
              {{ activeProject.urlLabel || 'Voir' }} ↗
            </a>
            <a v-if="activeProject.urlSecondary" :href="activeProject.urlSecondary" target="_blank" rel="noopener noreferrer" class="info-panel-link info-panel-link-secondary" @click.stop>
              {{ activeProject.urlSecondaryLabel || 'Lien' }} ↗
            </a>
          </div>
          <button class="info-panel-toggle" :class="{ open: infoPanelOpen }">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
        </div>
        <div class="info-panel-body" :class="{ collapsed: !infoPanelOpen }">
          <p class="info-panel-desc">{{ activeProject.description?.[locale] || activeProject.description?.fr }}</p>
          <!-- Tech as categories (object) -->
          <div v-if="activeProject.tech && !Array.isArray(activeProject.tech)" class="info-panel-tech-grouped">
            <div v-for="(techList, category) in activeProject.tech" :key="category" class="info-tech-group">
              <span class="info-tech-category">{{ category }}</span>
              <div class="info-tech-tags">
                <span v-for="t in techList" :key="t" class="info-tech-tag">{{ t }}</span>
              </div>
            </div>
          </div>
          <!-- Tech as flat array -->
          <div v-else-if="activeProject.tech" class="info-panel-tech">
            <span v-for="t in activeProject.tech" :key="t" class="info-tech-tag">{{ t }}</span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
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
const infoPanelOpen = ref(false)

function setFilter(name) {
  activeFilter.value = activeFilter.value === name ? null : name
  infoPanelOpen.value = false
  px = 0
  py = 0
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
  const filter = activeFilter.value

  // Update dot grid position
  if (dotGrid.value) {
    dotGrid.value.style.backgroundPosition = `${px % 24}px ${py % 24}px`
  }

  let poolIdx = 0

  // ---- FILTERED MODE: fill viewport, bigger cards when fewer images ----
  if (filter) {
    const filtered = cards.filter(c => c.project === filter)
    const count = filtered.length
    const isMobileLayout = vw < 640
    const PAD = isMobileLayout ? 16 : 40
    const TOP_PAD = isMobileLayout ? 60 : 80
    const BOTTOM_PAD = isMobileLayout ? 120 : 140
    const availW = vw - PAD * 2
    const availH = vh - TOP_PAD - BOTTOM_PAD
    const GAP = 18

    // Pick cols based on count + screen size
    let cols
    if (isMobileLayout) {
      cols = count <= 1 ? 1 : 2
    } else if (count <= 1) cols = 1
    else if (count <= 3) cols = Math.min(count, 2)
    else if (count <= 6) cols = 3
    else cols = Math.min(count, 4)

    const rows = Math.ceil(count / cols)

    // Cards fill available space
    const cardW = Math.floor((availW - (cols - 1) * GAP) / cols)
    const cardH = Math.floor((availH - (rows - 1) * GAP) / rows)

    const gridW = cols * cardW + (cols - 1) * GAP
    const gridH = rows * cardH + (rows - 1) * GAP
    const baseX = (vw - gridW) / 2
    const baseY = TOP_PAD + (availH - gridH) / 2

    for (let i = 0; i < filtered.length; i++) {
      if (poolIdx >= pool.length) break
      const c = filtered[i]
      const col = i % cols
      const row = Math.floor(i / cols)

      // Subtle jitter for organic feel
      const seed = i * 7 + 13
      const jitterScale = isMobileLayout ? 0.4 : 1
      const jx = Math.round(Math.sin(seed) * 6 * jitterScale)
      const jy = Math.round(Math.cos(seed) * 5 * jitterScale)
      const rot = Math.round(Math.sin(seed * 3) * 15 * jitterScale) / 10

      const x = baseX + col * (cardW + GAP) + jx + px
      const y = baseY + row * (cardH + GAP) + jy + py

      const el = pool[poolIdx]
      el.style.display = 'block'
      el.style.transition = vw < 640 ? 'none' : 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), width 0.4s ease, height 0.4s ease'
      el.style.willChange = 'transform'
      el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${rot}deg)`
      el.style.width = cardW + 'px'
      el.style.height = cardH + 'px'
      el.style.opacity = '1'
      el.style.filter = 'none'
      el.style.borderColor = 'rgba(200, 255, 0, 0.2)'

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

      el._cardData = c
      poolIdx++
    }

    // Hide rest
    for (let i = poolIdx; i < pool.length; i++) {
      pool[i].style.display = 'none'
    }
    return
  }

  // ---- NORMAL MODE: infinite tiled canvas ----

  // Calculate visible tiles
  const startTileX = Math.floor(-px / TILE_W) - 1
  const endTileX = Math.floor((-px + vw) / TILE_W) + 1
  const startTileY = Math.floor(-py / TILE_H) - 1
  const endTileY = Math.floor((-py + vh) / TILE_H) + 1

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
        el.style.transition = 'none'
        el.style.willChange = 'transform'
        el.style.transform = `translate3d(${screenX}px, ${screenY}px, 0) rotate(${c.rot}deg)`
        el.style.width = c.w + 'px'
        el.style.height = c.h + 'px'
        el.style.opacity = '1'
        el.style.filter = 'none'
        el.style.borderColor = ''

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

function isOverlayElement(target) {
  if (!target || !target.closest) return false
  return target.closest('.floating-header, .filter-bar, .project-info-panel, .lightbox-overlay, .canvas-hint')
}

function onPointerDown(e) {
  if (e.button && e.button !== 0) return
  if (isOverlayElement(e.target)) return
  const pos = getPointerPos(e)
  isDragging = true
  const root = canvasRoot.value
  if (root) root.classList.add('is-moving')
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
  const root = canvasRoot.value
  if (root) root.classList.remove('is-moving')

  if (dragDistance < DRAG_THRESHOLD) {
    const pos = { x: pointerStartX, y: pointerStartY }
    handleTap(pos)
    return
  }

  startMomentum()
}

function handleTap(pos) {
  // Check if tap was on an overlay element
  const el = document.elementFromPoint(pos.x, pos.y)
  if (el && isOverlayElement(el)) return

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
  const root = canvasRoot.value
  if (root) root.classList.add('is-moving')

  const step = () => {
    vx *= FRICTION
    vy *= FRICTION

    if (Math.abs(vx) < 0.1 && Math.abs(vy) < 0.1) {
      animId = null
      if (root) root.classList.remove('is-moving')
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
  if (isOverlayElement(e.target)) return
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  onPointerDown({ clientX: t.clientX, clientY: t.clientY })
}

let touchRafId = null
function onTouchMove(e) {
  if (isOverlayElement(e.target)) return
  e.preventDefault()
  e.stopPropagation()
  const t = e.touches[0]
  if (touchRafId) return
  touchRafId = requestAnimationFrame(() => {
    onPointerMove({ clientX: t.clientX, clientY: t.clientY })
    touchRafId = null
  })
}

function onTouchEnd(e) {
  if (isOverlayElement(e.target)) return
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

// ---- Trackpad / wheel scroll ----
let wheelTimeout = null

function onWheel(e) {
  // When info panel is open, scroll the panel — not the canvas
  if (infoPanelOpen.value) {
    const panel = document.querySelector('.info-panel-body')
    if (panel) {
      e.preventDefault()
      panel.scrollTop += e.deltaY
    }
    return
  }

  e.preventDefault()
  px -= e.deltaX
  py -= e.deltaY
  render()

  // Disable hover during scroll
  const root = canvasRoot.value
  if (root && !root.classList.contains('is-moving')) {
    root.classList.add('is-moving')
  }
  clearTimeout(wheelTimeout)
  wheelTimeout = setTimeout(() => {
    if (root) root.classList.remove('is-moving')
  }, 150)
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

  window.addEventListener('wheel', onWheel, { passive: false })
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

  window.removeEventListener('wheel', onWheel)
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
  .floating-header {
    padding: 12px 16px;
  }
  .header-name-link {
    font-size: 14px;
  }
  .floating-nav {
    gap: 10px;
  }
  .floating-nav a {
    font-size: 10px;
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

.canvas-root:not(.is-moving) .canvas-card:hover {
  box-shadow: 0 0 24px rgba(200, 255, 0, 0.15), 0 0 0 1px rgba(200, 255, 0, 0.3);
  border-color: rgba(200, 255, 0, 0.4);
  z-index: 10;
}

.canvas-root.is-moving .canvas-card {
  pointer-events: none;
}

.canvas-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease, filter 0.3s ease;
  pointer-events: none;
  background: #ffffff;
}

.canvas-root:not(.is-moving) .canvas-card:hover img {
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

.canvas-root:not(.is-moving) .canvas-card:hover .card-badge {
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

.canvas-root:not(.is-moving) .canvas-card:hover .card-overlay {
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
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  background: rgba(17, 17, 19, 0.9);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  padding: 12px 16px;
  max-width: 380px;
  width: calc(100vw - 32px);
  pointer-events: auto;
  overflow: hidden;
}

@media (max-width: 640px) {
  .project-info-panel {
    bottom: auto;
    top: 60px;
    padding: 10px 14px;
    border-radius: 12px;
    max-height: calc(100vh - 140px);
  }

  .filter-bar {
    bottom: 16px !important;
    padding: 4px 6px !important;
    max-width: calc(100vw - 24px) !important;
    overflow-x: auto !important;
    -webkit-overflow-scrolling: touch;
    justify-content: flex-start !important;
  }

  .filter-btn {
    padding: 5px 12px !important;
    font-size: 10px !important;
  }

  .filter-bar {
    touch-action: pan-x !important;
  }

  .project-info-panel {
    touch-action: pan-y !important;
  }
}

.info-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
}

.info-panel-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.info-panel-toggle {
  background: none;
  border: none;
  color: rgba(240, 236, 228, 0.5);
  cursor: pointer;
  padding: 4px;
  transition: transform 0.3s ease;
  display: flex;
}

.info-panel-toggle.open {
  transform: rotate(180deg);
}

.info-panel-body {
  overflow-y: auto;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  max-height: 50vh;
  margin-top: 12px;
  transition: max-height 0.4s ease, margin-top 0.3s ease, opacity 0.3s ease;
  opacity: 1;
}

.info-panel-body.collapsed {
  max-height: 0;
  margin-top: 0;
  opacity: 0;
}

.info-panel-name {
  font-size: 14px;
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
  pointer-events: auto;
}

.info-panel-link:hover {
  opacity: 0.8;
  text-decoration: underline;
}

.info-panel-link-secondary {
  color: rgba(240, 236, 228, 0.5);
  border-left: 1px solid rgba(255, 255, 255, 0.15);
  padding-left: 8px;
}

.info-panel-desc {
  font-size: 11px;
  color: rgba(240, 236, 228, 0.65);
  line-height: 1.45;
  margin-bottom: 10px;
}

.info-panel-tech {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.info-panel-tech-grouped {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-tech-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.info-tech-category {
  font-size: 9px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(240, 236, 228, 0.4);
}

.info-tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
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
