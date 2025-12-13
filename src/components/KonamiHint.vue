<template>
  <div class="konami-hint fixed bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-10 pointer-events-none z-0 select-none mix-blend-difference">
    <div class="key">↑</div>
    <div class="key">↑</div>
    <div class="key">↓</div>
    <div class="key">↓</div>
    <div class="key">←</div>
    <div class="key">→</div>
    <div class="key">←</div>
    <div class="key">→</div>
    <div class="key font-bold">B</div>
    <div class="key font-bold">A</div>
  </div>
</template>

<style scoped>
.key {
  width: 24px;
  height: 24px;
  border: 1px solid currentColor;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-family: monospace;
  color: white; /* mix-blend-difference will handle the contrast */
}

@media (max-width: 768px) {
  .konami-hint {
    display: none; /* Hide on mobile as they can't type easily */
  }
}
</style>
