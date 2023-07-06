<template>
  <v-snackbar v-model="globalStore.usernameTaken">
    <span>
      {{ $t('snackbar.username-taken.message') }}
    </span>
    <template #actions>
      <v-btn
        color="error"
        variant="text"
        @click="globalStore.usernameTaken = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { useGlobalStore } from '../../stores/global';

const globalStore = useGlobalStore();
</script>

<style scoped></style>
