<template>
  <span>
    {{ human_readable_weight }}
    <v-tooltip
      activator="parent"
    >
      {{ hover_weight }}
    </v-tooltip>
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useCalculatorStore } from '../../stores/calculator';
import { Project } from '../../types';

const { locale } = useI18n();
const calculatorStore = useCalculatorStore();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

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
.fit-content {
  width: fit-content;
}
</style>
