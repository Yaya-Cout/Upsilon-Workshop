<template>
  <v-snackbar v-model="apiStore.notLoggedInError">
    <span>
      {{ $t('app.not-logged-in-snackbar') }}
    </span>
    <template #actions>
      <v-btn
        color="error"
        variant="text"
        @click="apiStore.notLoggedInError = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../../stores/api';

export default defineComponent({
  data() {
    return {
      apiStore: useAPIStore(),
    };
  },
});
</script>

<style scoped></style>
