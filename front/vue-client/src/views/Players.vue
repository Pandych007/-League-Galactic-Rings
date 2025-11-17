<template>
  <div class="players-page">
    <div class="page-header">
      <h1>Список игроков</h1>

      <div class="players-stats">Найдено игроков: {{ totalPlayers }}</div>
    </div>

    <div v-if="selectedPlayersCount > 0" class="selction-panel">
      <div class="selection-header">
        <h3>Выбранные игроки ({{ selectedPlayersCount }}/7)</h3>
        <div class="slection-actions">
          <button @click="clearSelection" class="clear-btn">Очистить</button>
          <button @click="createTeamWithSelected" class="create-team-btn">
            Создать команду из выбранных
          </button>
        </div>
      </div>
      <div class="selected-players-list">
        <div
          v-for="player in selectedPlayers"
          :key="player.id"
          class="selected-player"
        >
          <div class="player-info">
            <span class="player-name">{{ player.name }}</span>
            <span class="player-position">{{ player.position }}</span>
            <span class="player-cost">{{ player.cost }}</span>
          </div>
          <button @click="removeFromSelection(player)" class="remove-btn">
            x
          </button>
        </div>
      </div>
      <div class="selection-stats">
        <div class="stat">
          <span>Общая стоимость:</span>
          <span class="cost">{{ totalSelectionCost }}</span>
        </div>
        <div class="stat">
          <span>Остаток бюджета:</span>
          <span class="cost">{{ BUDGET_LIMIT - totalSelectionCost }}</span>
        </div>
        <div v-if="totalSelectionCost > BUDGET_LIMIT" class="budget-alert">
          Превышен бюджет на {{ totalSelectionCost - BUDGET_LIMIT }}
        </div>
      </div>
    </div>

    <div class="filters-panel">
      <div class="filters-grid">
        <div class="filter-group">
          <label for="">Поиск по имени</label>
          <input
            type="text"
            v-model="filters.search"
            placeholder="Поиск по имени"
            @input="debSearch"
            class="search-input"
          />
        </div>
        <div class="filter-group">
          <label for="">Позиции: </label>
          <select v-model="filters.position" @change="applyFilters">
            <option value="">Все Позиции</option>
            <option value="PG">Разыгрывающий защитник</option>
            <option value="SG">Атакующий защитник</option>
            <option value="SF">Легкий форворд</option>
            <option value="PF">Тяжолый форворд</option>
            <option value="C">Центровой</option>
          </select>
        </div>
        <div class="filter-action">
          <button
            @click="resetFilters"
            :disabled="!hasActiveFilters"
            class="reset-btn"
          >
            Сбросить фильтры
          </button>
        </div>
      </div>
      <div v-if="hasActiveFilters" class="active-filters">
        <span class="active-filters-label">Активные фильтры</span>
        <div v-if="filters.position" class="filter-tag">
          Позиция {{ getPositionLabel("position") }}
          <button @click="removeFilter('position')" class="remove-filter">
            x
          </button>
        </div>
        <div v-if="filters.search" class="filter-tag">
          Поиск {{ filters.search }}
          <button @click="removeFilter('search')" class="remove-filter">
            x
          </button>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">
      <div>Загрузка игроков</div>
    </div>
    <div v-else class="players-grid">
      <PlayerCard
        v-for="player in players"
        :key="player.id"
        :player="player"
        :show-add-button="isAuthenticated"
        @add-to-team="addToTeam"
      />
    </div>
    <div v-if="totalPages" class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="changePage(currentPage - 1)"
        class="pagination-btn"
      >
        Назад
      </button>
      <div class="pagination-info">
        Страница {{ currentPage }} из {{ totalPages }}
        <span class="pagination-stats">(всего: {{ totalPlayers }})</span>
      </div>
      <button
        :disabled="currentPage === totalPages"
        @click="changePage(currentPage + 1)"
        class="pagination-btn"
      >
        Вперед
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";
import PlayerCard from "../components/PlayerCard.vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const BUDGET_LIMIT = 200;

const authStore = useAuthStore();
const router = useRouter();
const { isAuthenticated } = storeToRefs(authStore);

const players = ref([]);
const loading = ref(false);
const currentPage = ref(1);
const totalPages = ref(1);
const totalPlayers = ref(0);
const itemsPerPage = ref(12);

const selectedPlayers = ref([]);
const addingPlayers = ref(new Set());
const showTeamCreationModal = ref(false);
const creatingTeam = ref(false);
const newTeamName = ref("");

const filters = ref({
  position: "",
  search: "",
});

const hasActiveFilters = computed(() => {
  return filters.value.position !== "" || filters.value.search !== "";
});

const selectedPlayersCount = computed(() => selectedPlayers.value.length);
const totalSelectionCost = computed(() => {
  return selectedPlayers.value.reduce(
    (sum, player) => sum + parseFloat(player.cost || 0),
    0
  );
});
const canCreateTeam = computed(() => {
  return (
    newTeamName.value.trim() &&
    selectedPlayersCount.value > 0 &&
    selectedPlayersCount.value <= 7 &&
    totalSelectionCost.value <= BUDGET_LIMIT
  );
});

let searchTimeout = null;

const debSearch = () => {
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
    console.log(params);

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

    const data = response.data;
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

const addToTeam = async (player) => {
  if (isPlayerSelected(player)) {
    removeFromSelection(player);
    return;
  }

  if (selectedPlayersCount.value > 7) {
    alert("Error");
    return;
  }

  if (totalSelectionCost.value + parseFloat(player.cost) > BUDGET_LIMIT) {
    alert("Error");
    return;
  }
  addingPlayers.value.add(player.id);
  setTimeout(() => {
    selectedPlayers.value.push(player);
    addingPlayers.value.delete(player.id);
  }, 300);
};

const removeFromSelection = (player) => {
  selectedPlayers.value = selectedPlayers.value.filter(
    (p) => p.id !== player.id
  );
};

const clearSelection = () => {
  selectedPlayers.value = [];
};

const isPlayerSelected = (player) => {
  return selectedPlayers.value.some((p) => p.id === player.id);
};

const createTeamWithSelected = () => {
  if (selectedPlayersCount.value === 0) {
    alert("Error");
    return;
  }
  showTeamCreationModal.value = true;
};

const closeTeamCretionModal = () => {
  if (!canCreateTeam.value) return;

  creatingTeam.value = true;
  //доделать api запрос на создания команды
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
<style scoped>
.players-page {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}
.page-header h1 {
  margin: 0;
  font-size: 30px;
}
.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 10px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.filter-group label {
  font-weight: 600;
}
.filter-group select,
.filter-group input {
  padding: 10px;
  border: 2px solid #eee;
  border-radius: 8px;
  transition: border-color 0.3s;
}
.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #3498ab;
}
.search-input {
  width: 91%;
}
.filter-action {
  display: flex;
  align-items: flex-end;
}
.reset-btn {
  background: #95a5a6;
  color: #fff;
  border: none;
  padding: 12px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: background-color 0.3s;
}
.active-filters {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-top: 10px;
  border-top: 1px solid #ecf0f1;
  flex-wrap: wrap;
}
.active-filters-label {
  font-weight: 600;
  color: #fff;
  font-size: 10px;
}
.active-filters-tags {
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
}
.filter-tag {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #3498db;
  color: #fff;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 15px;
  font-weight: 500;
}
.remove-filter {
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}
.remove-filter:hover {
  background: rgba(255, 255, 255, 0.2);
}
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #7f8c8d;
}
.players-grid {
  margin-top: 40px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 30px;
  margin-bottom: 20px;
}
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
}
.pagination-btn {
  background: #fff;
  color: #3498db;
  border: 2px solid #3498db;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 15px;
  transition: all 0.3s;
  min-width: 120px;
}

.pagination-btn:hover:not(:disabled) {
  color: #fff;
  background: #3498db;
  cursor: not-allowed;
}

.selction-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}
.selection-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
  gap: 10px;
}
.selection-header h3 {
  margin: 0;
  color: #fff;
}
.selection-actions {
  display: flex;
  gap: 10px;
}
.clear-btn {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
}
.clear-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}
.create-team-btn {
  background: #27ae60;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-weight: 500;
}
.create-team-btn:hover {
  background: #219a52;
}
.selected-players-list {
  display: flex;
  flex-wrap: wrap;
  gap: 7px;
  margin-bottom: 10px;
}
.selected-player {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 10px;
  border-radius: 8px;
  backdrop-filter: blur(10px);
}
</style>
