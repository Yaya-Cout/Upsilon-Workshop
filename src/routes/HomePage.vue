<template>
  <div id="home-page">
    <h1
      class="text-center text-h1 my-10 py-10"
      style="background-color:#fffa"
    >
      {{ $t('upsilon-workshop') }}
    </h1>
    <v-row class="mx-2 my-0 full-width">
      <ProjectPreview
        v-for="project in projects"
        :key="project.uuid"
        :project="project"
      />
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';
import ProjectPreview from '../components/ProjectPreview.vue';

const projects = ref([] as Project[]);

const api = useAPIStore().api;
const globalStore = useGlobalStore();

onMounted(async () => {
  globalStore.progress = true;
  try {
    projects.value = await api.getProjects();
  } catch (e) {
    console.error("Failed to fetch projects:", e);
    globalStore.error = "snackbar.error.home.fetch-projects-failed";
  }
  globalStore.progress = false;
});
</script>

<style scoped>
.full-width {
  width: 100%;
}
</style>