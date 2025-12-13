<template>
  <div class="hidden lg:flex flex-col justify-center h-full px-8 opacity-40 hover:opacity-100 transition-opacity duration-500 select-none">
    <blockquote class="text-sm md:text-base italic text-gray-600 dark:text-gray-400 font-serif border-l-2 border-gray-300 dark:border-gray-700 pl-4">
      "{{ currentQuote.text }}"
    </blockquote>
    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 text-right">— {{ currentQuote.author }}</p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { tm, locale } = useI18n();

const currentQuote = computed(() => {
  const quotes = tm('quotes');
  if (!quotes || quotes.length === 0) return { text: '', author: '' };
  
  // Use day of year to pick a consistent quote for the day
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  const index = dayOfYear % quotes.length;
  return quotes[index];
});
</script>
