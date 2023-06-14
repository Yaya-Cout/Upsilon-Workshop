<template>
  <div id="viewer-page">
    <v-container fluid>
      <v-row dense>
        <v-col>
          <SummaryViewer :project="project" />
          <!-- TODO: Long description -->
        </v-col>
        <v-col>
          <v-card class="mx-auto px-6 py-8">
            <v-card-item>
              <v-btn variant="outlined" @click="launchSimul" v-if="!startSimul">
                {{ $t('viewer.simulator-launch') }}
              </v-btn>
              <v-btn variant="outlined" @click="launchSimul" v-else>
                {{ $t('viewer.simulator-stop') }}
              </v-btn>
              <div v-if="startSimul">
                <SimulatorView :scripts="project.files" />
              </div>
            </v-card-item>
          </v-card>
          
          
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

export default defineComponent({
  name: 'ViewerPage',
  components: {
    SimulatorView,
    SummaryViewer,
  },
  data() {
    return {
      project: useAPIStore().api.EMPTY_PROJECT as Project,
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      uuid: this.$route.params.uuid as string,
      startSimul: false
    };
  },
  async mounted() {
    this.globalStore.progress = true;
    try {
      this.project = await this.api.loadLazyLoadingObject(this.api.getProject(this.uuid));
    } catch (e) {
      // Redirect to 404 page
      this.$router.push({ name: 'notfound' });
    }
    this.globalStore.progress = false;
  },
  methods: {
    launchSimul() {
      this.startSimul = !this.startSimul
    }
  },
});
</script>

<style scoped></style>
