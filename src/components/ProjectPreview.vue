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
            <v-card-subtitle>
              <v-icon small>
                mdi-content-save
              </v-icon>
              {{ human_readable_weight }}
              <v-tooltip
                activator="parent"
              >
                {{ hover_weight }}
              </v-tooltip>
            </v-card-subtitle>
            <v-card-item>
              <v-chip
                v-for="tag in tagsNames"
                :key="tag"
                class="mx-1"
              >
                {{ tag.replace('%20',' ') }}
              </v-chip>
            </v-card-item>
          </div>
        </div>
      </v-skeleton-loader>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculatorStore } from '../stores/calculator';
import { Project } from '../types';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

const tagsNames = ref(["test"] as string[]);

const { locale } = useI18n();
const calculatorStore = useCalculatorStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true
  }
});

watch(props.project, async (project: Project) => {
  let NewTagsNames: string[] = [];
  for (const tag of project.tags) {
    NewTagsNames.push(await tag.name);
  }
  tagsNames.value = NewTagsNames;
}, { immediate: true });

const weight = computed(() => {
  let weight = 0;
  for (const file in props.project.files) {
    weight += props.project.files[file].title.length;
    weight += props.project.files[file].content.length;
  }
  return weight;
});

const human_readable_weight = computed(() => {
  let human_readable_weight = "";
  if (weight.value < 1000) {
    human_readable_weight = weight.value + " ";
  } else if (weight.value < 1000000) {
    human_readable_weight = (weight.value / 1000).toFixed(2) + " K";
  }
  if (locale.value == "fr") {
    human_readable_weight += "o";
  } else {
    human_readable_weight += "B";
  }

  if (percentage.value != -1) {
    human_readable_weight += " (" + percentage.value + "%)";
  }

  return human_readable_weight;
});

const hover_weight = computed(() => {
  let hover_weight = "";
  if (weight.value < 1000) {
    hover_weight = weight.value + " ";
  } else if (weight.value < 1000000) {
    hover_weight = (weight.value / 1000).toFixed(2) + " K";
  }
  if (locale.value == "fr") {
    hover_weight = hover_weight + " octets";
  } else {
    hover_weight = hover_weight + " bytes";
  }

  if (percentage.value != -1) {
    hover_weight = hover_weight + " (" + percentage.value + "%)";
  }

  return hover_weight;
});

const percentage = computed(() => {
  if (calculatorStore.storageSize == -1) {
    return -1;
  } else {
    return Math.round(weight.value / calculatorStore.storageSize * 100);
  }
});
</script>

<style scoped>
.project-preview {
  min-width: 300px;
  max-width: 0px;
}
</style>
