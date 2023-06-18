<template>
  <v-dialog v-model="dialog">
    <template #activator="{ props }">
      <div v-bind="props">
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
          <template #item="{ props, item }">
            <v-list-item
              v-bind="props"
              :prepend-avatar="item.raw.icon"
              :title="item.title"
            />
          </template>
        </v-autocomplete>
        <SelectCollaborators v-model="collaborators" />
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

<script lang="ts">
import { defineComponent } from 'vue';
import cloneDeep from 'lodash/cloneDeep';
import { Project } from '../types';
import SelectCollaborators from './SelectCollaborators.vue';

export default defineComponent({
  name: 'EditProjectDialog',
  components: {
    SelectCollaborators,
  },
  props: {
    project: {
      type: Object as () => Project,
      required: true,
    },
  },
  emits: ['update-metadata'],
  data() {
    return {
      dialog: false,
      titleRules: [
        (v: string) => !!v || this.$t('editor.edit-project-info-dialog.rules.project-title.required'),
        (v: string) => (v && v.length <= 100) || this.$t('editor.edit-project-info-dialog.rules.project-title.length')
      ],
      languageRules: [
        (v: string) => !!v || this.$t('editor.edit-project-info-dialog.rules.language.required'),
        (v: string) => ['python', 'micropython-khicas', 'xcas-python-pow', 'xcas-python-xor', 'xcas', 'xcas-session'].includes(v) || this.$t('editor.edit-project-info-dialog.rules.language.invalid')
      ],
      languages: [
        { name: "python", icon: import.meta.env.BASE_URL + "assets/python.svg" },
        { name: "xcas", icon: import.meta.env.BASE_URL + "assets/xcas.svg" },
      ],
      shortDescriptionRules: [
        // TODO: Allow empty short description
        (v: string) => !!v || this.$t('editor.edit-project-info-dialog.rules.short-description.required'),
        (v: string) => (v && v.length <= 100) || this.$t('editor.edit-project-info-dialog.rules.short-description.length')
      ],
      versionRules: [
        // TODO: Require version
        (v: string) => (v && v.length <= 100) || this.$t('editor.edit-project-info-dialog.rules.version.length')
      ],
      longDescriptionRules: [
        // TODO: Allow empty long description
        (v: string) => (v && v.length <= 10000) || this.$t('editor.edit-project-info-dialog.rules.long-description.length')
      ],
      title: '',
      version: '',
      language: '',
      shortDescription: '',
      longDescription: '',
      collaborators: [] as string[],
      isPublic: false,
    };
  },
  watch: {
    project: {
      immediate: true,
      deep: true,
      handler() {
        this.title = this.project.title;
        this.version = this.project.version;
        this.language = this.project.language;
        this.shortDescription = this.project.short_description;
        this.longDescription = this.project.long_description;
        this.isPublic = this.project.isPublic;
        this.collaborators = this.project.collaborators;
      },
    },
  },
  methods: {
    save() {
      // Make a copy of the project
      const project = cloneDeep(this.project);
      // Update the project
      project.title = this.title;
      project.version = this.version;
      project.language = this.language;
      project.short_description = this.shortDescription;
      project.long_description = this.longDescription;
      project.isPublic = this.isPublic;
      project.collaborators = this.collaborators;
      // Emit the updated project
      this.$emit('update-metadata', project);
      // Close the dialog
      this.dialog = false;
    },
  },
});
</script>
4q
<style scoped></style>
