<template>
  <v-dialog
    v-model="dialog"
    max-width="290"
  >
    <template #activator="{ props }">
      <div v-bind="props">
        <slot />
      </div>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('disconnect-confirm.disconnect') }}
      </v-card-title>

      <v-card-text>{{ $t('disconnect-confirm.description') }}</v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          @click="dialog = false"
        >
          {{ $t('disconnect-confirm.cancel') }}
        </v-btn>

        <v-btn
          color="error"
          @click="disconnect"
        >
          {{ $t('disconnect-confirm.disconnect') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAPIStore } from '../../stores/api';
import { useGlobalStore } from '../../stores/global';

const dialog = ref(false);
const api = useAPIStore().api;
const globalStore = useGlobalStore();

const disconnect = () => {
  api.logout();
  dialog.value = false;
  globalStore.success = "snackbar.success.logout.message"
}
</script>

<style scoped></style>
