<template>
  <VAvatar>
    <span v-html="svg" />
  </VAvatar>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { toSvg } from "jdenticon";

const props = defineProps({
  username: {
    type: String,
    required: true,
  },
});

const svg = computed(() => {
  let svg = toSvg(props.username, 100);
  // Ensure that the SVG is not larger than the avatar
  svg = svg.replace('width="100"', 'width="100%"');
  svg = svg.replace('height="100"', 'height="100%"');
  return svg;
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
