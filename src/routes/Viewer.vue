<template>
  <div id="viewer-page">
    <v-progress-linear
      :active="loading"
      :indeterminate="loading"
      bottom
      color="deep-purple-accent-4"
    />
    <v-row>
      <v-col>
        <h1>{{ project?.title }}</h1>
        <v-btn :to="'/edit/' + project?.uuid">
          Edit
        </v-btn>
        <UploadProject :project="project">
          <v-btn>Upload to calculator</v-btn>
        </UploadProject>
        <MarkdownView :content="project?.description" />
      </v-col>
      <v-col>
        <SimulatorView :scripts="project?.files" />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import MarkdownView from '../components/MarkdownView.vue';
import SimulatorView from '../components/SimulatorView.vue';
import { useAPIStore } from '../stores/api';
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
            project: null as Project | null,
            api: useAPIStore().api,
            loading: true,
        };
    },
    async mounted() {
        this.project = await this.api.getProject(this.$route.params.uuid);
        this.loading = false;
    },
});
</script>

<style scoped></style>
