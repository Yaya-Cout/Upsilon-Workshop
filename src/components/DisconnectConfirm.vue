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
        Disconnect
      </v-card-title>

      <v-card-text>Are you sure you want to disconnect?</v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          @click="dialog = false"
        >
          Cancel
        </v-btn>

        <v-btn
          color="error"
          @click="disconnect"
        >
          OK
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAPIStore } from '../stores/api';

export default defineComponent({
  name: 'DisconnectConfirm',
  data() {
    return {
      dialog: false,
      api: useAPIStore().api,
    };
  },
  methods: {
    disconnect() {
      this.api.logout();
      this.dialog = false;
    },
  },
});
</script>

<style scoped></style>
