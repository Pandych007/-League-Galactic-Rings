<template>
  <div>
    <div>
      <h1>Мой профиль</h1>
      <div v-if="user">
        <div>
          <label>Имя:</label>
          <span>{{ user.name }}</span>
        </div>
        <div>
          <label>Email:</label>
          <span>{{ user.naemailme }}</span>
        </div>
        <div>
          <label>Роль:</label>
          <span>{{ user.role }}</span>
        </div>
      </div>

      <div>
        <button @click="logout">Выйти из профиля</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import api from "../services/api";

const router = useRouter();
const authStore = useAuthStore();

const user = ref(null);
const loading = ref(false);

const loadUserData = async () => {
  loading.value = true;
  try {
    const userResponse = await api.get("/auth/me");

    user.value = userResponse.data.user;
  } catch (er) {
    console.error(er);
  } finally {
    loading.value = false;
  }
};

const logout = () => {
  authStore.logout();
  router.push("/login");
};
onMounted(() => {
  loadUserData();
});
</script>
