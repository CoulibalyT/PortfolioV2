<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  if (router.currentRoute.value.path !== "/splash") {
    router.push("/splash");
  }
});
</script>

<template>
  <RouterView />
</template>
