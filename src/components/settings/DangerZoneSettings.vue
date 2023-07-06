<template>
  <v-card class="mb-4 bg-red-lighten-4">
    <v-card-title>{{ $t('settings.danger-zone.title') }}</v-card-title>
    <v-card-text>
      {{ $t('settings.danger-zone.delete-account.description') }}
    </v-card-text>
    <v-card-actions>
      <v-spacer />

      <DeleteAccountConfirm>
        <v-btn color="error">
          {{ $t('settings.danger-zone.delete-account.delete') }}
        </v-btn>
      </DeleteAccountConfirm>
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import DeleteAccountConfirm from '../confirmations/DeleteAccountConfirm.vue';
</script>

<style scoped></style>
