<template>
  <v-dialog
    v-model="dialog"
    max-width="340"
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
          :rules="filenameRules"
          outlined
        />
      </v-card-text>

      <v-card-actions>
        <DeleteConfirm
          v-bind="$attrs"
          :script-name="project.files[scriptIndex].title"
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
  inheritAttrs: false,
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
  emits: ['rename'],
  data() {
    return {
      dialog: false,
      newName: '',
      filenameRules: [
        // Script must have a name
        (v: string) => (v && v.length > 0) || this.$t('editor.change-script.name-required'),
        // Script must have an extension
        (v: string) => (v && v.includes('.')) || this.$t('editor.change-script.extension-required'),
        // Script must be unique
        (v: string) => {
          const existing = this.project.files.find(f => f.title === v);
          return !existing || this.$t('editor.change-script.name-taken');
        },
        // Script must not start with a number
        (v: string) => (v && isNaN(parseInt(v[0], 10))) || this.$t('editor.change-script.name-starts-with-number'),
        // Script can only contain letters, numbers and underscores (excluding extension)
        (v: string) => {
          const name = v.split('.')[0];
          return (name && /^[a-zA-Z0-9_]+$/.test(name)) || this.$t('editor.change-script.name-invalid');
        },
        (v: string) => {
          const name = v.split('.')[1];
          return (name && /^[a-zA-Z0-9]+$/.test(name)) || this.$t('editor.change-script.extension-invalid');
        }
      ],
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
      // this.project.files[this.scriptIndex].title = this.newName;
      this.$emit('rename', this.newName);
      this.dialog = false;
    },
  }
});
</script>

<style scoped></style>
