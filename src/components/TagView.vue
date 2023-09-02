<template>
  <v-skeleton-loader
    v-if="!tag._loaded"
    type="text"
  />
  <v-chip
    v-else
    class="mx-1 my-1"
  >
    {{ name }}
  </v-chip>
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue';
import { Tag } from '../types';
import { VSkeletonLoader } from 'vuetify/lib/labs/components.mjs';

const props = defineProps({
  tag: {
    type: Object as () => Tag,
    required: true
  }
});

const name = ref("");

watchEffect(async () => {
  name.value = await props.tag.name;
});
</script>

<style scoped></style>
