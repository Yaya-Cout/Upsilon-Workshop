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

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { Project } from '../types';
const { t: $t } = useI18n();

const emits = defineEmits(['add']);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const dialog = ref(false);
const name = ref('');
const filenameRules = ref([
  // Script must have a name
  (v: string) => (v && v.length > 0) || $t('editor.change-script.name-required'),
  // Script must have an extension
  (v: string) => (v && v.includes('.')) || $t('editor.change-script.extension-required'),
  // Script must be unique
  (v: string) => {
    const existing = props.project.files.find(f => f.title === v);
    return !existing || $t('editor.change-script.name-taken');
  },
  // Script must not start with a number
  (v: string) => (v && isNaN(parseInt(v[0], 10))) || $t('editor.change-script.name-starts-with-number'),
  // Script can only contain letters, numbers and underscores (excluding extension)
  (v: string) => {
    const name = v.split('.')[0];
    return (name && /^[a-zA-Z0-9_]+$/.test(name)) || $t('editor.change-script.name-invalid');
  },
  (v: string) => {
    const name = v.split('.')[1];
    return (name && /^[a-zA-Z0-9]+$/.test(name)) || $t('editor.change-script.extension-invalid');
  }
]);

const add = () => {
  dialog.value = false;
  // TODO: Check if name is valid
  emits('add', name.value)
};
</script>

<style scoped></style>
