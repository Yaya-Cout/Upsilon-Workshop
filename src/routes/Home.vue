<template>
  <div id="home-page">
    <h1
      class="text-center text-h1 my-10 py-10"
      style="background-color:#fffa"
    >
      {{ $t('upsilon-workshop') }}
    </h1>
    <v-row class="mx-2 my-0">
      <ProjectPreview
        v-for="project in projects"
        :key="project.uuid"
        :project="project"
      />
    </v-row>
  </div>
</template>
<script lang="ts">

import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import ProjectPreview from '../components/ProjectPreview.vue';
import { Project } from '../types';

export default defineComponent({
  name: 'HomePage',
  components: { ProjectPreview },
  data() {
    return {
      projects: [] as Project[],
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
    }
  },
  async mounted() {
    this.globalStore.progress = true;
    try {
      this.projects = await this.api.getProjects()
    } catch (e) {
      console.error("Failed to fetch projects:", e)
      this.globalStore.error = "snackbar.error.home.fetch-projects-failed"
    }
    this.globalStore.progress = false;
  },
});
</script>

<style scoped></style>