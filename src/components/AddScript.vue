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
        {{ $t('editor.add-script.title') }}
      </v-card-title>

      <v-card-text>{{ $t('editor.add-script.enter-name') }}</v-card-text>

      <v-card-text>
        <v-text-field
          v-model="name"
          :label="$t('editor.add-script.name')"
          :rules="filenameRules"
          outlined
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="dialog = false">
          {{ $t('editor.add-script.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          @click="add"
        >
          {{ $t('editor.add-script.add') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Project } from '../types';

export default defineComponent({
  name: 'AddScript',
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  emits: ['add'],
  data() {
    return {
      dialog: false,
      name: '',
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
  methods: {
    add() {
      this.dialog = false;
      this.$emit('add', this.name);
    },
  },
});
</script>
4q
<style scoped></style>
