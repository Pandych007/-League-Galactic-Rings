<template>
  <div>
    <div>
      <h3>{{ player.name }}</h3>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useAuthStore } from "../stores/auth";
import { storeToRefs } from "pinia";

const props = defineProps({
  player: {
    type: Object,
    require: true,
  },
  isInTeam: {
    type: Boolean,
    default: false,
  },
  showAddButton: {
    type: Boolean,
    default: true,
  },
  isAddding: {
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
<style scoped></style>
