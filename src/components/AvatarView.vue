<template>
  <VAvatar>
    <span v-html="svg" />
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
      svg = svg.replace('width="100"', 'width="100%"');
      svg = svg.replace('height="100"', 'height="100%"');
      return svg;
    },
  },
});
</script>

<style scoped>
span {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 40px;
}
</style>
