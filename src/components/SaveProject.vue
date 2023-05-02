<template>
  <div @click="save">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Project } from '../types';
import { useAPIStore } from '../stores/api';

export default defineComponent({
  props: {
    project: {
      type: Object as PropType<Project>,
      required: true,
    },
  },
  data() {
    return {
      api: useAPIStore().api,
    };
  },
  methods: {
    save() {
      this.api.updateProject(this.project);
    },
  },

});
</script>

<style scoped></style>
