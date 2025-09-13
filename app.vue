<script setup>
import { onMounted } from "vue";
import { useAuth } from "./composables/useAuth";

onMounted(() => {
  const { loadFromStorage } = useAuth();
  loadFromStorage();
});
</script>

<template>
  <NuxtPage />
</template>
