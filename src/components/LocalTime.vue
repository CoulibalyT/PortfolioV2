<template>
  <div class="flex items-center gap-2 text-xs md:text-sm font-mono text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    <span class="hidden md:inline">Paris, FR</span>
    <span class="md:hidden">PAR</span>
    <span class="tabular-nums">{{ time }}</span>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const time = ref('');
let interval = null;

const updateTime = () => {
  const now = new Date();
  // Format: HH:mm:ss
  time.value = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'Europe/Paris'
  }).format(now);
};

onMounted(() => {
  updateTime();
  interval = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (interval) clearInterval(interval);
});
</script>
