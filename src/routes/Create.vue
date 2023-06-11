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
        ref="createForm"
        v-model="form"
        @submit.prevent="create"
      >
        <v-container fluid>
          <v-text-field
            v-model="name"
            prepend-inner-icon="mdi-pencil"
            :label="$t('create.name')"
            :rules="nameRules"
            clearable
          />

          <v-autocomplete
            v-model="language"
            :items="languages"
            :label="$t('create.language')"
            :rules="languageRules"
            clearable
            item-title="name"
            item-
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
            clearable
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Script } from '../types';

export default defineComponent({
  name: 'CreatePage',
  data() {
    return {
      name: '',
      language: 'python',
      isPublic: false,
      nameRules: [
        (v: string) => !!v || 'Name is required',
        (v: string) => (v && v.length <= 100) || 'Project name must be less than 100 characters'
      ],
      languageRules: [
        (v: string) => !!v || 'Language is required',
        (v: string) => ['python', 'micropython-khicas', 'xcas-python-pow', 'xcas-python-xor', 'xcas', 'xcas-session'].includes(v) || 'Language must be one of the following: python, micropython-khicas, xcas-python-pow, xcas-python-xor, xcas, xcas-session'
      ],
      languages: [
        { name: "python", icon: import.meta.env.BASE_URL + "assets/python.svg" },
        { name: "xcas", icon: import.meta.env.BASE_URL + "assets/xcas.svg" },
      ],
      loading: false,
      form: false,
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
    }
  },
  methods: {
    async create() {
      this.loading = true
      const { valid } = await this.$refs.createForm.validate()

      if (!valid) {
        this.loading = false
        return
      }

      // Generate a pythonic name
      // Uppercase and lowercase letters, numbers not at the start, and underscores are allowed
      let filename = this.name.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^[^a-zA-Z]/g, '_') + '.py'

      // Create empty project
      const project: Project = {
        title: this.name,
        language: this.language,
        files: [
          {
            title: filename,
            content: '',
          }
        ] as Script[],
        short_description: '',
        isPublic: this.isPublic,
        // Everything else is set to avoid type errors and is not used
        rating: 0,
        author: '',
        uuid: '',
        created: new Date(),
        modified: new Date(),
        tags: [],
        views: 0,
        version: "1.0.0",

        _loaded: false,
        _loading: false,
      }
      try {
        let id = await this.api.createProject(project)
        this.globalStore.success = "snackbar.success.project-created.message"
        this.$router.push({ name: 'view', params: { uuid: id } })
      } catch (e) {
        console.error(e)
        this.globalStore.error = true
      }

      this.loading = false
    },
  }
});
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
