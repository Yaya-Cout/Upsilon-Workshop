<!-- This manager manage the loading of don't show delete confirm -->
<template>
  <div />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
  data() {
    return {
      globalStore: useGlobalStore(),
    };
  },
  watch: {
    "globalStore.showDeleteConfirm": {
      handler() {
        if (this.globalStore.showDeleteConfirm) {
          localStorage.removeItem('dontShowDeleteConfirm');
        } else {
          localStorage.setItem('dontShowDeleteConfirm', 'true');
        }
      },
    },
  },
  mounted() {
    this.globalStore.showDeleteConfirm = localStorage.getItem('dontShowDeleteConfirm') !== 'true';
  },
});
</script>

<style scoped></style>
