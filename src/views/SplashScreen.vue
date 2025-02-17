<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const router = useRouter();

onMounted(() => {
  const tl = gsap.timeline();

  tl.to(".name", {
    opacity: 0,
    duration: 1.5, 
    ease: "power2.inOut",
  })
  .to(".portfolio", {
    opacity: 0,
    duration: 1.5, 
    ease: "power2.inOut",
  }, "-=1") 
  .to(".splash-screen", {
    opacity: 0,
    duration: 1.5,
    ease: "power2.inOut",
    onComplete: () => router.push("/"),
  }, "-=1");
});
</script>

<template>
  <div class="splash-screen bg-white dark:bg-black">
    <div class="text-animation flex items-center gap-2.5">
      <p class="name text-[30px] text-black dark:text-gray-100">Tene Coulibaly</p> 
      <p class="portfolio fl text-gray-600 dark:text-gray-400">Portfolio</p>
    </div>
  </div>
</template>

<style scoped>
.splash-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100vh - calc(100vh - 100%));
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.3s ease-in-out;
  z-index: 9999;
}

.fl {
  font-weight: lighter;
}
</style>
