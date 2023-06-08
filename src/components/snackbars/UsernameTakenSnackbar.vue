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

<script lang="ts">
import { defineComponent } from 'vue';
import { useGlobalStore } from '../../stores/global';

export default defineComponent({
    data() {
        return {
          globalStore: useGlobalStore()
        };
    },
});
</script>

<style scoped></style>
