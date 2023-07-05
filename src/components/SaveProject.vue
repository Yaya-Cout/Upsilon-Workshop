<template>
  <div @click="save">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { Project } from '../types';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';

const api = useAPIStore().api;
const globalStore = useGlobalStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const save = () => {
  api.updateProject(props.project).then(() => {
    globalStore.success = "snackbar.success.project-saved.message"
  }).catch((error) => {
    globalStore.error = true;
    console.error(error);
  });
}
</script>

<style scoped></style>
