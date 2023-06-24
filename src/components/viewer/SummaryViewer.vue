<template>
  <div id="summary-component">
    <v-card class="mx-auto px-6 py-8 mt-2 mb-2">
      <v-card-item>
        <v-card-title>
          <h1 class="text-center mb-2">
            {{ project.title }}
          </h1>
        </v-card-title>
        <v-card-subtitle>
          <h2 class="text-center mb-2">
            {{ project.short_description }}
          </h2>
        </v-card-subtitle>
        <v-row class="mt-2">
          <v-col>
            <v-list>
              <v-list-subheader inset>
                {{ $t('viewer.author') }}
              </v-list-subheader>
              <UserPreview
                :username="project.author"
                class="mr-2"
              />
              <v-divider inset />
              <v-list-subheader
                v-if="collaborators.length > 0"
                inset
              >
                {{ $t('viewer.collaborators') }}
              </v-list-subheader>
              <UserPreview
                v-for="collaborator in collaborators"
                :key="collaborator.username"
                :username="collaborator.username"
                class="mr-2"
              />
            </v-list>
          </v-col>
          <v-col>
            <v-list-item
              density="compact"
              prepend-icon="mdi-calendar-range"
            >
              <v-list-item-subtitle class="fit-content">
                {{ dateToDayString(project.created) }}
                <v-tooltip activator="parent">
                  {{ $t('viewer.created-on', { date: dateToExtendedString(project.created) }) }}
                </v-tooltip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              density="compact"
              prepend-icon="mdi-calendar-edit"
            >
              <v-list-item-subtitle class="fit-content">
                {{ dateToDayString(project.modified) }}
                <v-tooltip activator="parent">
                  {{ $t('viewer.modified-on', { date: dateToExtendedString(project.modified) }) }}
                </v-tooltip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              density="compact"
              prepend-icon="mdi-eye"
            >
              <v-list-item-subtitle class="fit-content">
                {{ project.views }}
                <v-tooltip activator="parent">
                  {{ $t('viewer.views', { count: project.views }) }}
                </v-tooltip>
              </v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              density="compact"
              prepend-icon="mdi-update"
            >
              <v-list-item-subtitle class="fit-content">
                {{ project.version }}
                <v-tooltip activator="parent">
                  {{ $t('viewer.version', { version: project.version }) }}
                </v-tooltip>
              </v-list-item-subtitle>
            </v-list-item>
          </v-col>
        </v-row>
      </v-card-item>
      <v-card-actions>
        <v-btn
          :to="'/edit/' + project.uuid"
          variant="outlined"
          class="mr-2"
        >
          {{ $t('viewer.edit') }}
        </v-btn>
        <UploadProject
          :project="project"
          class="mr-2"
        >
          <v-btn variant="outlined">
            {{ $t('viewer.upload') }}
          </v-btn>
        </UploadProject>
        <DeleteProject
          :project="project"
          class="mr-2"
        >
          <v-btn variant="outlined">
            {{ $t('viewer.delete') }}
          </v-btn>
        </DeleteProject>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Project, User } from '../../types';
import { useAPIStore } from '../../stores/api';
import UserPreview from '../UserPreview.vue';
import UploadProject from '../UploadProject.vue';
import DeleteProject from '../DeleteProject.vue';

export default defineComponent({
  name: "SummaryViewer",
  components: {
    UserPreview,
    UploadProject,
    DeleteProject,
  },
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  data() {
    return {
      api: useAPIStore().api,
      collaborators: [] as User[],
    };
  },
  watch: {
    project: {
      immediate: true,
      async handler() {
        let collaborators = [] as Promise<User>[];

        for (const collaborator of this.project.collaborators) {
          collaborators.push(this.api.loadLazyLoadingObject(this.api.getUser(collaborator)));
        }

        let collaborators_loaded = await Promise.all(collaborators);

        this.collaborators = collaborators_loaded;
      },
    },
  },
  methods: {
    dateToDayString(date: Date) {
      // Return a string in the format the local date (DD/MM/YYYY or MM/DD/YYYY)
      if (this.$i18n.locale === 'fr') {
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        return `${day}/${month}/${date.getFullYear()}`;
      }
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      return `${month}/${day}/${date.getFullYear()}`;
    },
    dateToExtendedString(date: Date) {
      // Return a string in the format the local date (DD/MM/YYYY HH:MM:SS or MM/DD/YYYY HH:MM:SS PM/AM)
      if (this.$i18n.locale === 'fr') {
        const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
        const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
        const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
        const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
        const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
        return `${day}/${month}/${date.getFullYear()} ${hours}:${minutes}:${seconds}`;
      }
      const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
      const hours = date.getHours() % 12 === 0 ? 12 : date.getHours() % 12;
      const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
      const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
      const ampm = date.getHours() < 12 ? 'AM' : 'PM';
      return `${month}/${day}/${date.getFullYear()} ${hours}:${minutes}:${seconds} ${ampm}`;
    },
  },
});
</script>

<style scoped>
.fit-content {
  width: fit-content;
}
</style>
