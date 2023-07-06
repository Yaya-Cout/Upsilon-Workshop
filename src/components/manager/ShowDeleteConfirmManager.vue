<!-- This manager manage the loading of don't show delete confirm -->
<template>
  <div />
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue';
import { useGlobalStore } from '../../stores/global';

const globalStore = useGlobalStore();

watch(
  () => globalStore.showDeleteConfirm,
  () => {
    if (globalStore.showDeleteConfirm) {
      localStorage.removeItem('dontShowDeleteConfirm');
    } else {
      localStorage.setItem('dontShowDeleteConfirm', 'true');
    }
  },
);

onMounted(() => {
  globalStore.showDeleteConfirm = localStorage.getItem('dontShowDeleteConfirm') !== 'true';
});
</script>

<style scoped></style>
