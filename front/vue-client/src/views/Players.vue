<template>
  <div>
    <h2>Игроки</h2>
  </div>
</template>
<script setup>
import { onMounted, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import api from "../services/api";
import PlayerCard from "../components/PlayerCard.vue";

const router = useRouter();
const authStore = useAuthStore();

const players = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalPlayers = ref(0);

const filters = red({
  position: "",
  search: "",
});
</script>
