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
  data() {
    return {
      dialog: false,
      name: '',
    };
  },
  methods: {
    add() {
      this.project.files.push({
        title: this.name,
        content: '',
      });
      this.dialog = false;
    },
  },
});
</script>
4q
<style scoped></style>
