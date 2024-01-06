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

        <v-row class="mx-2 my-0 full-width">
          <ProjectPreview
            v-for="project in projects"
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

<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';
import { Project, Tag } from '../types';
import ProjectPreview from '../components/ProjectPreview.vue';

const projects = ref([] as Project[]);
// TODO: Find the correct type
const timeout = ref(null as any);
const debouncedQuery = ref('');
const empty = ref(true);
const tags = ref([] as Tag[]);
const activeTags = ref([] as Tag[]);

const api = useAPIStore().api;
const globalStore = useGlobalStore();

const query = computed({
  get() {
    return debouncedQuery.value;
  },
  set(value: string) {
    clearTimeout(timeout.value);
    timeout.value = setTimeout(() => {
      debouncedQuery.value = value;
    }, 500);
  }
});

watch(debouncedQuery, async function () {
  await loadMore(true);
});

onMounted(async () => {
  await loadMore();
  await loadTags();
});

const loadMore = async (clear: boolean = false) => {
  globalStore.progress = true;
  let page = projects.value.length / api.ITEM_PER_PAGE + 1;
  // If clear is true, we want to reset the page to 1
  if (clear === true) {
    page = 1;
  }
  // If page is not an integer, we have reached the end of the list
  else if (!Number.isInteger(page)) {
    globalStore.progress = false;
    empty.value = true;
    return;
  }
  // Else round it down
  let newProjects: Project[];
  try {
    newProjects = await api.getProjects(debouncedQuery.value, page, activeTags.value);
  } catch (e) {
    globalStore.progress = false;
    globalStore.error = true;
    console.error(e);
    return;
  }

  if (clear === true) {
    projects.value = [];
  }

  // If newProjects is empty, we have reached the end of the list
  if (newProjects.length === 0) {
    globalStore.progress = false;
    empty.value = true;
    return;
  }

  projects.value = projects.value.concat(newProjects);
  // If there is less projects than the number of items per page, we have reached the end of the list
  if (newProjects.length < api.ITEM_PER_PAGE) {
    empty.value = true;
  } else {
    empty.value = false;
  }
  // TODO: Read if empty from API
  globalStore.progress = false;
};

const loadTags = async () => {
  try {
    tags.value = await api.getTags();
  } catch (e) {
    globalStore.progress = false;
    globalStore.error = true;
    console.error(e);
    return;
  }
};

const toogleTag = (tag: Tag) => {
  if (activeTags.value.includes(tag)) {
    activeTags.value = activeTags.value.filter(t => t !== tag);
  } else {
    // Because of a bug in the API, we need to clear the active tags before adding a new one
    activeTags.value = [tag];
    // activeTags.value.push(tag);
  }
  loadMore(true);
};
</script>

<style scoped>
.center {
  display: block;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.full-width {
  width: 100%;
}
</style>
