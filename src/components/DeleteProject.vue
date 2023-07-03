<template>
  <v-dialog
    v-if="hasWriteAccess()"
    v-model="dialog"
    max-width="290"
  >
    <template #activator="{ props }">
      <span
        v-bind="props"
      >
        <slot />
      </span>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('viewer.delete-project.title') }}
      </v-card-title>

      <v-card-text>
        {{ $t('viewer.delete-project.message', { name: project.title }) }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="dialog = false">
          {{ $t('viewer.delete-project.cancel') }}
        </v-btn>
        <br>

        <v-btn
          color="error"
          @click="deleteFromAPI"
        >
          {{ $t('viewer.delete-project.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { Project } from '../types';

export default defineComponent({
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true
    }
  },
  data() {
    return {
      globalStore: useGlobalStore(),
      apiStore: useAPIStore(),
      api: useAPIStore().api,
      dialog: false,
    };
  },
  methods: {
    async deleteFromAPI() {
      this.globalStore.progress = true;
      try {
        await this.api.deleteProject(this.project);
        this.$router.push('/');
        this.globalStore.success = "snackbar.success.project-deleted.message";
      } catch (e) {
        // TODO: Handle not logged in error
        this.globalStore.error = true;
        console.error(e);
      }
      this.globalStore.progress = false;
    },
    hasWriteAccess(): boolean {
      // Get if the user is the owner of the project
      if (this.project.author === this.apiStore.username && this.apiStore.username !== '') {
        return true;
      }
      return false;
    },
  },
});
</script>

<style scoped></style>
