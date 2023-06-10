<template>
  <div id="summary-component">
    <v-card class="mx-auto px-6 py-8">
      <v-card-item>
        <v-card-title>
          <h1 class="text-center">
            {{ project.title }}
          </h1>
        </v-card-title>
        <v-card-subtitle>
          <h2 class="text-center">
            {{ project.description }}
          </h2>
        </v-card-subtitle>
        <v-row>
          <v-col>
            <v-list-item
              :title="project.author"
              :to="`/user/${project.author}`"
            >
              <template #prepend>
                <AvatarView :username="project.author" />
              </template>
            </v-list-item>
          </v-col>
          <v-col>
            <v-list-item
              density="compact"
              prepend-icon="mdi-calendar-range"
            >
              <v-list-item-subtitle>{{ dateToDayString(project.created) }}</v-list-item-subtitle>
            </v-list-item>
            <v-list-item
              density="compact"
              prepend-icon="mdi-calendar-edit"
            >
              <v-list-item-subtitle>{{ dateToDayString(project.modified) }}</v-list-item-subtitle>
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
          Edit
        </v-btn>
        <UploadProject
          :project="project"
          class="mr-2"
        >
          <v-btn variant="outlined">
            Upload to calculator
          </v-btn>
        </UploadProject>
        <DeleteProject
          :project="project"
          class="mr-2"
        >
          <v-btn variant="outlined">
            Delete
          </v-btn>
        </DeleteProject>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Project } from '../../types';
import AvatarView from '../AvatarView.vue';
import UploadProject from '../UploadProject.vue';
import DeleteProject from '../DeleteProject.vue';

export default defineComponent({
  name: "SummaryViewer",
  components: {
    AvatarView,
    UploadProject,
    DeleteProject,
  },
  props: {
    project: {
      type: Object as () => Project,
      required: true,
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
  },
});
</script>

<style scoped></style>
