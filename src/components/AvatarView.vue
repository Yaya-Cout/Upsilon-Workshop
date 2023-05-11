<template>
  <VAvatar>
    <div v-html="svg" />
  </VAvatar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { toSvg } from "jdenticon";

export default defineComponent({
  name: 'AvatarView',
  props: {
    username: {
      type: String,
      required: true,
    },
  },
  computed: {
    svg(): string {
      let svg = toSvg(this.username, 100);
      // Ensure that the SVG is not larger than the avatar
      svg = svg.replace('width="100"', 'width="50"');
      svg = svg.replace('height="100"', 'height="50"');
      return svg;
    },
  },
});
</script>

<style scoped>
</style>
