<template>
  <v-snackbar v-model="api.NOT_LOGGED_IN_ERROR">
    <span>
      {{ $t('app.not-logged-in-snackbar') }}
    </span>
    <template #actions>
      <v-btn
        color="error"
        variant="text"
        @click="api.NOT_LOGGED_IN_ERROR = false"
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
            api: useAPIStore().api,
        };
    },
});
</script>

<style scoped></style>
