<template>
    <div class="w-full max-w-md flex flex-col items-start gap-4 px-4 md:px-0">
      <div class="mb-2">
        <h2 class="text-2xl md:text-4xl font-bold dark:text-white mb-1">{{ $t('contact_section.title') }}</h2>
        <p class="text-sm md:text-base text-gray-500 dark:text-gray-400">{{ $t('contact_section.text') }}</p>
      </div>
      <a
        href="mailto:coulibaly.tene00@gmail.com"
        @click="copyEmail"
        class="flex gap-1 items-center relative group text-bold break-all text-left cursor-copy"
      >
        coulibaly.tene00@gmail.com
        <ArrowUpRightIcon class="size-4.5 shrink-0" />
        <span class="underline-hover"></span>
      </a>
      
      <a
        href="https://www.linkedin.com/in/tenecoulibaly/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        linkedIn
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>

      <a
        href="https://github.com/CoulibalyT"
        target="_blank"
        rel="noopener noreferrer"
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        gitHub
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>

      <a
        href="/CV2-TeneCoulibaly.pdf"
        target="_blank"
        rel="noopener noreferrer"
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        cv
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>
    </div>

    <Teleport to="body">
      <div 
        v-if="showCopied" 
        class="fixed z-[10000] text-sm font-bold bg-black text-white dark:bg-white dark:text-black px-3 py-1.5 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-full mt-[-10px] shadow-lg"
        :style="{ left: copiedX + 'px', top: copiedY + 'px' }"
      >
        {{ $t('copied') }}
      </div>
    </Teleport>
</template>

<script setup>
import { ref } from 'vue';
import { ArrowUpRightIcon } from "@heroicons/vue/24/solid";

const showCopied = ref(false);
const copiedX = ref(0);
const copiedY = ref(0);

const copyEmail = (e) => {
  e.preventDefault();
  navigator.clipboard.writeText('coulibaly.tene00@gmail.com');
  
  copiedX.value = e.clientX;
  copiedY.value = e.clientY;
  showCopied.value = true;
  
  setTimeout(() => {
    showCopied.value = false;
  }, 2000);
};
</script>

<style scoped>
.underline-hover {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: currentColor;
  transition: width 0.3s ease-in-out;
}

.group:hover .underline-hover {
  width: 100%;
}
</style>