<template>
  <div v-html="markdown" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import showdown from 'showdown';
import xssFilter from 'showdown-xss-filter';

const converter = new showdown.Converter({
  extensions: [xssFilter],
});

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
});

const markdown = computed(() => converter.makeHtml(props.content));
</script>

<style scoped></style>
