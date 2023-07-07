<template>
  <div id="user-page">
    <v-container>
      <v-row no-gutters>
        <v-col class="user-col col-1">
          <UserPreviewBig :user="userData" />
        </v-col>
        <v-col class="col-1">
          <v-card>
            <v-card-title>
              <h3>{{ $t('user.projects') }}</h3>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-row class="mx-2 my-0">
                  <ProjectPreview
                    v-for="project in projects"
                    :key="project.uuid"
                    :project="project"
                  />
                  <p v-if="projects.length === 0">
                    {{ $t('user.no-projects') }}
                  </p>
                </v-row>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col class="col-1">
          <v-card>
            <v-card-title>
              <h3>{{ $t('user.collaborations') }}</h3>
            </v-card-title>
            <v-card-text>
              <v-list>
                <v-row class="mx-2 my-0">
                  <ProjectPreview
                    v-for="project in collaborations"
                    :key="project.uuid"
                    :project="project"
                  />
                  <p v-if="collaborations.length === 0">
                    {{ $t('user.no-collaborations') }}
                  </p>
                </v-row>
              </v-list>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project } from '../types';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';
import ProjectPreview from '../components/ProjectPreview.vue';

const api = useAPIStore().api;
const globalStore = useGlobalStore();
const $router = useRouter();
const $route = useRoute();

const userData = ref(api.EMPTY_USER);
const projects = ref([api.EMPTY_PROJECT, api.EMPTY_PROJECT, api.EMPTY_PROJECT, api.EMPTY_PROJECT] as Project[]);
const groups = ref('none' as string);
const collaborations = ref([api.EMPTY_PROJECT, api.EMPTY_PROJECT, api.EMPTY_PROJECT, api.EMPTY_PROJECT] as Project[]);
const username = ref($route.params.username as string);

watch(username, async () => {
  try {
    userData.value = await api.loadLazyLoadingObject(api.getUser(username.value));
  } catch (e) {
    // Redirect to 404 page
    $router.push({ name: 'notfound' });
  }
  let newProjects = [] as Project[];
  let newCollaborations = [] as Project[];

  // Iterate over the project and start loading them
  for (const project of await userData.value.projects) {
    api.loadLazyLoadingObject(project);
    newProjects.push(api.EMPTY_PROJECT);
    newProjects[newProjects.length - 1]._loading = true;
  }
  // Iterate over the collaborations and start loading them
  for (const project of await userData.value.collaborations) {
    api.loadLazyLoadingObject(project);
    newCollaborations.push(api.EMPTY_PROJECT);
    newCollaborations[newCollaborations.length - 1]._loading = true;
  }
  projects.value = newProjects;
  collaborations.value = newCollaborations;

  let index = 0;
  for (const project of await userData.value.projects) {
    loadProject(project, index);
    index++;
  }
  index = 0;
  for (const project of await userData.value.collaborations) {
    loadCollaboration(project, index);
    index++;
  }
});

watch(userData, async () => {
  // We watch on userData.groups to update the groups string
  // when the data is loaded
  const groupsLoaded = await userData.value?.groups;
  let groupsString = '';
  for (const group of groupsLoaded || []) {
    const result = await group.name;
    groupsString += result + ', ';
  }
  groupsString = groupsString.slice(0, -2);
  groups.value = groupsString;
}, { immediate: true });

async function loadProject(project: Project, index: number) {
  projects.value[index] = await api.loadLazyLoadingObject(project);
}

async function loadCollaboration(project: Project, index: number) {
  collaborations.value[index] = await api.loadLazyLoadingObject(project);
}

onMounted(async () => {
  try {
    userData.value = await api.loadLazyLoadingObject(api.getUser(username.value));
  } catch (e) {
    // Redirect to 404 page
    $router.push({ name: 'notfound' });
  }
  let newProjects = [] as Project[];
  let newCollaborations = [] as Project[];

  // Iterate over the project and start loading them
  for (const project of await userData.value.projects) {
    api.loadLazyLoadingObject(project);
    newProjects.push(api.EMPTY_PROJECT);
    newProjects[newProjects.length - 1]._loading = true;
  }
  // Iterate over the collaborations and start loading them
  for (const project of await userData.value.collaborations) {
    api.loadLazyLoadingObject(project);
    newCollaborations.push(api.EMPTY_PROJECT);
    newCollaborations[newCollaborations.length - 1]._loading = true;
  }
  projects.value = newProjects;
  collaborations.value = newCollaborations;

  let index = 0;
  for (const project of await userData.value.projects) {
    loadProject(project, index);
    index++;
  }
  index = 0;
  for (const project of await userData.value.collaborations) {
    loadCollaboration(project, index);
    index++;
  }
});
</script>

<style scoped>
.user-col {
  max-width: 400px;
}

.col-1 {
  margin: 16px;
}
</style>
