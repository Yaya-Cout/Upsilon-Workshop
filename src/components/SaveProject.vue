<template>
  <span @click="save">
    <slot />
  </span>
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

const emits = defineEmits(['modified']);

const save = () => {
  api.updateProject(props.project).then(() => {
    emits('modified', false);
    globalStore.success = "snackbar.success.project-saved.message"
  }).catch((error) => {
    globalStore.error = true;
    console.error(error);
  });
}
</script>

<style scoped></style>
