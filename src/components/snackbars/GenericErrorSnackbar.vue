<template>
  <v-snackbar v-model="visible">
    <span>
      {{ $t(lastMessage) }}
    </span>
    <template #actions>
      <v-btn
        color="error"
        variant="text"
        @click="globalStore.error = false"
      >
        {{ $t('snackbar.close') }}
      </v-btn>
    </template>
  </v-snackbar>
</template>

<script setup lang="ts">
import { watchEffect, ref, computed } from 'vue';
import { useGlobalStore } from '../../stores/global';

const globalStore = useGlobalStore();

const lastMessage = ref("snackbar.error.generic-message");

watchEffect(() => {
  // If the error is a string, set the last message to that string
  if (typeof globalStore.error === 'string') {
    lastMessage.value = globalStore.error;
  }

  // If the value is true, set the last message to the default error message
  if (globalStore.error === true) {
    lastMessage.value = "snackbar.error.generic-message";
  }
});

const visible = computed({
  get() : boolean {
    return globalStore.error !== false;
  },
  set(value: boolean) {
    globalStore.error = value;
  },
});
</script>

<style scoped></style>
