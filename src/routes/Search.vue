<template>
  <div id="search-page">
    <h1 class="text-center">
      {{ $t('search.search') }}
    </h1>
    <v-sheet class="pa-4">
      <v-col class="v-col-xs-12 v-col-lg-8 v-col-xl-6 v-col-sm-10 offset-xs-0 offset-sm-1 offset-lg-2 offset-xl-3">
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
          <v-chip
            class="mx-1"
            variant="elevated"
          >
            All
          </v-chip>
          <v-chip class="mx-1">
            Solo games
          </v-chip>
          <v-chip class="mx-1">
            Multiplayer games
          </v-chip>
          <v-chip class="mx-1">
            Art
          </v-chip>
          <v-chip class="mx-1">
            Mathematics
          </v-chip>
          <v-chip class="mx-1">
            Other
          </v-chip>
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
import { Project } from '../types';
import ProjectPreview from '../components/ProjectPreview.vue';

export default defineComponent({
  name: "SearchPage",
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
    debouncedQuery: async function (newQuery: string) {
      this.globalStore.progress = true;
      // TODO: Pagination
      // TODO: No results
      this.projects = await this.api.getProjects(newQuery)
      if (this.projects.length === 0) {
        this.empty = true;
      } else {
        this.empty = false;
      }
      // If the query is the same as the one we just searched for, we can stop the loading animation
      if (this.debouncedQuery === this.query) {
        this.globalStore.progress = false;
      }
    }
  },
  async mounted() {
    this.loadMore();
  },
  methods: {
    async loadMore() {
      this.globalStore.progress = true;
      let page = this.projects.length / this.api.ITEM_PER_PAGE + 1;
      // If page is not an integer, we have reached the end of the list
      if (!Number.isInteger(page)) {
        this.globalStore.progress = false;
        this.empty = true;
        return;
      }
      // Else round it down
      page = Math.floor(page);
      let newProjects: Project[];
      try {
        newProjects = await this.api.getProjects(this.query, page);
      } catch (e) {
        this.globalStore.progress = false;
        this.globalStore.error = true;
        console.error(e);
        return;
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
