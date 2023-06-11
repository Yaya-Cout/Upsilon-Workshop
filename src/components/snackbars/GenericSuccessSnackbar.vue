<template>
  <v-snackbar v-model="globalStore.success">
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

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
  data() {
      return {
          globalStore: useGlobalStore(),
          lastMessage: "snackbar.success.generic-message",
      };
  },
  watch: {
    "globalStore.success": function() {
      // If the success is a string, set the last message to that string
      if (typeof this.globalStore.success === 'string') {
        this.lastMessage = this.globalStore.success;
      }

      // If the value is true, set the last message to the default success message
      if (this.globalStore.success === true) {
        this.lastMessage = "snackbar.success.generic-message";
      }
    },
  }
});
</script>

<style scoped></style>
