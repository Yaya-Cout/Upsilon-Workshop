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
          style="width: 480px"
        >
          <v-card>
            <v-card-title>
              <v-skeleton-loader
                :loading="!project._loaded"
                type="heading"
              >
                <h3>{{ project.title }}</h3>
              </v-skeleton-loader>
            </v-card-title>
            <v-card-item v-if="tags.length > 0">
              <TagView
                v-for="(tag, index) in tags"
                :key="index"
                :tag="tag"
              />
            </v-card-item>
            <v-card-actions>
              <EditProjectDialog
                v-if="hasWriteAccess()"
                :project="project"
                @update-metadata="updateMetadata"
              >
                <v-btn>
                  {{ $t('editor.edit-project-info') }}
                </v-btn>
              </EditProjectDialog>
              <v-btn
                v-else
                :to="'/view/' + project.uuid"
              >
                {{ $t('editor.view-project-info') }}
              </v-btn>
            </v-card-actions>
          </v-card>
          <v-tabs v-model="tab">
            <v-tab value="simulator">
              {{ $t('editor.simulator') }}
            </v-tab>
            <v-tab value="device">
              {{ $t('editor.device') }}
            </v-tab>
          </v-tabs>
          <v-window v-model="tab">
            <v-window-item value="simulator">
              <SimulatorView
                ref="simulatorObject"
                :project="project"
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
            @update-project="updateProject"
          />
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Tag } from '../types';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';
import DeviceInterface from '../components/DeviceInterface.vue';
import EditProjectDialog from '../components/EditProjectDialog.vue';
import MonacoEditor from '../components/MonacoEditor.vue';
import SimulatorView from '../components/SimulatorView.vue';
import TagView from '../components/TagView.vue';

const $router = useRouter();
const $route = useRoute();
const api = useAPIStore().api;
const globalStore = useGlobalStore();
const apiStore = useAPIStore();
const uuid = $route.params.uuid as string;

const tab = ref(null);
const project = ref(api.EMPTY_PROJECT as Project);
const tags = ref([api.EMPTY_TAG, api.EMPTY_TAG] as Tag[]);
const simulatorObject = ref<InstanceType<typeof SimulatorView> | null>(null);

project.value._loaded = false;

onMounted(async () => {
  globalStore.progress = true;
  // Before loading the project, add the uuid to the dummy project
  api.EMPTY_PROJECT.uuid = uuid;
  try {
    project.value = await api.loadLazyLoadingObject(api.getProject(uuid));
  } catch (e) {
    // Redirect to 404
    $router.push({ name: 'notfound' });
  }
  tags.value = await project.value.tags;
  globalStore.progress = false;
});

const onRecordSelect = (record: any) => {
  if (record.type === 'py') {
    // If the file is already in the project, replace it with the new one
    for (const file of project.value.files) {
      if (file.title === record.name + '.py') {
        file.content = record.code;
        globalStore.success = 'snackbar.success.script-replaced.message';
        return;
      }
    }
    project.value.files.push({
      title: record.name + '.py',
      content: record.code,
    });
    globalStore.success = 'snackbar.success.script-added.message';
  }
};

const run = () => {
  if (simulatorObject.value) {
    simulatorObject.value.send();
  } else {
    console.error('Simulator component not found');
  }
};

const hasWriteAccess = (): boolean => {
  // Get if the user is the owner of the project
  if (project.value.author === apiStore.username && apiStore.username !== '') {
    return true;
  }
  // Get if the user is a collaborator of the project
  for (const collaborator of project.value.collaborators) {
    if (collaborator === apiStore.username) {
      return true;
    }
  }
  return false;
};

const updateMetadata = async (metadata: any) => {
  globalStore.progress = true;
  project.value = metadata;
  try {
    await api.updateProjectMetadata(metadata);
    globalStore.success = "snackbar.success.project-saved.message";
  } catch (e) {
    globalStore.error = true;
    console.error(e);
  }
  globalStore.progress = false;
};

const updateProject = (NewProject: Project) => {
  project.value = NewProject;
};
</script>

<style scoped></style>