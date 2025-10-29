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
<style>
body {
  margin: 0;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: radial-gradient(circle at center, #0f0f0f, #000);
  font-family: "Segoe UI", Arial, sans-serif;
  color: #eee;
  overflow: hidden;
}
</style>
