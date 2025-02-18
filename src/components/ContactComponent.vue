<template>
  <Wrapper>
    <div class="w-96">
      <a
        href="mailto:coulibaly.tene00@gmail.com"
        class="text-center flex gap-1 items-center justify-center relative group text-bold"
      >
        coulibaly.tene00@gmail.com
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
