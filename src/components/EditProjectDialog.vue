<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props: attrs }">
      <div v-bind="attrs">
        <slot />
      </div>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('editor.edit-project-info-dialog.title') }}
      </v-card-title>

      <v-card-text>{{ $t('editor.edit-project-info-dialog.description') }}</v-card-text>

      <v-card-text>
        <v-text-field
          v-model="title"
          :label="$t('editor.edit-project-info-dialog.project-title')"
          :rules="titleRules"
          outlined
          counter="100"
        />
        <v-text-field
          v-model="version"
          :label="$t('editor.edit-project-info-dialog.project-version')"
          :rules="versionRules"
          outlined
          counter="100"
        />
        <v-autocomplete
          v-model="language"
          :items="languages"
          :label="$t('editor.edit-project-info-dialog.language')"
          :rules="languageRules"
          item-title="name"
        >
          <template #prepend-inner>
            <img
              :src="languages.find(l => l.name === language)?.icon"
              height="24"
            >
          </template>
          <template #item="{ props: attrs, item }">
            <v-list-item
              v-bind="attrs"
              :prepend-avatar="item.raw.icon"
              :title="item.title"
            />
          </template>
        </v-autocomplete>
        <SelectCollaborators v-model="collaborators" />
        <SelectTags v-model="tags" />
        <v-text-field
          v-model="shortDescription"
          :rules="shortDescriptionRules"
          :label="$t('editor.edit-project-info-dialog.short-description')"
          outlined
          counter="100"
        />
        <v-textarea
          v-model="longDescription"
          :label="$t('editor.edit-project-info-dialog.long-description')"
          :rules="longDescriptionRules"
          outlined
          counter="10000"
        />
        <v-switch
          v-model="isPublic"
          :label="$t('editor.edit-project-info-dialog.public')"
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="dialog = false">
          {{ $t('editor.edit-project-info-dialog.cancel') }}
        </v-btn>

        <v-btn
          color="primary"
          @click="save"
        >
          {{ $t('editor.edit-project-info-dialog.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import cloneDeep from 'lodash/cloneDeep';
import { Project } from '../types';
import SelectCollaborators from './editor/SelectCollaborators.vue';
import SelectTags from './editor/SelectTags.vue';
const { t: $t } = useI18n();

// TODO: Use v-model for updating project metadata
const emits = defineEmits(['update-metadata']);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const titleRules = [
  (v: string) => !!v || $t('editor.edit-project-info-dialog.rules.project-title.required'),
  (v: string) => (v && v.length <= 100) || $t('editor.edit-project-info-dialog.rules.project-title.length')
];
const languageRules = [
  (v: string) => !!v || $t('editor.edit-project-info-dialog.rules.language.required'),
  (v: string) => ['python', 'micropython-khicas', 'xcas-python-pow', 'xcas-python-xor', 'xcas', 'xcas-session'].includes(v) || $t('editor.edit-project-info-dialog.rules.language.invalid')
];
const languages = [
  { name: "python", icon: import.meta.env.BASE_URL + "assets/python.svg" },
  { name: "xcas", icon: import.meta.env.BASE_URL + "assets/xcas.svg" },
];
const shortDescriptionRules = [
  // TODO: Allow empty short description
  (v: string) => !!v || $t('editor.edit-project-info-dialog.rules.short-description.required'),
  (v: string) => (v && v.length <= 100) || $t('editor.edit-project-info-dialog.rules.short-description.length')
];

const versionRules = [
  // TODO: Require version
  (v: string) => (v && v.length <= 100) || $t('editor.edit-project-info-dialog.rules.version.length')
];

const longDescriptionRules = [
  // TODO: Allow empty long description
  (v: string) => (v && v.length <= 10000) || $t('editor.edit-project-info-dialog.rules.long-description.length')
];

const dialog = ref(false);
const title = ref('');
const version = ref('');
const language = ref('');
const shortDescription = ref('');
const longDescription = ref('');
const collaborators = ref([] as string[]);
const tags = ref([] as string[]);
const isPublic = ref(false);

watch(props.project, () => {
  title.value = props.project.title;
  version.value = props.project.version;
  language.value = props.project.language;
  shortDescription.value = props.project.short_description;
  longDescription.value = props.project.long_description;
  isPublic.value = props.project.isPublic;
  collaborators.value = props.project.collaborators;
  tags.value = props.project.tags_raw;
}, { immediate: true });

const save = () => {
  // Make a copy of the project
  const project = cloneDeep(props.project);
  // Update the project
  project.title = title.value;
  project.version = version.value;
  project.language = language.value;
  project.short_description = shortDescription.value;
  project.long_description = longDescription.value;
  project.isPublic = isPublic.value;
  project.collaborators = collaborators.value;
  project.tags_raw = tags.value;
  // Emit the updated project
  emits('update-metadata', project);
  // Close the dialog
  dialog.value = false;
};
</script>

<style scoped></style>
