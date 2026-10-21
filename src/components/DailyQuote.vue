<template>
  <div class="hidden lg:flex flex-col justify-center h-full px-8 opacity-40 hover:opacity-100 transition-opacity duration-500 select-none">
    <blockquote class="text-sm md:text-base italic text-gray-600 dark:text-gray-400 font-serif border-l-2 border-gray-300 dark:border-gray-700 pl-4">
      "{{ currentQuote.text }}"
    </blockquote>
    <p class="text-xs text-gray-500 dark:text-gray-500 mt-2 text-right">— {{ currentQuote.author }}</p>
  </div>
</template>

<script setup>
import { useDailyQuote } from '@/composables/useDailyQuote';

const { currentQuote } = useDailyQuote();
</script>
