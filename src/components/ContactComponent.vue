<template>
  <Wrapper>
    <div class="w-full max-w-md flex flex-col items-start gap-2 px-4 md:px-0">
      <a
        href="mailto:coulibaly.tene00@gmail.com"
        class="flex gap-1 items-center relative group text-bold break-all text-left"
      >
        coulibaly.tene00@gmail.com
        <ArrowUpRightIcon class="size-4.5 shrink-0" />
        <span class="underline-hover"></span>
      </a>
      
      <a
        href="https://www.linkedin.com/in/tenecoulibaly/" 
        target="_blank" 
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        linkedIn
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>

      <a
        href="https://github.com/CoulibalyT" 
        target="_blank" 
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        gitHub
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>

      <a
        href="/CV2-TeneCoulibaly.pdf" 
        target="_blank" 
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        CV
        <ArrowUpRightIcon class="size-4.5" />
        <span class="underline-hover"></span>
      </a>
    </div>
  </Wrapper>
</template>

<script setup>
import { ArrowUpRightIcon } from "@heroicons/vue/24/solid";
import Wrapper from "./WrapperComponent.vue";
</script>

<style scoped>
.underline-hover {
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background-color: black; 
  transition: width 0.3s ease-in-out;
}

.group:hover .underline-hover {
  width: 100%;
}
</style>