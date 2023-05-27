<template>
  <div id="viewer-page">
    <v-row>
      <v-col>
        <h1>{{ project.title }}</h1>
        <v-btn :to="'/edit/' + uuid">
          Edit
        </v-btn>
        <UploadProject :project="project">
          <v-btn>Upload to calculator</v-btn>
        </UploadProject>
        <MarkdownView :content="project.description" />
      </v-col>
      <v-col>
        <SimulatorView :scripts="project.files" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MarkdownView from '../components/MarkdownView.vue';
import SimulatorView from '../components/SimulatorView.vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';
import UploadProject from '../components/UploadProject.vue';

export default defineComponent({
  name: 'ViewerPage',
  components: {
    SimulatorView,
    MarkdownView,
    UploadProject,
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
    this.project = await this.api.loadLazyLoadingObject(this.api.getProject(this.uuid));
    this.globalStore.progress = false;
  },
});
</script>

<style scoped></style>
