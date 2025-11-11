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
        :src="player.avatar"
        :alt="player.name"
        class="player-avatar"
      />
    </div>
    <div class="player-info">
      <div class="stat">
        <span class="label">Очки:</span>
        <div class="value">{{ player.points }}</div>
      </div>
      <div class="stat">
        <span class="label">Подборы:</span>
        <div class="value">{{ player.podboru }}</div>
      </div>
      <div class="stat">
        <span class="label">Передачи:</span>
        <div class="value">{{ player.peredachu }}</div>
      </div>
      <div class="stat">
        <span class="label">Фолы:</span>
        <div class="value">{{ player.folv }}</div>
      </div>
      <div class="stat">
        <span class="label">Перехваты:</span>
        <div class="value">{{ player.perexvat }}</div>
      </div>
      <div class="stat">
        <span class="label">Потери:</span>
        <div class="value">{{ player.poteri }}</div>
      </div>
      <div class="stat">
        <span class="label">Блокшоты:</span>
        <div class="value">{{ player.blokchotu }}</div>
      </div>
    </div>
    <div class="player-footer">
      <span class="cost">{{ player.cost }}</span>
      <button
        v-if="isAuthenticated && !isInTeam && showAddButton"
        @click="$emit('add-to-team', player)"
        class="add-btn"
        :disabled="isAdding"
      >
        {{ isAdd ? "Добавляется..." : "Добавить" }}
      </button>
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
</style>
