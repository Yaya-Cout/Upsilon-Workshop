<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <template #activator="{ props }">
      <span v-bind="props">
        <slot />
      </span>
    </template>
    <v-card>
      <v-card-title class="headline">
        Delete Project
      </v-card-title>

      <v-card-text>Are you sure you want to delete this project? ({{ project.title }})</v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          @click="dialog = false"
        >
          Cancel
        </v-btn>
        <br>

        <v-btn
          color="error"
          @click="deleteFromAPI"
        >
          OK
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
            } catch (e) {
                this.globalStore.error = true;
                console.error(e);
            }
            this.globalStore.progress = false;
            this.globalStore.projectDeleted = true;
        },
    },
});
</script>

<style scoped></style>
