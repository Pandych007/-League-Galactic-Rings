<template>
  <div id="app">
    <NavBar />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>
<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/auth";
import NavBar from "./components/NavBar.vue";
const authStore = useAuthStore();

onMounted(() => {
  authStore.syncAuthState();
});
</script>
<style scoped></style>
