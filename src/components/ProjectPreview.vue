<template>
  <!-- We use a div to avoid the v-card being a direct child of the v-row and
        being affected by other v-cards in the same row -->
  <div>
    <v-card
      class="ma-2 rounded-lg project-preview"
      elevation="4"
      :to="'/view/' + project.uuid"
    >
      <v-skeleton-loader
        :loading="!project._loaded"
        type="article"
      >
        <div class="flex justify-between project-preview">
          <div class="elevation-10">
            <v-card-title
              class="pb-0"
            >
              {{ project.title }}
              <!-- TODO: Improve the lock icon -->
              <v-icon
                v-if="!project.isPublic"
                small
              >
                mdi-lock
              </v-icon>
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
            <v-card-item>
              <v-chip
                v-for="tag in tagsNames"
                :key="tag"
                class="mx-1"
              >
                {{ tag }}
              </v-chip>
            </v-card-item>
          </div>
        </div>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Project, Tag } from '../types';
import { useAPIStore } from '../stores/api';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

export default defineComponent({
  name: 'ProjectPreview',
  components: {
    VSkeletonLoader
  },
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true
    }
  },
  data() {
    return {
      api: useAPIStore().api,
      tagsNames: [] as string[],
    };
  },
  watch: {
    project: {
      immediate: true,
      async handler(project: Project) {
        for (const tag of project.tags) {
          this.tagsNames.push(await tag.name);
        }
      }
    }
  }
});
</script>

<style scoped>
.project-preview {
  width: 300px;
}
</style>
