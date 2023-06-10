<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('editor.change-script.title') }}
      </v-card-title>

      <v-card-text>Enter the new name for the script:</v-card-text>

      <v-card-text>
        <v-text-field
          v-model="newName"
          :label="$t('editor.change-script.new-name')"
          outlined
        />
      </v-card-text>

      <v-card-actions>
        <DeleteConfirm
          :project="project"
          :script-index="scriptIndex"
        >
          <v-btn
            color="error"
          >
            {{ $t('editor.change-script.delete') }}
          </v-btn>
        </DeleteConfirm>

        <v-spacer />

        <v-btn
          @click="dialog = false"
        >
          {{ $t('editor.change-script.cancel') }}
        </v-btn>

        <v-btn
          @click="rename"
        >
          {{ $t('editor.change-script.rename') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import DeleteConfirm from './confirmations/DeleteConfirm.vue';
import { Project } from '../types';

export default defineComponent({
  name: 'ChangeScript',
  components: {
    DeleteConfirm,
  },
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
      newName: '',
    };
  },
  watch: {
    script: {
      immediate: true,
      handler() {
        this.newName = this.project.files[this.scriptIndex].title;
      },
    },
  },
  methods: {
    rename() {
      // TODO: Use an event instead of mutating the prop
      this.project.files[this.scriptIndex].title = this.newName;
      this.dialog = false;
    },
  },
});
</script>
4q
<style scoped></style>
