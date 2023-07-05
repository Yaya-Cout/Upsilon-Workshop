<template>
  <v-progress-linear
    :active="active"
    :indeterminate="indeterminate"
    :model-value="progress"
    bottom
    absolute
    color="deep-purple-accent-4"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useGlobalStore } from '../stores/global';

const globalStore = useGlobalStore();

const progress = computed(() => {
  if (globalStore.progress === true || globalStore.progress === false) {
    return 0;
  }
  return globalStore.progress;
});

const indeterminate = computed(() => globalStore.progress === true);

const active = computed(() => globalStore.progress !== false);
</script>

<style scoped></style>
