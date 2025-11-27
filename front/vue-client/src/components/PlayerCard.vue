<template>
  <div class="player-card">
    <div class="player-header">
      <h3>{{ player.name }}</h3>
      <span class="position-badge" :class="positionClass">{{
        player.position
      }}</span>
    </div>
    <div class="avatar">
      <img
        v-if="player.avatar"
        :src="'http://localhost:3000' + player.avatar"
        :alt="player.name"
        class="player-avatar"
      />
    </div>
    <div class="player-info">
      <!-- <div class="stat">
        <span class="label">Очки:</span>
        <div class="value">{{ player.points }}</div>
      </div> -->
      <div class="stat">
        <span class="label">Подборы:</span>
        <div class="value">{{ player.rebounds }}</div>
      </div>
      <!-- <div class="stat">
        <span class="label">Передачи:</span>
        <div class="value">{{ player.assists }}</div>
      </div> -->
      <!-- <div class="stat">
        <span class="label">Фолы:</span>
        <div class="value">{{ player.fouls }}</div>
      </div> -->
      <div class="stat">
        <span class="label">Перехваты:</span>
        <div class="value">{{ player.steals }}</div>
      </div>
      <div class="stat">
        <span class="label">Потери:</span>
        <div class="value">{{ player.turnovers }}</div>
      </div>
      <!-- <div class="stat">
        <span class="label">Блокшоты:</span>
        <div class="value">{{ player.blocks }}</div>
      </div> -->
    </div>
    <div class="player-footer">
      <span class="cost">
        <div class="d-flex">
          <div>{{ player.cost }}</div>
          <div>
            <img
              width="20px"
              height="20px"
              src="http://localhost:3000/img/basket-coin.png"
            />
          </div>
        </div>
      </span>
      <button
        v-if="isAuthenticated && !isInTeam && showAddButton"
        @click="$emit('add-to-team', player)"
        class="add-btn"
        :disabled="isAdding"
      >
        {{ isAdd ? "Добавляется..." : "Добавить" }}
      </button>
      <span v-else-if="isInTeam" class="in-team">В команде</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const props = defineProps({
  player: {
    type: Object,
    required: true,
  },
  isInTeam: {
    type: Boolean,
    default: false,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  isAdding: {
    type: Boolean,
    default: false,
  },
});

defineEmits(["add-to-team"]);

const authStore = useAuthStore();
const { isAuthenticated } = storeToRefs(authStore);
const positionClass = computed(() => {
  const positions = {
    PG: "pg",
    SG: "sg",
    SF: "sf",
    PF: "pf",
    C: "c",
  };
  return positions[props.player.position] || "default";
});
</script>

<style scoped>
.player-card {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.player-card:hover {
  transform: translateY(-2px);
}
.player-avatar {
  width: 100%;
  /*height: 300px;
  object-fit: cover;*/
}
.player-info {
  display: flex;
  gap: 5px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.stat {
  display: flex;
  justify-content: space-between;
}
.label {
  font-weight: 500;
}
.value {
  font-weight: bold;
}
.player-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.cost {
  font-size: 15px;
  font-weight: bold;
  color: #27ae60;
}
.add-btn {
  background: #3498db;
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.add-btn:hover:not(:disabled) {
  background: #2980b9;
}
.add-btn:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}
.d-flex {
  display: flex;
  align-items: center;
  gap: 5px;
}
.d-flex div {
  height: 25px;
}
</style>
