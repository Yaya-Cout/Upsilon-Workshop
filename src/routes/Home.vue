<template>
  <div id="home-page">
    <h1
      class="text-center text-h1 my-10 py-10"
      style="background-color:#fffa"
    >
      Upsilon Workshop
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
import ProjectPreview from '../components/ProjectPreview.vue';

export default defineComponent({
    name: 'HomePage',
    components: { ProjectPreview }
    , data() {
        return {
            projects: [],
            api: useAPIStore().api
        }
    },
    async mounted() {
        this.projects = await this.api.getProjects()
    },
});
</script>

<style scoped>

</style>