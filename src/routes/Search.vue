<template>
  <div id="search-page">
    <h1 class="text-center">
      Search
    </h1>
    <v-sheet class="pa-4">
      <v-col
        class="v-col-xs-12 v-col-lg-8 v-col-xl-6 v-col-sm-10 offset-xs-0 offset-sm-1 offset-lg-2 offset-xl-3"
      >
        <v-text-field
          v-model="query"
          variant="solo"
          class="mx-2"
          hide-details
          single-line
          density="compact"
          :label="$t('navbar.search')"
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
            v-for="project in projects.slice(0,50)"
            :key="project.uuid"
            :project="project"
          />
        </v-row>
      </v-col>
    </v-sheet>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';
import { Project } from '../types';
import ProjectPreview from '../components/ProjectPreview.vue';

export default defineComponent({
    name: "SearchPage",
    components: { ProjectPreview },
    data() {
        return {
            projects: [] as Project[],
            api: useAPIStore().api,
            timeout: null as any,
            debouncedQuery: '' as string
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
            this.projects = await this.api.getProjects(newQuery)
        }
    },
    async mounted(){
        this.projects = await this.api.getProjects()
    }
});
</script>
