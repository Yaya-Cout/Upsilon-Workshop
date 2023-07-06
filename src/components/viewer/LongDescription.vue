<template>
  <div
    v-if="project.long_description"
    id="summary-component"
  >
    <v-card class="mx-auto px-6 py-8 mt-2 mb-2">
      <v-card-item>
        <v-card-title>
          <h1 class="text-center mb-2">
            {{ $t('viewer.long-description') }}
          </h1>
        </v-card-title>

        <v-card-text>
          <MarkdownView :content="project.long_description" />
        </v-card-text>
      </v-card-item>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { Project } from '../../types';
import MarkdownView from '../MarkdownView.vue';

defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});
</script>

<style scoped>
.fit-content {
  width: fit-content;
}
</style>
