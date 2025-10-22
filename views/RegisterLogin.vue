<template>
  <div>
    <h1>🏀 Fantasy Basket</h1>
    <div class="form-container" id="formBox">
      <!-- Регистрация -->
      <div class="form register-form">
        <form>
          <h2>Регистрация</h2>
          <input type="text" placeholder="Логин" />
          <input type="text" placeholder="Имя" />
          <input type="password" placeholder="Пароль" />
          <input type="password" placeholder="Повторите пароль" />
          <button>Зарегистрироваться</button>
          <p>Есть аккаунт? <a id="goLogin">Войти</a></p>
        </form>
      </div>

      <!-- Вход -->
      <div class="form login-form">
        <form>
          <h2>Вход</h2>
          <input type="text" placeholder="Логин" />
          <input type="password" placeholder="Пароль" />
          <button>Войти</button>
          <p>Нет аккаунта? <a id="goRegister">Зарегистрироваться</a></p>
          <p style="font-size: 13px; margin-top: 10px; color: #888">
            Для режима тренера: <strong>coach@team</strong> /
            <strong>coach</strong>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const form = ref({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});

const loading = ref(false);

const error = ref("");

const handleRegister = async () => {
  if (loading.value) return;
  if (form.value.password !== form.value.confirmPassword) {
    error.value = "Пароли не совпадают";
    return;
  }

  if (form.value.password.length < 6) {
    error.value = "Пароль должен содержать минимум 6 символов";
    return;
  }

  loading.value = true;
  error.value = "";

  //запрос к серверу на регистрацию
};
</script>
<style scoped>
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

h1 {
  color: #c084fc;
  text-align: center;
  margin-bottom: 40px;
}

/* === КАРТОЧКА === */
.form-container {
  position: relative;
  width: 700px;
  height: 450px;
  background: #1a1a1a;
  border-radius: 20px;
  box-shadow: 0 0 40px rgba(192, 132, 252, 0.3);
  overflow: hidden;
  perspective: 1000px;
  transition: transform 1s ease-in-out;
}

.form {
  position: absolute;
  width: 100%;
  height: 100%;
  padding: 60px;
  box-sizing: border-box;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transform-origin: center;
  backface-visibility: hidden;
  transition: transform 1s ease-in-out, opacity 0.8s ease;
}

.form input {
  background: #2a2a2a;
  border: none;
  border-radius: 8px;
  color: #fff;
  padding: 12px;
  margin: 8px 0;
  width: 100%;
  font-size: 15px;
}

.form button {
  background: #7c3aed;
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: bold;
  padding: 12px;
  cursor: pointer;
  margin-top: 15px;
  transition: background 0.3s;
}

.form button:hover {
  background: #9f67ff;
}

.form p {
  margin-top: 15px;
  font-size: 14px;
  color: #bbb;
}

.form a {
  color: #c084fc;
  text-decoration: none;
  cursor: pointer;
}

.form a:hover {
  text-decoration: underline;
}

/* === ПЕРЕХОД === */
.register-form {
  transform: rotateY(0deg);
}

.login-form {
  transform: rotateY(180deg);
}

.form-container.flipped .register-form {
  transform: rotateY(-180deg);
  opacity: 0;
}

.form-container.flipped .login-form {
  transform: rotateY(0deg);
  opacity: 1;
}

/* Небольшой 3D-эффект при наведении */
@keyframes tilt {
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(10deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

.form-container:hover {
  animation: tilt 3s ease-in-out infinite;
}
</style>

<script>
const formBox = document.getElementById("formBox");
const goLogin = document.getElementById("goLogin");
const goRegister = document.getElementById("goRegister");

goLogin.addEventListener("click", () => formBox.classList.add("flipped"));
goRegister.addEventListener("click", () => formBox.classList.remove("flipped"));
</script>
