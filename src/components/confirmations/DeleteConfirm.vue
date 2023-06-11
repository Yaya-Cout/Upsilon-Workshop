<template>
  <v-dialog
    v-model="dialog"
    max-width="350"
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>
    <v-card>
      <v-card-title class="headline">
        Delete {{ project.files[scriptIndex].title }}
      </v-card-title>

      <v-card-text>
        Are you sure you want to delete {{ project.files[scriptIndex].title }}?

        <v-card-actions>
          <v-spacer />

          <v-btn
            @click="dialog = false"
          >
            Cancel
          </v-btn>

          <v-btn
            color="error"
            @click="deleteScript"
          >
            OK
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';
import { Project } from '../../types';

export default defineComponent({
  name: 'DeleteConfirm',
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
    scriptIndex: {
      type: Number,
      required: true,
    },
  },
  data() {
    return {
      dialog: false,
      globalStore: useGlobalStore(),
    };
  },
  methods: {
    deleteScript() {
      this.project.files.splice(this.scriptIndex, 1);
      this.dialog = false;
      this.globalStore.success = "snackbar.success.script-deleted.message";
    },
  },
});
</script>

<style scoped></style>
