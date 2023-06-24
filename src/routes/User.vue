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
                  <ProjectPreviewVue
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
                  <ProjectPreviewVue
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

<script lang="ts">
import { defineComponent } from 'vue';
import { User, Project } from '../types';
import { useAPIStore } from '../stores/api';
import ProjectPreviewVue from '../components/ProjectPreview.vue';
import UserPreviewBig from '../components/user/UserPreviewBig.vue';

export default defineComponent({
  name: 'UserPage',
  components: {
    ProjectPreviewVue,
    UserPreviewBig,
  },
  data() {
    return {
      api: useAPIStore().api,
      username: this.$route.params.username as string,
      userData: useAPIStore().api.EMPTY_USER as User,
      groups: 'none' as string,
      // TODO: Factorize this
      projects: [useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT] as Project[],
      collaborations: [useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT, useAPIStore().api.EMPTY_PROJECT] as Project[]
    }
  },
  watch: {
    // We watch on userData.groups to update the groups string
    // when the data is loaded
    'userData.groups': {
      async handler() {
        const groups = await this.userData?.groups;
        let groupsString = '';
        for (const group of groups || []) {
          const result = await group.name;
          groupsString += result + ', ';
        }
        groupsString = groupsString.slice(0, -2);
        this.groups = groupsString;
      },
      immediate: false,
    },
  },
  async mounted() {
    try {
      this.userData = await this.api.loadLazyLoadingObject(this.api.getUser(this.username));
    } catch (e) {
      // Redirect to 404 page
      this.$router.push({ name: 'notfound' });
    }
    let projects = [] as Project[];
    let collaborations = [] as Project[];

    // Iterate over the project and start loading them
    for (const project of await this.userData.projects) {
      this.api.loadLazyLoadingObject(project);
      projects.push(this.api.EMPTY_PROJECT);
      projects[projects.length - 1]._loading = true;
    }
    // Iterate over the collaborations and start loading them
    for (const project of await this.userData.collaborations) {
      this.api.loadLazyLoadingObject(project);
      collaborations.push(this.api.EMPTY_PROJECT);
      collaborations[collaborations.length - 1]._loading = true;
    }
    this.projects = projects;
    this.collaborations = collaborations;

    let index = 0;
    for (const project of await this.userData.projects) {
      this.loadProject(project, index);
      index++;
    }
    index = 0;
    for (const project of await this.userData.collaborations) {
      this.loadCollaboration(project, index);
      index++;
    }

  },
  methods: {
    async loadProject(project: Project, index: number) {
      this.projects[index] = await this.api.loadLazyLoadingObject(project);
    },
    async loadCollaboration(project: Project, index: number) {
      this.collaborations[index] = await this.api.loadLazyLoadingObject(project);
    }
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
