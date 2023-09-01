<template>
  <div id="viewer-page">
    <v-container fluid>
      <v-row dense>
        <v-col>
          <SummaryViewer :project="project" />
          <LongDescription :project="project" />
        </v-col>
        <v-col>
          <SimulatorView :scripts="project.files" />
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import SimulatorView from '../components/SimulatorView.vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';
import SummaryViewer from '../components/viewer/SummaryViewer.vue';
import LongDescription from '../components/viewer/LongDescription.vue';

const api = useAPIStore().api;
const globalStore = useGlobalStore();
const $route = useRoute();
const $router = useRouter();

const project = ref(useAPIStore().api.EMPTY_PROJECT as Project);
const uuid = ref($route.params.uuid as string);

onMounted(async () => {
  globalStore.progress = true;
  // Before loading the project, add the uuid to the dummy project
  project.value.uuid = $route.params.uuid as string;
  try {
    project.value = await api.loadLazyLoadingObject(api.getProject(uuid.value));
  } catch (e) {
    // Redirect to 404 page
    $router.push({ name: 'notfound' });
  }
  globalStore.progress = false;
});
</script>

<style scoped></style>
