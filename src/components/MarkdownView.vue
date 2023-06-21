<template>
  <div ref="markdown" />
</template>

<script lang="ts">
import showdown from 'showdown';
import xssFilter from 'showdown-xss-filter';
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    content: {
      type: String,
      default: '',
    },
  },
  watch: {
    content: {
      handler() {
        this.renderMarkdown();
      },
    },
  },
  mounted() {
    this.renderMarkdown();
  },
  methods: {
    renderMarkdown() {
      //@ts-ignore
      this.$refs.markdown.innerHTML = new showdown.Converter(
        {
          extensions: [xssFilter],
        }
      ).makeHtml(
        this.content!
      );
    },
  },
});
</script>

<style scoped></style>
