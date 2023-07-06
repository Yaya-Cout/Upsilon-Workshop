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

<script setup lang="ts">
import { useAPIStore } from '../../stores/api';

const apiStore = useAPIStore();
</script>

<style scoped></style>
