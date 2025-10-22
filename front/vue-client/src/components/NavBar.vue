<template>
  <nav>
    <div>
      <router-link to="/login"> Войти </router-link>
      <router-link to="/register"> Регистрация </router-link>
    </div>
  </nav>
</template>
<script setup>
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { computed, onMounted, ref, watch } from "vue";

const authStore = useAuthStore();
const router = useRouter();

const { user, token } = storeToRefs(authStore);

const isAuthenticated = computed(() => !!token.value);

const forceUpdate = ref(0);

const logout = () => {
  authStore.logout();
  forceUpdate.value++;
  router.push("/login");
};

watch(token, () => {
  forceUpdate.value++;
});
</script>
