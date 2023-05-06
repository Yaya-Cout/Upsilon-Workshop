<template>
  <div @click="save">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Project } from '../types';
import { useAPIStore } from '../stores/api';
import { useGlobalStore } from '../stores/global';

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
      globalStore: useGlobalStore(),
    };
  },
  methods: {
    save() {
      this.api.updateProject(this.project).then(() => {
        this.globalStore.scriptSaved = true;
      }).catch((error) => {
        this.globalStore.error = true;
        console.error(error);
      });
    },
  },

});
</script>

<style scoped></style>
