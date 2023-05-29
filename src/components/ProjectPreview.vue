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
          <!-- <v-img
                class="rounded-lg"
                elevation="4"
                :aspect-ratio="320 / 240"
                width="260"
                src="/assets/screenshot.png"
                style="z-index: -1"
            /> -->
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
            <v-card-subtitle v-if="project.description">
              <v-icon small>
                mdi-image-text
              </v-icon>
              {{ project.description }}
            </v-card-subtitle>
            <v-card-actions>
              <v-rating
                v-model="project.rating"
                length="5"
              />
            </v-card-actions>
          </div>
        </div>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Project } from '../types';
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
  }
});
</script>

<style scoped>
.project-preview {
  min-width: 272px;
}
</style>
