<template>
  <div id="create-page">
    <v-card
      class="mx-auto px-6 py-8"
      width="500"
    >
      <h1 class="text-center">
        {{ $t('create.title') }}
      </h1>

      <v-form
        ref="formObject"
        v-model="form"
        @submit.prevent="create"
      >
        <v-container fluid>
          <v-text-field
            v-model="name"
            prepend-inner-icon="mdi-pencil"
            :label="$t('create.name')"
            :rules="nameRules"
            counter="100"
            clearable
          />

          <v-autocomplete
            v-model="language"
            :items="languages"
            :label="$t('create.language')"
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

          <v-switch
            v-model="isPublic"
            :label="$t('create.is-public')"
          />

          <v-btn
            :loading="loading"
            :disabled="!form || loading"
            type="submit"
            block
            class="mt-2"
            variant="elevated"
            width="0%"
            color="primary"
            size="x-large"
          >
            {{ $t('create.create') }}
          </v-btn>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Script } from '../types';
import { VForm } from 'vuetify/components/VForm';
const { t: $t } = useI18n();

const name = ref('');
const language = ref('python');
const isPublic = ref(false);
const loading = ref(false);
const form = ref(false);
const formObject = ref<InstanceType<typeof VForm> | null>(null);

const $router = useRouter();
const api = useAPIStore().api;
const globalStore = useGlobalStore();
const nameRules = [
  (v: string) => !!v || $t('create.rules.name.required'),
  (v: string) => (v && v.length <= 100) || $t('create.rules.name.length'),
];
const languageRules = [
  (v: string) => !!v ||$t('create.rules.language.required'),
  (v: string) => ['python', 'micropython-khicas', 'xcas-python-pow', 'xcas-python-xor', 'xcas', 'xcas-session'].includes(v) || $t('create.rules.language.invalid'),
];
const languages = [
  { name: "python", icon: import.meta.env.BASE_URL + "assets/python.svg" },
  { name: "xcas", icon: import.meta.env.BASE_URL + "assets/xcas.svg" },
];

const create = async () => {
  loading.value = true;
  if (!formObject.value) {
    loading.value = false;
    console.error('Form object not found');
    return;
  }
  const { valid } = await formObject.value.validate();

  if (!valid) {
    loading.value = false;
    return;
  }

  // Generate a pythonic name
  // Uppercase and lowercase letters, numbers not at the start, and underscores are allowed
  let filename = name.value.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[^a-zA-Z]/g, '_') + '.py';

  // Create empty project
  const project: Project = {
    title: name.value,
    language: language.value,
    files: [
      {
        title: filename,
        content: '',
      }
    ] as Script[],
    short_description: '',
    long_description: '',
    isPublic: isPublic.value,
    // Everything else is set to avoid type errors and is not used
    rating: 0,
    author: '',
    uuid: '',
    created: new Date(),
    modified: new Date(),
    tags: [],
    tags_raw: [],
    views: 0,
    version: "1.0.0",
    collaborators: [],

    _loaded: false,
    _loading: false,
  };
  try {
    let id = await api.createProject(project);
    globalStore.success = "snackbar.success.project-created.message";
    $router.push({ name: 'view', params: { uuid: id } });
  } catch (e) {
    console.error(e);
    globalStore.error = true;
  }

  loading.value = false;
};
</script>

<style>
#create-page {
  display: flex;
  vertical-align: middle;
  height: 100%;
}

#create-page>div {
  margin: auto;
}
</style>
