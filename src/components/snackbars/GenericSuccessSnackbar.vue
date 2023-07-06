<template>
  <v-snackbar v-model="visible">
    <span>
      {{ $t(lastMessage) }}
    </span>
    <template #actions>
      <v-btn
        color="success"
        variant="text"
        @click="globalStore.success = false"
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

const lastMessage = ref("snackbar.success.generic-message");

watchEffect(() => {
  // If the success is a string, set the last message to that string
  if (typeof globalStore.success === 'string') {
    lastMessage.value = globalStore.success;
  }

  // If the value is true, set the last message to the default success message
  if (globalStore.success === true) {
    lastMessage.value = "snackbar.success.generic-message";
  }
});

const visible = computed({
  get() : boolean {
    return globalStore.success !== false;
  },
  set(value: boolean) {
    globalStore.success = value;
  },
});
</script>

<style scoped></style>
