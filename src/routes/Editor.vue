<template>
  <div
    id="editor-page"
    class="fill-height"
  >
    <v-container
      fluid
      class="fill-height"
    >
      <v-row class="mt-0 fill-height">
        <div
          class="bg-background elevation-3 rounded-lg ml-4 pa-1"
          style="width: 300px"
        >
          <v-card>
            <v-card-title>
              <h3>{{ project.title }}</h3>
            </v-card-title>
            <v-card-item>
              <v-chip
                variant="outlined"
                class="mx-1"
              >
                Public
              </v-chip>
              <v-chip class="mx-1">
                Games
              </v-chip>
              <v-chip class="mx-1">
                Upsilon
              </v-chip>
              <v-chip class="mx-1">
                Omega
              </v-chip>
            </v-card-item>
            <v-card-actions>
              <v-dialog v-model="dialog">
                <template #activator="{ props }">
                  <v-btn v-bind="props">
                    Edit project info
                  </v-btn>
                </template>
                <EditProjectDialog />
              </v-dialog>
            </v-card-actions>
          </v-card>
          <v-tabs v-model="tab">
            <v-tab value="simulator">
              Simulator
            </v-tab>
            <v-tab value="device">
              Device
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="simulator">
              <SimulatorView
                ref="simulator"
                :scripts="project.files"
              />
            </v-window-item>

            <v-window-item value="device">
              <DeviceInterface
                :scripts="project.files"
                @record-select="onRecordSelect"
              />
            </v-window-item>
          </v-window>
        </div>
        <div
          style="display: flex; flex-direction: column; flex: 1"
          class="bg-background elevation-3 rounded-lg mx-4 pa-1"
        >
          <MonacoEditor
            :project="project"
            @run="run"
          />
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DeviceInterface from '../components/DeviceInterface.vue';
import EditProjectDialog from '../components/EditProjectDialog.vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import SimulatorView from '../components/SimulatorView.vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';

export default defineComponent({
  name: 'EditorPage',
  components: { MonacoEditor, SimulatorView, DeviceInterface, EditProjectDialog },
  data() {
    return {
      tab: null,
      project: useAPIStore().api.EMPTY_PROJECT as Project,
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      dialog: false,
    };
  },
  async mounted() {
    this.globalStore.progress = true;
    this.project = await this.api.loadLazyLoadingObject(this.api.getProject(this.$route.params.uuid));
    this.globalStore.progress = false;
  },
  methods: {
    onRecordSelect(record: any) {
      if (record.type === 'py') {
        this.project.files.push({
          title: record.name + '.py',
          content: record.code,
        });
      }
    },
    run() {
      if (this.$refs.simulator && this.$refs.simulator.send) {
        this.$refs.simulator.send();
      } else {
        console.error('Simulator component not found');
      }
    }
  },
});
</script>

<style scoped></style>