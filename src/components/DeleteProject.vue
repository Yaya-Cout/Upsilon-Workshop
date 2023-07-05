<template>
  <v-dialog
    v-if="hasWriteAccess"
    v-model="dialog"
    max-width="290"
  >
    <template #activator="{ props: attrs }">
      <span
        v-bind="attrs"
      >
        <slot />
      </span>
    </template>
    <v-card>
      <v-card-title class="headline">
        {{ $t('viewer.delete-project.title') }}
      </v-card-title>

      <v-card-text>
        {{ $t('viewer.delete-project.message', { name: project.title }) }}
      </v-card-text>

      <v-card-actions>
        <v-spacer />

        <v-btn @click="dialog = false">
          {{ $t('viewer.delete-project.cancel') }}
        </v-btn>
        <br>

        <v-btn
          color="error"
          @click="deleteFromAPI"
        >
          {{ $t('viewer.delete-project.delete') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useGlobalStore } from '../stores/global';
import { useAPIStore } from '../stores/api';
import { Project } from '../types';
const { t: $t } = useI18n();

const props = defineProps({
  project: {
    type: Object as () => Project,
    required: true,
  },
});

const globalStore = useGlobalStore();
const apiStore = useAPIStore();
const $router = useRouter();
const api = useAPIStore().api;

const dialog = ref(false);

const deleteFromAPI = async () => {
  globalStore.progress = true;
  try {
    await api.deleteProject(props.project);
    $router.push('/');
    globalStore.success = "snackbar.success.project-deleted.message";
  } catch (e) {
    globalStore.error = true;
    console.error(e);
  }
  globalStore.progress = false;
};

const hasWriteAccess = computed(() => {
  // Get if the user is the owner of the project
  if (props.project.author === apiStore.username && apiStore.username !== '') {
    return true;
  }
  return false;
});
</script>

<style scoped></style>
