<template>
  <div
    id="editor-page"
    class="fill-height"
  >
    <v-container
      fluid
      class="fill-height"
    >
      <v-row class="mt-0 fill-height no-wrap">
        <div
          class="bg-background elevation-3 rounded-lg ml-4 pa-1 left-row"
        >
          <v-card>
            <v-card-title>
              <v-skeleton-loader
                :loading="!project._loaded"
                type="heading"
                class="card-title"
              >
                <EditProjectDialog
                  v-if="hasWriteAccess()"
                  :project="project"
                  @update-metadata="updateMetadata"
                >
                  <h3 class="title title-with-edit">
                    {{ project.title }}
                    <v-tooltip
                      activator="parent"
                      location="top"
                    >
                      {{ project.title }}
                    </v-tooltip>
                  </h3>
                  <span>
                    <v-btn
                      density="compact"
                      variant="plain"
                      icon="mdi-pencil"
                    />
                    <v-tooltip
                      activator="parent"
                      location="bottom"
                    >
                      {{ $t('editor.edit-project-info') }}
                    </v-tooltip>
                  </span>
                </EditProjectDialog>
                <h3
                  v-else
                  class="title"
                >
                  {{ project.title }}
                  <v-tooltip
                    activator="parent"
                    location="bottom"
                  >
                    {{ project.title }}
                  </v-tooltip>
                </h3>
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
              <v-btn
                :to="'/view/' + project.uuid"
              >
                {{ $t('editor.view-project-info') }}
              </v-btn>
              <DownloadProject
                :project="project"
              >
                <v-btn icon>
                  <v-icon>mdi-download</v-icon>
                </v-btn>
                <v-tooltip
                  activator="parent"
                  location="bottom"
                >
                  {{ $t('editor.download-tooltip') }}
                </v-tooltip>
              </DownloadProject>
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
            @modified="modified"
          />
        </div>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Tag } from '../types';
import DeviceInterface from '../components/DeviceInterface.vue';
import DownloadProject from '../components/DownloadProject.vue';
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

  // Prevent exiting if project isn't saved
  // Based on https://stackoverflow.com/questions/78516768/how-to-trigger-a-confirmation-modal-before-leaving-a-page-in-nuxt-3-and-vue-3
  window.addEventListener('beforeunload', beforeUnload);
});

onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', beforeUnload)
})

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
  // FIXME: This code is never executed as all writes are done indirectly,
  // through pointers
  project.value = NewProject;
};

const modified = (value: boolean) => {
  console.log("Modified", value);
  useGlobalStore().preventExit = value;
};

const beforeUnload = (e: Event) => {
  if (useGlobalStore().preventExit) {
    console.log("Project has been modified, blocking exit")
    e.preventDefault()
  }
};
</script>

<style scoped>
.no-wrap {
  flex-wrap: nowrap;
}

.title {
  max-width: 100%;
  display: inline-block;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
  padding-right: 4px;
}

.title-with-edit {
  max-width: calc(100% - 30px);
}

.card-title {
  display: inline;
}

.left-row {
  width: 480px;
  max-width: 33vw;
}
</style>