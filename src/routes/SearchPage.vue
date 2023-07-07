<template>
  <div id="search-page">
    <h1 class="text-center">
      {{ $t('search.search') }}
    </h1>
    <v-sheet class="pa-4">
      <v-col>
        <v-text-field
          v-model="query"
          variant="solo"
          class="mx-2"
          hide-details
          single-line
          density="compact"
          :label="$t('search.search')"
        />
        <v-row class="my-4 d-flex justify-center">
          <!-- TODO: Add skeleton loader -->
          <v-chip
            v-for="tag in tags"
            :key="tag.name"
            class="mx-1"
            :variant="activeTags.includes(tag) ? 'elevated' : 'tonal'"
            @click="toogleTag(tag)"
          >
            {{ tag.name }}
          </v-chip>
          <!-- TODO: Add menu to select and search tags -->
        </v-row>

        <v-row>
          <ProjectPreview
            v-for="project in projects.slice(0, 50)"
            :key="project.uuid"
            :project="project"
          />
        </v-row>
      </v-col>
      <v-btn
        v-if="empty === false"
        class="mx-auto center"
        variant="outlined"
        @click="loadMore"
      >
        {{ $t('search.load-more') }}
      </v-btn>
      <p
        v-else
        class="center"
      >
        {{ $t('search.no-results') }}
      </p>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Tag } from '../types';
import ProjectPreview from '../components/ProjectPreview.vue';

export default defineComponent({
  components: {
    ProjectPreview,
  },
  data() {
    return {
      projects: [] as Project[],
      api: useAPIStore().api,
      globalStore: useGlobalStore(),
      timeout: null as any,
      debouncedQuery: '' as string,
      empty: true,
      tags: [] as Tag[],
      activeTags: [] as Tag[],
    }
  },
  computed: {
    query: {
      get() {
        return this.debouncedQuery;
      },
      set(value: string) {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
          this.debouncedQuery = value;
        }, 500);
      }
    }
  },
  watch: {
    debouncedQuery: async function () {
      this.loadMore(true);
    }
  },
  async mounted() {
    this.loadMore();
    this.loadTags();
  },
  methods: {
    async loadMore(clear: boolean = false) {
      this.globalStore.progress = true;
      let page = this.projects.length / this.api.ITEM_PER_PAGE + 1;
      // If clear is true, we want to reset the page to 1
      if (clear === true) {
        page = 1;
      }
      // If page is not an integer, we have reached the end of the list
      else if (!Number.isInteger(page)) {
        this.globalStore.progress = false;
        this.empty = true;
        return;
      }
      // Else round it down
      let newProjects: Project[];
      try {
        newProjects = await this.api.getProjects(this.debouncedQuery, page, this.activeTags);
      } catch (e) {
        this.globalStore.progress = false;
        this.globalStore.error = true;
        console.error(e);
        return;
      }

      if (clear === true) {
        this.projects = [];
      }

      // If newProjects is empty, we have reached the end of the list
      if (newProjects.length === 0) {
        this.globalStore.progress = false;
        this.empty = true;
        return;
      }

      this.projects = this.projects.concat(newProjects);
      // If there is less projects than the number of items per page, we have reached the end of the list
      if (newProjects.length < this.api.ITEM_PER_PAGE) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      // TODO: Read if empty from API
      this.globalStore.progress = false;
    },
    async loadTags() {
      try {
        this.tags = await this.api.getTags();
      } catch (e) {
        this.globalStore.progress = false;
        this.globalStore.error = true;
        console.error(e);
        return;
      }
    },
    toogleTag(tag: Tag) {
      if (this.activeTags.includes(tag)) {
        this.activeTags = this.activeTags.filter(t => t !== tag);
      } else {
        this.activeTags.push(tag);
      }
      this.loadMore(true);
    }
  }
});
</script>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}
</style>
