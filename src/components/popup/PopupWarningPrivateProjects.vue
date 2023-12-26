<template>
  <v-dialog
    v-model="apiStore.warning_private_projects"
    max-width="500"
  >
    <v-card>
      <v-card-title class="headline">
        {{ $t('popups.warning-private-projects.title') }}
      </v-card-title>

      <v-card-text>{{ $t('popups.warning-private-projects.description') }}</v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn
          color="error"
          @click="apiStore.api.updatePrivateProjectsWarning(false)"
        >
          {{ $t('popups.warning-private-projects.done') }}
        </v-btn>

        <v-btn
          color="primary"
          @click="apiStore.warning_private_projects = false"
        >
          {{ $t('popups.warning-private-projects.dismiss') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useAPIStore } from '../../stores/api';

const { t: $t } = useI18n();
const apiStore = useAPIStore();
</script>

<style scoped></style>
