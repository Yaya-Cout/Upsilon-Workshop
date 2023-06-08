<template>
  <v-snackbar v-model="globalStore.projectDeleted">
    <span>
      {{ $t('snackbar.project-deleted.message') }}
    </span>
    <template #actions>
      <v-btn
        color="success"
        variant="text"
        @click="globalStore.projectDeleted = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
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
});
</script>

<style scoped></style>
