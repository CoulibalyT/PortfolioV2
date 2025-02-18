<template>
  <div>
    <div ref="overlay" :class="['transition-overlay', { 'dark-overlay': isDarkMode }]" ></div>
    <router-view v-slot="{ Component, route }">
      <component :is="Component" :key="route.path" class="page" />
    </router-view>
  </div>
</template>

<script setup>
import { ref, watchEffect, onMounted } from "vue";
import { useRouter } from "vue-router";
import gsap from "gsap";

const overlay = ref(null);
const router = useRouter();
const isTransitioning = ref(false);
const isDarkMode = ref(localStorage.getItem("theme") === "dark");

router.beforeEach(async (to, from, next) => {
  if (isTransitioning.value) return; 
  isTransitioning.value = true;

  await gsap.to(overlay.value, {
    y: "0%",
    duration: 0.6,
    ease: "power2.inOut",
  });

  next();

  await router.isReady();

  await gsap.to(overlay.value, {
    y: "-100%",
    duration: 0.6,
    ease: "power2.inOut",
    delay: 0.2, 
  });

  isTransitioning.value = false;
});

watchEffect(() => {
  isDarkMode.value = localStorage.getItem("theme") === "dark";
});

onMounted(() => {
  if (router.currentRoute.value.path !== "/splash") {
    router.push("/splash");
  }
});
</script>

<style scoped>
.transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: black;
  z-index: 1000;
  transform: translateY(-100%);
  transition: background 0.3s ease-in-out;
}

.dark-overlay {
  background: white;
}

.page {
  position: relative;
  z-index: 1;
}
</style>
