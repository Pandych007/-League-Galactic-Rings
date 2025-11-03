<template>
  <div>
    <h2>Игроки</h2>

    <div>Найдено игроков: {{ totalPlayers }}</div>
  </div>
  <div>
    <div>
      <div>
        <label for="">Поиск по имени</label>
        <input
          type="text"
          v-model="filters.search"
          placeholder="Поиск по имени"
          @input="debSearch"
        />
      </div>
      <div>
        <label for="">Позиции: </label>
        <select v-model="filters.position" @change="applyFilters">
          <option value="">Все Позиции</option>
          <option value="PG">Разыгрывающий защитник</option>
          <option value="SG">Атакующий защитник</option>
          <option value="SF">Легкий форворд</option>
          <option value="PF">Тяжолый форворд</option>
          <option value="c">Ценьровой</option>
        </select>
      </div>
      <div>
        <button @click="resetFilters" :disabled="!hasActiveFilters">
          Сбросить фильтры
        </button>
      </div>
    </div>
    <div v-if="hasActiveFilters">
      <span>Активные фильтры</span>
      <div v-if="filters.position">
        Позиция {{ getPositionLabel("position") }}
        <button @click="removeFilter('position')">x</button>
      </div>
      <div v-if="filters.search">
        Поиск {{ filters.search }}
        <button @click="removeFilter('search')">x</button>
      </div>
    </div>
  </div>
  <div v-if="loading">
    <div>Загрузка игроков</div>
  </div>
  <div v-else>
    <PlayerCard
      v-for="player in players"
      :key="player.id"
      :player="player"
      :show-add-button="isAuthenticated"
      @add-to-team="addToTeam"
    />
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import PlayerCard from "../components/PlayerCard.vue";
import api from "../services/api";

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);

const players = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalPlayers = ref(0);
const itemsPerPage = ref(12);

const filters = ref({
  position: "",
  search: "",
});

const hasActiveFilters = computed(() => {
  return filters.value.position !== "" || filters.value.search !== "";
});

let searchTimeout = null;

const debouncedSearch = () => {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    currentPage.value = 1;
    loadPlayers();
  }, 500);
};

const applyFilters = () => {
  currentPage.value = 1;
  loadPlayers();
};

const loadPlayers = async () => {
  loading.value = true;
  try {
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      ...filters.value,
    };

    Object.keys(params).forEach((key) => {
      if (
        params[key] === "" ||
        params[key] === null ||
        params[key] === undefined
      ) {
        delete params[key];
      }
    });

    const response = await api.get("/players", { params });
    console.log(response);

    const data = response.data;
    console.log(data);
    players.value = data.players || data;
    totalPages.value = data.totalPages || 1;
    totalPlayers.value = data.totalPlayers || players.value.length;
  } catch (error) {
    console.error("Ошибка загрузки игроков:", error);
    players.value = [];
    totalPages.value = 1;
    totalPlayers.value = 0;
  } finally {
    loading.value = false;
  }
};

const changePage = (page) => {
  currentPage.value = page;
  loadPlayers();
};

const addToTeam = () => {
  console.log("add to team");
};

const resetFilters = () => {
  filters.value = {
    position: "",
    search: "",
  };
  currentPage.value = 1;
  loadPlayers();
};

const removeFilter = (filterKey) => {
  filters.value[filterKey] = "";
  currentPage.value = 1;
  loadPlayers();
};

const getPositionLabel = (position) => {
  const positions = {
    PG: "Point Guard",
    SG: "Shooting Guard",
    SF: "Small Forward",
    PF: "Power Forward",
    C: "Center",
  };
  return positions[position] || position;
};

onMounted(() => {
  loadPlayers();
});

watch(currentPage, loadPlayers);
</script>
<style scoped></style>
