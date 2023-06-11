<template>
  <v-snackbar v-model="globalStore.error">
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
  data() {
    return {
      globalStore: useGlobalStore(),
      lastMessage: "snackbar.error.generic-message",
    };
  },
  watch: {
    "globalStore.error": function () {
      // If the error is a string, set the last message to that string
      if (typeof this.globalStore.error === 'string') {
        this.lastMessage = this.globalStore.error;
      }

      // If the value is true, set the last message to the default error message
      if (this.globalStore.error === true) {
        this.lastMessage = "snackbar.error.generic-message";
      }
    },
  }
});
</script>

<style scoped></style>
