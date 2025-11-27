<template>
  <div class="teams-page">
    <div class="page-header">
      <h1>Моя команда</h1>
      <button @click="showTeamForm = true" class="create-team-btn">
        Создать номанду
      </button>
    </div>
    <div v-if="showTeamForm" class="team-form-overlay">
      <div class="team-fom-containe">
        <div class="team-form">
          <div class="form-header">
            <h3>Создание команды</h3>
            <button @click="closeTeamFom" class="close-btn">x</button>
          </div>
          <form @submit.prevent="createTeam">
            <div class="form-group">
              <label>Название оманды: </label>
              <input
                v-model="newTeam.name"
                type="text"
                required
                placeholder="Введите название команды"
                class="team-name-input"
              />
            </div>
            <div class="selected-playes-section">
              <h4>Выбранные игроки ({{ selectedPlayers.length }}/7)</h4>
              <div
                v-if="selectedPlayers.length > 0"
                class="selected-players-list"
              >
                <div
                  v-for="player in selectedPlayers"
                  :key="player.id"
                  class="selected-playe"
                >
                  <div class="player-info">
                    <span>{{ player.name }}</span>
                    <span class="position">{{ player.position }}</span>
                    <span class="cost">
                      <div class="d-flex">
                        <div>{{ player.cost }}</div>
                        <div>
                          <img
                            width="20px"
                            height="20px"
                            src="http://localhost:3000/img/basket-coin.png"
                          />
                        </div></div
                    ></span>
                  </div>
                  <button
                    @click="removeFromTeam(player)"
                    type="button"
                    class="remove-btn"
                  >
                    x
                  </button>
                </div>
              </div>
              <div v-else class="no-players-selected">
                <p>Выберите игроков из списка ниже</p>
              </div>
            </div>
            <div class="team-budget">
              <div class="budget-item">
                <span>Бюджет: </span>
                <span>{{ budget }}</span>
              </div>
              <div class="budget-item">
                <span>Общая стоимость: </span>
                <span>{{ totalCost }}</span>
              </div>
              <div class="budget-item" :class="{ error: budget > totalCost }">
                <span>Остаток: </span>
                <span>{{ budget - totalCost }}</span>
              </div>
            </div>
            <div class="available-playes-section">
              <div class="section-header">
                <h4>Доступные игроки</h4>
                <div class="playes-filters">
                  <select
                    v-model="playesFilters.position"
                    @change="loadAvailablePlayers"
                  >
                    <option value="">Все Позиции</option>
                    <option value="PG">Разыгрывающий защитник</option>
                    <option value="SG">Атакующий защитник</option>
                    <option value="SF">Легкий форворд</option>
                    <option value="PF">Тяжолый форворд</option>
                    <option value="C">Центровой</option>
                  </select>

                  <input
                    v-model="playesFilters.search"
                    type="text"
                    placeholder="Поиск по имени"
                    @input="debouncedSearch"
                    class="search-input"
                  />
                </div>
              </div>
              <div v-if="availablePlayersLoading" class="loading">
                Загруза игроов...
              </div>
              <div v-else class="available-players-grid">
                <div
                  v-for="player in availablePlayers"
                  :key="player.id"
                  :class="[
                    'player-card',
                    {
                      selected: isPlayerSelected(player),
                      'over-budget': !caAddPlayer(player),
                      disabled:
                        isPlayerSelected(player) || !canAddPlayer(player),
                    },
                  ]"
                  @click="togglePlayer(player)"
                >
                  <div class="player-heaer">
                    <h5>{{ player.name }}</h5>
                    <span
                      class="position-badge"
                      :class="player.position.toLowerCase()"
                      >{{ player.position }}</span
                    >
                  </div>
                  <div class="playe-stats">
                    <div class="stat">
                      <span class="label">Перехваты:</span>
                      <div class="value">{{ player.steals }}</div>
                    </div>
                    <div class="stat">
                      <span class="label">Потери:</span>
                      <div class="value">{{ player.turnovers }}</div>
                    </div>
                  </div>
                  <div class="player-footer">
                    <div class="player-cost">{{ player.cost }}</div>
                    <div
                      v-if="isPlayerSelected(player)"
                      class="selected-indicator"
                    >
                      Выбран
                    </div>
                    <div
                      v-else-if="!canAddPlayer(player)"
                      class="budget-warming-text"
                    >
                      Бюджет превышен
                    </div>
                    <div v-else class="add-indicator">Добавить</div>
                  </div>
                </div>
              </div>
              <div
                v-if="availablePlayers.length === 0 && !availablePlayersLoading"
                class="no-players-found"
              >
                <p>Игроки не найдены</p>
              </div>
            </div>
            <div class="form-actions">
              <button type="button" @click="closeTeamForm" class="cancel-btn">
                Отмена
              </button>
              <button
                type="submit"
                :disabled="!canCreateTeam || creatingTeam"
                class="submit-btn"
              >
                {{ creatingTeam ? "Создание" : "Создать оманду" }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div v-if="loading" class="loading">Загрузка команды...</div>
    <div v-else-if="teams.length > 0" class="teams-list">
      <div v-for="team in teams">
        <div class="team-header">
          <h3>{{ team.name }}</h3>
          <div class="team-stats">
            <span class="points">{{ team.total_points }} очков</span>
            <span class="busget">Бюджет: {{ team.budget }}</span>
          </div>
        </div>
        <div class="players-list">
          <h4>Состав команды ({{ team.players?.length || 0 }} игроков)</h4>
          <div
            v-if="team.playes && team.players.length > 0"
            class="players-grid"
          >
            <div
              v-for="player in team.players"
              :key="player.id"
              class="team-player"
            >
              <div class="player-info">
                <strong>{{ player.name }}</strong>
                <span class="position">{{ player.position }}</span>
              </div>
              <div class="player-stats">
                <span>{{ player.points }}</span>
                <span>{{ player.cost }}</span>
              </div>
            </div>
          </div>
          <div v-else class="no-players">В команде пока нет игроков</div>
        </div>
        <div class="team-actions">
          <button @click="viewTeam(team.id)" class="view-btn">
            Просмотреть
          </button>
        </div>
      </div>
    </div>
    <div v-else class="no-team">
      <p>У вас пока нет команды</p>
      <button @click="showTeamForm = true" class="create-team-btn">
        Создать команду
      </button>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, watch, computed } from "vue";
import api from "../services/api";
import { useRouter } from "vue-router";

const teams = ref([]);
const loading = ref(false);
const showTeamForm = ref(false);
const creatingTeam = ref(false);
const availablePlayers = ref([]);
const availablePlayersLoading = ref(false);
const selectedPlayers = ref([]);
const newTeam = ref({
  name: "",
});

const playerFilters = ref({
  position: "",
  search: "",
});

const BUDGET_LIMIT = 300;

const totalCost = computed(() => {
  return selectedPlayers.value.reduce(
    (sum, player) => sum + parseFloat(player.cost || 0),
    0
  );
});
const budget = computed(() => BUDGET_LIMIT);
const canCreateTeam = computed(() => {
  return (
    newTeam.value.name.trim() &&
    selectedPlayers.value.length > 0 &&
    selectedPlayers.value.length <= 7 &&
    totalCost.value <= BUDGET_LIMIT
  );
});
//методы
</script>
