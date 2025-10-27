import { defineStore } from "pinia";
import { ref, computed } from "vue";
import api from "../services/api";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);

  const isAuthenticated = computed(() => !!token.value);
  const isAdmin = computed(() => user.value?.role === "admin");

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { user: userData, token: tokenData } = response.data;

      user.value = userData;
      token.value = tokenData;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenData);

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Ошибка авторизации";
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      const { user: userData, token: tokenData } = response.data;

      user.value = userData;
      token.value = tokenData;

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", tokenData);

      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Ошибка регистрации";
    }
  };

  const logout = () => {
    user.value = null;
    token.value = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const getProfile = async () => {
    try {
      const response = await api.get("/auth/me");
      user.value = response.data.user;
      localStorage.setItem("user", JSON.stringify(response.data.user));
      return response.data;
    } catch (error) {
      throw error.response?.data?.error || "Ошибка получения профиля";
    }
  };

  const syncAuthState = () => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");

    if (storedUser && storedToken) {
      user.value = JSON.parse(storedUser);
      token.value = storedToken;
    } else {
      user.value = null;
      token.value = null;
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    isAdmin,
    login,
    register,
    logout,
    getProfile,
    syncAuthState,
  };
});
