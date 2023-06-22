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

<script lang="ts">
import { defineComponent } from 'vue';
import SimulatorView from '../components/SimulatorView.vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';
import SummaryViewer from '../components/viewer/SummaryViewer.vue';
import LongDescription from '../components/viewer/LongDescription.vue';

export default defineComponent({
  name: 'ViewerPage',
  components: {
    SimulatorView,
    SummaryViewer,
    LongDescription,
  },
  data() {
    return {
      project: useAPIStore().api.EMPTY_PROJECT as Project,
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      uuid: this.$route.params.uuid as string,
    };
  },
  async mounted() {
    this.globalStore.progress = true;
    // Before loading the project, add the uuid to the dummy project
    this.project.uuid = this.uuid;
    try {
      this.project = await this.api.loadLazyLoadingObject(this.api.getProject(this.uuid));
    } catch (e) {
      // Redirect to 404 page
      this.$router.push({ name: 'notfound' });
    }
    this.globalStore.progress = false;
  },
});
</script>

<style scoped></style>
