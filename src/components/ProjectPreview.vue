<template>
  <!-- We use a div to avoid the v-card being a direct child of the v-row and
        being affected by other v-cards in the same row -->
  <div class="mb-2">
    <v-card
      class="ma-2 rounded-lg project-preview full-height"
      elevation="4"
      :to="'/view/' + project.uuid"
    >
      <v-skeleton-loader
        :loading="!project._loaded"
        type="article"
        class="full-height"
      >
        <div class="flex justify-between project-preview full-height">
          <div class="full-height">
            <v-card-title
              class="pb-0"
            >
              <span
                v-if="!project.isPublic || project.isUnlisted"
                class="title title-with-icon"
              >
                {{ project.title }}
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ project.title }}
                </v-tooltip>
              </span>
              <span
                v-else
                class="title"
              >
                {{ project.title }}
                <v-tooltip
                  activator="parent"
                  location="top"
                >
                  {{ project.title }}
                </v-tooltip>
              </span>
              <!-- TODO: Improve the lock icon -->
              <span
                v-if="!project.isPublic"
                class="icon"
              >
                <v-icon
                  :id="'icon-private-' + localId"
                  small
                >
                  mdi-lock
                </v-icon>
                <v-tooltip
                  :activator="'#icon-private-' + localId"
                  location="top"
                >
                  {{ $t('project-preview.private') }}
                </v-tooltip>
              </span>
              <span
                v-else-if="project.isUnlisted"
                class="icon"
              >
                <v-icon
                  :id="'icon-unlisted-' + localId"
                  small
                >
                  mdi-file-hidden
                </v-icon>
                <v-tooltip
                  :activator="'#icon-unlisted-' + localId"
                  location="top"
                >
                  {{ $t('project-preview.unlisted') }}
                </v-tooltip>
              </span>
            </v-card-title>
            <v-card-text class="py-0">
              <v-icon small>
                mdi-account
              </v-icon>
              {{ project.author }}
            </v-card-text>
            <v-card-subtitle v-if="project.short_description">
              <v-icon small>
                mdi-image-text
              </v-icon>
              {{ project.short_description }}
              <v-tooltip
                activator="parent"
              >
                {{ project.short_description }}
              </v-tooltip>
            </v-card-subtitle>
            <v-card-subtitle>
              <v-icon small>
                mdi-content-save
              </v-icon>
              <SizeView
                :project="project"
                class="size-view"
              />
            </v-card-subtitle>
            <v-card-item>
              <v-chip
                v-for="tag in tagsNames"
                :key="tag"
                class="mx-1 my-1"
              >
                {{ tag.replace(/%20/g,' ') }}
              </v-chip>
            </v-card-item>
          </div>
        </div>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script lang="ts">
var id: number = 0;
</script>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { Project } from '../types';
import SizeView from './viewer/SizeView.vue';

const tagsNames = ref(["test"] as string[]);
const localId = ref(0);

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true
  }
});

onMounted(() => {
  localId.value = id;
  id++;
});

watch(props.project, async (project: Project) => {
  let NewTagsNames: string[] = [];
  for (const tag of project.tags) {
    NewTagsNames.push(await tag.name);
  }
  tagsNames.value = NewTagsNames;
}, { immediate: true });
</script>

<style scoped>
.project-preview {
  min-width: 300px;
  max-width: 0px;
}

.full-height {
  height: 100%;
}

.size-view {
  margin-left: 0.25rem;
}

.title {
  max-width: 100%;
  display: inline-block;
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: middle;
}

.title-with-icon {
  max-width: calc(100% - 30px);
}

.icon {
  text-align: right;
}
</style>
